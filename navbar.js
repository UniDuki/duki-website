document.body.onload = () => {
    const css = `
    body {
        margin: 0px !important;
    }

    #navbar {
        display: flex;
        flex-direction: row;
        overflow: hidden;

        top: 0px;
        position: fixed;

        align-items: center;

        position: fixed;
        z-index: 2;
        width: 100%;
        background-color: #333333;
        box-shadow: 0px 2px 5px 0 #474747;
    }

    #navbar > * {
        float: left;
        color: #f8f8f8;
        text-align: center;
        padding: 10px 20px;
        font-size: 17px;
        transition: 0.4s;
    }

    #navbar > *:hover { color: #fffd82; }

    `;

    // Add the css
    const stylesheet = document.createElement("style");
    stylesheet.appendChild(document.createTextNode(css));
    document.getElementsByTagName("head")[0].appendChild(stylesheet);

    const navbar = document.createElement("div");
    navbar.id = "navbar";


    /* Home button */
    const home = document.createElement("a");
    home.id = "home-button";
    home.href = "/";

    const symbol = document.createElement("i");
    symbol.classList.add("fasfa-homefa-2x");

    home.appendChild(symbol);


    /* Add navbar to page */
    [home].forEach((e) => navbar.appendChild(e));










    const body = document.body;

    document.body.innerHTML = navbar.innerHTML
    + `<div class="body-content">${document.body.innerHTML}</div>`;
};




/* Sidebar button */

/* <div class="navbar">

    <!-- Sidebar button -->
    <div id="bars" onclick="toggleMenu()">
        <div id="bar1"></div>
        <div id="bar2"></div>
        <div id="bar3"></div>
    </div>


    <!-- Home button -->
    <a id="home-button" href="/">
        <i class="fasfahomefa-2x"></i>
    </a>

</div>


<!-- Sidebar -->
<div id="sidebar" class="column"></div>

let sidebar, bars;
let sidebarCooldown = false;



const categories = [
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

    // Load the
    $.get("/", function(data) {
        console.log(data);
    });


    // Sidebar stuff
    sidebar = document.getElementById("sidebar");
    bars = document.getElementById("bars");

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
}

function toggleMenu() {
    sidebar.style.display = sidebar.style.display === "block" ? "none" : "block";

    bars.classList.toggle("change");

    sidebarCooldown = true;
    setTimeout(() => sidebarCooldown = false, 500);
}*/