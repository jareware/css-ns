var transformTools = require('browserify-transform-tools');

var CLASSNAME_SEARCH = /\b([a-z][a-zA-Z_-]*)/g;

// @see https://github.com/benbria/browserify-transform-tools#creating-a-falafel-transform
module.exports = transformTools.makeFalafelTransform('component-css-ns', {}, function(node, transformOptions, done) {
  if (node.type === 'Property' && node.key.name === 'className') {
    var componentNs = transformOptions.file.replace(/.*\/(\w+).*/, '$1');
    node.value.update(node.value.source() + '.replace(' + CLASSNAME_SEARCH.toString() + ', "' + componentNs + '-$1")');
  }
  done();
});
