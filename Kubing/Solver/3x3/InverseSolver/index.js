let step = "0";
let start;
let scrambles;
let solutions;
$(() => {
    drawScrambleNxN('#svgCube', 3, $("#inpScramble").val());
    solutions = [];
    adjustSize();
});

function solveCube(scr) {
    start = Date.now();
    scrambles = [scr, inverseAlg(scr)];
    solutions = [];
    
    for (let i = 0; i < scrambles.length; i++) {
        let s = scrambles[i];
        if (s.includes("(") || s.includes(")")) {
            scrambles[i] = removeRedundantMoves(toAlg(s));
        }
        if ((s.includes("[") || s.includes("]")) && (s.includes(":") || s.includes(","))) {
            scrambles[i] = removeRedundantMoves(commToAlg(s));
        }
    }

    $("#taScrambles").val(scrambles.join("\n"));
    $("#taSolutions").val("");

    $("#progressBar").css("display", "block");
    $("#btnSolve").attr("disabled", true);
    $("#taScrambles").attr("disabled", true);
    
    solve(scrambles[0], getSolution);
    solve(scrambles[1], getSolution, true);
}

function getSolution(solution, inverse) {
    if (solution[0] === 1) {
        let sol = removeRedundantMoves(cleanMoves(solution[1]));
        if (inverse) {
            solutions.push(inverseAlg(sol));
        }
        else {
            solutions.push(sol);
        }

        if (solutions.length === scrambles.length) {console.log(solutions);
            let bestSol = solutions[solutions.map(s => s.split(" ").length).indexOf(solutions.map(s => s.split(" ").length).sort()[0])];
            $("#btnSolve").attr("disabled", false);
            $("#btnScramble").attr("disabled", false);
            $("#inpScramble").attr("disabled", false);
            $("#inpEndState").attr("disabled", false);
            $("#solution").html("<h1><b>Solution:</b> " + bestSol + "</h1><h1><b>Moves:</b> " + sol.split(" ").length + "</h1><br>");
            $("#searchDepth").html("<h1>" + (Date.now() - start) + " ms</h1>");
            $("#solutionCube").html("<div style='width: 50%; height: 50%;'><cube-player scramble=\""+scrambles[0]+"\" solution=\""+bestSol+"\" time=\"\"></cube-player></div>");
            adjustSize();
        }
        /* else {
            // solve(scrambles[solutions.length], getSolution);
            solve(scrambles[1], getSolution, true);
        } */
    }
}

function toAlg(comm) {
    let leftBrackets = 0;
    let rightBrackets = 0;
    let commArr = [];

    comm = cleanMoves(comm.replaceAll("(", " ( ").replaceAll(")", " ) "));
    for (let c of comm.split(" ")) {
        if (c === "(") {
            commArr.push("b" + leftBrackets);
            leftBrackets++;
        }
        else if (c === ")") {
            commArr.push(c);
            rightBrackets++;
        }
        else if(c !== " ") {
            commArr.push(c);
        }
    }

    if (leftBrackets !== rightBrackets) {
        return "";
    }
    
    for (let i = leftBrackets - 1; i >= 0; i--) {
        let s = commArr.indexOf("b"+i);
        let e = commArr.indexOf(")");
        let c = commArr.slice(s + 1, e);
        let n = parseInt(commArr[e + 1]);
        commArr.splice(s, e + 2, translateComm(c, n));
    }
    
    return commArr.join(" ") || "";

    function translateComm(cm, n) {
        let str = "";
        for (let i = 0; i < n; i++) {
            str += cm.join(" ") + " ";
        }
        return str.trim();
    }
}

function commToAlg(comm) {
    let leftSqBrackets = 0;
    let rightSqBrackets = 0;
    let colons = 0;
    let commas = 0;
    let commArr = [];

    /* 
    [A, B] = A B A' B'
    [A: B] = A B A'
    */

    if (
        comm.split("").filter(c => c === "[").length !== (comm.split("").filter(c => c === ",").length + comm.split("").filter(c => c === ":").length)
    ) {
        comm = comm.replaceAll(":", ":[")+"]";
    }
    comm = cleanMoves(comm.replaceAll("[", " [ ").replaceAll("]", " ] ").replaceAll(",", " , ").replaceAll(":", " : "));
    for (let c of comm.split(" ")) {
        if (c === "[") {
            commArr.push("l" + leftSqBrackets);
            leftSqBrackets++;
        }
        else if (c === "]") {
            commArr.push(c);
            rightSqBrackets++;
        }
        else if (c === ":") {
            commArr.push(c);
            colons++;
        }
        else if (c === ",") {
            commArr.push(c);
            commas++;
        }
        else if (c !== " ") {
            commArr.push(c);
        }
    }
    
    if (leftSqBrackets !== rightSqBrackets || colons > leftSqBrackets || commas > leftSqBrackets) {
        return "";
    }

    let stack = [];
    for (let i = leftSqBrackets - 1; i >= 0; i--) {
        let s = commArr.indexOf("l"+i);
        let e = commArr.indexOf("]");
        let c = commArr.slice(s, e + 1);
        commArr.splice(s, c.length, "stack"+stack.length);
        stack.push(translateComm(c));
    }

    let newAlg = stack.pop() || "";
    while (newAlg.includes("stack")) {
        
        let nArr = newAlg.split(" ");
        for (let i = 0; i < nArr.length; i++) {
            if (nArr[i].includes("stack")) {
                nArr[i] = stack[parseInt(nArr[i].replace("stack", ""))];
            }
        }
        
        newAlg = nArr.join(" ");
    }
    
    return newAlg;

    function translateComm(cm) {
        if (cm.includes(",")) {
            let c1 = cm.slice(1, cm.indexOf(",")).join(" ");
            let c2 = cm.slice(cm.indexOf(",") + 1, -1).join(" ");
            return [c1, c2, inverseAlg(c1), inverseAlg(c2)].join(" ");
        }
        else if (cm.includes(":")) {
            let c1 = cm.slice(1, cm.indexOf(":")).join(" ");
            let c2 = cm.slice(cm.indexOf(":") + 1, -1).join(" ");
            return [c1, c2, inverseAlg(c1)].join(" ");
        }
    }
}

function calcProgress() {
    let progress = (100 * solutions.length / scrambles.length).toFixed(2);

    $("#innerBar").css("width", progress + "%");
    $("#progress").text(progress + "%");
}

function cleanMoves(moves) {
    moves = moves.trim();
    moves = moves.replaceAll(" ", ";");

    while (moves.includes(";;")) {
        moves = moves.replaceAll(";;", ";");
    }

    return moves.replaceAll(";", " ");
}

function solve(scramble, callback, inverse = false, endState = "wwwwwwwwwooooooooogggggggggrrrrrrrrrbbbbbbbbbyyyyyyyyy") {
    let worker = new Worker("./worker.js");
    worker.postMessage([scramble, endState]);
    worker.onmessage = e => {
        callback(e.data, inverse);
    }
}

function adjustSize() {
    $("#inpScramble, #inpEndState").css("font-size", "3vh");
    $("button").css("font-size", "3vh");
}