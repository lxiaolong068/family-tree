import React from 'react';
import { render, screen, waitFor } from '@/lib/test-utils';
import MermaidChart from '../MermaidChart';

// 模拟mermaid库
jest.mock('mermaid', () => ({
  initialize: jest.fn(),
  render: jest.fn().mockImplementation((id, definition) => {
    // 根据不同的图表定义返回不同的结果
    if (definition.includes('error')) {
      return Promise.reject(new Error('Mermaid rendering error'));
    }
    return Promise.resolve({ svg: `<svg data-testid="mermaid-svg">测试SVG: ${definition}</svg>` });
  })
}));

describe('MermaidChart组件', () => {
  beforeEach(() => {
    // 清除所有模拟的调用记录
    jest.clearAllMocks();
  });

  it('应该初始化mermaid库', () => {
    render(<MermaidChart chartDefinition="graph TD; A-->B" />);

    // 验证mermaid.initialize被调用
    const mermaid = require('mermaid');
    expect(mermaid.initialize).toHaveBeenCalledWith(expect.objectContaining({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose'
    }));
  });

  it('应该渲染mermaid图表', async () => {
    render(<MermaidChart chartDefinition="graph TD; A-->B" />);

    // 验证mermaid.render被调用
    const mermaid = require('mermaid');
    expect(mermaid.render).toHaveBeenCalledWith(
      expect.stringContaining('mermaid-chart-'),
      "graph TD; A-->B"
    );

    // 等待图表渲染完成
    await waitFor(() => {
      // 使用data-testid来查找SVG元素
      const svgElement = document.querySelector('[data-testid="mermaid-svg"]');
      expect(svgElement).toBeInTheDocument();
      expect(svgElement?.textContent).toContain('测试SVG');
    });
  });

  it('应该处理空的图表定义', () => {
    // 给组件添加一个data-testid以便于选择
    render(<MermaidChart chartDefinition="" data-testid="empty-chart" />);

    // 验证mermaid.render没有被调用
    const mermaid = require('mermaid');
    expect(mermaid.render).not.toHaveBeenCalled();

    // 由于我们使用了自定义的render函数，不能直接检查innerHTML
    // 而是检查是否没有渲染任何内容
    // 注意：在实际组件中，即使没有内容，div元素仍然存在
    const chartContainer = screen.getByTestId('empty-chart');
    expect(chartContainer.innerHTML).toBe('');
  });

  it('应该处理渲染错误 - Promise.reject', async () => {
    // 控制台错误信息会被输出，我们可以模拟console.error来避免测试输出中的噪音
    const originalConsoleError = console.error;
    console.error = jest.fn();

    render(<MermaidChart chartDefinition="graph TD; error-->B" />);

    // 验证mermaid.render被调用
    const mermaid = require('mermaid');
    expect(mermaid.render).toHaveBeenCalledWith(
      expect.stringContaining('mermaid-chart-'),
      "graph TD; error-->B"
    );

    // 等待错误处理完成
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
      // 检查错误消息是否显示
      const errorElement = document.querySelector('.text-red-500');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement?.textContent).toContain('Chart rendering failed');
    });

    // 恢复原始console.error
    console.error = originalConsoleError;
  });

  it('应该处理渲染错误 - 同步异常', async () => {
    // 控制台错误信息会被输出，我们可以模拟console.error来避免测试输出中的噪音
    const originalConsoleError = console.error;
    console.error = jest.fn();

    // 模拟mermaid.render抛出同步异常
    const mermaid = require('mermaid');
    const originalRender = mermaid.render;
    mermaid.render = jest.fn().mockImplementation(() => {
      throw new Error('Synchronous error');
    });

    render(<MermaidChart chartDefinition="graph TD; sync-error-->B" data-testid="sync-error-chart" />);

    // 等待错误处理完成
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
      // 检查错误消息是否显示
      const chartContainer = screen.getByTestId('sync-error-chart');
      expect(chartContainer.innerHTML).toContain('Chart rendering failed');
      expect(chartContainer.innerHTML).toContain('Synchronous error');
    });

    // 恢复原始函数
    mermaid.render = originalRender;
    console.error = originalConsoleError;
  });

  it('应该应用自定义className', () => {
    // 给组件添加一个data-testid以便于选择
    render(
      <MermaidChart
        chartDefinition="graph TD; A-->B"
        className="custom-class"
        data-testid="custom-class-chart"
      />
    );

    // 由于我们使用了自定义的render函数，不能直接检查firstChild
    // 而是通过查找元素来检查className
    const chartContainer = screen.getByTestId('custom-class-chart');
    expect(chartContainer).toHaveClass('custom-class');
  });

  it('应该在图表定义变化时重新渲染', async () => {
    const { rerender } = render(
      <MermaidChart chartDefinition="graph TD; A-->B" />
    );

    // 等待第一次渲染完成
    await waitFor(() => {
      // 使用data-testid来查找SVG元素
      const svgElement = document.querySelector('[data-testid="mermaid-svg"]');
      expect(svgElement).toBeInTheDocument();
      expect(svgElement?.textContent).toContain('graph TD; A-->B');
    });

    // 重新渲染组件，使用新的图表定义
    rerender(<MermaidChart chartDefinition="graph TD; C-->D" />);

    // 验证mermaid.render被再次调用，使用新的图表定义
    const mermaid = require('mermaid');
    expect(mermaid.render).toHaveBeenCalledWith(
      expect.stringContaining('mermaid-chart-'),
      "graph TD; C-->D"
    );

    // 等待第二次渲染完成
    await waitFor(() => {
      // 使用data-testid来查找SVG元素
      const svgElement = document.querySelector('[data-testid="mermaid-svg"]');
      expect(svgElement).toBeInTheDocument();
      expect(svgElement?.textContent).toContain('graph TD; C-->D');
    });
  });
});
