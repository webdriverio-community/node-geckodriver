## node-geckodriver [![Build Status](https://travis-ci.org/vladikoff/node-geckodriver.svg?branch=master)](https://travis-ci.org/vladikoff/node-geckodriver)

> Downloader for [github.com/mozilla/geckodriver/releases](https://github.com/mozilla/geckodriver/releases)

This puts `geckodriver` or `geckodriver.exe` into root if this module.

## Usage

```
npm install geckodriver
```

Use it by setting WebDriver capabilities:

```
profile.setPreference('marionette', true);
profile.setPreference('webdriver.gecko.driver', require('path').join(__dirname, '..', 'node_modules', 'geckodriver', 'geckodriver');
```
