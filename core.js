var fs = require('fs');
var path = require('path');

var CONFIG_FILE_NAME = '.component-css-ns';

// Looks for a CONFIG_FILE_NAME next to referenceFile, or along its parent chain, returning either its contents or null
// TODO: Add lookup cache based on dirname
function loadConfigFile(referenceFile) {
  var dirname = path.dirname(path.resolve(referenceFile));
  if (dirname === '/') return null; // can't ascend anymore -> call it quits
  var candidate = path.join(dirname, CONFIG_FILE_NAME);
  try {
    return require(candidate);
  } catch (e) {
    return loadConfigFile(dirname); // ascend one path level and keep looking
  }
}

module.exports = {
  loadConfigFile: loadConfigFile
};
