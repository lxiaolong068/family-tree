import { Member, FamilyTree, FamilyTreeChartType } from '@/types/family-tree';

/**
 * 生成Mermaid.js图表定义
 * @param members 家谱成员数组
 * @param chartType 图表类型
 * @param rootId 根节点ID（可选）
 * @returns Mermaid.js图表定义字符串
 */
export function generateMermaidChart(
  members: Member[],
  chartType: FamilyTreeChartType = 'full',
  rootId?: string
): string {
  if (!members.length) {
    return 'graph TD\n  EmptyNode["暂无家谱数据"]';
  }

  // 查找根节点
  let root: Member | undefined;
  if (rootId) {
    root = members.find(m => m.id === rootId);
  } else {
    // 如果没有指定根节点，则查找没有父节点的成员作为根节点
    root = members.find(m => !m.parentId);
  }

  // 如果没有找到根节点，则使用第一个成员作为根节点
  if (!root && members.length > 0) {
    root = members[0];
  }

  // 如果仍然没有根节点，则返回空图表
  if (!root) {
    return 'graph TD\n  EmptyNode["暂无家谱数据"]';
  }

  // 开始构建图表定义
  let chartDef = 'flowchart TD\n';

  // 添加节点定义
  members.forEach(member => {
    // 使用形状而不是类来区分性别
    const shape = member.gender === 'male' ? '([' : '((';
    const endShape = member.gender === 'male' ? '])' : '))';
    chartDef += `  ${member.id}${shape}${member.name}${endShape}\n`;
  });

  // 添加连接定义
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
 * 保存家谱到本地存储
 * @param familyTree 家谱对象
 * @param key 存储键名
 */
export function saveFamilyTreeToLocalStorage(familyTree: FamilyTree, key: string = 'familyTree'): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(familyTree));
  }
}

/**
 * 从本地存储加载家谱
 * @param key 存储键名
 * @returns 家谱对象，如果不存在则返回新的家谱
 */
export function loadFamilyTreeFromLocalStorage(key: string = 'familyTree'): FamilyTree {
  if (typeof window !== 'undefined') {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      try {
        return JSON.parse(storedData) as FamilyTree;
      } catch (error) {
        console.error('Failed to parse family tree data:', error);
      }
    }
  }
  return createNewFamilyTree();
}
