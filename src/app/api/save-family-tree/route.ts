import { NextRequest, NextResponse } from 'next/server';
import { db, isDatabaseConfigured } from '@/db';
import { familyTrees, members } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { FamilyTree } from '@/types/family-tree';
import { verify } from 'jsonwebtoken';

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
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid authentication token', requireAuth: true },
        { status: 401 }
      );
    }

    // 解析请求体
    const body = await request.json();
    const { familyTree } = body;

    // Check database configuration
    const isConfigured = isDatabaseConfigured();
    console.log('Database configuration status:', isConfigured);
    console.log('Environment variable status:', {
      NEON_DATABASE_URL: !!process.env.NEON_DATABASE_URL,
      NEXT_PUBLIC_HAS_DATABASE: process.env.NEXT_PUBLIC_HAS_DATABASE,
      DATABASE_URL: !!process.env.DATABASE_URL
    });

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
      // Create new family tree
      console.log('Creating new family tree');

      const result = await db.insert(familyTrees).values({
        name: familyTree.name || 'Unnamed Family Tree',
        rootId: familyTree.rootId,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning({ id: familyTrees.id });

      console.log('New family tree created successfully:', result);
      familyTreeId = result[0].id;
    } catch (createError: any) {
      return NextResponse.json(
        {
          error: 'Failed to create family tree',
          message: createError.message,
          code: createError.code,
          stack: createError.stack
        },
        { status: 500 }
      );
    }

    // Save members
    try {
      console.log('Starting to save members, count:', familyTree.members.length);

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
          familyTreeId: familyTreeId.toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      console.log('All members saved successfully');
    } catch (memberError: any) {
      return NextResponse.json(
        {
          error: 'Failed to save members',
          message: memberError.message,
          code: memberError.code,
          stack: memberError.stack,
          member: memberError.member
        },
        { status: 500 }
      );
    }

    console.log('Family tree saved successfully, ID:', familyTreeId);
    return NextResponse.json({ success: true, familyTreeId });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Server error',
        message: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}
