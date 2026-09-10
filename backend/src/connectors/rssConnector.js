const env = require('../config/env');
const logger = require('../config/logger');
const Parser = require('rss-parser');
const { createCanonicalEvent, mapCategory } = require('../utils/eventNormalization');

async function fetchRssEvents() {
  if (!env.RSS_FEED_URLS || env.RSS_FEED_URLS.length === 0) {
    return {
      events: [],
      disabled: true,
      reason: 'RSS_FEED_URLS not configured.'
    };
  }

  const events = [];
  const raw = [];
  const parser = new Parser({ timeout: 10000 });

  for (const url of env.RSS_FEED_URLS) {
    try {
      const feed = await parser.parseURL(url);
      if (feed && feed.items) {
        raw.push(...feed.items);
        
        for (const item of feed.items) {
          const startAtDate = item.isoDate || item.pubDate;
          let startAt = null;
          if (startAtDate) {
            try {
              startAt = new Date(startAtDate).toISOString();
            } catch (e) {
              startAt = null;
            }
          }

          let category = 'other';
          if (item.categories && item.categories.length > 0) {
            category = mapCategory(item.categories[0]);
          }

          const canonicalEvent = createCanonicalEvent({
            source: 'rss',
            sourceType: 'external',
            externalId: item.guid || item.link,
            title: item.title,
            description: item.contentSnippet || item.content || '',
            startAt: startAt,
            sourceUrl: item.link,
            category: category,
            tags: item.categories || []
          });

          if (canonicalEvent) {
            events.push(canonicalEvent);
          }
        }
      }
    } catch (error) {
      logger.error(`Error fetching RSS feed ${url}: ${error.message}`);
    }
  }

  return {
    events,
    raw,
    stats: { fetched: events.length }
  };
}

module.exports = { fetchRssEvents };
