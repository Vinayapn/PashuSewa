const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // Dog, Cat, etc.
  breed: { type: String },
  age: { type: String },
  location: { type: String },
  status: { 
    type: String, 
    enum: ['Available', 'Pending', 'Adopted'], 
    default: 'Available' 
  },
  imageUrl: { type: String },
  description: { type: String },
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Animal', animalSchema);
