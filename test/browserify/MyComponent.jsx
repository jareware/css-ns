var React = require('react');
var cx = require('classnames');
var SubComponent = require('./SubComponent.jsx');

module.exports = React.createClass({

  render: function() {

    return (
      <div className="foo bar-x baz_y lib-herp">
        <span className={cx({ derp: true })} />
        <SubComponent />
      </div>
    );

  }

});
