// 家谱成员接口
export interface Member {
  id: string;
  name: string;
  relation: string;
  parentId?: string; // 父节点ID，用于构建家谱关系
  birthDate?: string; // 出生日期
  deathDate?: string; // 死亡日期
  gender?: 'male' | 'female' | 'other'; // 性别
  description?: string; // 描述信息
}

// 家谱数据接口
export interface FamilyTree {
  members: Member[];
  rootId?: string; // 根节点ID，通常是家谱中最早的祖先
  name?: string; // 家谱名称
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}

// 家谱图表类型
export type FamilyTreeChartType = 'ancestry' | 'descendants' | 'full';
