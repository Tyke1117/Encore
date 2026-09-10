const { generateFingerprint } = require('../utils/fingerprint');

function countFields(event) {
  let count = 0;
  if (event.title) count++;
  if (event.description) count++;
  if (event.category && event.category !== 'other') count++;
  if (event.subcategory) count++;
  if (event.tags && event.tags.length > 0) count++;
  if (event.startAt) count++;
  if (event.endAt) count++;
  if (event.location?.venue) count++;
  if (event.location?.city) count++;
  if (event.location?.country) count++;
  if (event.imageUrl) count++;
  if (event.sourceUrl) count++;
  if (event.ticket?.price) count++;
  return count;
}

function deduplicateEvents(events) {
  const exactMap = new Map(); // exactKey -> event
  const fpMap = new Map();    // fingerprint -> event
  const duplicateEvents = [];

  for (const event of events) {
    if (!event.fingerprint) {
      event.fingerprint = generateFingerprint(event);
    }

    const exactKey = `${event.source}:${event.externalId}`;
    const fpKey = event.fingerprint;

    const existingEvent = exactMap.get(exactKey) || fpMap.get(fpKey);

    if (existingEvent) {
      const existingScore = countFields(existingEvent);
      const newScore = countFields(event);

      if (newScore > existingScore) {
        // Keep new event, preserve sourceUrl if missing
        if (!event.sourceUrl && existingEvent.sourceUrl) {
          event.sourceUrl = existingEvent.sourceUrl;
        }
        
        // Remove existing from maps
        const oldExactKey = `${existingEvent.source}:${existingEvent.externalId}`;
        const oldFpKey = existingEvent.fingerprint;
        exactMap.delete(oldExactKey);
        fpMap.delete(oldFpKey);

        // Add new event to maps
        exactMap.set(exactKey, event);
        fpMap.set(fpKey, event);
        duplicateEvents.push(existingEvent);
      } else {
        // Keep existing event, preserve sourceUrl if missing
        if (!existingEvent.sourceUrl && event.sourceUrl) {
          existingEvent.sourceUrl = event.sourceUrl;
        }
        
        // Map new keys to existing event
        exactMap.set(exactKey, existingEvent);
        fpMap.set(fpKey, existingEvent);
        duplicateEvents.push(event);
      }
    } else {
      exactMap.set(exactKey, event);
      fpMap.set(fpKey, event);
    }
  }

  const unique = Array.from(new Set(exactMap.values()));

  return {
    unique,
    duplicates: duplicateEvents,
    duplicateCount: duplicateEvents.length,
  };
}

module.exports = {
  deduplicateEvents,
};
