require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const connectDB = require('../src/config/db');

const createAdmin = async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'password123';

  try {
    // Check if exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log('Admin user already exists');
      process.exit();
    }

    await User.create({
      email,
      password,
      role: 'super_admin'
    });

    console.log(`Super Admin created! Email: ${email}, Password: ${password}`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
