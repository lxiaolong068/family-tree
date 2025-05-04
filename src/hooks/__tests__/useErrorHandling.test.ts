import { renderHook, act } from '@testing-library/react';
import { useErrorHandling } from '../useErrorHandling';

// 模拟logger
jest.mock('@/lib/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn()
  }
}));

describe('useErrorHandling Hook测试', () => {
  beforeEach(() => {
    // 重置所有模拟
    jest.clearAllMocks();
  });

  it('应该初始化状态', () => {
    const { result } = renderHook(() => useErrorHandling());
    
    expect(result.current.isDialogOpen).toBe(false);
    expect(result.current.dialogData).toEqual({ title: '' });
  });

  it('应该显示错误对话框', () => {
    const { result } = renderHook(() => useErrorHandling());
    
    // 调用showError
    act(() => {
      result.current.showError({
        title: '测试错误',
        description: '这是一个测试错误'
      });
    });
    
    // 验证状态
    expect(result.current.isDialogOpen).toBe(true);
    expect(result.current.dialogData).toEqual({
      title: '测试错误',
      description: '这是一个测试错误'
    });
    
    // 验证logger.error被调用
    const { logger } = require('@/lib/logger');
    expect(logger.error).toHaveBeenCalledWith(
      'Error: 测试错误',
      '这是一个测试错误'
    );
  });

  it('应该关闭错误对话框', () => {
    const { result } = renderHook(() => useErrorHandling());
    
    // 先显示错误对话框
    act(() => {
      result.current.showError({
        title: '测试错误'
      });
    });
    
    // 验证对话框已显示
    expect(result.current.isDialogOpen).toBe(true);
    
    // 调用closeDialog
    act(() => {
      result.current.closeDialog();
    });
    
    // 验证对话框已关闭
    expect(result.current.isDialogOpen).toBe(false);
  });

  it('应该显示确认对话框', () => {
    const { result } = renderHook(() => useErrorHandling());
    
    // 模拟回调函数
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    
    // 调用showConfirmation
    act(() => {
      result.current.showConfirmation(
        '确认操作',
        '您确定要执行此操作吗？',
        onConfirm,
        onCancel,
        '确定',
        '取消',
        true
      );
    });
    
    // 验证状态
    expect(result.current.isDialogOpen).toBe(true);
    expect(result.current.dialogData).toEqual({
      title: '确认操作',
      description: '您确定要执行此操作吗？',
      actions: [
        {
          label: '取消',
          onClick: expect.any(Function),
          variant: 'outline'
        },
        {
          label: '确定',
          onClick: onConfirm,
          variant: 'destructive'
        }
      ]
    });
    
    // 调用取消按钮的onClick
    act(() => {
      result.current.dialogData.actions?.[0].onClick();
    });
    
    // 验证onCancel被调用
    expect(onCancel).toHaveBeenCalled();
  });

  it('应该处理非破坏性确认对话框', () => {
    const { result } = renderHook(() => useErrorHandling());
    
    // 模拟回调函数
    const onConfirm = jest.fn();
    
    // 调用showConfirmation，destructive=false
    act(() => {
      result.current.showConfirmation(
        '确认操作',
        '您确定要执行此操作吗？',
        onConfirm,
        undefined,
        '确定',
        '取消',
        false
      );
    });
    
    // 验证确认按钮的variant
    expect(result.current.dialogData.actions?.[1].variant).toBe('default');
  });

  it('应该处理没有onCancel回调的情况', () => {
    const { result } = renderHook(() => useErrorHandling());
    
    // 模拟回调函数
    const onConfirm = jest.fn();
    
    // 调用showConfirmation，没有onCancel
    act(() => {
      result.current.showConfirmation(
        '确认操作',
        '您确定要执行此操作吗？',
        onConfirm
      );
    });
    
    // 调用取消按钮的onClick，不应该抛出错误
    expect(() => {
      act(() => {
        result.current.dialogData.actions?.[0].onClick();
      });
    }).not.toThrow();
  });

  it('应该处理Error对象', () => {
    const { result } = renderHook(() => useErrorHandling());
    
    // 调用handleError，传入Error对象
    let handleResult;
    act(() => {
      handleResult = result.current.handleError(new Error('测试错误'));
    });
    
    // 验证状态
    expect(result.current.isDialogOpen).toBe(true);
    expect(result.current.dialogData).toEqual({
      title: 'Error Occurred',
      description: '测试错误'
    });
    
    // 验证返回值
    expect(handleResult).toEqual({
      success: false,
      error: '测试错误'
    });
  });

  it('应该处理字符串错误', () => {
    const { result } = renderHook(() => useErrorHandling());
    
    // 调用handleError，传入字符串
    let handleResult;
    act(() => {
      handleResult = result.current.handleError('测试错误字符串');
    });
    
    // 验证状态
    expect(result.current.isDialogOpen).toBe(true);
    expect(result.current.dialogData).toEqual({
      title: 'Error Occurred',
      description: '测试错误字符串'
    });
    
    // 验证返回值
    expect(handleResult).toEqual({
      success: false,
      error: '测试错误字符串'
    });
  });

  it('应该使用自定义标题', () => {
    const { result } = renderHook(() => useErrorHandling());
    
    // 调用handleError，传入自定义标题
    act(() => {
      result.current.handleError(new Error('测试错误'), '自定义错误标题');
    });
    
    // 验证状态
    expect(result.current.dialogData).toEqual({
      title: '自定义错误标题',
      description: '测试错误'
    });
  });
});
