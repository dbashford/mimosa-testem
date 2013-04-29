"use strict"

exports.defaults = ->
  testem:
    exclude:["\\.min\\."]

exports.placeholder = ->
  """
  \t

    # testem:                  # Configuration for testem test running
      # exclude:[/\\.min\\./]
  """

exports.validate = (config, validators) ->
  errors = []
  if validators.ifExistsIsObject(errors, "minify config", config.testem)
    # do something

  errors
