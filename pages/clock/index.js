const colors = ["#ff8787", "#ffb17a", "#fffb7a", "#91ff95", "#91edff", "#91a3ff", "#b691ff", "#ff91f4", "#ff91b0"];

async function init() {

    await initNavbar();


    // Set a random background color
    const color = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = color;




    // Markers
    const mcanvas = document.getElementById("markers");
    const mctx = mcanvas.getContext("2d");
    const radius = mcanvas.width / 2;

    mctx.translate(radius, radius);
    mctx.lineCap = "round";
    mctx.strokeStyle = "#22212e";

    for (let i = 1; i <= 60; i++) {
        mctx.beginPath();
        ang = i * Math.PI / 30;
        mctx.rotate(ang);

        const styles = [
            { i: 15, width: 8, length: 30, color: "#22212e" },
            { i: 5, width: 4, length: 20, color: "#22212e" },
            { i: 1, width: 1, length: 2, color: "#22212e" },
        ];

        const style = styles.find((obj) => Number.isInteger(i / obj.i));
        mctx.strokeStyle = style.color;
        mctx.lineWidth = style.width;
        length = style.length;

        mctx.moveTo(0, -radius*0.9);
        mctx.lineTo(0, -radius*0.9 + length);
        mctx.stroke();
        mctx.rotate(-ang);
    }


    // Hands
    const hcanvas = document.getElementById("hands");
    const hctx = hcanvas.getContext("2d");

    hctx.lineCap = "round";
    hctx.translate(radius, radius);


    const hands = [
        {
            sec: 1, pos: 60, width: 2, length: 240, color: "#ff0000",
        },
        {
            sec: 60, pos: 60, width: 5, length: 200, color: "#00ff00",
        },
        {
            sec: 3600, pos: 12, width: 8, length: 150, color: "#0000ff",
        },
    ];

    setTime(hcanvas, hctx, hands, radius);
    setInterval(setTime, 1000, hcanvas, hctx, hands, radius);
}

function setTime(canvas, ctx, hands, radius) {
    const now = new Date();

    ctx.translate(-radius, -radius);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(radius, radius);


    hands.forEach((hand, i) => {

        const seconds = now.getSeconds();
        const minutes = now.getMinutes() * 60 + seconds;
        const hours = now.getHours() * 3600 + minutes;

        const time = [
            seconds,
            minutes,
            hours > 216000 ? hours - 216000 : hours,
        ][i];

        const ang = time * Math.PI / (hand.pos * hand.sec) * 2;

        ctx.beginPath();
        ctx.strokeStyle = hand.color;
        ctx.lineWidth = hand.width;

        ctx.rotate(ang);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -hand.length);
        ctx.stroke();
        ctx.rotate(-ang);
    });

    ctx.beginPath();
    ctx.fillStyle = "#454152";
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
}