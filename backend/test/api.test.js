'use strict';
const app = require('../src/app');
const http = require('http');
const fsp = require('fs/promises');
const path = require('path');
const fileStorageService = require('../src/services/fileStorageService');
const syncService = require('../src/services/syncService');

describe('API Endpoints Integration', () => {
  let server;
  let baseUrl;
  const testSyncSecret = 'test-secret-key-12345';

  beforeAll(async () => {
    // Set test secret
    process.env.INTERNAL_SYNC_SECRET = testSyncSecret;
    
    // Seed test events into events_latest.txt
    const futureDate = new Date(Date.now() + 86400000).toISOString();
    const testEvents = [
      {
        id: 'test-event-1',
        title: 'Tech Summit 2026',
        category: 'technology',
        source: 'ticketmaster',
        sourceType: 'external',
        externalId: 'TM-TEST-1',
        startAt: futureDate,
        location: { city: 'Bangalore', countryCode: 'IN', venue: 'Convention Center' },
        status: 'published',
        ticket: { type: 'free', price: 0 }
      },
      {
        id: 'test-event-2',
        title: 'Football Derby',
        category: 'sports',
        source: 'sportsdb',
        sourceType: 'external',
        externalId: 'SD-TEST-2',
        startAt: futureDate,
        location: { city: 'London', countryCode: 'GB', venue: 'Wembley' },
        status: 'published',
        ticket: { type: 'paid', price: 50, currency: 'GBP' }
      }
    ];

    await fileStorageService.saveNormalizedEvents(testEvents);
    await syncService.loadCacheFromFile();

    return new Promise((resolve) => {
      server = http.createServer(app);
      server.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    if (server) {
      await new Promise(resolve => server.close(resolve));
    }
  });

  test('GET /health returns health info with no database confirmation', async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('ok');
    expect(data.database).toContain('none');
  });

  test('GET /api/events returns cached events', async () => {
    const res = await fetch(`${baseUrl}/api/events`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.events.length).toBeGreaterThanOrEqual(2);
    expect(data.total).toBeGreaterThanOrEqual(2);
  });

  test('GET /api/events filters by category', async () => {
    const res = await fetch(`${baseUrl}/api/events?category=technology`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.events.every(e => e.category === 'technology')).toBe(true);
  });

  test('GET /api/events/:id returns specific event', async () => {
    const res = await fetch(`${baseUrl}/api/events/test-event-1`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.title).toBe('Tech Summit 2026');
  });

  test('GET /api/events/:id returns 404 for non-existent event', async () => {
    const res = await fetch(`${baseUrl}/api/events/non-existent-id`);
    expect(res.status).toBe(404);
  });

  test('POST /api/organizer/events creates organizer event with x-organizer-id', async () => {
    const futureDate = new Date(Date.now() + 172800000).toISOString();
    const res = await fetch(`${baseUrl}/api/organizer/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-organizer-id': 'org-test-user'
      },
      body: JSON.stringify({
        title: 'Organizer AI Workshop',
        description: 'Hands-on AI building workshop',
        category: 'education',
        startAt: futureDate,
        location: { venue: 'Campus Hall', city: 'Mumbai', country: 'India', countryCode: 'IN' },
        ticket: { type: 'free', price: 0 }
      })
    });

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe('Organizer AI Workshop');
    expect(data.sourceType).toBe('organizer');
    expect(data.organizerId).toBe('org-test-user');
  });

  test('POST /api/organizer/events rejects missing x-organizer-id', async () => {
    const res = await fetch(`${baseUrl}/api/organizer/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'No Auth Workshop',
        startAt: new Date().toISOString()
      })
    });

    expect(res.status).toBe(401);
  });

  test('GET /api/internal/sources requires sync secret', async () => {
    const resUnauthorized = await fetch(`${baseUrl}/api/internal/sources`);
    expect(resUnauthorized.status).toBe(401);

    const resAuthorized = await fetch(`${baseUrl}/api/internal/sources`, {
      headers: { 'x-sync-secret': testSyncSecret }
    });
    expect(resAuthorized.status).toBe(200);
    const data = await resAuthorized.json();
    expect(data.ticketmaster).toBeDefined();
    expect(data.sportsDb).toBeDefined();
    expect(data.rss).toBeDefined();
    expect(data.ics).toBeDefined();
  });

  test('POST /api/internal/sync triggers sync with sync secret', async () => {
    const res = await fetch(`${baseUrl}/api/internal/sync`, {
      method: 'POST',
      headers: { 'x-sync-secret': testSyncSecret }
    });
    expect(res.status).toBe(200);
    const stats = await res.json();
    expect(stats.connectors).toBeDefined();
  });

  test('GET /api/internal/sync/status returns status with sync secret', async () => {
    const res = await fetch(`${baseUrl}/api/internal/sync/status`, {
      headers: { 'x-sync-secret': testSyncSecret }
    });
    expect(res.status).toBe(200);
  });
});
