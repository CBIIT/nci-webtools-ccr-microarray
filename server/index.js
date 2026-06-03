'use strict';

var express = require('express');
var config = require('./config');
var { startCron } = require('./services/cron');
var app = express();
require('./routes')(app);

// In server envs, the node express is behind a proxy (i.e. Apache mod proxy), set the ip-address of
// your trusted reverse proxy server configured as proxy or others.
app.set('trust proxy', 'loopback');


const server = app.listen(config.port, function() {
    console.log('Project Microarray listening on port :' + config.port);
});

server.timeout=config.timeout;

startCron(config);



process.on('SIGINT', function() {
    console.log('gracefully shutting down :)');
    process.exit();
});