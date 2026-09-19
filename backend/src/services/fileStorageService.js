const fs = require('fs/promises');
const path = require('path');
const config = require('../config/env');
const logger = require('../config/logger');

const dataDir = path.join(__dirname, '../../data');
const rawDir = path.join(dataDir, 'raw');
const normalizedDir = path.join(dataDir, 'normalized');
const organizerDir = path.join(dataDir, 'organizer');
const quarantineDir = path.join(dataDir, 'quarantine');
const reportsDir = path.join(dataDir, 'reports');

async function ensureDirs() {
  await fs.mkdir(rawDir, { recursive: true });
  await fs.mkdir(normalizedDir, { recursive: true });
  await fs.mkdir(organizerDir, { recursive: true });
  await fs.mkdir(quarantineDir, { recursive: true });
  await fs.mkdir(reportsDir, { recursive: true });
}

ensureDirs().catch(err => logger.error('Failed to create data directories:', err));

async function writeAtomically(filePath, content) {
  const tempPath = `${filePath}.tmp.${Date.now()}`;
  await fs.writeFile(tempPath, content, 'utf8');
  await fs.rename(tempPath, filePath);
}

async function appendToFile(filePath, line) {
  await fs.appendFile(filePath, line + '\n', 'utf8');
}

async function readFileLines(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return data.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return null;
        }
      })
      .filter(obj => obj !== null);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function saveRawSnapshot(source, events) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(rawDir, `${source}_${timestamp}.txt`);
  const content = events.map(e => JSON.stringify(e)).join('\n');
  await writeAtomically(filePath, content);
}

async function saveNormalizedEvents(events) {
  const filePath = path.join(normalizedDir, 'events_latest.txt');
  const content = events.map(e => JSON.stringify(e)).join('\n');
  await writeAtomically(filePath, content);
}

async function saveOrganizerEvent(event) {
  const filePath = path.join(organizerDir, 'organizer_events.txt');
  await appendToFile(filePath, JSON.stringify(event));
}

async function readOrganizerEvents() {
  const filePath = path.join(organizerDir, 'organizer_events.txt');
  return await readFileLines(filePath);
}

async function saveQuarantinedEvents(events) {
  if (!events || events.length === 0) return;
  const date = new Date().toISOString().split('T')[0];
  const filePath = path.join(quarantineDir, `invalid_events_${date}.txt`);
  const content = events.map(e => JSON.stringify(e)).join('\n');
  await appendToFile(filePath, content);
}

async function saveSyncReport(report) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(reportsDir, `sync_report_${timestamp}.txt`);
  await writeAtomically(filePath, JSON.stringify(report, null, 2));
}

async function cleanupOldFiles(directory, retentionDays) {
  try {
    const files = await fs.readdir(directory);
    const now = Date.now();
    for (const file of files) {
      if (file === '.gitkeep') continue;
      const filePath = path.join(directory, file);
      const stat = await fs.stat(filePath);
      const fileAgeDays = (now - stat.mtimeMs) / (1000 * 60 * 60 * 24);
      if (fileAgeDays > retentionDays) {
        await fs.unlink(filePath);
        logger.info(`Retention cleanup: removed ${filePath}`);
      }
    }
  } catch (err) {
    logger.error(`Failed to cleanup ${directory}:`, err);
  }
}

async function runRetentionCleanup() {
  await cleanupOldFiles(rawDir, config.RAW_RETENTION_DAYS || 7);
  await cleanupOldFiles(quarantineDir, config.QUARANTINE_RETENTION_DAYS || 7);
  await cleanupOldFiles(reportsDir, config.REPORT_RETENTION_DAYS || 14);
}

module.exports = {
  writeAtomically,
  appendToFile,
  readFileLines,
  saveRawSnapshot,
  saveNormalizedEvents,
  saveOrganizerEvent,
  readOrganizerEvents,
  saveQuarantinedEvents,
  saveSyncReport,
  cleanupOldFiles,
  runRetentionCleanup
};
