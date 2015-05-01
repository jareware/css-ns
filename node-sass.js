var fs = require('fs');
var path = require('path');

// @see https://www.npmjs.com/package/node-sass#importer-v2-0-0-experimental
module.exports = function(url, prev, done) {
  var expectedExtension = path.extname(url) === '' ? path.extname(prev) : ''; // if the import had an extension (e.g. ".scss"), use that; if not, use the extension of the importing file
  var next = path.join(path.dirname(prev), url + expectedExtension); // construct import path relative to current file // TODO: Solve https://github.com/sass/node-sass/issues/762
  fs.readFile(next, function(err, data) {
    if (err) done(err);
    else done({ contents: data + '' });
  });
};