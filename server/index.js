'use strict';

var express = require('express');
var config = require('./config');
var app = express();
var fs = require('fs');
require('./routes')(app);

// In server envs, the node express is behind a proxy (i.e. Apache mod proxy), set the ip-address of
// your trusted reverse proxy server configured as proxy or others.
app.set('trust proxy', 'loopback');


const server = app.listen(config.port, function() {
    console.log('Project Microarray listening on port :' + config.port);
});

server.timeout=config.timeout;

let logDirectory = config.development.log_dir;
// ensure log directory exists
fs.existsSync("../"+logDirectory) || fs.mkdirSync("../"+logDirectory);

// when shutdown signal is received, do graceful shutdown
let fileDirectory = config.development.upload_path;
// ensure log directory exists
fs.existsSync("../"+fileDirectory) || fs.mkdirSync("../"+fileDirectory);



process.on('SIGINT', function() {
    console.log('gracefully shutting down :)');
    process.exit();
});