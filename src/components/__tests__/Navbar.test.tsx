import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
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
    
    // 验证头像 (JSDOM doesn't load images, so AvatarFallback应该可见)
    // AvatarImage with alt="Test User" or role="img" name="Test User" should not be rendered.
    expect(screen.queryByRole('img', { name: 'Test User' })).not.toBeInTheDocument();
    expect(screen.queryByAltText('Test User')).not.toBeInTheDocument();
    
    // AvatarFallback should display the first letter of the user's name ("T")
    const avatarButton = screen.getByTestId('user-avatar-button');
    // The fallback text "T" is rendered within the button.
    expect(within(avatarButton).getByText('T')).toBeInTheDocument();
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
        email: 'test@example.com',
        profileImage: 'https://example.com/avatar.jpg' // Added profileImage for consistency
      },
      isAuthenticated: true,
      logout: mockLogout
    });
    
    render(<Navbar />);
    
    // 点击用户头像打开下拉菜单
    // Changed to target the button more reliably, e.g., by role or a test-id if added to Navbar
    const avatarButton = screen.getByRole('button', { name: /open user menu/i });
    await user.click(avatarButton);
    
    // 验证下拉菜单项
    const profileLink = screen.getByRole('menuitem', { name: /profile/i });
    expect(profileLink).toBeInTheDocument();
    expect(profileLink).toHaveAttribute('href', '/profile');

    const logoutButton = screen.getByRole('menuitem', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
    
    // 点击登出按钮
    await user.click(logoutButton);
    
    // 验证登出函数被调用
    expect(mockLogout).toHaveBeenCalled();

    // 验证下拉菜单是否关闭 (如果DropdownMenuContent在点击后会卸载)
    // This depends on the DropdownMenu behavior. If it unmounts, this is valid.
    // If it just hides, another assertion (e.g., .not.toBeVisible()) might be needed.
    expect(screen.queryByRole('menuitem', { name: /profile/i })).not.toBeInTheDocument();
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
        email: 'test@example.com',
        profileImage: 'https://example.com/avatar.jpg' // Added profileImage for consistency
      },
      isAuthenticated: true,
      logout: mockLogout
    });
    
    render(<Navbar />);
    
    // 点击菜单按钮
    const menuButton = screen.getByLabelText('Open menu');
    await user.click(menuButton);
    
    // 验证移动菜单显示个人资料和登出选项
    const mobileProfileLink = screen.getByRole('link', { name: /profile/i });
    expect(mobileProfileLink).toBeInTheDocument();
    expect(mobileProfileLink).toHaveAttribute('href', '/profile');

    const mobileLogoutButton = screen.getByRole('button', { name: /logout from your account/i });
    expect(mobileLogoutButton).toBeInTheDocument();
    
    // 点击登出按钮
    await user.click(mobileLogoutButton);
    
    // 验证登出函数被调用
    expect(mockLogout).toHaveBeenCalled();

    // 验证移动菜单是否关闭
    // Assuming clicking logout also closes the mobile menu
    expect(screen.queryByLabelText('Close menu')).not.toBeInTheDocument(); 
    // Or check if a specific item from the mobile menu is no longer visible/present
    // This depends on how the mobile menu items are structured and removed from DOM
    // A safer bet might be to check that the "Open menu" button is present again, and "Close menu" is not.
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
    expect(screen.queryByLabelText('Close menu')).not.toBeInTheDocument();
  });

  it('Logo应该链接到首页', () => {
    render(<Navbar />);
    const logoLink = screen.getByRole('link', { name: /family tree home/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('导航链接应具有正确的aria-current属性', () => {
    (usePathname as jest.Mock).mockReturnValue('/templates');
    render(<Navbar />);

    const knowledgeLink = screen.getByRole('link', { name: 'Knowledge' });
    const templatesLink = screen.getByRole('link', { name: 'Templates' });
    const generatorLink = screen.getByRole('link', { name: 'Generator' });

    expect(knowledgeLink).not.toHaveAttribute('aria-current', 'page');
    expect(templatesLink).toHaveAttribute('aria-current', 'page');
    expect(generatorLink).not.toHaveAttribute('aria-current', 'page');
  });

  it('当用户名或头像缺失时，AvatarFallback应正确显示', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: 'user-2',
        name: null, // Name is null
        email: 'no-name@example.com',
        profileImage: null, // profileImage is null
      },
      isAuthenticated: true,
      logout: jest.fn(),
    });

    render(<Navbar />);
    // Use data-testid for the button for robustness
    const avatarButton = screen.getByTestId('user-avatar-button');
    await userEvent.click(avatarButton);
    
    const avatarImage = screen.queryByAltText(/.*/); // Check if any alt text exists for an image
    expect(avatarImage).not.toBeInTheDocument(); // Assuming no image rendered

    // Check for the presence of AvatarFallback within the button
    // The fallback will contain the first letter of the name, or be empty/default if name is null.
    // Given user.name is null, user?.name?.charAt(0) is undefined.
    // The AvatarFallback component from shadcn/ui will render its children. If children are undefined, it renders null.
    // So, the text content of the fallback element itself might be empty.
    // We can check for an element with the specific fallback classes.
    const fallbackElement = avatarButton.querySelector('.bg-primary.text-primary-foreground');
    expect(fallbackElement).toBeInTheDocument();
    // Check that the fallback text is empty as user.name is null
    expect(fallbackElement?.textContent).toBe(''); 
  });

  it('移动菜单中的链接点击后应关闭菜单', async () => {
    const user = userEvent.setup();
    (usePathname as jest.Mock).mockReturnValue('/'); // Set a current path
    render(<Navbar />);

    // 点击菜单按钮打开移动菜单
    const menuButton = screen.getByLabelText('Open menu');
    await user.click(menuButton);

    // 验证移动菜单已显示
    const mobileMenu = screen.getByTestId('mobile-nav-menu');
    expect(mobileMenu).toBeVisible();

    // 在移动菜单中找到 "Knowledge" 链接并点击
    // Use within to scope the query to the mobile menu
    const knowledgeLinkInMobileMenu = within(mobileMenu).getByRole('link', { name: /Knowledge/i });
    expect(knowledgeLinkInMobileMenu).toBeInTheDocument();
    await user.click(knowledgeLinkInMobileMenu);

    // 验证移动菜单已关闭
    // Check that the "Open menu" button is present again, and "Close menu" is not.
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
    expect(screen.queryByLabelText('Close menu')).not.toBeInTheDocument();
    // Also check that the mobile menu itself is no longer in the document or not visible
    expect(screen.queryByTestId('mobile-nav-menu')).not.toBeInTheDocument();
  });

});
