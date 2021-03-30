const randrange = (min, max) => Math.floor(Math.random() * ((max + 1) - min) + min);

const items = [];
let screen;
let fps = 0;

async function init() {

    await initNavbar();

    screen = document.getElementById("screen");
    const ctx = screen.getContext("2d");


    new Platform(0, 80, screen.width / 3, 40,  "#81adf0", {
        collision: { top: true },
    });

    new Platform(0, 0, 20, screen.height, "#fcdf03");
    new Platform(screen.width - 20, 0, 20, screen.height, "#fcdf03");
    new Platform(0, screen.height - 20, screen.width, 20, "#fcdf03");

    new Platform((screen.width / 3) * 2, 120, screen.width / 3, 40,  "#e84a77", {
        collision: { top: true },
    });

    new Platform(0, 0, screen.width, 40,  "#69f075");
    new Player(screen.width / 2, screen.height - 60, 20, 20, "#f99");

    setInterval(() => {
        items.forEach((i) => i.update());

        ctx.clearRect(0, 0, screen.width, screen.height);
        items.forEach((i) => i.draw());

        fps += 1;
    }, 16.66);

    setInterval(() => {
        document.getElementById("fps").innerText = fps;
        fps = 0;
    }, 1000);
}


// Base class
class Rect {
    constructor(x, y, width, height, color, options = {}) {

        this.x = x;
        this.y = y;

        this.xterm = 7;
        this.yterm = 20;

        this.xvel = 0;
        this.yvel = 0;

        this.color = color;

        this.width = width;
        this.height = height;

        this.collision = options.collision;
        this.gravity = options.gravity || false;
        this.weight = options.weight || 0.5;

        items.push(this);
    }


    update() {


        if (this.gravity) {

            // Adjust velocity
            this.colliding().length <= 0
            ? this.yvel -= 1 : this.yvel = 0;


            if (Math.abs(this.xvel) > this.xterm) {
                this.xvel = this.xvel < 0
                ? -Math.abs(this.xterm) : this.xterm;
            }

            if (Math.abs(this.yvel) > this.yterm) {
                this.yvel = this.yvel < 0
                ? -Math.abs(this.yterm) : this.yterm;
            }


            // Adjust horizontal position using velocity
            for (let xi = 0; xi < Math.abs(this.xvel); xi++) {

                if (this.colliding(["right", "left"]).length > 0) {
                    this.xvel = 0;
                    break;
                }


                // Friction
                /* const friction = 0.1;
                if (this.xvel !== 0) {
                    this.xvel += this.xvel < 0 ? friction : -Math.abs(friction);
                } */


                this.x += this.xvel < 0 ? -1 : 1;


                // Prevent object going offscreen
                if (this.x < 0) this.x = 0;
                if (this.x + this.width > screen.width) this.x = screen.width - this.width;
            }


            // Adjust vertical position using velocity
            for (let yi = 0; yi < Math.abs(this.yvel); yi++) {

                if (this.colliding(["top", "bottom"]).length > 0) {
                    this.yvel = 0;
                    break;
                }

                this.y += this.yvel < 0 ? -1 : 1;


                // Prevent object going offscreen
                if (this.y < 0) this.y = 0;
                if (this.y + this.height > screen.height) this.y = screen.height - this.height;
            }
        }
    }


    draw() {
        const ctx = screen.getContext("2d");

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(
            this.x, screen.height - this.y - this.height,
            this.width, this.height,
        );
        ctx.fill();

        ctx.strokeStyle = "#080808";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#080808";
        ctx.font = "20px Monospace";
        ctx.textAlign = "center";
        ctx.fillText(`${this.xvel}, ${this.yvel}`, this.x + this.width / 2, screen.height - this.y - this.height - 10);
    }


    colliding(sides = ["top", "bottom", "right", "left"]) {

        const collisionWith = [];

        const atop = this.y + this.height;
        const abottom = this.y;
        const aright = this.x + this.width;
        const aleft = this.x;

        items.filter((i) => i !== this).forEach((b) => {
            const btop = b.y + b.height;
            const bbottom = b.y;
            const bright = b.x + b.width;
            const bleft = b.x;

            const aTouchingB = {
                top: false,
                bottom: false,
                right: false,
                left: false,
            };

            if (aright >= bleft && aleft <= bright ) {
                if (atop === bbottom) aTouchingB.top = true;
                if (abottom === btop) aTouchingB.bottom = true;
            }

            if (atop >= bbottom && abottom <= atop ) {
                if (aright === bleft) aTouchingB.right = true;
                if (aleft === bright) aTouchingB.left = true;
            }

            // True if a is colliding on all the specified sides
            const allSides = sides.some((side) => aTouchingB[side]);

            if (allSides) collisionWith.push(b);
        });

        return collisionWith;
    }
}


// Basic Platform
class Platform extends Rect {
    constructor(x, y, width, height, color, options) {
        super(x, y, width, height, color, options);
    }
}


// Basic Player
class Player extends Rect {
    constructor(x, y, width, height, color, options) {
        super(x, y, width, height, color, {
            gravity: true,
        });

        document.addEventListener("keydown", (event) => {

            const key = event.key.toLowerCase();

            if (key === "d") {
                this.x += 1;
                this.xvel += 1;
            }

            else if (key === "a") {
                this.x -= 1;
                this.xvel -= 1;
            }

            else if (key === "w") {
                this.y += 1;
                this.yvel += 20;
            }

            else if (key === "s") {
                this.y -= 1;
                this.yvel -= 20;
            }

        });
    }
}