const env = require('../config/env');
const logger = require('../config/logger');
const { httpGet } = require('../utils/httpClient');
const ICAL = require('ical.js');
const { createCanonicalEvent } = require('../utils/eventNormalization');

async function fetchIcsEvents() {
  if (!env.ICS_FEED_URLS || env.ICS_FEED_URLS.length === 0) {
    return {
      events: [],
      disabled: true,
      reason: 'ICS_FEED_URLS not configured.'
    };
  }

  const events = [];
  const raw = [];
  const now = new Date();
  const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000));

  for (const url of env.ICS_FEED_URLS) {
    try {
      // Allow passing responseType if httpGet supports it, otherwise default text
      // We assume httpGet resolves with raw data if not JSON, or we can handle accordingly.
      // This assumes httpGet handles the parsing based on Content-Type or similar
      const icsData = await httpGet(url);
      
      if (!icsData) continue;
      
      const jcalData = ICAL.parse(icsData);
      const comp = new ICAL.Component(jcalData);
      const vevents = comp.getAllSubcomponents('vevent');
      
      for (const vevent of vevents) {
        const event = new ICAL.Event(vevent);
        raw.push(vevent.toJSON());
        
        let startAt = null;
        let endAt = null;
        
        try {
          if (event.startDate) startAt = event.startDate.toJSDate().toISOString();
          if (event.endDate) endAt = event.endDate.toJSDate().toISOString();
        } catch (e) {
          // ignore date parse errors
        }
        
        if (startAt) {
          const eventDate = new Date(startAt);
          if (eventDate < yesterday) {
             continue; // Only include upcoming events
          }
        }

        const canonicalEvent = createCanonicalEvent({
          source: 'ics',
          sourceType: 'external',
          externalId: event.uid,
          title: event.summary,
          description: event.description || '',
          startAt: startAt,
          endAt: endAt,
          location: {
            venue: event.location
          },
          sourceUrl: url
        });
        
        if (canonicalEvent) {
          events.push(canonicalEvent);
        }
      }
    } catch (error) {
      logger.error(`Error fetching ICS feed ${url}: ${error.message}`);
    }
  }

  return {
    events,
    raw,
    stats: { fetched: events.length }
  };
}

module.exports = { fetchIcsEvents };
