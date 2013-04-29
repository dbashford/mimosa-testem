"use strict"

config = require './config'
ci = require './testem-ci'


registration = (mimosaConfig, register) ->
  if mimosaConfig.isBuild or mimosaConfig.isWatch
    e = mimosaConfig.extensions
    register ['postBuild'], 'beforePackage', _runTests
    register ['add','update','remove'], 'afterOptimize', _runTests, e.javascript

_runTests = (mimosaConfig, options, next) ->
  ci(mimosaConfig, next)

registerCommand = (program, retrieveConfig) ->
  program
    .command('testem')
    .description("Execute testem tests")
    .action ->
      retrieveConfig false, config ->
        console.log("Test command is TDB.")

module.exports =
  registration:    registration
  registerCommand: registerCommand
  defaults:        config.defaults
  placeholder:     config.placeholder
  validate:        config.validate