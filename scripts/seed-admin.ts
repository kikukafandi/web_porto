/**
 * Seed Admin User Script
 * Creates the admin user from environment variables
 * Run: npx tsx scripts/seed-admin.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@kikuk.dev';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = "Tirta \"Kikuk\" Afandi";

  console.log('Seeding admin user...');

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('Admin user already exists. Updating password...');
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        password: hashedPassword,
        name: adminName,
        role: 'ADMIN',
      },
    });
    
    console.log('Admin user updated successfully!');
  } else {
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: 'ADMIN',
      },
    });
    
    console.log('Admin user created successfully!');
  }

  console.log(`Email: ${adminEmail}`);
  console.log('Password: [hidden for security]');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('Error seeding admin:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
