/**
 * general configuration
 */

'use strict';

var path = require('path');
var _ = require('lodash');
var argv = require('minimist')(process.argv.slice(2));

var all = {
	
	// Root path of server
    root: path.normalize(__dirname + '/..'),

	//cookie max age in millseconds
	maxAge: 3600000,

	//time to live in the local cache
	object_ttl: 24 * 60 * 60,

	port: argv.p || 8221,

	//cel file max count
    uploadCount: 100
};

module.exports = _.merge(all, require('./template.js'), require('./microarray.setting'));