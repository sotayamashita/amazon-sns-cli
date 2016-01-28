#!/usr/bin/env node
'use strict';

const AWS = require('aws-sdk');
const pkg = require('../package.json');
const program = require('commander');

program
  .version(pkg.version)
  .arguments('<file>')
  .option('-t, --target', 'either TopicArn or EndpointArn, but not both.')
  .option('-m, --message', 'the message you want to send to the topic.')
  .action(function(file) {
    send(file);
  })
  .parse(process.argv);

function send(file) {
  AWS.config.loadFromPath(file);
  var message = program.message || 'Test notification from Amazon SNS';
  var sns = new AWS.SNS();
  var params = { Message: message, TargetArn: program.target, };
  sns.publish(params, function(err, data) {
    if (err) console.log(err);
    else     console.log(data);
  });
}
