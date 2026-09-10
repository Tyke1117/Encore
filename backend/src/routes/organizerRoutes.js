const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const organizerAuth = require('../middleware/organizerAuth');
const { createCanonicalEvent, validateEvent } = require('../utils/eventNormalization');
const fileStorageService = require('../services/fileStorageService');

router.use(organizerAuth);

router.post('/events', async (req, res) => {
  try {
    const body = req.body;
    const externalId = uuidv4();
    
    const canonicalEvent = createCanonicalEvent({
      ...body,
      source: 'encore',
      sourceType: 'organizer',
      organizerId: req.organizerId,
      externalId: externalId,
      status: body.status || 'published',
    });
    
    const { valid, errors } = validateEvent(canonicalEvent);
    
    if (!valid) {
      return res.status(400).json({ error: true, message: 'Validation failed', errors });
    }
    
    await fileStorageService.saveOrganizerEvent(canonicalEvent);
    
    console.log(`[ORGANIZER EVENT CREATED] ${canonicalEvent.title} (ID: ${canonicalEvent.id}, Organizer: ${req.organizerId})`);
    
    res.status(201).json(canonicalEvent);
  } catch (err) {
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

module.exports = router;
