const textColors = "aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgrey|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|grey|green|greenyellow|honeydew|hotpink|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgrey|lightgreen|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen";

async function init() {

    await initNavbar();

    const text = document.getElementById("text");
    text.innerHTML = textColors.replaceAll("|", "\n");

    colorize();

}

function colorize() {
    const text = document.getElementById("text");

    const regex = [
        "#(?:[0-9a-f]{3}){1,2}",

        "hsl\\(([1-2]?\\d?\\d|3[0-5]\\d|360), ?(\\d\\d?|100)%?, ?(\\d\\d?|100)%?\\)",

        "([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5]), ?([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5]), ?([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\b",

        textColors.split("|").map((r) => `${r}\\b`).join("|"),
    ].map((r) => `(${r})`).join("|");

    text.innerHTML = text.innerText.replaceAll(new RegExp(regex, "ig"), (m) => {
        if (m.includes("hsl")) {
            m = m.replaceAll(/ (\d\d?|100)[,)]/g, (n) => {
                n = n.split("");
                n.splice(-1, 0, "%");
                return n.join("");
            });
        }
        return `<span style="color: ${m};">${m}</span>`;
    });
}