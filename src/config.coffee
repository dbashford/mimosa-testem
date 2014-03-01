"use strict"

path = require "path"
fs = require "fs"

exports.defaults = ->
  testemSimple:
    configFile: "testem.json"
    port: null
    exclude: []
    watch: []

exports.placeholder = ->
  """
  \t

    # testemSimple:               # Configuration for the testem-simple module
      # configFile: "testem.json" # path from the root of the mimosa application to the testem
                                  # config file.
      # port: null                # port to run the ci server on. If you re running ci and non-ci
                                  # at the same time, this setting allows you to avoid running on
                                  # same port

      ###
      # "watch" is an array of strings, folders and files whose contents trigger re-running all tests when
      # they are changed.  Can be relative to the base of the project or can be absolute
      ###
      # watch: []
      # exclude:[]           # An array of regexs or strings that match files to exclude from
                             # re-running the tests. Can be a mix of regex and strings. Strings
                             # should be a path relative to the base of the project (location of
                             # mimosa-config) or absolute. ex: [/\.txt$/,"src/README.md"]

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

    if config.testemSimple.watch?
      if Array.isArray(config.testemSimple.watch)
        newFolders = []
        for folder in config.testemSimple.watch
          if typeof folder is "string"
            newFolderPath = validators.determinePath folder, config.root
            if fs.existsSync newFolderPath
              newFolders.push newFolderPath
          else
            errors.push "testemSimple.watch must be an array of strings."
        config.testemSimple.watch =  newFolders
      else
        errors.push "testemSimple.watch must be an array."

    validators.ifExistsFileExcludeWithRegexAndString(errors, "testemSimple.exclude", config.testemSimple, config.root)

  errors
