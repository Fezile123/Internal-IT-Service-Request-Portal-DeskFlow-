require('dotenv').config();
const app = require('./src/app');
const { connectDB, prisma } = require('./src/config/prisma');

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`DeskFlow API running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });

  // Graceful shutdown — closes the Prisma connection pool cleanly instead
  // of leaving open Postgres connections when the process exits.
  const shutdown = async () => {
    console.log('Shutting down gracefully...');
    await prisma.$disconnect();
    server.close(() => process.exit(0));
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

start();

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});
