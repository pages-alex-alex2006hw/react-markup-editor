var React = require('react');
var draft = require('draft-js');

var Link = React.createClass({
    onClick: function() {

    },

    render: function() {
        var entity = draft.Entity.get(this.props.entityKey);
        var data = entity.getData();

        return <a
            href={data.href}
            onClick={this.onClick}
            className="MarkupEditor-link"
        >{this.props.children}</a>;
    }
});

module.exports = Link;

