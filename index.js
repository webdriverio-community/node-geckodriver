var os = require('os');
var fs = require('fs');
var path = require('path');

var got = require('got');
var tar = require('tar');
var AdmZip = require('adm-zip');
var proxyAgent = require('https-proxy-agent');

var Promise = require('bluebird');

var platform = os.platform();
var arch = process.env.GECKODRIVER_ARCH || process.env.npm_config_geckodriver_arch || os.arch();

var skipDownload = process.env.GECKODRIVER_SKIP_DOWNLOAD || process.env.npm_config_geckodriver_skip_download;
if (skipDownload === 'true') {
  console.log('Found GECKODRIVER_SKIP_DOWNLOAD variable, skipping installation.');
  process.exit(0);
}

var baseCDNURL = process.env.GECKODRIVER_CDNURL || process.env.npm_config_geckodriver_cdnurl || 'https://github.com/mozilla/geckodriver/releases/download';
var CACHED_ARCHIVE = process.env.GECKODRIVER_FILEPATH ? path.resolve(process.env.GECKODRIVER_FILEPATH) : undefined;

var version = process.env.GECKODRIVER_VERSION || process.env.npm_config_geckodriver_version || '0.32.0';

// Remove trailing slash if included
baseCDNURL = baseCDNURL.replace(/\/+$/, '');

var baseDownloadUrl =  baseCDNURL + '/v' + version + '/geckodriver-v' + version;
var DOWNLOAD_MAC = baseDownloadUrl +'-macos.tar.gz';
var DOWNLOAD_MAC_ARM64 = baseDownloadUrl +'-macos-aarch64.tar.gz';

var DOWNLOAD_LINUX_ARM64 = baseDownloadUrl +'-linux-aarch64.tar.gz';
var DOWNLOAD_LINUX64 = baseDownloadUrl +'-linux64.tar.gz';
var DOWNLOAD_LINUX32 = baseDownloadUrl +'-linux32.tar.gz';

var DOWNLOAD_WIN_ARM64 = baseDownloadUrl +'-win-aarch64.zip';
var DOWNLOAD_WIN32 = baseDownloadUrl +'-win32.zip';
var DOWNLOAD_WIN64 = baseDownloadUrl +'-win64.zip';

// TODO: move this to package.json or something
var downloadUrl = DOWNLOAD_MAC;
if (arch === 'arm64') {
  downloadUrl = DOWNLOAD_MAC_ARM64;
}

var outFile = 'geckodriver.tar.gz';
var executable = 'geckodriver';

var downloadOptions = {}
var proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.https_proxy || process.env.http_proxy || null;
if (proxy !== null) {
  downloadOptions.agent = {https: new proxyAgent(proxy)};
}

if (platform === 'linux') {
  switch (arch) {
    case 'arm64':
      downloadUrl = DOWNLOAD_LINUX_ARM64;
      break;
    case 'x64':
      downloadUrl = DOWNLOAD_LINUX64;
      break;
    default:
      downloadUrl = DOWNLOAD_LINUX32;
  }
}

if (platform === 'win32') {
  switch (arch) {
    case 'arm64':
      downloadUrl = DOWNLOAD_WIN_ARM64;
      break;
    case 'x64':
      downloadUrl = DOWNLOAD_WIN64;
      break;
    default:
      downloadUrl = DOWNLOAD_WIN32;
  }
  outFile = 'geckodriver.zip';
  executable = 'geckodriver.exe';
}

if (CACHED_ARCHIVE) {
  extract(CACHED_ARCHIVE);
} else {
  process.stdout.write('Downloading geckodriver... ');
  got.stream(new URL(downloadUrl), downloadOptions)
    .pipe(fs.createWriteStream(outFile))
    .on('close', function () {
      extract(path.join(__dirname, outFile));
    });
}


function extract(archivePath) {
  process.stdout.write('Extracting... ');
  var targetDirectoryPath = __dirname;

  return new Promise(function (resolve, reject) {
    if (outFile.indexOf('.tar.gz') >= 0) {
      tar.extract({
        file: archivePath,
        cwd: targetDirectoryPath
      }).then(function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } else if (outFile.indexOf('.zip') >= 0) {
      new AdmZip(archivePath).extractAllToAsync(targetDirectoryPath, true, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      reject('This archive extension is not supported: ' + archivePath);
    }
  })
  .then(function () {
    process.stdout.write('Complete.');
  })
  .catch(function (err) {
    console.log('Something is wrong ', err.stack);
  });
}
