/* eslint-disable no-self-assign */
// Util functions
const randrange = (min, max) => Math.floor(Math.random() * ((max + 1) - min) + min);
const toNum = (num) => parseInt(num, 10);

const debug = false;

// Canvas size
const width = 500;
const height = 500;

// Let varibles be in the outer scope
let speed, size, pallete, layers;
let paused = false;

// Array to store all balls
const balls = [];



// Get layer by id
function getLayer(id) {
    return layers.find((layer) => layer.id === id);
}



// Init function
function init() {

    // Set up dropdowns
    setUpDropdowns();

    // Set up canvas layers
    const canvas = document.getElementById("canvas");
    layers = Array.from(canvas.querySelectorAll("canvas"));
    layers.forEach((layer) => {
        layer.width = width;
        layer.height = height;
        layer.innerHTML = "Your browser doesn't support canvas";
    });



    // Set up speed and size
    const speedInput = document.getElementById("speed");
    const sizeInput = document.getElementById("size");

    const speedDifferInput = document.getElementById("speedDiffer");
    const sizeDifferInput = document.getElementById("sizeDiffer");

    const getMinMax = (input, differInput) => { return {
        min: toNum(input.value)          - toNum(differInput.value) < input.min
        ? input.min : toNum(input.value) - toNum(differInput.value),
        max: toNum(input.value)          + toNum(differInput.value) > input.max
        ? input.max : toNum(input.value) + toNum(differInput.value),
    };};

    speed = getMinMax(speedInput, speedDifferInput);
    size = getMinMax(sizeInput, sizeDifferInput);

    speedInput.addEventListener("input", (event) => speed = getMinMax(speedInput, speedDifferInput));
    sizeInput.addEventListener("input", (event) => size = getMinMax(sizeInput, sizeDifferInput));



    // Sync slider with number input
    const slider = document.getElementById("slider");
    const numberInput = document.getElementById("ballAmount");

    slider.addEventListener("input", (event) => numberInput.value = event.target.value);
    numberInput.addEventListener("input", (event) => slider.value = event.target.value);



    // Palletes
    const mapArray = (length, hsl) => {
        return new Array(length).fill().map((_, i) => `hsl(${hsl})`.replace("&", i));
    };

    const palletes = [
        { name: "light", colors: mapArray(361, "&, 100%, 75%") },
        { name: "grey", colors: mapArray(100, "0, 0%, &%") },
        { name: "fire", colors: ["#fac000", "#fc6400", "#d73502", "#b62203", "#801100"] },
        { name: "sunset", colors: ["#f8b195", "#f67280", "#c06c84", "#6c5b7b", "#355c7d"] },
        { name: "sweet", colors: ["#a8e6ce", "#dcedc2", "#ffd3b5", "#ffaaa6", "#ff8c94"] },
        { name: "rgb", colors: ["#ff0000", "#00ff00", "#0000ff"] },
        { name: "rainbow", colors: mapArray(361, "&, 100%, 75%") },
    ];

    const palleteSelection = document.getElementById("palletes");
    const findPallete = () => palletes.find((p) => p.name === palleteSelection.value);

    pallete = findPallete();
    palleteSelection.addEventListener("input", (event) => {
        pallete = findPallete();
        balls.forEach((ball) => ball.resetColor());
    });



    // Update amount of balls
    const updateBalls = () => {
        if (slider.value !== balls.length) {
            if (balls.length > slider.value) for (let i = 0; i < balls.length - slider.value; i++) balls.shift();
            else for (let i = 0; i < slider.value - balls.length; i++) new Ball();
        }
    };



    // Main loop
    setInterval(() => {
        if (paused) return;

        updateBalls();
        balls.forEach((ball) => ball.move());

        draw();
    }, 10);
}



// Clear all layers
function clearCanvas() {
    layers.forEach((layer) => layer.getContext("2d").clearRect(0, 0, width, height));
}

// Clear 1 layer
function clearLayer(id) {
    getLayer(id).getContext("2d").clearRect(0, 0, width, height);
}

// Main draw function
function draw() {

    // Get layers
    const ballsLayer = getLayer("balls").getContext("2d");
    const pathsLayer = getLayer("paths").getContext("2d");
    const trailsLayer = getLayer("trails").getContext("2d");

    // Clear layers before drawing new things
    clearLayer("balls");
    clearLayer("paths");


    balls.forEach((ball) => {

        // Rainbow balls
        if (pallete.name === "rainbow") {
            let next = pallete.colors.findIndex((color) => {
                return color === ball.color;
            }) + 1;
            next = next > pallete.colors.length - 1 ? 0 : next;
            ball.color = pallete.colors[next];
        }


        // Draw ball
        ballsLayer.beginPath();
        ballsLayer.arc(ball.x, ball.y, ball.size, Math.PI * 2, false);

        ballsLayer.fillStyle = ball.color;
        ballsLayer.fill();


        // Ball outlines
        const ballOutlines = document.getElementById("ballOutlines");

        if (ballOutlines.checked) {
            ballsLayer.strokeStyle = "#000000";
            ballsLayer.lineWidth = 1;
            ballsLayer.stroke();
        }


        // Ball trails
        const ballTrails = document.getElementById("ballTrails");

        if (ballTrails.checked) {
            const trailPattern = document.getElementById("trailPattern");
            trailsLayer.beginPath();
            trailsLayer.arc(ball.x, ball.y, ball.size, Math.PI * 2, false);

            switch (trailPattern.value) {
                case "outlined":
                    trailsLayer.strokeStyle = "#000000";
                    trailsLayer.lineWidth = 1;
                    trailsLayer.stroke();
                    break;
            }

            trailsLayer.fillStyle = ball.color;
            trailsLayer.fill();
        }


        // Ball paths
        const ballPaths = document.getElementById("ballPaths");

        if (ballPaths.checked) {
            pathsLayer.beginPath();
            pathsLayer.moveTo(ball.x, ball.y);

            const d = width * height;
            const newx = d * Math.cos(ball.angle * (Math.PI / 180)) + ball.x;
            const newy = d * Math.sin(ball.angle * (Math.PI / 180)) + ball.y;
            pathsLayer.lineTo(newx, newy);

            pathsLayer.strokeStyle = ball.color;
            pathsLayer.lineWidth = ball.size / 3;
            pathsLayer.stroke();
        }


        /* Debug
        if (true) {
            /* document.getElementById("debug").innerHTML = [
                `Balls: ${balls.length}`,
                `Speed: { ${speed.min}, ${speed.max} }`,
                `Size: { ${size.min}, ${size.max} }`,
                paused,
            ].join("<br/>"); /

            // Display velocity of each ball
            ctx.beginPath();
            ctx.fillStyle = "#000000";
            ctx.font = `${ball.size / 2}px Andale Mono, monospace`;
            ctx.textAlign = "center";
            ctx.fillText(ball.angle, ball.x, ball.y + 5);
        }*/
    });
}



// Ball class
class Ball {
    constructor() {

        // Set size
        this.resetSize();

        // Set color
        this.resetColor();

        // Set speed
        this.curve = 0;
        this.resetSpeed();

        // Set position to random area
        this.resetPosition();

        // Add to the array
        balls.push(this);
    }



    reset() {
        this.resetColor(); this.resetPosition(); this.resetSize(); this.resetSpeed();
    }

    resetPosition() {
        this.x = randrange(this.size, width - this.size);
        this.y = randrange(this.size, height - this.size);
    }

    resetSpeed() {
        this.angle = randrange(0, 360);
        this.speed = randrange(speed.min, speed.max);
    }

    resetSize() { this.size = randrange(size.min, size.max); }

    resetColor() { this.color = pallete.colors[Math.floor(Math.random() * pallete.colors.length)]; }

    move() {
        const bounceType = document.getElementById("bounceType").value;
        const ball = this;

        // Function to invert given number
        const invert = (int) => int > 0 ? -Math.abs(int) : Math.abs(int);

        // Move
        const distance = this.speed / 20;

        this.x = distance * Math.cos(this.angle * (Math.PI / 180)) + this.x;
        this.y = distance * Math.sin(this.angle * (Math.PI / 180)) + this.y;


        // Walls
        let hitLeft, hitRight, hitTop, hitBottom;


        // Check if ball is past right or left wall
        if (this.x + this.size > width || this.x - this.size < 0) {

            hitLeft = this.x - this.size <= 0;
            hitRight = hitLeft ? false : true;

            // Snap back to wall
            this.x = hitLeft ? this.size : width - this.size;

            bounce();
        }


        // Check if ball is past top or bottom wall
        if (this.y + this.size > height || this.y - this.size < 0) {

            hitTop = this.y - this.size <= 0;
            hitBottom = hitTop ? false : true;

            // Snap back to wall
            this.y = hitTop ? this.size : height - this.size;

            bounce();
        }

        /*
            ↑ N = 270°
            → E = 0° or 360°
            ↓ S = 90°
            ← W = 180°

            ↗ NE = 315°
            ↘ SE = 45°
            ↙ SW = 135°
            ↖ NW = 225°
        */


        // Make sure angle is between 0 and 360
        function checkAngle(angle) {
            if (angle > 360) checkAngle(angle - 360);
            else if (angle < 0) checkAngle(360 + angle);
            else ball.angle = angle;
        }
        checkAngle(this.angle);


        // Bounce
        if (bounceType === "curved90" && Math.random() > 0.5) this.angle += this.curve;

        function bounce() {
            switch (bounceType) {
                case "90":
                    ball.angle += Math.random() > 0.5 ? 90 : -90;
                    break;

                case "180":
                    ball.angle += ball.angle > 180 ? -180 : 180;
                    break;

                case "about90":
                    ball.angle += (Math.random() > 0.5 ? 90 : -90)
                    + randrange(-5, 5);
                    break;

                case "random":
                    ball.angle += randrange(-360, 360);
                    break;

                case "nothing":
                    null;
                    break;

                case "curved90":
                    ball.angle += Math.random() > 0.5 ? 90 : -90;
                    ball.curve = Math.random() > 0.5 ? 1 : -1;
                    break;
            }
        }
    }
}



// Reset color of all balls
function resetColors() { balls.forEach((ball) => ball.resetColor()); }

// Reset speed of all balls
function resetSpeeds() { balls.forEach((ball) => ball.resetSpeed()); }

// Reset size of all balls
function resetSizes() { balls.forEach((ball) => ball.resetSize()); }

// Reset position of all balls
function resetPositions() { balls.forEach((ball) => ball.resetPosition()); }

// Reset all balls
function resetBalls() { balls.forEach((ball) => ball.reset()); }



// Pause
function pause() {
    paused = paused ? false : true;

    document.getElementById("pause").innerHTML = paused ? "Resume" : "Pause";
}



// Set up dropdowns
function setUpDropdowns() {
    Array.from(document.getElementsByClassName("dropdown")).forEach((dropdown) => {

        const button = document.getElementsByClassName("dropdown-button")[0];
        const content = document.getElementsByClassName("dropdown-content")[0];

        // When button is clicked make content visible
        button.addEventListener("click", () => {
            content.style.display = content.style.display === "block" ? "none" : "block";
        });

        // When anything but content or button is clicked hide content
        window.addEventListener("click", (event) => {
            if (!event.target.matches(".dropdown-content > button")
            && !event.target.matches(".dropdown-button")) content.style.display = "none";
        });
    });
}