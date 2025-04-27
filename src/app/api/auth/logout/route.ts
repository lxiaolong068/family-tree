import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // 服务器端注销逻辑（如果需要）
  // 例如，将令牌添加到黑名单等

  return NextResponse.json({ success: true });
}
