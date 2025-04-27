import { NextRequest, NextResponse } from 'next/server';
import { getUserFamilyTrees } from '@/lib/family-tree-utils';
import { verify } from 'jsonwebtoken';
import { handleApiError } from '@/lib/error-handler';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 验证用户认证
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required', requireAuth: true },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // 验证令牌
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json(
        { error: 'JWT secret not configured' },
        { status: 500 }
      );
    }

    let userId: string;
    try {
      const decoded = verify(token, jwtSecret) as { userId: string };
      userId = decoded.userId;
    } catch (error: unknown) {
      return NextResponse.json(
        {
          error: 'Invalid authentication token',
          requireAuth: true,
          message: error instanceof Error ? error.message : 'Token verification failed'
        },
        { status: 401 }
      );
    }

    // 获取查询参数中的用户ID（可选）
    const queryUserId = request.nextUrl.searchParams.get('userId');

    // 如果提供了查询参数中的用户ID，确保它与令牌中的用户ID匹配
    // 这样可以防止用户通过修改查询参数来访问其他用户的家谱
    if (queryUserId && queryUserId !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to access this user\'s family trees' },
        { status: 403 }
      );
    }

    // 获取用户的家谱列表
    const familyTrees = await getUserFamilyTrees(userId);

    return NextResponse.json({ familyTrees });
  } catch (error) {
    console.error('Failed to get family tree list:', error);
    return NextResponse.json(
      handleApiError(error),
      { status: 500 }
    );
  }
}
