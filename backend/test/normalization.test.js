'use strict';
const { createCanonicalEvent, validateEvent, mapCategory } = require('../src/utils/eventNormalization');
const { generateFingerprint, generateEventId } = require('../src/utils/fingerprint');

describe('Event Normalization', () => {
  describe('createCanonicalEvent', () => {
    test('creates valid event from Ticketmaster data', () => {
      const event = createCanonicalEvent({
        title: 'Rock Concert 2024',
        description: 'A great concert',
        category: 'music',
        source: 'ticketmaster',
        sourceType: 'external',
        externalId: 'TM-12345',
        startAt: '2026-12-15T19:00:00Z',
        endAt: '2026-12-15T23:00:00Z',
        timezone: 'America/New_York',
        location: { venue: 'Madison Square Garden', city: 'New York', country: 'United States', countryCode: 'US' },
        sourceUrl: 'https://ticketmaster.com/event/12345',
        ticket: { type: 'paid', price: 75, currency: 'USD' },
      });
      expect(event.title).toBe('Rock Concert 2024');
      expect(event.category).toBe('music');
      expect(event.source).toBe('ticketmaster');
      expect(event.sourceType).toBe('external');
      expect(event.location.city).toBe('New York');
      expect(event.ticket.type).toBe('paid');
      expect(event.ticket.price).toBe(75);
      expect(event.id).toBeTruthy();
      expect(event.fingerprint).toBeTruthy();
      expect(event.fetchedAt).toBeTruthy();
    });

    test('creates valid event from TheSportsDB data', () => {
      const event = createCanonicalEvent({
        title: 'India vs Australia',
        category: 'sports',
        subcategory: 'Cricket',
        source: 'sportsdb',
        sourceType: 'external',
        externalId: 'SD-98765',
        startAt: '2026-11-20T09:30:00Z',
        location: { venue: 'MCG', city: 'Melbourne', country: 'Australia', countryCode: 'AU' },
        tags: ['Cricket', 'Test Match'],
      });
      expect(event.title).toBe('India vs Australia');
      expect(event.category).toBe('sports');
      expect(event.subcategory).toBe('Cricket');
      expect(event.tags).toContain('Cricket');
    });

    test('creates valid event from RSS data', () => {
      const event = createCanonicalEvent({
        title: 'University Open Day',
        source: 'rss',
        sourceType: 'external',
        externalId: 'rss-guid-001',
        startAt: '2026-10-01T10:00:00Z',
        category: 'education',
        sourceUrl: 'https://example.edu/events/open-day',
      });
      expect(event.title).toBe('University Open Day');
      expect(event.category).toBe('education');
      expect(event.source).toBe('rss');
    });

    test('creates valid event from ICS data', () => {
      const event = createCanonicalEvent({
        title: 'Team Meeting',
        source: 'ics',
        sourceType: 'external',
        externalId: 'uid-12345@example.com',
        startAt: '2026-09-15T14:00:00Z',
        endAt: '2026-09-15T15:00:00Z',
        location: { venue: 'Conference Room A' },
      });
      expect(event.title).toBe('Team Meeting');
      expect(event.source).toBe('ics');
      expect(event.endAt).toBe('2026-09-15T15:00:00Z');
    });

    test('creates valid event from BookMyShow data', () => {
      const event = createCanonicalEvent({
        title: 'Zakir Khan Live',
        category: 'arts',
        subcategory: 'Stand-up Comedy',
        source: 'bookmyshow',
        sourceType: 'external',
        externalId: 'ET00350000',
        startAt: '2026-11-25T14:30:00Z',
        location: { venue: 'Good Shepherd Auditorium', city: 'Bangalore', country: 'India', countryCode: 'IN' },
        ticket: { type: 'paid', price: 999, currency: 'INR' },
        sourceUrl: 'https://in.bookmyshow.com/events/zakir-khan-live/ET00350000',
      });
      expect(event.title).toBe('Zakir Khan Live');
      expect(event.source).toBe('bookmyshow');
      expect(event.ticket.currency).toBe('INR');
      expect(event.ticket.price).toBe(999);
      expect(event.location.city).toBe('Bangalore');
    });

    test('creates valid organizer event', () => {
      const event = createCanonicalEvent({
        title: 'Campus Hackathon',
        category: 'technology',
        source: 'encore',
        sourceType: 'organizer',
        externalId: 'org-uuid-001',
        organizerId: 'user-123',
        startAt: '2026-10-15T09:00:00Z',
        endAt: '2026-10-16T18:00:00Z',
        location: { venue: 'Innovation Hub', city: 'Bangalore', country: 'India', countryCode: 'IN' },
        ticket: { type: 'free', price: 0, currency: 'INR' },
        capacity: 200,
      });
      expect(event.sourceType).toBe('organizer');
      expect(event.organizerId).toBe('user-123');
      expect(event.capacity).toBe(200);
    });

    test('defaults invalid category to other', () => {
      const event = createCanonicalEvent({ title: 'Test', category: 'invalid-cat', source: 'rss', externalId: 'x', startAt: '2026-10-01T00:00:00Z' });
      expect(event.category).toBe('other');
    });

    test('defaults missing fields', () => {
      const event = createCanonicalEvent({});
      expect(event.title).toBe('');
      expect(event.location.venue).toBe('');
      expect(event.ticket.type).toBe('free');
      expect(event.ticket.price).toBe(0);
      expect(event.isVirtual).toBe(false);
      expect(event.capacity).toBeNull();
    });
  });

  describe('validateEvent', () => {
    test('accepts valid event', () => {
      const event = createCanonicalEvent({ title: 'Valid Event', startAt: '2026-12-01T10:00:00Z', source: 'ticketmaster', sourceType: 'external', externalId: 'EXT-001' });
      const result = validateEvent(event);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('rejects missing title', () => {
      const event = createCanonicalEvent({ title: '', startAt: '2026-12-01T10:00:00Z', source: 'rss', externalId: 'x' });
      const result = validateEvent(event);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Title is missing');
    });

    test('rejects missing start date', () => {
      const event = createCanonicalEvent({ title: 'No Start', source: 'rss', externalId: 'x' });
      const result = validateEvent(event);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Start date is missing');
    });

    test('rejects invalid start date', () => {
      const event = createCanonicalEvent({ title: 'Bad Date', startAt: 'not-a-date', source: 'rss', externalId: 'x' });
      const result = validateEvent(event);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Start date is invalid');
    });

    test('rejects end time before start time', () => {
      const event = createCanonicalEvent({ title: 'Reversed', startAt: '2026-12-15T20:00:00Z', endAt: '2026-12-15T10:00:00Z', source: 'rss', externalId: 'x' });
      const result = validateEvent(event);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('End time is before start time');
    });

    test('rejects missing externalId for external events', () => {
      const event = createCanonicalEvent({ title: 'No ID', startAt: '2026-12-01T10:00:00Z', source: 'ticketmaster', sourceType: 'external', externalId: '' });
      const result = validateEvent(event);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('External provider ID is missing');
    });

    test('rejects event far in the past', () => {
      const event = createCanonicalEvent({ title: 'Old Event', startAt: '2020-01-01T10:00:00Z', source: 'rss', externalId: 'x' });
      const result = validateEvent(event);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Event is too far in the past');
    });
  });

  describe('mapCategory', () => {
    test('maps music categories', () => {
      expect(mapCategory('Music')).toBe('music');
      expect(mapCategory('Concert')).toBe('music');
      expect(mapCategory('Live Music Festival')).toBe('music');
    });

    test('maps sports categories', () => {
      expect(mapCategory('Sports')).toBe('sports');
      expect(mapCategory('Football')).toBe('sports');
      expect(mapCategory('Cricket Match')).toBe('sports');
    });

    test('maps tech categories', () => {
      expect(mapCategory('Technology')).toBe('technology');
      expect(mapCategory('Hackathon')).toBe('technology');
    });

    test('maps business categories', () => {
      expect(mapCategory('Business Conference')).toBe('business');
      expect(mapCategory('Summit')).toBe('business');
    });

    test('maps education categories', () => {
      expect(mapCategory('Workshop')).toBe('education');
      expect(mapCategory('University Lecture')).toBe('education');
    });

    test('maps arts categories', () => {
      expect(mapCategory('Theatre')).toBe('arts');
      expect(mapCategory('Art Exhibition')).toBe('arts');
    });

    test('defaults to other', () => {
      expect(mapCategory('random stuff')).toBe('other');
      expect(mapCategory(null)).toBe('other');
      expect(mapCategory('')).toBe('other');
    });
  });
});

describe('Fingerprint', () => {
  test('generates consistent fingerprint', () => {
    const fp1 = generateFingerprint({ title: 'Test Event', startAt: '2026-12-01T10:00:00Z', location: { city: 'Mumbai', venue: 'Hall A' } });
    const fp2 = generateFingerprint({ title: 'Test Event', startAt: '2026-12-01T10:00:00Z', location: { city: 'Mumbai', venue: 'Hall A' } });
    expect(fp1).toBe(fp2);
  });

  test('generates different fingerprint for different events', () => {
    const fp1 = generateFingerprint({ title: 'Event A', startAt: '2026-12-01T10:00:00Z', location: { city: 'Mumbai' } });
    const fp2 = generateFingerprint({ title: 'Event B', startAt: '2026-12-01T10:00:00Z', location: { city: 'Mumbai' } });
    expect(fp1).not.toBe(fp2);
  });

  test('fingerprint is case-insensitive', () => {
    const fp1 = generateFingerprint({ title: 'Test Event', startAt: '2026-12-01T10:00:00Z', location: { city: 'Mumbai' } });
    const fp2 = generateFingerprint({ title: 'TEST EVENT', startAt: '2026-12-01T10:00:00Z', location: { city: 'MUMBAI' } });
    expect(fp1).toBe(fp2);
  });

  test('generates stable event ID', () => {
    const id1 = generateEventId('ticketmaster', 'TM-123');
    const id2 = generateEventId('ticketmaster', 'TM-123');
    expect(id1).toBe(id2);
    expect(id1).toHaveLength(24);
  });
});
