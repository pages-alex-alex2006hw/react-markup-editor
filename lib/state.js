var immutable = require('immutable');
var draft = require('draft-js');
var DraftMarkup = require('draft-markup');
var markdownSyntax = require('draft-markup/syntaxes/markdown');

var MarkupEditorState = immutable.Record({
    editorState: null,

    // Main contentState from original content
    contentState: draft.ContentState.createFromText(''),

    // Key of the current editorState
    focusedKey: 'main',

    // Map of editor state, "main" represent the
    editorStates: new immutable.OrderedMap()
});

// ---- GETTERS ---


MarkupEditorState.prototype.getEditorStates = function() {
    return this.get('editorStates');
};

MarkupEditorState.prototype.getFocusedKey = function() {
    return this.get('focusedKey');
};

MarkupEditorState.prototype.getContentState = function() {
    return this.get('contentState');
};

// ---- METHODS ---

// Return the current/focused editor state
MarkupEditorState.prototype.getFocusedEditorState = function() {
    var states = this.getEditorStates();
    var key = this.getFocusedKey();

    return states.get(key);
};

// Return an editor state by its key
MarkupEditorState.prototype.getEditorState = function(key) {
    var states = this.getEditorStates();
    return states.get(key);
};

// Return main editor state
MarkupEditorState.prototype.getMainEditorState = function() {
    return this.getEditorState('main');
};

// Return current edited content
MarkupEditorState.prototype.getCurrentContent = function() {
    var editorState = this.getMainEditorState();
    return editorState? editorState.getCurrentContent() : this.getContentState();
};

// Return content as a RawContentState
MarkupEditorState.prototype.getAsRawContent = function() {
    var contentState = this.getCurrentContent();

    // Convert contentState to rawState
    return draft.convertToRaw(contentState);
};

// Return content as a markdown string
MarkupEditorState.prototype.getAsMarkdown = function() {
    var rawContent = this.getAsRawContent();

    // Convert markdown to rawState
    var draftMarkup = new DraftMarkup(markdownSyntax);
    return draftMarkup.toText(rawContent);
};

// ---- MODIFIER ----

// Update a specific editorState
MarkupEditorState.updateEditorState = function(state, key, editorState) {
    var editorStates = state.getEditorStates();

    editorStates = editorStates.set(key, editorState);

    return state.set('editorStates', editorStates);
};

// Update the current/focused editorState
MarkupEditorState.updateFocusedEditorState = function(state, editorState) {
    var key = state.getFocusedKey();
    return MarkupEditorState.updateEditorState(state, key, editorState);
};

// Change the focus
MarkupEditorState.setFocus = function(state, key) {
    return state.set('focusedKey', key);
};

// ---- STATICS ----

// Create a markup editor state from a draft's EditorState
MarkupEditorState.createFromContentState = function createFromContentState(contentState) {
    return new MarkupEditorState({
        contentState: contentState
    });
};

// Create an empty MarkupEditorState
MarkupEditorState.createEmpty = function createEmpty() {
    return new MarkupEditorState({});
};

// Create a markup editor state from a markdown string
MarkupEditorState.createFromMarkdown = function createFromMarkdown(text) {
    // Convert markdown to rawState
    var draftMarkup = new DraftMarkup(markdownSyntax);
    var rawContent = draftMarkup.toRawContent(text);

    // Create contentState
    var blocks = draft.convertFromRaw(rawContent);

    var contentState = draft.ContentState.createFromBlockArray(blocks);

    // Create editorState from contentState
    return MarkupEditorState.createFromContentState(contentState);
};

module.exports = MarkupEditorState;
