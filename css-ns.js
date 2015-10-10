var React = require('react');

module.exports = {
  nsReactTree: nsReactTree
};

function nsReactTree(options, node) {
  if (node && node.props && node.props.className) {
    return React.cloneElement(
      node,
      { className: options.namespace + '-' + node.props.className },
      React.Children.map(node.props.children, nsReactTree.bind(null, options))
    );
  } else {
    return node;
  }
}
