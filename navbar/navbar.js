const randrange = (min, max) => Math.floor(Math.random() * ((max + 1) - min) + min);

let sidebarCooldown = false;

async function initNavbar() {

    const categories = [
        { title: "Games", pages: [
            { title: "Bounce", name: "bounce" },
            { title: "Minesweeper", name: "minesweeper" },
        ] },
        { title: "Tools", pages: [
            { title: "Combinations", name: "comb-calc" },
        ] },
    ];


    // Create the navbar
    const navbarHTML = await (await fetch("/navbar/navbar.html")).text();


    // Create the sidebar
    const sidebarHTML = document.createElement("ul");
    sidebarHTML.id = "sidebar";

    categories.forEach((ctg) => {

        // Create the category title
        const title = document.createElement("li");
        title.classList.add("sidebar-title");
        title.innerText = ctg.title;

        sidebarHTML.appendChild(title);

        // Create the category pages
        ctg.pages.forEach((page) => {
            const linkContainer = document.createElement("li");
            linkContainer.classList.add("sidebar-page");

            const link = document.createElement("a");
            link.href = `/pages/${page.name}`;
            link.innerText = page.title;

            linkContainer.appendChild(link);
            sidebarHTML.appendChild(linkContainer);
        });
    });


    // Add the navbar and sidebar to the page
    document.body.innerHTML = `
        <link rel="stylesheet" href="/navbar/navbar.css">

        ${navbarHTML}

        ${sidebarHTML.outerHTML}

        <br style="user-select: none;">

        <div id="page-content">${document.body.innerHTML}<div>
    `;


    // Hide sidebar if page clicked
    const sidebar = document.getElementById("sidebar");
    const bars = document.getElementById("nav-side-btn");

    window.addEventListener("click", (event) => {
        if (
            !["nav-side-btn", "sidebar", "bar1", "bar2", "bar3"]
            .includes(event.target.id)
            && sidebar.classList.contains("active")
            && !sidebarCooldown
        ) {
            toggleSidebar();
            bars.classList.remove("change");
        }
    });
}



function toggleSidebar() {

    const sidebar = document.getElementById("sidebar");
    const bars = document.getElementById("nav-side-btn");
    const pageContent = document.getElementById("page-content");

    sidebar.classList.toggle("active");
    bars.classList.toggle("change");

    sidebarCooldown = true;
    setTimeout(() => sidebarCooldown = false, 100);


    // Add left margin
    if (sidebar.classList.contains("active")) {
        pageContent.style.marginLeft = sidebar.offsetWidth + 30 + "px";
    }

    // Remove left margin
    else {
        pageContent.style.marginLeft = "10px";
    }
}



// Rainbow button
let rainbowHue = randrange(0, 361);
let rainbowAngle = randrange(0, 361);
let rainbowLoopID;

function toggleRainbow() {
    if (!rainbowLoopID) {
        rainbowLoopID = setInterval(() => {

            rainbowHue ++;
            rainbowAngle ++;

            if (rainbowHue >= 361) rainbowHue = 0;
            if (rainbowAngle >= 361) rainbowAngle = 0;

            document.body.style.backgroundImage = `linear-gradient(
                ${rainbowAngle}deg,
                hsl(${rainbowHue + 45}, 100%, 65%),
                hsl(${rainbowHue}, 100%, 65%))`;

        }, 50);
    }

    else {
        document.body.style.backgroundColor = "#f8f8f8";
        document.body.style.backgroundImage = null;
        clearInterval(rainbowLoopID);
        rainbowLoopID = undefined;
    }
}