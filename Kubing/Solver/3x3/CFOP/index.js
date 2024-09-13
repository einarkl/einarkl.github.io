$(() => {
    draw333Svg('#svgCube', $("#inpScramble").val());

    adjustSize();
});

function solveCube(scr) {
    let w = new Worker("worker.js");
    $("#solution").html("");
    $("#searchDepth").html("");
    
    if (isValidScramble(scr)) {
        $("#inpScramble").prop('disabled', true);
        $("#btnSolve").prop('disabled', true);
        w.postMessage(scr);
        w.onmessage = e => {
            if (e.data.length === 3) {
                $("#solution").html("<h1>" + e.data[0] + "</h1>");
                draw333Svg('#svgCube', e.data[2]);
            }
            else if (e.data[0] === 0) {
                $("#searchDepth").html("<h1><b>Time interuption</b></h1>");
                $("#inpScramble").prop('disabled', false);
                $("#btnSolve").prop('disabled', false);
            }
            else if (e.data[0] !== "Solved") {
                $("#searchDepth").html("<h1>Searching at depth " + e.data[0] + "</h1>");
            }
            else {
                $("#searchDepth").html("");
                $("#inpScramble").prop('disabled', false);
                $("#btnSolve").prop('disabled', false);
            }
        }
    }
}

function isValidScramble(scr) {
    return scr.trim() !== "";
}

function adjustSize() {
    $("#svgCube").height(3 * $("#svgCube").width() / 4);
    $("#inpScramble").css("font-size", "3vh");
    $("#btnSolve").css("font-size", "3vh");
}