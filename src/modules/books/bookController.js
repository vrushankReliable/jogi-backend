const Book = require('./bookModel');

// @desc    Get all active books
// @route   GET /api/v1/public/books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find({ isActive: true }).sort('order');
    res.status(200).json({ success: true, data: books });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all books for admin
// @route   GET /api/v1/admin/books/all
exports.getAllBooksAdmin = async (req, res) => {
  try {
    const books = await Book.find().sort('order');
    res.status(200).json({ success: true, data: books });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create book
// @route   POST /api/v1/admin/books
exports.createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ success: true, data: book });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update book
// @route   PUT /api/v1/admin/books/:id
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!book) return res.status(404).json({ success: false, error: 'Book not found' });
    res.status(200).json({ success: true, data: book });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete book
// @route   DELETE /api/v1/admin/books/:id
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, error: 'Book not found' });
    await book.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
