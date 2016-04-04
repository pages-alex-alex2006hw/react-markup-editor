var slug = require('github-slugid');
var Modifier = require('./modifier');

/*
Edit ID for an header

@param {MarkupEditorState} state
@param {ContentBlock} block
@param {String} syntax

@return {MarkupEditorState}
*/
function editID(state, block, newID) {
    return Modifier.setBlockData(state, block, {
        id: slug(newID)
    });
}

/*
Return ID for an header

@param {ContentBlock} block

@return {String}
*/
function getID(block) {
    var data = block.getData();
    return data.get('id');
}

module.exports = {
    editID: editID,
    getID: getID
};
