import React from 'react';
import { render, screen } from '@/lib/test-utils';
import DragEditorPage from '../page';
import DragEditorContent from '@/components/generator/DragEditorContent';

// 模拟DragEditorContent组件
jest.mock('@/components/generator/DragEditorContent', () => {
  return jest.fn().mockImplementation(() => {
    return <div data-testid="mock-drag-editor-content">Mock Drag Editor Content</div>;
  });
});

describe('DragEditorPage组件', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该正确渲染DragEditorContent组件', () => {
    render(<DragEditorPage />);
    
    // 验证DragEditorContent组件被渲染
    expect(screen.getByTestId('mock-drag-editor-content')).toBeInTheDocument();
    expect(screen.getByText('Mock Drag Editor Content')).toBeInTheDocument();
    
    // 验证DragEditorContent组件被调用
    expect(DragEditorContent).toHaveBeenCalled();
  });

  it('应该包含SEO相关的结构化数据脚本', () => {
    render(<DragEditorPage />);
    
    // 获取所有script标签
    const scripts = document.querySelectorAll('script');
    
    // 查找id为schema-drag-editor的script标签
    let schemaScript: HTMLScriptElement | undefined;
    scripts.forEach((script) => {
      if (script.id === 'schema-drag-editor') {
        schemaScript = script;
      }
    });
    
    // 验证script标签存在
    expect(schemaScript).toBeDefined();
    
    // 验证script标签的type属性
    expect(schemaScript?.type).toBe('application/ld+json');
    
    // 验证script标签的内容
    const scriptContent = schemaScript?.innerHTML;
    if (scriptContent) {
      const schemaData = JSON.parse(scriptContent);
      
      // 验证结构化数据的关键字段
      expect(schemaData['@context']).toBe('https://schema.org');
      expect(schemaData['@type']).toBe('WebApplication');
      expect(schemaData.name).toBe('Drag & Drop Family Tree Editor');
      expect(schemaData.applicationCategory).toBe('UtilityApplication');
      expect(schemaData.description).toContain('Create and edit your family tree');
      expect(Array.isArray(schemaData.featureList)).toBe(true);
      expect(schemaData.featureList.length).toBeGreaterThan(0);
    }
  });
});
