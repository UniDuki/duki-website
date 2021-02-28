/**
    * Creates a table that you can easily edit
    * @constructor
    * @param {int} rows - Amount of rows in the table
    * @param {int} columns - Amount of columns in the table
    * @param {html} element - A HTML table element
    * @return {table} This table
*/
class utilTable {
    constructor(rows, columns, element) {

        this.rows = rows;
        this.columns = columns;
        this.html = element;

        this.createTable();

        return this;
    }

    createTable() {
        for (let rowID = 0; rowID < this.rows; rowID++) {
            // ...

            for (let colID = 0; colID < this.columns; colID++) {
                // . . .
            }
        }
    }
}

// Export var
const Util = { Table };