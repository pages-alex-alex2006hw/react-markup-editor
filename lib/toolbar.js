var React = require('react');
var draft = require('draft-js');
var DraftMarkup = require('draft-markup');

var TableUtils = require('./utils/table');

var INLINE_STYLES = [
    { label: 'Bold', style: DraftMarkup.STYLES.BOLD },
    { label: 'Italic', style: DraftMarkup.STYLES.ITALIC },
    { label: '~', style: DraftMarkup.STYLES.STRIKETHROUGH },
    { label: 'Code', style: DraftMarkup.STYLES.CODE }
];

var BLOCK_TYPES = [
    { label: 'P', style: DraftMarkup.BLOCKS.PARAGRAPH },
    { label: 'H1', style: DraftMarkup.BLOCKS.HEADING_1 },
    { label: 'H2', style: DraftMarkup.BLOCKS.HEADING_2 },
    { label: 'H3', style: DraftMarkup.BLOCKS.HEADING_3 },
    { label: 'H4', style: DraftMarkup.BLOCKS.HEADING_4 },
    { label: 'Code', style: DraftMarkup.BLOCKS.CODE },
    { label: 'Quote', style: DraftMarkup.BLOCKS.BLOCKQUOTE },
    { label: 'UL', style: DraftMarkup.BLOCKS.UL_ITEM },
    { label: 'OL', style: DraftMarkup.BLOCKS.OL_ITEM },
];

// Button to toggle an inline style
var Button = React.createClass({
    onClick: function(e) {
        e.preventDefault();
        this.props.onClick();
    },

    render: function() {
        var className = 'Toolbar-Button';
        if (this.props.active) {
            className += ' active';
        }

        return <span className={className} onMouseDown={this.onClick}>
            {this.props.label}
        </span>;
    }
});


var Toolbar = React.createClass({
    // Trigger a change on the active EditorState
    applyChange: function(fn) {
        var editorState = this.props.editorState;

        // Get editorState of current draft-js Editor
        var draftEditorState = editorState.getFocusedEditorState();
        draftEditorState = fn(draftEditorState);

        // Update the current editorState
        editorState = editorState.updateFocusedEditorState(draftEditorState);

        // Signal new change
        this.props.onChange(editorState);
    },


    // Toggle type of block
    onToggleBlockType: function(blockType) {
        this.applyChange(function(editorState) {
            return draft.RichUtils.toggleBlockType(editorState, blockType);
        });
    },

    // Toggle an inline style
    onToggleInlineStyle(inlineStyle) {
        this.applyChange(function(editorState) {
            return draft.RichUtils.toggleInlineStyle(editorState, inlineStyle);
        });
    },

    // Select a style
    onSelectBlockType: function(e) {
        this.onToggleBlockType(e.target.value);
    },

    // Insert a new row
    onInsertRow: function(e) {
        var state = this.props.editorState;
        this.props.onChange(TableUtils.insertRow(state));
    },

    // Insert a new column
    onInsertColumn: function(e) {
        var state = this.props.editorState;
        this.props.onChange(TableUtils.insertColumn(state));
    },

    render: function() {
        var that = this;

        var state = this.props.editorState;
        var editorState = state.getFocusedEditorState();

        if (!editorState) return <div></div>;

        var selection = editorState.getSelection();

        // Get type of current selected block
        var currentBlockType = editorState
            .getCurrentContent()
            .getBlockForKey(selection.getStartKey())
            .getType();

        // Get current inline styles for selection
        var currentStyle = editorState.getCurrentInlineStyle();

        var isTable = TableUtils.has(state);


        return <div className="MarkupEditor-Toolbar">
            <div className="Toolbar-Group">
                {INLINE_STYLES.map(function (type) {
                    return <Button
                        key={type.label}
                        active={currentStyle.has(type.style)}
                        label={type.label}
                        onClick={that.onToggleInlineStyle.bind(that, type.style)}
                    />;
                })}
            </div>
            <div className="Toolbar-Group">
                {BLOCK_TYPES.map(function (type) {
                    return <Button
                        key={type.label}
                        active={currentBlockType == type.style}
                        label={type.label}
                        onClick={that.onToggleBlockType.bind(that, type.style)}
                    />;
                })}
            </div>
            {isTable?
                <div className="Toolbar-Group">
                    <Button
                        label="Insert row"
                        onClick={that.onInsertRow}
                    />
                    <Button
                        label="Insert column"
                        onClick={that.onInsertColumn}
                    />
                </div>
            : ''}
        </div>;
    }
});

module.exports = Toolbar;



