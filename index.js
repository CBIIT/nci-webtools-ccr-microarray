var express = require('express'),
    R = require("r-script"),
    app = express(),
    bodyParser = require('body-parser');

app.use([bodyParser.json(),bodyParser.urlencoded({extended: true})]);
app.use(express.static('web'));

app.post('/GSE', function(req, res, next) {
  console.log('/GSE');
  var returnValue = JSON.parse(decodeURI(R("runGSE.R")
    .data(JSON.stringify(req.body))
    .callSync()));
  if (returnValue.error === undefined) {
    res.send(returnValue['saveValue']);
  } else {
    return next(returnValue.error.statusMessage);
  }
});

app.post('/runXYZ', function(req, res, next) {
  console.log('/runXYZ');
  var returnValue = decodeURI(R("runXYZ.R")
    .data(JSON.stringify(req.body))
    .callSync());
  returnValue = JSON.parse(returnValue);
  if (returnValue.error === undefined) {
    res.send(returnValue['saveValue']);
  } else {
    return next(returnValue.error.statusMessage);
  }
});


app.use((err,req,res,next) => {
  if (err instanceof Error) return next(err);
  res.status(500).send({error: err});
});

app.listen(80);
