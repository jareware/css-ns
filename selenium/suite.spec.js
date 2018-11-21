var webdriverio = require('webdriverio');

var TARGETS = [ // @see https://saucelabs.com/platforms/ && https://code.google.com/p/selenium/wiki/DesiredCapabilities
  [ 'Chrome', '70' ],
  [ 'Chrome', '69' ],
  [ 'Chrome', '68' ],
  [ 'Chrome', '67' ],
  [ 'Chrome', '66' ],
  [ 'Firefox', '63' ],
  [ 'Firefox', '62' ],
  [ 'Firefox', '61' ],
  [ 'Firefox', '60' ],
  [ 'Firefox', '59' ],
  [ 'MicrosoftEdge', '17' ],
  [ 'MicrosoftEdge', '16' ],
  [ 'MicrosoftEdge', '15' ],
  [ 'MicrosoftEdge', '14' ],
  [ 'MicrosoftEdge', '13' ],
  [ 'Internet Explorer', '11' ],
  [ 'Internet Explorer', '10' ],
  [ 'Internet Explorer', '9' ],
  [ 'Safari', '11' ],
  [ 'Safari', '10' ],
  [ 'Safari', '9' ],
  [ 'Safari', '8' ],
];

var EXPECTED_PASS_COUNT = 47; // TODO: Update this whenever the test suite has grown!

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
