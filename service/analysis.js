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

router.get('/run', function(req, res) {
  let data = [];
  data.push("GSE37874");
  data.push("testId");
  data.push(['Ctl','Ctl','Ctl','Ctl','RNA_1','RNA_1','RNA_1','RNA_1','RNA_2','RNA_2','RNA_2','RNA_2']);
  data.push("runContrast");
  if(req.body.pDEGs){
    data.push(req.body.pDEGs);
  }

  if(req.body.foldDEGs){
    data.push(req.body.foldDEGs);
  } 
  
  if(req.body.pPathways){
     data.push(req.body.pPathways);
  }
 
  R.execute("caller.R",data, function(err,returnValue){
    if(err){
        res.json({status:404, msg:err});
      }
      else{
        res.json({status:200, data:returnValue});
      }
  });
});


router.post('/run', function(req, res) {
  let data = [];
  //the content in data array should follow the order. Code projectId groups action pDEGs foldDEGs pPathways
  data.push(req.body.code); 
  data.push(req.body.projectId);
  data.push(req.body.groups);
  data.push(req.body.actions);
  data.push(req.body.pDEGs);
  data.push(req.body.foldDEGs);
  data.push(req.body.pPathways);

  if(req.body.pDEGs){
    data.push(req.body.pDEGs);
  }

  if(req.body.foldDEGs){
    data.push(req.body.foldDEGs);
  } 
  
  if(req.body.pPathways){
     data.push(req.body.pPathways);
  }
 
  R.execute("caller.R",data, function(err,returnValue){
    if(err){
        res.json({status:404, msg:err});
      }
      else{
        res.json({status:200, data:returnValue});
      }
  });
});






module.exports = router;