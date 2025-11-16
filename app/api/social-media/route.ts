/**
 * Social Media API Routes
 * GET /api/social-media - Get all active social media links (public)
 * POST /api/social-media - Create new social media link (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/social-media - Get all active social media links
export async function GET() {
  try {
    const socialMedias = await prisma.socialMedia.findMany({
      where: { isActive: true },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(socialMedias);
  } catch (error) {
    console.error('Social Media GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social media links' },
      { status: 500 }
    );
  }
}

// POST /api/social-media - Create new social media link (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { platform, username, url, icon, order } = body;

    if (!platform || !username || !url) {
      return NextResponse.json(
        { error: 'Missing required fields: platform, username, url' },
        { status: 400 }
      );
    }

    const socialMedia = await prisma.socialMedia.create({
      data: {
        platform,
        username,
        url,
        icon,
        order: order || 0
      }
    });

    return NextResponse.json(socialMedia, { status: 201 });
  } catch (error) {
    console.error('Social Media POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create social media link' },
      { status: 500 }
    );
  }
}