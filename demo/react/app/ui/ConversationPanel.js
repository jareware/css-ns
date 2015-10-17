import React from 'react';
import { Panel } from 'react-bootstrap';
import { getRandomMessages } from '../util/data';

const ns = require('../util/css-ns')(__filename);

export default class extends React.Component {

  render() {
    return ns(
      <Panel className="this">
        {getRandomMessages().map((message, index) => (
          <div key={index} className={{ message: true, mine: Math.random() > 0.5 }}>
            {message}
          </div>
        ))}
      </Panel>
    );
  }

}
