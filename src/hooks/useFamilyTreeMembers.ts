import { useState } from 'react';
import { Member, FamilyTree } from '@/types/family-tree';
import {
  generateUniqueId,
  addMemberToFamilyTree
} from '@/lib/family-tree-utils';
import { validateMember as validateMemberData, sanitizeMember } from '@/lib/data-validator';

/**
 * 自定义hook：管理家谱成员
 *
 * 该hook包含以下功能：
 * 1. 管理当前正在编辑的成员数据
 * 2. 添加新成员
 * 3. 删除成员
 * 4. 验证成员数据
 */
export function useFamilyTreeMembers(
  familyTree: FamilyTree,
  onUpdateFamilyTree: (updatedFamilyTree: FamilyTree) => void
) {
  // 当前编辑的成员
  const [currentMember, setCurrentMember] = useState<Partial<Member>>({
    name: '',
    relation: '',
    gender: 'male'
  });

  /**
   * 处理输入变化
   * @param field 成员字段
   * @param value 字段值
   */
  const handleInputChange = (field: keyof Member, value: string) => {
    setCurrentMember(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * 重置当前成员表单
   */
  const resetForm = () => {
    setCurrentMember({
      name: '',
      relation: '',
      gender: 'male',
      birthDate: '',
    });
  };

  /**
   * 验证成员数据
   * @returns {Object} 验证结果对象
   */
  const validateMember = (): { isValid: boolean; errorMessage?: string; errors?: Record<string, string> } => {
    // 使用增强的数据验证
    const validationResult = validateMemberData(currentMember);

    if (!validationResult.isValid) {
      return {
        isValid: false,
        errorMessage: validationResult.message || '成员数据验证失败',
        errors: validationResult.errors
      };
    }

    return { isValid: true };
  };

  /**
   * 添加新成员
   * @returns {Object} 结果对象，包含成功状态和可能的错误信息
   */
  const addMember = (): { success: boolean; error?: string } => {
    try {
      // 验证成员数据
      const { isValid, errorMessage } = validateMember();
      if (!isValid) {
        return { success: false, error: errorMessage };
      }

      // 清理并创建新成员
      const sanitizedMember = sanitizeMember(currentMember);
      const newMember: Member = {
        id: generateUniqueId(),
        name: sanitizedMember.name!,
        relation: sanitizedMember.relation!,
        gender: sanitizedMember.gender || 'male',
        birthDate: sanitizedMember.birthDate || '',
        deathDate: sanitizedMember.deathDate || '',
        description: sanitizedMember.description,
      };

      // 更新家谱
      const updatedFamilyTree = addMemberToFamilyTree(familyTree, newMember);

      // 调用更新回调
      onUpdateFamilyTree(updatedFamilyTree);

      // 重置表单
      resetForm();

      return { success: true };
    } catch (error) {
      console.error('添加家庭成员时出错:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '添加成员时发生未知错误'
      };
    }
  };

  /**
   * 删除成员
   * @param id 成员ID
   */
  const deleteMember = (id: string): { success: boolean; error?: string } => {
    try {
      // 过滤掉要删除的成员
      const updatedMembers = familyTree.members.filter(member => member.id !== id);

      // 创建更新后的家谱
      const updatedFamilyTree = {
        ...familyTree,
        members: updatedMembers
      };

      // 调用更新回调
      onUpdateFamilyTree(updatedFamilyTree);

      return { success: true };
    } catch (error) {
      console.error('删除家庭成员时出错:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '删除成员时发生未知错误'
      };
    }
  };

  return {
    currentMember,
    handleInputChange,
    addMember,
    deleteMember,
    resetForm,
    validateMember
  };
}
