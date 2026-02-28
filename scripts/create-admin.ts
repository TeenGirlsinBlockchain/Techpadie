// FILE: scripts/create-admin.ts — Create Admin User from CLI
// Usage: npx tsx scripts/create-admin.ts <email> <displayName> <password>
// Example: npx tsx scripts/create-admin.ts admin@techpadie.com "Super Admin" MySecure123!

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const db = new PrismaClient();

async function main() {
  const [, , email, displayName, password] = process.argv;

  if (!email || !displayName || !password) {
    console.error('Usage: npx tsx scripts/create-admin.ts <email> <displayName> <password>');
    console.error('Example: npx tsx scripts/create-admin.ts admin@techpadie.com "Super Admin" MySecure123!');
    process.exit(1);
  }

  // Validate password
  if (password.length < 8) {
    console.error('❌ Password must be at least 8 characters');
    process.exit(1);
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    console.error('❌ Password must contain at least one lowercase, one uppercase, and one digit');
    process.exit(1);
  }

  // Check if user exists
  const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });

  if (existing) {
    if (existing.role === 'ADMIN') {
      console.log(`⚠️  User ${email} is already an admin.`);
      process.exit(0);
    }

    // Upgrade existing user to admin
    await db.user.update({
      where: { id: existing.id },
      data: { role: 'ADMIN' },
    });
    console.log(`✅ Upgraded existing user ${email} to ADMIN role.`);
    process.exit(0);
  }

  // Create new admin
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await db.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      displayName,
      role: 'ADMIN',
      emailVerified: true,
    },
  });

  console.log(`✅ Admin user created successfully!`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Name:  ${admin.displayName}`);
  console.log(`   ID:    ${admin.id}`);
}

main()
  .catch((err) => {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  })
  .finally(() => db.$disconnect());