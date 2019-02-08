/**
 * back-end logger for application
 */

'use strict';

 var config = require('../config');
 var winston = require('winston');
 require('winston-daily-rotate-file');
 winston.emitErrs = true;

  var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.DailyRotateFile)({
            filename: config.logDir+'/queue.log',
            datePattern: "yyyy-MM-dd.",
            zippedArchive: false,
            maxSize: '1024m',
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





module.exports = logger;