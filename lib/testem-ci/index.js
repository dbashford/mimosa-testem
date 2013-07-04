"use strict";
var exec, fs, logger, path, testUtil, testemCiCommand, _exec, _execWindowsIsAwesome;

exec = require('child_process').exec;

path = require('path');

fs = require('fs');

logger = require('logmimosa');

testUtil = require('./util');

testemCiCommand = path.join(__filename, "../../../node_modules/.bin/testem") + " ci";

module.exports = function(config, next) {
  if (process.platform === "win32") {
    return _execWindowsIsAwesome(config, next);
  } else {
    return _exec(config, next);
  }
};

_execWindowsIsAwesome = function(config, next) {
  var mimosaTempDir, outFile;
  mimosaTempDir = path.join(config.root, ".mimosa");
  if (!fs.existsSync(mimosaTempDir)) {
    fs.mkdirSync(mimosaTempDir);
  }
  outFile = path.join(mimosaTempDir, "testemsimpleoutput");
  testemCiCommand = testemCiCommand + " > " + outFile;
  return exec(testemCiCommand, function(error, stdout) {
    var testsFailed, testsPassed, totalTests;
    if (fs.existsSync(outFile)) {
      stdout = fs.readFileSync(outFile, "utf8");
      fs.unlinkSync(outFile);
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
    } else {
      logger.error("Test execution resulted in no output.");
    }
    return next();
  });
};

_exec = function(config, next) {
  return exec(testemCiCommand, function(error, stdout) {
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
