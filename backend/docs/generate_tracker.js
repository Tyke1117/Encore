'use strict';
const ExcelJS = require('exceljs');
const path = require('path');

async function generateTracker() {
  const providers = [
    {
      website: 'Ticketmaster',
      categories: 'Concerts, Sports, Theatre, Exhibitions, Festivals',
      devUrl: 'https://developer.ticketmaster.com/',
      docsUrl: 'https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/',
      envVar: 'TICKETMASTER_API_KEY',
      keyValue: 'NOT_CONFIGURED',
      status: 'Pending Setup',
      rateLimit: '5 req/sec, 5000 req/day (Free tier)',
      regRequired: 'Yes',
      notes: 'Sign up at developer.ticketmaster.com. Free Discovery API key available.',
    },
    {
      website: 'TheSportsDB',
      categories: 'Cricket, Football, Basketball, Tennis, Motorsport',
      devUrl: 'https://www.thesportsdb.com/api.php',
      docsUrl: 'https://www.thesportsdb.com/api.php',
      envVar: 'SPORTSDB_API_KEY',
      keyValue: 'NOT_CONFIGURED',
      status: 'Pending Setup',
      rateLimit: 'Free tier: limited. Patreon for higher limits.',
      regRequired: 'Yes (free tier available)',
      notes: 'Free test key "3" available for development. Production requires Patreon.',
    },
    {
      website: 'PredictHQ',
      categories: 'Conferences, Festivals, Sports, Community',
      devUrl: 'https://www.predicthq.com/',
      docsUrl: 'https://docs.predicthq.com/',
      envVar: 'PREDICTHQ_API_KEY',
      keyValue: 'NOT_CONFIGURED',
      status: 'Not Implemented',
      rateLimit: 'Free tier: limited requests',
      regRequired: 'Yes',
      notes: 'Future integration candidate. Sign up for free tier.',
    },
    {
      website: 'OpenAgenda',
      categories: 'Local events, Cultural, Community',
      devUrl: 'https://openagenda.com/',
      docsUrl: 'https://developers.openagenda.com/',
      envVar: 'OPENAGENDA_API_KEY',
      keyValue: 'NOT_CONFIGURED',
      status: 'Not Implemented',
      rateLimit: 'Varies by plan',
      regRequired: 'Yes',
      notes: 'Future integration candidate.',
    },
    {
      website: 'Bandsintown',
      categories: 'Concerts, Live Music, Tours',
      devUrl: 'https://www.bandsintown.com/',
      docsUrl: 'https://artists.bandsintown.com/support/api-installation',
      envVar: 'BANDSINTOWN_APP_ID',
      keyValue: 'NOT_CONFIGURED',
      status: 'Not Implemented',
      rateLimit: 'Varies',
      regRequired: 'Yes',
      notes: 'Future integration candidate. Apply for artist API access.',
    },
    {
      website: 'Meetup',
      categories: 'Tech meetups, Social, Community, Professional',
      devUrl: 'https://www.meetup.com/',
      docsUrl: 'https://www.meetup.com/api/',
      envVar: 'MEETUP_API_KEY',
      keyValue: 'NOT_CONFIGURED',
      status: 'Not Implemented',
      rateLimit: 'OAuth2 required. Rate limits vary.',
      regRequired: 'Yes (OAuth2)',
      notes: 'Future integration candidate. Requires OAuth2 app registration.',
    },
    {
      website: 'Eventbrite',
      categories: 'Conferences, Workshops, Networking, Festivals',
      devUrl: 'https://www.eventbrite.com/',
      docsUrl: 'https://www.eventbrite.com/platform/api',
      envVar: 'EVENTBRITE_API_KEY',
      keyValue: 'NOT_CONFIGURED',
      status: 'Not Implemented',
      rateLimit: 'Rate limits apply per OAuth token',
      regRequired: 'Yes (OAuth2)',
      notes: 'Future integration candidate. API access requires app registration.',
    },
    {
      website: 'RSS Feeds',
      categories: 'University, College, Organization events',
      devUrl: 'N/A',
      docsUrl: 'N/A',
      envVar: 'RSS_FEED_URLS',
      keyValue: 'N/A (Public URLs)',
      status: 'Implemented',
      rateLimit: 'N/A',
      regRequired: 'No',
      notes: 'Add comma-separated public RSS feed URLs to .env',
    },
    {
      website: 'ICS Calendar Feeds',
      categories: 'Calendar events, Academic schedules',
      devUrl: 'N/A',
      docsUrl: 'N/A',
      envVar: 'ICS_FEED_URLS',
      keyValue: 'N/A (Public URLs)',
      status: 'Implemented',
      rateLimit: 'N/A',
      regRequired: 'No',
      notes: 'Add comma-separated public ICS calendar URLs to .env',
    },
  ];

  // Full tracker (operational)
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Encore Backend';
  const ws = wb.addWorksheet('API Keys Tracker');

  ws.columns = [
    { header: 'Website/Provider', key: 'website', width: 20 },
    { header: 'Event Categories', key: 'categories', width: 40 },
    { header: 'Official Developer Website', key: 'devUrl', width: 40 },
    { header: 'API Documentation URL', key: 'docsUrl', width: 45 },
    { header: 'Environment Variable Name', key: 'envVar', width: 28 },
    { header: 'API Key Value', key: 'keyValue', width: 25 },
    { header: 'Key Status', key: 'status', width: 18 },
    { header: 'Free Tier/Rate Limit', key: 'rateLimit', width: 35 },
    { header: 'Registration Required', key: 'regRequired', width: 20 },
    { header: 'Notes', key: 'notes', width: 55 },
  ];

  // Style header row
  ws.getRow(1).font = { bold: true, size: 11 };
  ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
  ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
  ws.getRow(1).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  ws.getRow(1).height = 30;

  providers.forEach(p => ws.addRow(p));

  // Alternating row colors
  for (let i = 2; i <= providers.length + 1; i++) {
    const row = ws.getRow(i);
    row.alignment = { vertical: 'middle', wrapText: true };
    if (i % 2 === 0) {
      row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F7FB' } };
    }
  }

  // Auto filter
  ws.autoFilter = { from: 'A1', to: 'J1' };

  await wb.xlsx.writeFile(path.join(__dirname, 'API_Keys_Tracker.xlsx'));
  console.log('Created: docs/API_Keys_Tracker.xlsx');

  // Example version (safe to share - no real keys)
  const wb2 = new ExcelJS.Workbook();
  wb2.creator = 'Encore Backend';
  const ws2 = wb2.addWorksheet('API Keys Tracker');
  ws2.columns = ws.columns;
  ws2.getRow(1).font = { bold: true, size: 11 };
  ws2.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
  ws2.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
  ws2.getRow(1).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  ws2.getRow(1).height = 30;

  providers.forEach(p => {
    ws2.addRow({ ...p, keyValue: p.keyValue === 'NOT_CONFIGURED' ? 'NOT_CONFIGURED' : p.keyValue });
  });

  for (let i = 2; i <= providers.length + 1; i++) {
    const row = ws2.getRow(i);
    row.alignment = { vertical: 'middle', wrapText: true };
    if (i % 2 === 0) {
      row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F7FB' } };
    }
  }
  ws2.autoFilter = { from: 'A1', to: 'J1' };

  await wb2.xlsx.writeFile(path.join(__dirname, 'API_Keys_Tracker.example.xlsx'));
  console.log('Created: docs/API_Keys_Tracker.example.xlsx');
}

generateTracker().catch(console.error);
