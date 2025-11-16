/**
 * Profile API Routes
 * GET /api/profile - Get profile data (public)
 * POST /api/profile - Create/Update profile (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/profile - Get active profile
export async function GET() {
  try {
    const profile = await prisma.profile.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// POST /api/profile - Create or update profile (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, title, bio, email, phone, location, avatarUrl, cvUrl, skills } = body;

    if (!name || !title || !bio || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: name, title, bio, email' },
        { status: 400 }
      );
    }

    // Deactivate existing profiles
    await prisma.profile.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });

    // Create new active profile
    const profile = await prisma.profile.create({
      data: {
        name,
        title,
        bio,
        email,
        phone,
        location,
        avatarUrl,
        cvUrl,
        skills: Array.isArray(skills) ? skills : skills?.split(',').map((s: string) => s.trim()) || []
      }
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error('Profile POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create/update profile' },
      { status: 500 }
    );
  }
}