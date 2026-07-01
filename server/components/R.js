	/**
 * component for calling R script
 */

'use strict';

var child_process = require("child_process");
var config = require('../config');
var logger = require('./logger');

var execute = function(file, data, callback){
	let options = {
		env: Object.assign({DIRNAME: config.root}, process.env),
		encoding: "utf8"
	}
	let args =  ["--vanilla", config.root + "/service/"+file, '--args'];
	data.forEach(function(dt){
		args.push(dt);
	});
	logger.info("args:"+args); 
	var child = child_process.spawn("Rscript", args, options);
	var body = '';
	var err_message = '';

	child.stdout.on('data', (d) => {
		body += d.toString('utf8');
		//logger.info("stdout:"+body);
	});


	child.stderr.on('data', (e) => {
		err_message += e.toString('utf8');
		logger.info("stderr:"+err_message);
	});

	child.on('disconnect',()=>{
		logger.info("disconnect with process")

	})

	child.on('error',(err)=>{
		logger.error("R spawn error: " + (err && err.message), {
			file: file,
			name: err && err.name,
			stack: err && err.stack
		});
	})

	child.on('exit',(code, signal)=>{
		logger.info("exit code:"+code);
		logger.info("exit signal:"+signal);
	})


	child.on('close', (code, signal) => {
		logger.info("close code:"+code);
		logger.info("close signal:"+signal);
		if(code!=0){
			// Surface the actual failure so it is filterable in Datadog (status:error).
			// signal is set (e.g. SIGKILL/137) when the worker is killed (OOM / timeout)
			// rather than exiting with an R error, which otherwise leaves no trace.
			logger.error("R script failed", {
				file: file,
				code: code,
				signal: signal,
				stderr: err_message,
				stdoutTail: body.slice(-2000)
			});
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