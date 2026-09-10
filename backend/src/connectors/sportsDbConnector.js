const env = require('../config/env');
const logger = require('../config/logger');
const { httpGet } = require('../utils/httpClient');
const { createCanonicalEvent } = require('../utils/eventNormalization');

async function fetchSportsDbEvents() {
  if (!env.SPORTSDB_API_KEY) {
    logger.warn('SportsDB API key not found. Connector disabled.');
    return {
      events: [],
      disabled: true,
      reason: 'SPORTSDB_API_KEY not configured. Get one at https://www.thesportsdb.com/api.php'
    };
  }

  if (!env.SPORTSDB_LEAGUE_IDS || env.SPORTSDB_LEAGUE_IDS.length === 0) {
    return {
      events: [],
      disabled: true,
      reason: 'SPORTSDB_LEAGUE_IDS not configured.'
    };
  }

  const events = [];
  const raw = [];
  
  for (const leagueId of env.SPORTSDB_LEAGUE_IDS) {
    try {
      const url = `https://www.thesportsdb.com/api/v1/json/${env.SPORTSDB_API_KEY}/eventsnextleague.php?id=${leagueId}`;
      const response = await httpGet(url);
      
      if (response && response.events) {
        raw.push(...response.events);
        
        for (const event of response.events) {
          let startAt = null;
          if (event.dateEvent && event.strTime) {
            startAt = new Date(`${event.dateEvent}T${event.strTime}`).toISOString();
          } else if (event.strTimestamp) {
            startAt = event.strTimestamp;
          }

          const tags = [];
          if (event.strLeague) tags.push(event.strLeague);
          if (event.strSport) tags.push(event.strSport);

          const canonicalEvent = createCanonicalEvent({
            source: 'sportsdb',
            sourceType: 'external',
            externalId: event.idEvent,
            title: event.strEvent,
            description: event.strDescriptionEN || '',
            category: 'sports',
            subcategory: event.strSport,
            startAt: startAt,
            location: {
              venue: event.strVenue,
              city: event.strCity,
              country: event.strCountry
            },
            imageUrl: event.strThumb,
            tags: tags
          });
          
          if (canonicalEvent) {
            events.push(canonicalEvent);
          }
        }
      }
    } catch (error) {
      logger.error(`Error fetching SportsDB events for league ${leagueId}: ${error.message}`);
    }
  }

  return {
    events,
    raw,
    stats: { fetched: events.length }
  };
}

module.exports = { fetchSportsDbEvents };
