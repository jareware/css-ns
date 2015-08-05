var assert = require('chai').assert; // @see http://chaijs.com/api/assert/
var cssNs = require('./css-ns');

describe('css-ns', function() {

  it('works', function() {
    assert.deepEqual(123, cssNs.nsReactTree());
  });

});
