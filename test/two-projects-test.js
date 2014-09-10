var exec  = require('child_process').exec
  , utils = require( './util' )
  , path  = require( 'path' );

describe('Will execute tests and report separately', function() {
  this.timeout(20000);

  var env = utils.setupProjectData( "two-configs" );
  var standardErr;

  before(function(done){
    utils.cleanProject( env );
    utils.setupProject( env, "twoconfig" );

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

  it( "for two configs", function() {
    var errorMsgArray = standardErr.split("\n")
    expect( errorMsgArray[0].substring(8) ).to.equal( " - \u001b[31m\u001b[1mERROR\u001b[0m - 1 of 24 tests failed for \u001b[36mtest-config/testem.json\u001b[0m." );
    expect( errorMsgArray[46] ).to.equal( "# tests 24" );
    expect( errorMsgArray[48] ).to.equal( "# fail  1" );
    expect( errorMsgArray[50].substring(8) ).to.equal( " - \u001b[31m\u001b[1mERROR\u001b[0m - 1 of 24 tests failed for \u001b[36mtest-config/testem2.json\u001b[0m." );
    expect( errorMsgArray[96] ).to.equal( "# tests 24" );
    expect( errorMsgArray[98] ).to.equal( "# fail  1" );

  });
});

