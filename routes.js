/**
 * Main application routes
 */

'use strict';
var express = require('express');
var m_analysis = require('./service/analysis');
var m_ping = require('./service/ping');
var m_pong = require('./service/pong');
var m_common = require('./service/common');
var config = require('./config');
var path = require('path');


var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');


var session = require('express-session');
var MemoryStore = require('memorystore')(session)
var RedisStore = require('connect-redis')(session);
var redis = require('redis');


var NodeCache = require("node-cache");
var myCache = new NodeCache({ stdTTL: config.cache_ttl, checkperiod: 120 });


module.exports = function(app) {

    let obj = { my: "Special", variable: 42 };
    myCache.set("myKey", obj);


    app.use(express.static(path.join(config.root, 'client/www')));





    // app.use(bodyParser.urlencoded({
    //     limit: '40mb', // 100kb default is too small
    //     extended: false
    // }));
    app.use(bodyParser.json({
        limit: '40mb' // 100kb default is too small
    }));

    //app.use(cookieParser());
    app.use(compression());
    //app.use(methodOverride());
    app.use('/ping', m_ping);

    // app.use(session({
    //     store: new MemoryStore({
    //         checkPeriod: 86400000 // prune expired entries every 24h
    //     }),
    //     secret: 'microarray token',
    //     resave: true,
    //     saveUninitialized: true
    // }));
    const options = {
        host: '127.0.0.1',
        port: '6379'
    }
    app.use(session({
        store: new RedisStore(options),
        secret: 'password',
        resave: false,
        saveUninitialized: false
    }));



    app.use('/pong', m_pong);



    app.use('/api/analysis', m_analysis);


    //Serves all the request which includes /images in the url from Images folder
    app.use('/images', express.static(config.uploadPath));


    // //allows CrossDomainAccess to API
    // app.use(function(req, res, next){
    //  res.header('Access-Control-Allow-Origin', '*');
    //  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    //  if(next){
    //      next();
    //  }
    // });



    // All other routes should redirect to error page
    app.get('/*', function(req, res) {
        // res.sendFile(path.join(config.root, 'client/www', 'error.html'));
    });



};