## node-geckodriver [![Build Status: Linux](https://travis-ci.org/vladikoff/node-geckodriver.svg?branch=master)](https://travis-ci.org/vladikoff/node-geckodriver) [![Build status: Windows](https://ci.appveyor.com/api/projects/status/s1e19ujtssxcn268/branch/master?svg=true)](https://ci.appveyor.com/project/vladikoff/node-geckodriver/branch/master) [![npm package](https://img.shields.io/npm/v/geckodriver.svg)](https://www.npmjs.com/package/geckodriver)

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

### Use it globally:

```
npm install -g geckodriver
geckodriver [args]
```

Note: This installs a `geckodriver` shell script that runs the executable, but on Windows, selenium-webdriver looks for `geckodriver.exe`. To use a global installation of this package with selenium-webdriver on Windows, copy or link `geckodriver.exe` to a location on your PATH (such as the NPM bin directory) after installing this package:

```
mklink %USERPROFILE%\AppData\Roaming\npm\geckodriver.exe %USERPROFILE%\AppData\Roaming\npm\node_modules\geckodriver\geckodriver.exe
```

## Setting a CDN URL for binary download

To set an alternate CDN location for geckodriver binaries, set the `GECKODRIVER_CDNURL` like this:

```
GECKODRIVER_CDNURL=https://INTERNAL_CDN/geckodriver/download
```

Binaries on your CDN should be located in a subdirectory of the above base URL. For example, `/vxx.xx.xx/*.tar.gz` should be located under `/geckodriver/download` above.

Alternatively, you can add the same property to your `.npmrc` file.

Default location is set to https://github.com/mozilla/geckodriver/releases/download

## Setting a PROXY URL

Use `HTTPS_PROXY` or `HTTP_PROXY` to set your proxy url.

## Setting a specific version

Use `GECKODRIVER_VERSION` if you require a specific version of gecko driver for your browser version.

## Using a cached download

Use `GECKODRIVER_FILEPATH` to point to a pre-downloaded geckodriver archive that should be extracted during installation.

## Skipping geckodriver download

Use `GECKODRIVER_SKIP_DOWNLOAD` to skip the download of the geckodriver file.


## Related Projects

* [node-chromedriver](https://github.com/giggio/node-chromedriver)

## Versions

* [npm module version] - [geckodriver version]
* 1.20.x - geckodriver 0.27.0
* 1.19.x - geckodriver 0.26.0
* 1.18.x - geckodriver 0.26.0
* 1.17.x - geckodriver 0.25.0
* 1.16.x - geckodriver 0.24.0 and `GECKODRIVER_VERSION` env support
* 1.15.x - geckodriver 0.24.0
* 1.14.x - geckodriver 0.23.0
* 1.13.x - geckodriver 0.22.0
* 1.12.x - geckodriver 0.21.0
* 1.11.x - geckodriver 0.20.0
* 1.10.x - geckodriver 0.19.1
* 1.9.x - geckodriver 0.19.0
* 1.8.x - geckodriver 0.18.0
* 1.7.x - geckodriver 0.17.0
* 1.6.x - geckodriver 0.16.1
* 1.5.x - geckodriver 0.15.0
* 1.4.x - geckodriver 0.14.0
* 1.3.x - geckodriver 0.13.0
* 1.2.x - geckodriver 0.11.1
* 1.1.x - geckodriver 0.10

## Changelog

* 1.20.0 - geckodriver 27. Requires node 8 and higher. Support `HTTPS_PROXY` env and npm_config_geckodriver_version variables.
* 1.19.0 - geckodriver 26. Dependency updates.
* 1.18.0 - geckodriver 26.
* 1.17.0 - geckodriver 25.
* 1.16.2 - fix issue with 'tar' dependency.
* 1.16.1 - added support for `GECKODRIVER_FILEPATH` env variable. 
* 1.16.0 - added support for `GECKODRIVER_VERSION` env variable. Set it to `'0.24.0'` to fetch that version.
* 1.15.1 - fix for the new `.npmignore` pattern matching
* 1.15.0 - geckodriver 0.24.0
* 1.14.0 - geckodriver 0.23.0
* 1.13.0 - geckodriver 0.22.0
* 1.12.2 - add proxy settings
* 1.12.1 - adm-zip security fix
* 1.12.0 - geckodriver 0.21.0
* 1.11.0 - geckodriver 0.20.0
* 1.10.0 - geckodriver 0.19.1, switch tar package, enable Win32 builds again, process.env.npm_config_geckodriver_cdnurl support
* 1.9.0 - updated to geckodriver 0.19.0 32-bit windows support removed.
* 1.8.1 - added geckodriver.exe bin for Windows
* 1.8.0 - updated to geckodriver 0.18.0
* 1.7.1 - 'GECKODRIVER_CDNURL' support added.
* 1.7.0 - updated to geckodriver 0.17.0  32-bit linux support added.
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
