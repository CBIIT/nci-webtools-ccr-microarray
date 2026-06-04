/**
 * Worker entry point for ECS RunTask pattern.
 * Invoked as: node worker.js <projectId>
 *
 * Reads params.json from uploadPath/{id}/, runs R contrast analysis,
 * writes status.json updates, and sends completion email.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var config = require('./config');
var R = require('./components/R');
var emailer = require('./components/mail');
var logger = require('./components/logger');

function formatDate(date) {
  var parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'shortOffset',
  }).formatToParts(date);
  var p = {};
  parts.forEach(function (part) { p[part.type] = part.value; });
  var offset = (p.timeZoneName || 'GMT+0').replace('GMT', 'UTC');
  return p.year + '-' + p.month + '-' + p.day + ' ' + p.hour + ':' + p.minute + ':' + p.second + ' ' + p.dayPeriod + ' ' + offset;
}

function writeStatus(projectDir, status) {
  var statusPath = path.join(projectDir, 'status.json');
  fs.writeFileSync(statusPath, JSON.stringify(status, null, 2));
}

function moveInputFilesToError(projectDir, id) {
  try {
    var errorDir = path.join(config.uploadPath, 'error', id);
    if (!fs.existsSync(errorDir)) fs.mkdirSync(errorDir, { recursive: true });
    var entries = fs.readdirSync(projectDir);
    entries.forEach(function (name) {
      var lower = name.toLowerCase();
      if (lower.endsWith('.cel') || lower.endsWith('.cel.gz') || lower.endsWith('.gz')) {
        var src = path.join(projectDir, name);
        var dest = path.join(errorDir, name);
        fs.renameSync(src, dest);
        logger.info('[Worker] Moved input file to error: ' + dest);
      }
    });
  } catch (err) {
    logger.error('[Worker] Failed to move input files to error: ' + err.message);
  }
}

function removeInputFiles(projectDir) {
  try {
    var entries = fs.readdirSync(projectDir);
    entries.forEach(function (name) {
      var lower = name.toLowerCase();
      if (lower.endsWith('.cel') || lower.endsWith('.cel.gz') || lower.endsWith('.gz')) {
        var fullPath = path.join(projectDir, name);
        fs.unlinkSync(fullPath);
        logger.info('[Worker] Removed input file: ' + fullPath);
      }
    });
  } catch (err) {
    logger.error('[Worker] Failed to clean input files: ' + err.message);
  }
}

function removeGSEAheatmap(projectDir) {
  var plot = path.join(projectDir, 'ssgseaHeatmap1.jpg');
  var txt = path.join(projectDir, 'ss_result.txt');
  [plot, txt].forEach(function (file) {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  });
}

function run(id) {
  var projectDir = path.join(config.uploadPath, id);
  var paramsPath = path.join(projectDir, 'params.json');

  if (!fs.existsSync(paramsPath)) {
    logger.error('[Worker] params.json not found: ' + paramsPath);
    process.exit(1);
  }

  var params = JSON.parse(fs.readFileSync(paramsPath, 'utf8'));
  var start = new Date();

  logger.info('[Worker] Starting job ' + id);
  writeStatus(projectDir, {
    id: id,
    status: 'IN_PROGRESS',
    submittedAt: params.submittedAt,
    startedAt: start.toISOString(),
  });

  // Build R args — same order as /runContrast
  var data = [];
  data.push('runContrast');
  data.push(id);
  data.push(config.uploadPath);
  data.push(params.code);
  data.push(params.groups);
  data.push(params.group_1);
  data.push(params.group_2);
  data.push(params.species);
  data.push(params.genSet);
  data.push(params.normal);
  data.push(params.source);
  data.push(config.configPath);
  data.push(params.realGroup);
  data.push(params.index);
  data.push(params.batches);
  data.push(params.chip || '');

  removeGSEAheatmap(projectDir);

  R.execute('wrapper.R', data, function (err, returnValue) {
    var end = new Date();
    var durationSec = Math.round((end - start) / 1000);
    var resultPath = path.join(projectDir, 'result.txt');

    if (!err && fs.existsSync(resultPath)) {
      // Success
      logger.info('[Worker] Job ' + id + ' completed in ' + durationSec + 's');
      writeStatus(projectDir, {
        id: id,
        status: 'COMPLETED',
        submittedAt: params.submittedAt,
        startedAt: start.toISOString(),
        completedAt: end.toISOString(),
        durationSeconds: durationSec,
      });

      removeInputFiles(projectDir);

      // Send success email
      if (params.email) {
        var baseUrl = (config.microarray_link || '').replace(/\/+$/, '');
        var link = baseUrl + '/analysis?' + id;
        var code = '';
        if (params.source === 'fetch') {
          code = '<p>&nbsp;&nbsp;Accession Code: <b>' + params.code + '</b></p>';
        } else {
          code = '<p>&nbsp;&nbsp;CEL Files: <b>' + (params.dataList || []).join(', ') + '</b></p>';
        }
        var subject = 'MicroArray Contrast Results - ' + formatDate(end);
        var html = emailer.emailTemplate(
          code,
          durationSec + ' seconds',
          formatDate(end),
          link,
          formatDate(new Date(params.submittedAt)),
          id
        );
        emailer.sendMail(
          config.mail.web_admin_email,
          params.email,
          subject,
          '',
          html,
          function () {
            logger.info('[Worker] Success email sent to ' + params.email);
            process.exit(0);
          }
        );
        return; // Wait for email callback before exiting
      }

      process.exit(0);
    } else {
      // Failure
      var errorMsg = err ? String(returnValue || 'R execution failed') : 'result.txt not found';
      logger.error('[Worker] Job ' + id + ' failed: ' + errorMsg);
      writeStatus(projectDir, {
        id: id,
        status: 'FAILED',
        submittedAt: params.submittedAt,
        startedAt: start.toISOString(),
        failedAt: end.toISOString(),
        error: errorMsg,
      });

      moveInputFilesToError(projectDir, id);

      // Send failure email
      if (params.email) {
        var code = '';
        if (params.source === 'fetch') {
          code = '<p>&nbsp;&nbsp;Accession Code: <b>' + params.code + '</b></p>';
        } else {
          code = '<p>&nbsp;&nbsp;CEL Files: <b>' + (params.dataList || []).join(', ') + '</b></p>';
        }
        var subject = 'MicroArray Contrast Results - ' + formatDate(end) + ' (FAILED)';
        var html = emailer.emailFailedTemplate(
          code,
          durationSec + ' seconds',
          formatDate(end),
          formatDate(new Date(params.submittedAt)),
          id
        );
        emailer.sendMail(
          config.mail.web_admin_email,
          params.email,
          subject,
          '',
          html,
          function () {
            logger.info('[Worker] Failure email sent to ' + params.email);
            process.exit(1);
          }
        );
        return; // Wait for email callback before exiting
      }

      process.exit(1);
    }
  });
}

// Entry point
var id = process.argv[2];
if (!id) {
  console.error('Usage: node worker.js <projectId>');
  process.exit(1);
}
run(id);
