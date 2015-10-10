var React = require('react');

module.exports = {
  nsReactTree: nsReactTree
};

function nsReactTree(options, el) {
  if (!React.isValidElement(el)) return el; // this is something we don't understand -> leave it alone
  var props = el.props.className ? { className: options.namespace + '-' + el.props.className } : el.props;
  var children = React.Children.map(el.props.children, nsReactTree.bind(null, options));
  return React.cloneElement(el, props, children);
}
