'use strict';

var express = require('express');
var config = require('./config');
var { startCron } = require('./services/cron');
var app = express();
require('./routes')(app);

// In server envs, the node express is behind private-network proxies (ALB, and the
// Next.js frontend container which proxies /api). Trust loopback and private-range
// hops so req.ip resolves to the real client address — express-rate-limit keys on it.
app.set('trust proxy', 'loopback, linklocal, uniquelocal');


const server = app.listen(config.port, function() {
    console.log('Project Microarray listening on port :' + config.port);
});

server.timeout=config.timeout;

startCron(config);



process.on('SIGINT', function() {
    console.log('gracefully shutting down :)');
    process.exit();
});