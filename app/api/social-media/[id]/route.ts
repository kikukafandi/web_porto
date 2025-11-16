/**
 * Individual Social Media API Routes
 * GET /api/social-media/[id] - Get social media link by ID (public)
 * PATCH /api/social-media/[id] - Update social media link (admin only)
 * DELETE /api/social-media/[id] - Delete social media link (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/social-media/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const socialMedia = await prisma.socialMedia.findUnique({
      where: { id },
    });

    if (!socialMedia) {
      return NextResponse.json(
        { error: 'Social media link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error('Social Media GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social media link' },
      { status: 500 }
    );
  }
}

// PATCH /api/social-media/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { platform, username, url, icon, order, isActive } = body;

    const socialMedia = await prisma.socialMedia.update({
      where: { id },
      data: {
        ...(platform && { platform }),
        ...(username && { username }),
        ...(url && { url }),
        ...(icon !== undefined && { icon }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive })
      }
    });

    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error('Social Media PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update social media link' },
      { status: 500 }
    );
  }
}

// DELETE /api/social-media/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.socialMedia.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Social Media DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete social media link' },
      { status: 500 }
    );
  }
}