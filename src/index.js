"use strict";

var ci = require( "./testem-ci" )
  , config = require( "./config" )
  , watch = require( "chokidar" )
  , logger = null
  , running = false;

var _runTests = function( mimosaConfig, options, next ) {
  if ( running ) {
    return next();
  }

  running = true;
  ci( mimosaConfig, function() {
    running = false;
    next();
  });
};

var _watchTestsSource = function( mimosaConfig, options, next ) {
  var watcher = null;

  var ignoreFunct = function( name ) {
    if ( mimosaConfig.testemSimple.excludeRegex ) {
      if ( name.match( mimosaConfig.testemSimple.excludeRegex ) ) {
        return true;
      }
    }

    if ( mimosaConfig.testemSimple.exclude ) {
      if ( mimosaConfig.testemSimple.exclude.indexOf( name ) > -1 ) {
        return true;
      }
    }

    return false;
  };

  if ( typeof mimosaConfig.testemSimple.watch === "string" ) {
    mimosaConfig.testemSimple.watch = [ mimosaConfig.testemSimple.watch ];
  }

  var watchCallback = function() {
    _runTests( mimosaConfig, options, next );
  };

  mimosaConfig.testemSimple.watch.forEach( function( folder ) {
    if ( watcher ) {
      logger.info( "testem adding watch folder [[ " + folder + " ]]" );
      watcher.add( folder );
    } else {
      logger.info( "testem watching [[ " + folder + " ]]" );

      watcher = watch.watch( folder, { ignored: ignoreFunct, persistent: true } );
      watcher.on( "add", watchCallback );
      watcher.on( "change", watchCallback );
      watcher.on( "unlink", watchCallback );
      watcher.on( "error", function( error ) {
        logger.error( "chokidar threw up with error ", error );
      });
    }
  });

  next();
};

var registration = function ( mimosaConfig, register ) {
  logger = mimosaConfig.log;

  if ( (mimosaConfig.isBuild || mimosaConfig.isWatch) && !mimosaConfig.isOptimize ) {
    var e = mimosaConfig.extensions;
    var exts = e.javascript.concat( e.template );
    register( ["postBuild"], "beforePackage", _runTests );
    register( ["add","update","remove"], "afterOptimize", _runTests, exts );
    register( ["postBuild"], "afterServer", _watchTestsSource );
  }
};

module.exports = {
  registration: registration,
  defaults:     config.defaults,
  placeholder:  config.placeholder,
  validate:     config.validate
};
