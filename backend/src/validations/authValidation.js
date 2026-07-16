const ApiError = require('../utils/ApiError');

const validateLogin = (
  req,
  res,
  next
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(
      400,
      'Email and password are required'
    );
  }

  next();
};

const validateRegister = (
  req,
  res,
  next
) => {
  const {
    name,
    email,
    password,
  } = req.body;

  if (
    !name ||
    !email ||
    !password
  ) {
    throw new ApiError(
      400,
      'Name, email and password are required'
    );
  }

  if (password.length < 6) {
    throw new ApiError(
      400,
      'Password must be at least 6 characters'
    );
  }

  next();
};

module.exports = {
  validateLogin,
  validateRegister,
};