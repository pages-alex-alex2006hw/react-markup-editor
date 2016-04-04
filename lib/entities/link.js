var React = require('react');

var LinkUtils = require('../utils/link');

var Link = React.createClass({
    onClick: function() {
        var entity = this.props.entityKey;
        if (!this.props.onEditLink) return;

        this.props.onEditLink(entity);
    },

    render: function() {
        var entityKey = this.props.entityKey;

        var href = LinkUtils.getHref(entityKey);
        var title = LinkUtils.getTitle(entityKey);

        return <a
            href={href}
            title={title}
            onClick={this.onClick}
            className="MarkupEditor-link"
        >{this.props.children}</a>;
    }
});

module.exports = Link;

