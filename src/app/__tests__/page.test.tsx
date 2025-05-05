import React from 'react';
import { render, screen } from '@/lib/test-utils';
import HomePage from '../page';

// 模拟next/link组件
jest.mock('next/link', () => {
  return jest.fn(({ href, children }) => {
    return <a href={href} data-testid={`link-to-${href}`}>{children}</a>;
  });
});

// 模拟next/image组件
jest.mock('next/image', () => {
  return jest.fn(({ src, alt, ...props }) => {
    return <img src={src} alt={alt} {...props} data-testid="mock-image" />;
  });
});

describe('HomePage组件', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该正确渲染页面标题和主要内容', () => {
    render(<HomePage />);

    // 验证页面标题（使用queryAllByText因为标题可能出现多次）
    const titleElements = screen.queryAllByText('How to Make a Family Tree');
    expect(titleElements.length).toBeGreaterThan(0);

    // 验证页面描述
    expect(screen.getByText(/Creating your family tree has never been easier/i)).toBeInTheDocument();

    // 验证主要按钮
    expect(screen.getByText('Start Creating Now')).toBeInTheDocument();
    expect(screen.getByText('Read Our Guide')).toBeInTheDocument();
  });

  it('应该包含正确的链接', () => {
    render(<HomePage />);

    // 验证"Start Creating Now"按钮链接到/generator
    const createButton = screen.getByText('Start Creating Now');
    const createLink = createButton.closest('a');
    expect(createLink).toHaveAttribute('href', '/generator');

    // 验证"Read Our Guide"按钮链接到/how-to-make-a-family-tree
    const guideButton = screen.getByText('Read Our Guide');
    const guideLink = guideButton.closest('a');
    expect(guideLink).toHaveAttribute('href', '/how-to-make-a-family-tree');

    // 验证底部"Start Creating Your Family Tree"按钮链接到/generator
    const bottomButton = screen.getByText('Start Creating Your Family Tree');
    const bottomLink = bottomButton.closest('a');
    expect(bottomLink).toHaveAttribute('href', '/generator');
  });

  it('应该显示家谱创建的四个步骤', () => {
    render(<HomePage />);

    // 验证步骤标题
    expect(screen.getByText('How to Create Your Family Tree in 4 Simple Steps')).toBeInTheDocument();

    // 验证四个步骤
    expect(screen.getByText('Gather Family Information')).toBeInTheDocument();
    expect(screen.getByText('Choose a Family Tree Style')).toBeInTheDocument();
    expect(screen.getByText('Create Your Chart Using Our Tool')).toBeInTheDocument();
    expect(screen.getByText('Export and Share')).toBeInTheDocument();

    // 验证步骤描述
    expect(screen.getByText(/Contact relatives to collect names/i)).toBeInTheDocument();
    expect(screen.getByText(/Select from ancestor charts/i)).toBeInTheDocument();
    expect(screen.getByText(/Use our online tool to organize information/i)).toBeInTheDocument();
    expect(screen.getByText(/Save your family tree as PDF or image format/i)).toBeInTheDocument();
  });

  it('应该显示三个主要功能卡片', () => {
    render(<HomePage />);

    // 验证三个功能卡片标题
    expect(screen.getByText('Easy-to-Use Tools')).toBeInTheDocument();
    expect(screen.getByText('Professional Templates')).toBeInTheDocument();
    expect(screen.getByText('Easy Sharing')).toBeInTheDocument();

    // 验证功能卡片描述
    expect(screen.getByText(/Our intuitive family tree maker/i)).toBeInTheDocument();
    expect(screen.getByText(/Choose from a variety of professionally designed/i)).toBeInTheDocument();
    expect(screen.getByText(/Export your family tree as PDF or images/i)).toBeInTheDocument();
  });

  it('应该显示常见问题部分', () => {
    render(<HomePage />);

    // 验证FAQ标题
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();

    // 验证FAQ问题
    expect(screen.getByText('What information do I need to create a family tree?')).toBeInTheDocument();
    expect(screen.getByText('How many generations should I include in my family tree?')).toBeInTheDocument();
    expect(screen.getByText('Can I add photos to my family tree?')).toBeInTheDocument();

    // 验证FAQ答案
    expect(screen.getByText(/To create a basic family tree, you'll need names/i)).toBeInTheDocument();
    expect(screen.getByText(/Most family trees include 3-4 generations/i)).toBeInTheDocument();
    expect(screen.getByText(/Yes, adding photos personalizes your family tree/i)).toBeInTheDocument();
  });

  it('应该包含结构化数据脚本', () => {
    render(<HomePage />);

    // 获取所有script标签
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');

    // 验证至少有两个结构化数据脚本（HowTo和FAQPage）
    expect(scripts.length).toBeGreaterThanOrEqual(2);

    // 验证第一个脚本包含HowTo结构化数据
    const howToScript = scripts[0];
    const howToData = JSON.parse(howToScript.innerHTML);
    expect(howToData['@type']).toBe('HowTo');
    expect(howToData.name).toBe('How to Make a Family Tree');
    expect(howToData.step.length).toBe(4);

    // 验证第二个脚本包含FAQPage结构化数据
    const faqScript = scripts[1];
    const faqData = JSON.parse(faqScript.innerHTML);
    expect(faqData['@type']).toBe('FAQPage');
    expect(faqData.mainEntity.length).toBe(3);
  });
});
