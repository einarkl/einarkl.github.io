$(() => {
    nextScramble();
    keyActions();
});

let next = true;

function nextScramble() {
    let r = Math.floor(Math.random() * 5);
    let scr = getSubsetScramble(["U2", "D2", "R2", "L2", "F2", "B2"], 15 + r);
    $("#scramble").text(scr);
    $("#optimal").text("(Optimal: ?)");
    $("#drwscr").attr("scramble", scr);
    getOptimal(scr);
}

function keyActions() {
    $("html").on('keydown', function (e) {
        if (next && e.altKey && e.keyCode === 39) {
            nextScramble();
        }
    });
}

function toggleNext() {
    next = !next;
    $("#btnNext").prop("disabled", next ? "" : "disabled");
}

function getOptimal(scramble) {
    toggleNext();
    let w = new Worker("worker.js");
    w.postMessage([scramble]);
    w.onmessage = e => {
        toggleNext();
        optimal = e.data[0];
        let optlen = optimal === "?" ? "> 10" : optimal.split(" ").length;
        $("#optimal").text("(Optimal: " + optlen + ")");
        $("#optimalSol").text(optimal);
    }
}