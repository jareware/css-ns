import React from 'react';
import { Panel } from 'react-bootstrap';
import { getRandomNames, getRandomMessages, getRandomColors } from '../util/data';

const ns = require('../util/css-ns')(__filename);

export default class ThreadListPanel extends React.Component {

  render() {
    const names = getRandomNames();
    const messages = getRandomMessages();
    const colors = getRandomColors();
    return ns(
      <Panel className="this" header="Your conversations" bsStyle="primary">
        {names.map((name, index) => (
          <div key={index} className="thread">
            <div className="badge" style={{ background: colors[index] }}>{name.substr(0, 1)}</div>
            <div className="details">
              <div className="name">{name}</div>
              <div className="message">{messages[index]}</div>
            </div>
          </div>
        ))}
      </Panel>
    );
  }

}
