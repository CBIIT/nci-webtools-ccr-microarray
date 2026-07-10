/**
 * Configuration module
 *
 * Reads from environment variables first (matching ECS task definition template),
 * falls back to microarray_setting.json for local dev.
 */

'use strict';

var path = require('path');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

// Load JSON config as fallback defaults
var setting = {};
try {
    setting = require('./microarray_setting.json');
} catch (e) {
    // JSON config not found — environment variables must provide all values
}

var env = process.env;
var devSetting = setting.development || {};
var mailSetting = setting.mail || {};

// Resolve directory paths — env vars can be absolute (/data/input) or relative (tmp)
function resolveDir(envVal, jsonVal, fallback) {
    var val = envVal || jsonVal || fallback;
    if (path.isAbsolute(val)) return val;
    return path.normalize(__dirname + '/../../') + val;
}

var logDir = resolveDir(env.LOG_DIR, devSetting.log_dir, 'log');
var uploadPath = resolveDir(env.INPUT_FOLDER, devSetting.upload_path, 'tmp');
var configPath = resolveDir(env.DATA_FOLDER, devSetting.config_path, 'data');

// Ensure directories exist
[logDir, uploadPath, configPath].forEach(function (dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

module.exports = {
    // Root path of server
    root: path.normalize(__dirname + '/..'),

    // Server
    port: argv.p || parseInt(env.APP_PORT, 10) || 9220,
    timeout: parseInt(env.APP_TIMEOUT, 10) || setting.timeout || 300000,

    // Time to live in the local cache
    object_ttl: 24 * 60 * 60,

    // CEL file max count
    uploadCount: 100,

    // Local cache entry expire time
    cache_ttl: 12 * 3600,

    // Directories
    logDir: logDir,
    uploadPath: uploadPath,
    configPath: configPath,

    // Worker
    workerType: env.WORKER_TYPE || 'local',

    // Application
    tier: env.APP_TIER || 'dev',
    microarray_link: env.APP_BASE_URL || setting.microarray_link,

    // Email (ECS template names: EMAIL_SMTP_HOST, EMAIL_SMTP_PORT, EMAIL_ADMIN)
    mail: {
        host: env.EMAIL_SMTP_HOST || mailSetting.host,
        port: parseInt(env.EMAIL_SMTP_PORT, 10) || mailSetting.port || 25,
        web_admin_email: env.EMAIL_ADMIN || mailSetting.web_admin_email,
        support_email: env.MAIL_SUPPORT_EMAIL || mailSetting.support_email,
        tls: {
            rejectUnauthorized: (mailSetting.tls && mailSetting.tls.rejectUnauthorized) || false
        }
    }
};
