const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  desc: { type: String, trim: true },
  raised: { type: Number, default: 0, min: 0 },
  goal: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['active', 'completed', 'pending'], default: 'active' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, default: Date.now }
});

// Fix: Prevents "Cannot overwrite model once compiled" crash during hot-reloads
module.exports = mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema);