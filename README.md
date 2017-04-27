## node-geckodriver [![Build Status: Linux](https://travis-ci.org/vladikoff/node-geckodriver.svg?branch=master)](https://travis-ci.org/vladikoff/node-geckodriver) [![Build status: Windows](https://ci.appveyor.com/api/projects/status/s1e19ujtssxcn268/branch/master?svg=true)](https://ci.appveyor.com/project/vladikoff/node-geckodriver/branch/master)

> Downloader for [github.com/mozilla/geckodriver/releases](https://github.com/mozilla/geckodriver/releases)

This puts `geckodriver` or `geckodriver.exe` into root of this module.

## Install

```
npm install geckodriver
```

## Usage

There are several ways to use this module:

### Use the provided `geckodriver` from `bin` directory.

```
bin/geckodriver [args]
```

### Use it by requiring:

```
require('geckodriver');
```

### Use it by setting WebDriver capabilities:

```
profile.setPreference('marionette', true);
// Add log level if needed:
// profile.setPreference('marionette.logging', 'TRACE');
```

## Related Projects

* [node-chromedriver](https://github.com/giggio/node-chromedriver)

## Versions

* [npm module version] - [geckodriver version]
* 1.6.x - geckodriver 0.16.1
* 1.5.x - geckodriver 0.15.0
* 1.4.x - geckodriver 0.14.0
* 1.3.x - geckodriver 0.13.0
* 1.2.x - geckodriver 0.11.1
* 1.1.x - geckodriver 0.10

## Changelog

* 1.6.1 - updated to geckodriver 0.16.1
* 1.6.0 - updated to geckodriver 0.16.0. 32-bit linux support removed.
* 1.5.0 - updated to geckodriver 0.15.0.
* 1.4.0 - updated to geckodriver 0.14.0.
* 1.3.0 - updated to geckodriver 0.13.0.
* 1.2.1 - added support for Linux 32-bit.
* 1.2.0 - updated to geckodriver 0.11.1.
* 1.1.3 - adds Windows support, fixes Windows tests.
* 1.1.2 - fixed `require` by pointing `package.json main` property to the `lib` file.
* 1.1.0 - programmatic usage, added `bin` support.
* 1.0.0 - init release
