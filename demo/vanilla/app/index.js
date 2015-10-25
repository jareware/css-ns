var createCssNs = require('css-ns');

function range(count) {
  return new Array(count + 1).join(' ').split('');
}

var p = el.bind(null, 'p');
var ul = el.bind(null, 'ul');
var li = el.bind(null, 'li');

var ns = createCssNs('MyApp');

document.body.appendChild(
  p('Here\'s a nice list of random numbers:',
    ul(
      range(25).map(function() {
        var i = Math.round(Math.random() * 10);
        return li({ 'class': ns(i % 2 ? 'odd' : 'even') }, i);
      })
    )
  )
);

/**
 * Utility function for generating HTML/XML DOM trees in the browser.
 *
 * Returns a node with the given name. The rest are var-args, so that:
 *
 * - an object sets attributes as key/value-pairs
 * - a string/number/boolean sets the text content of the node
 * - a node is treated as a child node
 * - an array is treated as a list of child nodes
 *
 * For convenience, falsy values in the list of children are ignored.
 *
 * There's three special cases for the name argument:
 *
 * - when "", a text node is created, with content from the 2nd arg
 * - when "<!", a comment node is created, with content from the 2nd arg
 * - when an existing node, that node is used instead of creating a new one
 *
 * @example el('p',
 *              el('<!', 'this is a comment'),
 *              el('a', 'Click here', {
 *                  href: '#some-location'
 *              }),
 *              el('', 'Text after link')
 *          );
 *
 * @example el('ul',
 *              [ 1, 2, 3, 4, 5 ].map(function(i) {
 *                  if (i % 2) return el('li', i);
 *              })
 *          );
 *
 * @example el(document.querySelector('#existing-root'),
 *              el('p', 'New node added under root')
 *          );
 *
 * @returns https://developer.mozilla.org/en-US/docs/Web/API/element
 *
 * @link https://gist.github.com/jareware/8dc0cc1a948c122edce0
 * @author Jarno Rantanen <jarno@jrw.fi>
 * @license Do whatever you want with it
 */
function el(name) {
  function isNode(n) {
    return typeof n === 'object' && n.nodeType && n.nodeName;
  }
  if (name === '<!') {
    return document.createComment(arguments[1]);
  } else if (name === '') {
    return document.createTextNode(arguments[1]);
  }
  var node = isNode(name) ? name : document.createElement(name);
  Array.prototype.slice.call(arguments, 1).forEach(function(arg) {
    if (arg instanceof Array) {
      arg.forEach(function(child) {
        child && node.appendChild(child);
      });
    } else if (typeof arg === 'object') {
      if (isNode(arg)) {
        node.appendChild(arg);
      } else {
        Object.keys(arg).forEach(function(key) {
          node.setAttribute(key, arg[key]);
        });
      }
    } else if ([ 'string', 'number', 'boolean' ].indexOf(typeof arg) >= 0) {
      node.textContent = arg;
    }
  });
  return node;
}
