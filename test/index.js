import test from 'ava';
import child_process from 'child_process';

test.cb.serial('properly extracts', t => {
  child_process.exec('node ../index.js', (error, stdout, stderr) => {
    if (error) {
      return t.fail(`exec error: ${error}`);
    }
    t.is(stdout, 'Downloading geckodriver... Extracting... Complete.\n');
    t.is(stderr, '');
    t.end();
  });
});

test.serial('programmatic usage', t => {
  var driver = require('../lib/geckodriver');
  t.is(!!driver.version, true);
});
