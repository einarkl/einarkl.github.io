let step = "0";
let start;
$(() => {
    drawScrambleNxN('#svgCube', 3, $("#inpScramble").val());

    adjustSize();
});

function solveCube(scramble) {
    $("#btnSolve").attr("disabled", true);
    $("#btnScramble").attr("disabled", true);
    $("#inpScramble").attr("disabled", true);
    $("#inpEndState").attr("disabled", true);
    start = Date.now();
    solve(scramble, getSolution, $("#inpEndState").val());
}

function getSolution(solution) {
    if (solution[0] === 1) {
        $("#btnSolve").attr("disabled", false);
        $("#btnScramble").attr("disabled", false);
        $("#inpScramble").attr("disabled", false);
        $("#inpEndState").attr("disabled", false);
        let sol = removeRedundantMoves(cleanMoves(solution[1]));
        $("#solution").html("<h1><b>Solution:</b> " + sol + "</h1><h1><b>Moves:</b> " + sol.split(" ").length + "</h1><br>");
        $("#searchDepth").html("<h1>" + (Date.now() - start) + " ms</h1>");
        ///////////////////////////////////////////////////////////////////
        drawScrambleNxN("#svgCube", 3, $("#inpScramble").val() + " " + sol);
    }
    else if (solution[0] === 0) {
        $("#solution").html("<h1>" + solution[1] + "</h1>");
        $("#searchDepth").html("");
    }
    else if (solution[0] === -1) {
        $("#solution").html("<h1>" + solution[1] + "</h1>");
        $("#btnSolve").attr("disabled", false);
        $("#btnScramble").attr("disabled", false);
        $("#inpScramble").attr("disabled", false);
        $("#inpEndState").attr("disabled", false);
    }
    else if (solution[0] === 2) {
        $("#solution").html("<h1>" + solution[1] + "</h1>");
        $("#btnSolve").attr("disabled", false);
        $("#btnScramble").attr("disabled", false);
        $("#inpScramble").attr("disabled", false);
        $("#inpEndState").attr("disabled", false);
    }
}

function cleanMoves(moves) {
    moves = moves.trim();
    moves = moves.replaceAll(" ", ";");

    while (moves.includes(";;")) {
        moves = moves.replaceAll(";;", ";");
    }

    return moves.replaceAll(";", " ");
}

function solve(scramble, callback, endState = "wwwwwwwwwooooooooogggggggggrrrrrrrrrbbbbbbbbbyyyyyyyyy") {
    let worker = new Worker("./worker.js");
    worker.postMessage([scramble, endState]);
    worker.onmessage = e => {
        callback(e.data);
    }
}

function logSolution(solution) {
    console.log(solution);
}

function adjustSize() {
    $("#inpScramble, #inpEndState").css("font-size", "3vh");
    $("button").css("font-size", "3vh");
}