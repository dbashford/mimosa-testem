"use strict";
var ci, config, registerCommand, registration, _runTests;

config = require('./config');

ci = require('./testem-ci');

registration = function(mimosaConfig, register) {
  var e;

  if (mimosaConfig.isBuild || mimosaConfig.isWatch) {
    e = mimosaConfig.extensions;
    register(['postBuild'], 'beforePackage', _runTests);
    return register(['add', 'update', 'remove'], 'afterOptimize', _runTests, e.javascript);
  }
};

_runTests = function(mimosaConfig, options, next) {
  return ci(mimosaConfig, next);
};

registerCommand = function(program, retrieveConfig) {
  return program.command('testem').description("Execute testem tests").action(function() {
    return retrieveConfig(false, config(function() {
      return console.log("Test command is TDB.");
    }));
  });
};

module.exports = {
  registration: registration,
  registerCommand: registerCommand,
  defaults: config.defaults,
  placeholder: config.placeholder,
  validate: config.validate
};
