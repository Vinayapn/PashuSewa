const mongoose = require('mongoose');

const ngoVolunteerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  skills: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'pending', 'inactive'],
    default: 'active'
  },
  contributions: {
    type: String,
    default: '0 hrs'
  },
  cases: {
    type: String,
    default: '0 cases'
  },
  joined: {
    type: Date,
    default: Date.now
  },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('NGOVolunteer', ngoVolunteerSchema);
