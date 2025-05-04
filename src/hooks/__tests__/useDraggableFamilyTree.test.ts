import { renderHook, act } from '@testing-library/react';
import { FamilyTree, Member } from '@/types/family-tree';
import { useDraggableFamilyTree } from '../useDraggableFamilyTree';
import { generateUniqueId } from '@/lib/family-tree-utils';

// 模拟generateUniqueId函数
jest.mock('@/lib/family-tree-utils', () => ({
  generateUniqueId: jest.fn().mockReturnValue('mock-id-123')
}));

describe('useDraggableFamilyTree Hook测试', () => {
  // 测试数据
  const mockFamilyTree: FamilyTree = {
    members: [
      { id: 'member-1', name: '张三', relation: '父亲' },
      { id: 'member-2', name: '李四', relation: '母亲' },
      { id: 'member-3', name: '王五', relation: '儿子' }
    ],
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  };

  // 模拟更新回调
  const mockUpdateFamilyTree = jest.fn();

  beforeEach(() => {
    // 重置所有模拟
    jest.clearAllMocks();
  });

  it('应该初始化状态', () => {
    const { result } = renderHook(() => 
      useDraggableFamilyTree(mockFamilyTree, mockUpdateFamilyTree)
    );
    
    expect(result.current.activeMemberId).toBeNull();
    expect(result.current.overMemberId).toBeNull();
  });

  it('应该处理拖拽开始', () => {
    const { result } = renderHook(() => 
      useDraggableFamilyTree(mockFamilyTree, mockUpdateFamilyTree)
    );
    
    // 调用handleDragStart
    act(() => {
      result.current.handleDragStart('member-1');
    });
    
    // 验证状态
    expect(result.current.activeMemberId).toBe('member-1');
  });

  it('应该处理拖拽悬停', () => {
    const { result } = renderHook(() => 
      useDraggableFamilyTree(mockFamilyTree, mockUpdateFamilyTree)
    );
    
    // 调用handleDragOver
    act(() => {
      result.current.handleDragOver('member-2');
    });
    
    // 验证状态
    expect(result.current.overMemberId).toBe('member-2');
  });

  it('应该处理拖拽结束（无效拖拽）', () => {
    const { result } = renderHook(() => 
      useDraggableFamilyTree(mockFamilyTree, mockUpdateFamilyTree)
    );
    
    // 调用handleDragEnd，没有设置activeMemberId和overMemberId
    act(() => {
      result.current.handleDragEnd();
    });
    
    // 验证updateFamilyTree没有被调用
    expect(mockUpdateFamilyTree).not.toHaveBeenCalled();
  });

  it('应该处理拖拽结束（有效拖拽）', () => {
    const { result } = renderHook(() => 
      useDraggableFamilyTree(mockFamilyTree, mockUpdateFamilyTree)
    );
    
    // 设置拖拽状态
    act(() => {
      result.current.handleDragStart('member-3');
      result.current.handleDragOver('member-1');
    });
    
    // 调用handleDragEnd
    act(() => {
      result.current.handleDragEnd();
    });
    
    // 验证updateFamilyTree被调用，并且成员关系已更新
    expect(mockUpdateFamilyTree).toHaveBeenCalledWith({
      ...mockFamilyTree,
      members: expect.arrayContaining([
        expect.objectContaining({
          id: 'member-3',
          parentId: 'member-1'
        })
      ]),
      updatedAt: expect.any(String)
    });
    
    // 验证状态已重置
    expect(result.current.activeMemberId).toBeNull();
    expect(result.current.overMemberId).toBeNull();
  });

  it('不应该处理相同成员的拖拽', () => {
    const { result } = renderHook(() => 
      useDraggableFamilyTree(mockFamilyTree, mockUpdateFamilyTree)
    );
    
    // 设置拖拽状态（相同成员）
    act(() => {
      result.current.handleDragStart('member-1');
      result.current.handleDragOver('member-1');
    });
    
    // 调用handleDragEnd
    act(() => {
      result.current.handleDragEnd();
    });
    
    // 验证updateFamilyTree没有被调用
    expect(mockUpdateFamilyTree).not.toHaveBeenCalled();
  });

  it('应该添加子成员', () => {
    const { result } = renderHook(() => 
      useDraggableFamilyTree(mockFamilyTree, mockUpdateFamilyTree)
    );
    
    // 调用addChildMember
    let newMember;
    act(() => {
      newMember = result.current.addChildMember('member-1', {
        name: '小明',
        relation: '儿子',
        gender: 'male'
      });
    });
    
    // 验证返回的新成员
    expect(newMember).toEqual({
      id: 'mock-id-123',
      name: '小明',
      relation: '儿子',
      gender: 'male',
      parentId: 'member-1'
    });
    
    // 验证generateUniqueId被调用
    expect(generateUniqueId).toHaveBeenCalled();
    
    // 验证updateFamilyTree被调用，并且新成员已添加
    expect(mockUpdateFamilyTree).toHaveBeenCalledWith({
      ...mockFamilyTree,
      members: [...mockFamilyTree.members, newMember],
      updatedAt: expect.any(String)
    });
  });

  it('应该使用默认值添加子成员', () => {
    const { result } = renderHook(() => 
      useDraggableFamilyTree(mockFamilyTree, mockUpdateFamilyTree)
    );
    
    // 调用addChildMember，只提供部分数据
    let newMember;
    act(() => {
      newMember = result.current.addChildMember('member-1', {});
    });
    
    // 验证返回的新成员使用了默认值
    expect(newMember).toEqual({
      id: 'mock-id-123',
      name: 'New Member',
      relation: 'Child',
      gender: 'male',
      parentId: 'member-1'
    });
  });

  it('应该移除父子关系', () => {
    // 创建带有父子关系的家谱
    const familyTreeWithRelation: FamilyTree = {
      ...mockFamilyTree,
      members: [
        { id: 'member-1', name: '张三', relation: '父亲' },
        { id: 'member-2', name: '李四', relation: '母亲' },
        { id: 'member-3', name: '王五', relation: '儿子', parentId: 'member-1' }
      ]
    };
    
    const { result } = renderHook(() => 
      useDraggableFamilyTree(familyTreeWithRelation, mockUpdateFamilyTree)
    );
    
    // 调用removeParentRelation
    act(() => {
      result.current.removeParentRelation('member-3');
    });
    
    // 验证updateFamilyTree被调用，并且父子关系已移除
    expect(mockUpdateFamilyTree).toHaveBeenCalledWith({
      ...familyTreeWithRelation,
      members: expect.arrayContaining([
        expect.objectContaining({
          id: 'member-3',
          name: '王五',
          relation: '儿子'
          // parentId应该被移除
        })
      ]),
      updatedAt: expect.any(String)
    });
    
    // 验证调用updateFamilyTree时，member-3没有parentId属性
    const updatedMembers = mockUpdateFamilyTree.mock.calls[0][0].members;
    const updatedMember3 = updatedMembers.find((m: Member) => m.id === 'member-3');
    expect(updatedMember3).not.toHaveProperty('parentId');
  });
});
