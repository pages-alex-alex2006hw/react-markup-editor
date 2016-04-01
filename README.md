# react-markup-editor

[![Build Status](https://travis-ci.org/GitbookIO/react-markup-editor.png?branch=master)](https://travis-ci.org/GitbookIO/react-markup-editor) [![NPM version](https://badge.fury.io/js/react-markup-editor.svg)](http://badge.fury.io/js/react-markup-editor) [![NPM version](https://badge.fury.io/js/react-markup-editor.svg)](http://badge.fury.io/js/react-markup-editor)


> WYSIWYG React component using [draft-js](https://facebook.github.io/draft-js/) and [draft-markup](https://github.com/GitbookIO/draft-markup).


----

### Installation

Currently MarkupEditor is distributed via npm. It depends on React and React DOM which must also be installed.

```
$ npm install react-markup-editor --save
```

### Usage

MarkupEditor follows an API similar to the draft-js one.

```js
var MarkupEditor = require('react-markup-editor');

var MyApp = React.createComponent({
    getInitialState: function() {
        return {
            editorState: MarkupEditor.State.createFromMarkdown('# Hello World')
        };
    }

    // Content of the editor has changed
    onChange: function(editorState) {
        // Output as markdown:
        var markdown = editorState.getAsMarkdown();

        this.setState({
            editorState: editorState
        });
    },

    // Render the application
    // Toolbar and Editor are disociated component, you can use your own custom toolbar.
    render: function() {
        return <div id="myapp">
            <MarkupEditor.Toolbar editorState={this.state.editorState} onChange={this.onChange} />
            <MarkupEditor editorState={this.state.editorState} onChange={this.onChange} />
        </div>;
    }
});
```

### API

##### State

MarkupEditor is using its own immutable state on top of draft-js' EditorState. You can initialize an instance of `MarkupEditor.State` from different inputs:

```js
// Using a markdown string
MarkupEditor.State.createFromMarkdown('# Hello World')

// Start with an empty editor
MarkupEditor.State.createEmpty()

// Or start from an existing draft-js contentState
MarkupEditor.State.createFromContentState(contentState)
```

##### Configurations

`MarkupEditor` accepts the base propertie of draft-js Editor: `spellCheck`, `direction`.


| Property | Description |
| ----- | ----- |
| `editorState` | **Required:** State to display |
| `onChange` | **Required:** Function to call when content has changed |
| `readOnly` | Disable modification of content (Default: `false`) |


##### Rich Styling and Controls

`react-markup-editor` provides an easy to use toolbar, but you can build your own toolbar using the collection of utilities provided by this module:


###### Working with tables

Using the `TableUtils` module, you can create and edit tables:

```js
// Insert a new table at the current selection
newState = MarkupEditor.TableUtils.insert(state, state.getSelection());

// Insert a new row in the selected table
newState = MarkupEditor.TableUtils.insertRow(state, state.getSelection());

// Insert a new column in the selected table
newState = MarkupEditor.TableUtils.insertColumn(state, state.getSelection());
```

###### Working with links

Using the `LinkUtils` module, you can insert and edit links:

```js
// Insert a new link
newState = MarkupEditor.LinkUtils.insert(state, state.getSelection(), 'https://www.google.fr');

// Edit a link
newState = MarkupEditor.LinkUtils.edit(state, state.getSelection(), 'https://www.google.fr');
```

###### Working with images

Using the `LinkUtils` module, you can insert and edit images:

```js
// Insert a new image
newState = MarkupEditor.ImageUtils.insert(state, state.getSelection(), 'https://www.google.fr/logo.png');

// Edit an image
newState = MarkupEditor.ImageUtils.edit(state, state.getSelection(), 'https://www.google.fr/logo.png');
```

