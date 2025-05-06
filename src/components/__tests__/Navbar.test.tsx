import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import userEvent from '@testing-library/user-event';

// 模拟next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}));

// 模拟AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn()
}));

// 模拟LoginDialog组件
jest.mock('../LoginDialog', () => {
  return function MockLoginDialog({ open, onClose }: { open: boolean, onClose: () => void }) {
    return open ? (
      <div data-testid="login-dialog">
        <button onClick={onClose} data-testid="close-login-dialog">Close</button>
      </div>
    ) : null;
  };
});

describe('Navbar组件', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // 默认模拟pathname为首页
    (usePathname as jest.Mock).mockReturnValue('/');
    
    // 默认模拟用户未登录
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: jest.fn()
    });
  });

  it('应该正确渲染导航栏', () => {
    render(<Navbar />);
    
    // 验证Logo
    expect(screen.getByText('Family Tree')).toBeInTheDocument();
    
    // 验证导航链接
    expect(screen.getByText('Knowledge')).toBeInTheDocument();
    expect(screen.getByText('Templates')).toBeInTheDocument();
    expect(screen.getByText('Generator')).toBeInTheDocument();
    expect(screen.getByText('Drag Editor')).toBeInTheDocument();
    
    // 验证登录按钮
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('当用户已登录时应该显示用户信息', async () => {
    // 模拟用户已登录
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        profileImage: 'https://example.com/avatar.jpg'
      },
      isAuthenticated: true,
      logout: jest.fn()
    });
    
    render(<Navbar />);
    
    // 验证用户名显示
    expect(screen.getByText('Test User')).toBeInTheDocument();
    
    // 验证头像
    const avatar = screen.getByAltText('Test User');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('应该高亮当前页面的导航链接', () => {
    // 模拟当前页面为Generator
    (usePathname as jest.Mock).mockReturnValue('/generator');
    
    render(<Navbar />);
    
    // 获取所有导航链接
    const knowledgeLink = screen.getByText('Knowledge').closest('a');
    const templatesLink = screen.getByText('Templates').closest('a');
    const generatorLink = screen.getByText('Generator').closest('a');
    const dragEditorLink = screen.getByText('Drag Editor').closest('a');
    
    // 验证Generator链接有高亮类
    expect(generatorLink).toHaveClass('bg-accent');
    expect(generatorLink).toHaveClass('text-primary');
    
    // 验证其他链接没有高亮类
    expect(knowledgeLink).not.toHaveClass('bg-accent');
    expect(templatesLink).not.toHaveClass('bg-accent');
    expect(dragEditorLink).not.toHaveClass('bg-accent');
  });

  it('点击登录按钮应该打开登录对话框', async () => {
    const user = userEvent.setup();
    
    render(<Navbar />);
    
    // 验证登录对话框最初不显示
    expect(screen.queryByTestId('login-dialog')).not.toBeInTheDocument();
    
    // 点击登录按钮
    await user.click(screen.getByText('Login'));
    
    // 验证登录对话框显示
    expect(screen.getByTestId('login-dialog')).toBeInTheDocument();
    
    // 点击关闭按钮
    await user.click(screen.getByTestId('close-login-dialog'));
    
    // 验证登录对话框关闭
    expect(screen.queryByTestId('login-dialog')).not.toBeInTheDocument();
  });

  it('已登录用户应该能够打开下拉菜单并登出', async () => {
    const user = userEvent.setup();
    
    // 模拟登出函数
    const mockLogout = jest.fn();
    
    // 模拟用户已登录
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com'
      },
      isAuthenticated: true,
      logout: mockLogout
    });
    
    render(<Navbar />);
    
    // 点击用户头像打开下拉菜单
    const avatarButton = screen.getByText('Test User').closest('button');
    await user.click(avatarButton!);
    
    // 验证下拉菜单项
    expect(screen.getByText('My Account')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    
    // 点击登出按钮
    await user.click(screen.getByText('Logout'));
    
    // 验证登出函数被调用
    expect(mockLogout).toHaveBeenCalled();
  });

  it('应该能够切换移动菜单', async () => {
    const user = userEvent.setup();
    
    render(<Navbar />);
    
    // 验证移动菜单最初不显示
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    
    // 点击菜单按钮
    const menuButton = screen.getByLabelText('Open menu');
    await user.click(menuButton);
    
    // 验证移动菜单显示
    const mobileNav = screen.getAllByText('Login')[1]; // 移动菜单中的登录按钮
    expect(mobileNav).toBeInTheDocument();
    
    // 点击关闭按钮
    const closeButton = screen.getByLabelText('Close menu');
    await user.click(closeButton);
    
    // 验证移动菜单关闭
    expect(screen.queryAllByText('Login').length).toBe(1); // 只有桌面版的登录按钮
  });

  it('已登录用户的移动菜单应该显示个人资料和登出选项', async () => {
    const user = userEvent.setup();
    
    // 模拟登出函数
    const mockLogout = jest.fn();
    
    // 模拟用户已登录
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com'
      },
      isAuthenticated: true,
      logout: mockLogout
    });
    
    render(<Navbar />);
    
    // 点击菜单按钮
    const menuButton = screen.getByLabelText('Open menu');
    await user.click(menuButton);
    
    // 验证移动菜单显示个人资料和登出选项
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    
    // 点击登出按钮
    await user.click(screen.getByText('Logout'));
    
    // 验证登出函数被调用
    expect(mockLogout).toHaveBeenCalled();
  });
});
