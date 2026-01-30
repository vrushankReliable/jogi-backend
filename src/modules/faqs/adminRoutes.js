const express = require('express');
const { createFaq, getAllFaqs, updateFaq, deleteFaq } = require('./faqController');
const router = express.Router();

router.get('/all', getAllFaqs);
router.post('/', createFaq);
router.put('/:id', updateFaq);
router.delete('/:id', deleteFaq);

module.exports = router;
