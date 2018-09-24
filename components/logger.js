/**
 * back-end logger for application
 */

'use strict';

 var config = require('../config');
 var winston = require('winston');
 require('winston-daily-rotate-file');
 winston.emitErrs = true;

 console.log(config.logDir)

  var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.DailyRotateFile)({
            filename: config.logDir+'/application.log',
            datePattern: "yyyy-MM-dd.",
            zippedArchive: false,
            maxSize: '20m',
            timestamp: true,
            maxFiles: '1d',
            prepend: true
          }),
       new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
  });

  logger.info('Hello World!');




module.exports = logger;