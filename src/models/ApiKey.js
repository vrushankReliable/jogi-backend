const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const apiKeySchema = new mongoose.Schema({
  keyId: {
    type: String,
    required: true,
    unique: true, // Public ID for lookup
    index: true
  },
  keyHash: {
    type: String,
    required: true // Hashed secret
  },
  name: {
    type: String,
    required: [true, 'Please add a name for this key']
  },
  scopes: {
    type: [String],
    enum: ['blogs_read', 'diseases_read', 'faqs_read', 'banners_read'],
    default: []
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUsedAt: {
    type: Date
  },
  revoked: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to validate key secret
apiKeySchema.methods.validateSecret = async function(enteredSecret) {
  return await bcrypt.compare(enteredSecret, this.keyHash);
};

module.exports = mongoose.model('ApiKey', apiKeySchema);
