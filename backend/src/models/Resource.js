const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['Food', 'Water', 'Medicine', 'Clothing', 'Shelter', 'Equipment', 'Transport', 'Other'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  unit: {
    type: String,
    default: 'units',
  },
  status: {
    type: String,
    enum: ['Available', 'Low', 'Critical', 'Depleted'],
    default: 'Available',
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
  address: String,
  managedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  notes: String,
}, { timestamps: true });

resourceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Resource', resourceSchema);
