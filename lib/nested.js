var immutable = require('immutable');
var React = require('react');
var ReactDOM = require('react-dom');
var draft = require('draft-js');

var findAncestor = require('./utils/findAncestor');
var inlineContent = require('./utils/inlineContent');

/*
    Component to render a nested draft editor
    @props contentState ContentState for this editor
    @props decorator Draft's decorator to use
    @props inline (boolean) Enforce content to be one block
    @props onFocusChanged Function to call when contentState changed
    @props onActiveChanged Function to be called when this editor is focused/blurred
*/
var NestedEditor = React.createClass({
    getDefaultProps: function() {
        return {
            inline: true
        };
    },

    getInitialState: function() {
        return this.getStateFromProps(this.props);
    },

    // NestedEditor receive new state
    componentWillReceiveProps: function(props) {
        var newState = this.getStateFromProps(props);

        if (props.editorID == this.props.editorID) {
            console.log('same editor');
            return;
        }

        console.log('key has changed', props.editorID, this.props.editorID);
        this.setState(newState);
    },

    // We should render the editor only when the key has changed
    // Or the editorState
    shouldComponentUpdate: function(nextProps, nextStates) {
        console.log(
            nextProps.key != this.props.key,
            nextStates.readOnly != this.state.readOnly,
            !immutable.is(nextStates.editorState, this.state.editorState)
        );
        return (
            nextProps.key != this.props.key ||
            nextStates.readOnly != this.state.readOnly ||
            !immutable.is(nextStates.editorState, this.state.editorState)
        );
    },

    // Get state from a set of props
    getStateFromProps: function(props) {
        var editorState = props.editorState;

        if (!editorState) {
            editorState = draft.EditorState.createWithContent(
                props.contentState,
                props.decorator
            );
        }

        return {
            readOnly: true,
            editorState: editorState
        };
    },

    // State of the draft editor changed
    onChange: function(editorState) {
        var oldContent, newContent, hasChanged;

        // Enforce one block if inline
        if (this.props.inline) {
            editorState = inlineContent(editorState);
        }

        // Trigger changes
        oldContent = this.state.editorState.getCurrentContent();
        newContent = editorState.getCurrentContent();
        hasChanged = oldContent !== newContent;

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

        console.log('onMouse down');

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
        console.log('render', this.props.editorID)
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
