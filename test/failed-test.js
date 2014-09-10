var exec  = require('child_process').exec
  , utils = require( './util' )
  , path  = require( 'path' );

describe('Will provide proper messaging', function() {
  this.timeout(20000);

  var env = utils.setupProjectData( "failed" );
  var standardErr;

  before(function(done){
    utils.cleanProject( env );
    utils.setupProject( env, "failedtest" );

    var cwd = process.cwd();
    process.chdir( env.projectDir );
    exec( "mimosa build", function ( err, sout, serr ) {
      standardErr = serr;
      done();
      process.chdir(cwd);
    });
  });

  after(function() {
    utils.cleanProject( env );
  });

  it( "when tests fail", function() {
    var errorMsgArray = standardErr.split("\n")
    expect( errorMsgArray.indexOf("# tests 24") ).to.equal( 64 );
    expect( errorMsgArray.indexOf("# pass  21") ).to.equal( 65 );
    expect( errorMsgArray.indexOf("# fail  3") ).to.equal( 66 );
    expect( errorMsgArray[0].substring(8) ).to.equal( " - \u001b[31m\u001b[1mERROR\u001b[0m - 3 of 24 tests failed for \u001b[36mtest-config/testem.json\u001b[0m." );
    expect( errorMsgArray[4].substring(8) ).to.equal( "    expected false to be true" );
    expect( errorMsgArray[14].substring(8) ).to.equal( "    expected true to be false" );
  });
});