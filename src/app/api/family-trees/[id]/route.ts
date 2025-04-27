import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { familyTrees, members } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { verify } from 'jsonwebtoken';
import { handleApiError } from '@/lib/error-handler';
import { FamilyTree } from '@/types/family-tree';

export const dynamic = 'force-dynamic';

/**
 * 获取单个家谱详情
 * 
 * 此API路由实现了权限控制，确保用户只能访问自己的家谱
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 获取家谱ID
    const familyTreeId = parseInt(params.id);
    
    if (isNaN(familyTreeId)) {
      return NextResponse.json(
        { error: 'Invalid family tree ID' },
        { status: 400 }
      );
    }

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

    // 检查数据库连接
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 500 }
      );
    }

    // 获取家谱信息，并验证所有权
    const familyTreeData = await db.select().from(familyTrees)
      .where(
        and(
          eq(familyTrees.id, familyTreeId),
          eq(familyTrees.userId, userId)
        )
      );

    // 如果没有找到家谱或家谱不属于当前用户
    if (familyTreeData.length === 0) {
      return NextResponse.json(
        { error: 'Family tree not found or you do not have permission to access it' },
        { status: 404 }
      );
    }

    // 获取家谱成员
    const membersData = await db.select().from(members)
      .where(eq(members.familyTreeId, familyTreeId));

    // 构建家谱对象
    const familyTree: FamilyTree = {
      members: membersData.map(m => ({
        id: m.id,
        name: m.name,
        relation: m.relation,
        parentId: m.parentId || undefined,
        birthDate: m.birthDate || undefined,
        deathDate: m.deathDate || undefined,
        gender: m.gender as 'male' | 'female' | 'other' | undefined,
        description: m.description || undefined,
      })),
      name: familyTreeData[0].name || undefined,
      rootId: familyTreeData[0].rootId || undefined,
      createdAt: familyTreeData[0].createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: familyTreeData[0].updatedAt?.toISOString() || new Date().toISOString(),
    };

    return NextResponse.json(familyTree);
  } catch (error: unknown) {
    // 使用错误处理工具处理错误，不暴露敏感信息
    return NextResponse.json(
      handleApiError(error),
      { status: 500 }
    );
  }
}
