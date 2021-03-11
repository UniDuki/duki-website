window.addEventListener("load", async () => {
    
    if (typeof init !== "undefined") init()

    const html = await (await fetch("/navbar/navbar.html")).text()

    document.body.innerHTML = `

        <!-- Navbar CSS -->
        <link rel="stylesheet" href="/navbar/navbar.css">

        <!-- Navbar HTML -->
        ${html}

        <!-- Sidebar -->
        <ul id="sidebar"></ul>

        <br style="user-select: none;">

        <!-- Original Page -->
        <div id="page-content">${document.body.innerHTML}<div>
    `

    initSidebar()
})


let sidebar, bars, body, sidebarOG;
let sidebarCooldown = false;

function initSidebar() {
    body = document.getElementById("page-content")
    sidebar = document.getElementById("sidebar");
    bars = document.getElementById("nav-side-btn");

    // Make a clone of sidebar to always have the original sizes
    sidebarOG = sidebar.cloneNode(true)


    let categories = [
        { title: "Games", pages: [
            { title: "Bounce", name: "bounce" },
            { title: "Minesweeper", name: "minesweeper" },
        ] },
        { title: "Tools", pages: [
            { title: "Combinations", name: "comb-calc" },
        ] },
    ];

    // Format all the pages
    categories = categories.map(ctg => {
        const title = `<li class="sidebar-title">${ctg.title}</li>`

        const pages = ctg.pages.map(page => {
            return `<a href="/pages/${page.name}" class="sidebar-page">
            <li>${page.title}</li></a>`
        })

        // Join them together
        return title + pages.join("\n")
    })

    // Set the sidebar content
    sidebar.innerHTML = categories.join("\n")

    // Hide sidebar if clicking on page
    window.addEventListener("click", (event) => {
        if (
            !["nav-side-btn", "sidebar", "bar1", "bar2", "bar3"]
            .includes(event.target.id)
            && sidebar.classList.contains("active")
            && sidebarCooldown !== true
        ) {
            toggleSidebar()
            bars.classList.remove("change");
        }
    });
}



function toggleSidebar() {
    sidebar.classList.toggle("active")

    // Toggle bars
    bars.classList.toggle("change");

    sidebarCooldown = true;
    setTimeout(() => sidebarCooldown = false, 400);


    // Add left margin
    if (sidebar.classList.contains("active")) {
        body.style.marginLeft = sidebar.offsetWidth + 30 + "px"
    }

    // Remove left margin
    else {
        body.style.marginLeft = "10px"
    }
}


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
/* Titles *




/* Navbar *
.navbar {
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

.navbar > * {
    float: left;
    color: #f8f8f8;
    text-align: center;
    padding: 10px 20px;
    font-size: 17px;
    transition: 0.4s;
}

.navbar > *:hover { color: #fffd82; }


/* Sidebar *
#sidebar {
    min-width: max-content;
    top: 0;
    height: 100%;
    overflow: auto;

    background-color: #474a4e;

    position: fixed;
    z-index: 1;
    
    box-shadow: 1px 0px 3px 1px #00000088;

    padding-top: 50px;
    padding-bottom: 500px;
    padding-right: 40px;
    display: none;
    text-align: center;
}


/* Sidebar titles *
#sidebar > p {
    border-bottom: 1px solid #f8f8f8;
    color: #f8f8f8;

    padding: 25px 20px 0px 20px;
}


/* Sidebar links *
#sidebar > a {
    border: none;
    text-align: left;

    text-decoration: none;
    font-size: 16px;
    color: #f8f8f8;
    font-family: FreeMono, monospace;

    padding: 10px 20px;
}
#sidebar > a:hover { background-color: #fffd82; color: #080808; }





/* Home button *
#home-button {
    margin-left: auto;
}


/* Main page *
.container {
    margin: 100px 10px;
}

/* Menu button *
#bars {
    display: inline-block;
    cursor: pointer;
}


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