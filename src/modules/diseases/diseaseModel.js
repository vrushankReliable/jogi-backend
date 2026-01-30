const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name for the disease'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  summary: {
    type: String,
    required: [true, 'Please add a summary']
  },
  symptoms: [String],
  conditions: [String],
  causes: [String],
  ayurvedic_treatment: {
    type: String
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

diseaseSchema.pre('save', async function() {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
  }
});

module.exports = mongoose.model('Disease', diseaseSchema);
