import { NextResponse } from 'next/server';
import { db } from '@/db';

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // 执行迁移SQL
    const result = await db.execute(`
      ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "relationships" JSONB DEFAULT '[]';
    `);

    return NextResponse.json({ 
      success: true, 
      message: 'Migration completed successfully',
      result
    });
  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
