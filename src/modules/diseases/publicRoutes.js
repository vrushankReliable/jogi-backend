const express = require('express');
const { getDiseases, getDisease } = require('./diseaseController');
const { protectApiKey } = require('../../middlewares/apiKeyMiddleware');
const router = express.Router();

router.use(protectApiKey('diseases_read'));
router.get('/', getDiseases);
router.get('/:idOrSlug', getDisease);

module.exports = router;
