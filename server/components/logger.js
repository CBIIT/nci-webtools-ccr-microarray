/**
 * back-end logger for application
 */

'use strict';

 var config = require('../config');
 var winston = require('winston');
 require('winston-daily-rotate-file');

  var logger = winston.createLogger({
    transports: [
      new (winston.transports.DailyRotateFile)({
            filename: config.logDir+'/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxSize: '1024m',
            maxFiles: '1d'
          }),
       new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            // Structured JSON (no colorize) so Datadog/Fluent Bit can parse the
            // level into status: previously the ANSI color codes leaked into the
            // shipped logs (e.g. "[32minfo[39m") and every line landed as status:info.
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.errors({ stack: true }),
              winston.format.json()
            )
        })
    ],
    exitOnError: false
  });

module.exports = logger;
