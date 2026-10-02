const config = require('./config/env');
const app = require('./app');
const syncService = require('./services/syncService');
const logger = require('./config/logger');

const PORT = config.PORT || 4000;

async function start() {
  await syncService.loadCacheFromFile();
  
  const server = app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
    const sources = syncService.getSourcesStatus();
    logger.info(`Configured sources: ${JSON.stringify(sources)}`);

    if (config.ENABLE_LOCAL_SCHEDULER) {
      logger.info('ENABLE_LOCAL_SCHEDULER is true. Starting background auto-fetch cron...');
      const startScheduler = require('./scheduler');
      startScheduler();
    }
  });
  
  return server;
}

if (require.main === module) {
  start();
}

module.exports = { start, app };
