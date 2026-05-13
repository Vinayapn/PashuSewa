const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, verifyOTP, resetPassword, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.get('/me', authenticate, getMe);

module.exports = router;
