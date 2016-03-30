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
var Toolbar = require('./toolbar');

var MarkupEditor = React.createClass({
    getInitialState: function() {
        return {};
    },

    onChange: function(editorState) {
        var markupEditorState = this.props.editorState;

        // Update editorState
        markupEditorState = markupEditorState.set('editorState', editorState);

        // Signal new MarkupEditorState
        this.props.onChange(markupEditorState);
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
                component: Image,
            },
            {
                strategy: findEntityByType(DraftMarkup.ENTITIES.LINK_IMAGE),
                component: LinkImage,
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
                component: Table
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

    render: function() {
        var that = this;
        var markupEditorState = this.props.editorState;
        var editorState = markupEditorState.getEditorState();

        // No editor state yet, create one with right decorators
        if (!editorState) {
            editorState = draft.EditorState.createWithContent(
                markupEditorState.getContentState(),
                this.getDraftDecorator()
            );

            setTimeout(function() {
                that.onChange(editorState);
            }, 1);

            return <div></div>;
        }

        return <div className="MarkupEditor">
            <draft.Editor
                editorState={editorState}
                onChange={this.onChange}
                blockStyleFn={this.getClassForBlock}
                blockRendererFn={this.getComponentForBlock}
                handleKeyCommand={this.handleKeyCommand}
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
