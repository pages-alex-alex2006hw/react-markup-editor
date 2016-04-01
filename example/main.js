var React = require('react');
var ReactDOM = require('react-dom');

var MarkupEditor = require('../');
var README = require('../README.md');

var Example = React.createClass({
    // Create the initial editorState from the README
    getInitialState: function() {
        return {
            editorState: MarkupEditor.State.createFromMarkdown(README)
        };
    },

    // Content has changed, update state
    onEditorChanged: function(editorState) {
        this.setState({
            editorState: editorState
        });
    },

    // Edit syntax of a code block
    onEditCodeSyntax: function(block) {
        var syntax = MarkupEditor.CodeUtils.getSyntax(block);

        // Get new syntax
        syntax = window.prompt('Enter syntax for this code block', syntax);

        this.onEditorChanged(
            MarkupEditor.CodeUtils.editSyntax(this.state.editorState, block, syntax)
        );
    },

    render: function() {
        var editorState = this.state.editorState;
        var markdownString = editorState.getAsMarkdown();
        var rawContent = editorState.getAsRawContent();

        return <div className="Example">
            <div className="Example-Editor">
                <MarkupEditor.Toolbar editorState={editorState} onChange={this.onEditorChanged} />
                <MarkupEditor
                    editorState={editorState}
                    onChange={this.onEditorChanged}
                    onEditCodeSyntax={this.onEditCodeSyntax}
                />
            </div>
            <div className="Example-Preview"><pre>{markdownString}</pre></div>
            <div className="Example-RawState"><pre>{JSON.stringify(rawContent, null, 4)}</pre></div>
        </div>;
    }
});

// Render example application
ReactDOM.render(
    <Example />,
    document.getElementById('target')
);
