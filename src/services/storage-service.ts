/**
 * 存储服务
 * 统一管理本地存储和数据库存储，提供一致的接口
 */

import { FamilyTree, SaveFamilyTreeResult } from '@/types/family-tree';
import { db, isDatabaseConfigured } from '@/db';
import { familyTrees, members } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import { apiClient } from '@/lib/api-client';

/**
 * 存储服务类
 */
export class StorageService {
  /**
   * 保存家谱到存储（首选数据库，备选本地存储）
   * @param familyTree 家谱对象
   * @param key 本地存储键名
   */
  async saveFamilyTree(familyTree: FamilyTree, key: string = 'familyTree'): Promise<SaveFamilyTreeResult | null> {
    // 总是保存到本地存储作为备份
    this.saveToLocalStorage(familyTree, key);
    
    // 检查是否已登录并配置了数据库
    const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    
    if (!authToken) {
      logger.warn('用户未登录，家谱仅保存到本地存储');
      return null;
    }
    
    // 尝试保存到数据库
    try {
      const response = await apiClient.post<SaveFamilyTreeResult>('/api/save-family-tree', { familyTree });
      
      if (!response.success) {
        throw new Error(response.error || '保存到数据库失败');
      }
      
      logger.info('家谱已成功保存到数据库');
      return response.data || null;
    } catch (error) {
      logger.error('保存家谱到数据库失败:', error);
      throw error;
    }
  }
  
  /**
   * 从存储中加载家谱（首选数据库，备选本地存储）
   * @param familyTreeId 数据库中的家谱ID
   * @param key 本地存储键名
   */
  async loadFamilyTree(familyTreeId?: number, key: string = 'familyTree'): Promise<FamilyTree> {
    // 如果提供了ID，尝试从数据库加载
    if (familyTreeId) {
      try {
        const response = await apiClient.get<FamilyTree>(`/api/family-trees?id=${familyTreeId}`);
        
        if (response.success && response.data) {
          logger.info(`已从数据库加载家谱，ID: ${familyTreeId}`);
          return response.data;
        }
      } catch (error) {
        logger.error(`从数据库加载家谱失败，ID: ${familyTreeId}`, error);
      }
    }
    
    // 如果从数据库加载失败或未提供ID，则尝试从本地存储加载
    return this.loadFromLocalStorage(key);
  }
  
  /**
   * 获取用户的所有家谱
   * @param userId 用户ID
   */
  async getUserFamilyTrees(userId: string): Promise<{ id: number, name: string }[]> {
    try {
      const response = await apiClient.get<{ id: number, name: string }[]>(`/api/family-trees?userId=${userId}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      logger.error('获取用户家谱列表失败:', error);
      return [];
    }
  }
  
  /**
   * 保存家谱到本地存储
   * @param familyTree 家谱对象
   * @param key 存储键名
   */
  saveToLocalStorage(familyTree: FamilyTree, key: string = 'familyTree'): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(familyTree));
        logger.debug('家谱已保存到本地存储作为备份');
      } catch (error) {
        logger.error('保存到本地存储失败:', error);
      }
    }
  }
  
  /**
   * 从本地存储加载家谱
   * @param key 存储键名
   * @returns 家谱对象，如果不存在则返回新的家谱
   */
  loadFromLocalStorage(key: string = 'familyTree'): FamilyTree {
    if (typeof window !== 'undefined') {
      try {
        const storedData = localStorage.getItem(key);
        if (storedData) {
          logger.debug('从本地存储加载家谱');
          return JSON.parse(storedData) as FamilyTree;
        }
      } catch (error) {
        logger.error('从本地存储解析家谱数据失败:', error);
      }
    }
    
    // 如果没有数据或解析失败，创建新的家谱
    return this.createNewFamilyTree();
  }
  
  /**
   * 创建新的家谱
   * @returns 新的家谱对象
   */
  createNewFamilyTree(): FamilyTree {
    return {
      members: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
  
  /**
   * 清除本地存储中的家谱数据
   * @param key 存储键名
   */
  clearLocalStorage(key: string = 'familyTree'): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(key);
        logger.debug('本地存储的家谱数据已清除');
      } catch (error) {
        logger.error('清除本地存储数据失败:', error);
      }
    }
  }
}

// 导出单例实例
export const storageService = new StorageService();
