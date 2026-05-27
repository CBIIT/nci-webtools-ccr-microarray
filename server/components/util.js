/**
 * general utilities
 */

'use strict';
var config = require('../config');
var logger = require('./logger');
var fs = require('fs');


function file(name) {
    return fs.createWriteStream(__dirname + '/' + name);
}

/**
 * id rules:
 * timestamp in milliseconds (last 9 digits) + MMDDYY + random number from 0 to 9 
*/
var generateId = function(){
	let result = "";
	let ts = Date.now();
	let now = new Date();
	let ds = String(now.getMonth()+1).padStart(2,'0')
		+ String(now.getDate()).padStart(2,'0')
		+ String(now.getFullYear()).slice(-2);
	let rd = Math.floor(Math.random() * 10);
	result = "" + ts;
	result = result.substr(4);
	logger.debug(result);

	result += ds + rd;
	return result;
};


//get timestamp in seconds
var getTimestamp = function(){
	return Math.floor(Date.now() / 1000);
};

module.exports = {
	generateId,
	getTimestamp
};