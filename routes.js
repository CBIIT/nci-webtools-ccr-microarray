/**
 * Main application routes
 */

'use strict';
var express = require('express');
var m_analysis = require('./service/analysis');
var m_common = require('./service/common');
var config = require('./config');
var path = require('path');

module.exports = function(app){

	//allows CrossDomainAccess to API
	app.use(function(req, res, next){
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

		if(next){
			next();
		}
	});

	app.use('/api/', m_common);
	app.use('/api/analysis', m_analysis);


	//Serves all the request which includes /images in the url from Images folder
	app.use('/images', express.static(config.uploadPath));
	
	// All other routes should redirect to error page
    app.get('/*', function (req, res) {
	  res.sendFile(path.join(config.root, 'client/www', 'index.html'));
	});
};