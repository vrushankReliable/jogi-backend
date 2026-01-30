const express = require('express');
const { 
    getAllBooksAdmin, 
    createBook, 
    updateBook, 
    deleteBook 
} = require('./bookController');
const router = express.Router();

router.get('/all', getAllBooksAdmin);
router.post('/', createBook);
router.route('/:id')
    .put(updateBook)
    .delete(deleteBook);

module.exports = router;
