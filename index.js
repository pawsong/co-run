'use strict';

var exec = require('child_process').exec;

var defaultOptions = {
  stdout: process.stdout,
  stderr: process.stderr,
  stdin: process.stdin,
};

var optionKeys = Object.keys(defaultOptions);
var optionKeysLen = optionKeys.length;

module.exports = function (cmd, options, execOptions) {

  // Initialize co-run options
  options = options || {};

  var i = optionKeysLen,
      key;

  while (i--) {
    key = optionKeys[i];

    if (options[key] === undefined) {
      options[key] = defaultOptions[key];
    }
  }

  // Initialize exec options
  execOptions = execOptions || {};

  return function (cb) {

    if (typeof cmd !== 'string') {
      return cb(new Error('cmd must be a string'));
    }

    var cp = exec(cmd, execOptions, cb);

    var captureOutput = function (child, output) {
      if (typeof output === 'function') {
        child.on('data', output);
      } else {
        child.pipe(output);
      }
    };

    if (options.stdout) {
      captureOutput(cp.stdout, options.stdout);
    }

    if (options.stderr) {
      captureOutput(cp.stderr, options.stderr);
    }

    if (options.stdin) {

      if (options.stdin === process.stdin) {
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
      }

      options.stdin.pipe(cp.stdin);
    }

  };

};
