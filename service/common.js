var express = require('express');
var router = express.Router();
var fs = require('fs');
var config = require('../config');

router.get('/', function(req, res, next) {
    res.json({ status: 200, data: 'Welcome to CEDCD API Center.' });
});

module.exports = router;