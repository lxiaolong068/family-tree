import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verify } from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    // 从请求头获取令牌
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
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

    const decoded = verify(token, jwtSecret) as { userId: string };
    
    // 获取用户信息
    // 检查数据库连接
    if (!db) {
      return NextResponse.json(
        { error: '数据库连接不可用' },
        { status: 500 }
      );
    }
    
    const userData = await db.select().from(users).where(eq(users.id, decoded.userId));
    
    if (userData.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: userData[0].id,
        name: userData[0].name,
        email: userData[0].email,
        profileImage: userData[0].profileImage,
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    // 类型断言处理
    const errorMessage = error instanceof Error ? error.message : '未知令牌验证错误';
    return NextResponse.json(
      { error: 'Invalid token', message: errorMessage },
      { status: 401 }
    );
  }
}
