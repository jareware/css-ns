var core = require('component-css-ns/core');

// Make sure we're testing the path ascension properly
console.log('pwd:', process.cwd().substr(__dirname.length));

// Test loading config file
console.log('configFile:', core.loadConfigFile('whatever.css'));
