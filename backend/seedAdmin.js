require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    const adminEmail = 'admin@pashurashak.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists.');
      process.exit(0);
    }

    const admin = new User({
      name: 'System Admin',
      email: adminEmail,
      password: 'adminpassword123', // Will be hashed by pre-save hook
      role: 'admin',
      phone: '0000000000',
    });

    await admin.save();
    console.log('Admin user created successfully:');
    console.log('Email:', adminEmail);
    console.log('Password:', 'adminpassword123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
