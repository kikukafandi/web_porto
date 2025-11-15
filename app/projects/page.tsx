/**
 * Projects List Page
 * Shows all projects in the portfolio
 */

import { prisma } from '@/lib/prisma';
import { ProjectCard } from '@/components/ProjectCard';
import Link from 'next/link';

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Projects
          </h1>
          <p className="text-white/70 text-lg">
            A showcase of my work and side projects
          </p>
        </div>

        {projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-12 text-center">
            <p className="text-white/60 text-lg">No projects yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
