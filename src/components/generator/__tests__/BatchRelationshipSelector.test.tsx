import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BatchRelationshipSelector from '../BatchRelationshipSelector';
import { Member, RelationType } from '@/types/family-tree';
import userEvent from '@testing-library/user-event';

// 模拟数据
const mockMember: Member = {
  id: 'member-1',
  name: 'John Doe',
  relation: 'Father',
  gender: 'male',
  relationships: []
};

const mockAvailableMembers: Member[] = [
  {
    id: 'member-2',
    name: 'Jane Doe',
    relation: 'Mother',
    gender: 'female'
  },
  {
    id: 'member-3',
    name: 'Jimmy Doe',
    relation: 'Son',
    gender: 'male'
  },
  {
    id: 'member-4',
    name: 'Jenny Doe',
    relation: 'Daughter',
    gender: 'female'
  }
];

// 模拟函数
const mockOnClose = jest.fn();
const mockOnAddRelationships = jest.fn();

describe('BatchRelationshipSelector组件', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该正确渲染组件', () => {
    render(
      <BatchRelationshipSelector
        isOpen={true}
        onClose={mockOnClose}
        member={mockMember}
        availableMembers={mockAvailableMembers}
        onAddRelationships={mockOnAddRelationships}
      />
    );

    // 验证标题
    expect(screen.getByText(/Batch Add Relationships for John Doe/i)).toBeInTheDocument();
    
    // 验证关系类型选择器
    expect(screen.getByText(/Relationship/i)).toBeInTheDocument();
    
    // 验证描述输入框
    expect(screen.getByPlaceholderText(/Optional description/i)).toBeInTheDocument();
    
    // 验证成员列表
    expect(screen.getByText(/Members/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Doe \(Mother\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Jimmy Doe \(Son\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Jenny Doe \(Daughter\)/i)).toBeInTheDocument();
    
    // 验证按钮
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
    expect(screen.getByText(/Add 0 Relationships/i)).toBeInTheDocument();
  });

  it('应该过滤掉已有相同关系类型的成员', () => {
    // 创建一个已有关系的成员
    const memberWithRelationships: Member = {
      ...mockMember,
      relationships: [
        {
          type: RelationType.CHILD,
          targetId: 'member-3',
          description: 'Son'
        }
      ]
    };

    render(
      <BatchRelationshipSelector
        isOpen={true}
        onClose={mockOnClose}
        member={memberWithRelationships}
        availableMembers={mockAvailableMembers}
        onAddRelationships={mockOnAddRelationships}
      />
    );

    // Jimmy Doe应该被过滤掉，因为已经有CHILD关系
    expect(screen.getByText(/Jane Doe \(Mother\)/i)).toBeInTheDocument();
    expect(screen.queryByText(/Jimmy Doe \(Son\)/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Jenny Doe \(Daughter\)/i)).toBeInTheDocument();
  });

  it('应该允许选择成员并显示选中的成员', async () => {
    const user = userEvent.setup();
    
    render(
      <BatchRelationshipSelector
        isOpen={true}
        onClose={mockOnClose}
        member={mockMember}
        availableMembers={mockAvailableMembers}
        onAddRelationships={mockOnAddRelationships}
      />
    );

    // 选择第一个成员
    const firstCheckbox = screen.getByLabelText(/Jane Doe \(Mother\)/i);
    await user.click(firstCheckbox);

    // 验证选中状态
    expect(firstCheckbox).toBeChecked();
    
    // 验证选中的成员显示在上方
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    
    // 验证按钮文本更新
    expect(screen.getByText(/Add 1 Relationship/i)).toBeInTheDocument();
    
    // 再选择一个成员
    const secondCheckbox = screen.getByLabelText(/Jenny Doe \(Daughter\)/i);
    await user.click(secondCheckbox);
    
    // 验证按钮文本再次更新
    expect(screen.getByText(/Add 2 Relationships/i)).toBeInTheDocument();
    
    // 取消选择第一个成员
    await user.click(firstCheckbox);
    
    // 验证按钮文本更新
    expect(screen.getByText(/Add 1 Relationship/i)).toBeInTheDocument();
  });

  it('应该允许更改关系类型', async () => {
    const user = userEvent.setup();
    
    render(
      <BatchRelationshipSelector
        isOpen={true}
        onClose={mockOnClose}
        member={mockMember}
        availableMembers={mockAvailableMembers}
        onAddRelationships={mockOnAddRelationships}
      />
    );

    // 打开关系类型下拉菜单
    const selectTrigger = screen.getByRole('combobox');
    await user.click(selectTrigger);
    
    // 选择"Parent"关系类型
    const parentOption = screen.getByText('Parent');
    await user.click(parentOption);
    
    // 选择一个成员
    const checkbox = screen.getByLabelText(/Jane Doe \(Mother\)/i);
    await user.click(checkbox);
    
    // 提交表单
    const submitButton = screen.getByText(/Add 1 Relationship/i);
    await user.click(submitButton);
    
    // 验证onAddRelationships被调用，并且关系类型是PARENT
    expect(mockOnAddRelationships).toHaveBeenCalledWith(
      'member-1',
      [
        {
          type: RelationType.PARENT,
          targetId: 'member-2',
          description: undefined
        }
      ]
    );
  });

  it('应该允许添加描述', async () => {
    const user = userEvent.setup();
    
    render(
      <BatchRelationshipSelector
        isOpen={true}
        onClose={mockOnClose}
        member={mockMember}
        availableMembers={mockAvailableMembers}
        onAddRelationships={mockOnAddRelationships}
      />
    );

    // 输入描述
    const descriptionInput = screen.getByPlaceholderText(/Optional description/i);
    await user.type(descriptionInput, 'Test description');
    
    // 选择一个成员
    const checkbox = screen.getByLabelText(/Jane Doe \(Mother\)/i);
    await user.click(checkbox);
    
    // 提交表单
    const submitButton = screen.getByText(/Add 1 Relationship/i);
    await user.click(submitButton);
    
    // 验证onAddRelationships被调用，并且包含描述
    expect(mockOnAddRelationships).toHaveBeenCalledWith(
      'member-1',
      [
        {
          type: RelationType.CHILD,
          targetId: 'member-2',
          description: 'Test description'
        }
      ]
    );
  });

  it('应该在关闭时重置表单', async () => {
    const user = userEvent.setup();
    
    render(
      <BatchRelationshipSelector
        isOpen={true}
        onClose={mockOnClose}
        member={mockMember}
        availableMembers={mockAvailableMembers}
        onAddRelationships={mockOnAddRelationships}
      />
    );

    // 输入描述
    const descriptionInput = screen.getByPlaceholderText(/Optional description/i);
    await user.type(descriptionInput, 'Test description');
    
    // 选择一个成员
    const checkbox = screen.getByLabelText(/Jane Doe \(Mother\)/i);
    await user.click(checkbox);
    
    // 点击取消按钮
    const cancelButton = screen.getByText(/Cancel/i);
    await user.click(cancelButton);
    
    // 验证onClose被调用
    expect(mockOnClose).toHaveBeenCalled();
    
    // 重新渲染组件
    render(
      <BatchRelationshipSelector
        isOpen={true}
        onClose={mockOnClose}
        member={mockMember}
        availableMembers={mockAvailableMembers}
        onAddRelationships={mockOnAddRelationships}
      />
    );
    
    // 验证表单已重置
    expect(screen.getByPlaceholderText(/Optional description/i)).toHaveValue('');
    expect(screen.getByText(/No members selected/i)).toBeInTheDocument();
  });

  it('当没有可用成员时应该显示提示信息', () => {
    render(
      <BatchRelationshipSelector
        isOpen={true}
        onClose={mockOnClose}
        member={mockMember}
        availableMembers={[]}
        onAddRelationships={mockOnAddRelationships}
      />
    );

    // 验证提示信息
    expect(screen.getByText(/No available members to create relationships with/i)).toBeInTheDocument();
    
    // 验证提交按钮被禁用
    const submitButton = screen.getByText(/Add 0 Relationships/i);
    expect(submitButton).toBeDisabled();
  });
});
