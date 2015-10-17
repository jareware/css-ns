import React from 'react';
import { Panel } from 'react-bootstrap';

const ns = require('../util/css-ns')(__filename);

export default class extends React.Component {

  render() {
    return ns(
      <Panel className="this" header="Your conversations" bsStyle="primary">
        TODO
      </Panel>
    );
  }

}
