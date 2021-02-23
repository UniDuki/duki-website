class Board {
    constructor(rows, columns, cellWidth, cellHeight, table) {

        // Array to hold all cells
        this.cells = [];

        // Table size
        this.rows = rows;
        this.columns = columns;

        // Cell size
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;

        // Create cells
        for (let rowID = 0; rowID < rows; rowID++) {
            const row = document.createElement("tr");

            for (let columnID = 0; columnID < columns; columnID++) {

                const td = document.createElement("td");
                const div = document.createElement("div");

                td.appendChild(div);
                row.appendChild(td);

                new Cell(rowID + 1, columnID + 1, div, td);

            }
            table.appendChild(row);
        }
    }
}


class Cell {

}