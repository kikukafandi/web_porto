import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProfile() {
  try {
    // Create or update profile
    const profile = await prisma.profile.upsert({
      where: { id: 'profile-1' },
      update: {},
      create: {
        id: 'profile-1',
        name: 'Tirta "Kikuk" Afandi',
        title: 'Backend Engineer & Full Stack Developer',
        bio: 'Passionate Backend Engineer with expertise in building reliable, clean, and scalable backend systems. I specialize in Node.js, NestJS, and pragmatic architecture following Clear Flow Programming Style. Always focused on delivering high-quality solutions that solve real-world problems.',
        email: 'kikuk.afandi@example.com',
        phone: '+62 812 3456 7890',
        location: 'Jakarta, Indonesia',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        cvUrl: 'https://drive.google.com/file/d/your-cv-file-id/view',
        skills: [
          'Node.js',
          'NestJS',
          'JavaScript',
          'TypeScript',
          'SQL',
          'Prisma',
          'PostgreSQL',
          'MongoDB',
          'Redis',
          'Docker',
          'AWS',
          'Git',
          'REST API',
          'GraphQL',
          'Microservices',
          'Clean Architecture'
        ],
        isActive: true,
      },
    });

    console.log('Profile created:', profile);

    // Create social media links
    const socialMediaData = [
      {
        id: 'social-github',
        platform: 'GitHub',
        username: 'kikuk-afandi',
        url: 'https://github.com/kikuk-afandi',
        icon: 'fab fa-github',
        order: 1,
        isActive: true,
      },
      {
        id: 'social-linkedin',
        platform: 'LinkedIn',
        username: 'kikuk-afandi',
        url: 'https://linkedin.com/in/kikuk-afandi',
        icon: 'fab fa-linkedin',
        order: 2,
        isActive: true,
      },
      {
        id: 'social-twitter',
        platform: 'Twitter',
        username: '@kikuk_afandi',
        url: 'https://twitter.com/kikuk_afandi',
        icon: 'fab fa-twitter',
        order: 3,
        isActive: true,
      },
      {
        id: 'social-instagram',
        platform: 'Instagram',
        username: 'kikuk.afandi',
        url: 'https://instagram.com/kikuk.afandi',
        icon: 'fab fa-instagram',
        order: 4,
        isActive: true,
      },
      {
        id: 'social-email',
        platform: 'Email',
        username: 'kikuk.afandi@example.com',
        url: 'mailto:kikuk.afandi@example.com',
        icon: 'fas fa-envelope',
        order: 5,
        isActive: true,
      },
      {
        id: 'social-whatsapp',
        platform: 'WhatsApp',
        username: '+62 812 3456 7890',
        url: 'https://wa.me/6281234567890',
        icon: 'fab fa-whatsapp',
        order: 6,
        isActive: true,
      },
    ];

    for (const socialData of socialMediaData) {
      const social = await prisma.socialMedia.upsert({
        where: { id: socialData.id },
        update: socialData,
        create: socialData,
      });
      console.log(`Social media created: ${social.platform}`);
    }

    console.log('✅ Profile and social media seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding profile:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedProfile();
  } catch (error) {
    console.error('Failed to seed database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { seedProfile };