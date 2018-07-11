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
  data.push(req.body.pid);
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
  data.push(req.body.projectID);
  data.push(req.body.groups);
  data.push(req.body.pDEGs);
  data.push(req.body.foldDEGs);
  data.push(req.body.pPathways);

  R.execute("calc.R",data, function(err,returnValue){
     if(err){
         res.json({status:404, msg:err});
       }
       else{
         console.log(returnValue);
        returnValue=returnValue.split("&&##$$")[1].trim();
        returnValue = returnValue.substring(2,returnValue.length);
        console.log("After Change");
        console.log(returnValue);
        let dc = JSON.parse(decodeURI(returnValue));
         res.json({status:200, data:returnValue});
       }
  });
});




module.exports = router;