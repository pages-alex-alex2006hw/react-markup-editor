# react-markup-editor

> WYSIWYG React component using [draft-js](https://facebook.github.io/draft-js/) and [draft-markup](https://github.com/GitbookIO/draft-markup).

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

    // Render the editor
    render: function() {
        return <MarkupEditor editorState={this.state.editorState} />;
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

