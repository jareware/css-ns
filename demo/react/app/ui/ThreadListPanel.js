import React from 'react';
import { Panel } from 'react-bootstrap';
import { getRandomNames, getRandomMessages, getRandomColors } from '../util/data';

const ns = require('../util/css-ns')(__filename);

const names = getRandomNames();
const messages = getRandomMessages();
const colors = getRandomColors();

// This remains disabled for now, since react-addons-perf can't count instances of stateless functional components (...yet?)
/*
const SingleThread = props => (
  <div className={ns('thread')}>
    <div className={ns('badge')} style={{ background: colors[props.index] }}>{props.name.substr(0, 1)}</div>
    <div className={ns('details')}>
      <div className={ns('name')}>{props.name}</div>
      <div className={ns('message')}>{messages[props.index]}</div>
    </div>
  </div>
);
*/

class SingleThread extends React.Component {

  render() {
    return (
      <div className={ns('thread')}>
        <div className={ns('badge')} style={{ background: colors[this.props.index] }}>{this.props.name.substr(0, 1)}</div>
        <div className={ns('details')}>
          <div className={ns('name')}>{this.props.name}</div>
          <div className={ns('message')}>{messages[this.props.index]}</div>
          <div /><div /><div /><div /><div />{/* this cruft is here just to increase (non-namespaced) node count for perf tests */}
        </div>
      </div>
    );
  }

}

export default class ThreadListPanel extends React.Component {

  render() {
    return (
      <Panel className={ns('this')} header="Your conversations" bsStyle="primary">
        {names.map((name, index) => (
          <SingleThread key={index} index={index} name={name} />
        ))}
      </Panel>
    );
  }

}
