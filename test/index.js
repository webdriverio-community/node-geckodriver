const test = require('ava');
const child_process = require('child_process');

test.cb('properly extracts', t => {
  child_process.exec('node index.js', (error, stdout, stderr) => {
    if (error) {
      return t.fail(`exec error: ${error}`)
    }
    t.assert(stdout.includes('Downloading geckodriver'), stdout);
    t.is(stderr, '');
    t.end();
  });
});

test('programmatic usage', t => {
  var driver = require('../lib/geckodriver')
  t.is(driver.version, '0.30.0')
});
