const Banner = require('./bannerModel');

// @desc    Get active banners
// @route   GET /api/v1/banners
// @access  Public
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: banners.length, data: banners });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all banners (Admin)
// @route   GET /api/v1/banners/all
// @access  Private
exports.getAllBanners = async (req, res) => {
    try {
      const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
      res.status(200).json({ success: true, count: banners.length, data: banners });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

// @desc    Create banner
// @route   POST /api/v1/banners
// @access  Private
exports.createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, data: banner });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update banner
// @route   PUT /api/v1/banners/:id
// @access  Private
exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!banner) return res.status(404).json({ success: false, error: 'Banner not found' });
    res.status(200).json({ success: true, data: banner });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete banner
// @route   DELETE /api/v1/banners/:id
// @access  Private
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, error: 'Banner not found' });
    await banner.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
