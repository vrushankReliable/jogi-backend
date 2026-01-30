const express = require('express');
const { createBanner, getAllBanners, updateBanner, deleteBanner } = require('./bannerController');
const router = express.Router();

router.get('/all', getAllBanners);
router.post('/', createBanner);
router.put('/:id', updateBanner);
router.delete('/:id', deleteBanner);

module.exports = router;
