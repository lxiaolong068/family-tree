import React from 'react';
import { render, screen, act, fireEvent } from '@/lib/test-utils';
import ProfilePage from '../page';

// 模拟认证上下文
const mockUseAuth = jest.fn();
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}));

// 模拟路由
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/',
}));

// 模拟FamilyTreeList组件
jest.mock('@/components/profile/FamilyTreeList', () => {
  return {
    __esModule: true,
    default: (props: { userId: string }) => (
      <div data-testid="family-tree-list" data-user-id={props.userId}>
        Mock Family Tree List
      </div>
    )
  };
});

describe('ProfilePage组件', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('当未认证时应重定向到首页', async () => {
    // 模拟未认证状态
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    await act(async () => {
      render(<ProfilePage />);
    });

    // 验证重定向是否发生
    expect(mockPush).toHaveBeenCalledWith('/');
    // 检查不应该渲染任何个人资料内容
    expect(screen.queryByText('User Profile')).not.toBeInTheDocument();
  });

  it('认证中时应显示加载状态', async () => {
    // 模拟加载中状态
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
    });

    await act(async () => {
      render(<ProfilePage />);
    });

    // 检查加载状态是否显示
    expect(screen.getByText('Loading profile...')).toBeInTheDocument();
    // 验证不应发生重定向
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('已认证时应显示用户个人资料', async () => {
    // 模拟已认证状态
    mockUseAuth.mockReturnValue({
      user: {
        id: 'test-id',
        name: 'Test User',
        email: 'test@example.com',
        profileImage: '/test-image.jpg',
      },
      isAuthenticated: true,
      isLoading: false,
    });

    await act(async () => {
      render(<ProfilePage />);
    });

    // 检查个人资料内容是否显示
    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();

    // 检查是否有"创建新家谱"按钮
    expect(screen.getByText('Create New Family Tree')).toBeInTheDocument();

    // 检查是否正确传递用户ID到FamilyTreeList组件
    const familyTreeList = screen.getByTestId('family-tree-list');
    expect(familyTreeList).toHaveAttribute('data-user-id', 'test-id');
  });

  it('应该包含SEO相关的结构化数据脚本', async () => {
    // 模拟已认证状态
    mockUseAuth.mockReturnValue({
      user: {
        id: 'test-id',
        name: 'Test User',
        email: 'test@example.com',
      },
      isAuthenticated: true,
      isLoading: false,
    });

    await act(async () => {
      render(<ProfilePage />);
    });

    // 获取所有script标签
    const scripts = document.querySelectorAll('script');

    // 查找id为schema-profile的script标签
    let schemaScript: HTMLScriptElement | undefined;
    scripts.forEach((script) => {
      if (script.id === 'schema-profile') {
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
      expect(schemaData['@type']).toBe('ProfilePage');
      expect(schemaData.mainEntity['@type']).toBe('Person');
      expect(schemaData.mainEntity.name).toBe('Test User');
      expect(schemaData.mainEntity.email).toBe('test@example.com');
    }
  });

  it('点击"创建新家谱"按钮应导航到生成器页面', async () => {
    // 模拟已认证状态
    mockUseAuth.mockReturnValue({
      user: {
        id: 'test-id',
        name: 'Test User',
        email: 'test@example.com',
      },
      isAuthenticated: true,
      isLoading: false,
    });

    await act(async () => {
      render(<ProfilePage />);
    });

    // 点击"创建新家谱"按钮
    const createButton = screen.getByText('Create New Family Tree');
    fireEvent.click(createButton);

    // 验证导航是否发生
    expect(mockPush).toHaveBeenCalledWith('/generator');
  });
});
