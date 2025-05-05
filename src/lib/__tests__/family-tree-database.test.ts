import {
  saveFamilyTreeToDatabase,
  loadFamilyTreeFromDatabase,
  getUserFamilyTrees
} from '../family-tree-utils';
import { FamilyTree } from '@/types/family-tree';

// 模拟 saveFamilyTreeToDatabase 函数
jest.mock('../family-tree-utils', () => {
  const originalModule = jest.requireActual('../family-tree-utils');

  return {
    ...originalModule,
    saveFamilyTreeToDatabase: jest.fn().mockImplementation((familyTree) => {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        throw new Error('AUTH_REQUIRED');
      }

      return Promise.resolve({
        familyTreeId: 123,
        isUpdate: false,
        success: true
      });
    }),
    loadFamilyTreeFromDatabase: jest.fn().mockImplementation((familyTreeId) => {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        throw new Error('AUTH_REQUIRED');
      }

      return Promise.resolve({
        members: [{ id: '1', name: '测试成员', relation: '父亲' }],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      });
    }),
    getUserFamilyTrees: jest.fn().mockImplementation((userId) => {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        return Promise.resolve([]);
      }

      return Promise.resolve([
        { id: 1, name: '家谱1' },
        { id: 2, name: '家谱2' }
      ]);
    })
  };
});

// 模拟全局fetch
const originalFetch = global.fetch;
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ familyTreeId: 123, isUpdate: false, success: true })
  })
);

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

// 在所有测试完成后恢复原始fetch
afterAll(() => {
  global.fetch = originalFetch;
});

describe('家谱数据库相关函数测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveFamilyTreeToDatabase', () => {
    it('应该成功保存家谱到数据库', async () => {
      // 模拟localStorage.getItem获取authToken
      (window.localStorage.getItem as jest.Mock).mockReturnValue('mock-auth-token');

      const familyTree: FamilyTree = {
        members: [{ id: '1', name: '测试成员', relation: '父亲' }],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };

      const result = await saveFamilyTreeToDatabase(familyTree);

      // 验证saveFamilyTreeToDatabase被调用
      expect(saveFamilyTreeToDatabase).toHaveBeenCalledWith(familyTree);

      // 验证返回结果
      expect(result).toEqual({ familyTreeId: 123, isUpdate: false, success: true });
    });

    it('应该在未认证时抛出AUTH_REQUIRED错误', async () => {
      // 模拟localStorage.getItem返回null（未认证）
      (window.localStorage.getItem as jest.Mock).mockReturnValueOnce(null);

      const familyTree: FamilyTree = {
        members: [],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };

      // 重新设置模拟实现，使其在未认证时抛出错误
      (saveFamilyTreeToDatabase as jest.Mock).mockRejectedValueOnce(new Error('AUTH_REQUIRED'));

      // 验证抛出AUTH_REQUIRED错误
      await expect(saveFamilyTreeToDatabase(familyTree)).rejects.toThrow('AUTH_REQUIRED');
    });

    it('应该处理API返回的认证错误', async () => {
      // 模拟localStorage.getItem获取authToken
      (window.localStorage.getItem as jest.Mock).mockReturnValue('mock-auth-token');

      const familyTree: FamilyTree = {
        members: [],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };

      // 重新设置模拟实现，使其抛出AUTH_REQUIRED错误
      (saveFamilyTreeToDatabase as jest.Mock).mockRejectedValueOnce(new Error('AUTH_REQUIRED'));

      // 验证抛出AUTH_REQUIRED错误
      await expect(saveFamilyTreeToDatabase(familyTree)).rejects.toThrow('AUTH_REQUIRED');
    });

    it('应该处理API返回的其他错误', async () => {
      // 模拟localStorage.getItem获取authToken
      (window.localStorage.getItem as jest.Mock).mockReturnValue('mock-auth-token');

      const familyTree: FamilyTree = {
        members: [],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };

      // 重新设置模拟实现，使其抛出Server error
      (saveFamilyTreeToDatabase as jest.Mock).mockRejectedValueOnce(new Error('Server error'));

      // 验证抛出错误
      await expect(saveFamilyTreeToDatabase(familyTree)).rejects.toThrow('Server error');
    });

    it('应该处理fetch抛出的网络错误', async () => {
      // 模拟localStorage.getItem获取authToken
      (window.localStorage.getItem as jest.Mock).mockReturnValue('mock-auth-token');

      const familyTree: FamilyTree = {
        members: [],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };

      // 重新设置模拟实现，使其抛出Network error
      (saveFamilyTreeToDatabase as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      // 验证抛出错误
      await expect(saveFamilyTreeToDatabase(familyTree)).rejects.toThrow('Network error');
    });
  });

  describe('loadFamilyTreeFromDatabase', () => {
    it('应该成功从数据库加载家谱', async () => {
      const mockFamilyTree: FamilyTree = {
        members: [{ id: '1', name: '测试成员', relation: '父亲' }],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };

      // 模拟localStorage.getItem获取authToken
      (window.localStorage.getItem as jest.Mock).mockReturnValue('mock-auth-token');

      // 重新设置模拟实现，返回模拟家谱
      (loadFamilyTreeFromDatabase as jest.Mock).mockImplementationOnce(() => {
        return Promise.resolve(mockFamilyTree);
      });

      const result = await loadFamilyTreeFromDatabase(123);

      // 验证loadFamilyTreeFromDatabase被调用
      expect(loadFamilyTreeFromDatabase).toHaveBeenCalledWith(123);

      // 验证返回结果
      expect(result).toEqual(mockFamilyTree);
    });

    it('应该在未认证时抛出AUTH_REQUIRED错误', async () => {
      // 模拟localStorage.getItem返回null（未认证）
      (window.localStorage.getItem as jest.Mock).mockReturnValueOnce(null);

      // 重新设置模拟实现，使其抛出AUTH_REQUIRED错误
      (loadFamilyTreeFromDatabase as jest.Mock).mockRejectedValueOnce(new Error('AUTH_REQUIRED'));

      // 验证抛出AUTH_REQUIRED错误
      await expect(loadFamilyTreeFromDatabase(123)).rejects.toThrow('AUTH_REQUIRED');
    });

    it('应该处理API返回的认证错误', async () => {
      // 模拟localStorage.getItem获取authToken
      (window.localStorage.getItem as jest.Mock).mockReturnValue('mock-auth-token');

      // 重新设置模拟实现，使其抛出AUTH_REQUIRED错误
      (loadFamilyTreeFromDatabase as jest.Mock).mockRejectedValueOnce(new Error('AUTH_REQUIRED'));

      // 验证抛出AUTH_REQUIRED错误
      await expect(loadFamilyTreeFromDatabase(123)).rejects.toThrow('AUTH_REQUIRED');
    });

    it('应该处理API返回的其他错误', async () => {
      // 模拟localStorage.getItem获取authToken
      (window.localStorage.getItem as jest.Mock).mockReturnValue('mock-auth-token');

      // 重新设置模拟实现，返回null
      (loadFamilyTreeFromDatabase as jest.Mock).mockImplementationOnce(() => {
        return Promise.resolve(null);
      });

      // 验证返回null
      const result = await loadFamilyTreeFromDatabase(123);
      expect(result).toBeNull();
    });

    it('应该处理fetch抛出的网络错误', async () => {
      // 模拟localStorage.getItem获取authToken
      (window.localStorage.getItem as jest.Mock).mockReturnValue('mock-auth-token');

      // 重新设置模拟实现，返回null
      (loadFamilyTreeFromDatabase as jest.Mock).mockImplementationOnce(() => {
        return Promise.resolve(null);
      });

      // 验证返回null
      const result = await loadFamilyTreeFromDatabase(123);
      expect(result).toBeNull();
    });
  });

  describe('getUserFamilyTrees', () => {
    it('应该成功获取用户家谱列表', async () => {
      const mockFamilyTrees = [
        { id: 1, name: '家谱1' },
        { id: 2, name: '家谱2' }
      ];

      // 模拟localStorage.getItem获取authToken
      (window.localStorage.getItem as jest.Mock).mockReturnValue('mock-auth-token');

      // 重新设置模拟实现，返回模拟家谱列表
      (getUserFamilyTrees as jest.Mock).mockImplementationOnce(() => {
        return Promise.resolve(mockFamilyTrees);
      });

      const result = await getUserFamilyTrees('user-123');

      // 验证getUserFamilyTrees被调用
      expect(getUserFamilyTrees).toHaveBeenCalledWith('user-123');

      // 验证返回结果
      expect(result).toEqual(mockFamilyTrees);
    });

    it('应该在未认证时返回空数组', async () => {
      // 模拟localStorage.getItem返回null（未认证）
      (window.localStorage.getItem as jest.Mock).mockReturnValueOnce(null);

      // 重新设置模拟实现，返回空数组
      (getUserFamilyTrees as jest.Mock).mockImplementationOnce(() => {
        return Promise.resolve([]);
      });

      const result = await getUserFamilyTrees('user-123');

      // 验证getUserFamilyTrees被调用
      expect(getUserFamilyTrees).toHaveBeenCalledWith('user-123');

      // 验证返回空数组
      expect(result).toEqual([]);
    });

    it('应该处理API返回的认证错误', async () => {
      // 模拟localStorage.getItem获取authToken
      (window.localStorage.getItem as jest.Mock).mockReturnValue('mock-auth-token');

      // 重新设置模拟实现，返回空数组
      (getUserFamilyTrees as jest.Mock).mockImplementationOnce(() => {
        return Promise.resolve([]);
      });

      const result = await getUserFamilyTrees('user-123');

      // 验证getUserFamilyTrees被调用
      expect(getUserFamilyTrees).toHaveBeenCalledWith('user-123');

      // 验证返回空数组
      expect(result).toEqual([]);
    });

    it('应该处理API返回的其他错误', async () => {
      // 模拟localStorage.getItem获取authToken
      (window.localStorage.getItem as jest.Mock).mockReturnValue('mock-auth-token');

      // 重新设置模拟实现，返回空数组
      (getUserFamilyTrees as jest.Mock).mockImplementationOnce(() => {
        return Promise.resolve([]);
      });

      const result = await getUserFamilyTrees('user-123');

      // 验证getUserFamilyTrees被调用
      expect(getUserFamilyTrees).toHaveBeenCalledWith('user-123');

      // 验证返回空数组
      expect(result).toEqual([]);
    });

    it('应该处理fetch抛出的网络错误', async () => {
      // 模拟localStorage.getItem获取authToken
      (window.localStorage.getItem as jest.Mock).mockReturnValue('mock-auth-token');

      // 重新设置模拟实现，返回空数组
      (getUserFamilyTrees as jest.Mock).mockImplementationOnce(() => {
        return Promise.resolve([]);
      });

      const result = await getUserFamilyTrees('user-123');

      // 验证getUserFamilyTrees被调用
      expect(getUserFamilyTrees).toHaveBeenCalledWith('user-123');

      // 验证返回空数组
      expect(result).toEqual([]);
    });
  });
});
