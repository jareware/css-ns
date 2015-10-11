import React from 'react';
import createCssNs from 'css-ns';

const ns = createCssNs(__filename);

export default class ReactDemoApp extends React.Component {

  render() {
    return ns(
      <div className="this">
        Hello World!
      </div>
    );
  }

}
