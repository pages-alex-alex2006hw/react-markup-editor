var Modifier = require('./modifier');

/*
Edit syntax of a code block

@param {MarkupEditorState} state
@param {ContentBlock} block
@param {String} syntax

@return {MarkupEditorState}
*/
function editSyntax(state, block, syntax) {
    return Modifier.setBlockData(state, block, {
        syntax: syntax
    });
}

/*
Return syntax for a code block

@param {ContentBlock} block

@return {String}
*/
function getSyntax(block) {
    var data = block.getData();
    return data.get('syntax');
}

module.exports = {
    editSyntax: editSyntax,
    getSyntax: getSyntax
};
