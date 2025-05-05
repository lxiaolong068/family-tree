import React from 'react';
import { render, screen, fireEvent } from '@/lib/test-utils';
import RelationshipSelector from '../RelationshipSelector';
import { Member, RelationType, Relationship } from '@/types/family-tree';

// 模拟Dialog组件
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ open, onOpenChange, children }) => (
    open ? <div data-testid="mock-dialog">{children}</div> : null
  ),
  DialogContent: ({ children }) => <div data-testid="mock-dialog-content">{children}</div>,
  DialogHeader: ({ children }) => <div data-testid="mock-dialog-header">{children}</div>,
  DialogTitle: ({ children }) => <div data-testid="mock-dialog-title">{children}</div>,
  DialogFooter: ({ children }) => <div data-testid="mock-dialog-footer">{children}</div>
}));

// 模拟Select组件
jest.mock('@/components/ui/select', () => ({
  Select: ({ value, onValueChange, children }) => (
    <div data-testid="mock-select">
      <button
        data-testid="mock-select-button"
        onClick={() => onValueChange && onValueChange('member-3')}
      >
        Select Member
      </button>
    </div>
  ),
  SelectTrigger: ({ className, children }) => <div data-testid="mock-select-trigger">{children}</div>,
  SelectValue: ({ placeholder }) => <div data-testid="mock-select-value">{placeholder}</div>,
  SelectContent: ({ children }) => <div data-testid="mock-select-content">{children}</div>,
  SelectItem: ({ value, children }) => <div data-value={value}>{children}</div>
}));

describe('RelationshipSelector组件', () => {
  // 模拟成员数据
  const mockMember: Member = {
    id: 'member-1',
    name: '张三',
    relation: '父亲',
    gender: 'male',
    relationships: [
      { type: RelationType.SPOUSE, targetId: 'member-2' }
    ]
  };

  // 模拟可用成员数据
  const mockAvailableMembers: Member[] = [
    mockMember,
    { id: 'member-2', name: '李四', relation: '母亲', gender: 'female' },
    { id: 'member-3', name: '王五', relation: '儿子', gender: 'male' },
    { id: 'member-4', name: '赵六', relation: '祖父', gender: 'male' }
  ];

  // 模拟回调函数
  const mockOnAddRelationship = jest.fn();
  const mockOnClose = jest.fn();

  // 默认props
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    member: mockMember,
    availableMembers: mockAvailableMembers,
    onAddRelationship: mockOnAddRelationship
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该正确渲染对话框和表单', () => {
    render(<RelationshipSelector {...defaultProps} />);

    // 验证对话框标题
    expect(screen.getByText(`Add Relationship for ${mockMember.name}`)).toBeInTheDocument();

    // 验证表单字段
    expect(screen.getByText('Member')).toBeInTheDocument();
    expect(screen.getByText('Relationship')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();

    // 验证按钮
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Relationship' })).toBeInTheDocument();
  });

  it('应该显示对话框标题', () => {
    render(<RelationshipSelector {...defaultProps} />);

    // 验证对话框标题包含成员名称
    expect(screen.getByText(`Add Relationship for ${mockMember.name}`)).toBeInTheDocument();
  });

  it('应该在没有可用成员时显示提示信息', () => {
    // 创建一个只有当前成员的情况
    const singleMemberProps = {
      ...defaultProps,
      availableMembers: [mockMember]
    };

    render(<RelationshipSelector {...singleMemberProps} />);

    // 验证提示信息
    expect(screen.getByText('No available members to create a relationship with.')).toBeInTheDocument();

    // 验证添加按钮被禁用
    const addButton = screen.getByRole('button', { name: 'Add Relationship' });
    expect(addButton).toBeDisabled();
  });

  it('应该在初始状态下禁用添加按钮', () => {
    render(<RelationshipSelector {...defaultProps} />);

    // 初始状态下添加按钮应该被禁用
    const addButton = screen.getByRole('button', { name: 'Add Relationship' });
    expect(addButton).toBeDisabled();
  });

  it('应该在点击取消按钮时调用onClose', () => {
    render(<RelationshipSelector {...defaultProps} />);

    // 点击取消按钮
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);

    // 验证onClose被调用
    expect(mockOnClose).toHaveBeenCalled();
  });

  // 删除重复的测试

  it('应该显示描述输入框', () => {
    render(<RelationshipSelector {...defaultProps} />);

    // 验证描述输入框存在
    expect(screen.getByPlaceholderText('Optional description')).toBeInTheDocument();
  });

  it('应该在对话框关闭时不显示内容', () => {
    const { rerender } = render(<RelationshipSelector {...defaultProps} />);

    // 验证对话框内容显示
    expect(screen.getByTestId('mock-dialog')).toBeInTheDocument();

    // 关闭对话框
    rerender(<RelationshipSelector {...defaultProps} isOpen={false} />);

    // 验证对话框内容不再显示
    expect(screen.queryByTestId('mock-dialog')).not.toBeInTheDocument();
  });
});
