import React from 'react';
import { render, screen } from '@/lib/test-utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

// 简化测试，只测试组件的基本渲染
describe('DropdownMenu组件', () => {
  it('应该正确渲染DropdownMenuTrigger', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="dropdown-trigger">点击我</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>菜单项</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    // 验证触发器渲染正确
    expect(screen.getByTestId('dropdown-trigger')).toBeInTheDocument();
    expect(screen.getByText('点击我')).toBeInTheDocument();
  });

  it('应该支持自定义className', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger className="custom-trigger" data-testid="dropdown-trigger">
          点击我
        </DropdownMenuTrigger>
      </DropdownMenu>
    );

    // 验证自定义类名应用正确
    expect(screen.getByTestId('dropdown-trigger')).toHaveClass('custom-trigger');
  });

  it('应该导出所有必要的组件', () => {
    // 验证所有组件都被正确导出
    expect(DropdownMenu).toBeDefined();
    expect(DropdownMenuTrigger).toBeDefined();
    expect(DropdownMenuContent).toBeDefined();
    expect(DropdownMenuItem).toBeDefined();
    expect(DropdownMenuLabel).toBeDefined();
    expect(DropdownMenuSeparator).toBeDefined();
  });
});
