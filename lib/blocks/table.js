var React = require('react');
var draft = require('draft-js');

var NestedEditor = require('../nested');


var Table = React.createClass({
    // Update a cell in the header or in a row
    updateCell: function(cellI, rowI, cellKey, contentState) {
        var block = this.props.block;
        var rawContentState = draft.convertToRaw(contentState);

        var data = block.getData();
        var row, rows;

        // Get the right row
        if (rowI === undefined) {
            row = data.get('header');
        } else {
            rows = data.get('rows');
            row = rows[rowI];
        }

        // Edit the cell in the row
        row[cellI] = {
            key: cellKey || draft.genKey(),
            content: rawContentState
        };

        // Set the right row
        if (rowI === undefined) {
            data = data.set('header', row);
        } else {
            rows[rowI] = row;
            data = data.set('rows', rows);
        }

        // Set this cell as selected
        data = data.set('selection', {
            row: rowI,
            cell: cellI
        });

        console.log('update data for block', data);
        this.props.blockProps.updateBlockData(data);
    },

    // Render a cell
    renderCell: function(cell, cellI, rowI, selection) {
        var that = this;
        var onFocusChanged = this.props.blockProps.onFocusChanged;
        var isSelected = selection && (selection.row === rowI && selection.cell === cellI);

        var onChange = function(newContentState) {
            that.updateCell(cellI, rowI, cell.key, newContentState);
        };

        console.log('rendering cell', rowI, cellI, cell.key, isSelected);

        // Create contentState
        var blocks = draft.convertFromRaw(cell.content);
        var contentState = draft.ContentState.createFromBlockArray(blocks);

        // Return nested draft editor
        return <td key={cellI}>
            <NestedEditor
                editorID={cell.key}
                contentState={contentState}
                onFocusChanged={onFocusChanged}
                onChange={onChange}
            />
        </td>;
    },

    // Render a row (Array<Cell>)
    renderRow: function(cells, rowI, selection) {
        var that = this;

        return <tr key={rowI}>
            {cells.map(function(cell, i) {
                return that.renderCell(cell, i, rowI, selection);
            })}
        </tr>;
    },

    render: function() {
        var that = this;
        var block = this.props.block;

        var data = block.getData();
        var header = data.get('header');
        var rows = data.get('rows');
        var selection = data.get('selection');

        console.log('table rendering', data.toJS());

        return <div>
            <table contentEditable={false}>
                <thead>{this.renderRow(header, null, selection)}</thead>
                <tbody>{rows.map(function(row, i) {
                    return that.renderRow(row, i, selection);
                })}</tbody>
            </table>
        </div>;
    }
});

module.exports = Table;

