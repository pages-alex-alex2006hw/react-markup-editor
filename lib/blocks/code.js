var React = require('react');
var draft = require('draft-js');

var CodeUtils = require('../utils/code');

var Code = React.createClass({

    // When user clicks on the syntax
    // trigger prop function from parent editor
    onClickOnSyntax: function() {
        var block = this.props.block;
        var props = this.props.blockProps;

        if (!props.onEditCodeSyntax) return;

        props.onEditCodeSyntax(block);
    },

    render: function() {
        var block = this.props.block;
        var syntax = CodeUtils.getSyntax(block);

        return <div>
            <div contentEditable={false} className="syntax" onClick={this.onClickOnSyntax}>{syntax || 'auto'}</div>
            <draft.EditorBlock {...this.props} />
        </div>;
    }
});

module.exports = Code;
