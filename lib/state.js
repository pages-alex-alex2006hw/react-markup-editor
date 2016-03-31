var immutable = require('immutable');
var draft = require('draft-js');
var DraftMarkup = require('draft-markup');
var markdownSyntax = require('draft-markup/syntaxes/markdown');

var MarkupEditorState = immutable.Record({
    // Main editor state from draft
    editorState: null,

    // Current editor state
    focusedEditorState: null,

    // Main contentState from original content
    contentState: draft.ContentState.createFromText('')
});

// ---- GETTERS ---

MarkupEditorState.prototype.getEditorState = function() {
    return this.get('editorState');
};

MarkupEditorState.prototype.getFocusedEditorState = function() {
    return this.get('focusedEditorState');
};

MarkupEditorState.prototype.getContentState = function() {
    return this.get('contentState');
};

// ---- METHODS ---


// Return current edited content
MarkupEditorState.prototype.getCurrentContent = function() {
    var editorState = this.getEditorState();
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
MarkupEditorState.updateEditorState = function(state, editorState) {
    return state.set('editorState', editorState);
};

// Update the current/focused editorState
MarkupEditorState.updateFocusedEditorState = function(state, editorState) {
    return state.set('focusedEditorState', editorState);
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
