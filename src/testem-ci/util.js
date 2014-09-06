"use strict";

var _parseTestCount = function( str, regex ) {
  var num = 0;
  str.split("\n").forEach( function( line ) {
    if ( regex.test( line ) ) {
      num = line.match(/\d+$/)[0];
    }
  });

  return parseInt( num, 10 );
};

exports.parseTestsSuccessful = function( str ) {
  _parseTestCount( str, /# pass \s+[0-9]+/ );
};

exports.parseTestsFailed = function( str ) {
  _parseTestCount( str, /# fail \s+[0-9]+/ );
};

exports.craftErrorOutput = function( stdout ) {
  var splits = stdout.split( "not ok" );
  splits.shift();
  var msg = splits.map( function( item ) {
    return "not ok" + item.substring( 0, item.lastIndexOf( "..." ) );
  }).join( "\n" );
  return msg;
};
