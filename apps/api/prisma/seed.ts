/// <reference types="node" />
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // 1. إنشاء المستخدم (لحل مشكلة ownerId لاحقاً)
  const hashedPassword = await argon2.hash('password123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hotal.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@hotal.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // 2. إنشاء اللجنة
  const committee = await prisma.committee.create({
    data: {
      name: 'Main Committee',
      description: 'The main committee responsible for reviewing ideas.',
    },
  });

  // 3. إنشاء الفكرة بشكل منفصل وربطها بالمستخدم واللجنة
  await prisma.idea.create({
    data: {
      title: 'Sample Idea',
      description: 'This is a sample idea for testing purposes.',
      ownerId: admin.id, // الربط مع المستخدم
      committeeId: committee.id, // الربط مع اللجنة
      status: 'SUBMITTED',
      // يمكنك إضافة باقي الحقول هنا إذا أردت
    },
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });