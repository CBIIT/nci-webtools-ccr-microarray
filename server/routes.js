/**
 * Main application routes
 */

"use strict";
var express = require("express");
var m_analysis = require("./service/analysis");
var config = require("./config");

var session = require("./components/session");
//var session =require("express-session");
var FastSessionStore = require("./components/fastsessionstore")(session);

module.exports = function (app) {
  //Serves all the request which includes /images in the url from Images folder
  app.use("/images", express.static(config.uploadPath));

  // app.use(bodyParser.urlencoded({
  //     limit: '40mb', // 100kb default is too small
  //     extended: false
  // }));
  app.use(
    express.json({
      limit: "40mb", // 100kb default is too small
    }),
  );

  app.use(
    session({
      store: new FastSessionStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      secret: "microarray token",
      cookie: { maxAge: null },
      resave: true,
      saveUninitialized: true,
    }),
  );

  //app.use(cookieParser());

  // app.use((req, res, next) => {
  //     req.session = locals;
  //     next();
  // })

  app.use("/api/analysis", m_analysis);

  app.use("/api/ping", async (req, res) => res.json(true));

  //allows CrossDomainAccess to API
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (next) {
      next();
    }
  });

  // All other routes should redirect to error page
  app.get("/*", function (req, res) {});
};
