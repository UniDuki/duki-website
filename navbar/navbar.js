let sidebarCooldown = false;

async function initNavbar() {

    const categories = [
        { title: "Games", pages: [
            { title: "Bounce", name: "bounce" },
            { title: "%B Minesweeper", name: "minesweeper" },
            { title: "%B Platformer", name: "platformer" },
        ] },
        { title: "Tools", pages: [
            { title: "Combinations", name: "comb-calc" },
            { title: "Color Preview", name: "color-preview" },
            { title: "Clock", name: "clock" },
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


            const link = document.createElement("a");
            const linkText = document.createElement("li");

            // Beta pages
            if (page.title.startsWith("%B")) {
                page.title = page.title.replace("%B", "[BETA]");
            }

            link.href = `/pages/${page.name}`;
            link.classList.add("sidebar-page");
            linkText.innerText = page.title;

            link.appendChild(linkText);
            sidebarHTML.appendChild(link);
        });
    });

    // Sidebar Info
    const info = document.createElement("li");

    info.classList.add("sidebar-info");

    info.innerText += "Pages labeled [BETA] are currently under development and may not work as intended";

    sidebarHTML.appendChild(info);


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
    const navbar = document.getElementById("navbar");

    sidebar.classList.toggle("active");
    navbar.classList.toggle("active");
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
let rainbowHue = Math.floor(Math.random() * ((361 + 1) ));
let rainbowAngle = Math.floor(Math.random() * ((361 + 1)));
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
        document.body.style.backgroundImage = null;
        clearInterval(rainbowLoopID);
        rainbowLoopID = undefined;
    }
}