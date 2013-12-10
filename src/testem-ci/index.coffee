"use strict"

exec = require('child_process').exec
path = require('path')
logger = require('logmimosa')
testUtil = require('./util')

testemCiCommand = path.join(__filename, "../../../node_modules/.bin/testem") + " ci"

module.exports = (config, next) ->
  command = testemCiCommand + " --file " + config.testemSimple.configFile
  if config.testemSimple.port
    command += " --port " + config.testemSimple.port
  exec command, (error, stdout) ->
    testsPassed = testUtil.parseTestsSuccessful( stdout )
    if error
      testsFailed = testUtil.parseTestsFailed( stdout )
      totalTests = testsFailed + testsPassed
      logger.error "#{testsFailed} of #{totalTests} tests failed."
      if config.isBuild
        console.error stdout
      else
        console.error testUtil.craftErrorOutput(stdout)
    else
      logger.success "#{testsPassed} of #{testsPassed} tests passed."
      if config.isBuild
        console.log stdout
    next()
