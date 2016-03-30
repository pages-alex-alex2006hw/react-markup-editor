var React = require('react');
var ReactDOM = require('react-dom');
var draft = require('draft-js');
var DraftMarkup = require('draft-markup');

var MarkupEditorState = require('./state');
var findEntityByType = require('./utils/findEntityByType');

var HR = require('./blocks/hr');
var Table = require('./blocks/table');
var Code = require('./blocks/code');
var Link = require('./entities/link');
var Image = require('./entities/image');
var LinkImage = require('./entities/link-image');

/*
    Wrapper for a draft.Editor using a specific EditorState
    from a MarkupEditorState using "editorKey"
*/
var Editor = React.createClass({

    getInitialState: function() {
        return {
            readOnly: false
        };
    },

    // User click on this editor
    onMousedown: function(e) {

    },

    // Return decorator for draft-js
    getDraftDecorator: function() {
        return new draft.CompositeDecorator([
            {
                strategy: findEntityByType(DraftMarkup.ENTITIES.LINK),
                component: Link
            },
            {
                strategy: findEntityByType(DraftMarkup.ENTITIES.IMAGE),
                component: Image
            },
            {
                strategy: findEntityByType(DraftMarkup.ENTITIES.LINK_IMAGE),
                component: LinkImage
            }
        ]);
    },

    // Return component to render block
    getComponentForBlock: function(block) {
        var type = block.getType();

        if (type === DraftMarkup.BLOCKS.HR) {
            return {
                component: HR
            };
        } else if (type === DraftMarkup.BLOCKS.TABLE) {
            return {
                component: Table,
                editable: false,
                props: {
                    editorState: this.props.editorState,
                    onChange: this.props.onChange,
                    Editor: Editor
                }
            };
        } else if (type === DraftMarkup.BLOCKS.CODE) {
            return {
                component: Code
            };
        }
    },

    // Return className for a block
    getClassForBlock: function(block) {
        return 'MarkupEditor-block MarkupEditor-' + block.getType();
    },

    // Handle key command from draft
    handleKeyCommand: function(command) {
        var markupEditorState = this.props.editorState;
        var editorState = markupEditorState.getFocusedEditorState();
        var newState = draft.RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    },

    // EditorState changed
    // Update it in the MarkupEditorState
    onChange: function(editorState) {
        var state = this.props.editorState;
        var editorKey = this.props.editorKey;

        // Force refresh?
        editorState = draft.EditorState.createWithContent(editorState.getCurrentContent(), this.getDraftDecorator());

        // Update editorState
        state = MarkupEditorState.updateEditorState(state, editorKey, editorState);

        // Signal new MarkupEditorState
        this.props.onChange(state);
    },

    render: function() {
        var that = this;
        var markupEditorState = this.props.editorState;

        // Is this editor focused?
        var editorKey = this.props.editorKey;
        var focusedEditorKey = markupEditorState.getFocusedKey();
        var isFocused = (editorKey == focusedEditorKey);

        // Get editorState matching the key or create it
        var editorState = markupEditorState.getEditorState(editorKey);
        if (!editorState) {
            editorState = draft.EditorState.createWithContent(
                this.props.contentState,
                this.getDraftDecorator()
            );

            setTimeout(function() {
                that.onChange(editorState);
            }, 1);

            return <div></div>;
        }

        console.log('render editor', editorKey, 'focused=' + isFocused, focusedEditorKey);

        return <draft.Editor
            readOnly={!isFocused}
            editorState={editorState}
            onChange={this.onChange}
            blockStyleFn={this.getClassForBlock}
            blockRendererFn={this.getComponentForBlock}
            // handleKeyCommand={this.handleKeyCommand}
            spellCheck={this.props.spellCheck}
            direction={this.props.direction}
            placeholder={this.props.placeholder}
        />;
    }
});

module.exports = Editor;
