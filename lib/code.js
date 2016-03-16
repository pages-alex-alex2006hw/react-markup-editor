var React = require('react');

var Code = React.createClass({
    render: function() {
        var block = this.props.block;
        var innerText = block.getText();
        var syntax = 'auto'; //block.getData().syntax;

        return <div contentEditable={false} className="MarkupEditor-code">
            <div className="syntax">{syntax || 'auto'}</div>
            {innerText}
        </div>;
    }
});

module.exports = Code;

