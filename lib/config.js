"use strict";
var fs, path;

path = require("path");

fs = require("fs");

exports.defaults = function() {
  return {
    testemSimple: {
      configFile: "testem.json",
      port: null
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n  # testemSimple:               # Configuration for the testem-simple module\n    # configFile: \"testem.json\" # path from the root of the mimosa application to the testem\n                                # config file.\n    # port: null                # port to run the ci server on. If you re running ci and non-ci\n                                # at the same time, this setting allows you to avoid running on\n                                # same port\n";
};

exports.validate = function(config, validators) {
  var err, errors;
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
  }
  return errors;
};
