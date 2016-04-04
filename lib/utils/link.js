var draft = require('draft-js');

var Modifier = require('./modifier');

/*
Return href for a link

@param {String} entityKey
@return {String}
*/
function getHref(entityKey) {
    var entity = draft.Entity.get(entityKey);
    var data = entity.getData();

    return data.href;
}

/*
Return title for a link

@param {String} entityKey
@return {String}
*/
function getTitle(entityKey) {
    var entity = draft.Entity.get(entityKey);
    var data = entity.getData();

    return data.title;
}

/*
Create a new link at a selection

@param {MarkupEditorState} state
@param {SelectionState} state
@param {Object} link
@return {String}
*/
function insert(state, selection, link) {
    var editorState = state.getEditorState();
    var contentState = editorState.getCurrentContent();

    // Create the link entity
    var key = draft.Entity.create('LINK', 'MUTABLE', {href: 'http://www.zombo.com'});

    // Apply it to the selection
    var contentStateWithLink = Modifier.applyEntity(
        contentState,
        selection,
        key
    );

    // Push new content state
    editorState = draft.EditorState.push(editorState, contentStateWithLink, 'insert-link');

    // Output new MarkupEditorState
    return Modifier.updateEditorState(state, editorState);
}

/*
Edit an existing link

@param {MarkupEditorState} state
@param {SelectionState} state
@param {Object} link
@return {String}
*/
function edit(state, selection, link) {
    var editorState = state.getEditorState();
    var contentState = editorState.getCurrentContent();

    // Edit the link entity
    var key = draft.Entity.mergeData('LINK', 'MUTABLE', {href: 'http://www.zombo.com'});

    // Apply it to the selection
    var contentStateWithLink = Modifier.applyEntity(
        contentState,
        selection,
        key
    );

    // Push new content state
    editorState = draft.EditorState.push(editorState, contentStateWithLink, 'insert-link');

    // Output new MarkupEditorState
    return Modifier.updateEditorState(state, editorState);
}

module.exports = {
    getHref: getHref,
    getTitle: getTitle,

    insert: insert,
    edit: edit
};
