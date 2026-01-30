const express = require('express');
const { createDisease, updateDisease, deleteDisease, getAllDiseases, getDisease } = require('./diseaseController');
const router = express.Router();

router.get('/all', getAllDiseases);
router.get('/:idOrSlug', getDisease); // Reuse getDisease for admin single view
router.post('/', createDisease);
router.put('/:id', updateDisease);
router.delete('/:id', deleteDisease);

module.exports = router;
