mimosa-testem-simple
===========

A simple testem integration module for Mimosa

## Overview

This module will involve itself in Mimosa's `build` and `watch` commands and execute your existing testem suite on startup and when JavaScript assets are saved.

For more information regarding Mimosa, see http://mimosajs.com

## Usage

Add `testem-simple` to your `mimosa-config`'s `modules` array.  That's all!

## Functionality

The testem-simple module will execute testem ci on startup and when JavaScript assets are saved.

If the current Mimosa run is a `build`, testem-simple will provide a simple one line status of the tests and output the build results as testem would have provided them.

If the current Mimosa run is a `watch`, testem-simple will provide a simple one line status, and if there are errors, output the results of the failed tests only.

This module assumes an existing testem suite with all the necessary files in place at the root of the Mimosa project.  This module will not provide any setup or configuration for testem.  [mimosa-testem-require](https://github.com/dbashford/mimosa-testem-require) is that module.  It will build all of your configuration for you and then utilize `mimosa-testem-simple` to execute the tests.  Just write tests!

## Default Config

```
  testemSimple:
    configFile: "testem.json"
```

* 'configFile': the path from the root of the mimosa application to the testem configuraiton file.