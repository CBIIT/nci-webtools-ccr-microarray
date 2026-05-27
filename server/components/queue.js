const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { SQSClient, GetQueueUrlCommand, GetQueueAttributesCommand, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand, ChangeMessageVisibilityCommand } = require('@aws-sdk/client-sqs');
var { v4: uuid } = require('uuid');
const fs = require('fs');
var config = require('../config');
var logger = require('../components/queue_logger');
var bucketName = config.bucketName;

var awsHander = {};
// s3 connect timeout set to be 30 minutes
if (!config.s3_timeout) {
  config.s3_timeout = 30 * 60000;
}
var s3 = new S3Client({
  region: 'us-east-1',
  requestHandler: {
    requestTimeout: config.s3_timeout,
  },
});
var sqs = new SQSClient({ region: 'us-east-1' });
var AdmZip = require('adm-zip');

awsHander.getQueueUrl = function (next) {
  var params = {
    QueueName: config.queue_name,
  };
  sqs.send(new GetQueueUrlCommand(params)).then(function (data) {
    logger.info('[Queue] Queue URL is ' + data.QueueUrl);
    global.queue_url = data.QueueUrl;
    next(true);
  }).catch(function (err) {
    console.log(err, err.stack);
    logger.info('[Queue]Get QueueUrl Fails ' + err.stack);
    global.queue_url = 'none';
    next(false);
  });
};

awsHander.upload = function (path, prex, next) {
  let zip = new AdmZip();
  fs.readdir(path, function (err, items) {
    for (var i = 0; i < items.length; i++) {
      let stat = fs.lstatSync(path + '/' + items[i]);
      if (stat.isFile()) {
        if (items[i] != 'queue_upload.zip') {
          zip.addLocalFile(path + '/' + items[i]);
        }
      }
    }
    zip.writeZip(path + '/queue_upload.zip');
    let fileStream = fs.createReadStream(path + '/queue_upload.zip');
    logger.info('uplad file :' + path);
    s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: prex + 'queue_upload.zip',
      Body: fileStream,
    })).then(function () {
      logger.info('uplad file success');
      next(true);
    }).catch(function (err) {
      logger.info('uplad err:' + err);
      logger.info('uplad err stack:' + err.stack);
      next(false);
    });
  });
};

awsHander.getQueueAttributes = function (attr, callback) {
  var params = {
    QueueUrl: global.queue_url,
    AttributeNames: attr,
  };
  sqs.send(new GetQueueAttributesCommand(params)).then(function (data) {
    callback(data);
  }).catch(function (err) {
    console.log(err, err.stack);
    callback(-1);
  });
};

//sent message to queue.

awsHander.sender = function (message, to, errHandler) {
  function send() {
    let params = {
      MessageBody: message,
      QueueUrl: global.queue_url,
      DelaySeconds: 0,
      MessageDeduplicationId: uuid(),
      MessageGroupId: uuid(),
    };
    sqs.send(new SendMessageCommand(params)).then(function (data) {
      logger.info('[Queue] Send Messages to Queue success');
      errHandler(false, null, data);
    }).catch(function (err) {
      logger.info('[Queue] Send Messages to Queue fails');
      logger.info('Err');
      logger.info(err.stack);
      errHandler(true, err, null);
    });
  }
  if (global.queue_url == null) {
    awsHander.getQueueUrl(function () {
      send();
    });
  } else {
    send();
  }
};

awsHander.receiver = function (next, endCallback, errHandler) {
  let params = {
    QueueUrl: global.queue_url,
    MaxNumberOfMessages: 1,
    ReceiveRequestAttemptId: uuid(),
    VisibilityTimeout: config.visibility_timeout || 30,
    WaitTimeSeconds: config.queue_long_pull_time || 20,
  };
  sqs.send(new ReceiveMessageCommand(params)).then(function (data) {
    console.log(data);
    if (data.Messages) {
      let message = JSON.parse(data.Messages[0].Body);

      if (message.domain && message.domain == 'microarray') {
        next(data, data.email, endCallback);
      }
    } else {
      if (endCallback) {
        endCallback();
      }
    }
  }).catch(function (err) {
    console.log(err, err.stack);
    logger.info('[Queue] Receive Messages from S3 fails');
    logger.info('Err');
    logger.info(err.stack);
    errHandler(err);
  });
};

awsHander.del = function (rec) {
  let params = {
    QueueUrl: global.queue_url,
    ReceiptHandle: rec,
  };
  sqs.send(new DeleteMessageCommand(params)).catch(function (err) {
    console.log(err, err.stack);
    logger.info('[Queue] Delete Messages from S3 fails');
    logger.info('Err');
    logger.info(err.stack);
  });
};

awsHander.changeMessageVisibility = function (receiptHandle, timeout) {
  logger.info('Set Messages visibility');
  var visibilityParams = {
    QueueUrl: global.queue_url,
    ReceiptHandle: receiptHandle,
    VisibilityTimeout: timeout,
  };
  sqs.send(new ChangeMessageVisibilityCommand(visibilityParams)).catch(function (err) {
    logger.info('queue visibility change fails: ' + err);
  });
};

awsHander.download = (projectId, filePath, next) => {
  let key = config.queue_input_path + '/' + projectId + '/queue_upload.zip';
  var params = {
    Bucket: config.bucketName,
    Key: key,
  };
  logger.info('[Queue] Download file from S3 ');
  logger.info('Key:', key);
  s3.send(new GetObjectCommand(params)).then(async function (data) {
    // In AWS SDK v3, Body is a readable stream — collect into Buffer
    var chunks = [];
    for await (var chunk of data.Body) {
      chunks.push(chunk);
    }
    var body = Buffer.concat(chunks);

    logger.info(filePath + '/' + projectId + '/');
    if (!fs.existsSync(filePath + '/' + projectId + '/')) {
      fs.mkdir(filePath + '/' + projectId + '/', function (err) {
        if (err) {
          logger.info(
            'create dir' + filePath + '/' + projectId + '/' + '  fails'
          );
          logger.info(err);
          next(false);
        } else {
          saveFile(filePath, projectId, body, next);
        }
      });
    } else {
      // if the directory exist
      saveFile(filePath, projectId, body, next);
    }
  }).catch(function (err) {
    logger.info('[Queue] Download file from S3 fails');
    logger.info(params);
    logger.info(err.stack);
    next(false);
  });
};

function saveFile(filePath, projectId, body, next) {
  fs.writeFile(
    filePath + '/' + projectId + '/queue_upload.zip',
    body,
    function (err) {
      if (err) {
        logger.info('write file to disk fails');
        logger.info(err);
        next(false);
      } else {
        let zip2 = new AdmZip(filePath + '/' + projectId + '/queue_upload.zip');
        //unzip
        zip2.extractAllTo(filePath + '/' + projectId + '/', true);
        setTimeout(function () {
          next(true);
        }, 2000);
      }
    }
  );
}

module.exports = {
  awsHander,
};
