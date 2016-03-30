var React = require('react');
var draft = require('draft-js');

var Link = require('./link');
var Image = require('./image');

var LinkImage = React.createClass({
    onClick: function() {

    },

    render: function() {
        var entityKey = this.props.entityKey;

        return <Link entityKey={entityKey}>
            <Image entityKey={entityKey} />
        </Link>;
    }
});

module.exports = LinkImage;

