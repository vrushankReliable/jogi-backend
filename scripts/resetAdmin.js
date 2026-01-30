require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const connectDB = require('../src/config/db');

const resetAdmin = async () => {
  await connectDB();

  const email = 'admin@admin.com';
  const password = '123456';

  try {
    // Check if exists
    let user = await User.findOne({ email });

    if (user) {
        console.log(`User ${email} found. Updating password...`);
        user.password = password; // Will be hashed by pre-save hook
        await user.save();
        console.log('Password updated successfully.');
    } else {
        console.log(`User ${email} not found. Creating...`);
        await User.create({
            email,
            password,
            role: 'super_admin'
        });
        console.log('User created successfully.');
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

resetAdmin();
