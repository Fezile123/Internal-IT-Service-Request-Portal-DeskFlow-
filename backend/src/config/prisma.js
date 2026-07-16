const { PrismaClient } = require('@prisma/client');

// Singleton PrismaClient — reused across the whole app instead of
// instantiating a new client per request (which would exhaust DB
// connections). Replaces the old mongoose.connect() call in db.js.
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('PostgreSQL connected via Prisma');
  } catch (err) {
    console.error(`Database connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = { prisma, connectDB };
