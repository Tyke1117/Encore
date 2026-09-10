'use strict';
const env = require('../config/env');
const logger = require('../config/logger');
const { httpGet, sleep } = require('../utils/httpClient');
const { createCanonicalEvent, mapCategory } = require('../utils/eventNormalization');

const REGION_CITY_MAP = {
  BANG: 'Bangalore',
  NCR: 'Delhi NCR',
  MUMBAI: 'Mumbai',
  PUN: 'Pune',
  HYD: 'Hyderabad',
  CHEN: 'Chennai',
  KOLK: 'Kolkata',
  AHD: 'Ahmedabad',
};

/**
 * Fetch upcoming events from BookMyShow for configured Indian regions.
 * @returns {Promise<{ events: any[], raw: any[], disabled?: boolean, reason?: string, stats: { fetched: number } }>}
 */
async function fetchBookMyShowEvents() {
  if (!env.BOOKMYSHOW_ENABLED) {
    logger.info('BookMyShow connector disabled in .env (BOOKMYSHOW_ENABLED=false).');
    return {
      events: [],
      disabled: true,
      reason: 'BOOKMYSHOW_ENABLED is not set to true in .env',
      stats: { fetched: 0 },
    };
  }

  const events = [];
  const raw = [];
  const regions = env.BOOKMYSHOW_REGIONS || ['BANG', 'NCR', 'MUMBAI'];

  for (const region of regions) {
    const cityName = REGION_CITY_MAP[region.toUpperCase()] || region;
    try {
      // BookMyShow public region explore discovery endpoint
      const url = `https://in.bookmyshow.com/api/explore/v1/discover/regions/${region.toUpperCase()}/events`;
      
      const response = await httpGet(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
        },
      });

      if (response && response.BookMyShow && response.BookMyShow.arrEvents) {
        const eventList = response.BookMyShow.arrEvents;
        raw.push(...eventList);

        for (const item of eventList) {
          const title = item.EventTitle || item.EventName || item.title;
          if (!title) continue;

          // Parse date
          let startAt = null;
          if (item.EventDate) {
            try {
              startAt = new Date(item.EventDate).toISOString();
            } catch (e) {
              startAt = null;
            }
          }
          if (!startAt) {
            startAt = new Date().toISOString();
          }

          const rawCategory = item.EventGenre || item.EventGroup || item.category || 'other';
          const price = parseInt(item.MinPrice, 10) || parseInt(item.EventPrice, 10) || 0;

          const canonicalEvent = createCanonicalEvent({
            source: 'bookmyshow',
            sourceType: 'external',
            externalId: item.EventCode || item.EventURL || `bms-${region}-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            title: title,
            description: item.EventSynopsis || item.description || '',
            category: mapCategory(rawCategory),
            subcategory: rawCategory,
            startAt: startAt,
            timezone: 'Asia/Kolkata',
            location: {
              venue: item.VenueName || item.venue || '',
              city: cityName,
              country: 'India',
              countryCode: 'IN',
            },
            imageUrl: item.BannerURL || item.EventBannerURL || item.EventImage || '',
            sourceUrl: item.EventURL ? `https://in.bookmyshow.com/events/${item.EventURL}/${item.EventCode}` : `https://in.bookmyshow.com/${region.toLowerCase()}/events`,
            registrationUrl: item.EventURL ? `https://in.bookmyshow.com/events/${item.EventURL}/${item.EventCode}` : `https://in.bookmyshow.com/${region.toLowerCase()}/events`,
            ticket: {
              type: price > 0 ? 'paid' : 'free',
              price: price,
              currency: 'INR',
            },
          });

          if (canonicalEvent) {
            events.push(canonicalEvent);
          }
        }
      }

      await sleep(500); // 500ms delay between city requests to respect server load
    } catch (err) {
      logger.warn(`Could not fetch BookMyShow events for region ${region}: ${err.message}`);
    }
  }

  return {
    events,
    raw,
    stats: { fetched: events.length },
  };
}

module.exports = { fetchBookMyShowEvents };
