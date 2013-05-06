var _parseTestCount;

_parseTestCount = function(str, regex) {
  var num;

  num = 0;
  str.split('\n').forEach(function(line) {
    if (regex.test(line)) {
      return num = line.match(/\d+$/)[0];
    }
  });
  return parseInt(num, 10);
};

exports.parseTestsSuccessful = function(str) {
  return _parseTestCount(str, /# pass \s+[0-9]+/);
};

exports.parseTestsFailed = function(str) {
  return _parseTestCount(str, /# fail \s+[0-9]+/);
};

exports.craftErrorOutput = function(stdout) {
  var splits;

  splits = stdout.split('not ok');
  splits.shift();
  return splits.map(function(item) {
    return "not ok" + item.substring(0, item.lastIndexOf('...'));
  }).join("\n");
};
