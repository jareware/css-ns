import createCssNs from 'css-ns';
import { Panel } from 'react-bootstrap';
import ThreadListPanel from './ThreadListPanel';
import ConversationPanel from './ConversationPanel';

const { React } = require('../util/css-ns')(__filename);

export default class ReactDemoApp extends React.Component {

  render() {
    return (
      <div className="this">
        <ThreadListPanel />
        <ConversationPanel />
      </div>
    );
  }

}
