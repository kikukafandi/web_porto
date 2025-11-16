import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/experiences/[id] - Get single experience
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const experience = await prisma.experience.findUnique({
      where: { id },
    });

    if (!experience) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(experience);
  } catch (error) {
    console.error('Experience GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experience' },
      { status: 500 }
    );
  }
}

// PATCH /api/experiences/[id] - Update experience (Admin only)
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
    const { company, position, duration, description, technologies, type, order, isActive } = body;

    const experience = await prisma.experience.update({
      where: { id },
      data: {
        ...(company && { company }),
        ...(position && { position }),
        ...(duration && { duration }),
        ...(description && { description }),
        ...(technologies && { technologies }),
        ...(type && { type }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive })
      }
    });

    return NextResponse.json(experience);
  } catch (error) {
    console.error('Experience PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update experience' },
      { status: 500 }
    );
  }
}

// DELETE /api/experiences/[id] - Delete experience (Admin only)
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
    await prisma.experience.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Experience DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete experience' },
      { status: 500 }
    );
  }
}