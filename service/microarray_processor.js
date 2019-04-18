var express = require('express');
var session = require('express-session');
var router = express.Router();
var R = require("../components/R");
var config = require('../config');
var logger = require('../components/queue_logger');
var queue = require('../components/queue');
var emailer = require('../components/mail');
var fs = require('fs');
var path = require('path');
const AWS = require('aws-sdk');
var uuid = require('uuid');
var AsyncPolling = require('async-polling');
var dateFormat = require('dateformat');
var rimraf = require("rimraf");
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

queue.awsHander.getQueueUrl(function(flag) {
    if (flag) {
        logger.info("[Queue] Start queue");
        setTimeout(function() { polling(); }, 1000);

    } else {
        logger.info("[Queue] Start queue fails");
        logger.info("[Queue] Fail to get queue url by queue name");
    }
})

function polling() {
    AsyncPolling(function(end) {
        try {
            queue.awsHander.receiver(qAnalysis, end, function(err) {
                logger.info(err)
                logger.info("receiver err")
                end()
            });

        } catch (err) {
            logger.info(err)
            logger.info("receiver err")
            end()
        }
        // Then notify the polling when your job is done:
    }, config.queue_request_interval * 1000).run();
}

function qAnalysis(data, emailto, endCallback) {
    console.log("qAnalysis")
    let message = JSON.parse(data.Messages[0].Body)
    let i = 1;
    queue.awsHander.changeMessageVisibility(data.Messages[0].ReceiptHandle, i * 90);
    let setVisibility = setInterval(function() {
        i = i + 1;
        if (i === 360) clearInterval(setVisibility); // pending for 6 hours then clearInterval
        logger.info("qAnalysis interval:", i);
        queue.awsHander.changeMessageVisibility(data.Messages[0].ReceiptHandle, i * 90);
    }, 45 * 1000);



    queue.awsHander.download(message.projectId, config.uploadPath, function(flag) {
        logger.info("Get R result ", flag);
        if (flag) {
            r(message, function() {

                logger.info("del queue message");
                queue.awsHander.del(data.Messages[0].ReceiptHandle)
                endCallback();
                logger.info("clear Visibility");
                clearInterval(setVisibility);
            })
        } else {
            logger.info("del queue message");
            queue.awsHander.del(data.Messages[0].ReceiptHandle)
            endCallback();
            logger.info("clear Visibility");
            clearInterval(setVisibility);

        }
    });
}

function secondToDate(result) {
    var h = Math.floor(result / 3600);
    var m = Math.floor((result / 60 % 60));
    var s = Math.floor((result % 60));
    return result = h + " hours " + m + " minutes " + s + " seconds";
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
    d.push(data.normal);
    d.push(data.source);
    d.push(config.configPath);

    logger.info("[Queue] Run Analysis")
    logger.info("Input")
    logger.info(JSON.stringify(d))

    R.execute("wrapper.R", d, function(err, returnValue) {
        endCallback();
        let end = new Date() - start;
        var now = new Date();
        let code = "";
        if (data.source == "fetch") {
            code = "<p>&nbsp;&nbsp;Accession Code: <b>" + data.code + "</b></p>";
        } else {
            code = "<p>&nbsp;&nbsp;CEL Files: <b>" + data.dataList + "</b></p>";
        }
        if (err) {

            logger.info("[Queue] Run Contrast fails ", err)
            logger.info("[Queue] Send fails message  to client ", data.email)
            let subject = "MicroArray Contrast Results -" + dateFormat(now, "yyyy_mm_dd_h_MM") + "(FAILED)";
            let html = emailer.emailFailedTemplate(code, secondToDate(end / 1000), data.submit, d[1])
            emailer.sendMail(config.mail.from, data.email, subject, "text", html)
            logger.info("clear result");
            cleanData(data.projectId, config.uploadPath);

        } else {
            fs.readFile(config.uploadPath + "/" + data.projectId + "/result.txt", 'utf8', function(err, returnValue) {
                if (err) {
                    logger.info("[Queue] Run Contrast fails ", err)
                    logger.info("[Queue] Send fails message  to client ", data.email)
                    let subject = "MicroArray Contrast Results -" + dateFormat(now, "yyyy_mm_dd_h_MM") + "(FAILED)";
                    let html = emailer.emailFailedTemplate(code, secondToDate(end / 1000), data.submit, d[1])
                    emailer.sendMail(config.mail.from, data.email, subject, "text", html)
                    logger.info("clear result");
                    cleanData(data.projectId, config.uploadPath);
                } else {
                    queue.awsHander.upload(config.uploadPath + "/" + data.projectId, config.queue_input_path + "/" + data.projectId + "/", function(flag) {
                        if (flag) {
                            logger.info("[Queue] Execution time: %dms", end);
                            logger.info("[Email] Send Message to client", data.email);
                            let html = emailer.emailTemplate(code, secondToDate(end / 1000), config.microarray_link + "?" + d[1], data.submit, d[1])
                            let subject = "MicroArray Contrast Results -" + dateFormat(now, "yyyy_mm_dd_h_MM");
                            // emailer.sendMail(config.mail.from,data.email,subject, "", html)
                            emailer.sendMail(config.mail.from, data.email, subject, "", html)
                        } else {
                            logger.info("[Queue] Run Contrast fails ", err)
                            logger.info("[Queue] Send fails message  to client ", data.email)
                            let subject = "MicroArray Contrast Results -" + dateFormat(now, "yyyy_mm_dd_h_MM") + "(FAILED)";
                            let html = emailer.emailFailedTemplate(code, secondToDate(end / 1000), data.submit, d[1])
                            emailer.sendMail(config.mail.from, data.email, subject, "text", html)
                        }
                        logger.info("clear result");
                        cleanData(data.projectId, config.uploadPath);
                    });
                }
            });
        }

    });
}

function cleanData(pid, uploadPath) {
    try {
        //rimraf.sync(uploadPath + "/" + pid);
    } catch (err) {
        logger.info("[Queue] Delete result files fails  ", err)
    }

}