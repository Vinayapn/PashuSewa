const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'rescuer', 'ngo', 'doctor', 'admin'],
    default: 'user',
    required: [true, 'Role is required'],
  },
  phone: {
    type: String,
    trim: true,
  },
  // NGO specific
  organizationName: {
    type: String,
    trim: true,
  },
  // Doctor specific
  licenseNumber: {
    type: String,
    trim: true,
  },
  // Rescuer specific
  teamId: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  profileImage: {
    type: String,
    default: '',
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  },
  // Password reset
  resetOTP: {
    type: String,
    select: false,
  },
  resetOTPExpiry: {
    type: Date,
    select: false,
  },
  lastLogin: {
    type: Date,
  },
}, { timestamps: true });

// Index for geospatial queries
userSchema.index({ location: '2dsphere' });

// Hash password before save
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
