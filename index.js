'use strict';

var express = require('express');
var config = require('./config');
var app = express();
var logger = require('./components/logger');
var ncp = require('ncp').ncp;

require('./config/express')(app);
require('./routes')(app);

var config = require('./config');

// In server envs, the node express is behind a proxy (i.e. Apache mod proxy), set the ip-address of
// your trusted reverse proxy server configured as proxy or others.
app.set('trust proxy', 'loopback');


app.listen(config.port, function() {
    console.log('Project Microarray listening on port :' + config.port);
});

// when shutdown signal is received, do graceful shutdown
process.on('SIGINT', function() {
    console.log('gracefully shutting down :)');
    process.exit();
});


// // copy config files into data repo
// ncp.limit = 16;

// ncp(config.configPath, config.uploadPath, function (err) {
//  if (err) {
//    return console.error(err);
//  }
//  console.log('copy configure into data repo done!');
// });



// the code below is for clean data repo, remove when it production.

// var schedule = require('node-schedule');
// var rimraf = require('rimraf');

// var j = schedule.scheduleJob('0 0 0 * * *', function(){
//   logger.info("scheduleJob: clean data start ");
//   console.log("scheduleJob: clean data start ");
//   const { lstatSync, readdirSync } = require('fs')	
//   const { join } = require('path')

//   const isDirectory = source => lstatSync(source).isDirectory()
//   const getDirectories = source =>readdirSync(source).map(name => join(source, name)).filter(isDirectory)
//   //rimraf('/some/directory', function () { console.log('done'); });
//   let dirs = getDirectories("./service/data")
//   for(let d in dirs){
//   	console.log(dirs[d])
//   	logger.info("scheduleJob: clean data done "," folder : ",dirs[d]);
//   	rimraf(dirs[d], function () { 
//   		logger.info("scheduleJob: clean data done ");
//   		console.log("scheduleJob: clean data done ");
//   	 });
//   }
// });