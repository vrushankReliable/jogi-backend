const express = require('express');
const { getFaqs } = require('./faqController');
const { protectApiKey } = require('../../middlewares/apiKeyMiddleware');
const router = express.Router();

// Apply API Key protection
router.use(protectApiKey('faqs_read'));

router.get('/', getFaqs);

module.exports = router;
