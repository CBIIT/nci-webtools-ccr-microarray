express = require('express');
var session = require('express-session');
var router = express.Router();
var config = require('../config');



router.get("/",function(req, res) {
     res.json(true);
})


module.exports = router;