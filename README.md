# Set 2 - Exercise Tracking App

Set 2 is a simple exercise tracking app for Ionic 2.  
It fills a gap created when [FitLinxx](https://fitlinxx.com) trackers were discontinued in Metro Atlanta YMCAs.

This app guides you through your workout circuit, lets you quickly record exercises, and uploads your results. It can send results to Fitbit and FitLinxx, and email them to you.

---

## Running Locally

Pre-requisites: [git](https://git-scm.com/),  [node.js](https://nodejs.org), and [ionic 2](https://ionicframework.com/).

1. Get the code: `git clone https://github.com/derekwlms/set2.git`
2. `cd set2 && npm install`
3. `ionic serve`
4. [Open in your browser](http://localhost:8100).

Recommended `ionic info`:

- Cordova CLI: 6.4.0
- Ionic Framework Version: 2.0.0
- Ionic CLI Version: 2.1.17
- Ionic App Lib Version: 2.1.7

To enable console logging, comment out the *enableProdMode* call in main.ts.  

## To Do

- Settings page cleanup
- Home page - history tab (list of workouts)
- Delete Exercise
- Activity default settings
- Packaging, icons, artwork, empty notebook, build date (rollup.config.js)
- Release builds, set2.paymenthorizons.com
- Wiki dev doc
- Other activity types & their settings - cardio, etc
- Online save?  Firebase?
- Import - Fitlinx scrape?  jsonschema?

## Documentation

See the [wiki](https://github.com/derekwlms/set2/wiki).

## License
Set 2 is released under the [ISC License](https://opensource.org/licenses/ISC).  See LICENSE.txt.

## Contributing

The usual: fork, work your magic, send me a pull request.

## Notes

- Options for avoiding CORS errors on Http requests:
    - See ionic.config.json for the CORS proxy configuration 
    - cd /d "C:\Program Files (x86)\Google\Chrome\Application" && chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
    - adb devices && ionic run android -l -c
        - set path=%PATH%;%ANDROID_HOME%\platform-tools
 
