/**
 * mail component
 */

'use strict';

var config = require('../config');
var logger = require('./logger');
const nodeMailer = require('nodemailer');
const transporter = nodeMailer.createTransport(config.mail);


let emailTemplate = function (code,time,link,submit_time,project_id){ 

	return "<b>Dear User:</b><br/>" +
        "<p>&nbsp;&nbsp;The job you submitted to the MicroArray processor has been processed successfully using the MicroArrayPipeline R Package.</p>" +
        "<p><b>&nbsp;&nbsp;Job Information</b></p>" +
        "<p>&nbsp;&nbsp;Job Name: "+project_id+"</p>" +
        "<p>&nbsp;&nbsp;Accession Code: <b>" + code+ "</b></p>"+
        "<p>&nbsp;&nbsp;Submitted Time: <b>" +submit_time+ "</b> </p>"+
        "<p>&nbsp;&nbsp;Execution Time: <b>" +time+ "</b> </p>"+
        "<br/>" +
        "<p><b>&nbsp;&nbsp;Results</b></p>" +
        "<p>&nbsp;&nbsp;Fitting results can be downloaded through following link:. Any additional information are included below.</p><p> Fitting results can be downloaded through following links:</p>" +
        "<p>&nbsp;&nbsp;&nbsp;&nbsp;"+link+"</p>"+
        "<p>&nbsp;&nbsp;Please note that result links above will be available for the next 7 days.</p>" +
        "<br/>"+
        "<p>Please contact us at <a href=\"NCIPIMixtureWebAdmin@mail.nih.gov\" target=\"_top\">NCIPIMixtureWebAdmin@mail.nih.gov </a>for more information or if you have any questions.</p>"+
        "<br/>"+
        "<br/>"+
        "<p>Respectfully,</p>" +
        "<p>MicroArray Web Tool</p>";
    }


let emailFailedTemplate = function (code,time,submit_time,project_id){ 

    return "<b>Dear User:</b><br/>" +
        "<p>&nbsp;&nbsp;The job you submitted to the MicroArray processor failed to be processed using the MicroArrayPipeline R Package. Please correct and resubmit your data set.</p>" +
        "<p><b>&nbsp;&nbsp;Job Information</b></p>" +
        "<p>&nbsp;&nbsp;Job Name: "+project_id+"</p>" +
        "<p>&nbsp;&nbsp;Accession Code: <b>" + code+ "</b></p>"+
        "<p>&nbsp;&nbsp;Submitted Time: <b>" +submit_time+ "</b> </p>"+
        "<p>&nbsp;&nbsp;Execution Time: <b>" +time+ "</b> </p>"+
        "<br/>" +
        "<br/>" +
        "<p>Please contact us at <a href=\"NCIPIMixtureWebAdmin@mail.nih.gov\" target=\"_top\">NCIPIMixtureWebAdmin@mail.nih.gov </a>for more information or if you have any questions.</p>"+
        "<br/>"+
        "<br/>"+
        "<p>Respectfully,</p>" +
        "<p>MicroArray Web Tool</p>";
    }

var sendMail = function(from, to, subject, text, html) {
    let mailOptions = {
        from: from, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            logger.error(error);
            //next();
        } else {
            logger.info('Message %s sent: %s', info.messageId, info.response);
            //next(info);
        }
    });
};

//sendMail("jonkiky@gmail.com","jonkiky@gmail.com","test","none",html)

module.exports = {
    sendMail,emailTemplate
};