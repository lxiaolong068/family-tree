import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SaveLoginPrompt from '../SaveLoginPrompt';
import userEvent from '@testing-library/user-event';

describe('SaveLoginPrompt组件', () => {
  // 模拟函数
  const mockOnClose = jest.fn();
  const mockOnLogin = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该正确渲染登录提示对话框', () => {
    render(
      <SaveLoginPrompt 
        open={true} 
        onClose={mockOnClose} 
        onLogin={mockOnLogin} 
      />
    );
    
    // 验证标题
    expect(screen.getByText('Login Required')).toBeInTheDocument();
    
    // 验证描述
    expect(screen.getByText(/You need to login to save your family tree/i)).toBeInTheDocument();
    
    // 验证云存储好处
    expect(screen.getByText('Cloud Storage Benefits')).toBeInTheDocument();
    expect(screen.getByText(/Saving to the cloud allows you to access/i)).toBeInTheDocument();
    
    // 验证本地存储警告
    expect(screen.getByText('Local Storage Only')).toBeInTheDocument();
    expect(screen.getByText(/If you choose not to login/i)).toBeInTheDocument();
    
    // 验证按钮
    expect(screen.getByText('Continue Without Login')).toBeInTheDocument();
    expect(screen.getByText('Login Now')).toBeInTheDocument();
  });

  it('当open为false时不应该渲染对话框', () => {
    render(
      <SaveLoginPrompt 
        open={false} 
        onClose={mockOnClose} 
        onLogin={mockOnLogin} 
      />
    );
    
    // 验证对话框不显示
    expect(screen.queryByText('Login Required')).not.toBeInTheDocument();
  });

  it('点击"Continue Without Login"按钮应该调用onClose', async () => {
    const user = userEvent.setup();
    
    render(
      <SaveLoginPrompt 
        open={true} 
        onClose={mockOnClose} 
        onLogin={mockOnLogin} 
      />
    );
    
    // 点击"Continue Without Login"按钮
    await user.click(screen.getByText('Continue Without Login'));
    
    // 验证onClose被调用
    expect(mockOnClose).toHaveBeenCalled();
    
    // 验证onLogin没有被调用
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  it('点击"Login Now"按钮应该调用onLogin', async () => {
    const user = userEvent.setup();
    
    render(
      <SaveLoginPrompt 
        open={true} 
        onClose={mockOnClose} 
        onLogin={mockOnLogin} 
      />
    );
    
    // 点击"Login Now"按钮
    await user.click(screen.getByText('Login Now'));
    
    // 验证onLogin被调用
    expect(mockOnLogin).toHaveBeenCalled();
    
    // 验证onClose没有被调用
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('点击对话框外部应该调用onClose', async () => {
    // 渲染组件
    render(
      <SaveLoginPrompt 
        open={true} 
        onClose={mockOnClose} 
        onLogin={mockOnLogin} 
      />
    );
    
    // 获取对话框元素
    const dialogElement = screen.getByRole('dialog');
    
    // 模拟按下Escape键
    fireEvent.keyDown(dialogElement, { key: 'Escape', code: 'Escape', keyCode: 27, charCode: 0 });
    
    // 等待并验证onClose被调用
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
