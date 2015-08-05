module.exports = {
  nsReactTree: nsReactTree
};

function nsReactTree(ns, node) {
  if (node && node.props && node.props.className) {
    node.props.className = ns + '-' + node.props.className;
  }
  var children = node.props && node.props.children;
  if (Array.isArray(children)) {
    children.forEach(function(childNode) {
      nsReactTree(ns, childNode);
    });
  } else if (children) {
    nsReactTree(ns, children);
  }
  return node;
}
