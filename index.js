let sidebar, bars;
let sidebarCooldown = false;

// Init function
function init() {
    sidebar = document.getElementById("sidebar");
    bars = document.getElementById("bars");

    // Pages
    const categories = [
        { title: "Games", pages: [
            { title: "Bounce", name: "bounce" },
            { title: "Minesweeper", name: "minesweeper" },
        ] },
    ]
    .map((ctg) => `<p class="row title">${ctg.title}</p>\n` + ctg.pages.map((page) =>
    `<a href="/pages/${page.name}" class="row">${page.title}</a>`).join("\n"));

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
}

function toggleMenu() {
    sidebar.style.display = sidebar.style.display === "block" ? "none" : "block";

    bars.classList.toggle("change");

    sidebarCooldown = true;
    setTimeout(() => sidebarCooldown = false, 500);
}