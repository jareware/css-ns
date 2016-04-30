var assert = require('chai').assert; // @see http://chaijs.com/api/assert/
var cssNs = require('./css-ns');
var React = require('react');
var ReactDOMServer = require('react-dom/server');

function assertEqualHtml(Component, expectedHtml) {
  assert.deepEqual(
    ReactDOMServer.renderToStaticMarkup(React.createElement(Component)),
    expectedHtml
  );
}

describe('css-ns', function() {

  describe('createOptions()', function() {

    it('accepts a string', function() {
      assert.deepEqual(
        cssNs.createOptions('MyComponent').namespace,
        'MyComponent'
      );
    });

    it('accepts a file path', function() {
      assert.deepEqual(
        cssNs.createOptions('/path/to/MyComponent.jsx').namespace,
        'MyComponent'
      );
    });

    it('accepts a relative file path', function() {
      assert.deepEqual(
        cssNs.createOptions('../MyComponent.jsx').namespace,
        'MyComponent'
      );
    });

    it('processes options only once', function() {
      assert.deepEqual(
        cssNs.createOptions(cssNs.createOptions('MyComponent')).namespace,
        'MyComponent'
      );
    });

    it('accepts an object', function() {
      assert.deepEqual(
        cssNs.createOptions({ namespace: 'MyComponent' }).namespace,
        'MyComponent'
      );
    });

  });

  describe('nsAuto()', function() {

    it('handles falsy input', function() {
      assert.equal(cssNs.nsAuto('MyComponent', null), null);
    });

    it('handles class list input', function() {
      assert.equal(cssNs.nsAuto('Foo', 'bar'), 'Foo-bar');
    });

    it('handles React element input', function() {
      var MyComponent = function() {
        return cssNs.nsAuto(
          { namespace: 'MyComponent', React: React },
          React.createElement('div', { className: 'row' })
        );
      };
      assertEqualHtml(
        MyComponent,
        '<div class="MyComponent-row"></div>'
      );
    });

  });

  describe('nsString()', function() {

    it('prefixes a single class', function() {
      assert.equal(cssNs.nsString('Foo', 'bar'), 'Foo-bar');
    });

    it('prefixes multiple classes', function() {
      assert.equal(cssNs.nsString('Foo', 'bar baz'), 'Foo-bar Foo-baz');
    });

    it('tolerates exotic classNames and whitespace', function() {
      // ...not that using these would be a good idea for other reasons, but we won't judge!
      assert.equal(cssNs.nsString('Foo', '   bar-baz   lol{wtf$why%would__ANYONE"do.this}   '), 'Foo-bar-baz Foo-lol{wtf$why%would__ANYONE"do.this}');
    });

    it('supports an include option', function() {
      var options = {
        namespace: 'Foo',
        include: /^b/ // only prefix classes that start with b
      };
      assert.equal(
        cssNs.nsString(options, 'bar AnotherComponent car'),
        'Foo-bar AnotherComponent car'
      );
    });

    it('supports an exclude option', function() {
      var options = {
        namespace: 'Foo',
        exclude: /^([A-Z]|icon)/ // ignore classes that start with caps or "icon"
      };
      assert.equal(
        cssNs.nsString(options, 'bar AnotherComponent iconInfo baz'),
        'Foo-bar AnotherComponent iconInfo Foo-baz'
      );
    });

    it('supports both include and exclude at the same time', function() {
      var options = {
        namespace: 'Foo',
        include: /^[a-z]/, // include classes that start with lower-case
        exclude: /^icon/ // ...but still ignore the "icon" prefix
      };
      assert.equal(
        cssNs.nsString(options, 'bar iconInfo baz'),
        'Foo-bar iconInfo Foo-baz'
      );
    });

    it('supports a self option', function() {
      var options = {
        namespace: 'Foo',
        self: /^__ns__$/
      };
      assert.equal(cssNs.nsString(options, '__ns__ bar'), 'Foo Foo-bar');
    });

    it('supports a glue option', function() {
      var options = {
        namespace: 'Foo',
        glue: '___'
      };
      assert.equal(cssNs.nsString(options, 'bar'), 'Foo___bar');
    });

    describe('with prefix', function() {

      it('prefixes a single class', function() {
        assert.equal(cssNs.nsString({ prefix: 'app-', namespace: 'Foo' }, 'bar'), 'app-Foo-bar');
      });

      it('prefixes multiple classes', function() {
        assert.equal(cssNs.nsString({ prefix: 'app-', namespace: 'Foo' }, 'bar baz'), 'app-Foo-bar app-Foo-baz');
      });

      it('tolerates exotic classNames and whitespace', function() {
        // ...not that using these would be a good idea for other reasons, but we won't judge!
        assert.equal(cssNs.nsString({ prefix: 'app-', namespace: 'Foo' }, '   bar-baz   lol{wtf$why%would__ANYONE"do.this}   '), 'app-Foo-bar-baz app-Foo-lol{wtf$why%would__ANYONE"do.this}');
      });

      it('supports an include option', function() {
        var options = {
          prefix: 'app-',
          namespace: 'Foo',
          include: /^b/ // only prefix classes that start with b
        };
        assert.equal(
          cssNs.nsString(options, 'bar AnotherComponent car'),
          'app-Foo-bar AnotherComponent car'
        );
      });

      it('supports an exclude option', function() {
        var options = {
          prefix: 'app-',
          namespace: 'Foo',
          exclude: /^([A-Z]|icon)/ // ignore classes that start with caps or "icon"
        };
        assert.equal(
          cssNs.nsString(options, 'bar AnotherComponent iconInfo baz'),
          'app-Foo-bar AnotherComponent iconInfo app-Foo-baz'
        );
      });

      it('supports both include and exclude at the same time', function() {
        var options = {
          prefix: 'app-',
          namespace: 'Foo',
          include: /^[a-z]/, // include classes that start with lower-case
          exclude: /^icon/ // ...but still ignore the "icon" prefix
        };
        assert.equal(
          cssNs.nsString(options, 'bar iconInfo baz'),
          'app-Foo-bar iconInfo app-Foo-baz'
        );
      });

      it('supports a self option', function() {
        var options = {
          prefix: 'app-',
          namespace: 'Foo',
          self: /^__ns__$/
        };
        assert.equal(cssNs.nsString(options, '__ns__ bar'), 'app-Foo app-Foo-bar');
      });

      it('supports a glue option', function() {
        var options = {
          prefix: 'app-',
          namespace: 'Foo',
          glue: '___'
        };
        assert.equal(cssNs.nsString(options, 'bar'), 'app-Foo___bar');
      });

      it('automatically ignores pre-prefixed classes', function() {
        var options = {
          prefix: 'app-',
          namespace: 'Foo'
        };
        assert.equal(
          cssNs.nsString(options, 'bar app-AnotherComponent app-car'),
          'app-Foo-bar app-AnotherComponent app-car'
        );
      });

    });

  });

  describe('nsArray()', function() {

    it('prefixes classes', function() {
      assert.equal(cssNs.nsArray('Foo', [ 'bar', 'baz' ]), 'Foo-bar Foo-baz');
    });

    it('tolerates falsy values', function() {
      assert.equal(cssNs.nsArray('Foo', [ 'bar', null, 'baz', false ]), 'Foo-bar Foo-baz');
    });

  });

  describe('nsObject()', function() {

    it('prefixes classes', function() {
      assert.equal(cssNs.nsObject('Foo', { bar: true, baz: true }), 'Foo-bar Foo-baz');
    });

    it('tolerates falsy values', function() {
      assert.equal(cssNs.nsObject('Foo', { bar: true, ignoreThis: null, baz: true, alsoThis: false }), 'Foo-bar Foo-baz');
    });

  });

  describe('createReact()', function() {

    it('creates an ns-bound React instance', function() {
      var nsReact = cssNs.createReact({ namespace: 'MyComponent', React: React });
      var MyComponent = function() {
        return nsReact.createElement('div', { className: 'row' });
      };
      assertEqualHtml(
        MyComponent,
        '<div class="MyComponent-row"></div>'
      );
    });

    it('prefixes classNames on components as well', function() {
      // This is a bit of an edge case, since for a component, a prop called "className" holds no special value.
      // But if you're using a prop with that name it's highly likely this is the behaviour you want.
      var nsReact = cssNs.createReact({ namespace: 'MyComponent', React: React });
      var MyChildComponent = function(props) {
        return nsReact.createElement('div', { className: props.className });
        // ^ this won't get double-namespaced, but only because we ignore uppercased classes by default; otherwise it would
      };
      var MyComponent = function() {
        return nsReact.createElement(MyChildComponent, { className: 'parentInjectedName' })
      };
      assertEqualHtml(
        MyComponent,
        '<div class="MyComponent-parentInjectedName"></div>'
      );
    });

  });

  describe('nsReactElement()', function() {

    var nsReactElement = cssNs.nsReactElement.bind(null, { // bind default options
      namespace: 'MyComponent',
      React: React
    });

    it('prefixes a single className', function() {
      var MyComponent = function() {
        return nsReactElement(
          React.createElement('div', { className: 'row' })
        );
      };
      assertEqualHtml(
        MyComponent,
        '<div class="MyComponent-row"></div>'
      );
    });

    it('ignores text nodes', function() {
      var MyComponent = function() {
        return nsReactElement(
          React.createElement('div', { className: 'row' }, 'Hello World')
        );
      };
      assertEqualHtml(
        MyComponent,
        '<div class="MyComponent-row">Hello World</div>'
      );
    });

    it('supports array input', function() {
      var MyComponent = function() {
        return nsReactElement(
          React.createElement('div', { className: [ 'row' ] })
        );
      };
      assertEqualHtml(
        MyComponent,
        '<div class="MyComponent-row"></div>'
      );
    });

    it('supports object input', function() {
      var MyComponent = function() {
        return nsReactElement(
          React.createElement('div', { className: { row: true } })
        );
      };
      assertEqualHtml(
        MyComponent,
        '<div class="MyComponent-row"></div>'
      );
    });

    it('prefixes classNames recursively', function() {
      var MyComponent = function() {
        return nsReactElement(
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
        return nsReactElement(
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
        return nsReactElement(
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
        return nsReactElement(
          React.createElement(MyChildComponent, null,
            React.createElement('div', { className: 'owned' }) // it doesn't matter that "owned" is a child of MyChildComponent, it's still OWNED by MyComponent
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
        return cssNs.nsReactElement(
          { namespace: 'MyChildComponent', React: React },
          React.createElement('div', { className: 'protected' })
        );
      };
      var MyComponent = function() {
        return nsReactElement(
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

    it('prefixes classNames on components as well', function() {
      // This is a bit of an edge case, since for a component, a prop called "className" holds no special value.
      // But if you're using a prop with that name it's highly likely this is the behaviour you want.
      var MyChildComponent = function(props) {
        return React.createElement('div', { className: props.className });
      };
      var MyComponent = function() {
        return nsReactElement(
          React.createElement(MyChildComponent, { className: 'parentInjectedName' })
        );
      };
      assertEqualHtml(
        MyComponent,
        '<div class="MyComponent-parentInjectedName"></div>'
      );
    });

  });

});
