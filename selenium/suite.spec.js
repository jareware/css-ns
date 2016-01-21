var webdriverio = require('webdriverio');

var TARGETS = [ // @see https://saucelabs.com/platforms/ && https://code.google.com/p/selenium/wiki/DesiredCapabilities
  [ 'Chrome', '47' ],
  [ 'Chrome', '46' ],
  [ 'Chrome', '45' ],
  [ 'Firefox', '43' ],
  [ 'Firefox', '42' ],
  [ 'Firefox', '41' ],
  [ 'Internet Explorer', '11' ],
  [ 'Internet Explorer', '10' ],
  [ 'Internet Explorer', '9' ],
  //[ 'Internet Explorer', '8' ], // FAILS
  [ 'Safari', '9' ],
  [ 'Safari', '8' ],
  [ 'Safari', '7' ],
  [ 'Safari', '6' ],
  [ 'iPhone', '9.2' ],
  [ 'iPhone', '8.4' ],
  [ 'iPhone', '7.1' ],
  [ 'iPhone', '6.1' ],
  //[ 'iPhone', '5.1' ], // FAILS
];

var EXPECTED_PASS_COUNT = 32; // TODO: Update this whenever the test suite has grown!

describe('css-ns', function() {

  this.timeout(5 * 60 * 1000); // 5 minutes
  this.slow(60 * 1000); // 1 minute

  TARGETS.forEach(function(target) {

    it('works on ' + target.join(' '), function() {
      return webdriverio.remote({
          desiredCapabilities: {
            browserName: target[0],
            version: target[1],
            platform: 'ANY', // let the test runner choose (e.g. Windows for IE, Linux for Chrome)
            name: 'css-ns test suite'
          },
          host: 'ondemand.saucelabs.com',
          port: 80,
          user: process.env.SAUCE_USERNAME, // @see https://github.com/webdriverio/webdriverio/blob/master/examples/cloudservices/webdriverio.saucelabs.js
          key: process.env.SAUCE_ACCESS_KEY,
          logLevel: 'silent',
          screenshotPath: './selenium/'
        })
        .init()
        .url('http://jrw.fi/css-ns/')
        .getText('#mocha-stats .passes').then(function(passes) {
          if (passes !== 'passes: ' + EXPECTED_PASS_COUNT) throw new Error(passes);
        })
        .getText('#mocha-stats .failures').then(function(failures) {
          if (failures !== 'failures: 0') throw new Error(failures);
        })
        .end();
    });

  });

});
