const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  skills: [{ type: String, trim: true }],
  status: { type: String, enum: ['active', 'pending', 'inactive'], default: 'pending' },
  contributions: { type: Number, default: 0, min: 0 },
  cases: { type: Number, default: 0, min: 0 },
  joined: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
});

module.exports = mongoose.models.Volunteer || mongoose.model('Volunteer', volunteerSchema);