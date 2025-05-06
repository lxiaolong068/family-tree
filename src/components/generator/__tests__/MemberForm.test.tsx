import React from 'react';
import { render, screen, fireEvent } from '@/lib/test-utils';
import MemberForm from '../MemberForm';
import { Member } from '@/types/family-tree';

describe('MemberForm组件', () => {
  // 默认props
  const defaultProps = {
    currentMember: { name: '', relation: '', gender: 'male' } as Partial<Member>,
    onInputChange: jest.fn(),
    onAddMember: jest.fn(),
    onGenerateChart: jest.fn(),
    onSaveToDatabase: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该正确渲染所有表单字段', () => {
    render(<MemberForm {...defaultProps} />);

    // 检查标题
    expect(screen.getByText('Add Family Member')).toBeInTheDocument();

    // 检查输入字段
    expect(screen.getByLabelText(/Name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Relationship \*/i)).toBeInTheDocument();
    // 检查性别标签
    expect(screen.getByText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Birth Date/i)).toBeInTheDocument();

    // 检查按钮
    expect(screen.getByRole('button', { name: /Add Member/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate Chart/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save to Database/i })).toBeInTheDocument();
  });

  it('应该显示当前成员的值', () => {
    const currentMember = {
      name: 'John Doe',
      relation: 'father',
      gender: 'male',
      birthDate: '1980-01-01'
    } as Partial<Member>;

    render(<MemberForm {...defaultProps} currentMember={currentMember} />);

    // 检查输入字段的值
    expect(screen.getByLabelText(/Name \*/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/Relationship \*/i)).toHaveValue('father');
    // 检查性别选择 - 使用RadioGroup
    const maleRadios = screen.getAllByRole('radio');
    expect(maleRadios[0]).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByLabelText(/Birth Date/i)).toHaveValue('1980-01-01');
  });

  it('应该在输入变化时调用onInputChange', () => {
    render(<MemberForm {...defaultProps} />);

    // 模拟名称输入
    const nameInput = screen.getByLabelText(/Name \*/i);
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    expect(defaultProps.onInputChange).toHaveBeenCalledWith('name', 'Jane Doe');

    // 模拟关系输入
    const relationInput = screen.getByLabelText(/Relationship \*/i);
    fireEvent.change(relationInput, { target: { value: 'mother' } });
    expect(defaultProps.onInputChange).toHaveBeenCalledWith('relation', 'mother');

    // 模拟性别选择 - 使用RadioGroup
    const femaleRadio = screen.getByLabelText(/Female/i);
    fireEvent.click(femaleRadio);
    expect(defaultProps.onInputChange).toHaveBeenCalledWith('gender', 'female');

    // 模拟出生日期输入
    const birthDateInput = screen.getByLabelText(/Birth Date/i);
    fireEvent.change(birthDateInput, { target: { value: '1985-05-05' } });
    expect(defaultProps.onInputChange).toHaveBeenCalledWith('birthDate', '1985-05-05');
  });

  it('应该在点击Add Member按钮时调用onAddMember', () => {
    render(<MemberForm {...defaultProps} />);

    const addButton = screen.getByRole('button', { name: /Add Member/i });
    fireEvent.click(addButton);

    expect(defaultProps.onAddMember).toHaveBeenCalledTimes(1);
  });

  it('应该在点击Generate Chart按钮时调用onGenerateChart', () => {
    render(<MemberForm {...defaultProps} />);

    const generateButton = screen.getByRole('button', { name: /Generate Chart/i });
    fireEvent.click(generateButton);

    expect(defaultProps.onGenerateChart).toHaveBeenCalledTimes(1);
  });

  it('应该在点击Save to Database按钮时调用onSaveToDatabase', () => {
    render(<MemberForm {...defaultProps} />);

    const saveButton = screen.getByRole('button', { name: /Save to Database/i });
    fireEvent.click(saveButton);

    expect(defaultProps.onSaveToDatabase).toHaveBeenCalledTimes(1);
  });

  it('应该在表单字段为空时仍然可以正常工作', () => {
    const emptyMember = {} as Partial<Member>;
    render(<MemberForm {...defaultProps} currentMember={emptyMember} />);

    // 检查输入字段的值
    expect(screen.getByLabelText(/Name \*/i)).toHaveValue('');
    expect(screen.getByLabelText(/Relationship \*/i)).toHaveValue('');

    // 模拟输入
    const nameInput = screen.getByLabelText(/Name \*/i);
    fireEvent.change(nameInput, { target: { value: 'Test Name' } });

    expect(defaultProps.onInputChange).toHaveBeenCalledWith('name', 'Test Name');
  });

  it('应该正确处理不同性别选项', () => {
    render(<MemberForm {...defaultProps} />);

    // 检查所有性别选项是否存在 - 使用getAllByText而不是getByLabelText
    expect(screen.getAllByText(/Male/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Female/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Other/i)[0]).toBeInTheDocument();

    // 模拟选择不同性别 - 使用getAllByRole
    const radios = screen.getAllByRole('radio');
    const femaleRadio = radios[1]; // 第二个是female
    fireEvent.click(femaleRadio);
    expect(defaultProps.onInputChange).toHaveBeenCalledWith('gender', 'female');

    const otherRadio = radios[2]; // 第三个是other
    fireEvent.click(otherRadio);
    expect(defaultProps.onInputChange).toHaveBeenCalledWith('gender', 'other');
  });
});
