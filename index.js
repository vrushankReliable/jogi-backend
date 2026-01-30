const app = require('./src/app');
const connectDB = require('./src/config/db');

// Connect to database
connectDB();

// Vercel expects the app to be exported
module.exports = app;
