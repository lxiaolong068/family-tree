import React from 'react';
import { render, screen, waitFor, act } from '@/lib/test-utils';
import FamilyTreeList from '../FamilyTreeList';

// 模拟fetch响应
const mockFetch = (mockData: any, ok = true) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    json: jest.fn().mockResolvedValue(mockData)
  });
};

describe('FamilyTreeList组件', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应初始化后显示家谱列表', async () => {
    // 模拟家谱API响应
    mockFetch({ familyTrees: [] });
    
    // 渲染组件
    const { waitForChanges } = render(<FamilyTreeList userId="test-user" />);
    
    // 等待状态更新
    await waitForChanges();
    
    // 检查空家谱状态是否显示
    expect(screen.getByText('You haven\'t created any family trees yet.')).toBeInTheDocument();
  });

  it('当没有家谱时显示空状态', async () => {
    // 模拟空家谱列表
    mockFetch({ familyTrees: [] });
    
    const { waitForChanges } = render(<FamilyTreeList userId="test-user" />);
    
    // 等待状态更新
    await waitForChanges();
    
    // 等待API响应完成
    await waitFor(() => {
      expect(screen.getByText('You haven\'t created any family trees yet.')).toBeInTheDocument();
    });
    
    // 检查"创建"按钮
    expect(screen.getByText('Create Your First Family Tree')).toBeInTheDocument();
  });

  it('正确显示家谱列表', async () => {
    // 模拟有家谱的响应
    const mockTrees = [
      { id: 1, name: 'Test Family 1' },
      { id: 2, name: 'Test Family 2' }
    ];
    
    mockFetch({ familyTrees: mockTrees });
    
    const { waitForChanges } = render(<FamilyTreeList userId="test-user" />);
    
    // 等待状态更新
    await waitForChanges();
    
    // 等待API响应完成并检查家谱名称是否显示
    await waitFor(() => {
      expect(screen.getByText('Test Family 1')).toBeInTheDocument();
      expect(screen.getByText('Test Family 2')).toBeInTheDocument();
    });
    
    // 检查查看按钮数量是否正确
    const viewButtons = screen.getAllByText('View');
    expect(viewButtons).toHaveLength(2);
  });

  it('处理API错误', async () => {
    // 模拟API错误
    mockFetch({ error: 'Failed to load' }, false);
    
    const { waitForChanges } = render(<FamilyTreeList userId="test-user" />);
    
    // 等待状态更新
    await waitForChanges();
    
    // 等待错误消息显示
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
    
    // 检查错误消息中是否包含"Failed to fetch"
    expect(screen.getByText(/Failed to fetch family trees/)).toBeInTheDocument();
    
    // 检查是否有Dismiss按钮
    expect(screen.getByText('Dismiss')).toBeInTheDocument();
  });

  it('当userId为空时不应调用API', async () => {
    const { waitForChanges } = render(<FamilyTreeList userId="" />);
    
    // 等待状态更新
    await waitForChanges();
    
    // 等待组件完成加载
    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled();
    });
    
    // 检查是否显示空状态
    expect(screen.getByText('You haven\'t created any family trees yet.')).toBeInTheDocument();
  });
});
