import test from 'ava';
import child_process from 'child_process';

test.cb('properly extracts', t => {
  child_process.exec('node ../index.js', (error, stdout, stderr) => {
    if (error) {
      return t.fail(`exec error: ${error}`)
    }
    t.regex(stdout, /Downloading geckodriver from (.*)Extracting geckodriver.tar.gz to (.*)...\nComplete.\n/);
    t.is(stderr, '');
    t.end();
  });
});

test('programmatic usage', t => {
  var driver = require('../lib/geckodriver')
  t.is(driver.version, '0.19.0')
});
