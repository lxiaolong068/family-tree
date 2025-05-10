import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BatchRelationshipSelector, { type BatchRelationshipSelectorProps } from '../BatchRelationshipSelector';
import { RelationType, type Member } from '@/types/family-tree';
import { useFamilyMembersStore } from '@/stores/familyMembers'; // Path to be confirmed

// Mocks
const mockOnClose = jest.fn();
const mockOnAddRelationships = jest.fn();
const mockMember: Member = { id: 'member-1', name: 'John Doe', gender: 'male', relation: 'self' }; // Added relation

jest.mock('@/stores/familyMembers', () => ({ // Path to be confirmed
  useFamilyMembersStore: jest.fn(() => ({
    familyMembers: [
      { id: 'member-1', name: 'John Doe', gender: 'male', relation: 'self' }, // Added relation
      { id: 'member-2', name: 'Jane Doe', gender: 'female', relation: 'spouse', relationships: [{ targetId: 'member-1', type: RelationType.SPOUSE, description: '' }] }, // Added relation
      { id: 'member-3', name: 'Jimmy Doe', gender: 'male', relation: 'child' }, // Added relation
      { id: 'member-4', name: 'Jenny Doe', gender: 'female', relation: 'child' }, // Added relation
    ],
    addRelationshipsToMember: jest.fn(),
    getMemberById: (id: string) => {
      const members: Member[] = [ // Added Member[] type
        { id: 'member-1', name: 'John Doe', gender: 'male', relation: 'self' }, // Added relation
        { id: 'member-2', name: 'Jane Doe', gender: 'female', relation: 'spouse', relationships: [{ targetId: 'member-1', type: RelationType.SPOUSE, description: '' }] }, // Added relation
        { id: 'member-3', name: 'Jimmy Doe', gender: 'male', relation: 'child' }, // Added relation
        { id: 'member-4', name: 'Jenny Doe', gender: 'female', relation: 'child' }, // Added relation
      ];
      return members.find(m => m.id === id);
    }
  })),
}));

beforeEach(() => {
  mockOnClose.mockClear();
  mockOnAddRelationships.mockClear();
  const store = useFamilyMembersStore();
  (store.addRelationshipsToMember as jest.Mock).mockClear();
});

describe('BatchRelationshipSelector组件', () => {
  describe('rendering', () => {
    it('should correctly render component', () => {
      render(
        <BatchRelationshipSelector
          isOpen={true}
          onClose={mockOnClose}
          member={mockMember}
          availableMembers={useFamilyMembersStore().familyMembers}
          onAddRelationships={mockOnAddRelationships}
        />,
      );
      // Check dialog title
      expect(screen.getByRole('heading', { name: /Batch Add Relationships for John Doe/i })).toBeInTheDocument();
      // Check main action button (text can be "Add 0 Relationships", "Add 1 Relationship", etc.)
      expect(screen.getByRole('button', { name: /Add \\d+ Relationship(s)?/i })).toBeInTheDocument();

      // Check form elements
      // Check relationship type label and default value in combobox
      expect(screen.getByText(/^Relationship$/i)).toBeInTheDocument(); 
      expect(screen.getByRole('combobox', { name: /Relationship/i })).toHaveTextContent(/Child/i);
      
      expect(screen.getByLabelText(/Optional description/i)).toBeInTheDocument();
      expect(screen.getByText(/Select members to add relationships to/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    });
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
        availableMembers={useFamilyMembersStore().familyMembers}
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
        availableMembers={useFamilyMembersStore().familyMembers}
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
        availableMembers={useFamilyMembersStore().familyMembers}
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
        availableMembers={useFamilyMembersStore().familyMembers}
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
    const { rerender } = render(
      <BatchRelationshipSelector
        isOpen={true}
        onClose={mockOnClose}
        member={mockMember}
        availableMembers={useFamilyMembersStore().familyMembers}
        onAddRelationships={mockOnAddRelationships}
      />,
    );

    const initialDialog = screen.getByRole('dialog', { name: /Batch Add Relationships for John Doe/i });
    await user.type(within(initialDialog).getByLabelText(/Optional description/i), 'Test description');
    
    // Change relationship type
    await user.click(within(initialDialog).getByRole('combobox', { name: /Relationship/i }));
    await user.click(screen.getByRole('option', { name: RelationType.SPOUSE }));


    // Click cancel button
    await user.click(within(initialDialog).getByRole('button', { name: /Cancel/i }));
    expect(mockOnClose).toHaveBeenCalled(); 

    // Simulate reopening the dialog
    rerender(
      <BatchRelationshipSelector
        isOpen={true}
        onClose={mockOnClose}
        member={mockMember}
        availableMembers={useFamilyMembersStore().familyMembers}
        onAddRelationships={mockOnAddRelationships}
      />,
    );
    
    const dialogAfterReopen = screen.getByRole('dialog', { name: /Batch Add Relationships for John Doe/i });
    // Verify form is reset
    expect(within(dialogAfterReopen).getByLabelText(/Optional description/i)).toHaveValue('');
    expect(within(dialogAfterReopen).getByRole('combobox', { name: /Relationship/i })).toHaveTextContent(/Child/i); // Resets to Child
    expect(within(dialogAfterReopen).getByText(/No members selected/i)).toBeInTheDocument();
  });
  
  it('当没有可用成员时应该显示提示信息', () => {
    render(
      <BatchRelationshipSelector
        isOpen={true}
        onClose={mockOnClose}
        member={mockMember}
        availableMembers={[]} // No available members
        onAddRelationships={mockOnAddRelationships}
      />
    );

    // 验证提示信息
    expect(screen.getByText(/No available members to create relationships with./i)).toBeInTheDocument();
    
    // 验证提交按钮被禁用
    const submitButton = screen.getByText(/Add 0 Relationships/i);
    expect(submitButton).toBeDisabled();
  });

  it('应该允许通过点击徽章上的X按钮来取消选择成员', async () => {
    const user = userEvent.setup();
    render(
      <BatchRelationshipSelector
        isOpen={true}
        onClose={mockOnClose}
        member={mockMember}
        availableMembers={useFamilyMembersStore().familyMembers}
        onAddRelationships={mockOnAddRelationships}
      />
    );

    // 选择第一个成员
    const firstCheckbox = screen.getByLabelText(/Jane Doe \(Mother\)/i);
    await user.click(firstCheckbox);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText(/Add 1 Relationship/i)).toBeInTheDocument();

    // 点击徽章上的X按钮取消选择
    const removeButton = screen.getByTestId('remove-selected-member-2');
    await user.click(removeButton);

    // 验证成员已被取消选择
    expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
    expect(screen.getByText(/Add 0 Relationships/i)).toBeInTheDocument();
    expect(firstCheckbox).not.toBeChecked();
  });

  describe('when through Escape key close dialog', () => {
    it('should call onClose and reset form', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <BatchRelationshipSelector
          isOpen={true}
          onClose={mockOnClose}
          member={mockMember}
          availableMembers={useFamilyMembersStore().familyMembers}
          onAddRelationships={mockOnAddRelationships}
        />
      );
      const initialDialog = screen.getByRole('dialog', { name: /Batch Add Relationships for John Doe/i });
      await user.type(within(initialDialog).getByLabelText(/Optional description/i), 'Test description for escape');
      // Change relationship type
      await user.click(within(initialDialog).getByRole('combobox', { name: /Relationship/i }));
      await user.click(screen.getByRole('option', { name: RelationType.PARENT }));


      await user.keyboard('{Escape}');
      expect(mockOnClose).toHaveBeenCalled();

      rerender(
        <BatchRelationshipSelector
          isOpen={true}
          onClose={mockOnClose}
          member={mockMember}
          availableMembers={useFamilyMembersStore().familyMembers}
          onAddRelationships={mockOnAddRelationships}
        />
      );
      const dialogAfterReopen = screen.getByRole('dialog', { name: /Batch Add Relationships for John Doe/i });
      expect(within(dialogAfterReopen).getByLabelText(/Optional description/i)).toHaveValue('');
      expect(within(dialogAfterReopen).getByRole('combobox', { name: /Relationship/i })).toHaveTextContent(/Child/i);
      expect(within(dialogAfterReopen).getByText(/No members selected/i)).toBeInTheDocument();
    });
  });

  it('当通过Escape键关闭对话框时，应该调用onClose并重置表单', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <BatchRelationshipSelector
        isOpen={true}
        onClose={mockOnClose}
        member={mockMember}
        availableMembers={useFamilyMembersStore().familyMembers}
        onAddRelationships={mockOnAddRelationships}
      />,
    );
    const initialDialog = screen.getByRole('dialog', { name: /Batch Add Relationships for John Doe/i });
    await user.type(within(initialDialog).getByLabelText(/Optional description/i), '一些描述');
    // Change relationship type
    await user.click(within(initialDialog).getByRole('combobox', { name: /Relationship/i }));
    await user.click(screen.getByRole('option', { name: RelationType.SIBLING }));


    await user.keyboard('{Escape}');
    expect(mockOnClose).toHaveBeenCalled();

    rerender(
      <BatchRelationshipSelector
        isOpen={true}
        onClose={mockOnClose}
        member={mockMember}
        availableMembers={useFamilyMembersStore().familyMembers}
        onAddRelationships={mockOnAddRelationships}
      />,
    );
    const dialogAfterReopen = screen.getByRole('dialog', { name: /Batch Add Relationships for John Doe/i });
    expect(within(dialogAfterReopen).getByLabelText(/Optional description/i)).toHaveValue('');
    expect(within(dialogAfterReopen).getByRole('combobox', { name: /Relationship/i })).toHaveTextContent(/Child/i);
    expect(within(dialogAfterReopen).getByText(/No members selected/i)).toBeInTheDocument();
  });
  // ... other tests, ensuring 'member' prop is used and 'availableMembers' is passed ...
});
