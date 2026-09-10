const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const router = express.Router();
const internalAuth = require('../middleware/internalAuth');
const ingestionService = require('../services/ingestionService');
const syncService = require('../services/syncService');

router.use(internalAuth);

router.post('/sync', async (req, res, next) => {
  try {
    const stats = await ingestionService.runFullSync();
    await syncService.refreshCache();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

router.get('/sync/status', (req, res) => {
  res.json(ingestionService.getSyncStatus());
});

router.get('/sources', (req, res) => {
  res.json(syncService.getSourcesStatus());
});

router.get('/reports/latest', async (req, res, next) => {
  try {
    const reportsDir = path.join(__dirname, '../../data/reports');
    const files = await fs.readdir(reportsDir);
    const reportFiles = files.filter(f => f.startsWith('sync_report_')).sort().reverse();
    
    if (reportFiles.length === 0) {
      return res.status(404).json({ error: 'No reports found' });
    }
    
    const latestFile = path.join(reportsDir, reportFiles[0]);
    const content = await fs.readFile(latestFile, 'utf8');
    res.json(JSON.parse(content));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
