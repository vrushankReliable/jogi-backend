const ApiKey = require('../models/ApiKey');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// @desc    Generate a new API Key
// @route   POST /api/v1/admin/api-keys
// @access  Private (Super Admin)
exports.createApiKey = async (req, res) => {
  try {
    const { name, scopes } = req.body;

    // Generate Key parts
    const randomId = crypto.randomBytes(8).toString('hex'); // Public ID
    const secret = crypto.randomBytes(32).toString('hex'); // Secret
    const keyId = `pk_live_${randomId}`;
    const fullKey = `${keyId}.${secret}`;

    // Hash the secret
    const salt = await bcrypt.genSalt(10);
    const keyHash = await bcrypt.hash(secret, salt);

    const apiKey = await ApiKey.create({
      keyId,
      keyHash,
      name,
      scopes,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: {
        id: apiKey._id,
        name: apiKey.name,
        key: fullKey,
        scopes: apiKey.scopes,
        warning: 'Store this key safely! It will not be shown again.'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    List all API Keys
// @route   GET /api/v1/admin/api-keys
// @access  Private (Super Admin)
exports.getApiKeys = async (req, res) => {
  try {
    const keys = await ApiKey.find().populate('createdBy', 'email');
    res.status(200).json({ success: true, count: keys.length, data: keys });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Revoke API Key
// @route   DELETE /api/v1/admin/api-keys/:id
// @access  Private (Super Admin)
exports.revokeApiKey = async (req, res) => {
  try {
    const key = await ApiKey.findById(req.params.id);

    if (!key) {
      return res.status(404).json({ success: false, error: 'Key not found' });
    }

    key.revoked = true;
    await key.save();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
