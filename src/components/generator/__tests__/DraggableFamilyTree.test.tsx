import React from 'react';
import { render, screen, fireEvent, act } from '@/lib/test-utils';
import DraggableFamilyTree from '../DraggableFamilyTree';
import { FamilyTree } from '@/types/family-tree';
import { useDraggableFamilyTree } from '@/hooks/useDraggableFamilyTree';

// 模拟useDraggableFamilyTree hook
jest.mock('@/hooks/useDraggableFamilyTree', () => ({
  useDraggableFamilyTree: jest.fn()
}));

// 模拟DndContext组件
jest.mock('@dnd-kit/core', () => {
  return {
    DndContext: ({ children, onDragStart, onDragEnd, onDragOver }: any) => {
      // 存储事件处理函数，以便测试可以访问
      (global as any).dndHandlers = {
        onDragStart,
        onDragEnd,
        onDragOver
      };
      return (
        <div data-testid="mock-dnd-context">
          {children}
        </div>
      );
    },
    DragStartEvent: jest.fn(),
    DragEndEvent: jest.fn(),
    DragOverEvent: jest.fn()
  };
});

// 模拟DraggableMember组件
jest.mock('../DraggableMember', () => {
  return jest.fn().mockImplementation(({ member, isRoot, isActive, isOver, onAddChild, onRemoveParent, onDelete }) => (
    <div
      data-testid={`mock-draggable-member-${member.id}`}
      data-member-id={member.id}
      data-is-root={isRoot}
      data-is-active={isActive}
      data-is-over={isOver}
    >
      <div>{member.name}</div>
      <button
        data-testid={`add-child-${member.id}`}
        onClick={() => onAddChild(member.id)}
      >
        Add Child
      </button>
      {member.parentId && (
        <button
          data-testid={`remove-parent-${member.id}`}
          onClick={() => onRemoveParent(member.id)}
        >
          Remove Parent
        </button>
      )}
      <button
        data-testid={`delete-member-${member.id}`}
        onClick={() => onDelete(member.id)}
      >
        Delete
      </button>
    </div>
  ));
});

// 模拟DroppableArea组件
jest.mock('../DroppableArea', () => {
  return jest.fn().mockImplementation(({ id, children }) => (
    <div data-testid={`mock-droppable-area-${id}`} data-area-id={id}>
      {children}
    </div>
  ));
});

describe('DraggableFamilyTree组件', () => {
  // 测试数据
  const mockFamilyTree: FamilyTree = {
    members: [
      { id: 'member-1', name: '张三', relation: '父亲' },
      { id: 'member-2', name: '李四', relation: '母亲' },
      { id: 'member-3', name: '王五', relation: '儿子', parentId: 'member-1' }
    ],
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  };

  // 模拟回调函数
  const mockUpdateFamilyTree = jest.fn();

  // 模拟useDraggableFamilyTree返回值
  const mockHandleDragStart = jest.fn();
  const mockHandleDragEnd = jest.fn();
  const mockHandleDragOver = jest.fn();
  const mockAddChildMember = jest.fn();
  const mockRemoveParentRelation = jest.fn();

  beforeEach(() => {
    // 重置所有模拟
    jest.clearAllMocks();

    // 设置useDraggableFamilyTree的默认返回值
    (useDraggableFamilyTree as jest.Mock).mockReturnValue({
      activeMemberId: null,
      overMemberId: null,
      handleDragStart: mockHandleDragStart,
      handleDragEnd: mockHandleDragEnd,
      handleDragOver: mockHandleDragOver,
      addChildMember: mockAddChildMember,
      removeParentRelation: mockRemoveParentRelation
    });
  });

  it('应该正确渲染家谱成员', () => {
    render(
      <DraggableFamilyTree
        familyTree={mockFamilyTree}
        onUpdateFamilyTree={mockUpdateFamilyTree}
      />
    );

    // 验证标题渲染正确
    expect(screen.getByText('Drag & Drop Family Tree Editor')).toBeInTheDocument();

    // 验证DndContext被渲染
    expect(screen.getByTestId('mock-dnd-context')).toBeInTheDocument();

    // 验证所有成员被渲染
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('李四')).toBeInTheDocument();
    expect(screen.getByText('王五')).toBeInTheDocument();

    // 验证DroppableArea被渲染
    expect(screen.getByTestId('mock-droppable-area-member-1')).toBeInTheDocument();
    expect(screen.getByTestId('mock-droppable-area-member-2')).toBeInTheDocument();
    expect(screen.getByTestId('mock-droppable-area-member-3')).toBeInTheDocument();

    // 验证DraggableMember被渲染
    expect(screen.getByTestId('mock-draggable-member-member-1')).toBeInTheDocument();
    expect(screen.getByTestId('mock-draggable-member-member-2')).toBeInTheDocument();
    expect(screen.getByTestId('mock-draggable-member-member-3')).toBeInTheDocument();
  });

  it('应该在没有成员时显示添加第一个成员按钮', () => {
    const emptyFamilyTree: FamilyTree = {
      members: [],
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z'
    };

    render(
      <DraggableFamilyTree
        familyTree={emptyFamilyTree}
        onUpdateFamilyTree={mockUpdateFamilyTree}
      />
    );

    // 验证空状态提示 - 使用部分文本匹配
    expect(screen.getByText(/No family members yet/)).toBeInTheDocument();

    // 验证添加第一个成员按钮
    expect(screen.getByText('Add First Member')).toBeInTheDocument();
  });

  it('应该在点击添加第一个成员按钮时打开对话框', async () => {
    const emptyFamilyTree: FamilyTree = {
      members: [],
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z'
    };

    render(
      <DraggableFamilyTree
        familyTree={emptyFamilyTree}
        onUpdateFamilyTree={mockUpdateFamilyTree}
      />
    );

    // 点击添加第一个成员按钮
    await act(async () => {
      // 使用更具体的选择器，避免匹配多个元素
      const addButton = screen.getByRole('button', { name: 'Add First Member' });
      fireEvent.click(addButton);
    });

    // 验证对话框打开
    // 使用更具体的选择器，避免匹配多个元素
    const dialogTitle = screen.getAllByRole('heading', { name: 'Add First Member' })[0];
    expect(dialogTitle).toBeInTheDocument();

    // 验证表单字段
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Relationship')).toBeInTheDocument();
    expect(screen.getByText('Gender')).toBeInTheDocument();
    expect(screen.getByLabelText('Birth Date')).toBeInTheDocument();
  });

  it('应该在点击添加子成员按钮时打开对话框', async () => {
    render(
      <DraggableFamilyTree
        familyTree={mockFamilyTree}
        onUpdateFamilyTree={mockUpdateFamilyTree}
      />
    );

    // 点击添加子成员按钮
    await act(async () => {
      // 使用更具体的选择器
      const addChildButton = screen.getByTestId('add-child-member-1');
      fireEvent.click(addChildButton);
    });

    // 验证对话框打开
    // 使用更具体的选择器，避免匹配多个元素
    const dialogTitle = screen.getAllByRole('heading', { name: 'Add Child' })[0];
    expect(dialogTitle).toBeInTheDocument();

    // 验证表单字段
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Relationship')).toBeInTheDocument();
    expect(screen.getByText('Gender')).toBeInTheDocument();
    expect(screen.getByLabelText('Birth Date')).toBeInTheDocument();
  });

  it('应该在提交新成员表单时调用addChildMember', async () => {
    render(
      <DraggableFamilyTree
        familyTree={mockFamilyTree}
        onUpdateFamilyTree={mockUpdateFamilyTree}
      />
    );

    // 点击添加子成员按钮
    await act(async () => {
      fireEvent.click(screen.getByTestId('add-child-member-1'));
    });

    // 填写表单
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Name'), { target: { value: '小明' } });
      fireEvent.change(screen.getByLabelText('Relationship'), { target: { value: '儿子' } });
      // 性别默认为male，不需要修改
      fireEvent.change(screen.getByLabelText('Birth Date'), { target: { value: '2000-01-01' } });
    });

    // 点击添加按钮
    await act(async () => {
      fireEvent.click(screen.getByText('Add'));
    });

    // 验证addChildMember被调用，并且传入了正确的参数
    expect(mockAddChildMember).toHaveBeenCalledWith('member-1', {
      name: '小明',
      relation: '儿子',
      gender: 'male',
      birthDate: '2000-01-01'
    });
  });

  it('应该在点击删除成员按钮时删除成员', async () => {
    render(
      <DraggableFamilyTree
        familyTree={mockFamilyTree}
        onUpdateFamilyTree={mockUpdateFamilyTree}
      />
    );

    // 点击删除成员按钮
    await act(async () => {
      fireEvent.click(screen.getByTestId('delete-member-member-3'));
    });

    // 验证onUpdateFamilyTree被调用，并且传入了正确的参数
    expect(mockUpdateFamilyTree).toHaveBeenCalledWith({
      ...mockFamilyTree,
      members: expect.arrayContaining([
        expect.objectContaining({ id: 'member-1' }),
        expect.objectContaining({ id: 'member-2' })
      ]),
      updatedAt: expect.any(String)
    });

    // 验证被删除的成员不在更新后的家谱中
    const updatedMembers = mockUpdateFamilyTree.mock.calls[0][0].members;
    expect(updatedMembers.find(m => m.id === 'member-3')).toBeUndefined();
  });

  it('应该在点击移除父关系按钮时调用removeParentRelation', async () => {
    render(
      <DraggableFamilyTree
        familyTree={mockFamilyTree}
        onUpdateFamilyTree={mockUpdateFamilyTree}
      />
    );

    // 点击移除父关系按钮
    await act(async () => {
      fireEvent.click(screen.getByTestId('remove-parent-member-3'));
    });

    // 验证removeParentRelation被调用，并且传入了正确的参数
    expect(mockRemoveParentRelation).toHaveBeenCalledWith('member-3');
  });

  it('应该在拖拽开始时调用handleDragStart', () => {
    render(
      <DraggableFamilyTree
        familyTree={mockFamilyTree}
        onUpdateFamilyTree={mockUpdateFamilyTree}
      />
    );

    // 使用全局存储的事件处理函数
    const handlers = (global as any).dndHandlers;

    // 模拟拖拽开始事件
    if (handlers && handlers.onDragStart) {
      handlers.onDragStart({ active: { id: 'member-1' } });
    }

    // 验证handleDragStart被调用，并且传入了正确的参数
    expect(mockHandleDragStart).toHaveBeenCalledWith('member-1');
  });

  it('应该在拖拽结束时调用handleDragEnd', () => {
    render(
      <DraggableFamilyTree
        familyTree={mockFamilyTree}
        onUpdateFamilyTree={mockUpdateFamilyTree}
      />
    );

    // 使用全局存储的事件处理函数
    const handlers = (global as any).dndHandlers;

    // 模拟拖拽结束事件
    if (handlers && handlers.onDragEnd) {
      handlers.onDragEnd({});
    }

    // 验证handleDragEnd被调用
    expect(mockHandleDragEnd).toHaveBeenCalled();
  });

  it('应该在拖拽悬停时调用handleDragOver', () => {
    render(
      <DraggableFamilyTree
        familyTree={mockFamilyTree}
        onUpdateFamilyTree={mockUpdateFamilyTree}
      />
    );

    // 使用全局存储的事件处理函数
    const handlers = (global as any).dndHandlers;

    // 模拟拖拽悬停事件
    if (handlers && handlers.onDragOver) {
      handlers.onDragOver({ over: { id: 'member-2' } });
    }

    // 验证handleDragOver被调用，并且传入了正确的参数
    expect(mockHandleDragOver).toHaveBeenCalledWith('member-2');
  });

  it('应该正确渲染活动和悬停状态', () => {
    // 设置活动和悬停状态
    (useDraggableFamilyTree as jest.Mock).mockReturnValue({
      activeMemberId: 'member-1',
      overMemberId: 'member-2',
      handleDragStart: mockHandleDragStart,
      handleDragEnd: mockHandleDragEnd,
      handleDragOver: mockHandleDragOver,
      addChildMember: mockAddChildMember,
      removeParentRelation: mockRemoveParentRelation
    });

    render(
      <DraggableFamilyTree
        familyTree={mockFamilyTree}
        onUpdateFamilyTree={mockUpdateFamilyTree}
      />
    );

    // 验证活动状态
    const activeMember = screen.getByTestId('mock-draggable-member-member-1');
    expect(activeMember.getAttribute('data-is-active')).toBe('true');

    // 验证悬停状态
    const overMember = screen.getByTestId('mock-draggable-member-member-2');
    expect(overMember.getAttribute('data-is-over')).toBe('true');
  });

  it('应该正确识别根节点成员', () => {
    render(
      <DraggableFamilyTree
        familyTree={mockFamilyTree}
        onUpdateFamilyTree={mockUpdateFamilyTree}
      />
    );

    // 验证根节点成员
    const rootMember1 = screen.getByTestId('mock-draggable-member-member-1');
    expect(rootMember1.getAttribute('data-is-root')).toBe('true');

    const rootMember2 = screen.getByTestId('mock-draggable-member-member-2');
    expect(rootMember2.getAttribute('data-is-root')).toBe('true');

    // 验证非根节点成员
    const childMember = screen.getByTestId('mock-draggable-member-member-3');
    expect(childMember.getAttribute('data-is-root')).toBe('false');
  });
});
