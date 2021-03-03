// Init function
function init() {
    // . . .
}


// Add navbar to all


// Rainbow
let hue = 1;
let rainbow = false;
let rainbowLoop;

function toggleRainbow() {
    // Toggle
    rainbow = rainbow ? false : true;

    if (rainbow) {
        rainbowLoop = setInterval(() => {
            hue += 1;
            if (hue > 360) hue = 1;

            // document.body.style.backgroundColor = `hsl(${hue}, 100%, 65%)`;
            document.body.style.backgroundImage =
            `linear-gradient(45deg, hsl(${hue - 45}, 100%, 65%), hsl(${hue}, 100%, 65%))`;
        }, 50);
    }
    else {
        document.body.style.backgroundColor = "#f8f8f8";
        document.body.style.backgroundImage = null;
        clearInterval(rainbowLoop);
    }
}