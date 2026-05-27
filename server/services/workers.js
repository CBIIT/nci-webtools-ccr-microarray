'use strict';

var { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs');
var { spawn } = require('child_process');
var path = require('path');
var logger = require('../components/logger');

function getWorker(workerType) {
  workerType = workerType || 'local';
  switch (workerType) {
    case 'local':
      return runLocalWorker;
    case 'fargate':
      return runFargateWorker;
    default:
      throw new Error('Unknown worker type: ' + workerType);
  }
}

function runLocalWorker(id) {
  return new Promise(function (resolve, reject) {
    var workerPath = path.resolve(__dirname, '..', 'worker.js');
    var child = spawn('node', [workerPath, id], {
      stdio: 'inherit',
      env: process.env,
    });

    child.on('close', function (code) {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error('Worker exited with code ' + code));
      }
    });

    child.on('error', function (err) {
      reject(err);
    });
  });
}

function runFargateWorker(id) {
  var env = process.env;
  var client = new ECSClient();
  var workerCommand = ['node', 'worker.js', id];

  var taskCommand = new RunTaskCommand({
    cluster: env.ECS_CLUSTER,
    count: 1,
    launchType: 'FARGATE',
    networkConfiguration: {
      awsvpcConfiguration: {
        securityGroups: env.SECURITY_GROUP_IDS.split(','),
        subnets: env.SUBNET_IDS.split(','),
      },
    },
    taskDefinition: env.WORKER_TASK_NAME,
    propagateTags: 'TASK_DEFINITION',
    overrides: {
      containerOverrides: [
        {
          name: 'worker',
          command: workerCommand,
        },
      ],
    },
  });

  return client.send(taskCommand).then(function (response) {
    logger.info('[Worker] Submitted Fargate RunTask: ' + workerCommand.join(' '));
    return response;
  });
}

module.exports = { getWorker, runLocalWorker, runFargateWorker };
