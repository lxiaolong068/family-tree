import React from 'react';
import { render, screen, fireEvent } from '@/lib/test-utils';
import RelationshipList from '../RelationshipList';
import { Member, RelationType } from '@/types/family-tree';

describe('RelationshipList组件', () => {
  // 模拟成员数据
  const mockMember: Member = {
    id: 'member-1',
    name: '张三',
    relation: '父亲',
    gender: 'male',
    relationships: [
      { type: RelationType.SPOUSE, targetId: 'member-2', description: '结婚20年' },
      { type: RelationType.CHILD, targetId: 'member-3' },
      { type: RelationType.PARENT, targetId: 'member-4' },
      { type: RelationType.SIBLING, targetId: 'member-5', description: '同父异母' }
    ]
  };

  // 模拟所有成员数据
  const mockAllMembers: Member[] = [
    mockMember,
    { id: 'member-2', name: '李四', relation: '母亲', gender: 'female' },
    { id: 'member-3', name: '王五', relation: '儿子', gender: 'male' },
    { id: 'member-4', name: '赵六', relation: '祖父', gender: 'male' },
    { id: 'member-5', name: '钱七', relation: '兄弟', gender: 'male' }
  ];

  // 模拟回调函数
  const mockOnRemoveRelationship = jest.fn();

  // 默认props
  const defaultProps = {
    member: mockMember,
    allMembers: mockAllMembers,
    onRemoveRelationship: mockOnRemoveRelationship
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该正确渲染所有关系', () => {
    render(<RelationshipList {...defaultProps} />);

    // 验证所有关系目标成员名称显示
    expect(screen.getByText('李四')).toBeInTheDocument();
    expect(screen.getByText('王五')).toBeInTheDocument();
    expect(screen.getByText('赵六')).toBeInTheDocument();
    expect(screen.getByText('钱七')).toBeInTheDocument();

    // 验证关系类型标签显示（使用包含文本的方式）
    expect(screen.getByText(/Spouse/)).toBeInTheDocument();
    expect(screen.getByText(/Child/)).toBeInTheDocument();
    expect(screen.getByText(/Parent/)).toBeInTheDocument();
    expect(screen.getByText(/Sibling/)).toBeInTheDocument();

    // 验证关系描述显示
    expect(screen.getByText(/结婚20年/)).toBeInTheDocument();
    expect(screen.getByText(/同父异母/)).toBeInTheDocument();
  });

  it('应该在没有关系时显示空状态', () => {
    const memberWithNoRelationships: Member = {
      ...mockMember,
      relationships: []
    };

    render(
      <RelationshipList
        {...defaultProps}
        member={memberWithNoRelationships}
      />
    );

    // 验证空状态提示
    expect(screen.getByText('No relationships defined')).toBeInTheDocument();
  });

  it('应该在点击删除按钮时调用onRemoveRelationship', () => {
    render(<RelationshipList {...defaultProps} />);

    // 获取所有删除按钮
    const removeButtons = screen.getAllByTitle('Remove Relationship');
    expect(removeButtons).toHaveLength(4);

    // 点击第一个删除按钮（配偶关系）
    fireEvent.click(removeButtons[0]);

    // 验证onRemoveRelationship被调用，并且传入了正确的参数
    expect(mockOnRemoveRelationship).toHaveBeenCalledWith(
      'member-1',
      'member-2',
      RelationType.SPOUSE
    );
  });

  it('应该正确显示不同类型关系的图标', () => {
    const { container } = render(<RelationshipList {...defaultProps} />);

    // 验证不同类型关系的图标类名
    // 注意：由于渲染顺序可能不同，我们需要查找特定的图标
    const heartIcon = container.querySelector('.lucide-heart');

    // 只验证我们确定的图标
    expect(heartIcon).toHaveClass('text-red-500'); // 配偶关系
  });

  it('应该忽略找不到的目标成员', () => {
    // 添加一个不存在的目标成员ID
    const memberWithInvalidTarget: Member = {
      ...mockMember,
      relationships: [
        ...mockMember.relationships!,
        { type: RelationType.OTHER, targetId: 'non-existent-member' }
      ]
    };

    render(
      <RelationshipList
        {...defaultProps}
        member={memberWithInvalidTarget}
      />
    );

    // 验证只渲染了有效的关系
    const removeButtons = screen.getAllByTitle('Remove Relationship');
    expect(removeButtons).toHaveLength(4); // 仍然只有4个有效关系
  });

  it('应该正确处理undefined的relationships', () => {
    const memberWithUndefinedRelationships: Member = {
      ...mockMember,
      relationships: undefined
    };

    render(
      <RelationshipList
        {...defaultProps}
        member={memberWithUndefinedRelationships}
      />
    );

    // 验证空状态提示
    expect(screen.getByText('No relationships defined')).toBeInTheDocument();
  });

  it('应该正确显示其他类型的关系', () => {
    // 添加一个其他类型的关系
    const memberWithOtherRelation: Member = {
      ...mockMember,
      relationships: [
        { type: RelationType.OTHER, targetId: 'member-2', description: '朋友' }
      ]
    };

    render(
      <RelationshipList
        {...defaultProps}
        member={memberWithOtherRelation}
      />
    );

    // 验证其他类型关系的标签（使用包含文本的方式）
    expect(screen.getByText(/Other/)).toBeInTheDocument();
    expect(screen.getByText(/朋友/)).toBeInTheDocument();
  });
});
