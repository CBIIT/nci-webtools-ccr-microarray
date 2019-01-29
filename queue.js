// Load the SDK and UUID
var AWS = require('aws-sdk');
var uuid = require('uuid');
var fs = require('fs');

var emailer = require('./components/mail');

// Create unique bucket name
var bucketName = 'node-sdk-sample12312312';
// Create name for uploaded object key
var keyName = 'hello_world.txt';

// Create a promise on S3 service object
var bucketPromise = new AWS.S3({ apiVersion: '2006-03-01' }).createBucket({ Bucket: bucketName }).promise();

var path = "/Users/cheny39/Documents/GitHub/apps/microarray/tmp/test"


AWS.config.update({ region: 'us-east-1' });

// Handle promise fulfilled/rejected states
// bucketPromise.then(
//     function(data) {

//         var path = "/Users/cheny39/Documents/GitHub/apps/microarray/tmp/test"


//         fs.readdir(path, function(err, items) {
//             for (var i = 0; i < items.length; i++) {

//                     if (items[i].endsWith("gz")) {
//                     	 let fname =items[i];
//                         fs.readFile(path + "/" + items[i], function(err, data) {

//                             console.log(fname);
//                             if (err) { throw err; }
//                             var base64data = new Buffer(data, 'binary');

//                             var s3 = new AWS.S3({ apiVersion: '2006-03-01' });
//                             s3.putObject({
//                                 Bucket: bucketName,
//                                 Key: fname,
//                                 Body: base64data,
//                                 ACL: 'public-read'
//                             }, function(resp) {
//                                 console.log(arguments);
//                                 console.log('Successfully uploaded package.');
//                                 let from = "NCIMicroArrayWebAdmin@mail.nih.gov";
//                                 let to ="yizhen.chen@nih.gov";
//                                 let subject ="test subject";
//                                 let text ="test text"
//                                 let html ="<b>test html</b><h1>Test H1</h1>"
//                                 emailer.sendMail(from, to, subject, text, html)
//                             });

//                         })
//                     }
//             }
//         });



//     }).catch(
//     function(err) {
//         console.error(err, err.stack);
//     });



var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
// var params = {
//   AWSAccountIds: [ /* required */
//     '742451734402',
//     /* more items */
//   ],
//   Actions: [ /* required */
//     'SendMessage',
//     /* more items */
//   ],
//   Label: 'STRING_VALUE', /* required */
//   QueueUrl: 'https://sqs.us-east-1.amazonaws.com/742451734402/jonkiky_microarray.fifo' /* required */
// };
// sqs.addPermission(params, function (err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });


// sent message to queue.
// var params = {
//   MessageBody: 'aaaaa', /* required */
//   QueueUrl: 'https://sqs.us-east-1.amazonaws.com/742451734402/jonkiky_microarray.fifo',
//   DelaySeconds: 0,
//   MessageAttributes: {
//     'Test': {
//       DataType: 'String', /* required */
//       StringValue: '53W5'
//     },
//   },
//   MessageDeduplicationId:uuid(),
//   MessageGroupId:uuid()
// };
// sqs.sendMessage(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });



// get message from queue
// var params = {
//   MessageBody: 'aaaaa', /* required */
//   QueueUrl: 'https://sqs.us-east-1.amazonaws.com/742451734402/jonkiky_microarray.fifo',
//   DelaySeconds: 0,
//   MessageAttributes: {
//     'Test': {
//       DataType: 'String', /* required */
//       StringValue: '53W5'
//     },
//   },
//   MessageDeduplicationId:uuid(),
//   MessageGroupId:uuid()
// };
// sqs.sendMessage(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });
var URL = 'https://sqs.us-east-1.amazonaws.com/742451734402/jonkiky_microarray.fifo'

// var params = {
//     QueueUrl: URL,
//     AttributeNames: [
//         "Test"
//     ],
//     MaxNumberOfMessages: 1,
//     ReceiveRequestAttemptId: uuid(),
//     VisibilityTimeout: 5,
//     WaitTimeSeconds: 0
// };
// var re = sqs.receiveMessage(params, function(err, data) {
//     if (err) console.log(err, err.stack); // an error occurred
//     else {
//         console.log(data.Messages[0].ReceiptHandle);
//         //del(data.Messages[0].ReceiptHandle)


//         var params = {
//             QueueUrl: URL,
//             /* required */
//             ReceiptHandle: data.Messages[0].ReceiptHandle /* required */
//         };
//         sqs.deleteMessage(params, function(err, data) {
//             if (err) console.log(err, err.stack); // an error occurred
//             else console.log(data); // successful response
//         });
//     } // successful response
// });



//const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
//async function main(){


// Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "mailfwd.nih.gov",
    port:25
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Fred Foo" <foo@example.com>', // sender address
    to: "yizhen.chen@nih.gov", // list of receivers
    subject: "Hello", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>" // html body
  };

    // send mail with defined transport object
  let info =  transporter.sendMail(mailOptions)

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//}

//main().catch(console.error);
//   // Generate test SMTP service account from ethereal.email
//   // Only needed if you don't have a real mail account for testing
//   let account = await nodemailer.createTestAccount();


//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: "mailfwd.nih.gov",
//     port: 465,
//     secure: true, // use SSL
//     auth: {
//         user: 'yizhen.chen@nih.gov',
//         pass: 'Cy2425%%'
//     }
//   });

//   // setup email data with unicode symbols
//   let mailOptions = {
//     from: 'yizhen <yizhen.chen@nih.gov>', // sender address
//     to: "jonkiky@gmail.com", // list of receivers
//     subject: "Hello", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>" // html body
//   };

//   // send mail with defined transport object
//   let info = await transporter.sendMail(mailOptions)

//   console.log("Message sent: %s", info.messageId);
//   // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
//   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }

// main().catch(console.error);
