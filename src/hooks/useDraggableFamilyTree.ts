import { useState, useCallback } from 'react';
import { Member, FamilyTree } from '@/types/family-tree';
import { generateUniqueId } from '@/lib/family-tree-utils';

/**
 * 自定义Hook：管理可拖拽家谱
 *
 * 该Hook提供拖拽相关的状态和操作方法
 */
export function useDraggableFamilyTree(
  initialFamilyTree: FamilyTree,
  onUpdateFamilyTree: (updatedFamilyTree: FamilyTree) => void
) {
  // 当前被拖拽的成员ID
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);

  // 当前悬停的目标成员ID（可能成为父节点）
  const [overMemberId, setOverMemberId] = useState<string | null>(null);

  // 拖拽开始处理
  const handleDragStart = useCallback((id: string) => {
    setActiveMemberId(id);
  }, []);

  // 拖拽结束处理
  const handleDragEnd = useCallback(() => {
    // 如果有活动成员和目标成员，则建立父子关系
    if (activeMemberId && overMemberId && activeMemberId !== overMemberId) {
      // 更新家谱数据，设置父子关系
      const updatedMembers = initialFamilyTree.members.map(member => {
        if (member.id === activeMemberId) {
          return {
            ...member,
            parentId: overMemberId
          };
        }
        return member;
      });

      // 更新家谱
      onUpdateFamilyTree({
        ...initialFamilyTree,
        members: updatedMembers,
        updatedAt: new Date().toISOString()
      });
    }

    // 重置状态
    setActiveMemberId(null);
    setOverMemberId(null);
  }, [activeMemberId, overMemberId, initialFamilyTree, onUpdateFamilyTree]);

  // 拖拽悬停处理
  const handleDragOver = useCallback((id: string) => {
    setOverMemberId(id);
  }, []);

  // 添加新成员作为子节点
  const addChildMember = useCallback((parentId: string, memberData: Partial<Member>) => {
    const newMember: Member = {
      id: generateUniqueId(),
      name: memberData.name || 'New Member',
      relation: memberData.relation || 'Child',
      gender: memberData.gender || 'male',
      parentId: parentId,
      birthDate: memberData.birthDate,
      deathDate: memberData.deathDate,
      description: memberData.description
    };

    // 更新家谱
    onUpdateFamilyTree({
      ...initialFamilyTree,
      members: [...initialFamilyTree.members, newMember],
      updatedAt: new Date().toISOString()
    });

    return newMember;
  }, [initialFamilyTree, onUpdateFamilyTree]);

  // 移除父子关系
  const removeParentRelation = useCallback((memberId: string) => {
    const updatedMembers = initialFamilyTree.members.map(member => {
      if (member.id === memberId) {
        const { parentId, ...rest } = member;
        return rest;
      }
      return member;
    });

    // 更新家谱
    onUpdateFamilyTree({
      ...initialFamilyTree,
      members: updatedMembers,
      updatedAt: new Date().toISOString()
    });
  }, [initialFamilyTree, onUpdateFamilyTree]);

  return {
    activeMemberId,
    overMemberId,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    addChildMember,
    removeParentRelation
  };
}
