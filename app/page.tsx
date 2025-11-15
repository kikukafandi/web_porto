/**
 * Landing Page / Portfolio
 * Hero, About, Skills, Experience, and Featured Projects
 */

import { prisma } from '@/lib/prisma';
import { ProjectCard } from '@/components/ProjectCard';
import Link from 'next/link';

export default async function Home() {
  // Fetch featured projects (latest 3)
  const projects = await prisma.project.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Tirta "Kikuk" Afandi
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 mb-4">
            Backend Engineer
          </p>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8">
            Building scalable and robust backend systems with clean, maintainable code.
            Passionate about Clear Flow Programming and honest naming conventions.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#projects" className="px-6 py-3 bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-700/90 hover:to-pink-700/90 text-white rounded-lg backdrop-blur-md border border-white/20 transition-all duration-300">
              View Projects
            </a>
            <a href="#about" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-md border border-white/20 transition-all duration-300">
              About Me
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
            About Me
          </h2>
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8">
            <p className="text-white/80 text-lg leading-relaxed mb-4">
              I'm a backend engineer with a passion for building clean, scalable, and maintainable systems.
              I believe in the Clear Flow Programming Style - keeping code simple, honest, and flat.
            </p>
            <p className="text-white/80 text-lg leading-relaxed">
              My expertise lies in API development, database design, payment gateway integration,
              and creating robust server-side applications that just work.
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
            Skills & Technologies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['TypeScript', 'Node.js', 'Next.js', 'Prisma ORM', 'PostgreSQL', 'REST APIs', 'Payment Gateways', 'NextAuth'].map((skill) => (
              <div key={skill} className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300">
                <p className="text-white font-medium">{skill}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
            Experience
          </h2>
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Backend Engineer</h3>
              <p className="text-purple-400 mb-4">Independent Developer</p>
              <p className="text-white/70">
                Specialized in building full-stack applications with focus on backend architecture,
                API design, database optimization, and third-party integrations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Featured Projects
            </h2>
            <Link href="/projects" className="text-purple-400 hover:text-purple-300 transition-colors">
              View All →
            </Link>
          </div>
          
          {projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project: any) => (
                <ProjectCard key={project.id} {...project} />
              ))}
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-12 text-center">
              <p className="text-white/60">No projects yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/60">
            © {new Date().getFullYear()} Tirta "Kikuk" Afandi. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

