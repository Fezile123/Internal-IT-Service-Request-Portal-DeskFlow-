const ApiError = require('../utils/ApiError');

const ALLOWED_PRIORITIES = [
  'Low',
  'Medium',
  'High',
];

const ALLOWED_STATUSES = [
  'Open',
  'In Progress',
  'Resolved',
];

const ALLOWED_CATEGORIES = [
  'Hardware',
  'Software',
  'Network',
  'Account Access',
  'Other',
];

/**
 * CREATE TICKET
 */
const validateCreateTicket = (
  req,
  res,
  next
) => {
  const {
    title,
    description,
    priority,
    category,
  } = req.body;

  if (
    !title ||
    title.trim().length < 3
  ) {
    throw new ApiError(
      400,
      'Title must be at least 3 characters long'
    );
  }

  if (
    !description ||
    description.trim().length < 10
  ) {
    throw new ApiError(
      400,
      'Description must be at least 10 characters long'
    );
  }

  if (
    priority &&
    !ALLOWED_PRIORITIES.includes(priority)
  ) {
    throw new ApiError(
      400,
      `Priority must be one of: ${ALLOWED_PRIORITIES.join(', ')}`
    );
  }

  if (
    category &&
    !ALLOWED_CATEGORIES.includes(category)
  ) {
    throw new ApiError(
      400,
      `Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`
    );
  }

  next();
};

/**
 * UPDATE TICKET
 */
const validateUpdateTicket = (
  req,
  res,
  next
) => {
  const {
    status,
    priority,
    assignedTo,
    adminNotes,
  } = req.body;

  if (
    status &&
    !ALLOWED_STATUSES.includes(status)
  ) {
    throw new ApiError(
      400,
      `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`
    );
  }

  if (
    priority &&
    !ALLOWED_PRIORITIES.includes(priority)
  ) {
    throw new ApiError(
      400,
      `Priority must be one of: ${ALLOWED_PRIORITIES.join(', ')}`
    );
  }

  if (
    assignedTo &&
    assignedTo.length > 100
  ) {
    throw new ApiError(
      400,
      'Assigned To must be less than 100 characters'
    );
  }

  if (
    adminNotes &&
    adminNotes.length > 1000
  ) {
    throw new ApiError(
      400,
      'Admin Notes must be less than 1000 characters'
    );
  }

  next();
};

module.exports = {
  validateCreateTicket,
  validateUpdateTicket,
};