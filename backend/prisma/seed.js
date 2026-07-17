require('dotenv').config();

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD ||
      'Admin@123',
    10
  );

  const employeePassword =
    await bcrypt.hash(
      process.env.EMPLOYEE_PASSWORD ||
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

  console.log('✅ Seed completed');
  console.log(
    `Admin: ${admin.email}`
  );
  console.log(
    `Employee: ${employee.email}`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });