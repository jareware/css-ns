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

    it('prefixes classNames recursively', function() {
      var options = {
        namespace: 'MyComponent'
      };
      var MyComponent = function() {
        return cssNs.nsReactTree(options,
          React.createElement('div', { className: 'row' },
            React.createElement('div', { className: 'column' })
          )
        );
      };
      var html = ReactDOMServer.renderToStaticMarkup(React.createElement(MyComponent));
      assert.deepEqual(html, '<div class="MyComponent-row"><div class="MyComponent-column"></div></div>');
    });

    it('allows elements without a className', function() {
      var options = {
        namespace: 'MyComponent'
      };
      var MyComponent = function() {
        return cssNs.nsReactTree(options,
          React.createElement('div', { className: 'row' },
            React.createElement('section', null,
              React.createElement('div', { className: 'column' })
            )
          )
        );
      };
      var html = ReactDOMServer.renderToStaticMarkup(React.createElement(MyComponent));
      assert.deepEqual(html, '<div class="MyComponent-row"><section><div class="MyComponent-column"></div></section></div>');
    });

    it('respects component boundaries', function() {
      var options = {
        namespace: 'MyComponent'
      };
      var MyChildComponent = function() {
        return React.createElement('div', { className: 'protected' });
      };
      var MyComponent = function() {
        return cssNs.nsReactTree(options,
          React.createElement('div', { className: 'container' },
            React.createElement(MyChildComponent, null)
          )
        );
      };
      var html = ReactDOMServer.renderToStaticMarkup(React.createElement(MyComponent));
      assert.deepEqual(html, '<div class="MyComponent-container"><div class="protected"></div></div>');
    });

    it('respects ownership of children across components', function() {
      var options = {
        namespace: 'MyComponent'
      };
      var MyChildComponent = function(props) {
        return React.createElement('div', { className: 'protected' }, props.children);
      };
      var MyComponent = function() {
        return cssNs.nsReactTree(options,
          React.createElement(MyChildComponent, null,
            React.createElement('div', { className: 'owned' })
          )
        );
      };
      var html = ReactDOMServer.renderToStaticMarkup(React.createElement(MyComponent));
      assert.deepEqual(html, '<div class="protected"><div class="MyComponent-owned"></div></div>');
    });

    it('works with nested components', function() {
      var options = {
        namespace: 'MyComponent'
      };
      var MyChildComponent = function() {
        return cssNs.nsReactTree({ namespace: 'MyChildComponent' },
          React.createElement('div', { className: 'protected' })
        );
      };
      var MyComponent = function() {
        return cssNs.nsReactTree(options,
          React.createElement('div', { className: 'container' },
            React.createElement(MyChildComponent, null)
          )
        );
      };
      var html = ReactDOMServer.renderToStaticMarkup(React.createElement(MyComponent));
      assert.deepEqual(html, '<div class="MyComponent-container"><div class="MyChildComponent-protected"></div></div>');
    });

  });

});
