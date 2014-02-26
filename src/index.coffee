"use strict"

_ = require 'lodash'
ci = require './testem-ci'
config = require './config'
watch = require 'chokidar'

logger = null
running = false

registration = (mimosaConfig, register) ->
  logger = mimosaConfig.log

  if (mimosaConfig.isBuild or mimosaConfig.isWatch) and not mimosaConfig.isOptimize
    e = mimosaConfig.extensions
    register ['postBuild'], 'beforePackage', _runTests
    register ['add','update','remove'], 'afterOptimize', _runTests, [e.javascript..., e.template...]
    register ['postBuild'], 'afterServer', _watchTestsSource


_runTests = (mimosaConfig, options, next) ->
  return next() if running

  running = true
  ci mimosaConfig, () ->
    running = false
    next()

_watchTestsSource = (mimosaConfig, options, next) =>
  watcher = null

  localConfig = _.clone(mimosaConfig, true)
  ignoreFunct = (name) ->
    if mimosaConfig.testemSimple.excludeRegex?
      return true if name.match(mimosaConfig.testemSimple.excludeRegex)
    if mimosaConfig.testemSimple.exclude?
      return true if mimosaConfig.testemSimple.exclude.indexOf(name) > -1
    false

  logger.info ""
  if _.isString(mimosaConfig.testemSimple.watch)
    mimosaConfig.testemSimple.watch = [ mimosaConfig.testemSimple.watch ]

  for folder in mimosaConfig.testemSimple.watch
    if watcher?
      logger.info "testem adding watch folder #{folder}"

      watcher.add(folder)
    else
      logger.info "testem watching #{folder}"

      watcher = watch.watch(folder, {ignored: ignoreFunct, persistent: true})
      watcher.on 'add', (path) -> _runTests mimosaConfig, options, next
      watcher.on 'change', (path) -> _runTests mimosaConfig, options, next
      watcher.on 'unlink', (path) -> _runTests mimosaConfig, options, next
      watcher.on 'error', (error) -> logger.error "chokidar threw up with error #{error}"
        # just capturing error, not doing anything with it

  next()

module.exports =
  registration:    registration
  defaults:        config.defaults
  placeholder:     config.placeholder
  validate:        config.validate