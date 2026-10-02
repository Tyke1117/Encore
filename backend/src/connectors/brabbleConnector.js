'use strict';
const env = require('../config/env');
const logger = require('../config/logger');
const { httpGet } = require('../utils/httpClient');
const { createCanonicalEvent, mapCategory } = require('../utils/eventNormalization');

/**
 * Fetch hackathons, competitions, and developer events from Brabble.ai
 */
async function fetchBrabbleEvents() {
  if (!env.BRABBLE_API_KEY) {
    logger.warn('Brabble API key not found. Connector disabled.');
    return {
      events: [],
      disabled: true,
      reason: 'BRABBLE_API_KEY not configured in .env. Get your key at https://brabble.ai',
    };
  }

  const events = [];
  const raw = [];
  const endpoint = env.BRABBLE_API_URL || 'https://brabble.ai/api/listings';

  try {
    logger.info(`Fetching listings from Brabble.ai...`);

    const response = await httpGet({
      url: endpoint,
      params: {
        hub: 'hackathons',
        limit: 50,
      },
      headers: {
        'x-api-key': env.BRABBLE_API_KEY,
        'Accept': 'application/json',
      },
    });

    // Extract listings array (handles { listings } or direct array)
    const listings = Array.isArray(response)
      ? response
      : (response?.listings || response?.data || response?.events || []);

    raw.push(...listings);

    for (const item of listings) {
      if (!item) continue;

      const title = item.title || item.name || 'Untitled Brabble Event';
      const externalId = String(item.id || item._id || item.slug || Math.random().toString(36).substring(7));
      const description = item.description || item.summary || item.shortDescription || '';
      
      // Category mapping
      const categoryHint = (item.category || item.type || 'technology').toLowerCase();
      const category = mapCategory(categoryHint) || 'technology';

      // Dates parsing
      let startAt = null;
      let endAt = null;
      try {
        const rawStart = item.startDate || item.startAt || item.submissionDeadline || item.deadline;
        if (rawStart) startAt = new Date(rawStart).toISOString();
      } catch (_) {}

      try {
        const rawEnd = item.endDate || item.endAt;
        if (rawEnd) endAt = new Date(rawEnd).toISOString();
      } catch (_) {}

      // If no start date could be parsed, default to upcoming 7 days
      if (!startAt) {
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 7);
        startAt = defaultDate.toISOString();
      }

      // Location details
      const isOnline = item.isVirtual !== undefined ? Boolean(item.isVirtual) : (item.mode?.toLowerCase() === 'online' || !item.venue);
      const venue = isOnline ? 'Online / Remote' : (item.venue || item.location?.venue || 'Campus / Venue TBA');
      const city = item.city || item.location?.city || (isOnline ? 'Online' : 'National');
      const country = item.country || item.location?.country || '';

      // Tags
      const tags = Array.isArray(item.tags) ? item.tags : [];
      if (!tags.includes('hackathon')) tags.push('hackathon');
      if (!tags.includes('competition')) tags.push('competition');

      const canonicalEvent = createCanonicalEvent({
        source: 'brabble',
        sourceType: 'external',
        externalId: externalId,
        title: title,
        description: description,
        category: category,
        subcategory: item.subcategory || item.type || 'Hackathon',
        tags: tags,
        startAt: startAt,
        endAt: endAt,
        timezone: item.timezone || 'Asia/Kolkata',
        isVirtual: isOnline,
        location: {
          venue: venue,
          city: city,
          country: country,
        },
        sourceUrl: item.url || item.website || item.link || 'https://brabble.ai',
        imageUrl: item.image || item.banner || item.logo || '',
        registrationUrl: item.registrationUrl || item.applyUrl || item.url || '',
        ticket: {
          type: item.isPaid ? 'paid' : 'free',
          price: typeof item.price === 'number' ? item.price : 0,
          currency: item.currency || 'INR',
        },
        status: 'published',
      });

      events.push(canonicalEvent);
    }

    logger.info(`Successfully fetched ${events.length} events from Brabble.ai`);
  } catch (err) {
    logger.error('Failed to fetch events from Brabble.ai:', err.message);
  }

  return { events, raw };
}

module.exports = { fetchBrabbleEvents };
