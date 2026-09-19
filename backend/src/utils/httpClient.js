'use strict';
const axios = require('axios');
const logger = require('../config/logger');

const DEFAULT_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;

/**
 * Sleep helper with optional jitter
 */
function sleep(ms) {
  const jitter = Math.random() * ms * 0.3; // up to 30% jitter
  return new Promise(resolve => setTimeout(resolve, ms + jitter));
}

/**
 * Make an HTTP request with timeout, retry, exponential backoff, and 429 handling.
 * @param {string|object} config - URL string or Axios request config
 * @param {object} [options] - { maxRetries, timeout }
 * @returns {Promise<any>} - Returns response.data
 */
async function httpGet(config, options = {}) {
  const maxRetries = options.maxRetries ?? MAX_RETRIES;
  const timeout = options.timeout ?? DEFAULT_TIMEOUT;
  const requestConfig = typeof config === 'string' ? { url: config } : config;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios({
        method: 'GET',
        timeout,
        ...requestConfig,
      });
      return response.data;
    } catch (err) {
      const status = err.response?.status;

      // If rate limited, respect Retry-After
      if (status === 429) {
        const retryAfter = parseInt(err.response?.headers?.['retry-after'], 10);
        const waitMs = retryAfter ? retryAfter * 1000 : Math.pow(2, attempt) * 1000;
        logger.warn(`HTTP 429 rate limited. Waiting ${waitMs}ms before retry (attempt ${attempt + 1}/${maxRetries})`);
        if (attempt < maxRetries) {
          await sleep(waitMs);
          continue;
        }
      }

      // Retry on server errors or timeouts
      if (attempt < maxRetries && (status >= 500 || err.code === 'ECONNABORTED' || err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT')) {
        const backoff = Math.pow(2, attempt) * 1000;
        logger.warn(`HTTP request failed (${status || err.code}). Retrying in ${backoff}ms (attempt ${attempt + 1}/${maxRetries})`);
        await sleep(backoff);
        continue;
      }

      // Non-retryable error
      throw err;
    }
  }
}

module.exports = { httpGet, sleep };
