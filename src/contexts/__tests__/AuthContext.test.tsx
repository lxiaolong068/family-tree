import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

// 模拟fetch
global.fetch = jest.fn();

// 模拟localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

// 创建一个测试组件来使用useAuth hook
const TestComponent = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  return (
    <div>
      <div data-testid="loading">{isLoading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      <div data-testid="user-info">{user ? `${user.name} (${user.email})` : 'No User'}</div>
      <button data-testid="login-button" onClick={() => login('test-google-token')}>Login</button>
      <button data-testid="logout-button" onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该提供初始认证状态', async () => {
    // 模拟localStorage.getItem返回null（未登录）
    mockLocalStorage.getItem.mockReturnValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // 初始状态应该是加载中
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading');

    // 等待加载完成
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    // 应该未认证
    expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('No User');
  });

  it('应该检查本地存储中的令牌并验证', async () => {
    // 模拟localStorage.getItem返回令牌
    mockLocalStorage.getItem.mockReturnValue('valid-token');

    // 模拟fetch返回成功响应
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: {
          id: 'user-1',
          name: 'Test User',
          email: 'test@example.com'
        }
      })
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // 等待加载完成
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    // 应该已认证
    expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('Test User (test@example.com)');

    // 验证fetch调用
    expect(global.fetch).toHaveBeenCalledWith('/api/auth/verify', {
      headers: { Authorization: 'Bearer valid-token' }
    });
  });

  it('应该处理令牌验证失败', async () => {
    // 模拟localStorage.getItem返回令牌
    mockLocalStorage.getItem.mockReturnValue('invalid-token');

    // 模拟fetch返回失败响应
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // 等待加载完成
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    // 应该未认证
    expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('No User');

    // 验证localStorage.removeItem被调用
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('authToken');
  });

  it('应该处理登录成功', async () => {
    // 模拟localStorage.getItem返回null（未登录）
    mockLocalStorage.getItem.mockReturnValue(null);

    // 模拟登录API调用成功
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'new-token',
        user: {
          id: 'user-1',
          name: 'Test User',
          email: 'test@example.com'
        }
      })
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // 等待加载完成
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    // 点击登录按钮
    await act(async () => {
      screen.getByTestId('login-button').click();
    });

    // 等待登录完成
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
    });

    // 验证用户信息
    expect(screen.getByTestId('user-info')).toHaveTextContent('Test User (test@example.com)');

    // 验证localStorage.setItem被调用
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('authToken', 'new-token');

    // 验证fetch调用
    expect(global.fetch).toHaveBeenCalledWith('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'test-google-token' })
    });
  });

  it('应该处理登录失败', async () => {
    // 模拟localStorage.getItem返回null（未登录）
    mockLocalStorage.getItem.mockReturnValue(null);

    // 模拟登录API调用失败
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    // 模拟console.error
    const originalConsoleError = console.error;
    console.error = jest.fn();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // 等待加载完成
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    // 点击登录按钮
    await act(async () => {
      try {
        screen.getByTestId('login-button').click();
        // 等待异步操作完成
        await new Promise(resolve => setTimeout(resolve, 0));
      } catch (error) {
        // 预期会抛出错误
      }
    });

    // 应该仍然未认证
    expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');

    // 验证console.error被调用
    expect(console.error).toHaveBeenCalled();

    // 恢复console.error
    console.error = originalConsoleError;
  });

  it('应该处理登出', async () => {
    // 模拟已登录状态
    mockLocalStorage.getItem.mockReturnValue('valid-token');

    // 模拟验证API调用成功
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: {
          id: 'user-1',
          name: 'Test User',
          email: 'test@example.com'
        }
      })
    });

    // 模拟登出API调用
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // 等待加载完成并验证已认证
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
    });

    // 点击登出按钮
    await act(async () => {
      screen.getByTestId('logout-button').click();
    });

    // 验证已登出
    expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('No User');

    // 验证localStorage.removeItem被调用
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('authToken');

    // 验证fetch调用
    expect(global.fetch).toHaveBeenCalledWith('/api/auth/logout', { method: 'POST' });
  });
});
