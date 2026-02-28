
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const db = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // 1. Admin user
  const adminHash = await bcrypt.hash('Admin123!', 10);
  const admin = await db.user.upsert({
    where: { email: 'admin@techpadie.com' },
    update: {},
    create: {
      email: 'admin@techpadie.com',
      passwordHash: adminHash,
      displayName: 'Admin',
      role: 'ADMIN',
      emailVerified: true,
    },
  });
  console.log(`✅ Admin: ${admin.email} (${admin.id})`);

  // 2. Creator user
  const creatorHash = await bcrypt.hash('Creator123!', 10);
  const creator = await db.user.upsert({
    where: { email: 'creator@techpadie.com' },
    update: {},
    create: {
      email: 'creator@techpadie.com',
      passwordHash: creatorHash,
      displayName: 'Demo Creator',
      role: 'CREATOR',
      emailVerified: true,
    },
  });
  console.log(`✅ Creator: ${creator.email} (${creator.id})`);

  // Creator profile
  await db.creatorProfile.upsert({
    where: { userId: creator.id },
    update: {},
    create: {
      userId: creator.id,
      bio: 'Blockchain educator and Web3 developer',
      expertise: ['Blockchain', 'DeFi', 'Smart Contracts'],
      status: 'APPROVED',
      reviewedBy: admin.id,
      reviewedAt: new Date(),
    },
  });

  // 3. Student user
  const studentHash = await bcrypt.hash('Student123!', 10);
  const student = await db.user.upsert({
    where: { email: 'student@techpadie.com' },
    update: {},
    create: {
      email: 'student@techpadie.com',
      passwordHash: studentHash,
      displayName: 'Demo Student',
      role: 'STUDENT',
      emailVerified: true,
    },
  });
  console.log(`✅ Student: ${student.email} (${student.id})`);

  // 4. Sample course
  const course = await db.course.upsert({
    where: { slug: 'intro-to-blockchain' },
    update: {},
    create: {
      creatorId: creator.id,
      slug: 'intro-to-blockchain',
      defaultLanguage: 'EN',
      level: 'BEGINNER',
      category: 'BLOCKCHAIN_BASICS',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      estimatedHours: 2,
      translations: {
        create: {
          language: 'EN',
          title: 'Introduction to Blockchain',
          description:
            'Learn the fundamentals of blockchain technology, from distributed ledgers to consensus mechanisms. Perfect for beginners starting their Web3 journey.',
          tags: ['blockchain', 'beginner', 'web3', 'fundamentals'],
        },
      },
    },
  });
  console.log(`✅ Course: ${course.slug} (${course.id})`);

  // 5. Module
  const mod = await db.module.create({
    data: {
      courseId: course.id,
      sortOrder: 0,
      translations: {
        create: {
          language: 'EN',
          title: 'What is Blockchain?',
        },
      },
    },
  });
  console.log(`✅ Module: What is Blockchain? (${mod.id})`);

  // 6. Lesson
  const lessonContent = `Blockchain is a decentralized, distributed ledger technology that records transactions across a network of computers. Unlike traditional databases controlled by a single entity, blockchain operates on a peer-to-peer network where every participant (node) maintains a copy of the entire ledger.

Key Concepts:
- Blocks: Data is stored in blocks, each containing a set of transactions, a timestamp, and a reference to the previous block.
- Chain: Blocks are linked together cryptographically, forming an immutable chain. Changing one block would require changing all subsequent blocks.
- Decentralization: No single authority controls the network. Consensus mechanisms (like Proof of Work or Proof of Stake) ensure all nodes agree on the state of the ledger.
- Immutability: Once recorded, data cannot be altered without consensus from the network.
- Transparency: All transactions are visible to network participants.

Why Blockchain Matters:
Blockchain enables trust without intermediaries. It has applications beyond cryptocurrency, including supply chain management, digital identity, voting systems, and decentralized finance (DeFi).`;

  const { hashContent } = await import('../src/lib/crypto');
  const contentHash = hashContent(lessonContent);

  await db.lesson.create({
    data: {
      moduleId: mod.id,
      sortOrder: 0,
      duration: '15 min',
      translations: {
        create: {
          language: 'EN',
          title: 'Understanding Distributed Ledgers',
          content: lessonContent,
          contentHash,
        },
      },
    },
  });
  console.log('✅ Lesson: Understanding Distributed Ledgers');

  // 7. Reward config
  await db.rewardConfig.upsert({
    where: { courseId: course.id },
    update: {},
    create: {
      courseId: course.id,
      tokensAmount: 10,
      tokenSymbol: 'FLR',
      chainNetwork: 'flare',
      quizPassThreshold: 70,
      isActive: true,
    },
  });
  console.log('✅ Reward config: 10 FLR (70% pass threshold)');

  console.log('\n🎉 Seed complete!\n');
  console.log('Test accounts:');
  console.log('  Admin:   admin@techpadie.com   / Admin123!');
  console.log('  Creator: creator@techpadie.com / Creator123!');
  console.log('  Student: student@techpadie.com / Student123!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());