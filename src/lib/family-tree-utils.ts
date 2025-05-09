import { Member, FamilyTree, FamilyTreeChartType, SaveFamilyTreeResult, RelationType, Relationship } from '@/types/family-tree';
import { db } from '@/db';
import { familyTrees, members } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { checkRelationshipConflict, RelationshipConflictType } from './relationship-validator';

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

  // Start building chart definition with advanced layout options
  let chartDef = '%%{init: { "flowchart": { "curve": "basis", "htmlLabels": true } } }%%\n';
  chartDef += 'flowchart TD\n';

  // Define node classes for different genders
  chartDef += '  %% Node style classes\n';
  chartDef += '  classDef male fill:#e6f7ff,stroke:#1890ff,stroke-width:2px\n';
  chartDef += '  classDef female fill:#fff0f6,stroke:#eb2f96,stroke-width:2px\n';
  chartDef += '  classDef other fill:#f6ffed,stroke:#52c41a,stroke-width:2px\n';
  chartDef += '  classDef root fill:#fff7e6,stroke:#fa8c16,stroke-width:3px,stroke-dasharray: 5 5\n\n';

  // Add node definitions
  members.forEach(member => {
    // Use shapes instead of classes to distinguish gender
    const shape = member.gender === 'male' ? '([' : '((';
    const endShape = member.gender === 'male' ? '])' : '))';

    // Add birth and death dates if available
    let displayName = member.name;
    if (member.birthDate || member.deathDate) {
      displayName += '<br>';
      if (member.birthDate) {
        displayName += `b. ${member.birthDate}`;
      }
      if (member.deathDate) {
        displayName += member.birthDate ? ` - d. ${member.deathDate}` : `d. ${member.deathDate}`;
      }
    }

    chartDef += `  ${member.id}${shape}${displayName}${endShape}\n`;

    // Apply gender-specific class
    if (member.gender === 'male') {
      chartDef += `  class ${member.id} male\n`;
    } else if (member.gender === 'female') {
      chartDef += `  class ${member.id} female\n`;
    } else {
      chartDef += `  class ${member.id} other\n`;
    }

    // Mark root node with special style
    if (member.id === root?.id) {
      chartDef += `  class ${member.id} root\n`;
    }
  });

  // Track relationship edges for styling
  const relationshipEdges: { id: string, type: RelationType, description?: string }[] = [];
  let edgeCounter = 0;

  // Add connection definitions for parent-child relationships
  members.forEach(member => {
    // 处理传统的parentId关系
    if (member.parentId) {
      const parent = members.find(m => m.id === member.parentId);
      if (parent) {
        const edgeId = `edge${edgeCounter++}`;
        chartDef += `  ${parent.id} -->|Parent| ${member.id}\n`;
        relationshipEdges.push({ id: edgeId, type: RelationType.PARENT });
      }
    }

    // 处理新的relationships关系
    if (member.relationships && member.relationships.length > 0) {
      member.relationships.forEach(rel => {
        const target = members.find(m => m.id === rel.targetId);
        if (target) {
          const edgeId = `edge${edgeCounter++}`;
          // 显示关系描述（如果有）
          const relationLabel = rel.description
            ? `|${getRelationshipLabel(rel.type)}: ${rel.description}|`
            : `|${getRelationshipLabel(rel.type)}|`;

          // 根据关系类型使用不同的连接样式
          switch (rel.type) {
            case RelationType.PARENT:
              // 父母关系：目标 --> 成员
              chartDef += `  ${rel.targetId} -->${relationLabel} ${member.id}\n`;
              break;
            case RelationType.CHILD:
              // 子女关系：成员 --> 目标
              chartDef += `  ${member.id} -->${relationLabel} ${rel.targetId}\n`;
              break;
            case RelationType.SPOUSE:
              // 配偶关系：使用虚线连接
              chartDef += `  ${member.id} -..->${relationLabel} ${rel.targetId}\n`;
              break;
            case RelationType.SIBLING:
              // 兄弟姐妹关系：使用点线连接
              chartDef += `  ${member.id} -.-${relationLabel} ${rel.targetId}\n`;
              break;
            default:
              // 其他关系：使用普通线条
              chartDef += `  ${member.id} ---${relationLabel} ${rel.targetId}\n`;
          }

          relationshipEdges.push({ id: edgeId, type: rel.type, description: rel.description });
        }
      });
    }
  });

  // Add link styles for different relationship types
  chartDef += '\n  %% Relationship style definitions\n';
  chartDef += '  linkStyle default stroke:#333,stroke-width:1px\n';

  // Group edges by type for styling
  const parentEdges: number[] = [];
  const childEdges: number[] = [];
  const spouseEdges: number[] = [];
  const siblingEdges: number[] = [];
  const otherEdges: number[] = [];

  relationshipEdges.forEach((edge, index) => {
    switch (edge.type) {
      case RelationType.PARENT:
        parentEdges.push(index);
        break;
      case RelationType.CHILD:
        childEdges.push(index);
        break;
      case RelationType.SPOUSE:
        spouseEdges.push(index);
        break;
      case RelationType.SIBLING:
        siblingEdges.push(index);
        break;
      default:
        otherEdges.push(index);
    }
  });

  // Apply styles to edge groups
  if (parentEdges.length > 0) {
    chartDef += `  linkStyle ${parentEdges.join(',')} stroke:#1890ff,stroke-width:2px\n`;
  }
  if (childEdges.length > 0) {
    chartDef += `  linkStyle ${childEdges.join(',')} stroke:#52c41a,stroke-width:2px\n`;
  }
  if (spouseEdges.length > 0) {
    chartDef += `  linkStyle ${spouseEdges.join(',')} stroke:#eb2f96,stroke-width:2px,stroke-dasharray: 5 5\n`;
  }
  if (siblingEdges.length > 0) {
    chartDef += `  linkStyle ${siblingEdges.join(',')} stroke:#722ed1,stroke-width:2px,stroke-dasharray: 3 3\n`;
  }
  if (otherEdges.length > 0) {
    chartDef += `  linkStyle ${otherEdges.join(',')} stroke:#faad14,stroke-width:1px\n`;
  }

  return chartDef;
}

/**
 * 获取关系类型的显示标签
 * @param type 关系类型
 * @returns 关系类型的显示标签
 */
function getRelationshipLabel(type: RelationType): string {
  switch (type) {
    case RelationType.PARENT:
      return 'Parent';
    case RelationType.CHILD:
      return 'Child';
    case RelationType.SPOUSE:
      return 'Spouse';
    case RelationType.SIBLING:
      return 'Sibling';
    default:
      return 'Other';
  }
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
    description: member.description,
    relationships: member.relationships || []
  };

  return {
    ...familyTree,
    members: [...familyTree.members, newMember],
    updatedAt: new Date().toISOString()
  };
}

/**
 * 添加关系到成员
 * @param familyTree 家谱对象
 * @param memberId 成员ID
 * @param relationship 关系对象
 * @returns 更新后的家谱对象和可能的冲突信息
 */
export function addRelationshipToMember(
  familyTree: FamilyTree,
  memberId: string,
  relationship: Relationship
): { familyTree: FamilyTree; conflict?: { type: string; message: string } } {
  // 检查关系冲突
  const conflictResult = checkRelationshipConflict(familyTree, memberId, relationship);
  if (conflictResult.hasConflict) {
    return {
      familyTree,
      conflict: {
        type: conflictResult.conflictType || 'unknown',
        message: conflictResult.message || 'Unknown conflict'
      }
    };
  }

  // 复制成员数组，避免修改原数组
  const updatedMembers = [...familyTree.members];

  // 查找成员
  const memberIndex = updatedMembers.findIndex(m => m.id === memberId);
  if (memberIndex === -1) {
    return {
      familyTree,
      conflict: {
        type: 'not_found',
        message: `Member with ID ${memberId} not found`
      }
    };
  }

  // 获取成员
  const member = updatedMembers[memberIndex];

  // 添加关系
  const relationships = member.relationships || [];

  // 检查是否已存在相同的关系
  const existingRelIndex = relationships.findIndex(
    r => r.targetId === relationship.targetId && r.type === relationship.type
  );

  if (existingRelIndex !== -1) {
    // 更新现有关系
    relationships[existingRelIndex] = {
      ...relationships[existingRelIndex],
      description: relationship.description
    };
  } else {
    // 添加新关系
    relationships.push({
      type: relationship.type,
      targetId: relationship.targetId,
      description: relationship.description
    });
  }

  // 更新成员
  updatedMembers[memberIndex] = {
    ...member,
    relationships
  };

  // 如果是父子关系，同时更新parentId字段（向后兼容）
  if (relationship.type === RelationType.PARENT) {
    updatedMembers[memberIndex].parentId = relationship.targetId;
  }

  // 如果是配偶或兄弟姐妹关系，需要在目标成员上也添加相应的关系（双向关系）
  if (
    relationship.type === RelationType.SPOUSE ||
    relationship.type === RelationType.SIBLING
  ) {
    const targetIndex = updatedMembers.findIndex(m => m.id === relationship.targetId);
    if (targetIndex !== -1) {
      const target = updatedMembers[targetIndex];
      const targetRelationships = target.relationships || [];

      // 检查目标成员是否已有相应的关系
      const existingTargetRelIndex = targetRelationships.findIndex(
        r => r.targetId === memberId && r.type === relationship.type
      );

      if (existingTargetRelIndex !== -1) {
        // 更新现有关系
        targetRelationships[existingTargetRelIndex] = {
          type: relationship.type,
          targetId: memberId,
          description: relationship.description
        };
      } else {
        // 添加新关系
        targetRelationships.push({
          type: relationship.type,
          targetId: memberId,
          description: relationship.description
        });
      }

      // 更新目标成员
      updatedMembers[targetIndex] = {
        ...target,
        relationships: targetRelationships
      };
    }
  }

  // 如果是子女关系，需要在目标成员上添加父母关系
  if (relationship.type === RelationType.CHILD) {
    const targetIndex = updatedMembers.findIndex(m => m.id === relationship.targetId);
    if (targetIndex !== -1) {
      const target = updatedMembers[targetIndex];
      const targetRelationships = target.relationships || [];

      // 检查目标成员是否已有相应的关系
      const existingTargetRelIndex = targetRelationships.findIndex(
        r => r.targetId === memberId && r.type === RelationType.PARENT
      );

      if (existingTargetRelIndex !== -1) {
        // 更新现有关系
        targetRelationships[existingTargetRelIndex] = {
          type: RelationType.PARENT,
          targetId: memberId,
          description: relationship.description
        };
      } else {
        // 添加新关系
        targetRelationships.push({
          type: RelationType.PARENT,
          targetId: memberId,
          description: relationship.description
        });
      }

      // 更新目标成员的parentId（向后兼容）
      updatedMembers[targetIndex] = {
        ...target,
        relationships: targetRelationships,
        parentId: memberId
      };
    }
  }

  return {
    familyTree: {
      ...familyTree,
      members: updatedMembers,
      updatedAt: new Date().toISOString()
    }
  };
}

/**
 * 批量添加关系到成员
 * @param familyTree 家谱对象
 * @param memberId 成员ID
 * @param relationships 关系对象数组
 * @returns 更新后的家谱对象和可能的冲突信息
 */
export function addRelationshipsToMember(
  familyTree: FamilyTree,
  memberId: string,
  relationships: Relationship[]
): { familyTree: FamilyTree; conflicts?: { type: string; message: string }[] } {
  // 如果没有关系要添加，直接返回原家谱
  if (!relationships || relationships.length === 0) {
    return { familyTree };
  }

  // 逐个添加关系，每次更新家谱
  let updatedFamilyTree = { ...familyTree };
  const conflicts: { type: string; message: string }[] = [];

  for (const relationship of relationships) {
    // 检查关系冲突
    const conflictResult = checkRelationshipConflict(updatedFamilyTree, memberId, relationship);

    if (conflictResult.hasConflict) {
      // 如果有冲突，记录冲突信息但继续处理其他关系
      conflicts.push({
        type: conflictResult.conflictType || 'unknown',
        message: conflictResult.message || 'Unknown conflict'
      });
    } else {
      // 如果没有冲突，添加关系
      const result = addRelationshipToMember(updatedFamilyTree, memberId, relationship);
      updatedFamilyTree = result.familyTree;

      // 如果添加过程中出现冲突（这种情况应该很少见），也记录下来
      if (result.conflict) {
        conflicts.push(result.conflict);
      }
    }
  }

  return {
    familyTree: updatedFamilyTree,
    conflicts: conflicts.length > 0 ? conflicts : undefined
  };
}

/**
 * 移除成员的关系
 * @param familyTree 家谱对象
 * @param memberId 成员ID
 * @param targetId 目标成员ID
 * @param relationType 关系类型
 * @returns 更新后的家谱对象
 */
export function removeRelationship(
  familyTree: FamilyTree,
  memberId: string,
  targetId: string,
  relationType: RelationType
): FamilyTree {
  // 复制成员数组，避免修改原数组
  const updatedMembers = [...familyTree.members];

  // 查找成员
  const memberIndex = updatedMembers.findIndex(m => m.id === memberId);
  if (memberIndex === -1) {
    throw new Error(`Member with ID ${memberId} not found`);
  }

  // 获取成员
  const member = updatedMembers[memberIndex];

  // 如果没有关系数组，直接返回
  if (!member.relationships || member.relationships.length === 0) {
    return familyTree;
  }

  // 移除关系
  const relationships = member.relationships.filter(
    r => !(r.targetId === targetId && r.type === relationType)
  );

  // 更新成员
  updatedMembers[memberIndex] = {
    ...member,
    relationships
  };

  // 如果是父子关系，同时更新parentId字段（向后兼容）
  if (relationType === RelationType.PARENT) {
    const { parentId, ...rest } = updatedMembers[memberIndex];
    updatedMembers[memberIndex] = rest;
  }

  // 如果是配偶或兄弟姐妹关系，需要在目标成员上也移除相应的关系（双向关系）
  if (
    relationType === RelationType.SPOUSE ||
    relationType === RelationType.SIBLING
  ) {
    const targetIndex = updatedMembers.findIndex(m => m.id === targetId);
    if (targetIndex !== -1) {
      const target = updatedMembers[targetIndex];
      if (target.relationships && target.relationships.length > 0) {
        // 移除目标成员上的关系
        const targetRelationships = target.relationships.filter(
          r => !(r.targetId === memberId && r.type === relationType)
        );

        // 更新目标成员
        updatedMembers[targetIndex] = {
          ...target,
          relationships: targetRelationships
        };
      }
    }
  }

  // 如果是子女关系，需要在目标成员上移除父母关系
  if (relationType === RelationType.CHILD) {
    const targetIndex = updatedMembers.findIndex(m => m.id === targetId);
    if (targetIndex !== -1) {
      const target = updatedMembers[targetIndex];
      if (target.relationships && target.relationships.length > 0) {
        // 移除目标成员上的关系
        const targetRelationships = target.relationships.filter(
          r => !(r.targetId === memberId && r.type === RelationType.PARENT)
        );

        // 更新目标成员
        updatedMembers[targetIndex] = {
          ...target,
          relationships: targetRelationships
        };

        // 如果parentId等于memberId，则移除parentId
        if (target.parentId === memberId) {
          const { parentId, ...rest } = updatedMembers[targetIndex];
          updatedMembers[targetIndex] = rest;
        }
      }
    }
  }

  return {
    ...familyTree,
    members: updatedMembers,
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
  try {
    console.log('Loading family tree from database, ID:', familyTreeId);

    // 获取认证令牌
    const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    if (!authToken) {
      console.warn('No authentication token available, cannot load family tree');
      throw new Error('AUTH_REQUIRED');
    }

    // 使用API路由获取家谱数据
    const response = await fetch(`/api/family-trees/${familyTreeId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    // 检查是否需要认证
    if (response.status === 401) {
      const data = await response.json();
      if (data.requireAuth) {
        throw new Error('AUTH_REQUIRED');
      }
    }

    // 检查其他错误
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to load family tree');
    }

    // 解析家谱数据
    const familyTree = await response.json();
    console.log('Successfully loaded family tree with members count:', familyTree.members.length);

    return familyTree;
  } catch (error: unknown) {
    console.error('从数据库加载家谱失败:', error instanceof Error ? error.message : String(error));

    // 如果是认证错误，直接抛出，让调用者处理
    if (error instanceof Error && error.message === 'AUTH_REQUIRED') {
      throw error;
    }

    return null;
  }
}

/**
 * Get all family trees for a user
 * @param userId User ID
 * @returns List of family trees
 */
export async function getUserFamilyTrees(userId: string): Promise<{ id: number, name: string | null }[]> {
  try {
    // 获取认证令牌
    const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    if (!authToken) {
      console.warn('No authentication token available, cannot get user family trees');
      return [];
    }

    // 使用API路由获取家谱列表
    const response = await fetch('/api/family-trees', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    // 检查是否需要认证
    if (response.status === 401) {
      console.warn('Authentication required to get user family trees');
      return [];
    }

    // 检查其他错误
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to get user family trees:', errorData.error);
      return [];
    }

    // 解析家谱列表数据
    const data = await response.json();
    return data.familyTrees || [];
  } catch (error: unknown) {
    console.error('获取用户家谱列表失败:', error instanceof Error ? error.message : String(error));
    return [];
  }
}
