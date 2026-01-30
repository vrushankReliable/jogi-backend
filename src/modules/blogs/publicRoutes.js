const express = require('express');
const { getBlogs, getBlog } = require('./blogController');
const { protectApiKey } = require('../../middlewares/apiKeyMiddleware');

const router = express.Router();

// Apply API Key protection
router.use(protectApiKey('blogs_read'));

router.get('/', getBlogs);
router.get('/:idOrSlug', getBlog);

module.exports = router;
