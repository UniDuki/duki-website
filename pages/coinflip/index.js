// Util functions
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const format = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");



let money = 10000;

const colors = {
    red: "#ff8c8c",    orange: "#ffc08c",
    yellow: "#fff28c", green: "#b5ffbb",
    blue: "#b8ebff",   purple: "#e5a8ff",
    white: "#e6e6e6",  black: "#a19797",
};

async function init() {
    await initNavbar();
    setupMinMax();

    updateMoney();
}


// Flip
function flip(times) {
    for (let i = 0; i < times; i++) coinflip();
}

function coinflip() {
    const tax = document.getElementById("tax").value;
    const bet = document.getElementById("bet").value;

    let net = 0;

    // Give / remove the player's money
    const win = Math.random() > 0.5;

    net += win
    ? bet - (tax / 100) * bet
    : -Math.abs(bet);

    updateMoney(net);

    // Log what happend
    const ctext = (text, color) => `<span style="color: ${color}">${text}</span>`;

    const log = document.getElementById("log");

    const player = document.getElementById("color").value;
    const bot = random(Object.keys(colors).filter((c) => c !== player));

    const playerHTML = ctext(player, colors[player]);
    const botHTML = ctext(bot, colors[bot]);

    const netmsg = net < 0
    ? ["-", "#ff7161"]
    : ["+", "#61ff71"];

    const text = [
        `${playerHTML} vs ${botHTML}`,
        `The coin landed on ${win ? playerHTML : botHTML}`,

        `${ctext(`${netmsg[0]} ${format(net)}`, netmsg[1])}`,
    ].join("<br>");

    log.innerHTML += text + "<br><br><br>";

    log.scrollTop = log.scrollHeight;
}


// Update money counter
function updateMoney(amount) {
    money += amount || 0;

    const bet = document.getElementById("bet");
    bet.max = money;

    const counter = document.getElementById("money");
    counter.innerText = format(money);
}





// Working min max
const toNum = (num) => parseInt(num, 10);

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