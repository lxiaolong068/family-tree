import React from 'react';
import { render, screen, fireEvent } from '@/lib/test-utils';
import DraggableMember from '../DraggableMember';
import { Member } from '@/types/family-tree';
import { useDraggable } from '@dnd-kit/core';

// 模拟@dnd-kit/core的useDraggable hook
jest.mock('@dnd-kit/core', () => ({
  useDraggable: jest.fn().mockReturnValue({
    attributes: { 'aria-pressed': false },
    listeners: { onKeyDown: jest.fn() },
    setNodeRef: jest.fn(),
    transform: null
  })
}));

describe('DraggableMember组件', () => {
  // 测试数据
  const mockMember: Member = {
    id: 'test-id-1',
    name: '张三',
    relation: '父亲',
    gender: 'male',
    birthDate: '1980-01-01'
  };

  const mockMemberWithParent: Member = {
    ...mockMember,
    parentId: 'parent-id-1'
  };

  // 模拟回调函数
  const mockOnAddChild = jest.fn();
  const mockOnRemoveParent = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    // 重置所有模拟
    jest.clearAllMocks();
  });

  it('应该正确渲染成员信息', () => {
    render(
      <DraggableMember
        member={mockMember}
        onAddChild={mockOnAddChild}
        onRemoveParent={mockOnRemoveParent}
        onDelete={mockOnDelete}
      />
    );

    // 验证成员信息正确显示
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('父亲')).toBeInTheDocument();
    expect(screen.getByText('Birth: 1980-01-01')).toBeInTheDocument();

    // 验证"Add Child"按钮存在
    expect(screen.getByText('Add Child')).toBeInTheDocument();
  });

  it('应该根据性别显示不同的边框颜色', () => {
    const { container } = render(
      <DraggableMember
        member={mockMember}
        onAddChild={mockOnAddChild}
        onRemoveParent={mockOnRemoveParent}
        onDelete={mockOnDelete}
      />
    );

    // 验证男性成员的边框颜色类
    const cardElement = container.querySelector('.border-blue-400');
    expect(cardElement).toBeInTheDocument();

    // 重新渲染女性成员
    const femaleMember: Member = {
      ...mockMember,
      gender: 'female'
    };

    const { container: femaleContainer } = render(
      <DraggableMember
        member={femaleMember}
        onAddChild={mockOnAddChild}
        onRemoveParent={mockOnRemoveParent}
        onDelete={mockOnDelete}
      />
    );

    // 验证女性成员的边框颜色类
    const femaleCardElement = femaleContainer.querySelector('.border-pink-400');
    expect(femaleCardElement).toBeInTheDocument();

    // 重新渲染其他性别成员
    const otherGenderMember: Member = {
      ...mockMember,
      gender: 'other'
    };

    const { container: otherContainer } = render(
      <DraggableMember
        member={otherGenderMember}
        onAddChild={mockOnAddChild}
        onRemoveParent={mockOnRemoveParent}
        onDelete={mockOnDelete}
      />
    );

    // 验证其他性别成员的边框颜色类
    const otherCardElement = otherContainer.querySelector('.border-green-400');
    expect(otherCardElement).toBeInTheDocument();
  });

  it('应该在点击"Add Child"按钮时调用onAddChild', () => {
    render(
      <DraggableMember
        member={mockMember}
        onAddChild={mockOnAddChild}
        onRemoveParent={mockOnRemoveParent}
        onDelete={mockOnDelete}
      />
    );

    // 点击"Add Child"按钮
    const addChildButton = screen.getByText('Add Child');
    fireEvent.click(addChildButton);

    // 验证onAddChild被调用，并且传入了正确的ID
    expect(mockOnAddChild).toHaveBeenCalledTimes(1);
    expect(mockOnAddChild).toHaveBeenCalledWith('test-id-1');
  });

  it('应该在点击删除按钮时调用onDelete', () => {
    render(
      <DraggableMember
        member={mockMember}
        onAddChild={mockOnAddChild}
        onRemoveParent={mockOnRemoveParent}
        onDelete={mockOnDelete}
      />
    );

    // 点击删除按钮（红色X按钮）
    const deleteButton = screen.getByTitle('Delete Member');
    fireEvent.click(deleteButton);

    // 验证onDelete被调用，并且传入了正确的ID
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith('test-id-1');
  });

  it('应该在有parentId时显示移除父关系按钮', () => {
    render(
      <DraggableMember
        member={mockMemberWithParent}
        onAddChild={mockOnAddChild}
        onRemoveParent={mockOnRemoveParent}
        onDelete={mockOnDelete}
      />
    );

    // 验证移除父关系按钮存在
    const removeParentButton = screen.getByTitle('Remove Parent Relation');
    expect(removeParentButton).toBeInTheDocument();

    // 点击移除父关系按钮
    fireEvent.click(removeParentButton);

    // 验证onRemoveParent被调用，并且传入了正确的ID
    expect(mockOnRemoveParent).toHaveBeenCalledTimes(1);
    expect(mockOnRemoveParent).toHaveBeenCalledWith('test-id-1');
  });

  it('应该在isRoot为true时不显示移除父关系按钮', () => {
    render(
      <DraggableMember
        member={mockMemberWithParent}
        isRoot={true}
        onAddChild={mockOnAddChild}
        onRemoveParent={mockOnRemoveParent}
        onDelete={mockOnDelete}
      />
    );

    // 验证移除父关系按钮不存在
    const removeParentButton = screen.queryByTitle('Remove Parent Relation');
    expect(removeParentButton).not.toBeInTheDocument();
  });

  it('应该在isActive为true时应用活动样式', () => {
    const { container } = render(
      <DraggableMember
        member={mockMember}
        isActive={true}
        onAddChild={mockOnAddChild}
        onRemoveParent={mockOnRemoveParent}
        onDelete={mockOnDelete}
      />
    );

    // 验证活动样式类被应用
    const activeElement = container.querySelector('.opacity-75.scale-105');
    expect(activeElement).toBeInTheDocument();

    // 验证卡片阴影样式被应用
    const shadowElement = container.querySelector('.shadow-lg');
    expect(shadowElement).toBeInTheDocument();
  });

  it('应该在isOver为true时应用悬停样式', () => {
    const { container } = render(
      <DraggableMember
        member={mockMember}
        isOver={true}
        onAddChild={mockOnAddChild}
        onRemoveParent={mockOnRemoveParent}
        onDelete={mockOnDelete}
      />
    );

    // 验证悬停样式类被应用
    const overElement = container.querySelector('.ring-2.ring-primary.ring-offset-2');
    expect(overElement).toBeInTheDocument();
  });

  it('应该在transform不为null时调用setNodeRef', () => {
    // 创建一个模拟的setNodeRef函数
    const mockSetNodeRef = jest.fn();

    // 模拟transform值
    (useDraggable as jest.Mock).mockReturnValueOnce({
      attributes: { 'aria-pressed': false },
      listeners: { onKeyDown: jest.fn() },
      setNodeRef: mockSetNodeRef,
      transform: { x: 10, y: 20 }
    });

    render(
      <DraggableMember
        member={mockMember}
        onAddChild={mockOnAddChild}
        onRemoveParent={mockOnRemoveParent}
        onDelete={mockOnDelete}
      />
    );

    // 验证setNodeRef被调用
    expect(mockSetNodeRef).toHaveBeenCalled();

    // 验证useDraggable被调用时传入了正确的参数
    expect(useDraggable).toHaveBeenCalledWith({
      id: mockMember.id,
      data: {
        member: mockMember
      }
    });
  });

  it('应该在isActive为true时应用不同的样式类', () => {
    // 模拟transform值
    (useDraggable as jest.Mock).mockReturnValueOnce({
      attributes: { 'aria-pressed': false },
      listeners: { onKeyDown: jest.fn() },
      setNodeRef: jest.fn(),
      transform: { x: 10, y: 20 }
    });

    const { container } = render(
      <DraggableMember
        member={mockMember}
        isActive={true}
        onAddChild={mockOnAddChild}
        onRemoveParent={mockOnRemoveParent}
        onDelete={mockOnDelete}
      />
    );

    // 验证活动样式类被应用
    const activeElement = container.querySelector('.opacity-75.scale-105');
    expect(activeElement).toBeInTheDocument();

    // 验证卡片阴影样式被应用
    const shadowElement = container.querySelector('.shadow-lg');
    expect(shadowElement).toBeInTheDocument();
  });
});
