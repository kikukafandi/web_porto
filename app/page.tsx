import React from 'react';
import { prisma } from '@/lib/prisma';
import { AnimatedHome } from '@/components/AnimatedHome';

// Force dynamic rendering to avoid database connection during build
export const dynamic = 'force-dynamic';

export default async function Home() {
  const projects = await prisma.project.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  const blogs = await prisma.blog.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      coverImage: true,
      content: true,
      tags: true,
      createdAt: true
    }
  });

  const experiences = await prisma.experience.findMany({
    where: { isActive: true },
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' }
    ]
  });

  // Convert dates to strings for serialization
  const serializedBlogs = blogs.map(blog => ({
    ...blog,
    createdAt: blog.createdAt.toISOString()
  }));

  const serializedExperiences = experiences.map(exp => ({
    ...exp,
    type: exp.type.toLowerCase() as 'work' | 'education' | 'project'
  }));

  return <AnimatedHome projects={projects} blogs={serializedBlogs} experiences={serializedExperiences} />;
}