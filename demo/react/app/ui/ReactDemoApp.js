import React from 'react';
import createCssNs from 'css-ns';
import { Panel } from 'react-bootstrap';
import MessagesPanel from './MessagesPanel';
import ConversationPanel from './ConversationPanel';

const ns = require('../util/css-ns')(__filename);

export default class extends React.Component {

  render() {
    return ns(
      <div className="this">
        <MessagesPanel />
        <ConversationPanel />
      </div>
    );
  }

}
