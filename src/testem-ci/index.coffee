"use strict"

exec = require('child_process').exec
path = require('path')
fs = require('fs')
logger = require('logmimosa')
testUtil = require('./util')

testemCiCommand = path.join(__filename, "../../../node_modules/.bin/testem") + " ci"

module.exports = (config, next) ->
  if process.platform is "win32"
    _execWindowsIsAwesome config, next
  else
    _exec config, next

_execWindowsIsAwesome = (config, next) ->
  mimosaTempDir = path.join config.root, ".mimosa"
  unless fs.existsSync mimosaTempDir
    fs.mkdirSync mimosaTempDir

  outFile = path.join mimosaTempDir, "testemsimpleoutput"
  testemCiCommand = testemCiCommand + " > " + outFile

  exec testemCiCommand, (error, stdout) ->
    if fs.existsSync outFile
      # stdout not reliable, reading it from log file
      stdout = fs.readFileSync outFile, "utf8"
      fs.unlinkSync outFile
      _processOutput stdout, config, error
    else
      logger.error "Test execution resulted in no output."

    next()

_exec = (config, next) ->
  exec testemCiCommand, (error, stdout) ->
    _processOutput stdout, config, error
    next()

_processOutput = (stdout, config, error) ->
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
