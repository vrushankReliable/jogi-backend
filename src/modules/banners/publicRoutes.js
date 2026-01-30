const express = require('express');
const { getBanners } = require('./bannerController');
const { protectApiKey } = require('../../middlewares/apiKeyMiddleware');
const router = express.Router();

// Apply API Key protection
router.use(protectApiKey('banners_read'));

router.get('/', getBanners);

module.exports = router;
