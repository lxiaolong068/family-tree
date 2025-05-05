import React from 'react';
import { render, screen } from '@/lib/test-utils';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '@/components/ui/select';

// 简化测试，只测试组件的基本渲染
describe('Select组件', () => {
  it('应该正确渲染SelectTrigger和SelectValue', () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="选择一个选项" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">选项1</SelectItem>
        </SelectContent>
      </Select>
    );

    // 验证触发器渲染正确
    expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
    expect(screen.getByText('选择一个选项')).toBeInTheDocument();
  });

  it('应该支持自定义className', () => {
    render(
      <Select>
        <SelectTrigger className="custom-trigger" data-testid="select-trigger">
          <SelectValue placeholder="选择一个选项" />
        </SelectTrigger>
      </Select>
    );

    // 验证自定义类名应用正确
    expect(screen.getByTestId('select-trigger')).toHaveClass('custom-trigger');
  });

  it('应该支持禁用状态', () => {
    render(
      <Select disabled>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="禁用的选择器" />
        </SelectTrigger>
      </Select>
    );

    // 验证触发器被禁用
    const trigger = screen.getByTestId('select-trigger');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('disabled', '');
  });

  it('应该导出所有必要的组件', () => {
    // 验证所有组件都被正确导出
    expect(Select).toBeDefined();
    expect(SelectTrigger).toBeDefined();
    expect(SelectValue).toBeDefined();
    expect(SelectContent).toBeDefined();
    expect(SelectItem).toBeDefined();
    expect(SelectGroup).toBeDefined();
    expect(SelectLabel).toBeDefined();
    expect(SelectSeparator).toBeDefined();
  });
});
