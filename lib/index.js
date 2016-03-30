var React = require('react');

var MarkupEditorState = require('./state');
var Editor = require('./editor');
var Toolbar = require('./toolbar');

var MarkupEditor = React.createClass({
    getInitialState: function() {
        return {};
    },
    render: function() {
        var markupEditorState = this.props.editorState;

        return <div className="MarkupEditor">
            <Editor
                editorKey="main"
                editorState={markupEditorState}
                contentState={markupEditorState.getContentState()}
                onChange={this.props.onChange}
                spellCheck={this.props.spellCheck}
                direction={this.props.direction}
                placeholder={this.props.placeholder}
            />
        </div>;
    }
});


module.exports = MarkupEditor;
module.exports.Toolbar = Toolbar;
module.exports.State = MarkupEditorState;
