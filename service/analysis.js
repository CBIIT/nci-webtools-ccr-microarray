express = require('express');
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

    logger.info("API:/upload ");


  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  var pid ="";

  // Emitted whenever a field / value pair has been received.
  form.on('field', function(name, value) {
      if (name == "projectId") {
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
      let data = [];
      data.push("loadCEL"); // action
      data.push(pid);
      data.push(new Array(number_of_files).fill("Ctl"));

      R.execute("wrapper.R",data, function(err,returnValue){
          if(err){
             logger.info("API:/upload result ","status 404 ");
             logger.warn("API:/upload result ","status 404 ", err);
              res.json({status:404, msg:err});
            }
            else{
              logger.info("API:/upload result ","status 200 ");
              res.json({status:200, data:returnValue});
            }
        });
  });
  // parse the incoming request containing the form data
  form.parse(req)
});


router.post('/loadGSE', function(req, res) {
  let data = [];
  //the content in data array should follow the order. Code projectId groups action pDEGs foldDEGs pPathways
  data.push("loadGSE"); // action
  data.push(req.body.projectId);
  data.push(req.body.code); 
  data.push(req.body.groups);
  logger.info("API:/loadGSE ",
              "code:",req.body.code,
              "groups:",req.body.groups,
              "projectId:",req.body.projectId
             );

  R.execute("wrapper.R",data, function(err,returnValue){
          if(err){
              logger.info("API:/loadGSE result ","status 404 ");
              logger.warn("API:/loadGSE result ","status 404 ", err);
              res.json({status:404, msg:err});
            }else{
              logger.info("API:/loadGSE result ","status 200 ");
              res.json({status:200, data:returnValue});
            }
        });
});



router.post('/pathwaysHeapMap', function(req, res) {

  let data = [];
  //the content in data array should follow the order. Code projectId groups action pDEGs foldDEGs pPathways
  data.push("pathwaysHeapMap");
  data.push(req.body.projectId);
  data.push(req.body.group1);
  data.push(req.body.group2);
  data.push(req.body.upOrDown);
  data.push(req.body.pathway_name);

  logger.info("API:/pathwaysHeapMap ",
             "projectId :",req.body.projectId,
             "group_1 :", req.body.group1,
             "group_2 :",req.body.group2,
             "upOrDown :",req.body.upOrDown,
             "pathway_name :",req.body.pathway_name
             );

  R.execute("wrapper.R",data, function(err,returnValue){
          if(err){
              res.json({status:404, msg:err});
            }else{
              res.json({status:200, data:returnValue});
            }
        });
});



router.post('/runContrast', function(req, res) {
  let data = [];
  //the content in data array should follow the order. Code projectId groups action pDEGs foldDEGs pPathways
  data.push("runContrast"); // action
  data.push(req.body.projectId);

  data.push(req.body.code); 
  data.push(req.body.groups);
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

  if(req.body.pDEGs){
    data.push(req.body.pDEGs);
  }

  if(req.body.foldDEGs){
    data.push(req.body.foldDEGs);
  } 
  
  if(req.body.pPathways){
     data.push(req.body.pPathways);
  }

    logger.info("API:/runContrast ",
              "code:",req.body.code,
              "groups:",req.body.groups,
              "pDEGs:",req.body.pDEGs,
              "foldDEGs:",req.body.foldDEGs,
              "pPathways:",req.body.pPathways,
              "group_1:",req.body.group_1,
              "group_2:",req.body.group_2,
              "species:",req.body.species,
              "genSet:",req.body.genSet,
              "pssGSEA:",req.body.pssGSEA,
              "foldssGSEA:",req.body.foldssGSEA,
              "source:",req.body.source
             );


  // using session
  //if it is action is runContrast , then 
  if( req.session.groups&&
      JSON.stringify(req.session.groups)==JSON.stringify(req.body.groups)&&
      req.session.projectId==req.body.projectId&&
      req.session.option==req.body.group_1+req.body.group_2+req.body.genSet
    ){
      logger.info("API:/runContrast ","Contrast uses session ")
      res.json({
                  status:200, 
                  data:filter(req.session.runContrastData,req.body.pDEGs,req.body.foldDEGs,req.body.pPathways,req.body.foldssGSEA,req.body.pssGSEA)
              });

  }else{
       logger.info("API:/runContrast ","Session is not used, run R script; ")
        R.execute("wrapper.R",data, function(err,returnValue){
          if(err){
              res.json({status:404, msg:err});
            }
            else{
                  // store return value in session (deep copy)
                 req.session.runContrastData = returnValue;
                 req.session.option=req.body.group_1+req.body.group_2+req.body.genSet;
                 req.session.groups=req.body.groups;
                 req.session.projectId=req.body.projectId;
                 logger.info("API:/runContrast ","store data in req.session")
                  // filter out data based on the filter
                 if(req.body.actions == "runContrast"){
                      returnValue = filter(returnValue,req.body.pDEGs,req.body.foldDEGs,req.body.pPathways,req.body.foldssGSEA,req.body.pssGSEA);
                 }

              
              res.json({status:200, data:returnValue});
            }
        });
  }
});



function filter(returnValue,pDEGs,foldDEGs,pPathways,foldssGSEA,pssGSEA){
              logger.info("API: function filter ",
                "pDEGs: ",pDEGs,
                "foldDEGs: ",foldDEGs,
                "pPathways: ",pPathways,
                "foldssGSEA: ",foldssGSEA,
                "pssGSEA: ",pssGSEA
                )
               var  workflow ={};
               workflow.diff_expr_genes=[];
               workflow.ssGSEA=[];
               workflow.pathways_up=[];
               workflow.pathways_down=[];
               workflow.listPlots=[];

               var d =returnValue.split("+++ssGSEA+++\"")[1];
               // "/Users/cheny39/Documents/GitHub/nci-webtools-ccr-microarray/service/data/a891ca3a044443b78a8bc3c32fdaf02a/"
               let data_dir = d.substring(0,d.indexOf("{"));
               let list =JSON.parse(decodeURIComponent(d.substring(d.indexOf("{"),d.length)));
               // get plots
               workflow.listPlots=list.norm_celfiles["listData"];
               // filter 
               // deg {RNA_1-Ctl: Array(22690), RNA_2-Ctl: Array(22690)}
               let deg = list.diff_expr_genes.listDEGs;
               for(let i in list.diff_expr_genes.listDEGs){
                  for(let j in deg[i]){
                    if(deg[i][j]["P.Value"]>pDEGs||Math.abs(deg[i][j].FC)<foldDEGs){
                      deg[i].splice(j, 1);
                    }else{
                      workflow.diff_expr_genes.push(deg[i][j]);
                    }
                  }
               }

               //console.log(workflow.diff_expr_genes.length)

               // filter pathway
               let pathway = list.pathways;
               // pathway ={{RNA_1-Ctl: {{upregulated_pathways:array},{downregulated_pathways:array}}}
               for(let i in list.pathways){
                  for( let j in list.pathways[i]["upregulated_pathways"]){
                    if(list.pathways[i]["upregulated_pathways"][j]["P_Value"]>pPathways){
                        list.pathways[i]["upregulated_pathways"].splice(j, 1);
                      }else{
                        workflow.pathways_up.push(list.pathways[i]["upregulated_pathways"][j])
                      }
                  }
                  for(let j in list.pathways[i]["downregulated_pathways"]){
                    if(list.pathways[i]["downregulated_pathways"][j]["P_Value"]>pPathways){
                        list.pathways[i]["downregulated_pathways"].splice(j, 1);
                      }else{
                        workflow.pathways_down.push(list.pathways[i]["downregulated_pathways"][j])
                      }
                  }
               }
               // filter ssGEA
                let ssGSEA = list.ssGSEA.DEss;
                for(let key in ssGSEA){
                  ssGSEA=ssGSEA[key];
                }

                for( let j in ssGSEA){
                      if(Math.abs(ssGSEA[j]["logFC"])<foldssGSEA||lssGSEA[j]["P.Value"]<pssGSEA){
                          ssGSEA.splice(j, 1);
                      }else{
                           workflow.ssGSEA.push(ssGSEA[j]);
                      }
                }


                workflow.ssGSEA=ssGSEA;

               // sort result;
               //objs.sort(function(a,b) {return (a.last_nom > b.last_nom) ? 1 : ((b.last_nom > a.last_nom) ? -1 : 0);} );
               workflow.diff_expr_genes.sort(function(e1,e2){
                  return (e1["P.Value"]<e2["P.Value"]) ? 1 : -1
               })
               workflow.pathways_up.sort(function(e1,e2){
                  return (e1["P_Value"]<e2["P_Value"]) ? 1 : -1
               })

               workflow.pathways_down.sort(function(e1,e2){
                  return (e1["P_Value"]<e2["P_Value"]) ? 1 : -1
               })
               
              workflow.ssGSEA.sort(function(e1,e2){
                    return (e1["P.Value"]<e2["P.Value"]) ? 1 : -1
               })
              


               if(workflow.diff_expr_genes.length>20000){
                workflow.diff_expr_genes=workflow.diff_expr_genes.slice(1, 20000);
               }
               if(workflow.ssGSEA.length>20000){
                workflow.ssGSEA=workflow.ssGSEA.slice(1, 20000);
               }
               if(workflow.pathways_up.length>20000){
                 workflow.pathways_up=workflow.pathways_up.slice(1, 20000);
               }
               if(workflow.pathways_down.length>20000){
                workflow.pathways_down= workflow.pathways_down.slice(1, 20000);
               }


                logger.info("API: function filter result :",
                "workflow.diff_expr_genes.length: ",workflow.diff_expr_genes.length,
                "workflow.ssGSEA.length: ",workflow.ssGSEA.length,
                "workflow.pathways_up.length: ",workflow.pathways_up.length,
                "workflow.pathways_down.length: ",workflow.pathways_down.length
                )
               return workflow;
}






module.exports = router;