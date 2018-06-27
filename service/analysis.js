var express = require('express');
var router = express.Router();
var R = require("../components/R");
var config = require('../config');
var logger = require('../components/logger');

router.post('/upload',function(req, res){
  let dt = {};
  dt.list = [];
  res.json({
    status:200,
    data:dt
  });
});

router.post('/gse', function(req, res) {
  let data = [];
  data.push(req.body.code);
  R.execute("processGEOfiles.R",data, function(err,returnValue){
    if(err){
        res.json({status:404, msg:err});
      }
      else{
        let dc = JSON.parse(decodeURI(returnValue));
        res.json({status:200, data:dc});
      }
  });
});

router.post('/runContrast', function(req, res) {
  let data = [];
  data.push(req.body.code);
  data.push(req.body.groups.join(","));
  console.log(req.body.groups.join(","));
  R.execute("runContrast.R",data, function(err,returnValue){
    if(err){
        res.json({status:404, msg:err});
      }
      else{
        console.log(returnValue);
        let dc = returnValue;
        res.json({status:200, data:dc});
      }
  });
});


module.exports = router;