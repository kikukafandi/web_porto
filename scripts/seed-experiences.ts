import { PrismaClient, ExperienceType } from '@prisma/client';

const prisma = new PrismaClient();

async function seedExperiences() {
  console.log('🌱 Seeding experiences...');

  const experiences = [
    {
      company: 'Freelance Development',
      position: 'Full Stack Developer',
      duration: '2022 - Present',
      description: 'Developing custom web applications for various clients, specializing in modern JavaScript frameworks and backend APIs. Focus on creating scalable, maintainable solutions with clean architecture patterns.',
      technologies: ['Next.js', 'React', 'Node.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Tailwind CSS'],
      type: ExperienceType.WORK,
      order: 1
    },
    {
      company: 'Personal Projects',
      position: 'Backend Engineer',
      duration: '2021 - Present',
      description: 'Building various web applications and learning modern development practices. Created multiple full-stack projects including e-commerce platforms, portfolio websites, and API integrations.',
      technologies: ['Next.js', 'Express.js', 'React', 'PostgreSQL', 'MongoDB', 'REST APIs', 'Git'],
      type: ExperienceType.PROJECT,
      order: 2
    },
    {
      company: 'Self-Learning Journey',
      position: 'Web Development Enthusiast',
      duration: '2020 - Present',
      description: 'Continuous learning and skill development in modern web technologies. Focused on mastering full-stack development, database design, and creating user-friendly interfaces.',
      technologies: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Database Design', 'UI/UX', 'Problem Solving'],
      type: ExperienceType.EDUCATION,
      order: 3
    },
    {
      company: 'Portfolio Website',
      position: 'Lead Developer & Designer',
      duration: '2024',
      description: 'Designed and developed this modern portfolio website with advanced features including blog system, product showcase, shopping cart, and payment integration. Implemented responsive design with smooth animations.',
      technologies: ['Next.js 16', 'TypeScript', 'Framer Motion', 'Prisma', 'NextAuth', 'iPaymu API', 'Tailwind CSS'],
      type: ExperienceType.PROJECT,
      order: 4
    }
  ];

  for (const experience of experiences) {
    await prisma.experience.create({
      data: experience
    });
    console.log(`✅ Created experience: ${experience.position} at ${experience.company}`);
  }

  console.log('🎉 Experience seeding completed!');
}

seedExperiences()
  .catch((e) => {
    console.error('❌ Error seeding experiences:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });