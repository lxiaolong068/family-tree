// 导入测试设置
import '../../../api/__tests__/setup';

import { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';
import { db } from '@/db';
import { familyTrees, members } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

// 导入 GET 函数
import { GET } from '../[id]/route';

// 模拟依赖
jest.mock('jsonwebtoken');
jest.mock('@/db', () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis()
  },
  isDatabaseConfigured: jest.fn().mockReturnValue(true)
}));
jest.mock('@/db/schema', () => ({
  familyTrees: { id: 'id', userId: 'userId' },
  members: { familyTreeId: 'familyTreeId' }
}));
jest.mock('drizzle-orm', () => ({
  and: jest.fn(),
  eq: jest.fn()
}));

describe('GET /api/family-trees/[id]', () => {
  let mockRequest: NextRequest;
  const mockParams = { id: '1' };

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
      }
    } as unknown as NextRequest;

    // 模拟verify函数
    (verify as jest.Mock).mockReturnValue({ userId: 'user-123' });
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it('应该返回401状态码，如果没有认证令牌', async () => {
    // 模拟没有认证令牌的请求
    (mockRequest.headers.get as jest.Mock).mockReturnValue(null);

    const response = await GET(mockRequest, { params: mockParams });
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

    const response = await GET(mockRequest, { params: mockParams });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty('error');
    expect(data.requireAuth).toBe(true);
  });

  it('应该返回404状态码，如果家谱不存在或不属于当前用户', async () => {
    // 模拟数据库查询返回空结果
    (db.select as jest.Mock).mockReturnThis();
    (db.from as jest.Mock).mockReturnThis();
    (db.where as jest.Mock).mockResolvedValue([]);

    const response = await GET(mockRequest, { params: mockParams });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('not found');
  });

  it('应该返回家谱数据，如果家谱存在且属于当前用户', async () => {
    // 模拟数据库查询返回家谱数据
    const mockFamilyTreeData = [
      { id: 1, name: 'Test Family Tree', userId: 'user-123', createdAt: new Date(), updatedAt: new Date() }
    ];

    const mockMembersData = [
      { id: 'member-1', name: 'Member 1', relation: 'father', familyTreeId: 1 }
    ];

    // 第一次调用返回家谱数据，第二次调用返回成员数据
    (db.select as jest.Mock).mockReturnThis();
    (db.from as jest.Mock).mockReturnThis();
    (db.where as jest.Mock)
      .mockResolvedValueOnce(mockFamilyTreeData)
      .mockResolvedValueOnce(mockMembersData);

    const response = await GET(mockRequest, { params: mockParams });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('members');
    expect(data.members).toHaveLength(1);
    expect(data.members[0].name).toBe('Member 1');
  });

  it('应该使用正确的查询条件验证用户权限', async () => {
    // 模拟数据库查询返回家谱数据
    (db.select as jest.Mock).mockReturnThis();
    (db.from as jest.Mock).mockReturnThis();
    (db.where as jest.Mock).mockResolvedValue([
      { id: 1, name: 'Test Family Tree', userId: 'user-123', createdAt: new Date(), updatedAt: new Date() }
    ]);

    await GET(mockRequest, { params: mockParams });

    // 验证and和eq函数被正确调用
    expect(and).toHaveBeenCalled();
    expect(eq).toHaveBeenCalledWith(familyTrees.id, 1);
    expect(eq).toHaveBeenCalledWith(familyTrees.userId, 'user-123');
  });
});
