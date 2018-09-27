/**
 * component for calling R script
 */

'use strict';

var _ = require("underscore"),
    child_process = require("child_process");
var config = require('../config');
var logger = require('./logger');

var execute = function(file, data, callback){
	let options = {
		env: _.extend({DIRNAME: config.root}, process.env),
		encoding: "utf8"
	}
	let args =  ["--vanilla", config.root + "/service/"+file, '--args'];
	data.forEach(function(dt){
		args.push(dt);
	});
	var child = child_process.spawn("Rscript", args, options);
	var body = '';
	var err_message = '';

	child.stdout.on('data', (d) => {
		body += d.toString('utf8');
	});

	child.stderr.on('data', (e) => {
		err_message += e.toString('utf8');
		logger.info("stderr:"+data);
	});

	child.on('close', (code) => {
		logger.info("code:"+code);
		if(code > 0){
			callback(body, {});
		}
		else{
			callback(null, err_message);
		}
	});
};

module.exports = {
	execute
};