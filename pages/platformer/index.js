const randrange = (min, max) => Math.floor(Math.random() * ((max + 1) - min) + min);

const items = [];
let screen;

async function init() {

    // await initNavbar();

    screen = document.getElementById("screen");
    const ctx = screen.getContext("2d");

    new Player(screen.width / 2, screen.height, 20, 20, "#f99");
    new Platform(0, 0, screen.width, 20, "#700af750");

    setInterval(() => {
        items.forEach((i) => i.update());

        ctx.clearRect(0, 0, screen.width, screen.height);
        items.forEach((i) => i.draw());
    }, 160.66);

}


// Base class
class Rect {
    constructor(x, y, width, height, color, options = {}) {

        this.x = x;
        this.y = y;

        this.xterm = 20;
        this.yterm = 20;

        this.xvel = 0;
        this.yvel = 0;

        this.color = color;

        this.width = width;
        this.height = height;

        this.collision = options.collision || true;
        this.gravity = options.gravity || false;

        items.push(this);
    }


    update() {

        // Adjust velocity
        if (this.gravity) {
            !this.colliding()
            ? this.yvel -= 1 : this.yvel = 0;
        }

        if (Math.abs(this.xvel) > this.xterm) {
            this.xvel = this.xvel < 0
            ? -Math.abs(this.xterm) : this.xterm;
        }

        if (Math.abs(this.yvel) > this.yterm) {
            this.yvel = this.yvel < 0
            ? -Math.abs(this.yterm) : this.yterm;
        }

        // Adjust position based on velocity
        this.x += this.xvel;
        this.y += this.yvel;

        if (this.x < 0) this.x = 0;
        if (this.x + this.width > screen.width) this.x = screen.width - this.width;

        if (this.y < 0) this.y = 0;
        if (this.y + this.height > screen.height) this.y = screen.height - this.height;
        console.log(this);
        this.y = 20;
    }


    draw() {
        const ctx = screen.getContext("2d");

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(
            this.x, screen.height - this.y,
            this.width, this.height,
        );
        ctx.fill();

        ctx.strokeStyle = "#080808";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "#080808";
        ctx.lineWidth = 1;
    }


    colliding(sides) {
        const aTop = this.y + this.height;
        const aBottom = this.y;
        const aRight = this.x + this.width;
        const aLeft = this.x;

        items.filter((i) => i !== this).forEach((b) => {
            const bTop = b.y + b.height;
            const bBottom = b.y;
            const bRight = b.x + b.width;
            const bLeft = b.x;

            if (aBottom <= bTop) {
                return true;
            }
        });
    }
}


// Basic Platform
class Platform extends Rect {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);
    }
}


// Basic Player
class Player extends Rect {
    constructor(x, y, width, height, color, options) {
        super(x, y, width, height, color, {
            gravity: true,
        });
    }
}
