const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const fs = require('fs');

// Request Logging Middleware for debugging
app.use((req, res, next) => {
    res.on('finish', () => {
        const log = `${new Date().toISOString()} - ${req.method} ${req.url} ${res.statusCode}\n`;
        fs.appendFileSync(path.join(__dirname, '../request_logs.txt'), log);
    });
    next();
});

// Security Middleware - Relax for local development cross-origin assets
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false
}));
// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://jogi-admin-sigma.vercel.app',
    'https://jogi-frontend-five.vercel.app',
    ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [])
  ], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

// Global Rate Limiting - Basic DOS protection
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 10000, // Increased for dev
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(globalLimiter);

// Body Parsing
app.use(express.json({ limit: '10kb' })); // Body limit
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Test Route
app.get('/', (req, res) => {
  res.send('Jogi Backend API is running...');
});

// Static files for uploads - Use absolute path
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Key Protection Middleware
const { protectApiKey } = require('./middlewares/apiKeyMiddleware');

// Routes
app.use('/api/v1', protectApiKey()); // Enforce on all API versions

app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));
app.use('/api/v1/public', require('./routes/publicRoutes'));

// Global Error Handler
// app.use(errorHandler);

module.exports = app;
