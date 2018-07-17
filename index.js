'use strict';

var express = require('express');
var config = require('./config');
var app = express();

require('./config/express')(app);
require('./routes')(app);

app.listen(config.port, function(){
  console.log('Project Microarray listening on port :' + config.port);
});

// when shutdown signal is received, do graceful shutdown
process.on( 'SIGINT', function(){
    console.log( 'gracefully shutting down :)' );
    process.exit();
});
