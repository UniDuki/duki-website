const items = [];
let screen, ctx;

const canvasY = (i) => screen.height - i;


async function init() {
    await initNavbar();

    screen = document.getElementById("screen");
    ctx = screen.getContext("2d");

    const fpsCounter = document.getElementById("fps");
    let fps = 0;


    new Player((screen.width / 2) - 10, (screen.height / 2) - 10, 20, 20, "#fff04d");


    // Main game loop
    setInterval(() => {

        // Update all items
        items.forEach((i) => i.update());


        // Draw all items
        ctx.clearRect(0, 0, screen.width, screen.height);
        items.forEach((i) => i.draw());


        // Update FPS
        fps += 1;
        setTimeout(() => fps -= 1, 1000);
    }, 16);

    // Display FPS
    setInterval(() => fpsCounter.innerText = fps, 100);
}


class Rect {
    constructor(x, y, width, height, color, options = {}) {
        this.x = x;
        this.y = y;

        this.xvel = 0;
        this.yvel = 0;

        this.yterm = 20;
        this.xterm = 20;

        this.width = width;
        this.height = height;

        this.color = color;

        items.push(this);
    }

    update() {

        // Update velocity
        if (Math.abs(this.xvel) > this.xterm) {
            this.xvel = this.xvel < 0 ? -Math.abs(this.xterm) : this.xterm;
        }

        if (Math.abs(this.yvel) > this.yterm) {
            this.yvel = this.yterm < 0 ? -Math.abs(this.yterm) : this.yterm;
        }


        // Update position
        this.x += this.xvel;
        this.y += this.yvel;

        if (this.x < 0 || this.x + this.width > screen.width) {
            this.xvel = 0;
            this.x = this.x < 0 ? 0 : screen.width - this.width;
        }

        if (this.y < 0 || this.y + this.height > screen.height) {
            this.yvel = 0;
            this.y = this.y < 0 ? 0 : screen.height - this.height;
        }
    }

    draw() {

        // Draw the rectangle
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.x, canvasY(this.y), this.width, -Math.abs(this.height));
        ctx.fill();

        // Give it a border
        ctx.strokeStyle = "#080808";
        ctx.lineWidth = 1.5;
        ctx.stroke();


        // Display its xvel and yvel
        ctx.beginPath();
        ctx.fillStyle = "#080808";
        ctx.font = "20px Freemono, monospace";
        ctx.textAlign = "center";
        ctx.fillText(
            `${this.xvel} ${this.yvel}`,
            this.x + (this.width / 2), canvasY(this.y + this.height + 5),
        );
    }
}



class Player extends Rect {
    constructor(x, y, width, height, color, options) {
        super(x, y, width, height, color, options);

        const newLoop = (fn) => setInterval(fn, 100);



        document.addEventListener("keydown", (event) => {

            const key = event.key.toUpperCase();

            // Start moving right
            if (key === "D" && !this.rightLoopID) {
                this.rightLoopID = newLoop(() => this.xvel += 1);
            }

            // Start moving left
            if (key === "A" && !this.leftLoopID) {
                this.leftLoopID = newLoop(() => this.xvel -= 1);
            }

            // Start moving up
            if (key === "W" && !this.upLoopID) {
                this.upLoopID = newLoop(() => this.yvel += 1);
            }

            // Start moving down
            if (key === "S" && !this.downLoopID) {
                this.downLoopID = newLoop(() => this.yvel -= 1);
            }
                console.log(this);

        });

        document.addEventListener("keyup", (event) => {

            const key = event.key.toUpperCase();

            // Stop moving right
            if (key === "D" && this.rightLoopID) {
                clearInterval(this.rightLoopID);
                this.rightLoopID = undefined;
            }

            // Stop moving left
            if (key === "A" && this.leftLoopID) {
                clearInterval(this.leftLoopID);
                this.leftLoopID = undefined;
            }

            // Stop moving up
            if (key === "W" && this.upLoopID) {
                clearInterval(this.upLoopID);
                this.upLoopID = undefined;
            }

            // Stop moving down
            if (key === "S" && this.downLoopID) {
                clearInterval(this.downLoopID);
                this.downLoopID = undefined;
            }

        });
    }
}