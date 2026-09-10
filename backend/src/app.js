const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const eventRoutes = require('./routes/eventRoutes');
const organizerRoutes = require('./routes/organizerRoutes');
const internalRoutes = require('./routes/internalRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    database: 'none - text file storage only'
  });
});

app.use('/api', eventRoutes);
app.use('/api/organizer', organizerRoutes);
app.use('/api/internal', internalRoutes);

app.use(errorHandler);

module.exports = app;
