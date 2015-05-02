var transformTools = require('browserify-transform-tools');
var falafel = require('falafel');

var OPT_IN_TRIGGER = '/* @component-css-ns */';
var CLASSNAME_SEARCH = /\b([a-z][a-zA-Z_-]*)/g;

// @see https://github.com/benbria/browserify-transform-tools#creating-a-string-transform
module.exports = transformTools.makeStringTransform('component-css-ns', {}, function(content, transformOptions, done) {
  if (content.indexOf(OPT_IN_TRIGGER) !== -1) {
    content = falafel(content, function(node) {
      if (node.type === 'Property' && node.key.name === 'className') {
        var componentNs = transformOptions.file.replace(/.*\/(\w+).*/, '$1');
        node.value.update(node.value.source() + '.replace(' + CLASSNAME_SEARCH.toString() + ', "' + componentNs + '-$1")');
      }
    });
  }
  done(null, content);
});
