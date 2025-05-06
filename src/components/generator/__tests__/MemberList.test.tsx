import React from 'react';
import { render, screen, fireEvent } from '@/lib/test-utils';
import MemberList from '../MemberList';
import { Member } from '@/types/family-tree';

describe('MemberList组件', () => {
  // 模拟成员数据
  const mockMembers: Member[] = [
    {
      id: '1',
      name: 'John Doe',
      relation: 'father',
      gender: 'male',
      birthDate: '1980-01-01'
    },
    {
      id: '2',
      name: 'Jane Doe',
      relation: 'mother',
      gender: 'female',
      birthDate: '1985-05-05'
    },
    {
      id: '3',
      name: 'Child Doe',
      relation: 'child',
      gender: 'other',
      birthDate: ''
    }
  ];

  // 默认props
  const defaultProps = {
    members: mockMembers,
    onDeleteMember: jest.fn(),
    onClearFamilyTree: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该正确渲染成员列表', () => {
    render(<MemberList {...defaultProps} />);

    // 检查标题
    expect(screen.getByText(/Family Member List/)).toBeInTheDocument();

    // 检查成员数据
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Child Doe')).toBeInTheDocument();

    expect(screen.getByText('father')).toBeInTheDocument();
    expect(screen.getByText('mother')).toBeInTheDocument();
    expect(screen.getByText('child')).toBeInTheDocument();

    // 检查性别标签
    expect(screen.getAllByText('Male')[0]).toBeInTheDocument();
    expect(screen.getByText('Female')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();

    // 检查出生日期
    expect(screen.getByText('1980-01-01')).toBeInTheDocument();
    expect(screen.getByText('1985-05-05')).toBeInTheDocument();

    // 检查关系标签 - 只有在展开成员时才会显示，所以不检查

    // 检查成员删除按钮
    const memberDeleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    expect(memberDeleteButtons).toHaveLength(mockMembers.length);

    // 检查添加关系按钮
    const addRelationButtons = screen.getAllByRole('button', { name: /Add Relation/i });
    expect(addRelationButtons).toHaveLength(mockMembers.length);

    // 检查清空家谱按钮
    const clearButton = screen.getByRole('button', { name: /Clear Family Tree/i });
    expect(clearButton).toBeInTheDocument();
  });

  it('应该在点击删除按钮时调用onDeleteMember', () => {
    render(<MemberList {...defaultProps} />);

    // 获取第一个成员的删除按钮
    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    const firstMemberDeleteButton = deleteButtons[0];

    // 点击删除按钮
    fireEvent.click(firstMemberDeleteButton);

    // 验证onDeleteMember被调用，并且传入了正确的ID
    expect(defaultProps.onDeleteMember).toHaveBeenCalledTimes(1);
    expect(defaultProps.onDeleteMember).toHaveBeenCalledWith('1');
  });

  it('应该在点击Clear Family Tree按钮时调用onClearFamilyTree', () => {
    render(<MemberList {...defaultProps} />);

    // 获取清空家谱按钮
    const clearButton = screen.getByRole('button', { name: /Clear Family Tree/i });

    // 点击清空按钮
    fireEvent.click(clearButton);

    // 验证onClearFamilyTree被调用
    expect(defaultProps.onClearFamilyTree).toHaveBeenCalledTimes(1);
  });

  it('当成员列表为空时不应该渲染任何内容', () => {
    render(<MemberList {...defaultProps} members={[]} />);

    // 标题不应该存在
    expect(screen.queryByText('Family Member List')).not.toBeInTheDocument();

    // 成员列表不应该存在
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();

    // 清空按钮不应该存在
    expect(screen.queryByRole('button', { name: /Clear Family Tree/i })).not.toBeInTheDocument();
  });

  it('应该正确处理不同性别的显示', () => {
    render(<MemberList {...defaultProps} />);

    // 检查性别显示
    expect(screen.getAllByText('Male')[0]).toBeInTheDocument();
    expect(screen.getByText('Female')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();
  });

  it('应该正确处理缺失的出生日期', () => {
    // 创建一个没有出生日期的成员
    const membersWithMissingBirthDate: Member[] = [
      {
        id: '4',
        name: 'No Birth Date',
        relation: 'sibling',
        gender: 'male',
        relationships: []
      }
    ];

    render(<MemberList {...defaultProps} members={membersWithMissingBirthDate} />);

    // 检查成员名称是否显示
    expect(screen.getByText('No Birth Date')).toBeInTheDocument();

    // 检查出生日期不应该显示
    expect(screen.queryByText(/\d{4}-\d{2}-\d{2}/)).not.toBeInTheDocument();
  });
});
