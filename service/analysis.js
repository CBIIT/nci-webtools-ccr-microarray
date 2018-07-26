var express = require('express');
var session = require('express-session');
var router = express.Router();
var R = require("../components/R");
var config = require('../config');
var logger = require('../components/logger');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');

router.post('/upload',function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  var pid ="";

  // Emitted whenever a field / value pair has been received.
  form.on('field', function(name, value) {
      console.log(name)
      console.log(value)
      if (name == "projectId") {
            console.log("field")
            console.log(value)
            pid=value;
            form.uploadDir = path.join(__dirname, '/../service/data/'+  value);
             if (!fs.existsSync(form.uploadDir)){
                 fs.mkdirSync(form.uploadDir);
              }else{
                rimraf(form.uploadDir,function (){ fs.mkdirSync(form.uploadDir); });
              }

        }
  });

  var number_of_files=0;


  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    console.log(file.path)
    console.log(file.name)
    number_of_files=number_of_files+1;
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', function(err) {

    res.json({
      status:500,
      data:('An error has occured: \n' + err)
    }); 
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
      console.log("form.on end")
      console.log(number_of_files)
      let data = [];
      data.push("code"); 
      data.push(pid);
      data.push(new Array(number_of_files).fill("Ctl"));
      data.push("loadCEL");
      data.push("req.body.pDEGs");
      data.push("req.body.foldDEGs");
      data.push("req.body.pPathways");
      data.push("req.body.group_1");
      data.push("req.body.group_2");
      data.push("req.body.species");
      data.push("req.body.genSet");
      data.push("req.body.pssGSEA");
      data.push("req.body.foldssGSEA)");
      data.push("upload");

 

      R.execute("caller.R",data, function(err,returnValue){
          if(err){
              res.json({status:404, msg:err});
            }
            else{
              res.json({status:200, data:returnValue});
            }
        });


  });

  // parse the incoming request containing the form data
  form.parse(req)

  
});




router.get('/test', function(req, res) {

  if(req.session.page_views){
      req.session.page_views++;
      res.send("You visited this page " + req.session.page_views + " times");
   } else {
      req.session.page_views = 1;
      res.send("Welcome to this page for the first time!");
   }
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
  data.push(req.body.group_1);
  data.push(req.body.group_2);
  data.push(req.body.species);
  data.push(req.body.genSet);
  data.push(req.body.pssGSEA);
  data.push(req.body.foldssGSEA);
  data.push(req.body.source)

  console.log(data);

  if(req.body.pDEGs){
    data.push(req.body.pDEGs);
  }

  if(req.body.foldDEGs){
    data.push(req.body.foldDEGs);
  } 
  
  if(req.body.pPathways){
     data.push(req.body.pPathways);
  }

  // using session

  //if it is action is runContrast , then group is not changed and gen is not change.
  
  if(req.session.option&&req.session.option==req.body.group_1+req.body.group_2+req.body.species+req.body.genSet){
      res.json({
                  status:200, 
                  data:filter(req.session.runContrastData,req.body.pDEGs,req.body.foldDEGs,req.body.pPathways,req.body.foldssGSEA,req.body.pssGSEA)
              });

  }else{
        console.log("Session not used, run R script; ")
        R.execute("caller.R",data, function(err,returnValue){
          if(err){
              res.json({status:404, msg:err});
            }
            else{
                  // store return value in session (deep copy)
                 req.session.runContrastData = returnValue;
                 req.session.option=req.body.group_1+req.body.group_2+req.body.species+req.body.genSet;
                 console.log("store data in req.session")
                 console.log(req.session.option)

               if(req.body.actions == "runContrast"){
                    returnValue = filter(returnValue,req.body.pDEGs,req.body.foldDEGs,req.body.pPathways,req.body.foldssGSEA,req.body.pssGSEA);
               }
               // filter out data based on the filter
              res.json({status:200, data:returnValue});
            }
        });
  }


});



router.get('/run2', function(req, res) {
  let data = [];
  //the content in data array should follow the order. Code projectId groups action pDEGs foldDEGs pPathways
      data.push("code"); 
      data.push(pid);
      data.push(new Array(3).fill("Ctl"));
      data.push("loadCEL");
      data.push("req.body.pDEGs");
      data.push("req.body.foldDEGs");
      data.push("req.body.pPathways");
      data.push("req.body.group_1");
      data.push("req.body.group_2");
      data.push("req.body.species");
      data.push("req.body.genSet");
      data.push("req.body.pssGSEA");
      data.push("req.body.foldssGSEA)");
      data.push("upload");

  console.log(data);

  if(req.body.pDEGs){
    data.push(req.body.pDEGs);
  }

  if(req.body.foldDEGs){
    data.push(req.body.foldDEGs);
  } 
  
  if(req.body.pPathways){
     data.push(req.body.pPathways);
  }

  // using session

  //if it is action is runContrast , then group is not changed and gen is not change.
  
  if(req.session.option&&req.session.option==req.body.group_1+req.body.group_2+req.body.species+req.body.genSet){
      res.json({
                  status:200, 
                  data:filter(req.session.runContrastData,req.body.pDEGs,req.body.foldDEGs,req.body.pPathways,req.body.foldssGSEA,req.body.pssGSEA)
              });

  }else{
        console.log("Session not used, run R script; ")
        R.execute("caller.R",data, function(err,returnValue){
          if(err){
              res.json({status:404, msg:err});
            }
            else{
                  // store return value in session (deep copy)
                 req.session.runContrastData = returnValue;
                 req.session.option=req.body.group_1+req.body.group_2+req.body.species+req.body.genSet;
                 console.log("store data in req.session")
                 console.log(req.session.option)

               if(req.body.actions == "runContrast"){
                    returnValue = filter(returnValue,req.body.pDEGs,req.body.foldDEGs,req.body.pPathways,req.body.foldssGSEA,req.body.pssGSEA);
               }
               // filter out data based on the filter
              res.json({status:200, data:returnValue});
            }
        });
  }


});


function filter(returnValue,pDEGs,foldDEGs,pPathways,foldssGSEA,pssGSEA){
               console.log("filter")
               console.log(pDEGs);
               console.log(foldDEGs);
               console.log(pPathways);
               console.log(foldssGSEA);
               console.log(pssGSEA);
               var  workflow ={};
               workflow.diff_expr_genes=[];
               workflow.ssGSEA=[];
               workflow.pathways_up=[];
               workflow.pathways_down=[];
               workflow.listPlots=[];


               var d =returnValue.split("+++ssGSEA+++\"")[1];
            
               // "/Users/cheny39/Documents/GitHub/nci-webtools-ccr-microarray/service/data/a891ca3a044443b78a8bc3c32fdaf02a/"
               var data_dir = d.substring(0,d.indexOf("{"));
               let list =JSON.parse(decodeURIComponent(d.substring(d.indexOf("{"),d.length)));

               // get plots

              workflow.listPlots=list.norm_celfiles["listData"];


               // filter 
               // deg {RNA_1-Ctl: Array(22690), RNA_2-Ctl: Array(22690)}

               var deg = list.diff_expr_genes.listDEGs;
               for(var i in list.diff_expr_genes.listDEGs){
                  for(var j in deg[i]){
                    if(deg[i][j]["P.Value"]<pDEGs||deg[i][j].FC<foldDEGs){
                      deg[i].splice(j, 1);
                    }else{
                      workflow.diff_expr_genes.push(deg[i][j]);
                    }
                  }
               }

               console.log(workflow.diff_expr_genes.length)

               // filter pathway
               var pathway = list.pathways;
               // pathway ={{RNA_1-Ctl: {{upregulated_pathways:array},{downregulated_pathways:array}}}
               for(var i in list.pathways){
                  for( var j in list.pathways[i]["upregulated_pathways"]){
                    if(list.pathways[i]["upregulated_pathways"][j]["pval"]<pPathways){
                        list.pathways[i]["upregulated_pathways"].splice(j, 1);
                      }else{
                        workflow.pathways_up.push(list.pathways[i]["upregulated_pathways"][j])
                      }
                  }
                  for(var j in list.pathways[i]["downregulated_pathways"]){
                    if(list.pathways[i]["downregulated_pathways"][j]["pval"]<pPathways){
                        list.pathways[i]["downregulated_pathways"].splice(j, 1);
                      }else{
                        workflow.pathways_down.push(list.pathways[i]["downregulated_pathways"][j])
                      }
                  }
               }

                console.log(workflow.pathways_down.length)

                console.log(workflow.pathways_up.length)


               // filter ssGEA

                var ssGSEA = list.ssGSEA.DEss;
               // pathway ={{RNA_1-Ctl: {{upregulated_pathways:array},{downregulated_pathways:array}}}
               for(var i in pathway){
                  for( var j in ssGSEA[i]){
                    if(list.ssGSEA.DEss[i][j]["logFC"]<foldssGSEA||list.ssGSEA.DEss[i][j]["P.Value"]<pssGSEA){
                        list.ssGSEA.DEss[i].splice(j, 1);
                      }else{
                         workflow.ssGSEA.push(list.ssGSEA.DEss[i][j]);
                      }
                  }
               }

               console.log(workflow.ssGSEA.length)



               // too many record, shows first 2000
               if(workflow.diff_expr_genes.length>2000){
                workflow.diff_expr_genes=workflow.diff_expr_genes.slice(1, 2000);
               }
               if(workflow.ssGSEA.length>2000){
                workflow.ssGSEA=workflow.ssGSEA.slice(1, 2000);
               }
               if(workflow.pathways_up.length>2000){
                 workflow.pathways_up=workflow.pathways_up.slice(1, 2000);
               }
               if(workflow.pathways_down.length>2000){
                workflow.pathways_down= workflow.pathways_down.slice(1, 2000);
               }


               return workflow;
}






module.exports = router;