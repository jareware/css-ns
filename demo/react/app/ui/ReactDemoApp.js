import React from 'react';
import createCssNs from 'css-ns';
import { Panel } from 'react-bootstrap';
import ThreadListPanel from './ThreadListPanel';
import ConversationPanel from './ConversationPanel';

const ns = require('../util/css-ns')(__filename);

export default class ReactDemoApp extends React.Component {

  render() {
    return (
      <div className={ns('this')}>
        <ThreadListPanel />
        <ConversationPanel />
      </div>
    );
  }

}
