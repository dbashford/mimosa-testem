"use strict";
var exec, logger, path, testUtil, testemCiCommand;

exec = require('child_process').exec;

path = require('path');

logger = require('logmimosa');

testUtil = require('./util');

testemCiCommand = path.join(__filename, "../../../node_modules/.bin/testem") + " ci";

module.exports = function(config, next) {
  var command;
  command = testemCiCommand + " --file " + config.testemSimple.configFile;
  return exec(command, function(error, stdout) {
    var testsFailed, testsPassed, totalTests;
    testsPassed = testUtil.parseTestsSuccessful(stdout);
    if (error) {
      testsFailed = testUtil.parseTestsFailed(stdout);
      totalTests = testsFailed + testsPassed;
      logger.error("" + testsFailed + " of " + totalTests + " tests failed.");
      if (config.isBuild) {
        console.error(stdout);
      } else {
        console.error(testUtil.craftErrorOutput(stdout));
      }
    } else {
      logger.success("" + testsPassed + " of " + testsPassed + " tests passed.");
      if (config.isBuild) {
        console.log(stdout);
      }
    }
    return next();
  });
};
