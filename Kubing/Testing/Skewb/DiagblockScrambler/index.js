const solvedStateNumbers = "164145153136263235254246163542";
let moves = ["U", "U'", "R", "R'", "L", "L'", "B", "B'"];
let movesA = ["F", "F'", "R", "R'", "L", "L'", "B", "B'", "f", "f'", "r", "r'", "l", "l'", "b", "b'"];
let movesAC = ["z y' R y z'", "z y' R' y z'", "z R z'", "z R' z'", "z' L z", "z' L' z", "x B x'", "x B' x'", "y' R y", "y' R' y", "R", "R'", "L", "L'", "B", "B'"];

let cW = "1";
let cY = "2";
let cG = "3";
let cB = "4";
let cR = "5";
let cO = "6";

class Corner {
    constructor(c1, c2, c3) {
        this.c1 = c1;
        this.c2 = c2;
        this.c3 = c3;
    }
}

class Center {
    constructor(c) {
        this.c = c;
    }
}

let ce1 = new Center(cW);
let ce2 = new Center(cO);
let ce3 = new Center(cG);
let ce4 = new Center(cR);
let ce5 = new Center(cB);
let ce6 = new Center(cY);

let co1 = new Corner(cW, cO, cB);
let co2 = new Corner(cW, cB, cR);
let co3 = new Corner(cW, cR, cG);
let co4 = new Corner(cW, cG, cO);
let co5 = new Corner(cY, cO, cG);
let co6 = new Corner(cY, cG, cR);
let co7 = new Corner(cY, cR, cB);
let co8 = new Corner(cY, cB, cO);

let cleanSkewbCo = [co1, co2, co3, co4, co5, co6, co7, co8];
let skewbCo = [co1, co2, co3, co4, co5, co6, co7, co8];
let cleanSkewbCe = [ce1, ce2, ce3, ce4, ce5, ce6];
let skewbCe = [ce1, ce2, ce3, ce4, ce5, ce6];

$(() => {
    drawScrambleSkewb('#svgSkewb', $("#inpScramble").val());

    adjustSize();
});

function isValidScramble(scr) {
    return scr.trim() !== "";
}

function scrambleMiniblock() {
    $("#btnScramble").attr("disabled", true);
    $("#inpScramble").attr("disabled", true);
    $("#selN").attr("disabled", true);

    $("#miniblockSetup").text("Setup to miniblock: ");
    let n = parseInt($("#selN").find(":selected").val());
    let scramble = "";
    let setup = "";
    
    let worker = new Worker("./worker.js");
    worker.postMessage([n]);
    worker.onmessage = e => {
        scramble = e.data[0];
        setup = e.data[1];

        $("#inpScramble").val(scramble);
        $("#miniblockSetup").text($("#miniblockSetup").text() + setup);

        drawScrambleSkewb('#svgSkewb', $('#inpScramble').val());

        $("#btnScramble").attr("disabled", false);
        $("#inpScramble").attr("disabled", false);
        $("#selN").attr("disabled", false);

        return scramble;
    }
}

function adjustSize() {
    $("svg").height(3 * $("#svgSkewb").width() / 4);
    $("#inpScramble").css("font-size", "3vh");
    $("#selN").css("font-size", "3vh");
    $("label").css("font-size", "3vh");
    $("button").css("font-size", "3vh");
}