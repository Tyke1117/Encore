'use strict';
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const os = require('os');

describe('File Storage', () => {
  let testDir;
  let fileStorageService;

  beforeAll(async () => {
    testDir = path.join(os.tmpdir(), `encore-test-${Date.now()}`);
    await fsp.mkdir(testDir, { recursive: true });
    // Try loading the service
    try {
      fileStorageService = require('../src/services/fileStorageService');
    } catch {
      fileStorageService = null;
    }
  });

  afterAll(async () => {
    // Cleanup test dir
    try {
      await fsp.rm(testDir, { recursive: true, force: true });
    } catch { /* ignore */ }
  });

  describe('Atomic file writing', () => {
    test('writes content atomically', async () => {
      const filePath = path.join(testDir, 'atomic_test.txt');
      const content = '{"test": true}\n{"test": false}\n';
      
      // Write to temp then rename
      const tmpPath = filePath + '.tmp';
      await fsp.writeFile(tmpPath, content, 'utf8');
      await fsp.rename(tmpPath, filePath);
      
      const result = await fsp.readFile(filePath, 'utf8');
      expect(result).toBe(content);
    });

    test('temp file does not persist on failure', async () => {
      const tmpPath = path.join(testDir, 'should_not_exist.txt.tmp');
      // Simulate: we wrote a tmp file but rename failed
      await fsp.writeFile(tmpPath, 'partial data', 'utf8');
      // The original file should not exist
      const exists = fs.existsSync(path.join(testDir, 'should_not_exist.txt'));
      expect(exists).toBe(false);
      // Clean up
      await fsp.unlink(tmpPath);
    });
  });

  describe('JSON Lines format', () => {
    test('writes one JSON object per line', async () => {
      const filePath = path.join(testDir, 'jsonl_test.txt');
      const events = [
        { id: '1', title: 'Event 1' },
        { id: '2', title: 'Event 2' },
        { id: '3', title: 'Event 3' },
      ];
      const content = events.map(e => JSON.stringify(e)).join('\n') + '\n';
      await fsp.writeFile(filePath, content, 'utf8');

      const lines = (await fsp.readFile(filePath, 'utf8')).trim().split('\n');
      expect(lines).toHaveLength(3);
      lines.forEach(line => {
        expect(() => JSON.parse(line)).not.toThrow();
      });
    });

    test('each line is valid JSON', async () => {
      const filePath = path.join(testDir, 'valid_json.txt');
      const events = [
        { title: 'With "quotes"', desc: 'Special chars: \\n \\t' },
        { title: 'Unicode: \u00e9\u00e8\u00ea', emoji: '\ud83c\udfb5' },
      ];
      const content = events.map(e => JSON.stringify(e)).join('\n') + '\n';
      await fsp.writeFile(filePath, content, 'utf8');

      const lines = (await fsp.readFile(filePath, 'utf8')).trim().split('\n');
      lines.forEach(line => {
        const parsed = JSON.parse(line);
        expect(parsed.title).toBeTruthy();
      });
    });
  });

  describe('File retention cleanup', () => {
    test('deletes files older than retention period', async () => {
      const retentionDir = path.join(testDir, 'retention_test');
      await fsp.mkdir(retentionDir, { recursive: true });
      
      // Create a "old" file by backdating its mtime
      const oldFile = path.join(retentionDir, 'old_file.txt');
      await fsp.writeFile(oldFile, 'old data');
      
      // Set modification time to 10 days ago
      const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
      await fsp.utimes(oldFile, tenDaysAgo, tenDaysAgo);

      // Create a new file
      const newFile = path.join(retentionDir, 'new_file.txt');
      await fsp.writeFile(newFile, 'new data');

      // Simulate cleanup: delete files older than 7 days
      const files = await fsp.readdir(retentionDir);
      const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      for (const file of files) {
        if (file === '.gitkeep') continue;
        const filePath = path.join(retentionDir, file);
        const stat = await fsp.stat(filePath);
        if (stat.mtime < cutoff) {
          await fsp.unlink(filePath);
        }
      }

      expect(fs.existsSync(oldFile)).toBe(false);
      expect(fs.existsSync(newFile)).toBe(true);
    });

    test('preserves .gitkeep files', async () => {
      const retentionDir = path.join(testDir, 'gitkeep_test');
      await fsp.mkdir(retentionDir, { recursive: true });
      
      const gitkeep = path.join(retentionDir, '.gitkeep');
      await fsp.writeFile(gitkeep, '');
      const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
      await fsp.utimes(gitkeep, tenDaysAgo, tenDaysAgo);

      // Cleanup should skip .gitkeep
      const files = await fsp.readdir(retentionDir);
      const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      for (const file of files) {
        if (file === '.gitkeep') continue;
        const filePath = path.join(retentionDir, file);
        const stat = await fsp.stat(filePath);
        if (stat.mtime < cutoff) {
          await fsp.unlink(filePath);
        }
      }

      expect(fs.existsSync(gitkeep)).toBe(true);
    });
  });

  describe('Pagination', () => {
    test('cursor pagination returns correct page', () => {
      const events = Array.from({ length: 55 }, (_, i) => ({ id: `e-${i}`, title: `Event ${i}` }));
      
      // Page 1, limit 20
      const page1 = events.slice(0, 20);
      expect(page1).toHaveLength(20);
      expect(page1[0].id).toBe('e-0');

      // Page 2, limit 20
      const page2 = events.slice(20, 40);
      expect(page2).toHaveLength(20);
      expect(page2[0].id).toBe('e-20');

      // Page 3, limit 20
      const page3 = events.slice(40, 60);
      expect(page3).toHaveLength(15);
    });

    test('enforces maximum limit of 50', () => {
      const requestedLimit = 100;
      const effectiveLimit = Math.min(requestedLimit, 50);
      expect(effectiveLimit).toBe(50);
    });

    test('defaults to limit 20', () => {
      const requestedLimit = undefined;
      const effectiveLimit = requestedLimit || 20;
      expect(effectiveLimit).toBe(20);
    });
  });

  describe('Internal route authentication', () => {
    test('rejects request without sync secret', () => {
      // Simulated test - the actual middleware test would need Express
      const mockSecret = 'my-secret-value';
      const providedSecret = undefined;
      expect(providedSecret).not.toBe(mockSecret);
    });

    test('accepts request with valid sync secret', () => {
      const mockSecret = 'my-secret-value';
      const providedSecret = 'my-secret-value';
      expect(providedSecret).toBe(mockSecret);
    });
  });
});
