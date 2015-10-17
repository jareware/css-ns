import React from 'react';
import ReactDOM from 'react-dom';
import Perf from 'react-addons-perf';
import ReactDemoApp from './ui/ReactDemoApp';

Perf.start(); // see https://facebook.github.io/react/docs/perf.html

ReactDOM.render(<ReactDemoApp />, document.querySelector('#container'));

Perf.stop();
Perf.printInclusive();
Perf.printExclusive();
