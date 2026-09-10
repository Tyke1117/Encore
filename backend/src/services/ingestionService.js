const logger = require('../config/logger');
const { validateEvent } = require('../utils/eventNormalization');
const { deduplicateEvents } = require('./deduplicationService');
const fileStorage = require('./fileStorageService');

const { fetchTicketmasterEvents } = require('../connectors/ticketmasterConnector');
const { fetchSportsDbEvents } = require('../connectors/sportsDbConnector');
const { fetchRssEvents } = require('../connectors/rssConnector');
const { fetchIcsEvents } = require('../connectors/icsConnector');
const { fetchBookMyShowEvents } = require('../connectors/bookMyShowConnector');

let syncLock = false;
let lastSyncStatus = null;

async function runFullSync() {
  if (syncLock) {
    logger.warn('Sync is already running. Skipping this run.');
    return { error: 'Sync already running' };
  }

  syncLock = true;
  const startTime = Date.now();
  
  const stats = {
    startTime: new Date().toISOString(),
    connectors: {
      ticketmaster: { fetched: 0, valid: 0, quarantined: 0, duplicates: 0 },
      sportsDb: { fetched: 0, valid: 0, quarantined: 0, duplicates: 0 },
      rss: { fetched: 0, valid: 0, quarantined: 0, duplicates: 0 },
      ics: { fetched: 0, valid: 0, quarantined: 0, duplicates: 0 },
      bookmyshow: { fetched: 0, valid: 0, quarantined: 0, duplicates: 0 },
    },
    organizerEventsIncluded: 0,
    finalUniqueEvents: 0,
    durationMs: 0
  };

  const allValidEvents = [];
  const allQuarantinedEvents = [];
  
  const sources = [
    { name: 'ticketmaster', fetch: fetchTicketmasterEvents },
    { name: 'sportsDb', fetch: fetchSportsDbEvents },
    { name: 'rss', fetch: fetchRssEvents },
    { name: 'ics', fetch: fetchIcsEvents },
    { name: 'bookmyshow', fetch: fetchBookMyShowEvents }
  ];

  try {
    for (const source of sources) {
      try {
        const result = await source.fetch();
        const events = result.events || [];
        const raw = result.raw || [];
        
        stats.connectors[source.name].fetched = events.length;
        
        await fileStorage.saveRawSnapshot(source.name, raw.length > 0 ? raw : events);
        
        const valid = [];
        for (const ev of events) {
          const { valid: isValidEvent, errors } = validateEvent(ev);
          if (isValidEvent) {
            valid.push(ev);
          } else {
            allQuarantinedEvents.push({ event: ev, errors });
            stats.connectors[source.name].quarantined++;
          }
        }
        stats.connectors[source.name].valid = valid.length;
        allValidEvents.push(...valid);
      } catch (err) {
        logger.error(`Error fetching from ${source.name}:`, err);
      }
    }

    const dedupResult = deduplicateEvents(allValidEvents);
    let finalEvents = dedupResult.unique;
    
    // Calculate duplicates per connector
    for (const dup of dedupResult.duplicates) {
      const src = dup.source;
      if (stats.connectors[src]) {
        stats.connectors[src].duplicates++;
      } else if (src === 'sportsdb' && stats.connectors.sportsDb) {
        stats.connectors.sportsDb.duplicates++;
      }
    }

    const organizerEvents = await fileStorage.readOrganizerEvents();
    const publishedOrganizerEvents = organizerEvents.filter(e => e.status !== 'cancelled');
    stats.organizerEventsIncluded = publishedOrganizerEvents.length;
    
    finalEvents.push(...publishedOrganizerEvents);
    const finalDedup = deduplicateEvents(finalEvents);
    finalEvents = finalDedup.unique;
    
    stats.finalUniqueEvents = finalEvents.length;
    stats.durationMs = Date.now() - startTime;

    await fileStorage.saveNormalizedEvents(finalEvents);
    await fileStorage.saveQuarantinedEvents(allQuarantinedEvents);
    await fileStorage.saveSyncReport(stats);
    await fileStorage.runRetentionCleanup();
    
    lastSyncStatus = stats;

    printSummary(stats, allValidEvents);

    return stats;
  } catch (err) {
    logger.error('Full sync failed:', err);
    throw err;
  } finally {
    syncLock = false;
  }
}

function printSummary(stats, validEvents) {
  let summary = `\n═══════════════════════════════════════════\n`;
  summary += `  ENCORE EVENT SYNC COMPLETED\n`;
  summary += `═══════════════════════════════════════════\n\n`;

  for (const [source, s] of Object.entries(stats.connectors)) {
    const displayName = source === 'sportsDb' ? 'TheSportsDB' : (source.charAt(0).toUpperCase() + source.slice(1));
    summary += `  ${displayName}:\n`;
    summary += `    Fetched: ${s.fetched}\n`;
    summary += `    Valid:   ${s.valid}\n`;
    summary += `    Duplicates: ${s.duplicates}\n`;
    summary += `    Quarantined: ${s.quarantined}\n\n`;
  }

  summary += `  Organizer events included: ${stats.organizerEventsIncluded}\n`;
  summary += `  Final unique events: ${stats.finalUniqueEvents}\n`;
  summary += `  Output: backend/data/normalized/events_latest.txt\n`;
  summary += `  Duration: ${(stats.durationMs / 1000).toFixed(1)} seconds\n`;
  summary += `═══════════════════════════════════════════\n\n`;
  
  summary += `  Sample Events (first 3 per source):\n`;
  
  const sources = Object.keys(stats.connectors);
  for (const source of sources) {
    const srcKey = source === 'sportsDb' ? 'sportsdb' : source;
    const samples = validEvents.filter(e => e.source === srcKey || e.source === source).slice(0, 3);
    if (samples.length > 0) {
      summary += `    ${source}:\n`;
      samples.forEach(s => {
        summary += `      - ${s.title} | ${s.startAt} | ${s.location?.city || 'Unknown'}\n`;
      });
    }
  }

  console.log(summary);
}

function getSyncStatus() {
  return lastSyncStatus || { status: 'never_run' };
}

module.exports = {
  runFullSync,
  getSyncStatus
};
