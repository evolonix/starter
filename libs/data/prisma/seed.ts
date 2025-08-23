import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    email: 'alice@prisma.io',
    name: 'Alice',
    password: { create: createPassword('password') },
    roles: { connect: [{ name: 'user' }] },
  },
  {
    email: 'bob@prisma.io',
    name: 'Bob',
    password: { create: createPassword('password') },
    roles: { connect: [{ name: 'user' }] },
  },
];

export function createPassword(password: string = faker.internet.password()) {
  return {
    hash: bcrypt.hashSync(password, 10),
  };
}

export async function main() {
  console.log('🌱  Seeding...');
  console.time(`🌱  Database has been seeded`);

  console.time(`👤  Created ${userData.length} users`);
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
  console.timeEnd(`👤  Created ${userData.length} users`);

  // Check if user exists
  console.log('👤  Checking if admin user "Jason" exists...');
  const existingUser = await prisma.user.findUnique({
    where: { email: 'jason@evolonix.com' },
  });
  if (existingUser) {
    console.log(`✅  User "Jason" already exists`);
  } else {
    console.time(`👤  Created admin user "Jason"`);
    await prisma.user.create({
      data: {
        email: 'jason@evolonix.com',
        name: 'Jason',
        password: { create: createPassword('Password01!') },
        roles: {
          connect: [{ name: 'admin' }, { name: 'user' }, { name: 'developer' }],
        },
      },
    });
    console.timeEnd(`👤  Created admin user "Jason"`);
  }

  console.timeEnd(`🌱  Database has been seeded`);
}

main();
