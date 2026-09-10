const express = require('express');
const router = express.Router();
const syncService = require('../services/syncService');

router.get('/events', (req, res) => {
  const filters = {
    category: req.query.category,
    countryCode: req.query.countryCode,
    city: req.query.city,
    source: req.query.source,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    page: req.query.page,
    limit: req.query.limit
  };

  const result = syncService.getEvents(filters);
  res.json(result);
});

router.get('/events/:id', (req, res) => {
  const event = syncService.getEventById(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  res.json(event);
});

module.exports = router;
