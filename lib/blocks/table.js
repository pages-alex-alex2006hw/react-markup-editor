var React = require('react');
var draft = require('draft-js');

var NestedEditor = require('../nested');

var Table = React.createClass({
    // Update a cell in the header or in a row
    updateCell: function(cellI, rowI, contentState) {
        var block = this.props.block;

        var rawContentState = draft.convertToRaw(contentState);

        var data = block.getData();
        var row, rows;

        if (rowI === undefined) {
            row = data.get('header');
        } else {
            rows = data.get('rows');
            row = rows[rowI];
        }

        row[cellI]= rawContentState;

        if (rowI === undefined) {
            data = data.set('header', row);
        } else {
            rows[rowI] = row;
            data = data.set('rows', rows);
        }

        console.log('update cell in', this.props);
        this.props.blockProps.updateBlockData(data);
    },

    // Render a cell
    renderCell: function(cell, cellI, rowI) {
        var that = this;
        var onFocusChanged = this.props.blockProps.onFocusChanged;
        var onChange = function(newContentState) {
            console.log('cell', rowI, cellI, 'changed');
            that.updateCell(cellI, rowI, newContentState);
        };

        // Create contentState
        var blocks = draft.convertFromRaw(cell);
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

