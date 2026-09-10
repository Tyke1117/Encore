'use strict';
const logger = require('../config/logger');

function errorHandler(err, req, res, _next) {
  logger.error(err.message, { stack: err.stack });
  const status = err.statusCode || 500;
  res.status(status).json({
    error: true,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
}

module.exports = errorHandler;
