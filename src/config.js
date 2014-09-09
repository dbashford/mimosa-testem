"use strict";

var path = require( "path" )
  , fs = require( "fs" );

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
  var ph = "  testemSimple:               # Configuration for the testem-simple module\n" +
  "    configFile: \"testem.json\" # path from the root of the mimosa application to the testem\n" +
  "                              # config file. This can also be an array if there are multiple\n" +
  "                              # testem configurations to run.\n" +
  "    port: null                # port to run the ci server on. If you re running ci and non-ci\n" +
  "                              # at the same time, this setting allows you to avoid running on\n" +
  "                              # same port\n" +
  "    watch: []         # \"watch\" is an array of strings, folders and files whose contents\n" +
  "                      # trigger re-running all tests when they are changed.  Can be relative\n" +
  "                      # to the base of the project or can be absolute\n" +
  "    exclude:[]        # An array of regexs or strings that match files to exclude from\n" +
  "                      # re-running the tests. Can be a mix of regex and strings. Strings\n" +
  "                      # should be a path relative to the base of the project (location of\n" +
  "                      # mimosa-config) or absolute. ex: [/\.txt$/,\"src/README.md\"]\n\n";

  return ph;
};

exports.validate = function (config, validators) {

  var errors = [];
  if ( validators.ifExistsIsObject(errors, "testemSimple config", config.testemSimple) ) {
    validators.ifExistsIsNumber(errors, "testemSimple.port", config.testemSimple.port);

    var configFileError = false;
    if ( typeof config.testemSimple.configFile === "string" ) {
      config.testemSimple.configFile = [config.testemSimple.configFile];
    } else {
      if ( Array.isArray( config.testemSimple.configFile ) ) {
        config.testemSimple.configFile.forEach( function( configFile ) {
          if ( typeof configFile !== "string" ) {
            configFileError = true;
          }
        });
      } else {
        configFileError = true;
      }
    }

    if ( configFileError ) {
      errors.push( "testemSimple.configFile must be a string or an array of strings" );
    } else {
      config.testemSimple.configFile.forEach( function( configFile ) {
        configFile = path.join( config.root, configFile );
        if ( fs.existsSync( configFile ) ) {
          try {
            require( configFile );
          } catch ( err ) {
            errors.push( "Error attempting to require testemSimple.configFile: " + err );
          }
        } else {
          errors.push( "Cannot resolve location of testemSimple.configFile, [[ " + configFile + " ]]" );
        }
      });
    }

    if ( config.testemSimple.watch ) {
      if ( Array.isArray( config.testemSimple.watch ) ) {
        var newFolders = [];
        config.testemSimple.watch.forEach( function( folder ) {
          if ( typeof folder === "string" ) {
            var newFolderPath = validators.determinePath( folder, config.root );
            if ( fs.existsSync( newFolderPath ) ) {
              newFolders.push( newFolderPath );
            }
          } else {
            errors.push( "testemSimple.watch must be an array of strings." );
          }
        });
        config.testemSimple.watch = newFolders;
      } else {
        errors.push( "testemSimple.watch must be an array." );
      }
    }

    validators.ifExistsFileExcludeWithRegexAndString(errors, "testemSimple.exclude", config.testemSimple, config.root);
  }

  return errors;
};
