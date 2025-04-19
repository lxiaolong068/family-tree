import { NextRequest, NextResponse } from 'next/server';
import { db, isDatabaseConfigured } from '@/db';
import { familyTrees } from '@/db/schema';

export async function GET(request: NextRequest) {
  try {
    // Check database configuration
    const isConfigured = isDatabaseConfigured();
    console.log('Database configuration status:', isConfigured);
    console.log('Environment variable status:', {
      NEON_DATABASE_URL: !!process.env.NEON_DATABASE_URL,
      NEXT_PUBLIC_HAS_DATABASE: process.env.NEXT_PUBLIC_HAS_DATABASE,
      DATABASE_URL: !!process.env.DATABASE_URL,
      DATABASE_URL_LENGTH: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0
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

    // Try to execute a simple query
    try {
      const result = await db.select().from(familyTrees).limit(1);

      return NextResponse.json({
        success: true,
        message: 'Database connection successful',
        result: result,
        dbInstance: !!db
      });
    } catch (queryError: any) {
      return NextResponse.json(
        {
          error: 'Database query failed',
          message: queryError.message,
          code: queryError.code,
          stack: queryError.stack
        },
        { status: 500 }
      );
    }
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
