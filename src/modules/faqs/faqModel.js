const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please add a question']
  },
  answer: {
    type: String,
    required: [true, 'Please add an answer']
  },
  category: {
    type: String,
    default: 'ALL'
  },
  isPublished: {
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

module.exports = mongoose.model('Faq', faqSchema);
