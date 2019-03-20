const AWS = require('aws-sdk');
var uuid = require('uuid');
const fs = require('fs');
var config = require('../config');
var lib_path = require('path');
var logger = require('../components/queue_logger');
var bucketName = config.bucketName;
AWS.config.update({ region: 'us-east-1' });
var awsHander = {};
var s3 = new AWS.S3({ apiVersion: '2006-03-01' });
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

awsHander.getQueueUrl = function(next) {
    var params = {
        QueueName: config.queue_name
    };
    sqs.getQueueUrl(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            logger.info("[Queue]Get QueueUrl Fails " + err.stack)
            global.queue_url = "none";
            next(false);
        } else {
            logger.info("[Queue] Queue URL is " + data.QueueUrl)
            global.queue_url = data.QueueUrl;
            next(true);
        }
    });
}

awsHander.upload = function(path, prex,next) {
            fs.readdir(path, function(err, items) {
                for (var i = 0; i < items.length; i++) {
                    let fname = items[i];
                    let stat = fs.lstatSync(path + "/" + items[i]);
                    if (stat.isFile()) {
                        console.log(prex + fname);
                        let fileStream = fs.createReadStream(path + "/" + items[i])
                        s3.putObject({
                            Bucket: bucketName,
                            Key: prex + fname,
                            Body: fileStream,
                            CacheControl: 'no-cache',
                        }, function(err, data) {
                            logger.info("uplad finish")
                           logger.info("uplad err:"+err);
                           logger.info("uplad data:"+data);
                            logger.info("uplad err stack:"+err.stack);
                        });
                    }
                }
                next();
            });
       
}




awsHander.getQueueAttributes = function(attr, callback) {
    var params = {
        QueueUrl: global.queue_url,
        AttributeNames: attr
    };
    sqs.getQueueAttributes(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(-1)
        } else {
            msg = data;
            callback(data)
        }
    });

}

//sent message to queue.

awsHander.sender = function(message, to,errHandler) {
    function send() {
        let params = {
            MessageBody: message,
            QueueUrl: global.queue_url,
            DelaySeconds: 0,
            MessageDeduplicationId: uuid(),
            MessageGroupId: uuid()
        };
        sqs.sendMessage(params, function(err, data) {
            if (err) {
                logger.info("[Queue] Send Messages to Queue fails")
                logger.info("Err")
                logger.info(err.stack)
                errHandler(err,data);
            } else {
                logger.info("[Queue] Send Messages to Queue success");
            }
        });
    }
    if (global.queue_url == null) {
        awsHander.getQueueUrl(function() {
            send();
        })
    } else {
        send();
    }

}

awsHander.receiver = function(next, endCallback,errHandler) {
    let params = {
        QueueUrl: global.queue_url,
        MaxNumberOfMessages: 1,
        ReceiveRequestAttemptId: uuid(),
        VisibilityTimeout: 60,
        WaitTimeSeconds: 0
    };
    let re = sqs.receiveMessage(params, function(err, data) {
        // once get message , del message from queue
        if (err) {
            console.log(err, err.stack);
            logger.info("[Queue] Receive Messages from S3 fails")
            logger.info("Err")
            logger.info(err.stack)
            errHandler(err);
        } else {
            console.log(data)
            if (data.Messages) {
                let message = JSON.parse(data.Messages[0].Body)

                if (message.domain && message.domain == "microarray") {
                    
                    next(data, data.email, endCallback)
                }
            }else{
                if (endCallback) { endCallback() };
            }

        }
    });
}

awsHander.del = function(rec) {
    let params = {
        QueueUrl: global.queue_url,
        ReceiptHandle: rec
    };
    sqs.deleteMessage(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            logger.info("[Queue] Delete Messages from S3 fails")
            logger.info("Err")
            logger.info(err.stack)
        }
    });
}

awsHander.changeMessageVisibility = function(receiptHandle, timeout) {
    logger.info("Set Messages visibility")
    var visibilityParams = {
        QueueUrl: global.queue_url,
        ReceiptHandle: receiptHandle,
        VisibilityTimeout: timeout
    };
    sqs.changeMessageVisibility(visibilityParams, function(err, data) {
        if (err) {
            logger.info("queue visibility change fails: " + err)
        }
    });
}

awsHander.download = (projectId, filePath, next) => {
    let params2 = {
        Bucket: config.bucketName,
        MaxKeys: 9000,
        Prefix: config.queue_input_path+"/" + projectId
    };
    s3.listObjects(params2, (err, data) => {
        if (err) {
            logger.info("[Queue] Download file from S3 fails")
            logger.info(params2)
            logger.info(err.stack)
        } else {
            let files = data.Contents;
            logger.info(files)
            for (var i in files) {
                // download all files 
                download(projectId, files[i].Key, filePath)
            }
            setTimeout(function() {
                next()
            }, 200 * i);

        }
    })
}

download = (projectId, key, filePath) => {
    var params = {
        Bucket: config.bucketName,
        Key: key
    }
    logger.info("[Queue] Download file from S3 ")
    logger.info("Key:", key)
    s3.getObject(params, (err, data) => {
        if (err) {
            logger.info("[Queue] Download file from S3 fails")
            logger.info(params)
            logger.info(err.stack)
        } else {

            if (!fs.existsSync(filePath + "/" + projectId)) {
                fs.mkdir(filePath + "/" + projectId,
                    function() {
                        fs.mkdir(filePath + "/" + projectId + "/config", function() {
                            fs.mkdir(filePath + "/" + projectId + "/input", function() {
                                fs.mkdir(filePath + "/" + projectId + "/output");
                            });
                        });
                    });
            }
            // logger.info("[Queue] Download file from S3")
            // logger.info("file")
            // logger.info(filePath + "/" + projectId + "/" + key.replace("microarray/" + projectId + "/", ""))
            fs.writeFile(filePath + "/" + projectId + "/" + key.replace(config.queue_input_path + "/" + projectId + "/", ""), data.Body, function(err) {
                if (err) {
                    return console.log(err);
                }
            })
            // logger.info(filePath + "/" + projectId + "has been created!")
        }
    })
}

module.exports = {
    awsHander
};