const express = require('express');
const { createBlog, updateBlog, deleteBlog, getAllBlogs, getBlogAdmin } = require('./blogController');
const router = express.Router();

router.get('/all', getAllBlogs);
router.get('/:id', getBlogAdmin);
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;
