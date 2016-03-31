var React = require('react');
var draft = require('draft-js');

var Code = React.createClass({
    render: function() {
        var block = this.props.block;
        var data = block.getData();
        var syntax = data.get('syntax');

        return <div>
            <div contentEditable={false} className="syntax">{syntax || 'auto'}</div>
            <draft.EditorBlock {...this.props} />
        </div>;
    }
});

module.exports = Code;
