var React = require('react');
var draft = require('draft-js');
var DraftMarkup = require('draft-markup');

var MarkupEditorState = require('./state');

var findEntityByType = require('./utils/findEntityByType');
var Modifier = require('./utils/modifier');

var Header = require('./blocks/header');
var HR = require('./blocks/hr');
var Table = require('./blocks/table');
var Code = require('./blocks/code');
var Link = require('./entities/link');
var Image = require('./entities/image');
var LinkImage = require('./entities/link-image');


/*
MarkupEditor represents the higher level component for a WYSIWYG editor
to edit markup language such as Markdown

@prop {MarkupEditorState} editorState: state of editor to display
@prop {Function} onChange: function to be called when editorState changed

@prop {Boolean} readOnly: enable/disable manipulation by the user
@prop {String} direction: direction for the text ("rtl" or "ltr"), default is "ltr"
@prop {String} placeholder: text to display when content is empty
@prop {Function} onEditCodeSyntax: function to be called when user click on a code block syntax
@prop {Function} onEditHeaderID: function to be called when user click on an header's ID
@prop {Function} onEditLink: function to be called when user click on a link
*/
var MarkupEditor = React.createClass({
    getInitialState: function() {
        return {};
    },

    // Return a decorator to use
    getDraftDecorator: function() {
        var props = {
            onEditLink: this.props.onEditLink
        };

        return new draft.CompositeDecorator([
            {
                strategy: findEntityByType(DraftMarkup.ENTITIES.LINK),
                component: Link,
                props: props
            },
            {
                strategy: findEntityByType(DraftMarkup.ENTITIES.IMAGE),
                component: Image,
                props: props
            },
            {
                strategy: findEntityByType(DraftMarkup.ENTITIES.LINK_IMAGE),
                component: LinkImage,
                props: props
            }
        ]);
    },

    // Return className for a block
    getClassForBlock: function(block) {
        return 'MarkupEditor-block MarkupEditor-' + block.getType();
    },

    // Return component to render block
    getComponentForBlock: function(block) {
        var state = this.props.editorState;
        var type = block.getType();

        var props = {
            active: block.getKey() == state.getActiveBlockKey(),
            focusedEditor: state.getFocusedEditorState(),
            onFocusChanged: this.onBlockFocusChanged.bind(this, block),
            updateBlockData: this.updateBlockData.bind(this, block),
            onEditCodeSyntax: this.props.onEditCodeSyntax,
            onEditHeaderID: this.props.onEditHeaderID
        };

        if (type.indexOf('header-') === 0) {
            return {
                component: Header,
                props: props
            };
        } else if (type === DraftMarkup.BLOCKS.HR) {
            return {
                component: HR,
                props: props
            };
        } else if (type === DraftMarkup.BLOCKS.TABLE) {
            return {
                component: Table,
                editable: false,
                props: props
            };
        } else if (type === DraftMarkup.BLOCKS.CODE) {
            return {
                component: Code,
                props: props
            };
        }
    },

    // Change focus to a new editorState
    onBlockFocusChanged: function(block, editorState, isFocused) {
        var state = this.props.editorState;
        var mainEditorState = state.getEditorState();

        var newFocusedEditor = isFocused? editorState : mainEditorState;

        // Nothing changed?
        if (newFocusedEditor == state.getFocusedEditorState()) {
            return;
        }

        // Force a refresh
        mainEditorState = draft.EditorState.createWithContent(
            mainEditorState.getCurrentContent(),
            this.getDraftDecorator()
        );

        // Force selection of this block
        var selectionState = draft.SelectionState.createEmpty(block.getKey());
        mainEditorState = draft.EditorState.acceptSelection(
            mainEditorState,
            selectionState
        );

        if (!isFocused) newFocusedEditor = mainEditorState;

        // Update editor marked as focused
        state = MarkupEditorState.updateFocusedEditorState(state, block.getKey(), newFocusedEditor);
        state = MarkupEditorState.updateEditorState(state, mainEditorState);

        // Signal new MarkupEditorState
        console.log('has changed focused editor');
        this.props.onChange(state);
    },

    // Update data for a block
    updateBlockData: function(block, newData) {
        var state = this.props.editorState;

        state = Modifier.setBlockData(state, block, newData);
        this.props.onChange(state);
    },

    // Main editor state changed
    onChange: function(editorState) {
        var state = this.props.editorState;
        var wasFocused = (state.getEditorState() == state.getFocusedEditorState());

        // Update editorState
        state = MarkupEditorState.updateEditorState(state, editorState);
        if (wasFocused) {
            state = MarkupEditorState.updateFocusedEditorState(state, null, editorState);
        }

        // Signal new MarkupEditorState
        this.props.onChange(state);
    },

    // Don't split code blocks when user pressed Enter
    handleReturn: function(e) {
        var markupEditorState = this.props.editorState;
        var editorState = markupEditorState.getEditorState();
        var contentState = editorState.getCurrentContent();
        var selection = editorState.getSelection();
        var startKey = selection.getStartKey();
        var currentBlockType = contentState
            .getBlockForKey(startKey)
            .getType();

        if (currentBlockType != DraftMarkup.BLOCKS.CODE) return;

        // Insert new line
        contentState = draft.Modifier.insertText(contentState, selection, '\n');
        editorState = draft.EditorState.push(editorState, contentState, 'insert-line');
        this.onChange(editorState);

        return true;
    },

    render: function() {
        var that = this;
        var state = this.props.editorState;
        var editorState = state.getEditorState();
        var focusedEditorState = state.getFocusedEditorState();

        var isFocused = focusedEditorState == editorState;

        // Create editorState if only contentState of provided
        if (!editorState) {
            editorState = draft.EditorState.createWithContent(
                state.getContentState(),
                this.getDraftDecorator()
            );

            setTimeout(function() {
                that.onChange(editorState);
            }, 1);

            return <div></div>;
        }

        return <div className="MarkupEditor">
            <draft.Editor
                readOnly={!isFocused}
                editorState={editorState}
                onChange={this.onChange}
                blockStyleFn={this.getClassForBlock}
                blockRendererFn={this.getComponentForBlock}
                handleReturn={this.handleReturn}
                // handleKeyCommand={this.handleKeyCommand}
                spellCheck={this.props.spellCheck}
                direction={this.props.direction}
                placeholder={this.props.placeholder}
            />
        </div>;
    }
});


module.exports = MarkupEditor;
