'use strict';
const crypto = require('crypto');

/**
 * Generate a SHA-256 fingerprint for cross-source deduplication.
 * Uses: normalized title + UTC date + normalized city + normalized venue
 */
function generateFingerprint(event) {
  const normTitle = (event.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const utcDate = event.startAt ? event.startAt.substring(0, 10) : '';
  const normCity = (event.location?.city || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const normVenue = (event.location?.venue || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const input = `${normTitle}|${utcDate}|${normCity}|${normVenue}`;
  return crypto.createHash('sha256').update(input).digest('hex');
}

/**
 * Generate a stable event ID from source and externalId.
 */
function generateEventId(source, externalId) {
  const input = `${source}:${externalId}`;
  return crypto.createHash('sha256').update(input).digest('hex').substring(0, 24);
}

module.exports = { generateFingerprint, generateEventId };
