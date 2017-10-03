import test from 'ava';
import child_process from 'child_process';

test.cb('properly extracts', t => {
  child_process.exec('node ../index.js', (error, stdout, stderr) => {
    if (error) {
      return t.fail(`exec error: ${error}`)
    }
    let regx = 'Downloading geckodriver from (?:(http[s]?):\/\/)?([^:\/\s]+)(:[0-9]+)?((?:\/\w+)*\/)([\w\-\.]+[^#?\s]+)([^#\s]*)?(#[\w\-]+)? geckodriver.tar.gz to (\/*)(.*)(...)\/node-geckodriver...\\nComplete.\\n'
    t.regex(stdout,  regx);
    t.is(stderr, '');
    t.end();
  });
});

test('programmatic usage', t => {
  var driver = require('../lib/geckodriver')
  t.is(driver.version, '0.19.0')
});
