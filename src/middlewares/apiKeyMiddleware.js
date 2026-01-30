const ApiKey = require('../models/ApiKey');
const rateLimit = require('express-rate-limit');

// In-memory store for dynamic rate limiters (for simplicity, use Redis in prod)
const limiters = new Map();

exports.protectApiKey = (requiredScope) => {
  return async (req, res, next) => {
    // Allow preflight requests (OPTIONS) to bypass checks and return OK immediately
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const keyHeader = req.headers['x-api-key'];

    // Every request now requires an API key
    if (!keyHeader) {
      return res.status(401).json({ success: false, error: 'API Key missing' });
    }

    // Expected format: keyId.secret (or just a raw string if we blindly split)
    const parts = keyHeader.split('.');
    if (parts.length !== 2) {
       return res.status(401).json({ success: false, error: 'Invalid API Key format' });
    }

    const [keyId, secret] = parts;

    try {
      const apiKey = await ApiKey.findOne({ keyId });

      if (!apiKey) {
        return res.status(401).json({ success: false, error: 'Invalid API Key' });
      }

      if (apiKey.revoked) {
        return res.status(401).json({ success: false, error: 'API Key revoked' });
      }
      
      if (apiKey.expiresAt && apiKey.expiresAt < Date.now()) {
          return res.status(401).json({ success: false, error: 'API Key expired' });
      }

      // Validate Secret
      const isMatch = await apiKey.validateSecret(secret);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid API Key' });
      }

      // Scope Check
      if (requiredScope && !apiKey.scopes.includes(requiredScope)) {
        return res.status(403).json({ success: false, error: `Key missing required scope: ${requiredScope}` });
      }

      // Update Last Used
      // Doing this async without await to not block response
      apiKey.lastUsedAt = Date.now();
      apiKey.save().catch(e => console.error('Failed to update key usage', e));

      req.apiKey = apiKey;

      // Rate Limiting per Key
      // Creates a limiter if not exists for this keyId
      if (!limiters.has(keyId)) {
        limiters.set(keyId, rateLimit({
            windowMs: 60 * 1000, // 1 minute
            max: 100, // 100 requests per minute per key
            standardHeaders: true,
            legacyHeaders: false,
            keyGenerator: () => keyId, // Use keyId as the key for rate limiting
            handler: (req, res) => {
                res.status(429).json({ success: false, error: 'API Key rate limit exceeded' });
            }
        }));
      }

      const limiter = limiters.get(keyId);
      return limiter(req, res, next);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Server Error' });
    }
  };
};
