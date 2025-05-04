import { renderHook, act } from '@testing-library/react';
import { FamilyTree, SaveFamilyTreeResult } from '@/types/family-tree';
import { useFamilyTreeStorage } from '../useFamilyTreeStorage';
import { saveFamilyTreeToDatabase } from '@/lib/family-tree-utils';
import { useAuth } from '@/contexts/AuthContext';

// 模拟TextDecoder和TextEncoder，解决@neondatabase/serverless的依赖问题
global.TextDecoder = require('util').TextDecoder;
global.TextEncoder = require('util').TextEncoder;

// 模拟family-tree-utils模块
jest.mock('@/lib/family-tree-utils', () => ({
  saveFamilyTreeToDatabase: jest.fn()
}));

// 模拟AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn()
}));

// 模拟window.location和window.history
const mockHistoryReplaceState = jest.fn();
Object.defineProperty(window, 'history', {
  writable: true,
  value: {
    replaceState: mockHistoryReplaceState
  }
});

Object.defineProperty(window, 'location', {
  writable: true,
  value: {
    href: 'http://localhost:3000/generator'
  }
});

describe('useFamilyTreeStorage Hook测试', () => {
  // 测试数据
  const mockFamilyTree: FamilyTree = {
    members: [
      { id: 'member-1', name: '张三', relation: '父亲' },
      { id: 'member-2', name: '李四', relation: '母亲' }
    ],
    name: '测试家谱',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  };

  const mockSaveResult: SaveFamilyTreeResult = {
    id: 123,
    success: true
  };

  beforeEach(() => {
    // 重置所有模拟
    jest.clearAllMocks();
    
    // 默认模拟用户已认证
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true
    });
  });

  it('应该初始化状态', () => {
    const { result } = renderHook(() => useFamilyTreeStorage());
    
    expect(result.current.isSaving).toBe(false);
    expect(result.current.saveError).toBeNull();
    expect(result.current.saveResult).toBeNull();
  });

  it('当用户未认证时，应该返回认证错误', async () => {
    // 模拟用户未认证
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false
    });

    const { result } = renderHook(() => useFamilyTreeStorage());
    
    // 调用saveToDatabase
    let saveResult;
    await act(async () => {
      saveResult = await result.current.saveToDatabase(mockFamilyTree);
    });
    
    // 验证结果
    expect(saveResult).toEqual({
      success: false,
      error: '需要登录才能保存到数据库',
      requireAuth: true
    });
    
    // 验证saveFamilyTreeToDatabase没有被调用
    expect(saveFamilyTreeToDatabase).not.toHaveBeenCalled();
  });

  it('当家谱没有成员时，应该返回错误', async () => {
    const emptyFamilyTree: FamilyTree = {
      members: [],
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z'
    };

    const { result } = renderHook(() => useFamilyTreeStorage());
    
    // 调用saveToDatabase
    let saveResult;
    await act(async () => {
      saveResult = await result.current.saveToDatabase(emptyFamilyTree);
    });
    
    // 验证结果
    expect(saveResult).toEqual({
      success: false,
      error: '不能保存空家谱，请至少添加一名家庭成员'
    });
    
    // 验证状态
    expect(result.current.saveError).toBe('不能保存空家谱，请至少添加一名家庭成员');
    
    // 验证saveFamilyTreeToDatabase没有被调用
    expect(saveFamilyTreeToDatabase).not.toHaveBeenCalled();
  });

  it('应该成功保存家谱到数据库', async () => {
    // 模拟saveFamilyTreeToDatabase返回成功结果
    (saveFamilyTreeToDatabase as jest.Mock).mockResolvedValue(mockSaveResult);

    const { result } = renderHook(() => useFamilyTreeStorage());
    
    // 调用saveToDatabase
    let saveResult;
    await act(async () => {
      saveResult = await result.current.saveToDatabase(mockFamilyTree);
    });
    
    // 验证结果
    expect(saveResult).toEqual({
      success: true,
      result: mockSaveResult
    });
    
    // 验证状态
    expect(result.current.saveResult).toEqual(mockSaveResult);
    expect(result.current.saveError).toBeNull();
    
    // 验证saveFamilyTreeToDatabase被调用
    expect(saveFamilyTreeToDatabase).toHaveBeenCalledWith(mockFamilyTree);
    
    // 验证URL更新
    expect(mockHistoryReplaceState).toHaveBeenCalledWith(
      {},
      "",
      expect.stringContaining("id=123")
    );
  });

  it('应该处理保存失败的情况', async () => {
    // 模拟saveFamilyTreeToDatabase返回null
    (saveFamilyTreeToDatabase as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useFamilyTreeStorage());
    
    // 调用saveToDatabase
    let saveResult;
    await act(async () => {
      saveResult = await result.current.saveToDatabase(mockFamilyTree);
    });
    
    // 验证结果
    expect(saveResult).toEqual({
      success: false,
      error: '保存到数据库失败，请重试'
    });
    
    // 验证状态
    expect(result.current.saveError).toBe('保存到数据库失败，请重试');
    
    // 验证saveFamilyTreeToDatabase被调用
    expect(saveFamilyTreeToDatabase).toHaveBeenCalledWith(mockFamilyTree);
  });

  it('应该处理认证错误', async () => {
    // 模拟saveFamilyTreeToDatabase抛出AUTH_REQUIRED错误
    (saveFamilyTreeToDatabase as jest.Mock).mockRejectedValue(new Error('AUTH_REQUIRED'));

    const { result } = renderHook(() => useFamilyTreeStorage());
    
    // 调用saveToDatabase
    let saveResult;
    await act(async () => {
      saveResult = await result.current.saveToDatabase(mockFamilyTree);
    });
    
    // 验证结果
    expect(saveResult).toEqual({
      success: false,
      error: '需要登录才能保存到数据库',
      requireAuth: true
    });
  });

  it('应该处理一般错误', async () => {
    // 模拟saveFamilyTreeToDatabase抛出一般错误
    const errorMessage = '数据库连接失败';
    (saveFamilyTreeToDatabase as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useFamilyTreeStorage());
    
    // 调用saveToDatabase
    let saveResult;
    await act(async () => {
      saveResult = await result.current.saveToDatabase(mockFamilyTree);
    });
    
    // 验证结果
    expect(saveResult).toEqual({
      success: false,
      error: errorMessage
    });
    
    // 验证状态
    expect(result.current.saveError).toBe('保存到数据库时发生错误');
  });

  it('应该生成正确的分享URL', () => {
    const { result } = renderHook(() => useFamilyTreeStorage());
    
    // 调用getFamilyTreeShareUrl
    const shareUrl = result.current.getFamilyTreeShareUrl(123);
    
    // 验证URL
    expect(shareUrl).toBe('http://localhost:3000/generator?id=123');
  });

  it('应该在保存过程中设置isSaving状态', async () => {
    // 模拟saveFamilyTreeToDatabase需要一些时间
    (saveFamilyTreeToDatabase as jest.Mock).mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve(mockSaveResult), 100);
      });
    });

    const { result } = renderHook(() => useFamilyTreeStorage());
    
    // 调用saveToDatabase
    let savePromise;
    act(() => {
      savePromise = result.current.saveToDatabase(mockFamilyTree);
    });
    
    // 验证isSaving状态
    expect(result.current.isSaving).toBe(true);
    
    // 等待保存完成
    await act(async () => {
      await savePromise;
    });
    
    // 验证isSaving状态恢复
    expect(result.current.isSaving).toBe(false);
  });
});
