const Blog = require('./blogModel');

// @desc    Get all blogs (Public)
// @route   GET /api/v1/blogs
// @access  Public (API Key Required)
exports.getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = { isPublished: true };
    const total = await Blog.countDocuments(query);

    const blogs = await Blog.find(query)
      .skip(startIndex)
      .limit(limit)
      .select('-content') // Don't fetch full content for list
      .sort({ publishedAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: blogs
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all blogs (Admin)
// @route   GET /api/v1/admin/blogs/all
// @access  Private
exports.getAllBlogs = async (req, res) => {
  try {
    // Admin sees everything, draft or published
    const blogs = await Blog.find()
      .select('-content')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single blog
// @route   GET /api/v1/blogs/:idOrSlug
// @access  Public (API Key Required)
exports.getBlog = async (req, res) => {
  try {
    // For public, we enforce isPublished: true via query usually
    // But this controller might be reused by admin? if so we need to be careful.
    // Let's assume this is mostly public. Admin usually fetches by ID directly for editing.
    // If admin calls this, they might expect to see drafts.
    // Let's create `getBlogAdmin` or just check req.user? 
    // For simplicity, let's keep getBlog as is (Public-ish) but maybe remove isPublished check if queried by ID?
    // Actually, createBlog/updateBlog returns the object. 
    // Let's add getBlogById for admin.
    
    // Existing getBlog enforces isPublished: true for safety in public routes logic usually.
    // Wait, the previous implementation had `query = { isPublished: true }`.
    
    let query = { isPublished: true };
    
    const idOrSlug = req.params.idOrSlug;
    
    const blog = await Blog.findOne({
      $or: [{ _id: idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? idOrSlug : null }, { slug: idOrSlug }],
      ...query
    }).populate('author', 'email name');

    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }

    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single blog by ID (Admin)
exports.getBlogAdmin = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ success: false, error: 'Blog not found' });
        res.status(200).json({ success: true, data: blog });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

// @desc    Create blog
// @route   POST /api/v1/blogs (Admin)
// @access  Private
exports.createBlog = async (req, res) => {
  try {
    req.body.author = req.user.id;
    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update blog
// @route   PUT /api/v1/blogs/:id
// @access  Private
exports.updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete blog
// @route   DELETE /api/v1/blogs/:id
// @access  Private
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }

    await blog.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
