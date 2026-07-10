'use strict';

const path = require('path');
const { readdir, stat, rm } = require('fs/promises');
const { CronJob } = require('cron');

const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

async function removeOldEntries(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err) {
    console.error(`Failed to read directory ${dir}: ${err.message}`);
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    try {
      const { mtimeMs } = await stat(fullPath);
      if (Date.now() - mtimeMs > MAX_AGE_MS) {
        await rm(fullPath, { recursive: true, force: true });
        console.log(`Removed: ${fullPath}`);
      }
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error(`Failed to remove ${fullPath}: ${err.message}`);
      }
    }
  }
}

function isSafePath(dir) {
  if (!dir || typeof dir !== 'string' || !dir.trim()) return false;
  const resolved = path.resolve(dir);
  // Require at least 2 path segments (e.g. /data/input) — reject / or single-level paths
  return resolved.split(path.sep).filter(Boolean).length >= 2;
}

async function cleanup(config) {
  const uploadPath = path.resolve(config.uploadPath);
  if (!isSafePath(uploadPath)) {
    console.error(`Refusing cleanup: unsafe uploadPath "${config.uploadPath}"`);
  } else {
    await removeOldEntries(uploadPath);
  }

  if (process.env.OUTPUT_FOLDER) {
    const outputPath = path.resolve(process.env.OUTPUT_FOLDER);
    if (!isSafePath(outputPath)) {
      console.error(`Refusing cleanup: unsafe OUTPUT_FOLDER "${process.env.OUTPUT_FOLDER}"`);
    } else {
      await removeOldEntries(outputPath);
    }
  }
}

function startCron(config) {
  const job = new CronJob(
    '0 12 * * *',
    async () => {
      console.log('Starting cleanup of expired jobs');
      try {
        await cleanup(config);
        console.log('Cleanup complete');
      } catch (err) {
        console.error(`Cleanup failed: ${err.message}`);
      }
    },
    null,
    true,
    'America/New_York'
  );
  console.log('Cron job scheduled: cleanup expired data daily at 12:00 PM ET');
  return job;
}

module.exports = { startCron };
