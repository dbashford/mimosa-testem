"use strict";
var fs, path;

path = require("path");

fs = require("fs");

exports.defaults = function() {
  return {
    testemSimple: {
      configFile: "testem.json",
      port: null,
      exclude: [],
      watch: []
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n  # testemSimple:               # Configuration for the testem-simple module\n    # configFile: \"testem.json\" # path from the root of the mimosa application to the testem\n                                # config file.\n    # port: null                # port to run the ci server on. If you re running ci and non-ci\n                                # at the same time, this setting allows you to avoid running on\n                                # same port\n\n    ###\n    # \"watch\" is an array of strings, folders and files whose contents trigger re-running all tests when\n    # they are changed.  Can be relative to the base of the project or can be absolute\n    ###\n    # watch: []\n    # exclude:[]           # An array of regexs or strings that match files to exclude from\n                           # re-running the tests. Can be a mix of regex and strings. Strings\n                           # should be a path relative to the base of the project (location of\n                           # mimosa-config) or absolute. ex: [/\.txt$/,\"src/README.md\"]\n";
};

exports.validate = function(config, validators) {
  var err, errors, folder, newFolderPath, newFolders, _i, _len, _ref;
  errors = [];
  if (validators.ifExistsIsObject(errors, "testemSimple config", config.testemSimple)) {
    validators.ifExistsIsNumber(errors, "testemSimple.port", config.testemSimple.port);
    if (validators.ifExistsIsString(errors, "testemSimple.configFile", config.testemSimple.configFile)) {
      config.testemSimple.configFile = path.join(config.root, config.testemSimple.configFile);
      if (fs.existsSync(config.testemSimple.configFile)) {
        try {
          require(config.testemSimple.configFile);
        } catch (_error) {
          err = _error;
          if (err) {
            errors.push("Error attempting to require testemSimple.configFile: " + err);
          }
        }
      } else {
        errors.push("Cannot resolve location of testemSimple.configFile, [[ " + config.testemSimple.configFile + " ]]");
      }
    }
    if (config.testemSimple.watch != null) {
      if (Array.isArray(config.testemSimple.watch)) {
        newFolders = [];
        _ref = config.testemSimple.watch;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          folder = _ref[_i];
          if (typeof folder === "string") {
            newFolderPath = validators.determinePath(folder, config.root);
            if (fs.existsSync(newFolderPath)) {
              newFolders.push(newFolderPath);
            }
          } else {
            errors.push("testemSimple.watch must be an array of strings.");
          }
        }
        config.testemSimple.watch = newFolders;
      } else {
        errors.push("testemSimple.watch must be an array.");
      }
    }
    validators.ifExistsFileExcludeWithRegexAndString(errors, "testemSimple.exclude", config.testemSimple, config.root);
  }
  return errors;
};
