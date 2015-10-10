var React = require('react');

module.exports = {
  makeOptions: makeOptions,
  nsReactTree: nsReactTree
};

function isString(x) {
  return typeof x === 'string';
}

function isObject(x) {
  return typeof x === 'object' && !Array.isArray(x) && x !== null;
}

function assert(truthyValue, message) {
  if (!truthyValue) throw new Error(message);
}

function makeOptions(raw) {
  if (raw._cssNsOpts) return raw; // already processed, let's skip any extra work
  if (isString(raw)) return makeOptions({ namespace: raw }); // shorthand for just specifying the namespace
  assert(isObject(raw), 'Options must be provided either as an object or a string, got ' + raw);
  assert(isString(raw.namespace), 'Mandatory "namespace" option must be provided as a string');
  return {
    namespace: raw.namespace.replace(/.*\/([\w-]+).*/, '$1'),
    _cssNsOpts: true
  };
}

function nsReactTree(options, el) {
  assert(el === null || el === false || React.isValidElement(el), 'nsReactTree() expects a valid React element, null or false');
  if (!el) return el; // see https://facebook.github.io/react/tips/false-in-jsx.html for why falsy values can be useful
  var opts = makeOptions(options);
  var props = el.props.className ? { className: opts.namespace + '-' + el.props.className } : el.props;
  var children = React.Children.map(el.props.children, nsReactTree.bind(null, opts));
  return React.cloneElement(el, props, children);
}
