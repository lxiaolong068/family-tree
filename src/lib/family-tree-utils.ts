import { Member, FamilyTree, FamilyTreeChartType, SaveFamilyTreeResult } from '@/types/family-tree';
import { db } from '@/db';
import { familyTrees, members } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Generate Mermaid.js chart definition
 * @param members Family tree member array
 * @param chartType Chart type
 * @param rootId Root node ID (optional)
 * @returns Mermaid.js chart definition string
 */
export function generateMermaidChart(
  members: Member[],
  chartType: FamilyTreeChartType = 'full',
  rootId?: string
): string {
  if (!members.length) {
    return 'graph TD\n  EmptyNode["No family tree data yet"]';
  }

  // Find root node
  let root: Member | undefined;
  if (rootId) {
    root = members.find(m => m.id === rootId);
  } else {
    // If no root node is specified, find a member without a parent node as the root node
    root = members.find(m => !m.parentId);
  }

  // If no root node is found, use the first member as the root node
  if (!root && members.length > 0) {
    root = members[0];
  }

  // If there is still no root node, return an empty chart
  if (!root) {
    return 'graph TD\n  EmptyNode["No family tree data yet"]';
  }

  // Start building chart definition
  let chartDef = 'flowchart TD\n';

  // Add node definitions
  members.forEach(member => {
    // Use shapes instead of classes to distinguish gender
    const shape = member.gender === 'male' ? '([' : '((';
    const endShape = member.gender === 'male' ? '])' : '))';
    chartDef += `  ${member.id}${shape}${member.name}${endShape}\n`;
  });

  // Add connection definitions
  members.forEach(member => {
    if (member.parentId) {
      const parent = members.find(m => m.id === member.parentId);
      if (parent) {
        chartDef += `  ${parent.id} --> ${member.id}\n`;
      }
    }
  });

  return chartDef;
}

/**
 * 生成唯一ID
 * @returns 唯一ID字符串
 */
export function generateUniqueId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * 构建家谱关系
 * 根据成员的关系字段（如"父亲"、"母亲"、"儿子"、"女儿"）自动设置parentId
 * @param members 家谱成员数组
 * @returns 更新后的家谱成员数组
 */
export function buildFamilyRelations(members: Member[]): Member[] {
  // 复制成员数组，避免修改原数组
  const updatedMembers = [...members];

  // 这里我们直接使用硬编码的关系，不需要映射表

  // 遍历所有成员，尝试建立关系
  updatedMembers.forEach((member, i) => {
    // 如果已经有parentId，则跳过
    if (member.parentId) return;

    const relation = member.relation.trim();

    // 检查是否是子女关系
    if (['儿子', '女儿', '孩子'].includes(relation)) {
      // 查找可能的父母
      const possibleParents = updatedMembers.filter(
        (m, idx) => idx !== i && ['父亲', '母亲'].includes(m.relation.trim())
      );

      if (possibleParents.length > 0) {
        // 设置第一个找到的父母为父节点
        member.parentId = possibleParents[0].id;
      }
    }
  });

  return updatedMembers;
}

/**
 * 创建新的家谱
 * @returns 新的家谱对象
 */
export function createNewFamilyTree(): FamilyTree {
  return {
    members: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * 添加新成员到家谱
 * @param familyTree 家谱对象
 * @param member 新成员
 * @returns 更新后的家谱对象
 */
export function addMemberToFamilyTree(familyTree: FamilyTree, member: Partial<Member>): FamilyTree {
  const newMember: Member = {
    id: generateUniqueId(),
    name: member.name || '',
    relation: member.relation || '',
    parentId: member.parentId,
    gender: member.gender,
    birthDate: member.birthDate,
    deathDate: member.deathDate,
    description: member.description
  };

  return {
    ...familyTree,
    members: [...familyTree.members, newMember],
    updatedAt: new Date().toISOString()
  };
}

/**
 * 保存家谱到本地存储（仅作为数据库不可用时的备份）
 * @param familyTree 家谱对象
 * @param key 存储键名
 */
export function saveFamilyTreeToLocalStorage(familyTree: FamilyTree, key: string = 'familyTree'): void {
  // 确保只在客户端环境中使用localStorage
  if (typeof window === 'undefined') {
    console.warn('无法在服务器端使用localStorage');
    return;
  }
  
  try {
    localStorage.setItem(key, JSON.stringify(familyTree));
  } catch (error: unknown) {
    console.error('保存家谱到本地存储失败:', error instanceof Error ? error.message : String(error));
  }
}

/**
 * 从本地存储加载家谱（仅作为数据库不可用时的备份）
 * @param key 存储键名
 * @returns 家谱对象，如果不存在则返回新的家谱
 */
export function loadFamilyTreeFromLocalStorage(key: string = 'familyTree'): FamilyTree {
  // 确保只在客户端环境中使用localStorage
  if (typeof window === 'undefined') {
    console.warn('无法在服务器端使用localStorage');
    return createNewFamilyTree();
  }
  
  try {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      return JSON.parse(storedData) as FamilyTree;
    }
  } catch (error: unknown) {
    console.error('从本地存储加载家谱失败:', error instanceof Error ? error.message : String(error));
  }
  
  // 如果没有找到或解析失败，返回一个新的家谱
  return createNewFamilyTree();
}

/**
 * 保存家谱到Neon数据库（主要存储方式）
 * @param familyTree 家谱对象
 * @returns 保存的家谱结果
 */
export async function saveFamilyTreeToDatabase(familyTree: FamilyTree): Promise<SaveFamilyTreeResult | null> {
  // 获取认证令牌
  const authToken = localStorage.getItem('authToken');
  console.log('Auth token available:', authToken ? 'yes' : 'no');

  try {
    console.log('Starting to save family tree to database:', {
      membersCount: familyTree.members.length,
      name: familyTree.name,
      rootId: familyTree.rootId,
    });

    // 调用API保存家谱
    const response = await fetch('/api/save-family-tree', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
      },
      body: JSON.stringify({ familyTree })
    });

    const data = await response.json();

    // 检查是否需要认证
    if (response.status === 401 && data.requireAuth) {
      // 返回特殊错误，表示需要认证
      throw new Error('AUTH_REQUIRED');
    }

    if (!response.ok) {
      throw new Error(data.error || 'Failed to save family tree');
    }

    return data.familyTreeId;
  } catch (error) {
    console.error('Failed to save family tree to database:', error);
    throw error; // 抛出错误，让调用者处理
  }
}

/**
 * Load family tree from database (primary storage method)
 * @param familyTreeId Family tree ID
 * @returns Family tree object, or null if it doesn't exist
 */
export async function loadFamilyTreeFromDatabase(familyTreeId: number): Promise<FamilyTree | null> {
  // 如果数据库连接不可用，尝试从本地存储加载
  if (!db) {
    console.warn('数据库连接不可用，尝试从本地存储加载');
    return loadFamilyTreeFromLocalStorage();
  }

  try {
    console.log('Loading family tree from database, ID:', familyTreeId);

    // Get family tree information
    const familyTreeData = await db.select().from(familyTrees)
      .where(eq(familyTrees.id, familyTreeId));

    console.log('Family tree data retrieved:', familyTreeData);

    if (familyTreeData.length === 0) {
      console.warn('No family tree found with ID:', familyTreeId);
      return null;
    }

    // 获取家谱成员
    // 直接使用数字ID，与数据库模式匹配
    console.log('使用ID查询家谱成员:', familyTreeId);
    const membersData = await db.select().from(members)
      .where(eq(members.familyTreeId, familyTreeId));

    console.log('Members data retrieved:', membersData);

    // Build family tree object
    const familyTree: FamilyTree = {
      members: membersData.map(m => ({
        id: m.id,
        name: m.name,
        relation: m.relation,
        parentId: m.parentId || undefined,
        birthDate: m.birthDate || undefined,
        deathDate: m.deathDate || undefined,
        gender: m.gender as 'male' | 'female' | 'other' | undefined,
        description: m.description || undefined,
      })),
      name: familyTreeData[0].name || undefined,
      rootId: familyTreeData[0].rootId || undefined,
      createdAt: familyTreeData[0].createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: familyTreeData[0].updatedAt?.toISOString() || new Date().toISOString(),
    };

    console.log('Built family tree object with members count:', familyTree.members.length);
    return familyTree;
  } catch (error: unknown) {
    console.error('从数据库加载家谱失败:', error instanceof Error ? error.message : String(error));
    return null;
  }
}

/**
 * Get all family trees for a user
 * @param userId User ID
 * @returns List of family trees
 */
export async function getUserFamilyTrees(userId: string): Promise<{ id: number, name: string | null }[]> {
  // If database connection is unavailable, return empty array
  if (!db) {
    console.warn('Database connection unavailable, cannot get user family trees');
    return [];
  }

  try {
    const result = await db.select({
      id: familyTrees.id,
      name: familyTrees.name,
    }).from(familyTrees)
      .where(eq(familyTrees.userId, userId));
      
    // 确保结果中的name字段不为null，如果为null则提供默认值
    return result.map(item => ({
      id: item.id,
      name: item.name || `家谱 #${item.id}` // 提供默认名称
    }));
  } catch (error: unknown) {
    console.error('获取用户家谱列表失败:', error instanceof Error ? error.message : String(error));
    return [];
  }
}
