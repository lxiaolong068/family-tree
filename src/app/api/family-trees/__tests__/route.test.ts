// 导入测试设置
import '../../../api/__tests__/setup';

import { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';
import { getUserFamilyTrees } from '@/lib/family-tree-utils';

// 导入 GET 函数
import { GET } from '../route';

// 模拟依赖
jest.mock('jsonwebtoken');
jest.mock('@/lib/family-tree-utils');

describe('GET /api/family-trees', () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    jest.clearAllMocks();

    // 模拟环境变量
    process.env.JWT_SECRET = 'test-secret';

    // 模拟请求对象
    mockRequest = {
      headers: {
        get: jest.fn().mockImplementation((name) => {
          if (name === 'Authorization') return 'Bearer valid-token';
          return null;
        })
      },
      nextUrl: {
        searchParams: {
          get: jest.fn().mockReturnValue(null)
        }
      }
    } as unknown as NextRequest;

    // 模拟verify函数
    (verify as jest.Mock).mockReturnValue({ userId: 'user-123' });

    // 模拟getUserFamilyTrees函数
    (getUserFamilyTrees as jest.Mock).mockResolvedValue([
      { id: 1, name: 'Test Family Tree' }
    ]);
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it('应该返回401状态码，如果没有认证令牌', async () => {
    // 模拟没有认证令牌的请求
    (mockRequest.headers.get as jest.Mock).mockReturnValue(null);

    const response = await GET(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty('error');
    expect(data.requireAuth).toBe(true);
  });

  it('应该返回401状态码，如果令牌无效', async () => {
    // 模拟令牌验证失败
    (verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const response = await GET(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty('error');
    expect(data.requireAuth).toBe(true);
  });

  it('应该返回403状态码，如果查询参数中的用户ID与令牌中的不匹配', async () => {
    // 模拟查询参数中的用户ID与令牌中的不匹配
    (mockRequest.nextUrl.searchParams.get as jest.Mock).mockReturnValue('different-user');

    const response = await GET(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('permission');
  });

  it('应该返回用户的家谱列表', async () => {
    const response = await GET(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('familyTrees');
    expect(data.familyTrees).toHaveLength(1);
    expect(data.familyTrees[0].name).toBe('Test Family Tree');

    // 验证getUserFamilyTrees函数被正确调用
    expect(getUserFamilyTrees).toHaveBeenCalledWith('user-123');
  });
});
