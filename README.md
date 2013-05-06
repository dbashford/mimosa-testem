mimosa-testem-simple
===========

A simple testem integration module for Mimosa

## Overview

This module will involve itself in Mimosa's `build` and `watch` commands and execute your existing testem suite on startup and when JavaScript assets are saved.

For more information regarding Mimosa, see http://mimosajs.com

## Usage

Add `testem-simple` to your `mimosap-config`'s `modules` array.  That's all!

## Functionality

The testem-simple module will execute testem ci on startup and when JavaScript assets are saved.

If the current Mimosa run is a `build`, testem-simple will provide a simple one line status of the tests and output the build results as testem would have provided them.

If the current Mimosa run is a `watch`, testem-simple will provide a simple one line status, and if there are errors, output the results of the failed tests only.

This module assumes an existing testem suite with all the necessary files in place at the root of the Mimosa project.  This module will not provide any setup or configuration for testem.  Future Mimosa modules will save you the trouble of having to also setup testem, providing all you need out of the box.  This is not that module.

## Default Config

This module has no configuration.