const items = [];
let screen, ctx;
let debug = false;

const canvasY = (i) => screen.height - i;

const pos = (i) => Math.abs(i);
const neg = (i) => -Math.abs(i);


async function init() {
    await initNavbar();

    screen = document.getElementById("screen");
    ctx = screen.getContext("2d");

    const fpsCounter = document.getElementById("fps");
    let fps = 0;



    // Create the objects
    const fifth = Math.round(screen.height / 5);
    const half = (fifth / 2) + 25;

    new Player((screen.width / 2) - 10, (screen.height / 2) - 10, 20, 20, "#fff04d", {
        z: 1,
    });

    new Platform(50, (fifth * 2) - half, 250, 50, "#fc476b");
    new Platform(50, (fifth * 4) - half, 250, 50, "#fc476b");

    new Platform(screen.height - 50 * 2, (fifth * 2) - half, 250, 50, "#fc476b");
    new Platform(screen.height - 50 * 2, (fifth * 4) - half, 250, 50, "#fc476b");

    console.log(items);



    // Main game loop
    setInterval(() => {

        // Update all items
        items.forEach((i) => i.update());


        // Draw all items
        ctx.clearRect(0, 0, screen.width, screen.height);
        items.sort((a, b) => a.z - b.z).forEach((i) => i.draw());


        // Update FPS
        fps += 1;
        setTimeout(() => fps -= 1, 1000);
    }, 16);

    // Display FPS
    setInterval(() => fpsCounter.innerText = fps, 100);
}



// Base class
class Rect {
    constructor(x, y, width, height, color, options = {}) {

        // Position on screen
        this.x = x;
        this.y = y;

        // Height of object on canvas
        this.z = options.z || 0;

        // Velocity
        this.xv = 0;
        this.yv = 0;

        // Terminal velocity
        this.xt = 60;
        this.yt = 60;


        // Size of object
        this.width = width;
        this.height = height;

        // Color of object
        this.color = color;


        // Add object to list of items
        items.push(this);
    }

    update() {

        // Keep velocity under its max
        if (pos(this.xv) > this.xt) {
            this.xv = this.xv < 0
            ? neg(this.xt) : this.xt;
        }

        if (pos(this.yv) > this.yt) {
            this.yv = this.yt < 0
            ? neg(this.yt) : this.yt;
        }


        // Move in the x direction
        const moveX = (check, fn) => {
            if (!check) return;
            for (let i = 0; i < pos(this.xv) / 2; i++) fn();
        };
        const moveY = (check, fn) => {
            if (!check) return;
            for (let i = 0; i < pos(this.yv) / 2; i++) fn();
        };

        // Move right
        moveX(this.xv > 0, () => {
            this.x += 1;
            if (this.colliding(["right"])) {
                this.x -= 1;
                this.xv = 0;
            }
        });


        // Move left
        moveX(this.xv < 0, () => {
            this.x -= 1;
            if (this.colliding(["left"])) {
                this.x += 1;
                this.xv = 0;
            }
        });


        // Move up
        moveY(this.yv > 0, () => {
            this.y += 1;
            /*
            if (this.colliding(["top"])) {
                this.y -= 1;
                this.yv = 0;
            }
             */
        });


        // Move down
        moveY(this.yv < 0, () => {
            this.y -= 1;
            if (this.colliding(["bottom"])) {
                this.y += 1;
                this.yv = 0;
            }
        });


        // Prevent going offscreen
        if (this.x < 0 || this.x + this.width > screen.width) {
            this.xv = 0;

            this.x = this.x < 0 ? 0 : screen.width - this.width;
        }

        if (this.y < 0 || this.y + this.height > screen.height) {
            this.yv = 0;

            this.y = this.y < 0 ? 0 : screen.height - this.height;
        }
    }

    draw() {

        // Draw the Rectangle
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.x, canvasY(this.y), this.width, neg(this.height));
        ctx.fill();

        // Give it a border
        ctx.strokeStyle = "#080808";
        ctx.lineWidth = 1.5;
        ctx.stroke();


        // Display its xv and yv
        ctx.beginPath();
        ctx.fillStyle = "#080808";
        ctx.font = "20px Freemono, monospace";
        ctx.textAlign = "center";
        ctx.fillText(
            `${this.xv} ${this.yv}`,
            this.x + (this.width / 2), canvasY(this.y + this.height + 5),
        );
    }

    colliding(sides = ["top", "bottom", "right", "left"]) {
        const side = (str) => {
            return sides.find((s) => s === str) || false;
        };

        const colliding = [];

        const inrange = (arr, min, max) => {
            return arr.some((x) => x > min && x < max);
        };

        const AT = this.y + this.height;
        const AR = this.x + this.width;
        const AB = this.y;
        const AL = this.x;

        items.forEach((b) => {
            const BT = b.y + b.height;
            const BR = b.x + b.width;
            const BB = b.y;
            const BL = b.x;

            const sameX = inrange([AR, AL], BL, BR);
            const sameY = inrange([AT, AB], BB, BT);

            const checks = [
                side("right") && sameY && AR === BL,
                side("left") && sameY && AL === BR,
                side("top") && sameX && AT === BB,
                side("bottom") && sameX && AB === BT,
            ];
            if (debug) {
                console.log([
                    "\n - - - - - - -",
                    `AX: ${this.x}`,
                    `AY: ${this.y}`,
                    `BX: ${b.x}`,
                    `BY: ${b.y}`,
                    "",
                    `Side: ${side("bottom")}`,
                    `Same X: ${sameX}`,
                    `AB = BT: ${AB === BT}`,
                    "",
                ].join("\n"));
            }

            if (checks.some((c) => c)) colliding.push(b);
        });

        return colliding.length <= 0
        ? false : colliding;
    }
}



// Player
class Player extends Rect {
    constructor(x, y, width, height, color, options) {
        super(x, y, width, height, color, options);

        const newLoop = (fn) => setInterval(fn, 50);



        document.addEventListener("keydown", (event) => {

            const key = event.key.toUpperCase();

            // Start moving right
            if (key === "D" && !this.rightLoopID) {
                this.rightLoopID = newLoop(() => this.xv += 1);
            }

            // Start moving left
            else if (key === "A" && !this.leftLoopID) {
                this.leftLoopID = newLoop(() => this.xv -= 1);
            }

            // Start moving up
            else if (key === "W" && !this.upLoopID) {
                this.upLoopID = newLoop(() => this.yv += 1);
            }

            // Start moving down
            else if (key === "S" && !this.downLoopID) {
                this.downLoopID = newLoop(() => this.yv -= 1);
            }

            if (key === "G") debug =  debug ? false : true;
        });

        document.addEventListener("keyup", (event) => {

            const key = event.key.toUpperCase();

            // Stop moving right
            if (key === "D" && this.rightLoopID) {
                clearInterval(this.rightLoopID);
                this.rightLoopID = undefined;
            }

            // Stop moving left
            else if (key === "A" && this.leftLoopID) {
                clearInterval(this.leftLoopID);
                this.leftLoopID = undefined;
            }

            // Stop moving up
            else if (key === "W" && this.upLoopID) {
                clearInterval(this.upLoopID);
                this.upLoopID = undefined;
            }

            // Stop moving down
            else if (key === "S" && this.downLoopID) {
                clearInterval(this.downLoopID);
                this.downLoopID = undefined;
            }

        });
    }
}



// Basic platform
class Platform extends Rect {
    constructor(x, y, width, height, color, options) {
        super(x, y, width, height, color, options);
    }
}