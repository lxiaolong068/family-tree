import { renderHook, act } from '@testing-library/react';
import { FamilyTree, Member } from '@/types/family-tree';

// 模拟TextDecoder和TextEncoder，解决@neondatabase/serverless的依赖问题
global.TextDecoder = require('util').TextDecoder;
global.TextEncoder = require('util').TextEncoder;

// 模拟整个模块，避免实际导入
jest.mock('@/lib/family-tree-utils', () => ({
  createNewFamilyTree: jest.fn(),
  generateMermaidChart: jest.fn(),
  buildFamilyRelations: jest.fn(),
  loadFamilyTreeFromLocalStorage: jest.fn(),
  loadFamilyTreeFromDatabase: jest.fn(),
  saveFamilyTreeToLocalStorage: jest.fn()
}));

jest.mock('@/db', () => ({
  isDatabaseConfigured: jest.fn()
}));

// 在模拟后导入，确保使用的是模拟版本
import { useFamilyTree } from '../useFamilyTree';
import {
  createNewFamilyTree,
  generateMermaidChart,
  buildFamilyRelations,
  loadFamilyTreeFromLocalStorage,
  loadFamilyTreeFromDatabase,
  saveFamilyTreeToLocalStorage
} from '@/lib/family-tree-utils';
import { isDatabaseConfigured } from '@/db';

// 模拟next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue(null),
  }),
}));

describe('useFamilyTree Hook', () => {
  // 模拟数据
  const mockMember: Member = {
    id: 'test-id-1',
    name: 'John Doe',
    relation: 'father',
    gender: 'male',
  };

  const mockFamilyTree: FamilyTree = {
    members: [mockMember],
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  const mockChartDefinition = 'graph TD; A-->B';

  // 在每个测试前重置模拟
  beforeEach(() => {
    jest.clearAllMocks();

    // 模拟createNewFamilyTree返回空家谱
    (createNewFamilyTree as jest.Mock).mockReturnValue({
      members: [],
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    });

    // 模拟generateMermaidChart返回图表定义
    (generateMermaidChart as jest.Mock).mockReturnValue(mockChartDefinition);

    // 模拟buildFamilyRelations返回原始成员数组
    (buildFamilyRelations as jest.Mock).mockImplementation((members) => members);

    // 默认情况下，数据库未配置
    (isDatabaseConfigured as jest.Mock).mockReturnValue(false);
  });

  it('应该初始化为空家谱', () => {
    // 模拟loadFamilyTreeFromLocalStorage返回null
    (loadFamilyTreeFromLocalStorage as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useFamilyTree());

    // 验证初始状态
    expect(result.current.familyTree.members).toEqual([]);
    expect(result.current.chartDefinition).toBe('');
    expect(result.current.showChart).toBe(false);
    expect(result.current.isLoading).toBe(false); // 初始加载完成后
  });

  it('应该从本地存储加载家谱', () => {
    // 模拟loadFamilyTreeFromLocalStorage返回家谱数据
    (loadFamilyTreeFromLocalStorage as jest.Mock).mockReturnValue(mockFamilyTree);

    const { result } = renderHook(() => useFamilyTree());

    // 验证家谱数据已加载
    expect(result.current.familyTree).toEqual(mockFamilyTree);
    expect(result.current.showChart).toBe(true);
    expect(generateMermaidChart).toHaveBeenCalled();
  });

  it('应该更新图表定义', () => {
    // 模拟loadFamilyTreeFromLocalStorage返回null
    (loadFamilyTreeFromLocalStorage as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useFamilyTree());

    // 调用updateChartDefinition
    act(() => {
      result.current.updateChartDefinition([mockMember]);
    });

    // 验证图表定义已更新
    expect(buildFamilyRelations).toHaveBeenCalledWith([mockMember]);
    expect(generateMermaidChart).toHaveBeenCalled();
    expect(result.current.chartDefinition).toBe(mockChartDefinition);
  });

  it('应该清空家谱数据', () => {
    // 模拟loadFamilyTreeFromLocalStorage返回家谱数据
    (loadFamilyTreeFromLocalStorage as jest.Mock).mockReturnValue(mockFamilyTree);

    const { result } = renderHook(() => useFamilyTree());

    // 验证家谱数据已加载
    expect(result.current.familyTree).toEqual(mockFamilyTree);

    // 模拟window.location和window.history
    const originalLocation = window.location;
    const originalHistory = window.history;

    delete window.location;
    window.location = {
      ...originalLocation,
      search: '?id=123',
      pathname: '/generator',
    } as Location;

    window.history.replaceState = jest.fn();

    // 调用clearFamilyTree
    act(() => {
      result.current.clearFamilyTree();
    });

    // 验证家谱数据已清空
    expect(result.current.familyTree.members).toEqual([]);
    expect(result.current.chartDefinition).toBe('');
    expect(result.current.showChart).toBe(false);
    expect(saveFamilyTreeToLocalStorage).toHaveBeenCalled();
    expect(window.history.replaceState).toHaveBeenCalled();

    // 恢复原始对象
    window.location = originalLocation;
    window.history.replaceState = originalHistory.replaceState;
  });

  it('应该设置家谱数据并更新图表', () => {
    // 模拟loadFamilyTreeFromLocalStorage返回null
    (loadFamilyTreeFromLocalStorage as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useFamilyTree());

    // 调用setFamilyTree
    act(() => {
      result.current.setFamilyTree(mockFamilyTree);
    });

    // 验证家谱数据已设置
    expect(result.current.familyTree).toEqual(mockFamilyTree);
    expect(buildFamilyRelations).toHaveBeenCalledWith(mockFamilyTree.members);
    expect(generateMermaidChart).toHaveBeenCalled();
    expect(saveFamilyTreeToLocalStorage).toHaveBeenCalledWith(mockFamilyTree);
  });

  it('应该生成家谱图表', () => {
    // 模拟loadFamilyTreeFromLocalStorage返回家谱数据
    (loadFamilyTreeFromLocalStorage as jest.Mock).mockReturnValue(mockFamilyTree);

    const { result } = renderHook(() => useFamilyTree());

    // 重置模拟以便验证generateChart调用
    jest.clearAllMocks();

    // 调用generateChart
    act(() => {
      result.current.generateChart();
    });

    // 验证图表已生成
    expect(buildFamilyRelations).toHaveBeenCalledWith(mockFamilyTree.members);
    expect(generateMermaidChart).toHaveBeenCalled();
    expect(result.current.showChart).toBe(true);
  });

  it('当家谱为空时不应该生成图表', () => {
    // 模拟loadFamilyTreeFromLocalStorage返回空家谱
    (loadFamilyTreeFromLocalStorage as jest.Mock).mockReturnValue({
      members: [],
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    });

    const { result } = renderHook(() => useFamilyTree());

    // 重置模拟以便验证generateChart调用
    jest.clearAllMocks();

    // 调用generateChart
    act(() => {
      result.current.generateChart();
    });

    // 验证图表未生成
    expect(buildFamilyRelations).not.toHaveBeenCalled();
    expect(generateMermaidChart).not.toHaveBeenCalled();
  });

  it('应该从数据库加载家谱', async () => {
    // 模拟数据库已配置
    (isDatabaseConfigured as jest.Mock).mockReturnValue(true);

    // 模拟useSearchParams返回id
    const mockGet = jest.fn().mockReturnValue('123');
    jest.mock('next/navigation', () => ({
      useRouter: () => ({
        push: jest.fn(),
      }),
      useSearchParams: () => ({
        get: mockGet,
      }),
    }));

    // 模拟loadFamilyTreeFromDatabase返回家谱数据
    (loadFamilyTreeFromDatabase as jest.Mock).mockResolvedValue(mockFamilyTree);

    // 渲染Hook
    const { result, rerender } = renderHook(() => useFamilyTree());

    // 手动调用loadFromDatabase
    await act(async () => {
      const success = await result.current.loadFromDatabase(123);
      expect(success).toBe(true);
    });

    // 验证家谱数据已加载
    expect(result.current.familyTree).toEqual(mockFamilyTree);
    expect(result.current.showChart).toBe(true);
    expect(buildFamilyRelations).toHaveBeenCalledWith(mockFamilyTree.members);
    expect(generateMermaidChart).toHaveBeenCalled();
  });

  it('应该处理数据库加载错误', async () => {
    // 模拟loadFamilyTreeFromDatabase抛出错误
    (loadFamilyTreeFromDatabase as jest.Mock).mockRejectedValue(new Error('Database error'));

    // 渲染Hook
    const { result } = renderHook(() => useFamilyTree());

    // 手动调用loadFromDatabase
    await act(async () => {
      const success = await result.current.loadFromDatabase(123);
      expect(success).toBe(false);
    });

    // 验证错误已设置
    expect(result.current.error).toBe('Database error');
  });

  it('应该保存家谱到本地存储', () => {
    // 模拟loadFamilyTreeFromLocalStorage返回家谱数据
    (loadFamilyTreeFromLocalStorage as jest.Mock).mockReturnValue(mockFamilyTree);

    const { result } = renderHook(() => useFamilyTree());

    // 重置模拟以便验证saveToLocalStorage调用
    jest.clearAllMocks();

    // 调用saveToLocalStorage
    act(() => {
      result.current.saveToLocalStorage();
    });

    // 验证家谱已保存到本地存储
    expect(saveFamilyTreeToLocalStorage).toHaveBeenCalledWith(mockFamilyTree);
  });
});
