var exec  = require('child_process').exec
  , utils = require( './util' )
  , path  = require( 'path' );

describe('Will execute tests', function() {
  this.timeout(20000);

  var env = utils.setupProjectData( "single-config" );
  var standardOut;

  before(function(done){
    utils.cleanProject( env );
    utils.setupProject( env, "oneconfig" );

    var cwd = process.cwd();
    process.chdir( env.projectDir );
    exec( "mimosa build", function ( err, sout, serr ) {
      standardOut = sout;
      done();
      process.chdir(cwd);
    });
  });

  after(function() {
    // utils.cleanProject( env );
  });

  it( "for a single config", function() {
    var errorMsgArray = standardOut.split("\n")
    expect( errorMsgArray.indexOf("# tests 24") ).to.equal( 35 );
    expect( errorMsgArray[8].substring(8) ).to.equal( " - \u001b[32mSuccess\u001b[0m - 24 of 24 tests passed." );
  });
});


describe('Will execute tests', function() {
  this.timeout(20000);

  var env = utils.setupProjectData( "single-config-string" );
  var standardOut;

  before(function(done){
    utils.cleanProject( env );
    utils.setupProject( env, "oneconfig" );

    var cwd = process.cwd();
    process.chdir( env.projectDir );
    exec( "mimosa build", function ( err, sout, serr ) {
      standardOut = sout;
      done();
      process.chdir(cwd);
    });
  });

  after(function() {
    utils.cleanProject( env );
  });

  it( "for a single config with string config for file", function() {
    var errorMsgArray = standardOut.split("\n")
    expect( errorMsgArray.indexOf("# tests 24") ).to.equal( 35 );
    expect( errorMsgArray[8].substring(8) ).to.equal( " - \u001b[32mSuccess\u001b[0m - 24 of 24 tests passed." );
  });
});
