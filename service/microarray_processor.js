express = require('express');
var session = require('express-session');
var router = express.Router();
var R = require("../components/R");
var config = require('../config');
var logger = require('../components/logger');
var queue = require('../components/queue');
var emailer = require('../components/mail');
var fs = require('fs');
var path = require('path');
const AWS = require('aws-sdk');
var uuid = require('uuid');
var AsyncPolling = require('async-polling');



var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

var params = {
    QueueName: config.queue_name
};
sqs.getQueueUrl(params, function(err, data) {
    if (err) {
        console.log(err, err.stack); // an error occurred
    } else {
        console.log(data)
        // change configuration file, set queue URLs
        let obj = JSON.parse(fs.readFileSync("../config/microarray_setting.json", 'utf8'));
        console.log(obj)
        obj.queue_url = data.QueueUrl;
        JSON.stringify(obj);
        fs.writeFile("../config/microarray_setting.json", JSON.stringify(obj), function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });

       setTimeout(function(){ polling(); }, 3000);
    }
});


function polling() {
    AsyncPolling(function(end) {
        try {

            queue.awsHander.receiver(qAnalysis, end);

        } catch (err) {
            end()
        }

        // Then notify the polling when your job is done:
    }, config.queue_request_interval * 1000).run();

}




function qAnalysis(data, emailto, endCallback) {
    let message = JSON.parse(data.Messages[0].Body)
    console.log("projectId:" + message.projectId)
    queue.awsHander.download(message.projectId, config.uploadPath, r, message, endCallback);

}

function r(data, endCallback) {



    let start = new Date();
    let d = [];
    //the content in data array should follow the order. Code projectId groups action pDEGs foldDEGs pPathways
    d.push("runContrast"); // action
    d.push(data.projectId);
    //data path
    d.push(config.uploadPath);
    d.push(data.code);
    d.push(data.groups);
    d.push(data.group_1);
    d.push(data.group_2);
    d.push(data.species);
    d.push(data.genSet);
    d.push(data.source);
    d.push(config.configPath);

    logger.info("[Queue] Run Analysis")
    logger.info("Input")
    logger.info(JSON.stringify(d))

    R.execute("wrapper.R", d, function(err, returnValue) {
        endCallback()
        if (err) {
            logger.info("[Queue] Run Contrast fails ", err)
            logger.info("[Queue] sendMail to  ", data.email)
            let subject = "Microarray Contrast Results - Job: Run Contrast";
            let html = "Run contrast fails : " + err;
            emailer.sendMail(config.mail.from, data.email, subject, "text", html)

        } else {
            let end = new Date() - start
            logger.info("[Queue] Execution time: %dms", end)
            logger.info("[Queue] sendMail to  ", data.email)
            // send email to user 
            let html = emailer.emailTemplate(d[3], end / 1000, config.microarray_link +"?"+ d[1])
            let subject = "Microarray Contrast Results - Job: Run Contrast";

            // emailer.sendMail(config.mail.from,data.email,subject, "", html)
            emailer.sendMail(config.mail.from, data.email, subject, "", html)
            uploadResultToS3(config.uploadPath + "/" + data.projectId, data.projectId)
        }
        console.log("end()")

    });
}

function uploadResultToS3(path, pid) {
    logger.info("[Queue] Upload Results to S3", path)
    queue.awsHander.upload(path, "microarray/"+pid + "/", "");

}