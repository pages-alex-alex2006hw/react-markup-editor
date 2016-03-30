var React = require('react');
var draft = require('draft-js');

var Code = React.createClass({
    render: function() {
        var block = this.props.block;
        var syntax = 'auto'; //block.getData().syntax;

        return <div className="MarkupEditor-code-block">
            <div contentEditable={false} className="syntax">{syntax || 'auto'}</div>
            <draft.EditorBlock {...this.props} />
        </div>;
    }
});

module.exports = Code;
