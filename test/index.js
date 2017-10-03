import test from 'ava';
import child_process from 'child_process';

test.cb('properly extracts', t => {
  child_process.exec('node ../index.js', (error, stdout, stderr) => {
    if (error) {
      return t.fail(`exec error: ${error}`)
    }
    t.is(stdout, 'Downloading geckodriver from https://github.com/mozilla/geckodriver/releases/download/v0.19.0/geckodriver-v0.19.0-linux64.tar.gz...\nExtracting geckodriver.tar.gz to /home/travis/build/vladikoff/node-geckodriver...\nComplete.\n');
    t.is(stderr, '');
    t.end();
  });
});

test('programmatic usage', t => {
  var driver = require('../lib/geckodriver')
  t.is(driver.version, '0.19.0')
});
