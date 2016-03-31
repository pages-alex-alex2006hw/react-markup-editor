var draft = require('draft-js');

// Enforce an EditorState as inline (one block)
function inlineContent(editorState) {
    var contentState = editorState.getCurrentContent();
    var blockMap = contentState.getBlockMap();
    var blocks = blockMap.values();
    var next = blocks.next();
    var block = next.value;

    if (blockMap.size == 1 && block.getType() == 'paragraph') {
        return editorState;
    }

    contentState = draft.ContentState.createFromBlockArray([block]);
    return draft.EditorState.push(editorState, contentState, 'inlined');
}

module.exports = inlineContent;
