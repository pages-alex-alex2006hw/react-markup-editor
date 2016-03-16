var React = require('react');
var draft = require('draft-js');
var DraftMarkup = require('draft-markup');

var MarkupEditorState = require('./state');

var HR = require('./hr');
var Link = require('./link');
var Image = require('./image');
var Table = require('./table');
var Code = require('./code');

var MarkupEditor = React.createClass({
    getInitialState: function() {
        return {};
    },

    onChange: function(editorState) {
        console.log('editor state changed');
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
                strategy: findEntity(DraftMarkup.INLINES.LINK),
                component: Link
            },
            {
                strategy: findEntity(DraftMarkup.INLINES.IMAGE),
                component: Image,
            },
            {
                strategy: findEntity(DraftMarkup.BLOCKS.TABLE),
                component: Table,
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

    render: function() {
        var that = this;
        var markupEditorState = this.props.editorState;
        var editorState = markupEditorState.getEditorState();

        // No editor state yet, create one with right decorators
        if (!editorState) {
            editorState = draft.EditorState.createWithContent(
                markupEditorState.getContentState()
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
                spellCheck={this.props.spellCheck}
                direction={this.props.direction}
            />
        </div>;
    }
});


module.exports = MarkupEditor
module.exports.State = MarkupEditorState;
