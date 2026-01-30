const express = require('express');
const { createApiKey, getApiKeys, revokeApiKey } = require('../controllers/adminController');
const { uploadImage } = require('../controllers/uploadController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../utils/fileUpload');

const router = express.Router();

// Protect all admin routes
router.use(protect);

// == Super Admin Only ==
// API Keys
router.route('/api-keys').all(authorize('super_admin'))
  .post(createApiKey)
  .get(getApiKeys);

router.route('/api-keys/:id').all(authorize('super_admin'))
  .delete(revokeApiKey);

// == Content Admin & Super Admin ==

// Global Image Upload
router.post('/upload', upload.single('image'), uploadImage);

// Module Routes
router.use('/blogs', require('../modules/blogs/adminRoutes'));
router.use('/diseases', require('../modules/diseases/adminRoutes'));
router.use('/banners', require('../modules/banners/adminRoutes'));
router.use('/faqs', require('../modules/faqs/adminRoutes'));
router.use('/books', require('../modules/books/adminRoutes'));

module.exports = router;
