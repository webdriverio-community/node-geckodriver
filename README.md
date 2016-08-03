## node-geckodriver

> Downloader for https://github.com/mozilla/geckodriver/releases

Puts `geckodriver` or `geckodriver.exe` into root if this module.
Use it by setting WebDriver capabilities:

```
profile.setPreference('marionette', true);
profile.setPreference('webdriver.gecko.driver', require('path').join(__dirname, '..', 'node_modules', 'geckodriver', 'geckodriver');
```
