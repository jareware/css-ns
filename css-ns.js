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

function makeOptions(raw) {
  if (raw._cssNsOpts) return raw; // already processed, let's skip any extra work
  if (isString(raw)) return makeOptions({ namespace: raw }); // shorthand for just specifying the namespace
  if (!isObject(raw)) throw new Error('Options must be provided either as an object or a string, got ' + raw);
  return {
    namespace: raw.namespace,
    _cssNsOpts: true
  };
}

function nsReactTree(options, el) {
  if (!React.isValidElement(el)) return el; // this is something we don't understand -> leave it alone
  var props = el.props.className ? { className: options.namespace + '-' + el.props.className } : el.props;
  var children = React.Children.map(el.props.children, nsReactTree.bind(null, options));
  return React.cloneElement(el, props, children);
}
