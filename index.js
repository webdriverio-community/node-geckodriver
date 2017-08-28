var os = require('os');
var fs = require('fs');
var path = require('path');
var spawnSync = require('child_process').spawnSync;

var got = require('got');
var targz = require('tar.gz');
var AdmZip = require('adm-zip');

var Promise = require('bluebird');

var platform = os.platform();
var arch = os.arch();

var baseCDNURL = process.env.GECKODRIVER_CDNURL || 'https://github.com/mozilla/geckodriver/releases/download';

// Remove trailing slash if included
baseCDNURL = baseCDNURL.replace(/\/+$/, '');

var DOWNLOAD_MAC = baseCDNURL + '/v0.18.0/geckodriver-v0.18.0-macos.tar.gz';
var DOWNLOAD_LINUX64 = baseCDNURL + '/v0.18.0/geckodriver-v0.18.0-linux64.tar.gz';
var DOWNLOAD_LINUX32 = baseCDNURL + '/v0.18.0/geckodriver-v0.18.0-linux32.tar.gz';
var DOWNLOAD_WIN32 = baseCDNURL + '/v0.18.0/geckodriver-v0.18.0-win32.zip';
var DOWNLOAD_WIN64 = baseCDNURL + '/v0.18.0/geckodriver-v0.18.0-win64.zip';

// TODO: move this to package.json or something
var downloadUrl = DOWNLOAD_MAC;
var outFile = 'geckodriver.tar.gz';
var executable = 'geckodriver';

if (platform === 'linux') {
  downloadUrl = arch === 'x64' ? DOWNLOAD_LINUX64 : DOWNLOAD_LINUX32;
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
      .then(function() {
        if (platform === 'win32') {
          return copyExecutable();
        }
      })
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

function copyExecutable() {
  process.stdout.write('Copying... ');

  var exeDir;

  try {
    exeDir = spawnSync('npm.cmd', ['bin', '-g'], { encoding: 'utf8' }).stdout.trim();
  } catch(ex) {
    process.stderr.write(ex);
  }

  if (exeDir) {
    return copyFile(path.join(__dirname, executable), path.join(exeDir, executable));
  }
}

function copyFile(source, target) {
  return new Promise(function(resolve, reject) {
    var readStream = fs.createReadStream(source);
    readStream.on("error", reject);
    var writeStream = fs.createWriteStream(target);
    writeStream.on("error", reject);
    writeStream.on("close", resolve);
    readStream.pipe(writeStream);
  });
}
