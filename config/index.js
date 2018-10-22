/**
 * general configuration
 */

'use strict';

var path = require('path');
var _ = require('lodash');
var argv = require('minimist')(process.argv.slice(2));
var setting = require('./microarray_setting.json');
var fs = require('fs');

let configure = {

    // Server port
    logDir: path.normalize(__dirname + '/../../') + setting.development.log_dir,

    //cel file upload path
    uploadPath: path.normalize(__dirname + '/../../') + setting.development.upload_path,

    configPath: path.normalize(__dirname + '/../../') + setting.development.config_path

};


// check dir

if (!fs.existsSync(configure.logDir)) {
    fs.mkdirSync(configure.logDir);
}
if (!fs.existsSync(configure.uploadPath)) {
    fs.mkdirSync(configure.uploadPath);
}
if (!fs.existsSync(configure.configPath)) {
    fs.mkdirSync(configure.configPath);
}



var all = {

    // Root path of server
    root: path.normalize(__dirname + '/..'),

    //time to live in the local cache
    object_ttl: 24 * 60 * 60,

    port: argv.p || 9220,

    //cel file max count
    uploadCount: 100
};



module.exports = _.merge(all, require('./template.js'), configure);