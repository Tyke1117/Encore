'use strict';

/**
 * TEMPORARY development-only organizer authentication.
 * Accepts x-organizer-id header.
 *
 * ⚠️  BEFORE PRODUCTION: Replace with Firebase Admin SDK token verification.
 * See: https://firebase.google.com/docs/auth/admin/verify-id-tokens
 */
function organizerAuth(req, res, next) {
  const organizerId = req.headers['x-organizer-id'];
  if (!organizerId || organizerId.trim().length === 0) {
    return res.status(401).json({
      error: true,
      message: 'Missing x-organizer-id header. This is temporary dev auth – production will use Firebase Admin token verification.',
    });
  }
  req.organizerId = organizerId.trim();
  next();
}

module.exports = organizerAuth;
