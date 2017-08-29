import test from 'ava';
import child_process from 'child_process';
import os from 'os';

test.cb('properly extracts', t => {
  child_process.exec('node ../index.js', (error, stdout, stderr) => {
    if (error) {
      return t.fail(`exec error: ${error}`)
    }
    if (os.platform() === 'win32') {
      t.is(stdout, 'Downloading geckodriver... Extracting... Copying... Complete.\n');
    }
    else {
      t.is(stdout, 'Downloading geckodriver... Extracting... Complete.\n');
    }
    t.is(stderr, '');
    t.end();
  });
});

test('programmatic usage', t => {
  var driver = require('../lib/geckodriver')
  t.is(driver.version, '0.18.0')
});
