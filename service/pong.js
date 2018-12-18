express = require('express');
var session = require('express-session');
var router = express.Router();
var config = require('../config');



router.get("/",function(req, res) {
     res.json(true);
})




router.get("/post",function(req, res) {
      res.json({"status":200,"data":{"totalCount":184}});
});


module.exports = router;