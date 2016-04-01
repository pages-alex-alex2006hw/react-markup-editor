var React = require('react');
var draft = require('draft-js');

var HeaderUtils = require('../utils/header');

var Header = React.createClass({

    // When user clicks on the ID
    // trigger prop function from parent editor
    onClickOnID: function() {
        var block = this.props.block;
        var props = this.props.blockProps;

        if (!props.onEditHeaderID) return;

        props.onEditHeaderID(block);
    },

    render: function() {
        var block = this.props.block;
        var id = HeaderUtils.getID(block);

        return <div className="MarkupEditor-header">
            <div contentEditable={false} className="header-id" onClick={this.onClickOnID}>#{id}</div>
            <draft.EditorBlock {...this.props} />
        </div>;
    }
});

module.exports = Header;
