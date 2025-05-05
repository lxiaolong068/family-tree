import React from 'react';
import { render, screen, act } from '@/lib/test-utils';
import DragEditorContent from '../DragEditorContent';

// 模拟family-tree-utils模块
jest.mock('@/lib/family-tree-utils', () => ({
  createNewFamilyTree: jest.fn().mockReturnValue({
    members: [],
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  }),
  loadFamilyTreeFromLocalStorage: jest.fn().mockReturnValue({
    members: [
      { id: 'member-1', name: '张三', relation: '父亲', gender: 'male' },
      { id: 'member-2', name: '李四', relation: '母亲', gender: 'female' }
    ],
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  }),
  saveFamilyTreeToLocalStorage: jest.fn(),
  loadFamilyTreeFromDatabase: jest.fn().mockResolvedValue(null),
  saveFamilyTreeToDatabase: jest.fn().mockResolvedValue({ id: 123, success: true })
}));

// 模拟数据库配置
jest.mock('@/db', () => ({
  isDatabaseConfigured: jest.fn().mockReturnValue(true)
}));

// 模拟next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// 模拟DraggableFamilyTree组件
jest.mock('../DraggableFamilyTree', () => {
  return jest.fn().mockImplementation(({ familyTree }) => {
    return (
      <div data-testid="mock-draggable-family-tree">
        <div>Members count: {familyTree.members.length}</div>
      </div>
    );
  });
});

// 模拟SuccessDialog组件
jest.mock('@/components/ui/success-dialog', () => ({
  SuccessDialog: jest.fn().mockImplementation(() => null)
}));

// 模拟ErrorDialog组件
jest.mock('@/components/ui/error-dialog', () => ({
  ErrorDialog: jest.fn().mockImplementation(() => null)
}));

describe('DragEditorContent组件', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // 模拟window.location
    Object.defineProperty(window, 'location', {
      value: {
        search: '',
        pathname: '/drag-editor',
        href: 'http://localhost:3000/drag-editor',
      },
      writable: true
    });

    // 模拟window.history
    Object.defineProperty(window, 'history', {
      value: {
        replaceState: jest.fn(),
      },
      writable: true
    });

    // 模拟URL和URLSearchParams
    global.URL = jest.fn().mockImplementation((url) => ({
      toString: () => url,
      searchParams: {
        set: jest.fn(),
      }
    })) as any;

    global.URLSearchParams = jest.fn().mockImplementation(() => ({
      get: jest.fn().mockReturnValue(null),
    })) as any;
  });

  it('应该正确渲染组件', async () => {
    await act(async () => {
      render(<DragEditorContent />);
    });

    // 验证标题渲染正确
    expect(screen.getByText('Drag & Drop Family Tree Editor')).toBeInTheDocument();

    // 验证说明文本渲染正确
    expect(screen.getByText(/Create relationships between family members/)).toBeInTheDocument();

    // 验证按钮渲染正确
    expect(screen.getByText('Reload')).toBeInTheDocument();
    expect(screen.getByText('Save to Database')).toBeInTheDocument();
    expect(screen.getByText('Back to Form Editor')).toBeInTheDocument();

    // 验证DraggableFamilyTree组件被渲染
    expect(screen.getByTestId('mock-draggable-family-tree')).toBeInTheDocument();

    // 验证家谱成员数量显示正确
    expect(screen.getByText('Members count: 2')).toBeInTheDocument();
  });
});
