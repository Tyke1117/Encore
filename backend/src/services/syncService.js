const path = require('path');
const fileStorage = require('./fileStorageService');
const config = require('../config/env');

let eventCache = [];
const normalizedFile = path.join(__dirname, '../../data/normalized/events_latest.txt');

async function loadCacheFromFile() {
  try {
    eventCache = await fileStorage.readFileLines(normalizedFile);
    console.log(`Loaded ${eventCache.length} events into memory cache.`);
  } catch (err) {
    console.error('Failed to load events cache:', err);
    eventCache = [];
  }
}

async function refreshCache() {
  await loadCacheFromFile();
}

function getEvents(filters = {}) {
  const { category, countryCode, city, source, startDate, endDate, page = 1, limit = 20 } = filters;
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = Math.min(parseInt(limit, 10) || 20, 50);

  const now = new Date();
  
  let filtered = eventCache.filter(e => {
    if (e.startAt && new Date(e.startAt) < now) {
      return false;
    }
    
    if (category && e.category !== category) return false;
    if (source && e.source !== source) return false;
    
    if (countryCode && e.location?.countryCode !== countryCode) return false;
    if (city && e.location?.city?.toLowerCase() !== city.toLowerCase()) return false;
    
    if (startDate && e.startAt && new Date(e.startAt) < new Date(startDate)) return false;
    if (endDate && e.startAt && new Date(e.startAt) > new Date(endDate)) return false;
    
    return true;
  });

  filtered.sort((a, b) => new Date(a.startAt) - new Date(b.startAt));

  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginated = filtered.slice(startIndex, endIndex);

  return {
    events: paginated,
    total: filtered.length,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(filtered.length / limitNum)
  };
}

function getEventById(id) {
  return eventCache.find(e => e.id === id) || null;
}

function getSourcesStatus() {
  return {
    ticketmaster: {
      enabled: !!config.TICKETMASTER_API_KEY,
      countryCodes: config.TICKETMASTER_COUNTRY_CODES,
      horizonDays: config.TICKETMASTER_HORIZON_DAYS,
    },
    sportsDb: {
      enabled: !!config.SPORTSDB_API_KEY,
      leagueIds: config.SPORTSDB_LEAGUE_IDS,
    },
    rss: {
      enabled: config.RSS_FEED_URLS.length > 0,
      feedUrls: config.RSS_FEED_URLS,
    },
    ics: {
      enabled: config.ICS_FEED_URLS.length > 0,
      feedUrls: config.ICS_FEED_URLS,
    },
    bookmyshow: {
      enabled: config.BOOKMYSHOW_ENABLED,
      regions: config.BOOKMYSHOW_REGIONS,
    },
  };
}

module.exports = {
  loadCacheFromFile,
  refreshCache,
  getEvents,
  getEventById,
  getSourcesStatus
};
