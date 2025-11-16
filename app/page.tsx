import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma'; // <-- (1) KITA IMPORT PRISMA KEMBALI

export default async function Home() {
  
  // (2) KITA AMBIL DATA PROYEK DARI DATABASE
  const projects = await prisma.project.findMany({
    take: 3, // Mengambil 3 proyek terbaru, sama seperti file asli Anda
    orderBy: { createdAt: 'desc' },
  });
 

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 grid gap-10">
      {/* HERO */}
      <section className="glass rounded-3xl soft-shadow p-8 grid md:grid-cols-2 gap-6 items-center">
        {/* left: identity */}
        <div>
          {/* headline */}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Tirta “Kikuk” Afandi
          </h1>
          <p className="mt-3 text-gray-300 max-w-xl leading-relaxed">
            Backend Engineer — building reliable, clean, and scalable backend systems with Node.js, NestJS, and pragmatic architecture. Clear Flow Programming Style.
          </p>

          {/* quick badges */}
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="glass rounded-full px-3 py-1 text-xs">Node.js</span>
            <span className="glass rounded-full px-3 py-1 text-xs">NestJS</span>
            <span className="glass rounded-full px-3 py-1 text-xs">JavaScript</span>
            <span className="glass rounded-full px-3 py-1 text-xs">SQL / Prisma</span>
          </div>

          {/* ctas */}
          <div className="mt-6 flex gap-3">
            <a className="glass rounded-xl px-4 py-2 font-medium" href="#projects">
              See Projects
            </a>
            <a className="glass rounded-xl px-4 py-2 font-medium" href="mailto:admin@example.com">
              Hire Me
            </a>
          </div>
        </div>

        {/* right: profile card */}
        <div className="flex justify-center md:justify-end">
          <div className="glass rounded-3xl p-4 w-64 md:w-72 soft-shadow flex flex-col items-center">
            {/* avatar */}
            <div className="w-28 h-28 rounded-xl overflow-hidden img-placeholder flex items-center justify-center">
              {/* Ganti dengan <Image> dari Next.js jika Anda mau */}
              <span className="text-sm opacity-70">Avatar</span>
            </div>

            {/* meta */}
            <div className="mt-4 text-center">
              <div className="font-semibold">Tirta Afandi</div>
              <div className="text-xs opacity-60">Backend Engineer • Kikuk</div>
              <div className="mt-3 text-xs opacity-60">
                wartamerdekan.info — IT Programmer
              </div>
            </div>

            {/* stats */}
            <div className="mt-4 w-full grid grid-cols-3 gap-2 text-center text-xs">
              <div className="glass rounded-lg px-2 py-2">
                <div className="font-semibold">8+</div>
                <div className="opacity-60">Projects</div>
              </div>
              <div className="glass rounded-lg px-2 py-2">
                <div className="font-semibold">5+</div>
                <div className="opacity-60">Competitions</div>
              </div>
              <div className="glass rounded-lg px-2 py-2">
                <div className="font-semibold">1</div>
                <div className="opacity-60">GSA</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TWO COLUMN: ABOUT + SKILLS */}
      <section className="grid md:grid-cols-3 gap-6">
        {/* ABOUT */}
        <div className="glass rounded-2xl p-6 md:col-span-2 soft-shadow">
          <h2 className="text-xl font-semibold">About</h2>
          <p className="mt-3 text-gray-300 leading-relaxed">
            Saya mahasiswa teknik komputer & backend engineer. Fokus pada backend berskala industri: clean architecture, maintainable code, dan tim yang produktif. Clear Flow Programming Style: simple, clean, flat flow, naming jujur.
          </p>

          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <li className="flex gap-2 items-start">
              <span className="opacity-60">•</span> NestJS, Node.js
            </li>
            <li className="flex gap-2 items-start">
              <span className="opacity-60">•</span> JavaScript & TypeScript
            </li>
            <li className="flex gap-2 items-start">
              <span className="opacity-60">•</span> Prisma, PostgreSQL
            </li>
            <li className="flex gap-2 items-start">
              <span className="opacity-60">•</span> Testing & CI/CD
            </li>
          </ul>
        </div>

        {/* SKILLS */}
        <aside className="glass rounded-2xl p-6 soft-shadow">
          <h3 className="text-lg font-semibold">Skills</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="glass rounded-lg p-3 text-center">Backend</div>
            <div className="glass rounded-lg p-3 text-center">APIs</div>
            <div className="glass rounded-lg p-3 text-center">Database</div>
            <div className="glass rounded-lg p-3 text-center">Testing</div>
            <div className="glass rounded-lg p-3 text-center">Architecture</div>
            <div className="glass rounded-lg p-3 text-center">Git</div>
          </div>
        </aside>
      </section>

      {/* (3) PROJECTS DINAMIS DARI PRISMA */}
      <section id="projects" className="glass rounded-3xl p-6 soft-shadow">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Highlighted Projects</h2>
          <Link className="text-sm opacity-70" href="/projects">
            See all →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          
          {/* KITA GANTI 3 PROYEK STATIS DENGAN MAPPING DARI DATABASE */}
          {projects.map((project) => (
            <article key={project.id} className="glass rounded-2xl p-4 soft-shadow hover:scale-[1.01] transition">
              <div className="h-36 rounded-lg overflow-hidden img-placeholder flex items-center justify-center">
                {/* Anda bisa ganti ini dengan <img src={project.thumbnailUrl} /> */}
                <span className="text-xs opacity-60">Screenshot</span>
              </div>
              <h3 className="mt-3 font-semibold">{project.title}</h3>
              <p className="mt-2 text-sm opacity-70 line-clamp-3">{project.description}</p>
              <div className="mt-3 flex items-center justify-between text-xs opacity-70">
                <span className="truncate pr-2">{project.techStack.join(' • ')}</span>
                <div className="flex gap-3 flex-shrink-0">
                  {project.demoUrl && (
                    <a className="underline" href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      Demo
                    </a>
                  )}
                  {project.repoUrl && (
                    <a className="underline" href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                      Repo
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
          
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 md:col-span-2 soft-shadow">
          <h2 className="text-xl font-semibold">Experience</h2>
          <div className="mt-4 space-y-4 text-sm opacity-90">
            <div>
              <div className="font-semibold">IT Programmer — wartamerdekan.info</div>
              <div className="text-xs opacity-70">
                Maintenance, plugin & content tooling
              </div>
            </div>
            <div>
              <div className="font-semibold">Google Student Ambassador</div>
              <div className="text-xs opacity-70">Community, events</div>
            </div>
            <div>
              <div className="font-semibold">Divisi Hacker — UKM</div>
              <div className="text-xs opacity-70">Lead backend & mentoring</div>
            </div>
          </div>
        </div>

        {/* quick contact card */}
        <aside id="contact" className="glass rounded-2xl p-6 soft-shadow">
          <h3 className="text-lg font-semibold">Contact</h3>
          <p className="mt-2 text-sm opacity-70">
            Available for freelance & full-time roles.
          </p>
          <div className="mt-4 text-sm">
            <div className="mt-2">
              <strong>Email:</strong>{" "}
              <span className="opacity-70">your.email@example.com</span>
            </div>
            <div className="mt-1">
              <strong>GitHub:</strong>{" "}
              <span className="opacity-70">github.com/yourhandle</span>
            </div>
            <div className="mt-1">
              <strong>LinkedIn:</strong>{" "}
              <span className="opacity-70">linkedin.com/in/yourhandle</span>
            </div>
          </div>

          <div className="mt-6">
            <a
              className="glass rounded-lg px-4 py-2 block text-center"
              href="mailto:your.email@example.com"
            >
              Email Me
            </a>
          </div>
        </aside>
      </section>
    </main>
  );
}