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
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.simple()
            )
        })
    ],
    exitOnError: false
  });

module.exports = logger;
