var React = require('react');
var draft = require('draft-js');

var Image = React.createClass({
    onClick: function() {

    },

    render: function() {
        var entity = draft.Entity.get(this.props.entityKey);
        var data = entity.getData();

        return <img
            src={data.src}
            onClick={this.onClick}
            className="MarkupEditor-image" />;
    }
});

module.exports = Image;

