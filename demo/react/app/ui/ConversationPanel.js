import React from 'react';
import { Panel } from 'react-bootstrap';
import { getRandomMessages } from '../util/data';

const ns = require('../util/css-ns')(__filename);

class SingleMessage extends React.Component {

  render() {
    return ns(
      <div className={{ message: true, mine: Math.random() > 0.5 }}>
        {this.props.message}
      </div>
    );
  }

}

export default class ConversationPanel extends React.Component {

  render() {
    return ns(
      <Panel className="this">
        {getRandomMessages().map((message, index) => (
          <SingleMessage key={index} message={message} />
        ))}
      </Panel>
    );
  }

}
