const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: Number,
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  condition: {
    type: String,
    required: true,
  },
  triageLevel: {
    type: String,
    enum: ['Red', 'Yellow', 'Green', 'Black'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Waiting', 'InTreatment', 'Stable', 'Transferred', 'Discharged'],
    default: 'Waiting',
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
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  notes: String,
  vitals: {
    heartRate: Number,
    bloodPressure: String,
    temperature: Number,
    oxygenSaturation: Number,
  },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
