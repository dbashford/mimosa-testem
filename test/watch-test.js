var cp = require('child_process')
  , exec = cp.exec
  , utils = require( './util' )
  , path  = require( 'path' )
  , fs = require( 'fs')
  , psTree = require( 'ps-tree');

describe('Will provide proper messaging', function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "failed" );
  var logPath = path.join( env.projectDir, "log.txt" )
  var standardErr;

  before(function(done){
    utils.cleanProject( env );
    utils.setupProject( env, "failedtest" );

    var cwd = process.cwd();
    process.chdir( env.projectDir );
    var child = exec( "mimosa watch &> log.txt", function ( err, sout, serr ) {});
    setTimeout(function(){
      // clean up processes
      psTree( child.pid, function( err, children ) {
        children.forEach(function( c ) {
          process.kill(c.PID)
        });
        process.kill(child.pid)
        process.chdir(cwd);
        done();
      })
    }, 4000);
  });

  after(function() {
    utils.cleanProject( env );
  });

  it( "when tests fail during watch", function() {
    var textLines = fs.readFileSync( logPath, "utf8" ).split("\n")
    expect( textLines[1].substring(8) ).to.equal( " - \u001b[31m\u001b[1mERROR\u001b[0m - 3 of 24 tests failed for \u001b[36mtest-config/testem.json\u001b[0m." );
    expect( textLines[5] ).to.equal( "            expected false to be true" );
  });
});


describe('Will provide proper messaging', function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "watch-ok" );
  var logPath = path.join( env.projectDir, "log.txt" )
  var standardErr;

  before(function(done){
    utils.cleanProject( env );
    utils.setupProject( env, "oneconfig" );

    var cwd = process.cwd();
    process.chdir( env.projectDir );
    var child = exec( "mimosa watch &> log.txt", function ( err, sout, serr ) {});
    setTimeout(function(){
      // clean up processes
      psTree( child.pid, function( err, children ) {
        children.forEach(function( c ) {
          process.kill(c.PID)
        });
        process.kill(child.pid)
        process.chdir(cwd);
        done();
      })
    }, 4000);
  });

  after(function() {
    utils.cleanProject( env );
  });

  // minimal messaging during watch
  it( "when tests do not fail during watch", function() {
    var textLines = fs.readFileSync( logPath, "utf8" ).split("\n")
    expect( textLines[1].substring(8) ).to.equal( " - \u001b[32mSuccess\u001b[0m - 24 of 24 tests passed for \u001b[36mtest-config/testem.json\u001b[0m." );
    expect( textLines.length ).to.equal(3)
  });
});