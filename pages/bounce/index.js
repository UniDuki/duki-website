// Util functions
const randrange = (min, max) => Math.floor(Math.random() * ((max + 1) - min) + min);

const toNum = (num) => parseInt(num, 10);

const getDiffrence = (a, b) => a > b ? a - b : b - a;

const createPallete = (length, hsl) => {
    return new Array(length).fill().map((_, i) => `hsl(${hsl})`.replaceAll("&", i));
};

const palletes = [
    { name: "light", colors: createPallete(361, "&, 100%, 75%") },
    { name: "grey", colors: createPallete(100, "0, 0%, &%") },
    { name: "fire", colors: ["#fac000", "#fc6400", "#d73502", "#b62203", "#801100"] },
    { name: "sunset", colors: ["#f8b195", "#f67280", "#c06c84", "#6c5b7b", "#355c7d"] },
    { name: "sweet", colors: ["#a8e6ce", "#dcedc2", "#ffd3b5", "#ffaaa6", "#ff8c94"] },
    { name: "rgb", colors: ["#ff0000", "#00ff00", "#0000ff"] },
    { name: "rainbow", colors: createPallete(361, "&, 100%, 75%") },
];


const stats = false;
let paused = false;


// Canvas size
const width = 500;
const height = 500;


// Varibles needed to be accessed out of their scope
let speed, size, pallete, layers;
const elements = {};
let shapes = {};

// Array to store all balls
const balls = [];



// Initalization function
function init() {

    initNavbar();

    elements.ballOutlines = document.getElementById("ballOutlines");
    elements.ballPaths = document.getElementById("ballPaths");
    elements.ballTrails = document.getElementById("ballTrails");

    setupSpeedAndSize();
    syncSlider();

    setupDropdowns();
    setupPalletes();
    setupMinMax();
    setupLayers();
    setupShapes();

    updateBallAmount();


    // Main loop
    setInterval(() => {
        if (paused) return;

        balls.forEach((ball) => ball.move());

        // Clear layers before drawing new things
        clearLayer("balls");
        clearLayer("paths");
        balls.forEach((ball) => ball.draw());
    }, 16);
}



// Ball class
class Ball {
    constructor() {

        this.resetSize();

        this.resetColor();

        this.resetSpeed();

        this.resetPosition();

        this.resetShape();

        this.square = Math.random() > 0.5 ? true : false;

        balls.push(this);
    }

    reset() {
        this.resetColor(); this.resetPosition();
        this.resetSize(); this.resetSpeed();
        this.resetShape();
    }

    resetPosition() {
        this.x = randrange(this.size, width - this.size);
        this.y = randrange(this.size, height - this.size);
    }

    resetSpeed() {
        this.curve = 0;
        this.angle = randrange(0, 360);
        this.speed = randrange(speed.min, speed.max);
    }

    resetSize() {
        this.size = randrange(size.min, size.max);
    }

    resetColor() {
        this.color = pallete.colors[Math.floor(Math.random() * pallete.colors.length)];
    }

    resetShape() {
        this.shape = shapes[Math.floor(Math.random() * shapes.length)];
    }


    move() {
        const bounceType = document.getElementById("bounceType").value;
        const ball = this;

        // Move
        const distance = this.speed / 15;

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
        if (bounceType === "curved90" && Math.random() > 0.1) this.angle += this.curve;

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

                case "curved90":
                    ball.angle += Math.random() > 0.5 ? 90 : -90;
                    ball.curve = Math.random() > 0.5 ? 1 : -1;
                    break;
            }
        }
    }

    draw() {
        const ball = this;
        const ballsLayer = getLayer("balls");
        const trailsLayer = getLayer("trails");
        const pathsLayer = getLayer("paths");

        // Draw functions
        const circle = (layer, x, y, circleSize, color) => {
            layer.beginPath();
            layer.arc(x, y, circleSize, Math.PI * 2, false);
            layer.fillStyle = color;
            layer.fill();
        };

        const square = (layer, x, y, squareSize, color) => {
            squareSize *= 2;
            layer.beginPath();
            layer.rect(x - squareSize / 2, y - squareSize / 2, squareSize, squareSize);
            layer.fillStyle = color;
            layer.fill();
        };

        const outline = (layer, lineWidth = 1, color = "#0f0f0f") => {
            layer.strokeStyle = color;
            layer.lineWidth = lineWidth;
            layer.stroke();
        };

        const drawShape = (layer, x, y, bsize, color) => {
            switch (ball.shape) {
                case "square":
                    square(layer, x, y, bsize, color);
                break;

                case "circle":
                    circle(layer, x, y, bsize, color);
                break;
            }
        };


        // Rainbow balls
        if (pallete.name === "rainbow") {
            let next = pallete.colors.findIndex((c) => c === this.color) + 1;
            next = next > pallete.colors.length - 1 ? 0 : next;
            this.color = pallete.colors[next];
        }

        // Draw ball
        drawShape(ballsLayer, this.x, this.y, this.size, this.color);


        // Ball outlines
        if (elements.ballOutlines.checked) outline(ballsLayer);


        // Ball trails
        if (elements.ballTrails.checked) {
            const trailPattern = document.getElementById("trailPattern");
            drawShape(trailsLayer, this.x, this.y, this.size, this.color);

            switch (trailPattern.value) {
                case "outlined":
                    outline(trailsLayer);
                    break;
            }
        }


        // Ball paths
        if (elements.ballPaths.checked) {
            pathsLayer.beginPath();
            pathsLayer.moveTo(this.x, this.y);

            const d = width * height;
            const newx = d * Math.cos(this.angle * (Math.PI / 180)) + this.x;
            const newy = d * Math.sin(this.angle * (Math.PI / 180)) + this.y;
            pathsLayer.lineTo(newx, newy);

            pathsLayer.strokeStyle = this.color;
            pathsLayer.lineWidth = this.size / 3;
            pathsLayer.stroke();
        }
    }
}



// Set up shapes
function setupShapes() {
    // Get all the checkboxes
    const checkboxes = Array.from(document.getElementById("shapes")
    .querySelectorAll("* > *")).filter((e) => e.type === "checkbox");

    const circle = checkboxes.find((c) => c.id === "shapes-circle");

    // Function to set shapes to the checked checkboxes
    const setShapes = () => {
        shapes = checkboxes.filter((c) => c.checked)
        .map((c) => c.id.replace("shapes-", ""));
    };
    setShapes();

    // When box is clicked set shapes
    checkboxes.forEach((box) => box.onclick = (event) => {
        if (!box.checked && checkboxes.filter((c) => c.checked).length === 0) {
            return circle.checked = true;
        }
        setShapes();
    });
}



// Keep the number input synced with the slider
function syncSlider() {
    const slider = document.getElementById("slider");
    const numberInput = document.getElementById("ballAmount");

    slider.addEventListener("input", (event) => {
        numberInput.value = event.target.value;
        updateBallAmount();
    });
    numberInput.addEventListener("input", (event) => {
        slider.value = event.target.value;
        updateBallAmount();
    });
}


// Update amount of balls
function updateBallAmount() {
    const slider = document.getElementById("slider");
    const diff = getDiffrence(slider.value, balls.length);

    for (let i = 0; i < diff; i++) {
        slider.value > balls.length ? new Ball() : balls.shift();
    }
}


// Create the palletes and change pallete on selection change
function setupPalletes() {

    const palleteSelection = document.getElementById("palletes");
    const findPallete = () => palletes.find((p) => p.name === palleteSelection.value);

    pallete = findPallete();
    palleteSelection.addEventListener("input", () => {
        pallete = findPallete();
        balls.forEach((ball) => ball.resetColor());
    });
}


// Set the min and max of speed and size
function setupSpeedAndSize() {
    const speedInput = document.getElementById("speed");
    const sizeInput = document.getElementById("size");

    const speedDifferInput = document.getElementById("speedDiffer");
    const sizeDifferInput = document.getElementById("sizeDiffer");

    const getMinMax = (input, differInput) => {
        const min = toNum(input.value) - toNum(differInput.value);
        const max = toNum(input.value) + toNum(differInput.value);

        return {
            min: min < toNum(input.min) ? toNum(input.min) : min,
            max: max >= toNum(input.max) ? toNum(input.max) : max,
        };
    };

    // Listeners
    const speedListener = () =>
    speed = getMinMax(speedInput, speedDifferInput);
    speedListener();

    const sizeListener = () =>
    size = getMinMax(sizeInput, sizeDifferInput);
    sizeListener();


    speedInput.addEventListener("input", speedListener);
    speedDifferInput.addEventListener("input", speedListener);

    sizeInput.addEventListener("input", sizeListener);
    sizeDifferInput.addEventListener("input", sizeListener);
}



// Layers
function setupLayers() {
    const canvas = document.getElementById("canvas");
    layers = Array.from(canvas.querySelectorAll("canvas"));
    layers.forEach((layer) => {
        layer.width = width;
        layer.height = height;
        layer.innerHTML = "Your browser doesn't support canvas";
    });
}

function clearCanvas() {
    layers.forEach((layer) => clearLayer(layer.id));
}

function clearLayer(id) {
    getLayer(id).clearRect(0, 0, width, height);
}

function getLayer(id) {
    return layers.find((layer) => layer.id === id).getContext("2d");
}



// Reset functions
function resetColors() { balls.forEach((b) => b.resetColor()); }

function resetSpeeds() { balls.forEach((b) => b.resetSpeed()); }

function resetShapes() { balls.forEach((b) => b.resetShape()); }

function resetSizes() { balls.forEach((b) => b.resetSize()); }

function resetPositions() { balls.forEach((b) => b.resetPosition()); }

function resetBalls() { balls.forEach((b) => b.reset()); }



// Pause
function pause() {
    paused = paused ? false : true;

    document.getElementById("pause").innerHTML = paused ? "Resume" : "Pause";
}



// Set up dropdowns
function setupDropdowns() {
    Array.from(document.getElementsByClassName("dropdown")).forEach((dropdown) => {

        const button = dropdown.querySelectorAll(".dropdown-button")[0];
        const content = dropdown.querySelectorAll(".dropdown-content")[0];

        // When button is clicked toggle visibility
        button.onclick = (event) => {
            content.style.display = content.style.display === "block"
            ? "none" : "block";
        };

        // When anything but content or button is clicked hide content
        window.onclick = (event) => {
            if (content.style.display === "none") return;

            if ([button, content].includes(event.target)) {
                content.style.display === "none";
            }
        };
    });
}



// Working min max
function setupMinMax() {
    const numInputs = Array.from(document.getElementsByTagName("input"))
    .filter((input) => input.type === "number");

    numInputs.forEach((input) => {
        input.onblur = (e) => {
            if (toNum(input.value) < toNum(input.min)) input.value = input.min;
            if (toNum(input.value) > toNum(input.max)) input.value = input.max;

            if (input.value === "") input.value = input.min;

            input.dispatchEvent(new Event("input"));
        };
    });
}