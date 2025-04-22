import { Member, FamilyTree, FamilyTreeChartType } from '@/types/family-tree';
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
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(familyTree));
    console.log('Family tree saved to local storage as backup');
  }
}

/**
 * 从本地存储加载家谱（仅作为数据库不可用时的备份）
 * @param key 存储键名
 * @returns 家谱对象，如果不存在则返回新的家谱
 */
export function loadFamilyTreeFromLocalStorage(key: string = 'familyTree'): FamilyTree {
  if (typeof window !== 'undefined') {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      try {
        console.log('Loading family tree from local storage backup');
        return JSON.parse(storedData) as FamilyTree;
      } catch (error) {
        console.error('Failed to parse family tree data from local storage:', error);
      }
    }
  }
  return createNewFamilyTree();
}

/**
 * 保存家谱到Neon数据库（主要存储方式）
 * @param familyTree 家谱对象
 * @param userId 用户ID（可选）
 * @returns 保存的家谱ID
 */
export async function saveFamilyTreeToDatabase(familyTree: FamilyTree, userId?: string): Promise<number | null> {
  // 如果数据库连接不可用，则返回null
  if (!db) {
    console.warn('Database connection unavailable, cannot save family tree');
    // Save to local storage as backup
    saveFamilyTreeToLocalStorage(familyTree);
    return null;
  }

  try {
    console.log('Starting to save family tree to database:', {
      membersCount: familyTree.members.length,
      name: familyTree.name,
      rootId: familyTree.rootId,
      userId: userId
    });

    // Save or update family tree
    let familyTreeId: number;

    // Check if there is already a family tree ID in the URL
    let existingId: number | null = null;
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const idParam = urlParams.get('id');
      if (idParam) {
        existingId = parseInt(idParam);
        console.log('Retrieved family tree ID from URL parameter:', existingId);
      }
    }

    if (existingId) {
      // If there is an ID in the URL, use it directly to update
      familyTreeId = existingId;
      console.log('Updating existing family tree:', familyTreeId);

      try {
        await db.update(familyTrees)
          .set({
            rootId: familyTree.rootId,
            updatedAt: new Date(),
          })
          .where(eq(familyTrees.id, familyTreeId));

        console.log('Family tree table updated successfully');
      } catch (updateError) {
        console.error('Failed to update family tree table:', updateError);
        throw updateError;
      }

      try {
        // Delete old member records
        await db.delete(members).where(eq(members.familyTreeId, familyTreeId));
        console.log('Old members deleted successfully');
      } catch (deleteError) {
        console.error('Failed to delete old members:', deleteError);
        throw deleteError;
      }
    } else {
      // Check if this family tree already exists (by name and user ID)
      try {
        const existingFamilyTrees = await db.select().from(familyTrees)
          .where(eq(familyTrees.name, familyTree.name || 'Unnamed Family Tree'));

        console.log('Found existing family trees:', existingFamilyTrees.length);

        if (existingFamilyTrees.length > 0) {
          // Update existing family tree
          familyTreeId = existingFamilyTrees[0].id;
          console.log('Updating existing family tree:', familyTreeId);

          await db.update(familyTrees)
            .set({
              rootId: familyTree.rootId,
              updatedAt: new Date(),
            })
            .where(eq(familyTrees.id, familyTreeId));

          // Delete old member records
          await db.delete(members).where(eq(members.familyTreeId, familyTreeId));
        } else {
          // Create new family tree
          console.log('Creating new family tree');

          const result = await db.insert(familyTrees).values({
            name: familyTree.name || 'Unnamed Family Tree',
            rootId: familyTree.rootId,
            userId: userId,
            createdAt: new Date(),
            updatedAt: new Date(),
          }).returning({ id: familyTrees.id });

          console.log('New family tree created successfully:', result);
          familyTreeId = result[0].id;
        }
      } catch (queryError) {
        console.error('Failed to query or create family tree:', queryError);
        throw queryError;
      }
    }

    // Save members
    console.log('Starting to save members, count:', familyTree.members.length);

    try {
      for (const member of familyTree.members) {
        await db.insert(members).values({
          id: member.id,
          name: member.name,
          relation: member.relation,
          parentId: member.parentId,
          birthDate: member.birthDate,
          deathDate: member.deathDate,
          gender: member.gender,
          description: member.description,
          familyTreeId: familyTreeId.toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      console.log('All members saved successfully');
    } catch (memberError) {
      console.error('Failed to save members:', memberError);
      throw memberError;
    }

    console.log('Family tree saved successfully, ID:', familyTreeId);
    return familyTreeId;
  } catch (error) {
    console.error('Failed to save family tree to database:', error);
    throw error; // Throw the error instead of returning null, so the caller can see the specific error
  }
}

/**
 * Load family tree from database (primary storage method)
 * @param familyTreeId Family tree ID
 * @returns Family tree object, or null if it doesn't exist
 */
export async function loadFamilyTreeFromDatabase(familyTreeId: number): Promise<FamilyTree | null> {
  // If database connection is unavailable, try to load from local storage
  if (!db) {
    console.warn('Database connection unavailable, trying to load from local storage');
    return loadFamilyTreeFromLocalStorage();
  }

  try {
    // Get family tree information
    const familyTreeData = await db.select().from(familyTrees)
      .where(eq(familyTrees.id, familyTreeId));

    if (familyTreeData.length === 0) {
      return null;
    }

    // Get family tree members
    const membersData = await db.select().from(members)
      .where(eq(members.familyTreeId, familyTreeId));

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

    return familyTree;
  } catch (error) {
    console.error('Failed to load family tree from database:', error);
    return null;
  }
}

/**
 * Get all family trees for a user
 * @param userId User ID
 * @returns List of family trees
 */
export async function getUserFamilyTrees(userId: string): Promise<{ id: number, name: string }[]> {
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

    return result;
  } catch (error) {
    console.error('Failed to get user family trees:', error);
    return [];
  }
}
