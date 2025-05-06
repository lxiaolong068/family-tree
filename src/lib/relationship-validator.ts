import { Member, FamilyTree, RelationType, Relationship } from '@/types/family-tree';

/**
 * 关系冲突类型
 */
export enum RelationshipConflictType {
  SELF_REFERENCE = 'self_reference',         // 自引用关系
  DUPLICATE = 'duplicate',                   // 重复关系
  ROLE_CONFLICT = 'role_conflict',           // 角色冲突
  CYCLE = 'cycle',                           // 循环关系
  GENERATION_CONFLICT = 'generation_conflict' // 代际冲突
}

/**
 * 关系冲突结果
 */
export interface RelationshipConflictResult {
  hasConflict: boolean;
  conflictType?: RelationshipConflictType;
  message?: string;
}

/**
 * 检查关系是否有冲突
 * @param familyTree 家谱数据
 * @param memberId 成员ID
 * @param relationship 要添加的关系
 * @returns 冲突检查结果
 */
export function checkRelationshipConflict(
  familyTree: FamilyTree,
  memberId: string,
  relationship: Relationship
): RelationshipConflictResult {
  // 检查自引用
  if (memberId === relationship.targetId) {
    return {
      hasConflict: true,
      conflictType: RelationshipConflictType.SELF_REFERENCE,
      message: 'Cannot create a relationship with yourself'
    };
  }

  // 获取成员和目标成员
  const member = familyTree.members.find(m => m.id === memberId);
  const targetMember = familyTree.members.find(m => m.id === relationship.targetId);

  if (!member || !targetMember) {
    return {
      hasConflict: true,
      message: 'Member or target member not found'
    };
  }

  // 检查重复关系
  if (member.relationships) {
    const existingRelationship = member.relationships.find(
      r => r.targetId === relationship.targetId && r.type === relationship.type
    );

    if (existingRelationship) {
      return {
        hasConflict: true,
        conflictType: RelationshipConflictType.DUPLICATE,
        message: `This ${relationship.type} relationship already exists`
      };
    }
  }

  // 检查角色冲突
  const conflictResult = checkRoleConflict(familyTree, memberId, relationship);
  if (conflictResult.hasConflict) {
    return conflictResult;
  }

  // 检查循环关系
  if (relationship.type === RelationType.PARENT || relationship.type === RelationType.CHILD) {
    const cycleResult = checkRelationshipCycle(familyTree, memberId, relationship);
    if (cycleResult.hasConflict) {
      return cycleResult;
    }
  }

  return { hasConflict: false };
}

/**
 * 检查角色冲突
 * @param familyTree 家谱数据
 * @param memberId 成员ID
 * @param relationship 要添加的关系
 * @returns 冲突检查结果
 */
function checkRoleConflict(
  familyTree: FamilyTree,
  memberId: string,
  relationship: Relationship
): RelationshipConflictResult {
  const member = familyTree.members.find(m => m.id === memberId);
  const targetMember = familyTree.members.find(m => m.id === relationship.targetId);

  if (!member || !targetMember) {
    return { hasConflict: false };
  }

  // 获取现有关系
  const existingRelationships = member.relationships || [];
  
  // 检查父子关系冲突
  if (relationship.type === RelationType.PARENT) {
    // 检查目标是否已经是成员的子女
    const isTargetChild = existingRelationships.some(
      r => r.targetId === relationship.targetId && r.type === RelationType.CHILD
    );

    if (isTargetChild) {
      return {
        hasConflict: true,
        conflictType: RelationshipConflictType.ROLE_CONFLICT,
        message: 'Cannot set as parent: this member is already your child'
      };
    }
  }

  if (relationship.type === RelationType.CHILD) {
    // 检查目标是否已经是成员的父母
    const isTargetParent = existingRelationships.some(
      r => r.targetId === relationship.targetId && r.type === RelationType.PARENT
    );

    if (isTargetParent) {
      return {
        hasConflict: true,
        conflictType: RelationshipConflictType.ROLE_CONFLICT,
        message: 'Cannot set as child: this member is already your parent'
      };
    }
  }

  return { hasConflict: false };
}

/**
 * 检查关系循环
 * @param familyTree 家谱数据
 * @param memberId 成员ID
 * @param relationship 要添加的关系
 * @returns 冲突检查结果
 */
function checkRelationshipCycle(
  familyTree: FamilyTree,
  memberId: string,
  relationship: Relationship
): RelationshipConflictResult {
  // 如果是父子关系，检查是否会形成循环
  if (relationship.type === RelationType.PARENT) {
    // 检查是否会形成循环：如果目标成员的祖先中包含当前成员，则会形成循环
    if (isAncestor(familyTree, relationship.targetId, memberId)) {
      return {
        hasConflict: true,
        conflictType: RelationshipConflictType.CYCLE,
        message: 'Cannot set as parent: this would create a cycle in the family tree'
      };
    }
  }

  if (relationship.type === RelationType.CHILD) {
    // 检查是否会形成循环：如果当前成员的祖先中包含目标成员，则会形成循环
    if (isAncestor(familyTree, memberId, relationship.targetId)) {
      return {
        hasConflict: true,
        conflictType: RelationshipConflictType.CYCLE,
        message: 'Cannot set as child: this would create a cycle in the family tree'
      };
    }
  }

  return { hasConflict: false };
}

/**
 * 检查一个成员是否是另一个成员的祖先
 * @param familyTree 家谱数据
 * @param memberId 成员ID
 * @param potentialAncestorId 潜在祖先ID
 * @returns 是否是祖先
 */
function isAncestor(
  familyTree: FamilyTree,
  memberId: string,
  potentialAncestorId: string
): boolean {
  // 如果成员ID和潜在祖先ID相同，则返回true
  if (memberId === potentialAncestorId) {
    return true;
  }

  const member = familyTree.members.find(m => m.id === memberId);
  if (!member || !member.relationships) {
    return false;
  }

  // 获取所有父母关系
  const parentRelationships = member.relationships.filter(
    r => r.type === RelationType.PARENT
  );

  // 递归检查每个父母
  for (const parentRel of parentRelationships) {
    if (isAncestor(familyTree, parentRel.targetId, potentialAncestorId)) {
      return true;
    }
  }

  return false;
}
