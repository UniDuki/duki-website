/* Insert this code onto page to use util

    <!-- Util -->
    <script src="/util.js"></script>

*/

// Init util
function utilInit() {
    utilPopups();
}

// Init popups
function utilPopups() {
    const popups = document.getElementsByClassName("utilPopup");

    if (!popups) return;

    Array.from(popups).forEach((popup) => {
        popup.style.visibility = "hidden";
        popup.style.position = "absolute";
        popup.style.margin = "auto";
        popup.style.backgroundColor = "#a9a9a9";

        const button = document.getElementById(popup.getAttribute("button"));
        button.onclick = () => {
            popup.style.visibility === "hidden"
                ? (popup.style.visibility = "visible")
                : (popup.style.visibility = "hidden");
        };
    });
}

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
        if (!rows) throw "utilTable Error: Unspecified amount of rows";
        if (!columns) throw "utilTable Error: Unspecified amount of rows";
        if (!table) throw "utilTable Error: No table element given";

        this.rows = rows;
        this.columns = columns;
        this.dom = table;
        this.cells = [];

        this.createTable();

        return this;
    }

    createTable() {
        for (let rowID = 0; rowID < this.rows; rowID++) {
            // Create row and all the cells inside of it
            const row = document.createElement("tr");

            for (let colID = 0; colID < this.columns; colID++) {
                const td = document.createElement("td");

                const cell = new utilTableCell();
                this.cells.push(cell);

                row.appendChild(td);
            }

            this.dom.appendChild(row);
        }
    }
}

class utilTableCell {
    constructor(row, column, front, back) {
        this.row = row;
        this.column = column;

        this.front = front;
        this.back = back;

        return this;
    }
}
