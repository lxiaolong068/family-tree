// 关系类型枚举
export enum RelationType {
  PARENT = 'parent',       // 父母
  CHILD = 'child',         // 子女
  SPOUSE = 'spouse',       // 配偶
  SIBLING = 'sibling',     // 兄弟姐妹
  OTHER = 'other'          // 其他关系
}

// 关系接口
export interface Relationship {
  type: RelationType;      // 关系类型
  targetId: string;        // 关系目标成员ID
  description?: string;    // 关系描述（如"养父"、"继母"等）
}

// 家谱成员接口
export interface Member {
  id: string;
  name: string;
  relation: string;        // 与根成员的关系描述（向后兼容）
  parentId?: string;       // 父节点ID（向后兼容）
  birthDate?: string;      // 出生日期
  deathDate?: string;      // 死亡日期
  birthPlace?: string;     // 出生地点
  gender?: 'male' | 'female' | 'other'; // 性别
  description?: string;    // 描述信息
  relationships?: Relationship[]; // 与其他成员的关系
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

// 保存家谱后的返回结果
export interface SaveFamilyTreeResult {
  id: number;
  isUpdate?: boolean;
  success?: boolean;
}
