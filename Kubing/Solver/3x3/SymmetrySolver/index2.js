let scramble;
let endState;
let solvedCubeState = "wwwwwwwwwooooooooogggggggggrrrrrrrrrbbbbbbbbbyyyyyyyyy";

let centers = [1, 2, 3, 4, 5, 6];
let corners = [1, 2, 3, 4, 5, 6, 7, 8];
let edges = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

let cornersO = [0, 0, 0, 0, 0, 0, 0, 0];
let edgesO = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

let convertedCenters = [1, 2, 3, 4, 5, 6];
let convertedCorners = [1, 2, 3, 4, 5, 6, 7, 8];
let convertedEdges = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

let convertedCornersO = [0, 0, 0, 0, 0, 0, 0, 0];
let convertedEdgesO = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

let centerSolution = "";
// ubl ubr ufl ufr dfl dfr dbl dbr
// ub ul ur uf df dl dr db fl fr br bl

$(() => {
    let scr1 = "U' B F' D2 R2 U D' R2 U' R' L' F' D L U2 D F B' D' R'";
    let scr2 = "R' D U' L2 F2 R L' F2 R' F' B' U' L B R2 L U D' L' F'";
    let stt2 = getStepState(scr2);
    console.log(getScrSymmetry(scr1, scr2));
    console.log(stt2);
    console.log(getScrStateSymmetry(scr1, stt2));
});

function getScrSymmetry(scr1, scr2) {
    let symmetries = [];
    let state1, state2;
    
    for (let ori of solutionsCenter.map(ce => ce.solution)) {
        [state1, state2] = [getStepState(getMovesWithoutRotations([ori, scr1].join(" "))), getStepState(scr2)];

        if (isEqual(state1, state2)) {
            symmetries.push(ori);
        }
    }

    return symmetries;
}

function getScrStateSymmetry(scr1, stt2) {
    let symmetries = [];
    
    let state1, state2;
    
    for (let ori of solutionsCenter.map(ce => ce.solution)) {
        [state1, state2] = [getStepState(getMovesWithoutRotations([ori, scr1].join(" "))), stt2];

        if (isEqual(state1, state2)) {
            symmetries.push(ori);
        }
    }

    return symmetries;
}

function isEqual(obj1, obj2) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
    }

    for (let i = 0; i < Object.keys(obj1).length; i++) {
        if (Object.keys(obj1)[i] !== Object.keys(obj2)[i]) {
            return false;
        }
    }

    for (let i = 0; i < Object.values(obj1).length; i++) {
        if (Object.values(obj1)[i].length !== Object.values(obj2)[i].length) {
            return false;
        }

        for (let j = 0; j < Object.values(obj1)[i].length; j++) {
            if (Object.values(obj1)[i][j] !== Object.values(obj2)[i][j]) {
                return false;
            }
        }
    }

    return true;
}

function solve(scramble, endState) {
    let movesEO = ["U", "U'", "U2", "D", "D'", "D2", "R", "R'", "R2", "L", "L'", "L2", "F", "F'", "F2", "B", "B'", "B2"];
    let movesDR = ["F2", "B2", "U", "U'", "U2", "D", "D'", "D2", "R", "R'", "R2", "L", "L'", "L2"];
    let movesHTR = ["R2", "L2", "F2", "B2", "U", "U'", "U2", "D", "D'", "D2"];
    let movesFinal = ["U2", "D2", "R2", "L2", "F2", "B2"];

    if (validateState(endState)) {
        if (endState !== solvedCubeState) {
            convertState();
        }

        let solution = "";
        let steps = ["Center", "EO", "DR", "HTR", "Final"];
        let stepMoves = [[], movesEO, movesDR, movesHTR, movesFinal];
        let stepTables = [solutionsCenter, solutionsEO, solutionsDR, solutionsHTR, solutionsFinal];

        for (let i = 0; i < steps.length; i++) {
            let changed = false;
            let step = steps[i];
            let stepSolutions = stepTables[i];
            let moves = stepMoves[i].slice();
            
            postMessage([0, "Solving " + step]);

            let solLength = 1;
        
            let state = getStepState(scramble + " " + solution, step);
            let ind = stepSolutions.findIndex(s => s.state === state);
            if (ind !== -1 && (step !== "HTR" || isHTR(scramble + " " + solution + " " + stepSolutions[ind].solution))) {
                solution += stepSolutions[ind].solution + " ";
            }
            else {
                let arr = moves.slice();
                outerloop : while (!changed) {
                    if (solLength === 1) {
                        for (let m of arr) {
                            state = getStepState(scramble + " " + solution + " " + m, step);
                            ind = stepSolutions.findIndex(s => s.state === state);
                            if (ind !== -1 && (step !== "HTR" || isHTR(scramble + " " + solution + " " + m + " " + stepSolutions[ind].solution))) {
                                solution += m + " " + stepSolutions[ind].solution + " ";
                                changed = true;
                                break outerloop;
                            }
                        }
                    }
                    else {
                        let tArr = arr.slice();
                        for (let m1 of arr) {
                            let prevMove = m1.split(" ")[m1.split(" ").length - 1][0];
                            for (let m2 of moves.filter(m => {return m[0] !== prevMove})) {
                                tArr.push(m1 + " " + m2);
                                state = getStepState(scramble + " " + solution + " " + m1 + " " + m2, step);
                                ind = stepSolutions.findIndex(s => s.state === state);
                                if (ind !== -1 && (step !== "HTR" || isHTR(scramble + " " + solution + " " + m1 + " " + m2 + " " + stepSolutions[ind].solution))) {
                                    solution += m1 + " " + m2 + " " + stepSolutions[ind].solution + " ";
                                    changed = true;
                                    break outerloop;
                                }
                            }
                        }
                        arr = tArr.slice();
                    }
                    solLength++;
                }
            }
            getStepState(scramble + " " + solution);
        }
        if (solution.trim() === "") {
            postMessage([2, "Solved"]);
        }
        else {
            postMessage([1, solution]);
        }
    }
    else {
        postMessage([-1, "Illegal end state"]);
    }
}

function cleanMoves(m) {
    m = m.replaceAll(" ", ";");
     while (m.includes(";")) {
         m = m.replaceAll(";;", ";");
     }
 
     m = m.replaceAll(";", " ");
     return m.trim();
 }

function validateState(state) {
    let allPiecesCe = getPieces().ce;
    let allPiecesC = getPieces().c;
    let allPiecesE = getPieces().e;

    let piecesCe = getPieces(state).ce;
    let piecesC = getPieces(state).c;
    let piecesE = getPieces(state).e;

    return (
        state.split("").length === 54 &&
        comparePieceArrays(allPiecesCe, piecesCe) &&
        comparePieceArrays(allPiecesC, piecesC) &&
        comparePieceArrays(allPiecesE, piecesE)
    );
}

function comparePieceArrays(a, b) {
    a = a.map(p => p % 100).sort();
    b = b.map(p => p % 100).sort();
    return (
        a.length === b.length &&
        a.every((val, i) => val === b[i])
    );
}

function getPieces(state = solvedCubeState) {
    let uFace = state.substring(0, 9);
    let lFace = state.substring(9, 18);
    let fFace = state.substring(18, 27);
    let rFace = state.substring(27, 36);
    let bFace = state.substring(36, 45);
    let dFace = state.substring(45, 54);

    let piecesCe = [identifyCenter(uFace[4]), identifyCenter(lFace[4]), identifyCenter(fFace[4]), identifyCenter(rFace[4]), identifyCenter(bFace[4]), identifyCenter(dFace[4])];
    let piecesC = [
        identifyCorner([uFace[0], lFace[0], bFace[2]]), identifyCorner([uFace[2], bFace[0], rFace[2]]), identifyCorner([uFace[6], fFace[0], lFace[2]]), identifyCorner([uFace[8], rFace[0], fFace[2]]),
        identifyCorner([dFace[0], lFace[8], fFace[6]]), identifyCorner([dFace[2], fFace[8], rFace[6]]), identifyCorner([dFace[6], bFace[8], lFace[6]]), identifyCorner([dFace[8], rFace[8], bFace[6]])
    ];
    let piecesE = [
        identifyEdge([uFace[1], bFace[1]]), identifyEdge([uFace[3], lFace[1]]), identifyEdge([uFace[5], rFace[1]]), identifyEdge([uFace[7], fFace[1]]),
        identifyEdge([dFace[1], fFace[7]]), identifyEdge([dFace[3], lFace[7]]), identifyEdge([dFace[5], rFace[7]]), identifyEdge([dFace[7], bFace[7]]),
        identifyEdge([fFace[3], lFace[5]]), identifyEdge([fFace[5], rFace[3]]), identifyEdge([bFace[3], rFace[5]]), identifyEdge([bFace[5], lFace[3]])
    ];

    return {
        ce: piecesCe,
        c: piecesC,
        e: piecesE
    };
}

function resetState() {
    centers = convertedCenters.slice();
    corners = convertedCorners.slice();
    edges = convertedEdges.slice();
    cornersO = convertedCornersO.slice();
    edgesO = convertedEdgesO.slice();
}

/* 
Center  123456
EO      111111111111
DR      100100100100100100100100111111110000
HTR     132123123132132123123132121313121213131223232323
Final   125154132143623634652645151214136362646532345452
*/

function getStepState(moves, step = null) {
    if (step !== "convert") {
        resetState();
    }
    
    for (let m of moves.split(" ")) {
        if (m !== "") {
            move(m);
        }
    }
    
    if (step !== null) {
        let state = "";
        if (step === "Center") {
            state = centers.join("");
        }
        else if (step === "EO") {
            state = edgesO.join("");
        }
        else if (step === "DR") {
            state = cornersO.map(co => co + "").join("");
            let i = 0;
            for (let e of edges) {
                let e1 = getEdgeColors(e)[0];
                if (e1 !== "w" && e1 !== "y") {
                    state += ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"][i];
                }
                i++;
            }
        }
        else if (step === "HTR") {
            // state = corners.join("");
            // for (let e of edges) {
            //     state += getEdgeColors(e).map(e1 => e1.replaceAll("w", "1").replaceAll("o", "3").replaceAll("g", "2").replaceAll("r", "3").replaceAll("b", "2").replaceAll("y", "1"))[1];
            // }
            for (let c of corners) {
                // state += getCornerColors(c).map(c1 => (c1 === "g" || c1 === "b") ? "2" : (c1 === "r" || c1 === "o") ? "3" : "").join("");
                state += getCornerColors(c).join("").replaceAll("w", "").replaceAll("y", "").replaceAll("g", "2").replaceAll("b", "2").replaceAll("r", "3").replaceAll("o", "3");;
            }
            for (let e of edges.slice(0, 8)) {
                // state += getEdgeColors(e).map(e1 => (e1 === "g" || e1 === "b") ? "2" : (e1 === "r" || e1 === "o") ? "3" : "").join("");
                state += getEdgeColors(e).join("").replaceAll("w", "").replaceAll("y", "").replaceAll("g", "2").replaceAll("b", "2").replaceAll("r", "3").replaceAll("o", "3");
            }
        }
        else if (step === "Final") {
            state = corners.join("") + edges.map(e1 => (e1 + "")
            .replaceAll("10", "j").replaceAll("11", "k").replaceAll("12", "l").replaceAll("1", "a").replaceAll("2", "b").replaceAll("3", "c")
            .replaceAll("4", "d").replaceAll("5", "e").replaceAll("6", "f").replaceAll("7", "g").replaceAll("8", "h").replaceAll("9", "i")).join("");
        }
        return state;
    }
    else {
        return {
            ce: centers,
            c: corners,
            e: edges
        };
    }
}

function getCenterColor(n) {
    switch(n) {
        case 1:
            return "w";
        case 2:
            return "o";
        case 3:
            return "g";
        case 4:
            return "r";
        case 5:
            return "b";
        case 6:
            return "y";
    }
}

function getCornerColors(n) {
    let arr;
    switch (n % 100) {
        case 1:
            arr = ["w", "o", "b"];
            break;
        case 2:
            arr = ["w", "b", "r"];
            break;
        case 3:
            arr = ["w", "g", "o"];
            break;
        case 4:
            arr = ["w", "r", "g"];
            break;
        case 5:
            arr = ["y", "o", "g"];
            break;
        case 6:
            arr = ["y", "g", "r"];
            break;
        case 7:
            arr = ["y", "b", "o"];
            break;
        case 8:
            arr = ["y", "r", "b"];
            break;
    }
    let r = (3 - Math.floor(n / 100)) % 3;
    return rotateArray(arr, r);
}

function getEdgeColors(n) {
    let arr;
    switch (n % 100) {
        case 1:
            arr = ["w", "b"];
            break;
        case 2:
            arr = ["w", "o"];
            break;
        case 3:
            arr = ["w", "r"];
            break;
        case 4:
            arr = ["w", "g"];
            break;
        case 5:
            arr = ["y", "g"];
            break;
        case 6:
            arr = ["y", "o"];
            break;
        case 7:
            arr = ["y", "r"];
            break;
        case 8:
            arr = ["y", "b"];
            break;
        case 9:
            arr = ["g", "o"];
            break;
        case 10:
            arr = ["g", "r"];
            break;
        case 11:
            arr = ["b", "r"];
            break;
        case 12:
            arr = ["b", "o"];
            break;
    }
    let r = Math.floor(n / 100);
    return rotateArray(arr, r);
}

function numberifyPiece(piece, step) {
    piece = typeof piece === "object" ? piece.join("") : piece + "";
    switch(step) {
        case "EO":
            let e1 = piece < 100 ? "1" : "0";
            let e2 = e1 === 1 ? "0" : "1";
            return e1 + e2;
        case "DRc":
            let i = Math.floor(piece / 100);
            return i === 0 ? "100" : i === 1 ? "010" : "001";
        case "DRe":
            let e3 = (piece % 100 === 1 || piece % 100 === 2 || piece % 100 === 3 || piece % 100 === 4 || piece % 100 === 5 || piece % 100 === 6 || piece % 100 === 7 || piece % 100 === 8);
            return e3 ? (piece < 100 ? "10" : "01") : "00";
        case "HTR":
            piece = piece.replaceAll("w", "1").replaceAll("y", "1").replaceAll("g", "2").replaceAll("b", "2").replaceAll("r", "3").replaceAll("o", "3");
            return piece;
        case "Center":
        case "Final":
            piece = piece.replaceAll("w", "1").replaceAll("o", "2").replaceAll("g", "3").replaceAll("r", "4").replaceAll("b", "5").replaceAll("y", "6");
            return piece;
    }
}

function rotateArray(arr, r) {
    let nArr = arr.slice();
    arr = nArr.slice(r).concat(nArr.slice(0, r));
    return arr;
}

function convertState() {
    let convCenters = getPieces(endState).ce;
    let convCorners = getPieces(endState).c
    let convEdges = getPieces(endState).e;
    
    let tempCenters = centers.slice();
    for (let i = 0; i < centers.length; i++) {
        if (tempCenters[i] !== convCenters[i]) {
            centers[i] = tempCenters[convCenters.indexOf(tempCenters[i])];
        }
    }
    convertedCenters = centers.slice();
    
    let tempCorners = corners.slice();
    for (let i = 0; i < corners.length; i++) {
        if (tempCorners[i] !== convCorners[i]) {
            let r = Math.floor(convCorners[convCorners.map(c => c % 100).indexOf(tempCorners[i] % 100)] / 100) * 100;
            r = r === 100 ? 200 : r === 200 ? 100 : 0;
            cornersO[i] = r;
            corners[i] = tempCorners[convCorners.map(c => c % 100).indexOf(tempCorners[i] % 100)];
        }
    }
    convertedCorners = corners.slice();
    convertedCornersO = cornersO.slice();
    
    let tempEdges = edges.slice();
    for (let i = 0; i < edges.length; i++) {
        if (tempEdges[i] !== convEdges[i]) {
            let r = Math.floor(convEdges[convEdges.map(c => c % 100).indexOf(tempEdges[i] % 100)] / 100) * 100;
            edgesO[i] = r;
            edges[i] = tempEdges[convEdges.map(c => c % 100).indexOf(tempEdges[i] % 100)];
        }
    }
    convertedEdges = edges.slice();
    convertedEdgesO = edgesO.slice();
}

function identifyCenter(ce) {
    switch(ce) {
        case "w":
            return 1;
        case "o":
            return 2;
        case "g":
            return 3;
        case "r":
            return 4;
        case "b":
            return 5;
        case "y":
            return 6;
    }
}

function identifyCorner(c) {
    let cp, co;
    if (c.includes("w") && c.includes("o") && c.includes("b")) {
        cp = 1;
        co = c.indexOf("w") * 100;
    }
    else if (c.includes("w") && c.includes("b") && c.includes("r")) {
        cp = 2;
        co = c.indexOf("w") * 100;
    }
    else if (c.includes("w") && c.includes("g") && c.includes("o")) {
        cp = 3;
        co = c.indexOf("w") * 100;
    }
    else if (c.includes("w") && c.includes("r") && c.includes("g")) {
        cp = 4;
        co = c.indexOf("w") * 100;
    }
    else if (c.includes("y") && c.includes("o") && c.includes("g")) {
        cp = 5;
        co = c.indexOf("y") * 100;
    }
    else if (c.includes("y") && c.includes("g") && c.includes("r")) {
        cp = 6;
        co = c.indexOf("y") * 100;
    }
    else if (c.includes("y") && c.includes("b") && c.includes("o")) {
        cp = 7;
        co = c.indexOf("y") * 100;
    }
    else if (c.includes("y") && c.includes("r") && c.includes("b")) {
        cp = 8;
        co = c.indexOf("y") * 100;
    }
    return cp + co;
}

function identifyEdge(e) {
    let ep, eo;
    if (e.includes("w") && e.includes("b")) {
        ep = 1;
        eo = e.indexOf("w") * 100;
    }
    else if (e.includes("w") && e.includes("o")) {
        ep = 2;
        eo = e.indexOf("w") * 100;
    }
    else if (e.includes("w") && e.includes("r")) {
        ep = 3;
        eo = e.indexOf("w") * 100;
    }
    else if (e.includes("w") && e.includes("g")) {
        ep = 4;
        eo = e.indexOf("w") * 100;
    }
    else if (e.includes("y") && e.includes("g")) {
        ep = 5;
        eo = e.indexOf("y") * 100;
    }
    else if (e.includes("y") && e.includes("o")) {
        ep = 6;
        eo = e.indexOf("y") * 100;
    }
    else if (e.includes("y") && e.includes("r")) {
        ep = 7;
        eo = e.indexOf("y") * 100;
    }
    else if (e.includes("y") && e.includes("b")) {
        ep = 8;
        eo = e.indexOf("y") * 100;
    }
    else if (e.includes("g") && e.includes("o")) {
        ep = 9;
        eo = e.indexOf("g") * 100;
    }
    else if (e.includes("g") && e.includes("r")) {
        ep = 10;
        eo = e.indexOf("g") * 100;
    }
    else if (e.includes("b") && e.includes("r")) {
        ep = 11;
        eo = e.indexOf("b") * 100;
    }
    else if (e.includes("b") && e.includes("o")) {
        ep = 12;
        eo = e.indexOf("b") * 100;
    }
    return ep + eo;
}

function isHTR(mvs) {
    getStepState(mvs);
    let state = corners.join("");
    let ind = solutionsRealHTR.findIndex(s => s.state === state);
    return ind !== -1;
}

function move(m) {
    let nCornersO = moveTable[m].c.map((co1, i) => (cornersO[co1] + moveTable[m].co[i]) % 3);
    let nEdgesO = moveTable[m].e.map((eo1, i) => (edgesO[eo1] + moveTable[m].eo[i]) % 2);

    let nCenters = moveTable[m].ce.map(ce1 => centers[ce1]);
    let nCorners = moveTable[m].c.map(c1 => corners[c1]);
    let nEdges = moveTable[m].e.map(e1 => edges[e1]);

    cornersO = nCornersO;
    edgesO = nEdgesO;

    centers = nCenters;
    corners = nCorners;
    edges = nEdges;
}

let moveTable = {
    "U" : {ce: [0, 1, 2, 3, 4, 5], c: [2, 0, 3, 1, 4, 5, 6, 7], e: [1, 3, 0, 2, 4, 5, 6, 7, 8, 9, 10, 11], co: [0, 0, 0, 0, 0, 0, 0, 0], eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
    "D" : {ce: [0, 1, 2, 3, 4, 5], c: [0, 1, 2, 3, 6, 4, 7, 5], e: [0, 1, 2, 3, 5, 7, 4, 6, 8, 9, 10, 11], co: [0, 0, 0, 0, 0, 0, 0, 0], eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
    "R" : {ce: [0, 1, 2, 3, 4, 5], c: [0, 3, 2, 5, 4, 7, 6, 1], e: [0, 1, 9, 3, 4, 5, 10, 7, 8, 6, 2, 11], co: [0, 1, 0, 2, 0, 1, 0, 2], eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
    "L" : {ce: [0, 1, 2, 3, 4, 5], c: [6, 1, 0, 3, 2, 5, 4, 7], e: [0, 11, 2, 3, 4, 8, 6, 7, 1, 9, 10, 5], co: [2, 0, 1, 0, 2, 0, 1, 0], eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
    "F" : {ce: [0, 1, 2, 3, 4, 5], c: [0, 1, 4, 2, 5, 3, 6, 7], e: [0, 1, 2, 8, 9, 5, 6, 7, 4, 3, 10, 11], co: [0, 0, 2, 1, 1, 2, 0, 0], eo: [0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0]},
    "B" : {ce: [0, 1, 2, 3, 4, 5], c: [1, 7, 2, 3, 4, 5, 0, 6], e: [10, 1, 2, 3, 4, 5, 6, 11, 8, 9, 7, 0], co: [1, 2, 0, 0, 0, 0, 2, 1], eo: [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1]},

    "U2" : {ce: [0, 1, 2, 3, 4, 5], c: [3, 2, 1, 0, 4, 5, 6, 7], e: [3, 2, 1, 0, 4, 5, 6, 7, 8, 9, 10, 11], co: [0, 0, 0, 0, 0, 0, 0, 0], eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
    "D2" : {ce: [0, 1, 2, 3, 4, 5], c: [0, 1, 2, 3, 7, 6, 5, 4], e: [0, 1, 2, 3, 7, 6, 5, 4, 8, 9, 10, 11], co: [0, 0, 0, 0, 0, 0, 0, 0], eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
    "R2" : {ce: [0, 1, 2, 3, 4, 5], c: [0, 5, 2, 7, 4, 1, 6, 3], e: [0, 1, 6, 3, 4, 5, 2, 7, 8, 10, 9, 11], co: [0, 0, 0, 0, 0, 0, 0, 0], eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
    "L2" : {ce: [0, 1, 2, 3, 4, 5], c: [4, 1, 6, 3, 0, 5, 2, 7], e: [0, 5, 2, 3, 4, 1, 6, 7, 11, 9, 10, 8], co: [0, 0, 0, 0, 0, 0, 0, 0], eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
    "F2" : {ce: [0, 1, 2, 3, 4, 5], c: [0, 1, 5, 4, 3, 2, 6, 7], e: [0, 1, 2, 4, 3, 5, 6, 7, 9, 8, 10, 11], co: [0, 0, 0, 0, 0, 0, 0, 0], eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
    "B2" : {ce: [0, 1, 2, 3, 4, 5], c: [7, 6, 2, 3, 4, 5, 1, 0], e: [7, 1, 2, 3, 4, 5, 6, 0, 8, 9, 11, 10], co: [0, 0, 0, 0, 0, 0, 0, 0], eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},

    "U'" : {ce: [0, 1, 2, 3, 4, 5], c: [1, 3, 0, 2, 4, 5, 6, 7], e: [2, 0, 3, 1, 4, 5, 6, 7, 8, 9, 10, 11], co: [0, 0, 0, 0, 0, 0, 0, 0], eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
    "D'" : {ce: [0, 1, 2, 3, 4, 5], c: [0, 1, 2, 3, 5, 7, 4, 6], e: [0, 1, 2, 3, 6, 4, 7, 5, 8, 9, 10, 11], co: [0, 0, 0, 0, 0, 0, 0, 0], eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
    "R'" : {ce: [0, 1, 2, 3, 4, 5], c: [0, 7, 2, 1, 4, 3, 6, 5], e: [0, 1, 10, 3, 4, 5, 9, 7, 8, 2, 6, 11], co: [0, 1, 0, 2, 0, 1, 0, 2], eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
    "L'" : {ce: [0, 1, 2, 3, 4, 5], c: [2, 1, 4, 3, 6, 5, 0, 7], e: [0, 8, 2, 3, 4, 11, 6, 7, 5, 9, 10, 1], co: [2, 0, 1, 0, 2, 0, 1, 0], eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
    "F'" : {ce: [0, 1, 2, 3, 4, 5], c: [0, 1, 3, 5, 2, 4, 6, 7], e: [0, 1, 2, 9, 8, 5, 6, 7, 3, 4, 10, 11], co: [0, 0, 2, 1, 1, 2, 0, 0], eo: [0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0]},
    "B'" : {ce: [0, 1, 2, 3, 4, 5], c: [6, 0, 2, 3, 4, 5, 7, 1], e: [11, 1, 2, 3, 4, 5, 6, 10, 8, 9, 0, 7], co: [1, 2, 0, 0, 0, 0, 2, 1], eo: [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1]},

    "x" : {ce: [2, 1, 5, 3, 0, 4], c: [2, 3, 4, 5, 6, 7, 0, 1], e: [3, 8, 9, 4, 7, 11, 10, 0, 5, 6, 2, 1], co: [2, 1, 1, 2, 2, 1, 1, 2], eo: [1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0]},
    "y" : {ce: [0, 2, 3, 4, 1, 5], c: [2, 0, 3, 1, 5, 7, 4, 6], e: [1, 3, 0, 2, 6, 4, 7, 5, 9, 10, 11, 8], co: [0, 0, 0, 0, 0, 0, 0, 0], eo: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]},
    "z" : {ce: [1, 5, 2, 0, 4, 3], c: [6, 0, 4, 2, 5, 3, 7, 1], e: [11, 5, 1, 8, 9, 6, 2, 10, 4, 3, 0, 7], co: [2, 1, 1, 2, 2, 1, 1, 2], eo: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]},

    "x2" : {ce: [5, 1, 4, 3, 2, 0], c: [4, 5, 6, 7, 0, 1, 2, 3], e: [4, 5, 6, 7, 0, 1, 2, 3, 11, 10, 9, 8], co: [0, 0, 0, 0, 0, 0, 0, 0], eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
    "y2" : {ce: [0, 3, 4, 1, 2, 5], c: [3, 2, 1, 0, 7, 6, 5, 4], e: [3, 2, 1, 0, 7, 6, 5, 4, 10, 11, 8, 9], co: [0, 0, 0, 0, 0, 0, 0, 0], eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
    "z2" : {ce: [5, 3, 2, 1, 4, 0], c: [7, 6, 5, 4, 3, 2, 1, 0], e: [7, 6, 5, 4, 3, 2, 1, 0, 9, 8, 11, 10], co: [0, 0, 0, 0, 0, 0, 0, 0], eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},

    "x'" : {ce: [4, 1, 0, 3, 5, 2], c: [6, 7, 0, 1, 2, 3, 4, 5], e: [7, 11, 10, 0, 3, 8, 9, 4, 1, 2, 6, 5], co: [2, 1, 1, 2, 2, 1, 1, 2], eo: [1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0]},
    "y'" : {ce: [0, 4, 1, 2, 3, 5], c: [1, 3, 0, 2, 6, 4, 7, 5], e: [2, 0, 3, 1, 5, 7, 4, 6, 11, 8, 9, 10], co: [0, 0, 0, 0, 0, 0, 0, 0], eo: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]},
    "z'" : {ce: [3, 0, 2, 5, 4, 1], c: [1, 7, 3, 5, 2, 4, 0, 6], e: [10, 2, 6, 9, 8, 1, 5, 11, 3, 4, 7, 0], co: [2, 1, 1, 2, 2, 1, 1, 2], eo: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]},
};

const solutionsCenter = [
    {state: "123456", solution: ""},
    {state: "326415", solution: "x'"},
    {state: "521463", solution: "x"},
    {state: "625431", solution: "x2"},
    {state: "134526", solution: "y'"},
    {state: "152346", solution: "y"},
    {state: "145236", solution: "y2"},
    {state: "263154", solution: "z'"},
    {state: "413652", solution: "z"},
    {state: "643251", solution: "z2"},
    {state: "364125", solution: "y' x'"},
    {state: "312645", solution: "y x'"},
    {state: "341265", solution: "y2 x'"},
    {state: "256314", solution: "z' x'"},
    {state: "436512", solution: "z x'"},
    {state: "546213", solution: "z2 x'"},
    {state: "514623", solution: "y' x"},
    {state: "562143", solution: "y x"},
    {state: "231564", solution: "z' x"},
    {state: "451362", solution: "z x"},
    {state: "654321", solution: "y' x2"},
    {state: "632541", solution: "y x2"},
    {state: "215634", solution: "z' x2"},
    {state: "465132", solution: "z x2"},
];