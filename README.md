Geckodriver [![CI](https://github.com/webdriverio-community/node-geckodriver/actions/workflows/ci.yml/badge.svg)](https://github.com/webdriverio-community/node-geckodriver/actions/workflows/ci.yml) [![Audit](https://github.com/webdriverio-community/node-geckodriver/actions/workflows/audit.yml/badge.svg)](https://github.com/webdriverio-community/node-geckodriver/actions/workflows/audit.yml)
==========

An NPM wrapper for Mozilla's [Geckodriver](https://github.com/mozilla/geckodriver). It manages to download various (or the latest) Geckodriver versions and provides a programmatic interface to start and stop it within Node.js. __Note:__ this is a wrapper module. If you discover any bugs with Geckodriver, please report them in the [official repository](https://github.com/mozilla/geckodriver).

# Installing

You can install this package via:

```sh
npm install geckodriver
```

Once installed you can start Geckodriver via:

```sh
npx geckodriver --port=4444
```

By default, this package downloads Geckodriver when used for the first time through the CLI or the programmatical interface. If you like to download it as part of the NPM install process, set the `GECKODRIVER_AUTO_INSTALL` environment flag, e.g.:

```sh
GECKODRIVER_AUTO_INSTALL=1 npm i
```

To get a list of available CLI options run `npx geckodriver --help`. By default this package downloads the latest version of the driver. If you prefer to have it install a custom Geckodriver version you can define the environment variable `GECKODRIVER_VERSION` when running in CLI, e.g.:

```sh
$ npm i geckodriver
$ GECKODRIVER_VERSION="0.33.0" npx geckodriver --version
geckodriver 0.31.0 (b617178ef491 2022-04-06 11:57 +0000)

The source code of this program is available from
testing/geckodriver in https://hg.mozilla.org/mozilla-central.

This program is subject to the terms of the Mozilla Public License 2.0.
You can obtain a copy of the license at https://mozilla.org/MPL/2.0/.
```

# Programmatic Interface

You can import this package with Node.js and start the driver as part of your script and use it e.g. with [WebdriverIO](https://webdriver.io).

## Exported Methods

The package exports a `start` and `download` method.

### `start`

Starts an Geckodriver instance and returns a [`ChildProcess`](https://nodejs.org/api/child_process.html#class-childprocess). If Geckodriver is not downloaded it will download it for you.

__Params:__ `GeckodriverParameters` - options to pass into Geckodriver (see below)

__Example:__

```js
import { start } from 'geckodriver';
import { remote } from 'webdriverio';
import waitPort from 'wait-port';

/**
 * first start Geckodriver
 */
const cp = await start({ port: 4444 });

/**
 * wait for Geckodriver to be up
 */
await waitPort({ port: 4444 });

/**
 * then start WebdriverIO session
 */
const browser = await remote({ capabilities: { browserName: 'firefox' } });
await browser.url('https://webdriver.io');
console.log(await browser.getTitle()); // prints "WebdriverIO · Next-gen browser and mobile automation test framework for Node.js | WebdriverIO"

/**
 * kill Geckodriver process
 */
cp.kill();
```

__Note:__ as you can see in the example above this package does not wait for the driver to be up, you have to manage this yourself through packages like [`wait-on`](https://github.com/jeffbski/wait-on).

### `download`

Method to download an Geckodriver with a particular version. If version parameter is omitted it tries to download the latest available version of the driver.

__Params:__ `string` - version of Geckodriver to download (optional)

## CJS Support

In case your module uses CJS you can use this package as follows:

```js
const { start } = require('geckodriver')
// see example above
```

## Options

The `start` method offers the following options to be passed on to the actual Geckodriver CLI.

### allowHosts

List of hostnames to allow. By default the value of --host is allowed, and in addition if that's a well known local address, other variations on well known local addresses are allowed. If --allow-hosts is provided only exactly those hosts are allowed.

Type: `string[]`<br />
Default: `[]`

### allowOrigins
List of request origins to allow. These must be formatted as scheme://host:port. By default any request with an origin header is rejected. If `--allow-origins` is provided then only exactly those origins are allowed.

Type: `string[]`<br />
Default: `[]`

### binary
Path to the Firefox binary.

Type: `string`

### connectExisting
Connect to an existing Firefox instance.

Type: `boolean`<br />
Default: `false`

### host
Host IP to use for WebDriver server.

Type: `string`<br />
Default: `127.0.0.1`

### jsdebugger
Attach browser toolbox debugger for Firefox.

Type: `boolean`<br />
Default: `false`

### log
Set Gecko log level [possible values: `fatal`, `error`, `warn`, `info`, `config`, `debug`, `trace`].

Type: `string`

### logNoTruncated
Write server log to file instead of stderr, increases log level to `INFO`.

Type: `boolean`

### marionetteHost
Host to use to connect to Gecko.

Type: `boolean`<br />
Default: `127.0.0.1`

### marionettePort
Port to use to connect to Gecko.

Type: `number`<br />
Default: `0`

### port
Port to listen on.

Type: `number`

### profileRoot
Directory in which to create profiles. Defaults to the system temporary directory.

Type: `string`

### geckoDriverVersion
Version of Geckodriver to start. See https://github.com/mozilla/geckodriver/releases for all available versions, platforms and architecture.

Type: `string`

### customGeckoDriverPath
Don't download Geckodriver, instead use a custom path to it, e.g. a cached binary.

Type: `string`

---

For more information on WebdriverIO see the [homepage](https://webdriver.io).
