const express = require('express');
const {
  register,
  login,
  getMe,
  getUsers,
} = require('../controllers/authController');
const { validateLogin } = require('../validations/authValidation');
const { protect, authorize } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

router.post('/register', register);
router.post('/login', authLimiter, validateLogin, login);
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('admin'), getUsers);

module.exports = router;