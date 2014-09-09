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
      utils.cleanProject( env );
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

// project doesn't have a file at that location
var expected2 =
  " * Cannot resolve location of testemSimple.configFile, \u001b[36mtestem.json\u001b[0m \n";
test("bad-config2", "when testem-simple is an empty object and the defaults are used, 2", expected2);

var expected3 =
  " * testemSimple.port must be a number.\n" +
  " * testemSimple.configFile must be a string or an array of strings\n" +
  " * testemSimple.watch must be an array.\n" +
  " * testemSimple.exclude must be an array \n";
test("bad-config3", "when all config settings are bad, 3", expected3);

var expected4 =
  "";
test("not-really-bad-config4", "when all config settings are null (won't error out), 4", expected4);

var expected5 =
  " * testemSimple.configFile must be a string or an array of strings\n" +
  " * testemSimple.watch must be an array of strings.\n" +
  " * testemSimple.exclude must be an array of strings and/or regexes. \n";
test("bad-config5", "when all the arrays have wrong values, 5", expected5);

var expected6 =
  " * testemSimple.configFile must be a string or an array of strings\n" +
  " * testemSimple.watch must be an array of strings.\n" +
  " * testemSimple.watch must be an array of strings.\n" +
  " * testemSimple.exclude must be an array of strings and/or regexes. \n";
test("bad-config6", "when the arrays have right and wrong values, 6", expected6);
