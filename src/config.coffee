"use strict"

path = require "path"
fs = require "fs"

exports.defaults = ->
  testemSimple:
    configFile: "testem.json"
    port: null

exports.placeholder = ->
  """
  \t

    # testemSimple:               # Configuration for the testem-simple module
      # configFile: "testem.json" # path from the root of the mimosa application to the testem
                                  # config file.
      # port: null                # port to run the ci server on. If you re running ci and non-ci
                                  # at the same time, this setting allows you to avoid running on
                                  # same port

  """

exports.validate = (config, validators) ->

  errors = []
  if validators.ifExistsIsObject(errors, "testemSimple config", config.testemSimple)
    validators.ifExistsIsNumber(errors, "testemSimple.port", config.testemSimple.port)

    if validators.ifExistsIsString(errors, "testemSimple.configFile", config.testemSimple.configFile)
      config.testemSimple.configFile = path.join config.root, config.testemSimple.configFile
      if fs.existsSync config.testemSimple.configFile
        try
          require config.testemSimple.configFile
        catch err
          if err
            errors.push "Error attempting to require testemSimple.configFile: #{err}"
      else
        errors.push "Cannot resolve location of testemSimple.configFile, [[ #{config.testemSimple.configFile} ]]"

  errors
