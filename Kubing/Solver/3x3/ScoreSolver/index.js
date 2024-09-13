let step = "0";
$(() => {
    drawScrambleNxN('#svgCube', 3, $("#inpScramble").val());

    adjustSize();
});

class Score {
    constructor(score, moves) {
        this.score = score;
        this.moves = moves;
    }
}

function solveEO(scr) {
    let w = new Worker("worker.js");
    w.postMessage([scr, "EO"]);
    w.onmessage = e => {
        // step = e.data[1];
        console.log(e.data[0])
        solveCube([scr, e.data[0]].join(" ").trim());
    }
}

function solveCube(scr) {
    let movesAll = ["U", "U'", "U2", "D", "D'", "D2", "R", "R'", "R2", "L", "L'", "L2", "F", "F'", "F2", "B", "B'", "B2"];
    let movesDR = ["F2", "B2", "U", "U'", "U2", "D", "D'", "D2", "R", "R'", "R2", "L", "L'", "L2"];
    let movesHTR = ["R2", "L2", "F2", "B2", "U", "U'", "U2", "D", "D'", "D2"];
    let movesFinal = ["U2", "D2", "R2", "L2", "F2", "B2"];

    let start = Date.now();
    $("#solution").html("");
    $("#searchDepth").html("");
    let svgNumber = 0;
    
    if (isValidScramble(scr)) {
        $("#inpScramble").prop('disabled', true);
        $("#btnSolve").prop('disabled', true);
        $("#btnScramble").prop('disabled', true);

        let bestSol = "";
        let bestScore = -1;
        let score = 0;
        let iterations = 0;

        solveloop : while (score > bestScore || iterations < 3) {
            console.log("Score:", getScore([scr, bestSol].join(" ").trim()));
            // Check score to update moves and depth
            getScore([scr, bestSol].join(" ").trim());
            let moves = step === "HTR" ? movesFinal.slice() : step === "DR" ? movesHTR.slice() : step === "EO" ? movesDR.slice() : movesAll.slice();
            let depth = (step === "HTR" ? 6 : step === "DR" ? 5 : /* step === "EO" ? 4 : */ 2) + iterations;
            console.log("Step:", step);
            console.log("Depth:", depth);
            if (score > bestScore) {
                bestScore = score;
            }
            let scoreSolutions = [];
            scoreSolutions.push(new Score(getScore(scr), ""));
            let arr = movesAll.slice();
            for (let i = 0; i < depth; i++) {
                if (i === 0) {
                    for (let m of arr) {
                        scoreSolutions.push(new Score(getScore([scr, bestSol, m].join(" ").trim()), m));
                    }
                }
                else {
                    let tArr = arr.slice();
                    for (let m1 of arr) {
                        let prevMove = m1.split(" ")[m1.split(" ").length - 1][0];
                        for (let m2 of moves.filter(m => {return m[0] !== prevMove})) {
                            tArr.push([m1, m2].join(" "));
                            scoreSolutions.push(new Score(getScore([scr, bestSol, m1, m2].join(" ").trim()), [m1, m2].join(" ")));
                        }
                    }
                    arr = tArr.slice();
                }
            }
            let best = scoreSolutions.sort((a, b) => b.score - a.score)[0];
            let sol = best.moves;
            score = best.score;
            if (score > bestScore) {
                bestSol = [bestSol, sol].join(" ").trim();
                iterations = 0;
                if (score === Infinity) {
                    break solveloop;
                }
            }
            else {
                iterations++;
            }
        }

        let solLength = bestSol === "" ? 0 : bestSol.trim().split(" ").length;
        
        $("#solution").html("<h1><b>Solution:</b> " + bestSol + "</h1><h1><b>Moves:</b> " + solLength + "</h1><br>"+
        "<svg class='svgStep' id='svg_sol'></svg>");
        drawScrambleNxN("#svg_sol", 3, [scr, bestSol].join(" "));
        $("#svg_sol").height(3 * $("#svgCube").width() / 4);

        $("#searchDepth").html("<h1>" + (Date.now() - start) + " ms</h1>");
        
        $("#inpScramble").prop('disabled', false);
        $("#btnSolve").prop('disabled', false);
        $("#btnScramble").prop('disabled', false);
    }
}

function getScore(scr) {
    let score = 0;
    let state = getNumberState(3, scr);
    let uFace = state.substring(0, 9);
    let lFace = state.substring(9, 18);
    let fFace = state.substring(18, 27);
    let rFace = state.substring(27, 36);
    let bFace = state.substring(36, 45);
    let dFace = state.substring(45, 54);

    let cU = uFace[4];
    let cL = lFace[4];
    let cF = fFace[4];
    let cR = rFace[4];
    let cB = bFace[4];
    let cD = dFace[4];

    let faces = [uFace, lFace, fFace, rFace, bFace, dFace];

    const multiSame = 5;
    const multiOpp = 3;
    
    if (uFace.split("").filter(t => t === cU).length === 9 &&
        lFace.split("").filter(t => t === cL).length === 9 &&
        fFace.split("").filter(t => t === cF).length === 9 &&
        rFace.split("").filter(t => t === cR).length === 9 &&
        bFace.split("").filter(t => t === cB).length === 9 &&
        dFace.split("").filter(t => t === cD).length === 9
    ) {
        score = Infinity;
    }
    else {
        step = "0";
        if (isHTR(scr)) {
            score += 500;
            step = "HTR";
        }
        else if (isDR(scr)) {
            score += 200;
            step = "DR";
        }
        else {
            if (isEO(scr)) {
                score += 100;
                step = "EO";
            }
            if (isEO(scr + " y")) {
                score += 100;
                step = "EO";
            }
            if (isEO(scr + " x")) {
                score += 100;
                step = "EO";
            }
        }

        for (let f of faces) {
            if (f[0] === f[4] && (f[1] === f[0] || f[3] === f[0])) {
                score += 10;
            }
            if (f[2] === f[4] && (f[1] === f[2] || f[5] === f[2])) {
                score += 10;
            }
            if (f[6] === f[4] && (f[3] === f[6] || f[7] === f[6])) {
                score += 10;
            }
            if (f[8] === f[4] && (f[7] === f[8] || f[5] === f[8])) {
                score += 10;
            }

            let oc = getOppColor(f[4]);
            if (f[0] === oc && (f[1] === f[0] || f[3] === f[0])) {
                score += 10;
            }
            if (f[2] === oc && (f[1] === f[2] || f[5] === f[2])) {
                score += 10;
            }
            if (f[6] === oc && (f[3] === f[6] || f[7] === f[6])) {
                score += 10;
            }
            if (f[8] === oc && (f[7] === f[8] || f[5] === f[8])) {
                score += 10;
            }
        }

        score += uFace.split("").filter(t => t === "1").length * multiSame;
        score += uFace.split("").filter(t => t === "2").length * multiOpp;

        score += lFace.split("").filter(t => t === "6").length * multiSame;
        score += lFace.split("").filter(t => t === "5").length * multiOpp;

        score += fFace.split("").filter(t => t === "3").length * multiSame;
        score += fFace.split("").filter(t => t === "4").length * multiOpp;

        score += rFace.split("").filter(t => t === "5").length * multiSame;
        score += rFace.split("").filter(t => t === "6").length * multiOpp;

        score += bFace.split("").filter(t => t === "4").length * multiSame;
        score += bFace.split("").filter(t => t === "3").length * multiOpp;

        score += dFace.split("").filter(t => t === "2").length * multiSame;
        score += dFace.split("").filter(t => t === "1").length * multiOpp;
    }

    return score;
}

function getOppColor(c) {
    switch (c) {
        case "1":
            return "2";
        case "2":
            return "1";
        case "3":
            return "4";
        case "4":
            return "3";
        case "5":
            return "6";
        case "6":
            return "5";
    }
}

function isEO(scr) {
    let cubeState = getNumberState(3, scr).split("");
    
    let cU = cubeState[4];
    let cL = cubeState[13];
    let cF = cubeState[22];
    let cR = cubeState[31];
    let cB = cubeState[40];
    let cD = cubeState[49];
    
    let ub = cubeState[1];
    let bu = cubeState[37];
    let ur = cubeState[5];
    let ru = cubeState[28];
    let uf = cubeState[7];
    let fu = cubeState[19];
    let ul = cubeState[3];
    let lu = cubeState[10];
    let df = cubeState[46];
    let fd = cubeState[25];
    let dr = cubeState[50];
    let rd = cubeState[34];
    let db = cubeState[52];
    let bd = cubeState[43];
    let dl = cubeState[48];
    let ld = cubeState[16];
    let fl = cubeState[21];
    let lf = cubeState[14];
    let fr = cubeState[23];
    let rf = cubeState[30];
    let bl = cubeState[41];
    let lb = cubeState[12];
    let br = cubeState[39];
    let rb = cubeState[32];
    
    return (
        ub !== cR && ub !== cL && ul !== cR && ul !== cL && ur !== cR && ur !== cL && uf !== cR && uf !== cL &&
        db !== cR && db !== cL && dl !== cR && dl !== cL && dr !== cR && dr !== cL && df !== cR && df !== cL &&
        fu !== cU && fu !== cD && ru !== cU && ru !== cD && lu !== cU && lu !== cD && bu !== cU && bu !== cD &&
        fd !== cU && fd !== cD && rd !== cU && rd !== cD && ld !== cU && ld !== cD && bd !== cU && bd !== cD &&

        fl !== cR && fl !== cL && fr !== cR && fr !== cL && bl !== cR && bl !== cL && br !== cR && br !== cL &&

        !(fl === cF && lf === cU) && !(fl === cF && lf === cD) && !(fl === cB && lf === cU) && !(fl === cB && lf === cD) &&
        !(fr === cF && rf === cU) && !(fr === cF && rf === cD) && !(fr === cB && rf === cU) && !(fr === cB && rf === cD) &&
        !(bl === cF && lb === cU) && !(bl === cF && lb === cD) && !(bl === cB && lb === cU) && !(bl === cB && lb === cD) &&
        !(br === cF && rb === cU) && !(br === cF && rb === cD) && !(br === cB && rb === cU) && !(br === cB && rb === cD)
    );
}

function isDR(scr) {
    let cubeState = getNumberState(3, scr).split("");
    
    let cU = cubeState[4];
    let cL = cubeState[13];
    let cF = cubeState[22];
    let cR = cubeState[31];
    let cB = cubeState[40];
    let cD = cubeState[49];
    
    let ub = cubeState[1];
    let bu = cubeState[37];
    let ur = cubeState[5];
    let ru = cubeState[28];
    let uf = cubeState[7];
    let fu = cubeState[19];
    let ul = cubeState[3];
    let lu = cubeState[10];
    let df = cubeState[46];
    let fd = cubeState[25];
    let dr = cubeState[50];
    let rd = cubeState[34];
    let db = cubeState[52];
    let bd = cubeState[43];
    let dl = cubeState[48];
    let ld = cubeState[16];
    let fl = cubeState[21];
    let lf = cubeState[14];
    let fr = cubeState[23];
    let rf = cubeState[30];
    let bl = cubeState[41];
    let lb = cubeState[12];
    let br = cubeState[39];
    let rb = cubeState[32];

    let ubl = cubeState[0];
    let ubr = cubeState[2];
    let ufr = cubeState[8];
    let ufl = cubeState[6];
    let dfl = cubeState[45];
    let dfr = cubeState[47];
    let dbr = cubeState[53];
    let dbl = cubeState[51];
    
    return (
       isEO(scr) &&
       (ubl === cU || ubl === cD) && (ubr === cU || ubr === cD) && (ufr === cU || ufr === cD) && (ufl === cU || ufl === cD) &&
       (dfl === cU || dfl === cD) && (dfr === cU || dfr === cD) && (dbr === cU || dbr === cD) && (dbl === cU || dbl === cD) &&
       (ub === cU || ub === cD) && (ur === cU || ur === cD) && (uf === cU || uf === cD) && (ul === cU || ul === cD) &&
       (db === cU || db === cD) && (dr === cU || dr === cD) && (df === cU || df === cD) && (dl === cU || dl === cD)
    );
}

function isHTR(scr) {
    let cubeState = getNumberState(3, scr).split("");
    
    let cU = cubeState[4];
    let cL = cubeState[13];
    let cF = cubeState[22];
    let cR = cubeState[31];
    let cB = cubeState[40];
    let cD = cubeState[49];

    let u = cubeState.slice(0, 9);
    let l = cubeState.slice(9, 18);
    let f = cubeState.slice(18, 27);
    let r = cubeState.slice(27, 36);
    let b = cubeState.slice(36, 45);
    let d = cubeState.slice(45, 54);

    let coU = [u[0], u[2], u[6], u[8]];
    let coL = [l[0], l[2], l[6], l[8]];
    let coF = [f[0], f[2], f[6], f[8]];
    let coR = [r[0], r[2], r[6], r[8]];
    let coB = [b[0], b[2], b[6], b[8]];
    let coD = [d[0], d[2], d[6], d[8]];
    
    return (
        u.filter(c => {return c === cU ||  c === cD}).length === 9 &&
        l.filter(c => {return c === cL ||  c === cR}).length === 9 &&
        f.filter(c => {return c === cF ||  c === cB}).length === 9 &&
        r.filter(c => {return c === cR ||  c === cL}).length === 9 &&
        b.filter(c => {return c === cB ||  c === cF}).length === 9 &&
        d.filter(c => {return c === cD ||  c === cU}).length === 9 &&

        coU.filter(c => {return c === cU}).length % 2 === 0 &&
        coL.filter(c => {return c === cL}).length % 2 === 0 &&
        coF.filter(c => {return c === cF}).length % 2 === 0 &&
        coD.filter(c => {return c === cD}).length % 2 === 0 &&
        coR.filter(c => {return c === cR}).length % 2 === 0 &&
        coB.filter(c => {return c === cB}).length % 2 === 0 &&

        ((coU[0] === cU && coU[1] === cU && coU[2] === cU && coU[3] === cU) ||
        (coD[0] === cU && coD[1] === cU && coD[2] === cU && coD[3] === cU) ||
        
        (coU[0] === cU && coU[1] === cU && coD[0] === cU && coD[1] === cU) ||
        (coU[0] === cU && coU[1] === cU && coD[2] === cU && coD[3] === cU) ||

        (coU[2] === cU && coU[3] === cU && coD[0] === cU && coD[1] === cU) ||
        (coU[2] === cU && coU[3] === cU && coD[2] === cU && coD[3] === cU) ||

        (coU[0] === cU && coU[2] === cU && coD[0] === cU && coD[2] === cU) ||
        (coU[0] === cU && coU[2] === cU && coD[1] === cU && coD[3] === cU) ||

        (coU[1].split("")[1] === cU && coU[2] === cU && coD[0] === cU && coD[3] === cU) ||
        (coU[1].split("")[1] === cU && coU[2] === cU && coD[1] === cU && coD[2] === cU))
    );
}

function isValidScramble(scr) {
    return scr.trim() !== "";
}

function scrollDown() {
    const element = document.getElementsByTagName("body")[0].parentElement;
    element.scrollTop = element.scrollHeight;
}

function adjustSize() {
    $("svg").height(3 * $("#svgCube").width() / 4);
    $("#inpScramble").css("font-size", "3vh");
    $("button").css("font-size", "3vh");
}