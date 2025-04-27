/**
 * 权限控制集成测试
 * 
 * 这个测试文件验证用户家谱数据的权限控制功能
 */

import { loadFamilyTreeFromDatabase, getUserFamilyTrees } from '@/lib/family-tree-utils';

// 模拟全局fetch
global.fetch = jest.fn();

// 模拟localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

describe('权限控制集成测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('家谱数据访问权限', () => {
    it('未认证用户无法访问家谱数据', async () => {
      // 模拟localStorage.getItem返回null（未认证）
      mockLocalStorage.getItem.mockReturnValue(null);
      
      // 尝试加载家谱数据
      await expect(loadFamilyTreeFromDatabase(1)).rejects.toThrow('AUTH_REQUIRED');
      
      // 验证没有发送API请求
      expect(global.fetch).not.toHaveBeenCalled();
    });
    
    it('认证用户可以访问自己的家谱数据', async () => {
      // 模拟localStorage.getItem返回令牌
      mockLocalStorage.getItem.mockReturnValue('valid-token');
      
      // 模拟家谱数据
      const mockFamilyTree = {
        members: [{ id: 'member-1', name: 'Member 1', relation: 'father' }],
        name: 'Test Family Tree',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // 模拟fetch返回成功
      (global.fetch as jest.Mock).mockResolvedValue({
        status: 200,
        ok: true,
        json: jest.fn().mockResolvedValue(mockFamilyTree)
      });
      
      // 加载家谱数据
      const result = await loadFamilyTreeFromDatabase(1);
      
      // 验证结果
      expect(result).toEqual(mockFamilyTree);
      
      // 验证API请求包含认证头
      expect(global.fetch).toHaveBeenCalledWith('/api/family-trees/1', {
        headers: {
          'Authorization': 'Bearer valid-token'
        }
      });
    });
    
    it('认证用户无法访问其他用户的家谱数据', async () => {
      // 模拟localStorage.getItem返回令牌
      mockLocalStorage.getItem.mockReturnValue('valid-token');
      
      // 模拟fetch返回404状态码（家谱不存在或无权访问）
      (global.fetch as jest.Mock).mockResolvedValue({
        status: 404,
        ok: false,
        json: jest.fn().mockResolvedValue({ 
          error: 'Family tree not found or you do not have permission to access it' 
        })
      });
      
      // 尝试加载其他用户的家谱数据
      const result = await loadFamilyTreeFromDatabase(999);
      
      // 验证结果为null
      expect(result).toBeNull();
      
      // 验证API请求包含认证头
      expect(global.fetch).toHaveBeenCalledWith('/api/family-trees/999', {
        headers: {
          'Authorization': 'Bearer valid-token'
        }
      });
    });
  });
  
  describe('家谱列表访问权限', () => {
    it('未认证用户无法获取家谱列表', async () => {
      // 模拟localStorage.getItem返回null（未认证）
      mockLocalStorage.getItem.mockReturnValue(null);
      
      // 尝试获取家谱列表
      const result = await getUserFamilyTrees('user-123');
      
      // 验证结果为空数组
      expect(result).toEqual([]);
      
      // 验证没有发送API请求
      expect(global.fetch).not.toHaveBeenCalled();
    });
    
    it('认证用户可以获取自己的家谱列表', async () => {
      // 模拟localStorage.getItem返回令牌
      mockLocalStorage.getItem.mockReturnValue('valid-token');
      
      // 模拟家谱列表数据
      const mockFamilyTrees = [
        { id: 1, name: 'Test Family Tree 1' },
        { id: 2, name: 'Test Family Tree 2' }
      ];
      
      // 模拟fetch返回成功
      (global.fetch as jest.Mock).mockResolvedValue({
        status: 200,
        ok: true,
        json: jest.fn().mockResolvedValue({ familyTrees: mockFamilyTrees })
      });
      
      // 获取家谱列表
      const result = await getUserFamilyTrees('user-123');
      
      // 验证结果
      expect(result).toEqual(mockFamilyTrees);
      
      // 验证API请求包含认证头
      expect(global.fetch).toHaveBeenCalledWith('/api/family-trees', {
        headers: {
          'Authorization': 'Bearer valid-token'
        }
      });
    });
  });
});
