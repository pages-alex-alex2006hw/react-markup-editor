var React = require('react');

var Link = require('./link');
var Image = require('./image');

var LinkImage = React.createClass({
    render: function() {

        return <Link {...this.props}>
            <Image {...this.props} />
        </Link>;
    }
});

module.exports = LinkImage;

