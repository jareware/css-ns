import React from 'react';
import createCssNs from 'css-ns';
import { Panel } from 'react-bootstrap';

const ns = createCssNs(__filename);

export default class ReactDemoApp extends React.Component {

  render() {
    return ns(
      <div className="this">
        <Panel className="left" header="Your conversations" bsStyle="primary">
          TODO
        </Panel>
        <Panel className="right">
          TODO
        </Panel>
      </div>
    );
  }

}
