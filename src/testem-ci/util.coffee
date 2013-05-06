_parseTestCount = (str, regex) ->
  num = 0
  str.split('\n').forEach (line) ->
    if regex.test(line)
      num = line.match(/\d+$/)[0]

  parseInt num, 10

exports.parseTestsSuccessful = (str) ->
  _parseTestCount( str, /# pass \s+[0-9]+/ )

exports.parseTestsFailed = (str) ->
  _parseTestCount( str, /# fail \s+[0-9]+/ )

exports.craftErrorOutput = (stdout) ->
  splits = stdout.split('not ok')
  splits.shift()
  splits.map (item) ->
    "not ok" + item.substring(0, item.lastIndexOf('...'))
  .join("\n")