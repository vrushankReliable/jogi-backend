const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  summary: {
    type: String,
    required: [true, 'Please add a summary'],
    maxlength: [500, 'Summary cannot be more than 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add content']
  },
  image: {
    type: String, // URL/Path to image
    default: 'no-photo.jpg'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [String],
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create slug from title
blogSchema.pre('save', async function() {
  if (this.isModified('title')) {
     this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
});

module.exports = mongoose.model('Blog', blogSchema);
