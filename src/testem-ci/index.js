"use strict";

var exec = require( "child_process" ).exec
  , path = require( "path" )
  , testUtil = require( "./util" )
  , testemCiCommand = path.join( __filename, "../../../node_modules/.bin/testem" ) + " ci";

module.exports = function( config, next ) {
  var command = testemCiCommand + " --file " + config.testemSimple.configFile;
  if( config.testemSimple.port ) {
    command += " --port " + config.testemSimple.port;
  }

  exec( command, function( error, stdout ) {
    var testsPassed = testUtil.parseTestsSuccessful( stdout );
    if ( error ) {
      var testsFailed = testUtil.parseTestsFailed( stdout );
      var totalTests = testsFailed + testsPassed;
      config.log.error( testsFailed + " of " + totalTests + " tests failed." );
      if ( config.isBuild ) {
        /*eslint no-console:0 */
        console.error( stdout );
      } else {
        /*eslint no-console:0 */
        console.error( testUtil.craftErrorOutput( stdout ) );
      }
    } else {
      config.log.success( testsPassed + " of " + testsPassed + " tests passed." );
      if ( config.isBuild ) {
        /*eslint no-console:0 */
        console.log( stdout );
      }
    }
    next();
  });
};
