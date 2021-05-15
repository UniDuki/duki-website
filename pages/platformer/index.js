const items = [];
let screen, ctx;
let debug = false;

const repeat = (times, fn) => {
    for (let i = 0; i < times; i++) fn(i);
};

const canvasY = (i) => screen.height - i;

const invert = (i) => i < 0 ? Math.abs(i) : -Math.abs(i);

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

    new Player((screen.width / 2) - 10, (screen.height / 2) - 10, 20, 20, "#78d6ff", {
        z: 1, gravity: true,
    });

    new Platform(150, (fifth * 4) - half, 150, 20, "#fffc57", {
        collision: ["top"],
    });

    new Platform(150, (fifth * 3) - half, 150, 20, "#fffc57", {
        collision: ["top"],
    });
    new Platform(screen.height - 50 * 2, (fifth * 3) - half, 250, 20, "#fffc57", {
        collision: ["top"],
    });

    new Platform(150, (fifth * 2) - half, 250, 50, "#fc476b");

    new Platform(screen.height - 50 * 2, (fifth * 4) - half, 250, 50, "#59ff8b", {
        collision: ["bottom"],
    });
    new Platform(screen.height - 50 * 2, (fifth * 2) - half, 250, 50, "#fc476b");
    new Platform(0, 0, screen.width, 50, "#fc476b");
    new Platform(0, 0, 20, screen.height, "#fc476b");



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

        const option = (opt, def) => {
            this[opt] = options[opt] === undefined
            ? def : options[opt];
        };

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


        // Options
        option("collision", ["top", "right", "bottom", "left"]);

        option("gravity", false);

        option("weight", 2);


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



        // Gravity
        if (this.gravity && !this.colliding(["bottom"])) {
            this.yv -= this.weight;
        }



        // Move in the x direction
        const moveX = (check, side, num) => {
            if (!check) return;
            repeat(pos(this.xv) / 8, () => {
                this.colliding([side])
                ? this.xv = 0 : this.x += num;
            });
        };

        moveX(this.xv > 0, "right", 1);
        moveX(this.xv < 0, "left", -1);



        // Move in the y direction
        const moveY = (check, side, num) => {
            if (!check) return;
            repeat(pos(this.yv) / 8, () => {
                this.colliding([side])
                ? this.yv = 0 : this.y += num;
            });
        };

        moveY(this.yv > 0, "top", 1);
        moveY(this.yv < 0, "bottom", -1);



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
        if (debug) {
            ctx.beginPath();
            ctx.fillStyle = "#f8f8f8";
            ctx.font = "15px Freemono, monospace";
            ctx.textAlign = "center";
            ctx.fillText(
                `${this.x} ${this.y}`,
                this.x + (this.width / 2), canvasY(this.y + this.height + 5),
            );
            ctx.fillText(
                `${this.xv} ${this.yv}`,
                this.x + (this.width / 2), canvasY(this.y + this.height + 20),
            );

            ctx.strokeStyle = "#080808";
            ctx.lineWidth = 1.5;
            ctx.stroke();


            const x = this.x + this.width / 2;
            const y = this.y + this.height / 2;
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = (this.width * this.height) / 100;
            ctx.moveTo(x, canvasY(y));
            ctx.lineTo(x + this.xv * 4, canvasY(y + this.yv * 4));
            ctx.stroke();
        }

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

            const bside = (str) => {
                return b.collision === false ? false
                : b.collision.find((s) => s === str);
            };


            const checks = [
                side("right") && sameY && AR === BL && bside("left"),
                side("left") && sameY && AL === BR && bside("right"),
                side("top") && sameX && AT === BB && bside("bottom"),
                side("bottom") && sameX && AB === BT && bside("top"),
            ];
            if (false) {
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

        this.jumping = false;

        const newLoop = (fn) => setInterval(fn, 16);


        document.addEventListener("keydown", (event) => {

            const key = event.key.toUpperCase();

            // Start moving right
            if (key === "D" && !this.rightLoopID) {
                this.rightLoopID = newLoop(() => this.xv += 2);
            }

            // Start moving left
            else if (key === "A" && !this.leftLoopID) {
                this.leftLoopID = newLoop(() => this.xv -= 2);
            }

            // Jump
            else if (key === "W") {
                if (this.colliding(["bottom"])) this.jump("up");
                if (this.colliding(["left"])) this.jump("right");
                if (this.colliding(["right"])) this.jump("left");
            }

            // Start moving down
            else if (key === "S" && !this.downLoopID) {
                this.downLoopID = newLoop(() => this.yv -= 2);
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

            // Stop jumping
            else if (key === "W") {
                clearInterval(this.jumpLoopID);
            }

            // Stop moving down
            else if (key === "S" && this.downLoopID) {
                clearInterval(this.downLoopID);
                this.downLoopID = undefined;
            }

        });
    }

    jump(direction) {
        if (this.jumping === false) {
            const jumpLoop = (fn, time) => this.jumpLoopID = setInterval(fn, time);

            if (direction === "up") {jumpLoop(() => this.yv += 1, 1);}

            else if (direction === "right") {jumpLoop(() => {
                this.yv += 2;
                this.xv += 2;
            }, 1);}
            else if (direction === "left") {jumpLoop(() => {
                this.yv -= 2;
                this.xv -= 2;
            }, 1);}

            setTimeout(clearInterval, 170, this.jumpLoopID);
        }
    }
}



// Basic platform
class Platform extends Rect {
    constructor(x, y, width, height, color, options) {
        super(x, y, width, height, color, options);
    }
}