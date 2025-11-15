/**
 * Transactions API Routes
 * GET /api/transactions - List all transactions (admin only)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/transactions - List all transactions (admin only)
export async function GET() {
  try {
    const session = await auth();

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const transactions = await prisma.transaction.findMany({
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
