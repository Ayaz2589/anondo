import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create some categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Technology' },
      update: {},
      create: {
        name: 'Technology',
        description: 'Tech meetups, conferences, and workshops',
        color: '#3B82F6',
        icon: 'laptop'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Sports' },
      update: {},
      create: {
        name: 'Sports',
        description: 'Sports events and activities',
        color: '#10B981',
        icon: 'sports'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Social' },
      update: {},
      create: {
        name: 'Social',
        description: 'Social gatherings and networking',
        color: '#F59E0B',
        icon: 'users'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Education' },
      update: {},
      create: {
        name: 'Education',
        description: 'Learning and educational events',
        color: '#8B5CF6',
        icon: 'book'
      }
    })
  ]);

  console.log('Created categories:', categories.map(c => c.name));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
