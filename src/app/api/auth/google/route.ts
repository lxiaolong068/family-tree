import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sign } from 'jsonwebtoken';
import crypto from 'crypto';
import { verifyFirebaseToken } from '@/lib/token-verifier';

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
      return NextResponse.json(
        { error: 'Invalid token', message: error.message },
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
  } catch (error: any) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed', message: error.message },
      { status: 500 }
    );
  }
}
