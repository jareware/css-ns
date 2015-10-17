import React from 'react';
import ReactDOM from 'react-dom';
import Perf from 'react-addons-perf';
import ReactDemoApp from './ui/ReactDemoApp';

Perf.start(); // see https://facebook.github.io/react/docs/perf.html
const then = Date.now();
ReactDOM.render(<ReactDemoApp />, document.querySelector('#container'));
const now = Date.now();
Perf.stop();

// for NODE_ENV=production
console.log('Total render time:', now - then, 'ms');

Perf.printInclusive();
Perf.printExclusive();
