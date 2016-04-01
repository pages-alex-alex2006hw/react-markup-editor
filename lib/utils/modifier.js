var draft = require('draft-js');
var MarkupEditorState = require('../state');

/*
Update current editorState

@param {MarkupEditorState} state
@param {EditorState} editorState

@return {MarkupEditorState}
*/
function updateEditorState(state, editorState) {
    var wasFocused = (state.getEditorState() == state.getFocusedEditorState());

    // Update editorState
    state = MarkupEditorState.updateEditorState(state, editorState);
    if (wasFocused) {
        state = MarkupEditorState.updateFocusedEditorState(state, null, editorState);
    }

    return state;
}

/*
Update data of a block

@param {MarkupEditorState} state
@param {ContentBlock} block
@paran {Object} data

@return {MarkupEditorState}
*/
function setBlockData(state, block, newData) {
    var editorState = state.getEditorState();

    var contentState = editorState.getCurrentContent();
    var selection = draft.SelectionState.createEmpty(block.getKey());

    // Change data for the block
    contentState = draft.Modifier.setBlockData(contentState, selection, newData);

    // Push new content state
    editorState = draft.EditorState.push(editorState, contentState, 'set-data');

    return updateEditorState(state, editorState);
}

module.exports = {
    updateEditorState: updateEditorState,
    setBlockData: setBlockData
};
