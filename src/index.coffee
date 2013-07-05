"use strict"

ci = require './testem-ci'
config = require './config'

registration = (mimosaConfig, register) ->
  if mimosaConfig.isBuild or mimosaConfig.isWatch
    e = mimosaConfig.extensions
    register ['postBuild'], 'beforePackage', _runTests
    register ['add','update','remove'], 'afterOptimize', _runTests, [e.javascript..., e.template...]

_runTests = (mimosaConfig, options, next) ->
  ci mimosaConfig, next

module.exports =
  registration:    registration
  defaults:        config.defaults
  placeholder:     config.placeholder
  validate:        config.validate