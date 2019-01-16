const AWS = require('aws-sdk');
var uuid = require('uuid');
const fs = require('fs');
var emailer = require('./mail');
var config = require('../config');
var lib_path = require('path');
var zlib = require('zlib');
var logger = require('../components/logger');
var bucketName = config.bucketName;

var bucketPromise = new AWS.S3({ apiVersion: '2006-03-01' }).createBucket({ Bucket: bucketName }).promise();

AWS.config.update({ region: 'us-east-1' });

var awsHander = {};

var s3 = new AWS.S3({ apiVersion: '2006-03-01' });

awsHander.upload = function(path, prex, fileExtname = ".gz") {
    // Handle promise fulfilled/rejected states

    bucketPromise.then(
        function(data) {
            fs.readdir(path, function(err, items) {
                for (var i = 0; i < items.length; i++) {

                    let fname = items[i];
                    let stat = fs.lstatSync(path + "/" + items[i]);
                    if (stat.isFile()) {
                        logger.info("[Queue] upload file to S3")
                        logger.info("FileName")
                        logger.info(path + "/" + items[i])
                        logger.info("Key Name")
                        logger.info(prex + fname)

                        let fileStream = fs.createReadStream(path + "/" + items[i])
                        s3.putObject({
                            Bucket: bucketName,
                            Key: prex + fname,
                            Body: fileStream,
                            CacheControl: 'no-cache',
                        }, function(resp) {
                          //logger.info(arguments);
                           // console.log('Successfully uploaded package.');
                        });
                    }

                }
            });
        }).catch(
        function(err) {
            console.error(err, err.stack);
            logger.info("[Queue] upload file to S3 fails ")
            logger.info("Err")
            logger.info(err.stack)
            logger.info("[Queue] Send EMail To Client")
            logger.info(to)

            let subject = "upload files fails";
            let text = err.stack
            emailer.sendMail(config.mail.from, to, subject, text, html)
            return false;
        });
}




var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

//sent message to queue.

awsHander.sender = function(message, to) {
    let params = {
        MessageBody: message,
        QueueUrl: config.queue_url,
        DelaySeconds: 0,
        MessageDeduplicationId: uuid(),
        MessageGroupId: uuid()
    };
    sqs.sendMessage(params, function(err, data) {
        if (err) {

            logger.info("[Queue] Send Messages to S3 fails")
            logger.info("Err")
            logger.info(err.stack)
            logger.info("[Queue] Send EMail To Client")
            logger.info(to)
            let subject = "sent message to queue fails";
            let text = err.stack
            emailer.sendMail(config.mail.from, to, subject, text, html)
        } else {}
    });
}


awsHander.receiver = function(next, endCallback) {
    let params = {
        QueueUrl: config.queue_url,
        MaxNumberOfMessages: 1,
        ReceiveRequestAttemptId: uuid(),
        VisibilityTimeout: 5,
        WaitTimeSeconds: 0
    };
    let re = sqs.receiveMessage(params, function(err, data) {
        // once get message , del message from queue

        if (err) {
            console.log(err, err.stack);
            logger.info("[Queue] Receive Messages from S3 fails")
            logger.info("Err")
            logger.info(err.stack)
            if(endCallback!=null){endCallback()};
        }else {
            if (data.Messages) {
                awsHander.del(data.Messages[0].ReceiptHandle)
                next(data, data.email, endCallback)
            } else {
                console.log(data)
               if(endCallback!=null){endCallback()};
            }

        }
    });
}

awsHander.del = function(rec) {
    let params = {
        QueueUrl: config.queue_url,
        ReceiptHandle: rec
    };
    sqs.deleteMessage(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            logger.info("[Queue] Delete Messages from S3 fails")
            logger.info("Err")
            logger.info(err.stack)
        } else {
            logger.info("[Queue] Delete Messages from S3 Successfully")
            console.log(data);
        }
    });
}

awsHander.download = (projectId, filePath, next, configData, endCallback) => {
    logger.info("[Queue] Download files from S3 ")
    let params2 = {
        Bucket: config.bucketName,
        MaxKeys: 100,
        Prefix: projectId
    };
    s3.listObjects(params2, (err, data) => {
        if (err) {
            logger.info("[Queue] Download file from S3 fails")
            logger.info(params2)
            logger.info(err.stack)
            if(endCallback!=null){endCallback();}
        } else {

            let files = data.Contents;
            //console.log(files)
            for (var i in files) {
                // download all files 
                download(projectId, files[i].Key, filePath)
            }
            setTimeout(function() {
                next(configData, endCallback)
            }, 200 * i);

        }
    })
}


download = (projectId, key, filePath) => {
    var params = {
        Bucket: config.bucketName,
        Key: key
    }

    s3.getObject(params, (err, data) => {
        if (err) {
            console.error(err);

            logger.info("[Queue] Download file from S3 fails")
            logger.info("Err")
            logger.info(params)
            logger.info(err.stack)
        } else {

            if (!fs.existsSync(filePath + "/" + projectId)) {
                fs.mkdir(filePath + "/" + projectId,
                    function() {
                        fs.mkdir(filePath + "/" + projectId + "/config", function() {
                            fs.mkdir(filePath + "/" + projectId +"/input", function() {
                                fs.mkdir(filePath + "/" + projectId + "/output");
                            });
                        });
                    });
            }
            logger.info("[Queue] Download file from S3")
            logger.info("file")
            logger.info(filePath + "/" + key)

            //let fileStream =fs.createReadStream(path + "/" + items[i])
            fs.writeFile(filePath + "/" + key, data.Body, function(err) {
                if (err) {
                    return console.log(err);
                }
            })
            logger.info(filePath + "/" + key + "has been created!")
        }
    })
}



module.exports = {
    awsHander
};