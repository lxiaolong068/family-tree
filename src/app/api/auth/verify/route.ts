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
  } catch (error: any) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Invalid token', message: error.message },
      { status: 401 }
    );
  }
}
