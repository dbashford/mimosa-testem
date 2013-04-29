"use strict";exports.defaults = function() {
  return {
    testem: {
      exclude: ["\\.min\\."]
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n  # testem:                  # Configuration for testem test running\n    # exclude:[/\\.min\\./]";
};

exports.validate = function(config, validators) {
  var errors;

  errors = [];
  return errors;
};
