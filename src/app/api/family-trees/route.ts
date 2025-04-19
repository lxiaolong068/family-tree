import { NextRequest, NextResponse } from 'next/server';
import { getUserFamilyTrees } from '@/lib/family-tree-utils';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from query parameters
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    // Get the user's family tree list
    const familyTrees = await getUserFamilyTrees(userId);

    return NextResponse.json({ familyTrees });
  } catch (error) {
    console.error('Failed to get family tree list:', error);
    return NextResponse.json(
      { error: 'Failed to get family tree list' },
      { status: 500 }
    );
  }
}
