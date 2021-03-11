const rows = 16;
const columns = 16;

const bombAmount = 16;

let lives = 3;
let first = true;

const colors = [
    "#ff776e", "#ffb96e", "#f5ff6e", "#7fff6e",
    "#6effd8", "#6e8dff", "#c06eff", "#ff6efa",
];

let seconds = -1;
let flagged = 0;

const cells = [];
let table, timerLoop;




// Start
function init() {

    // Create a table and all the cells
    createTable();

    // Create bombs
    for (let i = 0; i < bombAmount; i++) createBomb();

    // Set text
    cells.forEach((cell) => cell.setContent());
    cells.forEach((cell) => cell.showContent());

    // Set all stats
    updateStats("lives", lives);
    updateStats("mines", bombAmount);
    updateTime();
}



// Update stats
function updateStats(id, value) {

    // Get element
    const stat = document.getElementById(id);

    // Set element
    const split = stat.innerHTML.split(":")[0] + `: ${value}`;
    console.log(split);
    stat.innerHTML = split;
}

function updateTime() {
    seconds += 1;
    updateStats("time", `${Math.floor(seconds / 60)}:${("00" + (seconds % 60)).slice(-2)}`);
}



// Create table
function createTable() {
    table = document.getElementById("table");

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



// Create bomb
function createBomb(notAllowed = []) {
    const cell = cells[Math.floor(Math.random() * cells.length)];

    if (cell.bomb !== true && !notAllowed.includes(cell)) {
        cell.bomb = true;
        return cell;
    }
    else { return createBomb(notAllowed); }
}



// Get cell
function getCell(row, column) {
    return cells.find((c) => c.row === row && c.column === column);
}


// Cell
class Cell {

    constructor(row, column, div, td) {
        this.row = row;
        this.column = column;

        this.div = div;
        this.td = td;

        this.div.onmousedown = (event) => this.onclick(event);

        // Hidden by default
        this.hidden = true;
        this.td.classList.add("hidden");

        this.flagged = false;
        this.bomb = false;
        this.content = "blank";

        cells.push(this);
    }


    setContent() {

        let nearbyBombs = 0;

        if (this.flagged) return this.content = "flag";

        if (this.bomb) return this.content = "bomb";


        // If not a bomb show how many bombs are near
        nearbyBombs = this.nearbyCells().filter((cell) => cell.bomb === true).length;

        // If no bombs are near or cell is hidden don't have text
        if (nearbyBombs > 0) {
            this.div.style.color = colors[nearbyBombs - 1];
            this.content = nearbyBombs;
        }
        else { this.content = "blank"; }
    }


    showContent() {

        let content;

        if ((this.content === "blank") || (this.hidden && !this.flagged)) {
            content = document.createTextNode("");
        }

        else if (["bomb", "flag", "wrongflag"].includes(this.content)) {
            const img = document.createElement("img");
            img.src = `./images/${this.content}.png`;

            content = img;
        }

        else { content = document.createTextNode(this.content); }



        // Remove all other children
        this.div.childNodes.forEach((n) => this.div.removeChild(n));

        // Add child
        this.div.appendChild(content);
    }


    onclick(event) {
        // If game over return
        if (lives <= 0) return;

        // If already clicked return
        if (!this.hidden) return;


        // Left click - reveal tile
        if (event.button === 0) {

            if (first) {
                first = false;

                // Start the timer
                timerLoop = setInterval(updateTime, 1000);

                // If first click is on or near a bomb move bomb(s)
                const nearbyBombs = [this, ...this.nearbyCells()]
                .filter((cell) => cell.bomb);

                if (nearbyBombs.length > 0) {
                    const newBombs = [];

                    // Remove all nearby bombs and make a new one somewhere else
                    nearbyBombs.forEach((bomb) => {
                        bomb.bomb = false;
                        newBombs.push(createBomb([this, ...this.nearbyCells()]));
                    });

                    // Update all old bombs and new bombs
                    [...nearbyBombs, ...newBombs]
                    .forEach((bomb) => { [bomb, ...bomb.nearbyCells()].forEach((cell) => {
                        cell.setContent();
                        cell.showContent();
                    }); });
                }
            }

            // If bomb
            if (this.bomb) {
                this.div.style.backgroundColor = "#f73c2f";

                // Flag mine
                flagged += 1;
                updateStats("mines", bombAmount - flagged);

                // Remove a life
                lives -= 1;
                updateStats("lives", lives);

                if (lives <= 0) gameOver();
            }

            // Show nearby blank cells if itself is blank
            if (this.content === "blank") { this.showNearby(); }

            else { this.show(); }
        }


        // Right click - flag tile
        if (event.button === 2) {
            if (this.flagged === true) {
                flagged -= 1;
                this.flagged = false;
            }
            else {
                flagged += 1;
                this.flagged = true;
            }
            updateStats("mines", bombAmount - flagged);

            this.setContent();
            this.showContent();
        }
    }


    showNearby() {
        // Get all blank touching cells
        const blankTouching = this.nearbyCells().filter((cell) =>
        cell.content === "blank" && cell.hidden);

        blankTouching.forEach((cell) => {
            cell.show();
            cell.showNearby();
        });

        this.nearbyCells().filter((cell) => !cell.flagged)
        .forEach((cell) => cell.show());
    }


    show() {
        this.hidden = false;
        this.td.classList.remove("hidden");

        if (this.flagged) {
            this.flagged = false;
            this.setContent();
        }

        this.showContent();
    }


    touchingCells() {
        const touchingPos = [[1, 0], [-1, 0], [0, 1], [0, -1]];

        return touchingPos.map((pos) => {
            return getCell(this.row + pos[0], this.column + pos[1]);
        }).filter((cell) => cell);
    }


    nearbyCells() {
        const nearbyPos = [
            [1, 0], [-1, 0], [0, 1], [0, -1],
            [1, 1], [-1, -1], [1, -1], [-1, 1],
        ];

        return nearbyPos.map((pos) => {
            return getCell(this.row + pos[0], this.column + pos[1]);
        }).filter((cell) => cell);
    }
}


// Game over
function gameOver() {

    // Show hidden bombs
    const hiddenBombs = cells.filter((cell) => cell.bomb && cell.hidden && !cell.flagged);
    hiddenBombs.forEach((bomb) => bomb.show());


    // Show incorrect flags
    const incorrectFlags = cells.filter((cell) => !cell.bomb && cell.flagged);

    incorrectFlags.forEach((cell) => {
        const img = document.createElement("img");
        img.src = "./images/wrongflag.png";

        cell.div.childNodes.forEach((n) => cell.div.removeChild(n));
        cell.div.appendChild(img);
    });


    // Stop timer
    clearInterval(timerLoop);

}



// Disable right click menu
window.addEventListener("contextmenu", (e) => e.preventDefault(), false);