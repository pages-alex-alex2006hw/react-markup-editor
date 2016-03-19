# react-markup-editor

[![NPM version](https://badge.fury.io/js/react-markup-editor.svg)](http://badge.fury.io/js/react-markup-editor)


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




