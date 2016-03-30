var React = require('react');
var draft = require('draft-js');

var Cell = React.createClass({
    render: function() {

    }
});

var Table = React.createClass({
    render: function() {
        var that = this;

        var block = this.props.block;
        console.log('table', this.props);
        var Editor = this.props.blockProps.Editor;
        var editorState = this.props.blockProps.editorState;
        var onChange = function(state) {
            console.log('onChange', state);
            that.props.blockProps.onChange(state);
        };

        var header = [
            {
                text: 'Hello'
            },
            {
                text: 'World'
            }
        ];

        return <table contentEditable={false}>
            <thead>
                <tr>
                    {header.map(function(cell, i) {
                        var cellKey = block.getKey() + '_cell_' + i;
                        var contentState = draft.ContentState.createFromText(cell.text);

                        console.log('render cell', i, cellKey);
                        return <Editor
                            editorState={editorState}
                            contentState={contentState}
                            editorKey={cellKey}
                            onChange={onChange}
                        />;
                    })}
                </tr>
            </thead>
        </table>;
    }
});

module.exports = Table;

