const { Prisma } = require('@prisma/client');
const ApiError = require('../utils/ApiError');

const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

// --- BEFORE (Mongoose) ---
// if (err.name === 'CastError') { ... }              -> invalid ObjectId
// if (err.name === 'ValidationError') { ... }         -> schema validation
// if (err.code === 11000) { ... }                      -> duplicate key
//
// --- AFTER (Prisma) ---
// Prisma throws typed `PrismaClientKnownRequestError`s with an `err.code`
// (P2002, P2025, P2003, ...) instead of Mongoose-style err.name checks.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        // Unique constraint violation (e.g. duplicate email)
        statusCode = 409;
        const field = err.meta?.target?.[0] || 'field';
        message = `${field} already exists`;
        break;
      }
      case 'P2025': {
        // Record to update/delete was not found
        statusCode = 404;
        message = 'Requested record was not found';
        break;
      }
      case 'P2003': {
        // Foreign key constraint failed (e.g. createdById doesn't exist)
        statusCode = 400;
        message = 'Related record does not exist';
        break;
      }
      default:
        statusCode = 400;
        message = 'Database request error';
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid data provided to the database layer';
  }

  // JWT errors (unchanged from the Mongoose version)
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired';
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
