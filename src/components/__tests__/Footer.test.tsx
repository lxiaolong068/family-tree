import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer组件', () => {
  beforeEach(() => {
    // 模拟当前年份为2024
    jest.spyOn(Date.prototype, 'getFullYear').mockReturnValue(2024);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('应该正确渲染页脚', () => {
    render(<Footer />);
    
    // 验证Logo
    expect(screen.getByText('Family Tree')).toBeInTheDocument();
    
    // 验证描述文本
    expect(screen.getByText(/Create beautiful family trees/i)).toBeInTheDocument();
    
    // 验证社交媒体链接
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    
    // 验证快速链接
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Knowledge')).toBeInTheDocument();
    expect(screen.getByText('Templates')).toBeInTheDocument();
    expect(screen.getByText('Generator')).toBeInTheDocument();
    expect(screen.getByText('Drag Editor')).toBeInTheDocument();
    
    // 验证法律链接
    expect(screen.getByText('Legal')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Use')).toBeInTheDocument();
    expect(screen.getByText('How to Make a Family Tree')).toBeInTheDocument();
    
    // 验证版权信息
    expect(screen.getByText(/© 2024 Family Tree Maker/i)).toBeInTheDocument();
    expect(screen.getByText(/Designed with ❤️/i)).toBeInTheDocument();
  });

  it('应该包含正确的链接', () => {
    render(<Footer />);
    
    // 验证Logo链接
    const logoLink = screen.getByText('Family Tree').closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
    
    // 验证社交媒体链接
    const githubLink = screen.getByText('GitHub').closest('a');
    const twitterLink = screen.getByText('Twitter').closest('a');
    const emailLink = screen.getByText('Email').closest('a');
    
    expect(githubLink).toHaveAttribute('href', 'https://github.com');
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com');
    expect(emailLink).toHaveAttribute('href', 'mailto:contact@family-tree.cc');
    
    // 验证快速链接
    const homeLink = screen.getByText('Home').closest('a');
    const knowledgeLink = screen.getByText('Knowledge').closest('a');
    const templatesLink = screen.getByText('Templates').closest('a');
    const generatorLink = screen.getByText('Generator').closest('a');
    const dragEditorLink = screen.getByText('Drag Editor').closest('a');
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(knowledgeLink).toHaveAttribute('href', '/knowledge');
    expect(templatesLink).toHaveAttribute('href', '/templates');
    expect(generatorLink).toHaveAttribute('href', '/generator');
    expect(dragEditorLink).toHaveAttribute('href', '/drag-editor');
    
    // 验证法律链接
    const privacyLink = screen.getByText('Privacy Policy').closest('a');
    const termsLink = screen.getByText('Terms of Use').closest('a');
    const howToLink = screen.getByText('How to Make a Family Tree').closest('a');
    
    expect(privacyLink).toHaveAttribute('href', '/privacy');
    expect(termsLink).toHaveAttribute('href', '/terms');
    expect(howToLink).toHaveAttribute('href', '/how-to-make-a-family-tree');
  });

  it('社交媒体链接应该有正确的属性', () => {
    render(<Footer />);
    
    // 验证社交媒体链接的target和rel属性
    const githubLink = screen.getByText('GitHub').closest('a');
    const twitterLink = screen.getByText('Twitter').closest('a');
    
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    expect(twitterLink).toHaveAttribute('target', '_blank');
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('应该显示当前年份', () => {
    render(<Footer />);
    
    // 验证版权信息包含当前年份
    expect(screen.getByText(/© 2024 Family Tree Maker/i)).toBeInTheDocument();
  });
});
