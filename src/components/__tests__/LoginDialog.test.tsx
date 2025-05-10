import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import LoginDialog from '../LoginDialog';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import userEvent from '@testing-library/user-event';

// 模拟firebase/auth
jest.mock('firebase/auth', () => ({
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({
    addScope: jest.fn(),
    setCustomParameters: jest.fn()
  })),
  signInWithPopup: jest.fn()
}));

// 模拟firebase
jest.mock('@/lib/firebase', () => ({
  auth: {}
}));

// 模拟AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn()
}));

describe('LoginDialog组件', () => {
  // 模拟函数
  const mockOnClose = jest.fn();
  const mockLogin = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // 默认模拟useAuth返回login函数
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin
    });
  });

  it('应该正确渲染登录对话框', () => {
    render(<LoginDialog open={true} onClose={mockOnClose} />);
    
    // 验证标题
    expect(screen.getByText('Welcome to Family Tree')).toBeInTheDocument();
    
    // 验证描述
    expect(screen.getByText(/Sign in to save your family tree data/i)).toBeInTheDocument();
    
    // 验证好处列表
    expect(screen.getByText('By signing in, you can:')).toBeInTheDocument();
    expect(screen.getByText('Save your family tree data to the cloud')).toBeInTheDocument();
    expect(screen.getByText('Access your family trees from any device')).toBeInTheDocument();
    expect(screen.getByText('Share your family tree with family members')).toBeInTheDocument();
    expect(screen.getByText('Keep your data secure and backed up')).toBeInTheDocument();
    
    // 验证按钮
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
  });

  it('当open为false时不应该渲染对话框', () => {
    render(<LoginDialog open={false} onClose={mockOnClose} />);
    
    // 验证对话框不显示
    expect(screen.queryByText('Welcome to Family Tree')).not.toBeInTheDocument();
  });

  it('点击取消按钮应该调用onClose', async () => {
    const user = userEvent.setup();
    
    render(<LoginDialog open={true} onClose={mockOnClose} />);
    
    // 点击取消按钮
    await user.click(screen.getByText('Cancel'));
    
    // 验证onClose被调用
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('应该处理Google登录成功', async () => {
    const user = userEvent.setup();
    
    const mockUser = {
      email: 'test@example.com',
      displayName: 'Test User',
      getIdToken: jest.fn().mockResolvedValue('mock-id-token')
    };
    
    (signInWithPopup as jest.Mock).mockResolvedValue({ user: mockUser });
    
    mockLogin.mockImplementation(() => {
      return new Promise(resolve => setTimeout(() => resolve(undefined), 50)); // Resolves after 50ms
    });
    
    render(<LoginDialog open={true} onClose={mockOnClose} />);
    
    const googleLoginButton = screen.getByRole('button', { name: /Continue with Google/i });
    await user.click(googleLoginButton);
    
    // Assert the loading state
    await waitFor(() => {
      // Wait for the "Signing in..." text to appear
      const signInTextElement = screen.getByText('Signing in...');
      // Find the button containing this text
      const buttonDuringLoading = signInTextElement.closest('button');
      
      // Ensure the button was found
      if (!buttonDuringLoading) {
        throw new Error('Button containing "Signing in..." text not found.');
      }
      
      // Assert properties of the button
      expect(buttonDuringLoading).toBeDisabled();
      expect(buttonDuringLoading.querySelector('.animate-spin')).toBeInTheDocument();
    });
    
    // Assert that all async operations completed and onClose was called
    await waitFor(() => {
      expect(GoogleAuthProvider).toHaveBeenCalled();
      expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(Object));
      expect(mockUser.getIdToken).toHaveBeenCalled();
      expect(mockLogin).toHaveBeenCalledWith('mock-id-token');
      expect(mockOnClose).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  it('应该处理Google登录失败', async () => {
    const user = userEvent.setup();
    
    // 模拟console.error
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // 模拟signInWithPopup抛出错误
    const mockError = new Error('Login failed');
    (mockError as any).code = 'auth/popup-closed-by-user';
    (signInWithPopup as jest.Mock).mockRejectedValue(mockError);
    
    render(<LoginDialog open={true} onClose={mockOnClose} />);
    
    // 点击Google登录按钮
    await user.click(screen.getByText('Continue with Google'));
    
    // 等待异步操作完成
    await waitFor(() => {
      // 验证错误信息显示
      expect(screen.getByText(/Failed to login with Google/i)).toBeInTheDocument();
      expect(screen.getByText(/\(auth\/popup-closed-by-user\)/i)).toBeInTheDocument();
      
      // 验证console.error被调用
      expect(console.error).toHaveBeenCalledWith('Google login error:', mockError);
      
      // 验证onClose没有被调用
      expect(mockOnClose).not.toHaveBeenCalled();
    });
    
    // 恢复console.error
    console.error = originalConsoleError;
  });

  it('当通过外部交互关闭对话框时应该调用onClose', async () => {
    // const user = userEvent.setup(); // userEvent is not strictly需要这里，因为fireEvent更直接用于Escape键
    render(<LoginDialog open={true} onClose={mockOnClose} />);

    // Dialog组件的onOpenChange会在用户按下Escape键时被调用并传入false
    // 我们可以通过模拟按下Escape键来触发这个行为
    // 注意：React Testing Library的fireEvent.keyDown更适合模拟这种DOM事件
    // 而userEvent.keyboard更适合模拟用户输入
    // 首先，确保对话框是存在的
    const dialogElement = screen.getByRole('dialog');
    fireEvent.keyDown(dialogElement, { key: 'Escape', code: 'Escape', keyCode: 27, charCode: 0 });

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    // 也可以模拟点击遮罩层，但这通常更复杂，因为遮罩层可能没有特定的role或testid
    // 对于shadcn/ui的Dialog，按下Escape是测试onOpenChange的直接方式
  });

  it('应该处理login函数抛出错误', async () => {
    const user = userEvent.setup();
    
    // 模拟console.error
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // 模拟用户对象
    const mockUser = {
      email: 'test@example.com',
      displayName: 'Test User',
      getIdToken: jest.fn().mockResolvedValue('mock-id-token')
    };
    
    // 模拟signInWithPopup返回成功结果
    (signInWithPopup as jest.Mock).mockResolvedValue({
      user: mockUser
    });
    
    // 模拟login抛出错误
    mockLogin.mockRejectedValue(new Error('Login failed'));
    
    render(<LoginDialog open={true} onClose={mockOnClose} />);
    
    // 点击Google登录按钮
    await user.click(screen.getByText('Continue with Google'));
    
    // 等待异步操作完成
    await waitFor(() => {
      // 验证错误信息显示
      expect(screen.getByText(/Failed to login with Google/i)).toBeInTheDocument();
      
      // 验证console.error被调用
      expect(console.error).toHaveBeenCalled();
      
      // 验证onClose没有被调用
      expect(mockOnClose).not.toHaveBeenCalled();
    });
    
    // 恢复console.error
    console.error = originalConsoleError;
  });
});
