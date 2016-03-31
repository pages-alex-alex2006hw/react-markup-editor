var React = require('react');
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

var MarkupEditor = React.createClass({
    getInitialState: function() {
        return {};
    },

    // Return a decorator to use
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

    // Return className for a block
    getClassForBlock: function(block) {
        return 'MarkupEditor-block MarkupEditor-' + block.getType();
    },

    // Return component to render block
    getComponentForBlock: function(block) {
        var state = this.props.editorState;
        var type = block.getType();
        var currentKey = block.getKey();

        var props = {
            active: block.getKey() == state.getActiveBlockKey(),
            onFocusChanged: this.onBlockFocusChanged.bind(this, block),
            updateBlockData: this.updateBlockData.bind(this, block)
        };

        if (type === DraftMarkup.BLOCKS.HR) {
            return {
                component: HR
            };
        } else if (type === DraftMarkup.BLOCKS.TABLE) {
            console.log('getComponentForBlock', currentKey, type);
            console.log(state.getActiveBlockKey(), block.getKey());
            return {
                component: Table,
                editable: false,
                props: props
            };
        } else if (type === DraftMarkup.BLOCKS.CODE) {
            return {
                component: Code
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
        if (!isFocused) newFocusedEditor = mainEditorState;

        // Update editor marked as focused
        state = MarkupEditorState.updateFocusedEditorState(state, block.getKey(), newFocusedEditor);
        state = MarkupEditorState.updateEditorState(state, mainEditorState);

        // Signal new MarkupEditorState
        this.props.onChange(state);
    },

    // Update data for a block
    updateBlockData: function(block, newData) {
        var state = this.props.editorState;
        var editorState = state.getEditorState();

        var contentState = editorState.getCurrentContent();
        var selection = draft.SelectionState.createEmpty(block.getKey());

        contentState = draft.Modifier.setBlockData(contentState, selection, newData);

        this.onChange(editorState);
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

    // Editor receive new props
    componentWillReceiveProps: function(nextProps) {
        console.log('nextProps', nextProps);
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
                // handleKeyCommand={this.handleKeyCommand}
                spellCheck={this.props.spellCheck}
                direction={this.props.direction}
                placeholder={this.props.placeholder}
            />
        </div>;
    }
});


module.exports = MarkupEditor;
