var express = require('express'),
    R = require("r-script"),
    app = express(),
    bodyParser = require('body-parser'),
    fs = require('fs');

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
  // short-circuit
  res.send({"showme": 1});
  return next();
  // "Real" code
  R("runXYZ.R")
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

app.get('/getRawhist', function(req, res, next) {
  console.log('/getRawhist');
  R("getRawhist.R")
    .call((err, returnValue) => {
      if (err) return next(err);
      fs.readFile(returnValue,(err,data) => {
        if (err) return next(err);
        res.send(data);
        fs.unlinkSync(returnValue);
      });
    });
});

app.get('/getRmahist', function(req, res, next) {
  console.log('/getRmahist');
  R("getRmahist.R")
    .call((err, returnValue) => {
      if (err) return next(err);
      fs.readFile(returnValue,(err,data) => {
        if (err) return next(err);
        res.send(data);
        fs.unlinkSync(returnValue);
      });
    });
});

app.use((err,req,res,next) => {
  if (err instanceof Error) return next(err);
  res.status(500).send({error: err});
});

app.listen(80);
