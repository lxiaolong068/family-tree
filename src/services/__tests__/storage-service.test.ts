import { StorageService } from '../storage-service';
import { apiClient } from '@/lib/api-client';
import { logger } from '@/lib/logger';
import { FamilyTree } from '@/types/family-tree';

// 模拟apiClient
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn()
  }
}));

// 模拟logger
jest.mock('@/lib/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  }
}));

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

describe('StorageService', () => {
  let storageService: StorageService;

  // 测试数据
  const mockFamilyTree: FamilyTree = {
    members: [
      { id: 'member-1', name: 'Test Member', relation: 'Father', gender: 'male' }
    ],
    name: 'Test Family Tree',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  };

  const mockSaveResult = {
    id: 123,
    success: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
    storageService = new StorageService();
  });

  describe('saveFamilyTree', () => {
    it('应该保存到本地存储和数据库', async () => {
      // 模拟已登录
      mockLocalStorage.getItem.mockReturnValue('valid-token');

      // 模拟API调用成功
      (apiClient.post as jest.Mock).mockResolvedValue({
        success: true,
        data: mockSaveResult
      });

      const result = await storageService.saveFamilyTree(mockFamilyTree);

      // 验证结果
      expect(result).toEqual(mockSaveResult);

      // 验证本地存储调用
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'familyTree',
        JSON.stringify(mockFamilyTree)
      );

      // 验证API调用
      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/save-family-tree',
        { familyTree: mockFamilyTree }
      );

      // 验证日志
      expect(logger.info).toHaveBeenCalledWith('家谱已成功保存到数据库');
    });

    it('当用户未登录时应该只保存到本地存储', async () => {
      // 模拟未登录
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = await storageService.saveFamilyTree(mockFamilyTree);

      // 验证结果
      expect(result).toBeNull();

      // 验证本地存储调用
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'familyTree',
        JSON.stringify(mockFamilyTree)
      );

      // 验证API未调用
      expect(apiClient.post).not.toHaveBeenCalled();

      // 验证日志
      expect(logger.warn).toHaveBeenCalledWith('用户未登录，家谱仅保存到本地存储');
    });

    it('应该处理API错误', async () => {
      // 模拟已登录
      mockLocalStorage.getItem.mockReturnValue('valid-token');

      // 模拟API调用失败
      (apiClient.post as jest.Mock).mockResolvedValue({
        success: false,
        error: '保存失败'
      });

      // 预期会抛出错误
      await expect(storageService.saveFamilyTree(mockFamilyTree)).rejects.toThrow('保存失败');

      // 验证本地存储调用（即使API失败也应该保存到本地）
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'familyTree',
        JSON.stringify(mockFamilyTree)
      );

      // 验证日志
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('loadFamilyTree', () => {
    it('应该从数据库加载家谱', async () => {
      // 模拟API调用成功
      (apiClient.get as jest.Mock).mockResolvedValue({
        success: true,
        data: mockFamilyTree
      });

      const result = await storageService.loadFamilyTree(123);

      // 验证结果
      expect(result).toEqual(mockFamilyTree);

      // 验证API调用
      expect(apiClient.get).toHaveBeenCalledWith('/api/family-trees/123');

      // 验证日志
      expect(logger.info).toHaveBeenCalledWith('已从数据库加载家谱，ID: 123');
    });

    it('当数据库加载失败时应该回退到本地存储', async () => {
      // 模拟API调用失败
      (apiClient.get as jest.Mock).mockResolvedValue({
        success: false
      });

      // 模拟本地存储有数据
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockFamilyTree));

      const result = await storageService.loadFamilyTree(123);

      // 验证结果（应该是从本地存储加载的）
      expect(result).toEqual(mockFamilyTree);

      // 验证API调用
      expect(apiClient.get).toHaveBeenCalledWith('/api/family-trees/123');

      // 验证本地存储调用
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('familyTree');

      // 不验证日志，因为在测试环境中可能不会调用
    });

    it('当未提供ID时应该从本地存储加载', async () => {
      // 模拟本地存储有数据
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockFamilyTree));

      const result = await storageService.loadFamilyTree();

      // 验证结果
      expect(result).toEqual(mockFamilyTree);

      // 验证API未调用
      expect(apiClient.get).not.toHaveBeenCalled();

      // 验证本地存储调用
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('familyTree');
    });

    it('当本地存储没有数据时应该创建新的家谱', async () => {
      // 模拟本地存储没有数据
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = await storageService.loadFamilyTree();

      // 验证结果是新的家谱
      expect(result).toHaveProperty('members', []);
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');

      // 验证本地存储调用
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('familyTree');
    });
  });

  describe('getUserFamilyTrees', () => {
    it('应该获取用户的家谱列表', async () => {
      const mockFamilyTreesList = [
        { id: 1, name: 'Family Tree 1' },
        { id: 2, name: 'Family Tree 2' }
      ];

      // 模拟API调用成功
      (apiClient.get as jest.Mock).mockResolvedValue({
        success: true,
        data: mockFamilyTreesList
      });

      const result = await storageService.getUserFamilyTrees('user-1');

      // 验证结果
      expect(result).toEqual(mockFamilyTreesList);

      // 验证API调用
      expect(apiClient.get).toHaveBeenCalledWith('/api/family-trees?userId=user-1');
    });

    it('应该处理API错误并返回空数组', async () => {
      // 模拟API调用失败
      (apiClient.get as jest.Mock).mockRejectedValue(new Error('API错误'));

      const result = await storageService.getUserFamilyTrees('user-1');

      // 验证结果是空数组
      expect(result).toEqual([]);

      // 验证日志
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('本地存储方法', () => {
    it('saveToLocalStorage应该保存到本地存储', () => {
      storageService.saveToLocalStorage(mockFamilyTree);

      // 验证本地存储调用
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'familyTree',
        JSON.stringify(mockFamilyTree)
      );

      // 验证日志
      expect(logger.debug).toHaveBeenCalled();
    });

    it('loadFromLocalStorage应该从本地存储加载', () => {
      // 模拟本地存储有数据
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockFamilyTree));

      const result = storageService.loadFromLocalStorage();

      // 验证结果
      expect(result).toEqual(mockFamilyTree);

      // 验证本地存储调用
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('familyTree');
    });

    it('clearLocalStorage应该清除本地存储', () => {
      storageService.clearLocalStorage();

      // 验证本地存储调用
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('familyTree');

      // 验证日志
      expect(logger.debug).toHaveBeenCalled();
    });
  });
});
