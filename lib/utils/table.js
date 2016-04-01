var DraftMarkup = require('draft-markup');

/*
    Collection of utility to work with tables
    Each methods take as first argument a MarkupEditorState
*/

// Verify that current selected block is a table
function hasTable(markupEditorState) {
    var editorState = markupEditorState.getEditorState();
    var contentState = editorState.getCurrentContent();
    var selection = editorState.getSelection();
    var startKey = selection.getStartKey();
    var currentBlockType = contentState
        .getBlockForKey(startKey)
        .getType();

    return currentBlockType == DraftMarkup.BLOCKS.TABLE;
}

// Insert a new table
function insertTable(editorState) {

}

// Insert a new row
function insertRow(editorState) {

}

// Insert a new column
function insertColumn(editorState) {

}

module.exports = {
    has: hasTable,
    insert: insertTable,
    insertRow: insertRow,
    insertColumn: insertColumn
};
