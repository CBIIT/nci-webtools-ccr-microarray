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
		//logger.info("stdout:"+body);
	});


	child.stderr.on('data', (e) => {
		err_message += e.toString('utf8');
		//logger.info("stderr:"+err_message);
	});

	child.on('disconnect',()=>{
		logger.info("disconnect with process")

	})

	child.on('error',(Error)=>{
		logger.info(Error.prototype.message)
		logger.info(Error.prototype.name)

	})

	child.on('exit',(code, signal)=>{
		logger.info("exit code:"+code);
		logger.info("exit signal:"+signal);
	})


	child.on('close', (code, signal) => {
		logger.info("close code:"+code);
		logger.info("close signal:"+signal);
		if(code!=0){
			callback(true, err_message);
		}
		else{
			callback(false, body);
		}
	});
};

module.exports = {
	execute
};