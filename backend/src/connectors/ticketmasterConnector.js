const env = require('../config/env');
const logger = require('../config/logger');
const { httpGet, sleep } = require('../utils/httpClient');
const { createCanonicalEvent, mapCategory } = require('../utils/eventNormalization');

async function fetchTicketmasterEvents() {
  if (!env.TICKETMASTER_API_KEY) {
    logger.warn('Ticketmaster API key not found. Connector disabled.');
    return {
      events: [],
      disabled: true,
      reason: 'TICKETMASTER_API_KEY not configured. Get one at https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/'
    };
  }

  const events = [];
  const raw = [];
  const countryCodes = env.TICKETMASTER_COUNTRY_CODES || 'US';
  const horizonDays = env.TICKETMASTER_HORIZON_DAYS || 30;
  const maxPages = env.TICKETMASTER_MAX_PAGES || 5;

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + horizonDays);

  const startDateTime = startDate.toISOString().split('.')[0] + 'Z';
  const endDateTime = endDate.toISOString().split('.')[0] + 'Z';

  for (let page = 0; page < maxPages; page++) {
    try {
      const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${env.TICKETMASTER_API_KEY}&countryCode=${countryCodes}&startDateTime=${startDateTime}&endDateTime=${endDateTime}&page=${page}&size=20`;
      
      const response = await httpGet(url);
      
      if (!response || !response._embedded || !response._embedded.events) {
        break;
      }

      const pageEvents = response._embedded.events;
      raw.push(...pageEvents);

      for (const event of pageEvents) {
        const venue = event._embedded && event._embedded.venues && event._embedded.venues[0] ? event._embedded.venues[0] : {};
        
        let imageUrl = null;
        if (event.images && event.images.length > 0) {
          // Find largest image
          const sortedImages = [...event.images].sort((a, b) => (b.width * b.height) - (a.width * a.height));
          imageUrl = sortedImages[0].url;
        }
        
        const categoryString = event.classifications && event.classifications[0] && event.classifications[0].segment ? event.classifications[0].segment.name : '';
        const subcategoryString = event.classifications && event.classifications[0] && event.classifications[0].genre ? event.classifications[0].genre.name : '';
        
        let startAt = event.dates && event.dates.start ? event.dates.start.dateTime : null;
        let endAt = event.dates && event.dates.end ? event.dates.end.dateTime : null;
        
        const priceRanges = event.priceRanges && event.priceRanges[0] ? event.priceRanges[0] : null;

        const canonicalEvent = createCanonicalEvent({
          source: 'ticketmaster',
          sourceType: 'external',
          externalId: event.id,
          title: event.name,
          description: event.info || event.pleaseNote || '',
          category: mapCategory(categoryString),
          subcategory: subcategoryString,
          startAt: startAt,
          endAt: endAt,
          timezone: event.dates && event.dates.timezone ? event.dates.timezone : null,
          location: {
            venue: venue.name,
            city: venue.city ? venue.city.name : null,
            state: venue.state ? venue.state.stateCode : null,
            country: venue.country ? venue.country.name : null,
            countryCode: venue.country ? venue.country.countryCode : null,
            latitude: venue.location ? parseFloat(venue.location.latitude) : null,
            longitude: venue.location ? parseFloat(venue.location.longitude) : null,
            address: venue.address ? venue.address.line1 : null,
          },
          imageUrl: imageUrl,
          sourceUrl: event.url,
          registrationUrl: event.url,
          ticket: {
            type: priceRanges ? 'paid' : 'free',
            price: priceRanges ? priceRanges.min : 0,
            currency: priceRanges ? priceRanges.currency : 'USD',
          }
        });
        
        if (canonicalEvent) {
          events.push(canonicalEvent);
        }
      }
      
      if (page < maxPages - 1) {
        await sleep(250);
      }
    } catch (error) {
      logger.error(`Error fetching Ticketmaster events on page ${page}: ${error.message}`);
      break;
    }
  }

  return {
    events,
    raw,
    stats: { fetched: events.length, pages: maxPages }
  };
}

module.exports = { fetchTicketmasterEvents };
