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

async function cleanup(config) {
  await removeOldEntries(path.resolve(config.uploadPath));
  if (process.env.OUTPUT_FOLDER) {
    await removeOldEntries(path.resolve(process.env.OUTPUT_FOLDER));
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
