"use strict";
var exec, logger, path, runTestemCi, testemCiCommand;

exec = require('child_process').exec;

path = require('path');

logger = require('logmimosa');

testemCiCommand = path.join(__filename, "../../../node_modules/.bin/testem") + " ci";

runTestemCi = function(config, next) {
  return exec(testemCiCommand, function(error, stdout, stderr) {
    if (error) {
      logger.error("mimosa-testem: testem execution failed ", error);
      return next();
    }
    console.log("*******************");
    console.log(stdout);
    console.log("*******************");
    return next();
  });
};

module.exports = runTestemCi;
