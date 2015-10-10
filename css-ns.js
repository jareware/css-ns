var React = require('react');

module.exports = {
  makeOptions: makeOptions,
  nsClassList: nsClassList,
  nsReactTree: nsReactTree
};

function isString(x) {
  return typeof x === 'string';
}

function isArray(x) {
  return Array.isArray(x);
}

function isObject(x) {
  return typeof x === 'object' && !isArray(x) && x !== null;
}

function truthy(x) {
  return !!x;
}

function assert(truthyValue, message) {
  if (!truthyValue) throw new Error(message);
}

function makeOptions(raw) {
  if (raw._cssNsOpts) return raw; // already processed, let's skip any extra work
  if (isString(raw)) return makeOptions({ namespace: raw }); // shorthand for just specifying the namespace
  assert(isObject(raw), 'Options must be provided either as an object or a string, got: ' + raw);
  assert(isString(raw.namespace), 'Mandatory "namespace" option must be provided as a string, got: ' + raw.namespace);
  return {
    namespace: raw.namespace.replace(/.*\/([\w-]+).*/, '$1'),
    _cssNsOpts: true
  };
}

function nsClassList(options, x) {
  var opt = makeOptions(options);
  if (isString(x)) {
    return x.replace(/\w+/g, function(cls) {
      return opt.namespace + '-' + cls;
    });
  } else if (isArray(x)) {
    return x.map(function(cls) {
      return cls ? nsClassList(opt, cls) : null;
    }).filter(truthy).join(' ');
  } else if (isObject(x)) {
    return nsClassList(opt, Object.keys(x).map(function(key) {
      return x[key] ? key : null;
    }));
  } else { // input was either falsy or something we don't understand -> don't output anything
    return '';
  }
}

function nsReactTree(options, el) {
  assert(el === null || el === false || React.isValidElement(el), 'nsReactTree() expects a valid React element, null or false, got: ' + el);
  if (!el) return el; // see https://facebook.github.io/react/tips/false-in-jsx.html for why falsy values can be useful
  var opt = makeOptions(options);
  var props = el.props.className ? { className: nsClassList(opt, el.props.className) } : el.props;
  var children = React.Children.map(el.props.children, nsReactTree.bind(null, opt));
  return React.cloneElement(el, props, children);
}
