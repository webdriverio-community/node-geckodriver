const test = require('ava');
const child_process = require('child_process');


test.cb('properly extracts custom arch', t => {
  var oldArch = process.env.GECKODRIVER_ARCH;
  process.env.GECKODRIVER_ARCH = 'arm64';
  // Test ARM64
  child_process.exec('node index.js', (error, stdout, stderr) => {
    if (error) {
      return t.fail(`exec error: ${error}`)
    }
    t.assert(stdout.includes('Downloading geckodriver'), stdout);
    t.is(stderr, '');
    process.env.GECKODRIVER_ARCH = oldArch; 
    var out = child_process.execSync('file -b geckodriver').toString();
    t.truthy(/arm64|aarch64|Aarch64/.test(out));
    process.env.GECKODRIVER_ARCH = 'x64';
    
     // Test x64
    child_process.exec('node index.js', (error, stdout, stderr) => {
      if (error) {
        return t.fail(`exec error: ${error}`)
      }
      t.assert(stdout.includes('Downloading geckodriver'), stdout);
      t.is(stderr, '');
      var out = child_process.execSync('file -b geckodriver').toString();
      t.truthy(/x86_64|x86-64/.test(out));
      t.end();
    });
  });
});

test('programmatic usage', t => {
  var driver = require('../lib/geckodriver')
  t.is(driver.version, '0.32.0')
});
