var os = require('os');
var fs = require('fs');
var path = require('path');

var got = require('got');
var targz = require('tar.gz');

var platform = os.platform();

var DOWNLOAD_MAC = 'https://github.com/mozilla/geckodriver/releases/download/v0.10.0/geckodriver-v0.10.0-macos.tar.gz'
var DOWNLOAD_LINUX = 'https://github.com/mozilla/geckodriver/releases/download/v0.10.0/geckodriver-v0.10.0-linux64.tar.gz'
var DOWNLOAD_WIN = 'https://github.com/mozilla/geckodriver/releases/download/v0.10.0/geckodriver-v0.10.0-win64.zip'

// TODO: move this to package.json or something
var downloadUrl = DOWNLOAD_MAC;
var outFile = 'geckodriver.tar.gz';
var executable = 'geckodriver';

if (platform === 'linux') {
  downloadUrl = DOWNLOAD_LINUX;
}

if (platform === 'win32') {
  downloadUrl = DOWNLOAD_WIN;
  outFile = 'geckodriver.zip';
  executable = 'geckodriver.exe';
}

process.stdout.write('Downloading geckodriver... ');
got.stream(downloadUrl)
  .pipe(fs.createWriteStream(outFile))
  .on('close', function() {
    process.stdout.write('Extracting... ');
    targz().extract(path.join(__dirname, outFile), __dirname)
      .then(function(){
        console.log('Complete.');
      })
      .catch(function(err){
        console.log('Something is wrong ', err.stack);
      });
  });
