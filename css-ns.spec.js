var assert = require('chai').assert; // @see http://chaijs.com/api/assert/
var cssNs = require('./css-ns');
var React = require('react');

describe('css-ns', function() {

  it('works', function() {
    var A = React.createClass({
      render: function() {
        return cssNs.nsReactTree('A',
          React.createElement('ul', null,
            React.createElement('li', { className: 'row' }),
            React.createElement('li', null,
              React.createElement('span', { className: 'message' }, 'Hola!')
            )
          )
        );
      }
    });
    var html = React.renderToStaticMarkup(React.createElement(A));
    assert.deepEqual('<ul><li class="A-row"></li><li><span class="A-message">Hola!</span></li></ul>', html);
  });

});
