var assert = require('chai').assert; // @see http://chaijs.com/api/assert/
var cssNs = require('./css-ns');
var React = require('react');
var ReactDOMServer = require('react-dom/server');

describe('css-ns', function() {

  describe('makeOptions()', function() {

    it('accepts a string', function() {
      assert.deepEqual(
        cssNs.makeOptions('MyComponent').namespace,
        'MyComponent'
      );
    });

    it('accepts a file path', function() {
      assert.deepEqual(
        cssNs.makeOptions('/path/to/MyComponent.jsx').namespace,
        'MyComponent'
      );
    });

    it('accepts a relative file path', function() {
      assert.deepEqual(
        cssNs.makeOptions('../MyComponent.jsx').namespace,
        'MyComponent'
      );
    });

    it('processes options only once', function() {
      assert.deepEqual(
        cssNs.makeOptions(cssNs.makeOptions('MyComponent')).namespace,
        'MyComponent'
      );
    });

    it('accepts an object', function() {
      assert.deepEqual(
        cssNs.makeOptions({ namespace: 'MyComponent' }).namespace,
        'MyComponent'
      );
    });

  });

  describe('React support', function() {

    function assertEqualHtml(Component, expectedHtml) {
      assert.deepEqual(
        ReactDOMServer.renderToStaticMarkup(React.createElement(Component)),
        expectedHtml
      );
    }

    it('prefixes a single className', function() {
      var MyComponent = function() {
        return cssNs.nsReactTree('MyComponent',
          React.createElement('div', { className: 'row' })
        );
      };
      assertEqualHtml(
        MyComponent,
        '<div class="MyComponent-row"></div>'
      );
    });

    it('prefixes classNames recursively', function() {
      var MyComponent = function() {
        return cssNs.nsReactTree('MyComponent',
          React.createElement('div', { className: 'row' },
            React.createElement('div', { className: 'column' })
          )
        );
      };
      assertEqualHtml(
        MyComponent,
        '<div class="MyComponent-row"><div class="MyComponent-column"></div></div>'
      );
    });

    it('allows elements without a className', function() {
      var MyComponent = function() {
        return cssNs.nsReactTree('MyComponent',
          React.createElement('div', { className: 'row' },
            React.createElement('section', null,
              React.createElement('div', { className: 'column' })
            )
          )
        );
      };
      assertEqualHtml(
        MyComponent,
        '<div class="MyComponent-row"><section><div class="MyComponent-column"></div></section></div>'
      );
    });

    it('respects component boundaries', function() {
      var MyChildComponent = function() {
        return React.createElement('div', { className: 'protected' });
      };
      var MyComponent = function() {
        return cssNs.nsReactTree('MyComponent',
          React.createElement('div', { className: 'container' },
            React.createElement(MyChildComponent, null)
          )
        );
      };
      assertEqualHtml(
        MyComponent,
        '<div class="MyComponent-container"><div class="protected"></div></div>'
      );
    });

    it('respects ownership of children across components', function() {
      var MyChildComponent = function(props) {
        return React.createElement('div', { className: 'protected' }, props.children);
      };
      var MyComponent = function() {
        return cssNs.nsReactTree('MyComponent',
          React.createElement(MyChildComponent, null,
            React.createElement('div', { className: 'owned' })
          )
        );
      };
      assertEqualHtml(
        MyComponent,
        '<div class="protected"><div class="MyComponent-owned"></div></div>'
      );
    });

    it('works with nested components', function() {
      var MyChildComponent = function() {
        return cssNs.nsReactTree('MyChildComponent',
          React.createElement('div', { className: 'protected' })
        );
      };
      var MyComponent = function() {
        return cssNs.nsReactTree('MyComponent',
          React.createElement('div', { className: 'container' },
            React.createElement(MyChildComponent, null)
          )
        );
      };
      assertEqualHtml(
        MyComponent,
        '<div class="MyComponent-container"><div class="MyChildComponent-protected"></div></div>'
      );
    });

  });

});
