mimosa-testem-simple
===========

Testem integration module for Mimosa. This module will run your existing testem suite.

For more information on testem, https://github.com/airportyh/testem

For more information on Mimosa, http://mimosa.io

## Overview

This module will involve itself in Mimosa's `build` and `watch` commands and execute your existing testem suite on startup and when JavaScript assets are saved.

For more information regarding Mimosa, see http://mimosa.io

## Usage

Add `testem-simple` to your `mimosa-config`'s `modules` array.  That's all!

## Functionality

The testem-simple module will execute testem ci on startup and when JavaScript assets are saved.

If the current Mimosa run is a `build`, testem-simple will provide a simple one line status of the tests and output the build results as testem would have provided them.

If the current Mimosa run is a `watch`, testem-simple will provide a simple one line status, and if there are errors, output the results of the failed tests only.

This module assumes an existing testem suite with all the necessary files in place at the root of the Mimosa project.  This module will not provide any setup or configuration for testem.  [testem-require](https://github.com/dbashford/mimosa-testem-require), testem-qunit](https://github.com/neverfox/mimosa-testem-qunit), and [ember-test](https://github.com/dbashford/mimosa-ember-test) are those modules. They will build all of your configuration for you and then utilize `mimosa-testem-simple` to execute the tests.  Just write tests!

## Default Config

```javascript
testemSimple: {
  configFile: "testem.json",
  port: null,
  watch: [],
  exclude: [],
}
```

* `configFile`: the path from the root of the Mimosa application to the testem configuration file. This can also be an array of paths if you have multiple testem harnesses set up.
* `port`: port to run the ci server on. If you re running ci and non-ci at the same time, this setting allows you to avoid running on same port
* `watch` : an array of strings, folders and files whose contents trigger re-running all tests when they are changed. Can be relative to the base of the project or can be absolute
* `exclude`: An array of regexs or strings that match files to exclude from re-running the tests. Can be a mix of regex and strings. Strings should be a path relative to the base of the project (location of mimosa-config) or absolute. ex: `[/\.txt$/,"src/README.md"]`