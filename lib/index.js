"use strict";
var ci, config, logger, registration, running, watch, _, _runTests, _watchTestsSource,
  __slice = [].slice;

_ = require('lodash');

ci = require('./testem-ci');

config = require('./config');

watch = require('chokidar');

logger = null;

running = false;

registration = function(mimosaConfig, register) {
  var e;
  logger = mimosaConfig.log;
  if ((mimosaConfig.isBuild || mimosaConfig.isWatch) && !mimosaConfig.isOptimize) {
    e = mimosaConfig.extensions;
    register(['postBuild'], 'beforePackage', _runTests);
    register(['add', 'update', 'remove'], 'afterOptimize', _runTests, __slice.call(e.javascript).concat(__slice.call(e.template)));
    return register(['postBuild'], 'afterServer', _watchTestsSource);
  }
};

_runTests = function(mimosaConfig, options, next) {
  if (running) {
    return next();
  }
  running = true;
  return ci(mimosaConfig, function() {
    running = false;
    return next();
  });
};

_watchTestsSource = (function(_this) {
  return function(mimosaConfig, options, next) {
    var folder, ignoreFunct, watcher, _i, _len, _ref;
    watcher = null;
    ignoreFunct = function(name) {
      if (mimosaConfig.testemSimple.excludeRegex != null) {
        if (name.match(mimosaConfig.testemSimple.excludeRegex)) {
          return true;
        }
      }
      if (mimosaConfig.testemSimple.exclude != null) {
        if (mimosaConfig.testemSimple.exclude.indexOf(name) > -1) {
          return true;
        }
      }
      return false;
    };
    if (_.isString(mimosaConfig.testemSimple.watch)) {
      mimosaConfig.testemSimple.watch = [mimosaConfig.testemSimple.watch];
    }
    _ref = mimosaConfig.testemSimple.watch;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      folder = _ref[_i];
      if (watcher != null) {
        logger.info("testem adding watch folder " + folder);
        watcher.add(folder);
      } else {
        logger.info("testem watching " + folder);
        watcher = watch.watch(folder, {
          ignored: ignoreFunct,
          persistent: true
        });
        watcher.on('add', function(path) {
          return _runTests(mimosaConfig, options, next);
        });
        watcher.on('change', function(path) {
          return _runTests(mimosaConfig, options, next);
        });
        watcher.on('unlink', function(path) {
          return _runTests(mimosaConfig, options, next);
        });
        watcher.on('error', function(error) {
          return logger.error("chokidar threw up with error " + error);
        });
      }
    }
    return next();
  };
})(this);

module.exports = {
  registration: registration,
  defaults: config.defaults,
  placeholder: config.placeholder,
  validate: config.validate
};
