const User = require('../models/User');
const { generateToken } = require('../utils/jwtHelper');
const { sendOTPEmail } = require('../utils/emailService');

// ─── REGISTER ──────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, organizationName, licenseNumber } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Name, email, password, and role are required.' });
    }
    if (!['rescuer', 'ngo', 'doctor'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role. Must be rescuer, ngo, or doctor.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }
    if (role === 'ngo' && !organizationName) {
      return res.status(400).json({ success: false, message: 'Organization name is required for NGO accounts.' });
    }
    if (role === 'doctor' && !licenseNumber) {
      return res.status(400).json({ success: false, message: 'License number is required for Doctor accounts.' });
    }

    // Check existing
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Create user
    const userData = { name, email: email.toLowerCase(), password, role, phone };
    if (role === 'ngo') userData.organizationName = organizationName;
    if (role === 'doctor') userData.licenseNumber = licenseNumber;

    const user = await User.create(userData);
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to ReliefLink.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        organizationName: user.organizationName,
        licenseNumber: user.licenseNumber,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

// ─── LOGIN ─────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Find user with password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Contact support.' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user);

    res.json({
      success: true,
      message: `Welcome back, ${user.name}! Redirecting to your ${user.role} dashboard...`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        organizationName: user.organizationName,
        licenseNumber: user.licenseNumber,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// ─── FORGOT PASSWORD ────────────────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Security: don't reveal if email exists
      return res.json({ success: true, message: 'If this email exists, an OTP has been sent.' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetOTP = otp;
    user.resetOTPExpiry = otpExpiry;
    await user.save({ validateBeforeSave: false });

    // Send email
    await sendOTPEmail(user.email, user.name, otp);

    res.json({ success: true, message: 'OTP sent to your email. Valid for 10 minutes.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP. Please try again.' });
  }
};

// ─── VERIFY OTP ─────────────────────────────────────────────────────────────
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+resetOTP +resetOTPExpiry');
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid request.' });
    }

    if (!user.resetOTP || user.resetOTP !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    if (user.resetOTPExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    res.json({ success: true, message: 'OTP verified successfully.' });
  } catch (error) {
    console.error('OTP verify error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── RESET PASSWORD ─────────────────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+resetOTP +resetOTPExpiry +password');
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid request.' });
    }

    if (!user.resetOTP || user.resetOTP !== otp || user.resetOTPExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    user.password = newPassword;
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully! Please login with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error during password reset.' });
  }
};

// ─── GET ME ──────────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { register, login, forgotPassword, verifyOTP, resetPassword, getMe };
