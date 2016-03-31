var React = require('react');
var draft = require('draft-js');

var NestedEditor = require('../nested');

var Table = React.createClass({
    // Render a cell
    renderCell: function(cell, cellI, rowI) {
        var onFocusChanged = this.props.blockProps.onFocusChanged;
        var onChange = function() {
            console.log('cell', rowI, cellI, 'changed');
        };

        // Create contentState
        var blocks = draft.convertFromRaw(cell.content);
        var contentState = draft.ContentState.createFromBlockArray(blocks);

        // Return nested draft editor
        return <td key={cellI}>
            <NestedEditor
                contentState={contentState}
                onFocusChanged={onFocusChanged}
                onChange={onChange}
            />
        </td>;
    },

    // Render a row (Array<Cell>)
    renderRow: function(cells, rowI) {
        var that = this;

        return <tr key={rowI}>
            {cells.map(function(cell, i) {
                return that.renderCell(cell, i, rowI);
            })}
        </tr>;
    },

    render: function() {
        var block = this.props.block;

        var data = block.getData();
        var header = data.get('header');
        var rows = data.get('rows');

        return <table contentEditable={false}>
            <thead>{this.renderRow(header)}</thead>
            <tbody>{rows.map(this.renderRow)}</tbody>
        </table>;
    }
});

module.exports = Table;

