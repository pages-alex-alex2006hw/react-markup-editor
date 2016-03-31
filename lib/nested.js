var React = require('react');
var ReactDOM = require('react-dom');
var draft = require('draft-js');

var findAncestor = require('./utils/findAncestor');

/*
    Component to render a nested draft editor
    @props contentState ContentState for this editor
    @props decorator Draft's decorator to use
    @props onFocusChanged Function to call when contentState changed
    @props onActiveChanged Function to be called when this editor is focused/blurred
*/
var NestedEditor = React.createClass({
    getInitialState: function() {
        var editorState = draft.EditorState.createWithContent(
            this.props.contentState,
            this.props.decorator
        );

        return {
            readOnly: true,
            editorState: editorState
        };
    },

    // State of the draft editor changed
    onChange: function(editorState) {
        var oldContent = this.state.editorState.getCurrentContent();
        var newContent = editorState.getCurrentContent();
        var hasChanged = oldContent !== newContent;

        this.setState({
            editorState: editorState
        });

        if (hasChanged) this.props.onChange(newContent);
    },

    // Change readOnly state of this component
    setReadOnly: function(readOnly) {
        this.props.onFocusChanged(this.state.editorState, !readOnly);
        this.setState({
            readOnly: readOnly
        });
    },

    // User clicked on this editor
    onMouseDown: function(e) {
        var that = this;

        if(!this.state.readOnly){
            return;
        }

        setTimeout(function() {
            that.setReadOnly(false);
        }, 1);

        document.addEventListener('mousedown', this.onDocumentMouseDown, false);
    },

    // User clicked somewhere in the document
    onDocumentMouseDown: function(e) {
        var component = ReactDOM.findDOMNode(this.refs.div);
        var editor = findAncestor(component, 'DraftEditor-root');
        if (e.target === component || component.contains(e.target) || !editor.contains(e.target)) {
            return;
        }

        document.removeEventListener('mousedown', this.onDocumentMouseDown, false);
        this.setReadOnly(true);
    },

    render: function() {
        return <div ref="div" onMouseDown={this.onMouseDown}>
            <draft.Editor
                readOnly={this.state.readOnly}
                editorState={this.state.editorState}
                onChange={this.onChange}
            />
        </div>;
    }
});

module.exports = NestedEditor;
