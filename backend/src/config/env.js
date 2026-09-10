'use strict';
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const env = {
  PORT: parseInt(process.env.PORT, 10) || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  INTERNAL_SYNC_SECRET: process.env.INTERNAL_SYNC_SECRET || '',

  TICKETMASTER_API_KEY: process.env.TICKETMASTER_API_KEY || '',
  TICKETMASTER_COUNTRY_CODES: (process.env.TICKETMASTER_COUNTRY_CODES || 'IN,US,GB,CA,AU').split(',').map(s => s.trim()),
  TICKETMASTER_HORIZON_DAYS: parseInt(process.env.TICKETMASTER_HORIZON_DAYS, 10) || 90,
  TICKETMASTER_MAX_PAGES: parseInt(process.env.TICKETMASTER_MAX_PAGES, 10) || 3,

  SPORTSDB_API_KEY: process.env.SPORTSDB_API_KEY || '',
  SPORTSDB_LEAGUE_IDS: (process.env.SPORTSDB_LEAGUE_IDS || '').split(',').map(s => s.trim()).filter(Boolean),

  RSS_FEED_URLS: (process.env.RSS_FEED_URLS || '').split(',').map(s => s.trim()).filter(Boolean),
  ICS_FEED_URLS: (process.env.ICS_FEED_URLS || '').split(',').map(s => s.trim()).filter(Boolean),

  BOOKMYSHOW_ENABLED: process.env.BOOKMYSHOW_ENABLED === 'true',
  BOOKMYSHOW_REGIONS: (process.env.BOOKMYSHOW_REGIONS || 'BANG,NCR,MUMBAI').split(',').map(s => s.trim()).filter(Boolean),

  ENABLE_LOCAL_SCHEDULER: process.env.ENABLE_LOCAL_SCHEDULER === 'true',
  SYNC_CRON: process.env.SYNC_CRON || '0 */6 * * *',

  RAW_RETENTION_DAYS: parseInt(process.env.RAW_RETENTION_DAYS, 10) || 7,
  QUARANTINE_RETENTION_DAYS: parseInt(process.env.QUARANTINE_RETENTION_DAYS, 10) || 7,
  REPORT_RETENTION_DAYS: parseInt(process.env.REPORT_RETENTION_DAYS, 10) || 14,
};

module.exports = env;
