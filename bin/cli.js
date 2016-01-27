#!/usr/bin/env node

'use strict';

const AWS = require('aws-sdk');
const fs = require('graceful-fs');
const pkg = require('../package.json');
const program = require('commander');
const safeJSON = require('json-parse-helpfulerror')

program
  .version(pkg.version)

program
  .arguments('<file>')
  .option('-t, --target', 'either TopicArn or EndpointArn, but not both.')
  .option('-m, --message', 'the message you want to send to the topic.')
  .action(function(file, options) {
    var message = program.message || 'Test notification from Amazon SNS';

    var data = readJson(file);
    var o = parseJson(file, data);

    AWS.config.loadFromPath(file);
    var sns = new AWS.SNS();
    var params = {
      Message: message,
      TargetArn: program.target,
    };
    sns.publish(params, function(err, data) {
      if (err) console.log(err);
      else     console.log(data);
    });
  })
  .parse(process.argv);

function readJson(file) {
  return fs.readFileSync(file, 'utf8');
}

function parseJson(file, data) {
  try {
    return safeJSON.parse(data)
  } catch (err) {
    parseError(err, file);
  }
}

function parseError(err, file) {
  var e = new Error('Failed to parse json\n' + err.message);
  e.file = file;
  return e;
}
