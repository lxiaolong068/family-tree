import { loadFamilyTreeFromDatabase, getUserFamilyTrees } from '../family-tree-utils';

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
  value: mockLocalStorage
});

describe('家谱API工具函数测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadFamilyTreeFromDatabase', () => {
    it('应该抛出AUTH_REQUIRED错误，如果没有认证令牌', async () => {
      // 模拟localStorage.getItem返回null
      mockLocalStorage.getItem.mockReturnValue(null);

      await expect(loadFamilyTreeFromDatabase(1)).rejects.toThrow('AUTH_REQUIRED');
    });

    it('应该抛出AUTH_REQUIRED错误，如果API返回401状态码', async () => {
      // 模拟localStorage.getItem返回令牌
      mockLocalStorage.getItem.mockReturnValue('valid-token');

      // 模拟fetch返回401状态码
      (global.fetch as jest.Mock).mockResolvedValue({
        status: 401,
        ok: false,
        json: jest.fn().mockResolvedValue({ requireAuth: true })
      });

      await expect(loadFamilyTreeFromDatabase(1)).rejects.toThrow('AUTH_REQUIRED');
    });

    it('应该返回null，如果API返回其他错误', async () => {
      // 模拟localStorage.getItem返回令牌
      mockLocalStorage.getItem.mockReturnValue('valid-token');

      // 模拟fetch返回404状态码
      (global.fetch as jest.Mock).mockResolvedValue({
        status: 404,
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'Family tree not found' })
      });

      const result = await loadFamilyTreeFromDatabase(1);
      expect(result).toBeNull();
    });

    it('应该返回家谱数据，如果API请求成功', async () => {
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

      const result = await loadFamilyTreeFromDatabase(1);

      expect(result).toEqual(mockFamilyTree);
      expect(global.fetch).toHaveBeenCalledWith('/api/family-trees/1', {
        headers: {
          'Authorization': 'Bearer valid-token'
        }
      });
    });
  });

  describe('getUserFamilyTrees', () => {
    it('应该返回空数组，如果没有认证令牌', async () => {
      // 模拟localStorage.getItem返回null
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = await getUserFamilyTrees('user-123');

      expect(result).toEqual([]);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('应该返回空数组，如果API返回401状态码', async () => {
      // 模拟localStorage.getItem返回令牌
      mockLocalStorage.getItem.mockReturnValue('valid-token');

      // 模拟fetch返回401状态码
      (global.fetch as jest.Mock).mockResolvedValue({
        status: 401,
        ok: false
      });

      const result = await getUserFamilyTrees('user-123');

      expect(result).toEqual([]);
    });

    it('应该返回空数组，如果API返回其他错误', async () => {
      // 模拟localStorage.getItem返回令牌
      mockLocalStorage.getItem.mockReturnValue('valid-token');

      // 模拟fetch返回500状态码
      (global.fetch as jest.Mock).mockResolvedValue({
        status: 500,
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'Server error' })
      });

      const result = await getUserFamilyTrees('user-123');

      expect(result).toEqual([]);
    });

    it('应该返回家谱列表，如果API请求成功', async () => {
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

      const result = await getUserFamilyTrees('user-123');

      expect(result).toEqual(mockFamilyTrees);
      expect(global.fetch).toHaveBeenCalledWith('/api/family-trees', {
        headers: {
          'Authorization': 'Bearer valid-token'
        }
      });
    });
  });
});
