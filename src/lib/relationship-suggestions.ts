import { Member, FamilyTree, RelationType, Relationship } from '@/types/family-tree';

/**
 * 关系建议
 */
export interface RelationshipSuggestion {
  memberId: string;
  targetId: string;
  type: RelationType;
  confidence: number; // 0-1，表示建议的可信度
  reason: string;
}

/**
 * 为成员生成关系建议
 * @param familyTree 家谱数据
 * @param memberId 成员ID
 * @returns 关系建议数组
 */
export function generateRelationshipSuggestions(
  familyTree: FamilyTree,
  memberId: string
): RelationshipSuggestion[] {
  const suggestions: RelationshipSuggestion[] = [];
  const member = familyTree.members.find(m => m.id === memberId);
  
  if (!member) return suggestions;
  
  // 获取成员现有关系
  const relationships = member.relationships || [];
  
  // 1. 父母的配偶可能也是父母
  const parentRelationships = relationships.filter(r => r.type === RelationType.PARENT);
  for (const parentRel of parentRelationships) {
    const parent = familyTree.members.find(m => m.id === parentRel.targetId);
    if (parent && parent.relationships) {
      const spouseRelationships = parent.relationships.filter(r => r.type === RelationType.SPOUSE);
      for (const spouseRel of spouseRelationships) {
        // 检查是否已经是父母
        const isAlreadyParent = relationships.some(
          r => r.type === RelationType.PARENT && r.targetId === spouseRel.targetId
        );
        
        if (!isAlreadyParent) {
          suggestions.push({
            memberId,
            targetId: spouseRel.targetId,
            type: RelationType.PARENT,
            confidence: 0.8,
            reason: `${parent.name}'s spouse might also be your parent`
          });
        }
      }
    }
  }
  
  // 2. 父母的子女可能是兄弟姐妹
  for (const parentRel of parentRelationships) {
    const parent = familyTree.members.find(m => m.id === parentRel.targetId);
    if (parent && parent.relationships) {
      const childRelationships = parent.relationships.filter(r => r.type === RelationType.CHILD);
      for (const childRel of childRelationships) {
        // 排除自己
        if (childRel.targetId === memberId) continue;
        
        // 检查是否已经是兄弟姐妹
        const isAlreadySibling = relationships.some(
          r => r.type === RelationType.SIBLING && r.targetId === childRel.targetId
        );
        
        if (!isAlreadySibling) {
          suggestions.push({
            memberId,
            targetId: childRel.targetId,
            type: RelationType.SIBLING,
            confidence: 0.9,
            reason: `You share a parent (${parent.name}), so you might be siblings`
          });
        }
      }
    }
  }
  
  // 3. 子女的父母可能是配偶
  const childRelationships = relationships.filter(r => r.type === RelationType.CHILD);
  for (const childRel of childRelationships) {
    const child = familyTree.members.find(m => m.id === childRel.targetId);
    if (child && child.relationships) {
      const childParentRelationships = child.relationships.filter(r => r.type === RelationType.PARENT);
      for (const parentRel of childParentRelationships) {
        // 排除自己
        if (parentRel.targetId === memberId) continue;
        
        // 检查是否已经是配偶
        const isAlreadySpouse = relationships.some(
          r => r.type === RelationType.SPOUSE && r.targetId === parentRel.targetId
        );
        
        if (!isAlreadySpouse) {
          suggestions.push({
            memberId,
            targetId: parentRel.targetId,
            type: RelationType.SPOUSE,
            confidence: 0.7,
            reason: `You share a child, so you might be spouses`
          });
        }
      }
    }
  }
  
  return suggestions;
}
