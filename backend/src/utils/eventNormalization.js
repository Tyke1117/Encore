'use strict';
const { generateFingerprint, generateEventId } = require('./fingerprint');

const VALID_CATEGORIES = [
  'technology', 'sports', 'music', 'fashion', 'business',
  'education', 'culture', 'arts', 'community', 'other',
];

const VALID_STATUSES = ['pending', 'published', 'cancelled', 'completed'];
const VALID_TICKET_TYPES = ['free', 'paid', 'invite'];
const VALID_SOURCE_TYPES = ['external', 'organizer'];

/**
 * Create a canonical Encore event object with defaults.
 */
function createCanonicalEvent(overrides = {}) {
  const event = {
    id: overrides.id || '',
    title: (overrides.title || '').trim(),
    description: (overrides.description || '').trim(),
    category: VALID_CATEGORIES.includes(overrides.category) ? overrides.category : 'other',
    subcategory: overrides.subcategory || '',
    tags: Array.isArray(overrides.tags) ? overrides.tags.filter(Boolean) : [],
    startAt: overrides.startAt || null,
    endAt: overrides.endAt || null,
    timezone: overrides.timezone || 'UTC',
    location: {
      venue: overrides.location?.venue || '',
      address: overrides.location?.address || '',
      city: overrides.location?.city || '',
      state: overrides.location?.state || '',
      country: overrides.location?.country || '',
      countryCode: overrides.location?.countryCode || '',
      latitude: overrides.location?.latitude ?? null,
      longitude: overrides.location?.longitude ?? null,
    },
    sourceType: VALID_SOURCE_TYPES.includes(overrides.sourceType) ? overrides.sourceType : 'external',
    source: overrides.source || 'unknown',
    externalId: overrides.externalId || '',
    sourceUrl: overrides.sourceUrl || '',
    imageUrl: overrides.imageUrl || '',
    registrationUrl: overrides.registrationUrl || '',
    organizerId: overrides.organizerId || null,
    isVirtual: overrides.isVirtual === true,
    capacity: typeof overrides.capacity === 'number' ? overrides.capacity : null,
    ticket: {
      type: VALID_TICKET_TYPES.includes(overrides.ticket?.type) ? overrides.ticket.type : 'free',
      price: typeof overrides.ticket?.price === 'number' ? overrides.ticket.price : 0,
      currency: overrides.ticket?.currency || 'INR',
      quantity: typeof overrides.ticket?.quantity === 'number' ? overrides.ticket.quantity : null,
    },
    status: VALID_STATUSES.includes(overrides.status) ? overrides.status : 'published',
    fingerprint: '',
    fetchedAt: overrides.fetchedAt || new Date().toISOString(),
  };

  // Generate ID if not provided
  if (!event.id && event.source && event.externalId) {
    event.id = generateEventId(event.source, event.externalId);
  }

  // Generate fingerprint
  event.fingerprint = generateFingerprint(event);

  return event;
}

/**
 * Validate a canonical event. Returns { valid: boolean, errors: string[] }.
 */
function validateEvent(event) {
  const errors = [];

  if (!event.title || event.title.trim().length === 0) {
    errors.push('Title is missing');
  }

  if (!event.startAt) {
    errors.push('Start date is missing');
  } else {
    const startDate = new Date(event.startAt);
    if (isNaN(startDate.getTime())) {
      errors.push('Start date is invalid');
    } else {
      // Check if event is far in the past (more than 30 days ago)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (startDate < thirtyDaysAgo) {
        errors.push('Event is too far in the past');
      }
    }
  }

  if (event.endAt && event.startAt) {
    const start = new Date(event.startAt);
    const end = new Date(event.endAt);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end < start) {
      errors.push('End time is before start time');
    }
  }

  if (event.sourceType === 'external' && !event.externalId) {
    errors.push('External provider ID is missing');
  }

  if (!event.source) {
    errors.push('Source information is missing');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Map a category string to a valid Encore category.
 */
function mapCategory(rawCategory) {
  if (!rawCategory) return 'other';
  const lower = rawCategory.toLowerCase();
  const mappings = {
    'music': 'music', 'concert': 'music', 'concerts': 'music', 'live music': 'music',
    'festival': 'music', 'festivals': 'music',
    'sports': 'sports', 'sport': 'sports', 'athletic': 'sports', 'football': 'sports',
    'cricket': 'sports', 'basketball': 'sports', 'tennis': 'sports', 'motorsport': 'sports',
    'soccer': 'sports', 'baseball': 'sports', 'hockey': 'sports', 'rugby': 'sports',
    'tech': 'technology', 'technology': 'technology', 'hackathon': 'technology',
    'fashion': 'fashion', 'style': 'fashion',
    'business': 'business', 'conference': 'business', 'summit': 'business', 'networking': 'business',
    'seminar': 'business', 'webinar': 'business',
    'education': 'education', 'workshop': 'education', 'lecture': 'education', 'class': 'education',
    'training': 'education', 'university': 'education', 'college': 'education',
    'culture': 'culture', 'cultural': 'culture', 'heritage': 'culture',
    'arts': 'arts', 'art': 'arts', 'theatre': 'arts', 'theater': 'arts', 'exhibition': 'arts',
    'gallery': 'arts', 'dance': 'arts', 'film': 'arts',
    'community': 'community', 'meetup': 'community', 'social': 'community',
    'charity': 'community', 'volunteer': 'community', 'fundraiser': 'community',
    'gala': 'community',
  };

  for (const [key, value] of Object.entries(mappings)) {
    if (lower.includes(key)) return value;
  }
  return 'other';
}

module.exports = { createCanonicalEvent, validateEvent, mapCategory, VALID_CATEGORIES };
