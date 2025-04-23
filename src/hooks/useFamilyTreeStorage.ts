import { useState } from 'react';
import { FamilyTree, SaveFamilyTreeResult } from '@/types/family-tree';
import { saveFamilyTreeToDatabase } from '@/lib/family-tree-utils';
import { useAuth } from '@/contexts/AuthContext';

/**
 * 自定义hook：处理家谱数据的存储操作
 * 
 * 该hook包含以下功能：
 * 1. 保存家谱到数据库
 * 2. 处理保存成功/失败状态
 * 3. 处理URL更新
 */
export function useFamilyTreeStorage() {
  const { isAuthenticated } = useAuth();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveResult, setSaveResult] = useState<SaveFamilyTreeResult | null>(null);

  /**
   * 保存家谱到数据库
   * @param familyTree 家谱数据
   * @returns 保存结果，包含成功状态、结果数据和可能的错误信息
   */
  const saveToDatabase = async (familyTree: FamilyTree): Promise<{
    success: boolean;
    result?: SaveFamilyTreeResult;
    error?: string;
    requireAuth?: boolean;
  }> => {
    // 清除之前的错误和结果
    setSaveError(null);
    setSaveResult(null);
    
    // 检查用户是否已认证
    if (!isAuthenticated) {
      return {
        success: false,
        error: '需要登录才能保存到数据库',
        requireAuth: true
      };
    }

    // 检查家谱是否有成员
    if (familyTree.members.length === 0) {
      setSaveError('不能保存空家谱，请至少添加一名家庭成员');
      return {
        success: false,
        error: '不能保存空家谱，请至少添加一名家庭成员'
      };
    }

    try {
      setIsSaving(true);
      
      // 保存到数据库
      const result = await saveFamilyTreeToDatabase(familyTree);
      
      if (result && result.id) {
        console.log('家谱成功保存到数据库，ID:', result.id);
        
        // 创建URL（用于分享）
        const url = new URL(window.location.href);
        url.searchParams.set('id', result.id.toString());
        
        // 更新URL（但不刷新页面）
        window.history.replaceState({}, "", url.toString());
        
        // 保存结果
        setSaveResult(result);
        
        return {
          success: true,
          result
        };
      } else {
        const errorMsg = '保存到数据库失败，请重试';
        console.error(errorMsg, result);
        setSaveError(errorMsg);
        
        return {
          success: false,
          error: errorMsg
        };
      }
    } catch (error) {
      let errorMessage = '保存到数据库时发生错误';
      
      // 检查是否是认证错误
      if (error instanceof Error && error.message === 'AUTH_REQUIRED') {
        errorMessage = '需要登录才能保存到数据库';
        return {
          success: false,
          error: errorMessage,
          requireAuth: true
        };
      }
      
      console.error('保存家谱到数据库时出错:', error);
      setSaveError(errorMessage);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : errorMessage
      };
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * 获取家谱分享URL
   * @param id 家谱ID
   * @returns 完整的分享URL
   */
  const getFamilyTreeShareUrl = (id: number | string): string => {
    const url = new URL(window.location.href);
    url.searchParams.set('id', id.toString());
    return url.toString();
  };

  return {
    isSaving,
    saveError,
    saveResult,
    saveToDatabase,
    getFamilyTreeShareUrl
  };
}
