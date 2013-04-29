"use strict"

exec = require('child_process').exec
path = require('path')
logger = require('logmimosa')


testemCiCommand = path.join(__filename, "../../../node_modules/.bin/testem") + " ci"

runTestemCi = (config, next) ->

  exec testemCiCommand, (error, stdout, stderr) ->
    if error
      logger.error "mimosa-testem: testem execution failed ", error
      return next()

    console.log "*******************"
    console.log stdout
    console.log "*******************"

    next()

module.exports = runTestemCi
