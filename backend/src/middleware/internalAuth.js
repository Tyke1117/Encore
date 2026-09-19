'use strict';
const env = require('../config/env');

/**
 * Middleware to protect internal sync routes.
 * Requires x-sync-secret header matching INTERNAL_SYNC_SECRET.
 */
function internalAuth(req, res, next) {
  const configuredSecret = process.env.INTERNAL_SYNC_SECRET || env.INTERNAL_SYNC_SECRET;
  const secret = req.headers['x-sync-secret'];

  if (!configuredSecret) {
    return res.status(503).json({ error: true, message: 'INTERNAL_SYNC_SECRET not configured' });
  }
  if (!secret || secret !== configuredSecret) {
    return res.status(401).json({ error: true, message: 'Unauthorized: invalid sync secret' });
  }
  next();
}

module.exports = internalAuth;
