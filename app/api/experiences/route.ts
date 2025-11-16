import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/experiences - Get all experiences
export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      where: { isActive: true },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Experience GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}

// POST /api/experiences - Create new experience (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { company, position, duration, description, technologies, type, order } = body;

    if (!company || !position || !duration || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const experience = await prisma.experience.create({
      data: {
        company,
        position,
        duration,
        description,
        technologies: technologies || [],
        type: type || 'WORK',
        order: order || 0
      }
    });

    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error('Experience POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    );
  }
}