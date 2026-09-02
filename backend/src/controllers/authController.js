const bcrypt = require('bcryptjs');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const generateToken = require('../utils/generateToken');
const formatUser = require('../utils/formatUser');
const { prisma } = require('../config/prisma');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(400, 'All fields are required');
  }
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(400, 'User already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role: 'employee' },
  });
  const token = generateToken({ id: user.id, role: user.role });
  res.status(201).json(
    new ApiResponse(201, 'Account created successfully', {
      token,
      user: formatUser(user),
    })
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new ApiError(401, 'Invalid email or password');
  }
  const token = generateToken({ id: user.id, role: user.role });
  res.status(200).json(
    new ApiResponse(200, 'Login successful', {
      token,
      role: user.role,
      user: formatUser(user),
    })
  );
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, 'Current user fetched', {
      user: formatUser(req.user),
    })
  );
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: { name: 'asc' },
  });
  res.status(200).json(
    new ApiResponse(200, 'Users fetched successfully', { users })
  );
});

module.exports = { register, login, getMe, getUsers };