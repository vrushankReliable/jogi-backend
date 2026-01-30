const express = require('express');
const router = express.Router();

// Mount Module Public Routes
router.use('/blogs', require('../modules/blogs/publicRoutes'));
router.use('/diseases', require('../modules/diseases/publicRoutes'));
router.use('/banners', require('../modules/banners/publicRoutes'));
router.use('/faqs', require('../modules/faqs/publicRoutes'));
router.use('/books', require('../modules/books/publicRoutes'));

module.exports = router;
