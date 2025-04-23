import { NextRequest, NextResponse } from 'next/server';
import { db, isDatabaseConfigured } from '@/db';
import { familyTrees, members } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { FamilyTree } from '@/types/family-tree';
import { verify } from 'jsonwebtoken';
import { handleApiError } from '@/lib/error-handler';

export async function POST(request: NextRequest) {
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
          error: '无效的认证令牌', 
          requireAuth: true,
          message: error instanceof Error ? error.message : '令牌验证失败'
        },
        { status: 401 }
      );
    }

    // 解析请求体
    const body = await request.json();
    const { familyTree } = body;

    // 检查数据库配置状态
    const isConfigured = isDatabaseConfigured();
    console.log('数据库配置状态:', isConfigured);

    // Check database connection
    if (!db) {
      return NextResponse.json(
        {
          error: 'Database connection unavailable',
          env: !!process.env.NEON_DATABASE_URL,
          isConfigured: isConfigured,
          publicEnv: process.env.NEXT_PUBLIC_HAS_DATABASE
        },
        { status: 500 }
      );
    }

    // Check family tree data
    if (!familyTree || !familyTree.members) {
      return NextResponse.json(
        { error: 'Invalid family tree data' },
        { status: 400 }
      );
    }

    console.log('Starting to save family tree to database:', {
      membersCount: familyTree.members.length,
      name: familyTree.name,
      rootId: familyTree.rootId,
      userId: userId
    });

    // Save or update family tree
    let familyTreeId: number;

    try {
      // 创建新家谱
      console.log('正在创建新家谱');

      const result = await db.insert(familyTrees).values({
        name: familyTree.name || '未命名家谱',
        rootId: familyTree.rootId,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning({ id: familyTrees.id });

      console.log('新家谱创建成功:', result);
      familyTreeId = result[0].id;
    } catch (createError: unknown) {
      // 使用错误处理工具处理错误
      return NextResponse.json(
        handleApiError(createError),
        { status: 500 }
      );
    }

    // 保存成员
    try {
      console.log('开始保存家谱成员，数量:', familyTree.members.length);

      for (const member of familyTree.members) {
        await db.insert(members).values({
          id: member.id,
          name: member.name,
          relation: member.relation,
          parentId: member.parentId,
          birthDate: member.birthDate,
          deathDate: member.deathDate,
          gender: member.gender,
          description: member.description,
          // 使用数字类型的ID，与数据库模式匹配
          familyTreeId: familyTreeId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      console.log('所有成员保存成功');
    } catch (memberError: unknown) {
      // 使用错误处理工具处理错误
      return NextResponse.json(
        handleApiError(memberError),
        { status: 500 }
      );
    }

    console.log('家谱保存成功，ID:', familyTreeId);
    return NextResponse.json({ success: true, familyTreeId });
  } catch (error: unknown) {
    // 使用错误处理工具处理错误，不暴露敏感信息
    return NextResponse.json(
      handleApiError(error),
      { status: 500 }
    );
  }
}
