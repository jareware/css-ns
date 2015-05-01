var fs = require('fs');
var path = require('path');
var postcss = require('postcss');

var CLASSNAME_SEARCH = /\.([a-z][a-zA-Z_-]*)/g;

var transform = postcss.plugin('component-css-ns', function(opts) {
  opts = opts || {};
  return function(css) {
    if (!opts.filename) throw new Error('component-css-ns PostCSS transform needs a filename to determine component namespace');
    var componentNs = opts.filename.replace(/.*\/(\w+).*/, '$1');
    css.eachRule(function(rule) { // @see https://github.com/postcss/postcss/blob/master/docs/api.md#rule-node
      rule.selector = rule.selector.replace(CLASSNAME_SEARCH, '.' + componentNs + '-$1');
    });
  };
});

// @see https://www.npmjs.com/package/node-sass#importer-v2-0-0-experimental
module.exports = function(url, prev, done) {
  var expectedExtension = path.extname(url) === '' ? path.extname(prev) : ''; // if the import had an extension (e.g. ".scss"), use that; if not, use the extension of the importing file
  var next = path.join(path.dirname(prev), url + expectedExtension); // construct import path relative to current file // TODO: Solve https://github.com/sass/node-sass/issues/762
  fs.readFile(next, function(err, data) {
    if (err) return done(err); // could not read the source file, for whatever reason
    try {
      done({ contents: postcss([ transform({ filename: next }) ]).process(data).css });
    } catch (e) {
      done(e); // PostCSS transform failed
    }
  });
};
