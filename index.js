var os = require('os');
var fs = require('fs');
var path = require('path');

var got = require('got');
var targz = require('tar.gz');
var AdmZip = require('adm-zip');

var Promise = require('bluebird');

var platform = os.platform();
var arch = os.arch();

var DOWNLOAD_MAC = 'https://github.com/mozilla/geckodriver/releases/download/v0.16.1/geckodriver-v0.16.1-macos.tar.gz';
var DOWNLOAD_LINUX64 = 'https://github.com/mozilla/geckodriver/releases/download/v0.16.1/geckodriver-v0.16.1-linux64.tar.gz';
var DOWNLOAD_LINUX32 = 'https://github.com/mozilla/geckodriver/releases/download/v0.16.1/geckodriver-v0.16.1-linux32.tar.gz';
var DOWNLOAD_WIN32 = 'https://github.com/mozilla/geckodriver/releases/download/v0.16.1/geckodriver-v0.16.1-win32.zip';
var DOWNLOAD_WIN64 = 'https://github.com/mozilla/geckodriver/releases/download/v0.16.1/geckodriver-v0.16.1-win64.zip';

// TODO: move this to package.json or something
var downloadUrl = DOWNLOAD_MAC;
var outFile = 'geckodriver.tar.gz';
var executable = 'geckodriver';

if (platform === 'linux') {
  // No 32-bits of geckodriver for now
  downloadUrl = arch === 'x64' ? DOWNLOAD_LINUX64 : DOWNLOAD_LINUX64;
}

if (platform === 'win32') {
  downloadUrl = arch === 'x64' ? DOWNLOAD_WIN64 : DOWNLOAD_WIN32;
  outFile = 'geckodriver.zip';
  executable = 'geckodriver.exe';
}

process.stdout.write('Downloading geckodriver... ');
got.stream(downloadUrl)
  .pipe(fs.createWriteStream(outFile))
  .on('close', function() {
    process.stdout.write('Extracting... ');
    extract(path.join(__dirname, outFile), __dirname)
      .then(function(){
        console.log('Complete.');
      })
      .catch(function(err){
        console.log('Something is wrong ', err.stack);
      });
  });

function extract(archivePath, targetDirectoryPath) {
  if (outFile.indexOf('.tar.gz') >= 0) {
    return targz().extract(archivePath, targetDirectoryPath);
  }

  else if (outFile.indexOf('.zip') >= 0) {
    return Promise.resolve()
      .then(function () {
        new AdmZip(archivePath)
          .extractAllTo(targetDirectoryPath);
      });
  }

  else {
    return Promise.reject('This archive extension is not supported: ' + archivePath);
  }
}
