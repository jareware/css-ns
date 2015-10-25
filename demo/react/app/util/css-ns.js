import createCssNs from 'css-ns';
import React from 'react';

export default namespace => createCssNs({
  namespace,
  React,
  exclude: /^material-icons/
});
