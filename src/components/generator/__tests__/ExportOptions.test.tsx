import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExportOptions from '../ExportOptions';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import userEvent from '@testing-library/user-event';
import { handleClientError } from '@/lib/error-handler';

// 模拟html2canvas和jsPDF
jest.mock('html2canvas', () => jest.fn());
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => {
    return {
      addImage: jest.fn(),
      save: jest.fn()
    };
  });
});

// 模拟error-handler
jest.mock('@/lib/error-handler', () => ({
  handleClientError: jest.fn()
}));

describe('ExportOptions组件', () => {
  // 创建模拟的chart ref
  const mockChartRef = {
    current: document.createElement('div')
  };

  // 模拟canvas元素和方法
  const mockCanvas = {
    toDataURL: jest.fn().mockReturnValue('data:image/png;base64,mockImageData'),
    width: 800,
    height: 600
  };

  // 模拟document.createElement
  const originalCreateElement = document.createElement;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // 模拟html2canvas返回模拟的canvas
    (html2canvas as jest.Mock).mockResolvedValue(mockCanvas);
    
    // 模拟document.createElement创建链接
    document.createElement = jest.fn().mockImplementation((tagName) => {
      if (tagName === 'a') {
        return {
          href: '',
          download: '',
          click: jest.fn()
        };
      }
      return originalCreateElement.call(document, tagName);
    });
  });
  
  afterEach(() => {
    // 恢复原始的document.createElement
    document.createElement = originalCreateElement;
  });

  it('应该正确渲染组件', () => {
    render(
      <ExportOptions
        familyTreeName="Test Family Tree"
        chartRef={mockChartRef as React.RefObject<HTMLDivElement>}
      />
    );

    // 验证标题
    expect(screen.getByText('Export Family Tree')).toBeInTheDocument();
    
    // 验证导出按钮
    expect(screen.getByText('导出')).toBeInTheDocument();
  });

  it('当disabled为true时应该禁用导出按钮', () => {
    render(
      <ExportOptions
        familyTreeName="Test Family Tree"
        chartRef={mockChartRef as React.RefObject<HTMLDivElement>}
        disabled={true}
      />
    );

    // 验证导出按钮被禁用
    const exportButton = screen.getByText('导出');
    expect(exportButton.closest('button')).toBeDisabled();
    
    // 验证提示信息
    expect(screen.getByText('Add family members to enable export')).toBeInTheDocument();
  });

  it('应该导出为PNG', async () => {
    const user = userEvent.setup();
    
    render(
      <ExportOptions
        familyTreeName="Test Family Tree"
        chartRef={mockChartRef as React.RefObject<HTMLDivElement>}
      />
    );

    // 点击导出按钮
    const exportButton = screen.getByText('导出');
    await user.click(exportButton);
    
    // 点击"Export as PNG"选项
    const pngOption = screen.getByText('Export as PNG');
    await user.click(pngOption);
    
    // 验证html2canvas被调用
    expect(html2canvas).toHaveBeenCalledWith(
      mockChartRef.current,
      expect.objectContaining({
        scale: 2,
        backgroundColor: '#ffffff'
      })
    );
    
    // 验证创建了下载链接
    expect(document.createElement).toHaveBeenCalledWith('a');
    
    // 获取模拟的a元素
    const mockAnchor = (document.createElement as jest.Mock).mock.results[0].value;
    
    // 验证设置了正确的属性
    expect(mockAnchor.href).toBe('data:image/png;base64,mockImageData');
    expect(mockAnchor.download).toBe('Test Family Tree.png');
    
    // 验证点击了链接
    expect(mockAnchor.click).toHaveBeenCalled();
  });

  it('应该导出为PDF', async () => {
    const user = userEvent.setup();
    
    render(
      <ExportOptions
        familyTreeName="Test Family Tree"
        chartRef={mockChartRef as React.RefObject<HTMLDivElement>}
      />
    );

    // 点击导出按钮
    const exportButton = screen.getByText('导出');
    await user.click(exportButton);
    
    // 点击"Export as PDF"选项
    const pdfOption = screen.getByText('Export as PDF');
    await user.click(pdfOption);
    
    // 验证html2canvas被调用
    expect(html2canvas).toHaveBeenCalledWith(
      mockChartRef.current,
      expect.objectContaining({
        scale: 2,
        backgroundColor: '#ffffff'
      })
    );
    
    // 验证创建了jsPDF实例
    expect(jsPDF).toHaveBeenCalledWith({
      orientation: 'landscape',
      unit: 'mm'
    });
    
    // 获取模拟的jsPDF实例
    const mockPdf = (jsPDF as jest.Mock).mock.instances[0];
    
    // 验证调用了addImage
    expect(mockPdf.addImage).toHaveBeenCalledWith(
      'data:image/png;base64,mockImageData',
      'PNG',
      10,
      10,
      280,
      210 // (600 * 280) / 800
    );
    
    // 验证调用了save
    expect(mockPdf.save).toHaveBeenCalledWith('Test Family Tree.pdf');
  });

  it('当chartRef.current为null时不应该导出', async () => {
    const user = userEvent.setup();
    
    // 创建一个current为null的ref
    const nullChartRef = { current: null };
    
    render(
      <ExportOptions
        familyTreeName="Test Family Tree"
        chartRef={nullChartRef as React.RefObject<HTMLDivElement>}
      />
    );

    // 点击导出按钮
    const exportButton = screen.getByText('导出');
    await user.click(exportButton);
    
    // 点击"Export as PNG"选项
    const pngOption = screen.getByText('Export as PNG');
    await user.click(pngOption);
    
    // 验证html2canvas没有被调用
    expect(html2canvas).not.toHaveBeenCalled();
  });

  it('应该处理导出PNG时的错误', async () => {
    const user = userEvent.setup();
    
    // 模拟html2canvas抛出错误
    (html2canvas as jest.Mock).mockRejectedValue(new Error('Export error'));
    
    // 模拟handleClientError
    (handleClientError as jest.Mock).mockReturnValue('导出失败，请重试');
    
    // 模拟window.alert
    const originalAlert = window.alert;
    window.alert = jest.fn();
    
    render(
      <ExportOptions
        familyTreeName="Test Family Tree"
        chartRef={mockChartRef as React.RefObject<HTMLDivElement>}
      />
    );

    // 点击导出按钮
    const exportButton = screen.getByText('导出');
    await user.click(exportButton);
    
    // 点击"Export as PNG"选项
    const pngOption = screen.getByText('Export as PNG');
    await user.click(pngOption);
    
    // 等待异步操作完成
    await waitFor(() => {
      // 验证handleClientError被调用
      expect(handleClientError).toHaveBeenCalledWith(new Error('Export error'));
      
      // 验证alert被调用
      expect(window.alert).toHaveBeenCalledWith('导出失败，请重试');
    });
    
    // 恢复原始的alert
    window.alert = originalAlert;
  });

  it('应该处理导出PDF时的错误', async () => {
    const user = userEvent.setup();
    
    // 模拟html2canvas抛出错误
    (html2canvas as jest.Mock).mockRejectedValue(new Error('Export error'));
    
    // 模拟handleClientError
    (handleClientError as jest.Mock).mockReturnValue('导出失败，请重试');
    
    // 模拟window.alert
    const originalAlert = window.alert;
    window.alert = jest.fn();
    
    render(
      <ExportOptions
        familyTreeName="Test Family Tree"
        chartRef={mockChartRef as React.RefObject<HTMLDivElement>}
      />
    );

    // 点击导出按钮
    const exportButton = screen.getByText('导出');
    await user.click(exportButton);
    
    // 点击"Export as PDF"选项
    const pdfOption = screen.getByText('Export as PDF');
    await user.click(pdfOption);
    
    // 等待异步操作完成
    await waitFor(() => {
      // 验证handleClientError被调用
      expect(handleClientError).toHaveBeenCalledWith(new Error('Export error'));
      
      // 验证alert被调用
      expect(window.alert).toHaveBeenCalledWith('导出失败，请重试');
    });
    
    // 恢复原始的alert
    window.alert = originalAlert;
  });
});
