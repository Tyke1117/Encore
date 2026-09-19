const config = require('./config/env');
const cron = require('node-cron');
const ingestionService = require('./services/ingestionService');
const syncService = require('./services/syncService');
const logger = require('./config/logger');

async function runOnce() {
  try {
    await ingestionService.runFullSync();
    await syncService.refreshCache();
  } catch (err) {
    logger.error('Failed to run full sync:', err);
  }
}

async function start() {
  if (process.argv.includes('--once')) {
    logger.info('Running sync once...');
    await runOnce();
    process.exit(0);
  } else {
    logger.info(`Scheduling sync with cron: ${config.SYNC_CRON}`);
    
    // Run once on startup
    await runOnce();
    
    cron.schedule(config.SYNC_CRON, async () => {
      logger.info('Cron tick: running sync');
      await runOnce();
    });
  }
}

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Exiting gracefully.');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Exiting gracefully.');
  process.exit(0);
});

if (require.main === module) {
  start();
}

module.exports = start;
