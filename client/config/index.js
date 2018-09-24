/**
 * general configuration
 */

'use strict';

var path = require('path');
var _ = require('lodash');
var argv = require('minimist')(process.argv.slice(2));


module.exports = _.merge(require('../../../config/microarray.settings'));