var express = require('express'),
    R = require("r-script"),
    app = express(),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    argv = require('minimist')(process.argv.slice(2));

app.use([bodyParser.json(),bodyParser.urlencoded({extended: true})]);
app.use(express.static('web'));

app.post('/GSE', function(req, res, next) {
  console.log('/GSE');
  R("runGSE.R")
    .data(JSON.stringify(req.body))
    .call((err,returnValue) => {
      returnValue = JSON.parse(decodeURI(returnValue));
      if (returnValue.error === undefined) {
        res.send(returnValue['saveValue']);
      } else {
        return next(returnValue.error.statusMessage);
      }
    });
});

app.post('/runXYZ', function(req, res, next) {
  console.log('/runXYZ');
  R("runXYZ.R")
//    .data(JSON.stringify(req.body))
    .call((err,returnValue) => {
      fs.readFile(returnValue,(err,data) => {
        data = JSON.parse(decodeURI(data));
        if (data.error === undefined) {
          res.send(data['saveValue']);
        } else {
          return next(data.error.statusMessage);
        }
        fs.unlinkSync(returnValue);
      });
    });
});

app.use((err,req,res,next) => {
  if (err instanceof Error) return next(err);
  res.status(500).send({error: err});
});

app.listen(argv.p||80);
