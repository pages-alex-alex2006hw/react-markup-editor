var DraftMarkup = require('draft-markup');
var draft = require('draft-js');

var Modifier = require('./modifier');

/*
    Collection of utility to work with tables
    Each methods take as first argument a MarkupEditorState
*/

// Create a new empty cell
function createCell(text) {
    var contentState = draft.ContentState.createFromText(text || '');
    return draft.convertToRaw(contentState);
}

// Create a new empty row with a specific number of cells
function createRow(nCells) {
    return Array.apply(null, Array(nCells)).map(function(value, i) {
        return createCell('Cell ' + i);
    });
}

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


// Execute a table operation
function TableOperation(fn) {
    return function(state, blockKey) {
        var editorState = state.getEditorState();
        var contentState = editorState.getCurrentContent();

        // No blockKey, use current selection
        if (!blockKey) {
            var selection = editorState.getSelection();
            blockKey = selection.getStartKey();
        }

        var block = contentState.getBlockForKey(blockKey);
        if (block.getType() != DraftMarkup.BLOCKS.TABLE) return state;

        var data = block.getData();

        // Execute the operation
        data = fn(data);

        // Update the data of the block
        return Modifier.setBlockData(state, block, data);

    };
}


// Insert a new table
function insertTable(editorState) {

}

// Insert a new row
var insertRow = TableOperation(function(data) {
    var header = data.get('header');
    var rows = data.get('rows');

    // Create the new row
    var nCells = header.length;
    var row = createRow(nCells);

    rows.push(row);

    data.set('rows', rows);

    return data;
});

// Insert a new column
var insertColumn  = TableOperation(function(data) {
    var header = data.get('header');
    var rows = data.get('rows');
    var nCells = header.length;

    // Push a new cell on each row
    header.push(createCell('Header ' + nCells));
    rows.forEach(function(row) {
        row.push(createCell('Cell ' + nCells));
    });

    data.set('header', header);
    data.set('rows', rows);

    return data;
});

module.exports = {
    has: hasTable,
    insert: insertTable,
    insertRow: insertRow,
    insertColumn: insertColumn
};
