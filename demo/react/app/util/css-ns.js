import createCssNs from 'css-ns';

export default filename => createCssNs({
  namespace: filename,
  exclude: /^material-icons$/
});
