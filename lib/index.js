"use strict";
var ci, config, registration, _runTests,
  __slice = [].slice;

ci = require('./testem-ci');

config = require('./config');

registration = function(mimosaConfig, register) {
  var e;
  if (mimosaConfig.isBuild || mimosaConfig.isWatch) {
    e = mimosaConfig.extensions;
    register(['postBuild'], 'beforePackage', _runTests);
    return register(['add', 'update', 'remove'], 'afterOptimize', _runTests, __slice.call(e.javascript).concat(__slice.call(e.template)));
  }
};

_runTests = function(mimosaConfig, options, next) {
  return ci(mimosaConfig, next);
};

module.exports = {
  registration: registration,
  defaults: config.defaults,
  placeholder: config.placeholder,
  validate: config.validate
};
