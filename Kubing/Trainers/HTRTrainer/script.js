$(() => {
    nextScramble();
    keyActions();
});

function nextScramble() {
    let r = Math.floor(Math.random() * 5);
    let scr = getSubsetScramble(["U2", "D2", "R2", "L2", "F2", "B2"], 15 + r);
    let optimal = "?"; // Implement later
    $("#scramble").text(scr + " (Optimal: " + optimal + ")");
}

function keyActions() {
    $("html").on('keydown', function (e) {
        if (e.altKey && e.keyCode === 39) {
            nextScramble();
        }
    });
}