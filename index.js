let sidebar, bars;
let sidebarCooldown = false;

// Rainbow things
let hue = 1;
let rainbow = false;
let rainbowLoop;


let categories = [
    { title: "Games", pages: [
        { title: "Bounce", name: "bounce" },
        { title: "Minesweeper", name: "minesweeper" },
    ] },

    { title: "Tools", pages: [
        { title: "Combinations", name: "comb-calc" },
    ] },
];

// Init function
function init() {
    sidebar = document.getElementById("sidebar");
    bars = document.getElementById("bars");

    // Pages
    categories = categories.map((ctg) => {
        return `<p class="row title">${ctg.title}</p>\n` + ctg.pages.map((page) => {
            return `<a href="/pages/${page.name}" class="row">${page.title}</a>`;
        }).join("\n");
    });
    document.getElementById("sidebar").innerHTML = categories.join("\n");

    window.addEventListener("click", (event) => {
        if (
            !["bars", "sidebar", "bar1", "bar2", "bar3"].includes(event.target.id)
            && sidebar.style.display === "block"
            && sidebarCooldown !== true
        ) {
            sidebar.style.display = "none";
            bars.classList.remove("change");
        }
    });

    const t = document.getElementById("table");
    new Util.Table(5, 5, t);
}


function toggleMenu() {
    sidebar.style.display = sidebar.style.display === "block" ? "none" : "block";

    bars.classList.toggle("change");

    sidebarCooldown = true;
    setTimeout(() => sidebarCooldown = false, 500);
}


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