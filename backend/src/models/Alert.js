const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['SOS', 'Medical', 'Resource', 'Evacuation', 'Weather', 'Fire', 'Flood', 'Other'],
    default: 'SOS',
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'High',
  },
  status: {
    type: String,
    enum: ['Pending', 'Active', 'InProgress', 'Resolved', 'Cancelled'],
    default: 'Pending',
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  address: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  victims: {
    type: Number,
    default: 0,
  },
  images: [String],
}, { timestamps: true });

alertSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Alert', alertSchema);
