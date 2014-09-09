var exec  = require('child_process').exec
  , utils = require( './util' )
  , path  = require( 'path' );

describe('Will NOT error out on start up', function() {
  this.timeout(15000);

  var env = utils.setupProjectData( "defaults" );
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

  it( 'for all of the defaults simply pasted into the config', function() {
    // no module message means validation passed and moved on to compiling
    expect( standardOut ).to.contain( "Finished build" );
  });
});

var test = function( config, itDesc, expected, project ) {

  if ( !project ){ project = "oneconfig"; }

  describe('Will error out on start up', function() {
    this.timeout(15000);

    var env = utils.setupProjectData( config );
    var standardErr;

    before(function(done){
      utils.cleanProject( env );
      utils.setupProject( env, project );

      var cwd = process.cwd();
      process.chdir( env.projectDir );
      exec( "mimosa build", function ( err, sout, serr ) {
        standardErr = serr;
        done();
        process.chdir(cwd);
      });
    });

    after(function() {
      // utils.cleanProject( env );
    });

    it( itDesc, function() {
      standardErr = standardErr.split("\n").splice(1).join("\n");
      expect( standardErr ).to.equal( expected );
    });
  });
};

var expected1 =
  " * testemSimple config must be an object. \n";
test("bad-config1", "when testem-simple is null, 1", expected1);

