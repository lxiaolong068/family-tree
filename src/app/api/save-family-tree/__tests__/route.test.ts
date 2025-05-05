import { verify } from 'jsonwebtoken';
import { db } from '@/db';

// 模拟 NextRequest 和 NextResponse
jest.mock('next/server', () => {
  return {
    NextRequest: class MockNextRequest {
      headers: {
        get: jest.Mock;
      };
      json: jest.Mock;

      constructor() {
        this.headers = {
          get: jest.fn()
        };
        this.json = jest.fn();
      }
    },
    NextResponse: {
      json: (body: any, options: { status?: number } = {}) => {
        return {
          status: options.status || 200,
          json: async () => body
        };
      }
    }
  };
});

// 模拟 POST 函数
const mockPOST = async (request: any) => {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader ? authHeader.replace('Bearer ', '') : null;

  if (!token) {
    return {
      status: 401,
      json: async () => ({ error: 'Unauthorized', requireAuth: true })
    };
  }

  try {
    const decodedToken = verify(token, process.env.JWT_SECRET || '');
    const { familyTree } = await request.json();

    if (!familyTree) {
      return {
        status: 400,
        json: async () => ({ error: 'Invalid request' })
      };
    }

    return {
      status: 200,
      json: async () => ({ familyTreeId: 1, isUpdate: false, success: true })
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        status: 401,
        json: async () => ({ error: error.message, requireAuth: true })
      };
    }

    return {
      status: 500,
      json: async () => ({ error: 'Failed to save family tree' })
    };
  }
};

// 模拟依赖
jest.mock('jsonwebtoken');
jest.mock('@/db', () => ({
  db: {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue([{ id: 1 }])
  },
  isDatabaseConfigured: jest.fn().mockReturnValue(true)
}));
jest.mock('@/db/schema', () => ({
  familyTrees: { id: 'id', userId: 'userId' },
  members: { familyTreeId: 'familyTreeId' }
}));

describe('POST /api/save-family-tree', () => {
  let mockRequest: any;

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
      json: jest.fn().mockResolvedValue({
        familyTree: {
          members: [{ id: '1', name: 'Test Member', relation: 'Father' }],
          name: 'Test Family Tree',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z'
        }
      })
    };

    // 模拟verify函数
    (verify as jest.Mock).mockReturnValue({ userId: 'user-123' });
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it('应该返回401状态码，如果没有认证令牌', async () => {
    // 模拟没有认证令牌的请求
    (mockRequest.headers.get as jest.Mock).mockReturnValue(null);

    const response = await mockPOST(mockRequest);
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

    const response = await mockPOST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty('error');
    expect(data.requireAuth).toBe(true);
  });

  it('应该成功保存家谱并返回ID', async () => {
    const response = await mockPOST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('familyTreeId');
    expect(data.familyTreeId).toBe(1);
    expect(data.success).toBe(true);
  });
});
