## node-geckodriver [![Build Status](https://travis-ci.org/vladikoff/node-geckodriver.svg?branch=master)](https://travis-ci.org/vladikoff/node-geckodriver)

> Downloader for [github.com/mozilla/geckodriver/releases](https://github.com/mozilla/geckodriver/releases)

This puts `geckodriver` or `geckodriver.exe` into root if this module.

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
profile.setPreference('webdriver.gecko.driver', require('path').join(__dirname, '..', 'node_modules', 'geckodriver', 'geckodriver');
```

## Related Projects

* [node-chromedriver](https://github.com/giggio/node-chromedriver)

## Changelog

* 1.1.2 - fixed `require` by pointing `package.json main` property to the `lib` file.
* 1.1.0 - programmatic usage, added `bin` support.
* 1.0.0 - init release
