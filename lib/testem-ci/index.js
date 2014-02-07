"use strict";
var exec, path, testUtil, testemCiCommand;

exec = require('child_process').exec;

path = require('path');

testUtil = require('./util');

testemCiCommand = path.join(__filename, "../../../node_modules/.bin/testem") + " ci";

module.exports = function(config, next) {
  var command;
  command = testemCiCommand + " --file " + config.testemSimple.configFile;
  if (config.testemSimple.port) {
    command += " --port " + config.testemSimple.port;
  }
  return exec(command, function(error, stdout) {
    var testsFailed, testsPassed, totalTests;
    testsPassed = testUtil.parseTestsSuccessful(stdout);
    if (error) {
      testsFailed = testUtil.parseTestsFailed(stdout);
      totalTests = testsFailed + testsPassed;
      config.log.error("" + testsFailed + " of " + totalTests + " tests failed.");
      if (config.isBuild) {
        console.error(stdout);
      } else {
        console.error(testUtil.craftErrorOutput(stdout));
      }
    } else {
      config.log.success("" + testsPassed + " of " + testsPassed + " tests passed.");
      if (config.isBuild) {
        console.log(stdout);
      }
    }
    return next();
  });
};
