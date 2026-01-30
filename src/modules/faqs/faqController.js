const Faq = require('./faqModel');

// @desc    Get published FAQs
// @route   GET /api/v1/faqs
// @access  Public
exports.getFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find({ isPublished: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: faqs.length, data: faqs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all FAQs (Admin)
// @route   GET /api/v1/faqs/all
// @access  Private
exports.getAllFaqs = async (req, res) => {
    try {
      const faqs = await Faq.find().sort({ order: 1, createdAt: -1 });
      res.status(200).json({ success: true, count: faqs.length, data: faqs });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

// @desc    Create FAQ
// @route   POST /api/v1/faqs
// @access  Private
exports.createFaq = async (req, res) => {
  try {
    const faq = await Faq.create(req.body);
    res.status(201).json({ success: true, data: faq });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update FAQ
// @route   PUT /api/v1/faqs/:id
// @access  Private
exports.updateFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!faq) return res.status(404).json({ success: false, error: 'FAQ not found' });
    res.status(200).json({ success: true, data: faq });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete FAQ
// @route   DELETE /api/v1/faqs/:id
// @access  Private
exports.deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) return res.status(404).json({ success: false, error: 'FAQ not found' });
    await faq.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
