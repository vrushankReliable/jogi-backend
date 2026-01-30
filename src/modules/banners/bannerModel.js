const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['main', 'mini', 'why_jogi'],
    default: 'main'
  },
  title: {
    type: String,
    required: [function() { return this.type !== 'main'; }, 'Please add a title'],
  },
  image: {
    type: String,
    required: [true, 'Please add an image']
  },
  description: {
    type: String, // For why_jogi
  },
  label: {
    type: String, // For why_jogi
  },
  link: {
    type: String, // For mini banners
  },
  alt: {
    type: String, // For main banners
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Banner', bannerSchema);
