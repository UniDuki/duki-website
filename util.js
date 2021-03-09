/**
    * Creates a table that you can easily edit
    * @constructor
    * @param {int} rows - Amount of rows in the table
    * @param {int} columns - Amount of columns in the table
    * @param {html} element - A HTML table element
    * @return {table} This table
*/
class utilTable {
    constructor(rows, columns, table) {

        if (!rows) throw "utilTable Error: Unspecified amount of rows"
        if (!columns) throw "utilTable Error: Unspecified amount of rows"
        if (!table) throw "utilTable Error: No table element given"

        this.rows = rows;
        this.columns = columns;
        this.dom = table;
        this.cells = []

        this.createTable();

        return this;
    }

    createTable() {
        for (let rowID = 0; rowID < this.rows; rowID++) {

            // Create row and all the cells inside of it
            const row = document.createElement("tr");

            for (let colID = 0; colID < this.columns; colID++) {
                const td = document.createElement("td")

                const cell = new utilTableCell()
                this.cells.push(cell)

                row.appendChild(td)
            }
        
            this.dom.appendChild(row)
        }
    }
}

class utilTableCell {
    constructor(row, column, front, back) {
        this.row = row
        this.column = column

        this.front = front
        this.back = back

        return this
    }
}