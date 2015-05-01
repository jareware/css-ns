var assert = require('assert');
var fs = require('fs');
var child_process = require('child_process');

var testCasePath = __dirname + '/cases/';
var testCases = fs.readdirSync(testCasePath);

describe('component-css-ns', function() {

  testCases.forEach(function(dir) {

    it(dir, function(done) {

      this.timeout(15 * 1000); // builds may take a long time on slower machines; let's be lenient

      var path = testCasePath + dir + '/';
      var expected = fs.readFileSync(path + 'expected.out', 'utf8');

      process.chdir(path);

      child_process.exec('npm --silent test', function(err, stdOut, stdErr) {

        if (err) assert.fail(dir + ': Could not run test command: ' + stdErr);

        assert.equal(expected, stdOut);

        done();

      });
    });
  });
});
