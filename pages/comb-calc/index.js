function init() {
    // . . .
}


function generate() {
    const combs = [];

    const div = document.getElementById("combs");
    const length = document.getElementById("length").value;

    let elements = document.getElementById("elements")
    .value.split(",").map((e) => e.trim());
    if (elements.length <= 1) elements = ["1", "2", "3", "a", "b", "c"];

    div.style.color = "#080808";


    function algee(arr) {
        if (arr.length >= length) return combs.push(arr.join("‑"));

        elements.forEach((e) => algee([...arr, e]));
    }
    elements.forEach((e) => algee([e]));

    const joinby = document.getElementById("joinby").value
    .replaceAll("\\n", "<br>");


    div.innerHTML = combs.sort().join(joinby);
}