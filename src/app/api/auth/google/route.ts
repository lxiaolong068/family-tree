import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sign } from 'jsonwebtoken';
import crypto from 'crypto';
import { verifyFirebaseToken } from '@/lib/token-verifier';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { token } = body;

    console.log('Received token for verification');

    // 验证 Firebase ID 令牌
    let payload;
    try {
      // 使用自定义验证器验证令牌
      payload = await verifyFirebaseToken(token);
      console.log('Token verified successfully');
    } catch (error) {
      console.error('Token verification error:', error);
      // TypeScript类型错误修复: 处理unknown类型的error对象
      // 类型断言处理 - 转换为标准Error对象或提供默认信息
      const errorMessage = error instanceof Error ? error.message : '未知验证错误';
      return NextResponse.json(
        { error: 'Invalid token', message: errorMessage },
        { status: 400 }
      );
    }

    if (!payload || !payload.email) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      );
    }

    // 查找或创建用户
    const { email, name, picture, sub: googleId } = payload;

    // 检查数据库连接
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    // 查找现有用户
    const existingUsers = await db.select().from(users).where(eq(users.email, email));

    let userId: string;

    if (existingUsers.length > 0) {
      // 更新现有用户
      userId = existingUsers[0].id;
      await db.update(users)
        .set({
          googleId,
          name: name || existingUsers[0].name,
          profileImage: picture || existingUsers[0].profileImage,
        })
        .where(eq(users.id, userId));
    } else {
      // 创建新用户
      userId = crypto.randomUUID();
      await db.insert(users).values({
        id: userId,
        email,
        name: name || email.split('@')[0],
        googleId,
        profileImage: picture,
        createdAt: new Date(),
      });
    }

    // 创建 JWT 令牌
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json(
        { error: 'JWT secret not configured' },
        { status: 500 }
      );
    }

    const jwtToken = sign(
      { userId, email },
      jwtSecret,
      { expiresIn: '7d' }
    );

    // 获取用户信息
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    const userData = await db.select().from(users).where(eq(users.id, userId));

    return NextResponse.json({
      token: jwtToken,
      user: {
        id: userData[0].id,
        name: userData[0].name,
        email: userData[0].email,
        profileImage: userData[0].profileImage,
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    // 类型断言处理
    const errorMessage = error instanceof Error ? error.message : '未知身份验证错误';
    return NextResponse.json(
      { error: 'Authentication failed', message: errorMessage },
      { status: 500 }
    );
  }
}
