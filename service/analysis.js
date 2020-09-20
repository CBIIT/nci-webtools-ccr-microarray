var express = require('express');
var session = require('express-session');
var router = express.Router();
var R = require('../components/R');
var config = require('../config');
var logger = require('../components/logger');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var queue = require('../components/queue');
const AWS = require('aws-sdk');
var dateFormat = require('dateformat');
var emailer = require('../components/mail');

//use for generate UUID
function uuidv4() {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// remove previous result.
// ssgseaHeatmap1.jpg
function removeGSEAheatmap(uploadPath, projectId) {
  const localPath = uploadPath + '/' + projectId;
  const plot = path.resolve(localPath + '/ssgseaHeatmap1.jpg');
  const txt = path.resolve(localPath + '/ss_result.txt');

  [plot, txt].map((file) => {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  });
}

function validate(id) {
  const regex = new RegExp(/^[a-z0-9]{32}$/i);
  return regex.test(id);
}

function restoreSession(req, path) {
  let returnValue = fs.readFileSync(path, 'utf8');
  let re = JSON.parse(returnValue);
  if (re.GSM) {
    // store return value in session (deep copy)
    req.session[req.body.projectId] = JsonToObject(re);
    req.session[req.body.projectId].option =
      req.session[req.body.projectId].group_1 +
      req.session[req.body.projectId].group_2 +
      req.session[req.body.projectId].genSet;
    req.session[req.body.projectId].groups =
      req.session[req.body.projectId].groups;

    if (req.session[req.body.projectId].groups[0].indexOf('@') != -1) {
      req.session[req.body.projectId].groups = req.session[
        req.body.projectId
      ].groups[0].split('@');
    }

    req.session[req.body.projectId].projectId =
      req.session[req.body.projectId].projectId;
    logger.info('store data in req.session');
    logger.info('req.session[req.body.projectId].hisBefore');
    logger.info(req.session[req.body.projectId].hisBefore);
    logger.info('Get Contrast result success');
    return {
      source: req.session[req.body.projectId].source,
      histplotBN: req.session[req.body.projectId].hisBefore,
      histplotAN: req.session[req.body.projectId].hisAfter,
      colors: req.session[req.body.projectId].colors,
      mAplotBN: req.session[req.body.projectId].maplotBN,
      mAplotAN: req.session[req.body.projectId].maplotAfter,
      group_1: req.session[req.body.projectId].group_1,
      group_2: req.session[req.body.projectId].group_2,
      groups: req.session[req.body.projectId].groups,
      projectId: req.session[req.body.projectId].projectId,
      accessionCode: req.session[req.body.projectId].accessionCode,
      gsm: re.GSM,
      mAplotBN: re.maplotBN,
      mAplotAN: re.maplotAfter,
      normal: req.session[req.body.projectId].normal[0],
      heatmapolt: req.session[req.body.projectId].heatmapAfterNorm,
      chip: re.chip,
    };
  }
}

router.post('/upload', function (req, res) {
  logger.info('[start] upload files');
  // create an incoming form object
  var form = new formidable.IncomingForm();
  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;
  var pid = '';
  // Emitted whenever a field / value pair has been received.
  form.on('field', function (name, value) {
    if (name == 'projectId') {
      pid = value;
      form.uploadDir = path.join(config.uploadPath, '/' + value);
      if (!fs.existsSync(form.uploadDir)) {
        fs.mkdirSync(form.uploadDir);
      } else {
        rimraf(form.uploadDir, function () {
          fs.mkdirSync(form.uploadDir);
        });
      }
    }
  });
  var number_of_files = 0;
  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function (field, file) {
    number_of_files = number_of_files + 1;
    fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
      if (err) throw logger.info('Rename  file name err' + err);
    });
  });
  // log any errors that occur
  form.on('error', function (err) {
    res.json({
      status: 500,
      data: 'An error has occured: \n' + err,
    });
  });
  // once all the files have been uploaded, send a response to the client
  form.on('end', function () {
    let data = [];
    data.push('loadCEL'); // action
    data.push(pid);
    //data path
    data.push(config.uploadPath);
    data.push(new Array(number_of_files).fill('Others'));
    R.execute('wrapper.R', data, function (err, returnValue) {
      if (err) {
        logger.info('API:/upload result ', 'status 404 ');
        logger.warn('API:/upload result ', 'status 404 ', err);
        res.json({
          status: 404,
          msg: err,
        });
      } else {
        logger.info('API:/upload result ', 'status 200 ');
        res.json({
          status: 200,
          data: returnValue,
        });
      }
    });
  });
  // parse the incoming request containing the form data
  form.parse(req);
});

router.post('/getConfiguration', function (req, res) {
  if (config) {
    res.json({ status: 200, data: config });
  } else {
    res.json({ status: 404, msg: 'no configuration is avaliable.' });
  }
});

router.post('/loadGSE', function (req, res) {
  let data = [];
  //the content in data array should follow the order. Code projectId groups action pDEGs foldDEGs pPathways
  // action
  data.push('loadGSE');
  data.push(req.body.projectId);
  //data path
  data.push(config.uploadPath);
  data.push(req.body.code);
  data.push(req.body.groups);
  data.push(req.body.batches);
  data.push(req.body.chip);
  logger.info(
    'API:/loadGSE ',
    'code:',
    req.body.code,
    'groups:',
    req.body.groups,
    req.body.batches,
    'projectId:',
    req.body.projectId,
    'data_repo_path:',
    config.uploadPath
  );
  R.execute('wrapper.R', data, function (err, returnValue) {
    if (err) {
      logger.info('API:/loadGSE result ', 'status 404 ');
      res.json({ status: 404, msg: returnValue });
    } else {
      logger.info('API:/loadGSE result ', 'status 200 ');
      res.json({ status: 200, data: returnValue });
    }
  });
});

router.post('/pathwaysHeapMap', function (req, res) {
  let data = [];
  //the content in data array should follow the order. Code projectId groups action pDEGs foldDEGs pPathways
  data.push('pathwaysHeapMap');
  data.push(req.body.projectId);
  //data path
  data.push(config.uploadPath);
  data.push(req.body.group1);
  data.push(req.body.group2);
  data.push(req.body.upOrDown);
  data.push(req.body.pathway_name);
  //configuration path
  data.push(config.configPath);
  logger.info(
    'API:/pathwaysHeapMap ',
    'projectId :',
    req.body.projectId,
    'group_1 :',
    req.body.group1,
    'group_2 :',
    req.body.group2,
    'upOrDown :',
    req.body.upOrDown,
    'pathway_name :',
    req.body.pathway_name,
    'data_repo_path:',
    config.uploadPath,
    'configPath:',
    config.configPath
  );

  R.execute('wrapper.R', data, function (err, returnValue) {
    if (err) {
      res.json({ status: 404, msg: err });
    } else {
      res.json({ status: 200, data: returnValue });
    }
  });
});

router.post('/getssGSEAWithDiffGenSet', function (req, res) {
  if (!validate(req.body.projectId))
    res.json({ status: 404, msg: 'Invalid project ID' });
  let data = [];
  //the content in data array should follow the order. Code projectId groups action pDEGs foldDEGs pPathways
  data.push('runSSGSEA'); // action
  data.push(req.body.projectId);
  //data path
  data.push(config.uploadPath);
  data.push(req.body.species);
  data.push(req.body.genSet);
  data.push(req.body.group1);
  data.push(req.body.group2);
  data.push(config.configPath);
  removeGSEAheatmap(config.uploadPath, req.body.projectId);
  R.execute('wrapper.R', data, function (err, returnValue) {
    returnValue = fs.readFileSync(
      config.uploadPath + '/' + req.body.projectId + '/ss_result.txt',
      'utf8'
    );

    let re = JSON.parse(returnValue);
    // store return value in session (deep copy)
    let d = JsonToObject(re);
    // save result into session
    if (req.session[req.body.projectId].ssGSEA) {
      req.session[req.body.projectId].ssGSEA = d.ssGSEA;
    }
    logger.info('Get Contrast result success');
    res.json({ status: 200, data: '' });
  });
});

router.post('/qAnalysis', function (req, res) {
  var now = new Date();
  let data = {};
  data.projectId = req.body.projectId;
  data.code = req.body.code;
  data.groups = req.body.groups;
  data.group_1 = req.body.group_1;
  data.group_2 = req.body.group_2;
  data.species = req.body.species;
  data.genSet = req.body.genSet;
  data.source = req.body.source;
  data.email = req.body.email;
  data.domain = 'microarray';
  data.submit = dateFormat(now, 'yyyy-mm-dd, h:MM:ss TT');
  data.dataList = req.body.dataList;
  data.normal = req.body.normal;
  data.realGroup = req.body.realGroup.join('@');
  data.index = req.body.index;
  data.batches = req.body.batches;
  data.chip = req.body.chip;
  let CEL = '';
  for (let i in req.body.dataList) {
    CEL = req.body.dataList[i] + ',' + CEL;
  }
  let code = '';
  if (req.body.source == 'fetch') {
    code = '<p>&nbsp;&nbsp;Accession Code: <b>' + data.code + '</b></p>';
  } else {
    code = '<p>&nbsp;&nbsp;CEL Files: <b>' + CEL + '</b></p>';
  }
  logger.info('[Queue] Start Using Queue for Analysis');
  logger.info('Input:');
  logger.info(JSON.stringify(data));

  function send(d) {
    logger.info('[Queue] Send Message to Queue', JSON.stringify(d));
    queue.awsHander.sender(JSON.stringify(d), d.email, function (
      flag,
      err,
      data
    ) {
      if (flag) {
        logger.info('[Queue] Send Message to Queue fails', JSON.stringify(err));
        logger.info('[Queue] Send fails message  to client ', data.email);
        let subject =
          'MicroArray Contrast Results -' +
          dateFormat(now, 'yyyy_mm_dd_h_MM') +
          '(FAILED) ';
        let html = emailer.emailFailedTemplate(
          code,
          0,
          data.submit,
          data.projectId
        );
        emailer.sendMail(
          config.mail.web_admin_email,
          data.email,
          subject,
          'text',
          html
        );
        res.json({ status: 404, msg: 'Send Message to Queue fails' });
      } else {
        logger.info('[Queue] Send Message to Queue success');
        res.json({ status: 200, data: '' });
      }
    });
  }
  logger.info('[S3]upload file to S3');
  logger.info('[S3]File Path:' + config.uploadPath + '/' + data.projectId);
  // // upload data
  var tmp_project_id = uuidv4(); // using tmp_project id for creating different project for each qanalysis.  so when user run constrast (queue mode) based on one project multiple times. That allows to create project for each run constrast.
  queue.awsHander.upload(
    config.uploadPath + '/' + data.projectId,
    config.queue_input_path + '/' + tmp_project_id + '/',
    function (flag) {
      if (flag) {
        logger.info('[S3] upload files to S3 success');
        data.projectId = tmp_project_id;
        send(data);
      } else {
        logger.info('[S3] upload files to S3 fails');
        let subject =
          'MicroArray Contrast Results -' +
          dateFormat(now, 'yyyy_mm_dd_h_MM') +
          '(FAILED) ';
        let html = emailer.emailFailedTemplate(
          code,
          0,
          data.submit,
          data.projectId
        );
        emailer.sendMail(
          config.mail.web_admin_email,
          data.email,
          subject,
          'text',
          html
        );
        res.json({ status: 404, msg: 'upload files to S3 fails' });
      }
    }
  );
});

router.post('/getCurrentNumberOfJobsinQueue', function (req, res) {
  let d = queue.awsHander.getQueueAttributes(
    ['ApproximateNumberOfMessages'],
    function (result) {
      if (result != -1) {
        res.json({
          status: 200,
          data: result.Attributes.ApproximateNumberOfMessages,
        });
      } else {
        res.json({ status: 404, msg: -1 });
      }
    }
  );
});

router.post('/getResultByProjectId', function (req, res) {
  logger.info(
    '[Get contrast result from file]',
    'projectId:',
    req.body.projectId
  );
  queue.awsHander.download(req.body.projectId, config.uploadPath, function (
    flag
  ) {
    if (flag) {
      let return_data = restoreSession(
        req,
        config.uploadPath + '/' + req.body.projectId + '/result.txt'
      );
      logger.info('Get Contrast result success');
      res.json({ status: 200, data: return_data });
    } else {
      res.json({ status: 404, msg: 'err' });
    }
  });
});

router.post('/runContrast', function (req, res) {
  if (!validate(req.body.projectId))
    res.json({ status: 404, msg: 'Invalid project ID' });
  req.setTimeout(0); // no timeout
  let data = [];
  //the content in data array should follow the order. Code projectId groups action pDEGs foldDEGs pPathways
  data.push('runContrast'); // action
  data.push(req.body.projectId);
  //data path
  data.push(config.uploadPath);
  data.push(req.body.code);
  data.push(req.body.groups);
  data.push(req.body.group_1);
  data.push(req.body.group_2);
  data.push(req.body.species);
  data.push(req.body.genSet);
  data.push(req.body.normal);
  data.push(req.body.source);
  data.push(config.configPath);
  data.push(req.body.realGroup.join('@'));
  data.push(req.body.index);
  data.push(req.body.batches);
  data.push(req.body.chip || '');
  removeGSEAheatmap(config.uploadPath, req.body.projectId);
  logger.info('runContrast  R code ');
  R.execute('wrapper.R', data, function (err, returnValue) {
    if (
      fs.existsSync(
        config.uploadPath + '/' + req.body.projectId + '/result.txt'
      )
    ) {
      let return_data = restoreSession(
        req,
        config.uploadPath + '/' + req.body.projectId + '/result.txt'
      );
      if (return_data.gsm) {
        logger.info('Get Contrast result success');
        res.json({ status: 200, data: return_data });
      } else {
        res.json({ status: 404, msg: JSON.stringify(return_data) });
      }
    } else {
      let return_data = 'R Internal Error';
      let paths = [
        'geneHeatmap.err',
        'getCELfiles.err',
        'getLocalGEOfiles.err',
        'l2pPathways.err',
        'loess_QCnorm.err',
        'processCELfiles.err',
        'processGEOfiles.err',
        'RMA_QCnorm.err',
        'ssgseaPathways.err',
        'diffExprGenes.err',
      ];
      for (var i = paths.length - 1; i >= 0; i--) {
        if (
          fs.existsSync(
            config.uploadPath + '/' + req.body.projectId + '/' + paths[i]
          )
        ) {
          let returnValue = fs.readFileSync(
            config.uploadPath + '/' + req.body.projectId + '/' + paths[i],
            'utf8'
          );
          if (returnValue.indexOf('halted') > 0) {
            return_data = returnValue;
          }
        }
      }
      if (return_data == 'R Internal Error') {
        if (
          fs.existsSync(
            config.uploadPath + '/' + req.body.projectId + '/overall_error.txt'
          )
        ) {
          let returnValue = fs.readFileSync(
            config.uploadPath + '/' + req.body.projectId + '/overall_error.txt',
            'utf8'
          );
          if (returnValue != '' && returnValue != []) {
            return_data = returnValue;
          }
        }
      }
      if (return_data && return_data != '') {
        if (return_data.includes('At least 2 ')) {
          return_data =
            'Warning Message : ' +
            return_data
              .replace(/\$/g, '')
              .replace(/\[/g, '')
              .replace(/\]/g, '')
              .replace(/\"/g, '');
        } else {
          return_data =
            'Error Message : ' +
            return_data
              .replace(/\$/g, '')
              .replace(/\[/g, '')
              .replace(/\]/g, '')
              .replace(/\"/g, '');
        }
      }
      res.json({ status: 404, msg: return_data });
    }
  });
});

function getPlots(req, res, type) {
  let return_data = '';
  let size = '';
  switch (type) {
    case 'getHistplotAN':
      if (req.session && req.session[req.body.projectId]) {
        return_data = req.session[req.body.projectId].listPlots[5];
      } else {
        return_data = '';
      }
      break;
    case 'getBoxplotAN':
      if (req.session && req.session[req.body.projectId]) {
        if (
          typeof req.session[req.body.projectId].listPlots[7].color[0] ==
          'number'
        ) {
          req.session[req.body.projectId].listPlots[7].color = req.session[
            req.body.projectId
          ].listPlots[7].color = req.session[req.body.projectId].colors;
        }
        return_data = req.session[req.body.projectId].listPlots[7];
      } else {
        return_data = '';
      }
      break;
    case 'getMAplotAN':
      console.time('getMAplotAN');
      if (req.session && req.session[req.body.projectId]) {
        return_data = req.session[req.body.projectId].listPlots[6];
      } else {
        return_data = '';
      }
      break;
    case 'getPCA':
      if (req.session && req.session[req.body.projectId]) {
        if (
          typeof req.session[req.body.projectId].listPlots[8].color[0] ==
          'number'
        ) {
          req.session[req.body.projectId].listPlots[8].color = req.session[
            req.body.projectId
          ].listPlots[8].color = req.session[req.body.projectId].colors;
        }
        let groups = [];
        if (req.session[req.body.projectId].groups) {
          for (
            var i = 0;
            i <= req.session[req.body.projectId].groups.length - 1;
            i++
          ) {
            if (req.session[req.body.projectId].groups[i] != 'Ctl') {
              groups.push(req.session[req.body.projectId].groups[i]);
            } else {
              groups.push('Others');
            }
          }
        }
        req.session[req.body.projectId].listPlots[8].group_name = groups;
        return_data = req.session[req.body.projectId].listPlots[8];
      } else {
        return_data = '';
      }
      break;
    case 'getHeatmapolt':
      if (req.session && req.session[req.body.projectId]) {
        return_data = req.session[req.body.projectId].listPlots[9];
      } else {
        return_data = '';
      }
      break;
    case 'getHistplotBN':
      if (req.session && req.session[req.body.projectId]) {
        return_data = req.session[req.body.projectId].listPlots[0];
      } else {
        return_data = '';
      }
      break;
    case 'getMAplotsBN':
      if (req.session && req.session[req.body.projectId]) {
        return_data = req.session[req.body.projectId].listPlots[1];
      } else {
        return_data = '';
      }
      break;
    case 'getBoxplotBN':
      if (req.session && req.session[req.body.projectId]) {
        if (
          typeof req.session[req.body.projectId].listPlots[2].color[0] ==
          'number'
        ) {
          req.session[req.body.projectId].listPlots[2].color = req.session[
            req.body.projectId
          ].listPlots[2].color = req.session[req.body.projectId].colors;
        }
        return_data = req.session[req.body.projectId].listPlots[2];
      } else {
        return_data = '';
      }
      break;
    case 'getRLE':
      if (req.session && req.session[req.body.projectId]) {
        if (
          typeof req.session[req.body.projectId].listPlots[3].color[0] ==
          'number'
        ) {
          req.session[req.body.projectId].listPlots[3].color = req.session[
            req.body.projectId
          ].listPlots[3].color = req.session[req.body.projectId].colors;
        }
        return_data = req.session[req.body.projectId].listPlots[3];
      } else {
        return_data = '';
      }
      break;
    case 'getNUSE':
      if (req.session && req.session[req.body.projectId]) {
        if (
          typeof req.session[req.body.projectId].listPlots[4].color[0] ==
          'number'
        ) {
          req.session[req.body.projectId].listPlots[4].color = req.session[
            req.body.projectId
          ].listPlots[4].color = req.session[req.body.projectId].colors;
        }
        return_data = req.session[req.body.projectId].listPlots[4];
      } else {
        return_data = '';
      }
      break;
    default:
      return_data = '';
  }
  //response
  res.json({ status: 200, data: return_data });
}

router.post('/getHistplotBN', function (req, res) {
  getPlots(req, res, 'getHistplotBN');
});

router.post('/getHistplotAN', function (req, res) {
  getPlots(req, res, 'getHistplotAN');
});

router.post('/getBoxplotAN', function (req, res) {
  getPlots(req, res, 'getBoxplotAN');
});

router.post('/getMAplotAN', function (req, res) {
  getPlots(req, res, 'getMAplotAN');
});

router.post('/getPCA', function (req, res) {
  getPlots(req, res, 'getPCA');
});

router.post('/getHeatmapolt', function (req, res) {
  getPlots(req, res, 'getHeatmapolt');
});

router.post('/getBoxplotAN', function (req, res) {
  getPlots(req, res, 'getBoxplotAN');
});

router.post('/getMAplotsBN', function (req, res) {
  getPlots(req, res, 'getMAplotsBN');
});

router.post('/getBoxplotBN', function (req, res) {
  getPlots(req, res, 'getBoxplotBN');
});

router.post('/getRLE', function (req, res) {
  getPlots(req, res, 'getRLE');
});

router.post('/getNUSE', function (req, res) {
  getPlots(req, res, 'getNUSE');
});

router.post('/getUpPathWays', function (req, res) {
  if (req.session && req.session[req.body.projectId]) {
    res.json({
      status: 200,
      data: getUpPathWays(req),
    });
  } else {
    res.json({
      status: 404,
      msg: 'No data found in the session',
    });
  }
});

router.post('/getDownPathWays', function (req, res) {
  if (req.session && req.session[req.body.projectId]) {
    res.json({
      status: 200,
      data: getDownPathWays(req),
    });
  } else {
    res.json({
      status: 404,
      msg: 'No data found in the session',
    });
  }
});

router.post('/getGSEA', function (req, res) {
  if (req.session && req.session[req.body.projectId]) {
    res.json({
      status: 200,
      data: getGSEA(req),
    });
  } else {
    res.json({
      status: 404,
      msg: 'No data found in the session',
    });
  }
});

router.post('/getDEG', function (req, res) {
  if (req.session && req.session[req.body.projectId]) {
    res.json({
      status: 200,
      data: getDEG(req),
    });
  } else {
    res.json({
      status: 404,
      msg: 'No data found in the session',
    });
  }
});

router.post('/getNormalAll', function (req, res) {
  if (
    req.session &&
    req.session[req.body.projectId] &&
    req.session[req.body.projectId].normCelfiles
  ) {
    res.json({
      status: 200,
      data: req.session[req.body.projectId].normCelfiles,
    });
  } else {
    res.json({
      status: 404,
      msg: 'No data found in the session',
    });
  }
});

function getUpPathWays(req) {
  return getPathWays(
    req.session[req.body.projectId].pathways_up,
    {},
    req.body.sorting,
    req.body.search_keyword,
    req.body.page_size,
    req.body.page_number,
    req,
    'pathways_up'
  );
}

function getDownPathWays(req) {
  return getPathWays(
    req.session[req.body.projectId].pathways_down,
    {},
    req.body.sorting,
    req.body.search_keyword,
    req.body.page_size,
    req.body.page_number,
    req,
    'pathways_down'
  );
}

function getGSEA(req) {
  return getGSEA_filter(
    req.session[req.body.projectId].ssGSEA,
    {},
    req.body.sorting,
    req.body.search_keyword,
    req.body.page_size,
    req.body.page_number,
    req
  );
}

function getDEG(req) {
  let threadhold = {};
  // add filter
  return getDEG_filter(
    req.session[req.body.projectId].diff_expr_genes,
    threadhold,
    req.body.sorting,
    req.body.search_keyword,
    req.body.page_size,
    req.body.page_number,
    req
  );
}

function getPathWays(
  data,
  threadhold,
  sorting,
  search_keyword,
  page_size,
  page_number,
  req,
  type
) {
  let result = data;
  const keys = Object.keys(search_keyword);
  const searchFilters = () => {
    let search = {};
    keys.forEach((key) => {
      search[key] = search_keyword[key];
    });
    return search;
  };

  if (type == 'pathways_up') {
    // store
    let tmp = req.session[req.body.projectId].pathway_up_tmp;
    if (tmp) {
      if (
        tmp.sorting_order == sorting.order &&
        tmp.sorting_name == sorting.name &&
        !keys
          .map((key) => {
            return tmp[key] == search_keyword[key];
          })
          .includes(false)
      ) {
        // return index
        let output = {
          totalCount:
            req.session[req.body.projectId].pathway_up_tmp.data.length,
          records: req.session[req.body.projectId].pathway_up_tmp.data.slice(
            page_size * (page_number - 1),
            page_size * (page_number - 1) + page_size
          ),
        };
        return output;
      }
    }
  }
  if (type == 'pathways_down') {
    // store
    let tmp = req.session[req.body.projectId].pathway_down_tmp;
    if (tmp) {
      if (
        tmp.sorting_order == sorting.order &&
        tmp.sorting_name == sorting.name &&
        !keys
          .map((key) => {
            return tmp[key] == search_keyword[key];
          })
          .includes(false)
      ) {
        // return index
        let output = {
          totalCount:
            req.session[req.body.projectId].pathway_down_tmp.data.length,
          records: req.session[req.body.projectId].pathway_down_tmp.data.slice(
            page_size * (page_number - 1),
            page_size * (page_number - 1) + page_size
          ),
        };
        return output;
      }
    }
  }
  // search
  if (search_keyword) {
    const queries = Object.keys(search_keyword).filter((key) => {
      if (search_keyword[key]) return key;
    });
    if (queries.length) {
      result = result.filter((r) => {
        for (let key of queries) {
          if (!isNaN(parseFloat(r[key]))) {
            return parseFloat(r[key]) <= parseFloat(search_keyword[key]);
          } else {
            return (
              r[key].toLowerCase().indexOf(search_keyword[key].toLowerCase()) !=
              -1
            );
          }
        }
      });
    }
  }
  // sorting
  if (sorting != null) {
    if (sorting.order == 'descend') {
      result.sort(function (e1, e2) {
        return e1[sorting.name] < e2[sorting.name] ? 1 : -1;
      });
    }
    if (sorting.order == 'ascend') {
      result.sort(function (e1, e2) {
        return e1[sorting.name] < e2[sorting.name] ? -1 : 1;
      });
    }
  }
  if (type == 'pathways_up') {
    // store current filter result into tmp
    req.session[req.body.projectId].pathway_up_tmp = {
      sorting_order: sorting.order,
      sorting_name: sorting.name,
      ...searchFilters(),
      data: result,
    };
  }
  if (type == 'pathways_down') {
    // store current filter result into tmp
    req.session[req.body.projectId].pathway_down_tmp = {
      sorting_order: sorting.order,
      sorting_name: sorting.name,
      ...searchFilters(),
      data: result,
    };
  }
  let output = {
    totalCount: result.length,
    records: result.slice(
      page_size * (page_number - 1),
      page_size * (page_number - 1) + page_size
    ),
  };
  return output;
}

function getGSEA_filter(
  data,
  threadhold,
  sorting,
  search_keyword,
  page_size,
  page_number,
  req
) {
  let result = data;
  // sorting
  if (sorting != null) {
    if (sorting.order == 'descend') {
      result.sort(function (e1, e2) {
        return e1[sorting.name] < e2[sorting.name] ? 1 : -1;
      });
    }
    if (sorting.order == 'ascend') {
      result.sort(function (e1, e2) {
        return e1[sorting.name] < e2[sorting.name] ? -1 : 1;
      });
    }
  }
  // search
  if (search_keyword) {
    if (
      !(
        search_keyword.name == '' &&
        search_keyword.search_b == '' &&
        search_keyword.search_adj_p_value == '' &&
        search_keyword.search_Avg_Enrichment_Score == '' &&
        search_keyword.search_p_value == '' &&
        search_keyword.search_t == '' &&
        search_keyword.search_logFC == ''
      )
    ) {
      result = result.filter(function (r) {
        var flag = false;
        if (search_keyword.name != '') {
          if (
            r['V1'].toLowerCase().indexOf(search_keyword.name.toLowerCase()) !=
            -1
          ) {
            flag = true;
          } else {
            return false;
          }
        }
        if (search_keyword.search_logFC != '') {
          if (Math.abs(r['V2']) >= parseFloat(search_keyword.search_logFC)) {
            flag = true;
          } else {
            return false;
          }
        }
        if (search_keyword.search_t != '') {
          if (parseFloat(r['V4']) <= parseFloat(search_keyword.search_t)) {
            flag = true;
          } else {
            return false;
          }
        }
        if (search_keyword.search_p_value != '') {
          if (
            parseFloat(r['V5']) <= parseFloat(search_keyword.search_p_value)
          ) {
            flag = true;
          } else {
            return false;
          }
        }
        if (search_keyword.search_Avg_Enrichment_Score != '') {
          if (
            parseFloat(r['V3']) <=
            parseFloat(search_keyword.search_Avg_Enrichment_Score)
          ) {
            flag = true;
          } else {
            return false;
          }
        }
        if (search_keyword.search_adj_p_value != '') {
          if (
            parseFloat(r['V6']) <= parseFloat(search_keyword.search_adj_p_value)
          ) {
            flag = true;
          } else {
            return false;
          }
        }
        if (search_keyword.search_b != '') {
          if (parseFloat(r['V7']) <= parseFloat(search_keyword.search_b)) {
            flag = true;
          } else {
            return false;
          }
        }
        // if search keywords is empty then return the
        return flag;
      });
    }
  }
  // return index
  let output = {
    totalCount: result.length,
    records: result.slice(
      page_size * (page_number - 1),
      page_size * (page_number - 1) + page_size
    ),
  };
  return output;
}

function getDEG_filter(
  data,
  threadhold,
  sorting,
  search_keyword,
  page_size,
  page_number,
  req
) {
  let result = data;
  // store
  if (req.session[req.body.projectId].deg_tmp) {
    // if only request a page's content do not need to filter out the data
    if (
      req.session[req.body.projectId].deg_tmp.sorting_order == sorting.order &&
      req.session[req.body.projectId].deg_tmp.sorting_name == sorting.name &&
      req.session[req.body.projectId].deg_tmp.search_symbol ==
        search_keyword.search_symbol &&
      req.session[req.body.projectId].deg_tmp.search_fc ==
        search_keyword.search_fc &&
      req.session[req.body.projectId].deg_tmp.search_p_value ==
        search_keyword.search_p_value &&
      req.session[req.body.projectId].deg_tmp.search_adj_p_value ==
        search_keyword.search_adj_p_value &&
      req.session[req.body.projectId].deg_tmp.search_aveexpr ==
        search_keyword.search_aveexpr &&
      req.session[req.body.projectId].deg_tmp.search_accnum ==
        search_keyword.search_accnum &&
      req.session[req.body.projectId].deg_tmp.search_desc ==
        search_keyword.search_desc &&
      req.session[req.body.projectId].deg_tmp.search_entrez ==
        search_keyword.search_entrez &&
      req.session[req.body.projectId].deg_tmp.search_probsetid ==
        search_keyword.search_probsetid &&
      req.session[req.body.projectId].deg_tmp.search_t ==
        search_keyword.search_t &&
      req.session[req.body.projectId].deg_tmp.search_b ==
        search_keyword.search_b
    ) {
      logger.info('Get Deg data from session success');
      let output = {
        totalCount: req.session[req.body.projectId].deg_tmp.data.length,
        records: req.session[req.body.projectId].deg_tmp.data.slice(
          page_size * (page_number - 1),
          page_size * (page_number - 1) + page_size
        ),
      };
      return output;
    } else {
      logger.info('Get Deg data from session fails');
    }
  }
  if (sorting != null) {
    logger.info('Sort Deg data ');
    if (sorting.order == 'descend') {
      result.sort(function (e1, e2) {
        return e1[sorting.name] < e2[sorting.name] ? 1 : -1;
      });
    }
    if (sorting.order == 'ascend') {
      result.sort(function (e1, e2) {
        return e1[sorting.name] < e2[sorting.name] ? -1 : 1;
      });
    }
  }
  // search
  if (search_keyword != '') {
    logger.info('Filter Deg data ');
    if (
      !(
        search_keyword.search_accnum == '' &&
        search_keyword.search_adj_p_value == '' &&
        search_keyword.search_aveexpr == '' &&
        search_keyword.search_b == '' &&
        search_keyword.search_p_value == '' &&
        search_keyword.search_desc == '' &&
        search_keyword.search_entrez == '' &&
        search_keyword.search_fc == '' &&
        search_keyword.search_probsetid == '' &&
        search_keyword.search_symbol == '' &&
        search_keyword.search_t == ''
      )
    ) {
      result = result.filter(function (r) {
        var flag = false;
        if (search_keyword.search_accnum != '') {
          if (
            r.ACCNUM.toLowerCase().indexOf(
              search_keyword.search_accnum.toLowerCase()
            ) != -1
          ) {
            flag = true;
          } else {
            return false;
          }
        }
        if (search_keyword.search_adj_p_value != '') {
          if (
            parseFloat(r['adj.P.Val']) <=
            parseFloat(search_keyword.search_adj_p_value)
          ) {
            flag = true;
          } else {
            return false;
          }
        }
        if (search_keyword.search_aveexpr != '') {
          if (
            parseFloat(r.AveExpr) <= parseFloat(search_keyword.search_aveexpr)
          ) {
            flag = true;
          } else {
            return false;
          }
        }
        if (search_keyword.search_b != '') {
          if (parseFloat(r.B) <= parseFloat(search_keyword.search_b)) {
            flag = true;
          } else {
            return false;
          }
        }
        if (search_keyword.search_p_value != '') {
          if (
            parseFloat(r['P.Value']) <=
            parseFloat(search_keyword.search_p_value)
          ) {
            flag = true;
          } else {
            return false;
          }
        }
        if (search_keyword.search_desc != '') {
          if (
            r.DESC.toLowerCase().indexOf(
              search_keyword.search_desc.toLowerCase()
            ) != -1
          ) {
            flag = true;
          } else {
            return false;
          }
        }
        if (search_keyword.search_entrez != '') {
          if (
            r.ENTREZ.toLowerCase().indexOf(
              search_keyword.search_entrez.toLowerCase()
            ) != -1
          ) {
            flag = true;
          } else {
            return false;
          }
        }
        if (search_keyword.search_fc != '') {
          if (Math.abs(r.FC) >= parseFloat(search_keyword.search_fc)) {
            flag = true;
          } else {
            return false;
          }
        }
        if (search_keyword.search_probsetid != '') {
          if (
            r.probsetID
              .toLowerCase()
              .indexOf(search_keyword.search_probsetid.toLowerCase()) != -1
          ) {
            flag = true;
          } else {
            return false;
          }
        }
        if (search_keyword.search_symbol != '') {
          if (
            r.SYMBOL.toLowerCase().indexOf(
              search_keyword.search_symbol.toLowerCase()
            ) != -1
          ) {
            flag = true;
          } else {
            return false;
          }
        }

        if (search_keyword.search_t != '') {
          if (parseFloat(r.t) <= parseFloat(search_keyword.search_t)) {
            flag = true;
          } else {
            return false;
          }
        }
        return flag;
      });
    }
  }
  logger.info('Put Deg data into session ');
  // store current filter result into tmp
  req.session[req.body.projectId].deg_tmp = {
    sorting_order: sorting.order,
    sorting_name: sorting.name,
    search_symbol: search_keyword.search_symbol,
    search_fc: search_keyword.search_fc,
    search_p_value: search_keyword.search_p_value,
    search_adj_p_value: search_keyword.search_adj_p_value,
    search_aveexpr: search_keyword.search_aveexpr,
    search_accnum: search_keyword.search_accnum,
    search_desc: search_keyword.search_desc,
    search_entrez: search_keyword.search_entrez,
    search_probsetid: search_keyword.search_probsetid,
    search_t: search_keyword.search_t,
    search_b: search_keyword.search_b,
    data: result,
  };
  // return index
  let output = {
    totalCount: result.length,
    records: result.slice(
      page_size * (page_number - 1),
      page_size * (page_number - 1) + page_size
    ),
  };
  return output;
}

function toObject(returnValue) {
  var workflow = {};
  workflow.diff_expr_genes = [];
  workflow.ssGSEA = [];
  workflow.pathways_up = [];
  workflow.pathways_down = [];
  workflow.listPlots = [];
  var list = '';
  let d = '';
  if (returnValue.split('+++ssGSEA+++"')) {
    d = returnValue.split('+++ssGSEA+++"')[1];
  }
  // "/Users/cheny39/Documents/GitHub/nci-webtools-ccr-microarray/service/data/a891ca3a044443b78a8bc3c32fdaf02a/"
  let data_dir = d.substring(0, d.indexOf('{'));
  list = JSON.parse(decodeURIComponent(d.substring(d.indexOf('{'), d.length)));
  // get plots
  workflow.listPlots = list.norm_celfiles['listData'];
  for (let i in list.pathways) {
    workflow.pathways_up = list.pathways[i]['upregulated_pathways'];
    workflow.pathways_down = list.pathways[i]['downregulated_pathways'];
  }
  let ssGSEA = list.ssGSEA.DEss;
  for (let key in ssGSEA) {
    ssGSEA = ssGSEA[key];
  }
  for (let j in ssGSEA) {
    workflow.ssGSEA.push(ssGSEA[j]);
  }
  let deg = list.diff_expr_genes.listDEGs;
  for (let i in list.diff_expr_genes.listDEGs) {
    for (let j in deg[i]) {
      workflow.diff_expr_genes.push(deg[i][j]);
    }
  }
  logger.info(
    'API: function filter result :',
    'workflow.diff_expr_genes.length: ',
    workflow.diff_expr_genes.length,
    'workflow.ssGSEA.length: ',
    workflow.ssGSEA.length,
    'workflow.pathways_up.length: ',
    workflow.pathways_up.length,
    'workflow.pathways_down.length: ',
    workflow.pathways_down.length
  );
  return workflow;
}

function JsonToObject(returnValue) {
  var workflow = {};
  if (returnValue.deg) {
    workflow.diff_expr_genes = returnValue.deg;
  } else {
    workflow.diff_expr_genes = '';
  }
  if (returnValue.ss_data) {
    workflow.ssGSEA = returnValue.ss_data;
  } else {
    workflow.ssGSEA = '';
  }
  if (returnValue.uppath) {
    workflow.pathways_up = returnValue.uppath;
  } else {
    workflow.pathways_up = '';
  }
  if (returnValue.downpath) {
    workflow.pathways_down = returnValue.downpath;
  } else {
    workflow.pathways_down = '';
  }
  if (returnValue.projectId) {
    workflow.projectId = returnValue.projectId;
  } else {
    workflow.projectId = '';
  }

  if (returnValue.groups) {
    workflow.groups = returnValue.groups;
    // map color with groups
  } else {
    workflow.groups = [];
  }

  if (returnValue.colors) {
    workflow.colors = returnValue.colors;
  } else {
    workflow.colors = [];
  }

  if (returnValue.accessionCode && returnValue.accessionCode[0]) {
    workflow.accessionCode = returnValue.accessionCode[0];
  } else {
    workflow.accessionCode = '';
  }
  if (returnValue.group_1 && returnValue.group_1[0]) {
    workflow.group_1 = returnValue.group_1[0];
  } else {
    workflow.group_1 = '';
  }
  if (returnValue.group_2 && returnValue.group_2[0]) {
    workflow.group_2 = returnValue.group_2[0];
  } else {
    workflow.group_2 = '';
  }

  if (returnValue.hisBefore) {
    workflow.listPlots = [
      returnValue.hisBefore[0],
      returnValue.maplotBN,
      returnValue.boxplotDataBN,
      returnValue.RLE,
      returnValue.NUSE,
      returnValue.hisAfter[0],
      returnValue.maplotAfter,
      returnValue.boxplotDataAN,
      returnValue.pcaData,
      returnValue.heatmapAfterNorm,
    ];
    workflow.hisBefore = returnValue.hisBefore[0];
    workflow.hisAfter = returnValue.hisAfter[0];
  } else {
    workflow.hisBefore = '';
  }

  if (returnValue.normal) {
    workflow.normal = returnValue.normal;
  } else {
    workflow.normal = '';
  }

  if (returnValue.heatmapAfterNorm) {
    workflow.heatmapAfterNorm = returnValue.heatmapAfterNorm[0];
  } else {
    workflow.heatmapAfterNorm = '';
  }

  if (returnValue.source) {
    workflow.source = returnValue.source;
  } else {
    workflow.source = '';
  }

  if (returnValue.normCelfiles) {
    workflow.normCelfiles = returnValue.normCelfiles;
  } else {
    workflow.normCelfiles = '';
  }
  return workflow;
}

module.exports = router;
