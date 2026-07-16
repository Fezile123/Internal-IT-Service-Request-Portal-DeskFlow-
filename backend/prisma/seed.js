require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash(
    'Admin@123',
    10
  );

  const employeePassword = await bcrypt.hash(
    'Employee@123',
    10
  );

  const admin =
    await prisma.user.upsert({
      where: {
        email: 'admin@deskflow.com',
      },

      update: {},

      create: {
        name: 'Administrator',
        email: 'admin@deskflow.com',
        password: adminPassword,
        role: 'admin',
      },
    });

  const employee =
    await prisma.user.upsert({
      where: {
        email: 'employee@deskflow.com',
      },

      update: {},

      create: {
        name: 'Demo Employee',
        email: 'employee@deskflow.com',
        password: employeePassword,
        role: 'employee',
      },
    });

  console.log('Users ready');
  console.log(
    'Admin:',
    admin.email
  );
  console.log(
    'Employee:',
    employee.email
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });