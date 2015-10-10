var assert = require('chai').assert; // @see http://chaijs.com/api/assert/
var cssNs = require('./css-ns');
var React = require('react');
var ReactDOMServer = require('react-dom/server');

describe('css-ns', function() {

  describe('React support', function() {

    it('prefixes a single className', function() {
      var options = {
        namespace: 'MyComponent'
      };
      var MyComponent = function() {
        return cssNs.nsReactTree(options,
          React.createElement('div', { className: 'row' })
        );
      };
      var html = ReactDOMServer.renderToStaticMarkup(React.createElement(MyComponent));
      assert.deepEqual(html, '<div class="MyComponent-row"></div>');
    });

  });

});
