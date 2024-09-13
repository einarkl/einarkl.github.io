let moves = ["U", "U'", "U2", "D", "D'", "D2", "R", "R'", "R2", "L", "L'", "L2", "F", "F'", "F2", "B", "B'", "B2"];
let movesEO = ["U", "U'", "U2", "D", "D'", "D2", "R", "R'", "R2", "L", "L'", "L2", "F2", "B2"];
let triggers = [
    "L' U L", "L' U2 L", "L' U' L", "F U F'", "F U2 F'", "F U' F'",
    "L U L'", "L U2 L'", "L U' L'", "B' U B", "B' U2 B", "B' U' B",
    "R U R'", "R U2 R'", "R U' R'", "F' U F", "F' U2 F", "F' U' F",
    "R' U R", "R' U2 R", "R' U' R", "B U B'", "B U2 B'", "B U' B'",
    "R' F R F'", "F R' F' R", "R B' R' B", "B' R B R'", "L F' L' F", "F' L F L'", "L' B L B'", "B L' B' L"
];
let triggersOld = [
    "S R S'", "S R' S'", "S' L' S", "S' L S",
    "R U R'", "R U' R'", "R U2 R'", "R' U R", "R' U' R", "R' U2 R",
    "L U L'", "L U' L'", "L U2 L'", "L' U L", "L' U' L", "L' U2 L",
    "F U F'", "F U' F'", "F U2 F'", "F' U F", "F' U' F", "F' U2 F",
    "B U B'", "B U' B'", "B U2 B'", "B' U B", "B' U' B", "B' U2 B",
    "Fw R Fw'", "Fw R' Fw'", "Fw R2 Fw'", "Fw' L Fw", "Fw' L' Fw", "Fw' L2 Fw"
];
let movesF2L = ["U", "U'", "U2"].concat(triggers);

let orientations = ["", "x2", "x", "x'", "z", "z'"];

let u1 = "w", u2 = "w", u3 = "w", u4 = "w", u5 = "w", u6 = "w", u7 = "w", u8 = "w", u9 = "w", nu1, nu2, nu3, nu4, nu5, nu6, nu7, nu8, nu9;
let l1 = "o", l2 = "o", l3 = "o", l4 = "o", l5 = "o", l6 = "o", l7 = "o", l8 = "o", l9 = "o", nl1, nl2, nl3, nl4, nl5, nl6, nl7, nl8, nl9;
let f1 = "g", f2 = "g", f3 = "g", f4 = "g", f5 = "g", f6 = "g", f7 = "g", f8 = "g", f9 = "g", nf1, nf2, nf3, nf4, nf5, nf6, nf7, nf8, nf9;
let r1 = "r", r2 = "r", r3 = "r", r4 = "r", r5 = "r", r6 = "r", r7 = "r", r8 = "r", r9 = "r", nr1, nr2, nr3, nr4, nr5, nr6, nr7, nr8, nr9;
let b1 = "b", b2 = "b", b3 = "b", b4 = "b", b5 = "b", b6 = "b", b7 = "b", b8 = "b", b9 = "b", nb1, nb2, nb3, nb4, nb5, nb6, nb7, nb8, nb9;
let d1 = "y", d2 = "y", d3 = "y", d4 = "y", d5 = "y", d6 = "y", d7 = "y", d8 = "y", d9 = "y", nd1, nd2, nd3, nd4, nd5, nd6, nd7, nd8, nd9;

let cubeState = [
    u1,u2,u3,u4,u5,u6,u7,u8,u9,
    l1,l2,l3,l4,l5,l6,l7,l8,l9,
    f1,f2,f3,f4,f5,f6,f7,f8,f9,
    r1,r2,r3,r4,r5,r6,r7,r8,r9,
    b1,b2,b3,b4,b5,b6,b7,b8,b9,
    d1,d2,d3,d4,d5,d6,d7,d8,d9
];

let cubeScramble ="";
let solutionCross ="";
let solutionF2L ="";
let solutionOLL ="";
let solutionPLL ="";
let solutionAUF = "";
let solution ="";

let solutionInfo = "";

let timeInteruption = false;

onmessage = e => {
    cubeScramble = e.data;
    getCubeState(cubeScramble);

    solveCross();
}

function checkTime(start) {
    const n = 20;
    const timeLimit = n * 60 * 1000;
    return Date.now() - start >= timeLimit;
}

function solveCross() {
    let solLength = 1;
    let start = Date.now();
    let arr = moves.slice();
    solutionCross = "";
    
    solveLoop : while (!isCross(solutionCross)) {
        if (checkTime(start)) {
            timeInteruption = true;
            break solveLoop;
        }
        if (solLength === 1) {
            for (let m of arr) {
                for (let o of orientations) {
                    if (checkTime(start)) {
                        timeInteruption = true;
                        break solveLoop;
                    }
                    if (isCross(o + " " + m)) {
                        solutionCross = o + " " + m;
                        break solveLoop;
                    }
                }
            }
        }
        else {
            let tArr = arr.slice();
            for (let m1 of arr) {
                let prevMove = m1.split(" ")[m1.split(" ").length - 1][0];
                //let prevPrevMove = m1.split(" ")[m1.split(" ").length - 2] ? m1.split(" ")[m1.split(" ").length - 2][0] : "";
                for (let m2 of moves.filter(m => {return m[0] !== prevMove})) {
                    tArr.push(m1 + " " + m2);
                    for (let o of orientations) {
                        if (checkTime(start)) {
                            timeInteruption = true;
                            break solveLoop;
                        }
                        if (isCross(o + " " + m1 + " " + m2)) {
                            solutionCross = o + " " + m1 + " " + m2;
                            break solveLoop;
                        }
                    }
                }
            }
            arr = tArr.slice();
        }
        solLength++;
        postMessage([solLength]);
    }
    if (!timeInteruption) {
        solutionInfo += "<h1><b>Cross:</b> " + cleanAlg(solutionCross) + "</h1>";
        solution = cleanAlg(solutionCross);
        postMessage([solutionInfo, true, (cubeScramble + " " + solution)]);
        //postMessage([solutionInfo, true]);
        solveF2L();
    }
    else {
        postMessage([0]);
    }
}

function solveF2L() {
    solutionF2L = "";
    let num = getNumberOfSolvedF2L("");
    
    while (num < 4) {
        let solLength = 1;
        let start = Date.now();
        let arr = movesF2L.slice();
        let solF2L = "";
        let tNum = num;

        solveLoop : while (getNumberOfSolvedF2L(solutionF2L) <= tNum) {
            if (checkTime(start)) {
                timeInteruption = true;
                break solveLoop;
            }
            if (solLength === 1) {
                for (let m of arr) {
                    if (checkTime(start)) {
                        timeInteruption = true;
                        break solveLoop;
                    }
                    if (getNumberOfSolvedF2L(m) > num) {
                        num = getNumberOfSolvedF2L(m);
                        console.log(num);
                        solF2L = m;
                        solutionInfo += "<h1><b>"+getNumberOfSolvedF2L(m)+". pair:</b> " + cleanAlg(solF2L) + "</h1>";
                        solution = cleanAlg([solutionCross, solutionF2L, solF2L].join(" "));
                        postMessage([solutionInfo, true, (cubeScramble + " " + solution)]);
                        break solveLoop;
                    }
                }
            }
            else {
                let tArr = arr.slice();
                for (let m1 of arr) {
                    for (let m2 of movesF2L) {
                        if (checkTime(start)) {
                            timeInteruption = true;
                            break solveLoop;
                        }
                        tArr.push(m1 + " " + m2);
                        if (getNumberOfSolvedF2L(m1 + " " + m2) > num) {
                            num = getNumberOfSolvedF2L(m1 + " " + m2);
                            solF2L = m1 + " " + m2;
                            solutionInfo += "<h1><b>"+getNumberOfSolvedF2L(m1 + " " + m2)+". pair:</b> " + cleanAlg(solF2L) + "</h1>";
                            solution = cleanAlg([solutionCross, solutionF2L, solF2L].join(" "));
                            postMessage([solutionInfo, true, (cubeScramble + " " + solution)]);
                            break solveLoop;
                        }
                    }
                }
                arr = tArr.slice();
            }
            solLength++;
            postMessage([solLength]);
        }

        solutionF2L += solF2L + " ";
    }
    
    if (!timeInteruption) {
        solveOLL();
    }
    else {
        postMessage([0]);
    }
}

/*

function solveF2L() {
    solutionF2L = "";
    
    for (let f2lIndex = 0; f2lIndex < 4; f2lIndex++) {
        let solLength = 1;
        let start = Date.now();
        let arr = movesF2L.slice();
        let solF2L = "";

        solveLoop : while (!isF2L(solF2L, f2lIndex)) {
            if (checkTime(start)) {
                timeInteruption = true;
                break solveLoop;
            }
            if (solLength === 1) {
                for (let m of arr) {
                    if (checkTime(start)) {
                        timeInteruption = true;
                        break solveLoop;
                    }
                    if (isF2L(m, f2lIndex)) {
                        solF2L = m;
                        solutionInfo += "<h1><b>"+(f2lIndex + 1)+". pair:</b> " + cleanAlg(solF2L) + "</h1>";
                        solution = cleanAlg([solutionCross, solutionF2L, solF2L].join(" "));
                        postMessage([solutionInfo, true, (cubeScramble + " " + solution)]);
                        break solveLoop;
                    }
                }
            }
            else {
                let tArr = arr.slice();
                for (let m1 of arr) {
                    for (let m2 of movesF2L) {
                        if (checkTime(start)) {
                            timeInteruption = true;
                            break solveLoop;
                        }
                        tArr.push(m1 + " " + m2);
                        if (isF2L(m1 + " " + m2, f2lIndex)) {
                            solF2L = m1 + " " + m2;
                            solutionInfo += "<h1><b>"+(f2lIndex + 1)+". pair:</b> " + cleanAlg(solF2L) + "</h1>";
                            solution = cleanAlg([solutionCross, solutionF2L, solF2L].join(" "));
                            postMessage([solutionInfo, true, (cubeScramble + " " + solution)]);
                            break solveLoop;
                        }
                    }
                }
                arr = tArr.slice();
            }
            solLength++;
            postMessage([solLength]);
        }
        solutionF2L += solF2L + " ";
    }

    if (!timeInteruption) {
        solveOLL();
    }
    else {
        postMessage([0]);
    }
}
*/

function solveOLL() {
    let solLength = 1;
    const aufs = ["", "U", "U'", "U2"];
    solutionOLL = "";
    
    solveLoop : while (!isOLL(solutionOLL)) {
        if (isOLL(aufs[0])) {
            solutionOLL = m;
            break solveLoop;
        }
        else {
            for (let m1 of aufs) {
                for (let m2 of olls) {
                    if (isOLL(m1 + " " + m2)) {
                        solutionOLL = m1 + " " + m2;
                        break solveLoop;
                    }
                }
            }
        }
        solLength++;
        postMessage([solLength]);
    }
    if (!timeInteruption) {
        solutionInfo += "<h1><b>OLL:</b> " + cleanAlg(solutionOLL) + "</h1>";
        solution = cleanAlg([solutionCross, solutionF2L, solutionOLL].join(" "));
        postMessage([solutionInfo, true, (cubeScramble + " " + solution)]);
        solvePLL();
    }
    else {
        postMessage([0]);
    }
}

function solvePLL() {
    let solLength = 1;
    const aufs = ["", "U", "U'", "U2"];
    solutionPLL = "";
    
    solveLoop : while (!isPLL(solutionPLL)) {
        if (isPLL(aufs[0])) {
            solutionPLL = m;
            break solveLoop;
        }
        else {
            for (let m1 of aufs) {
                for (let m2 of plls) {
                    if (isPLL(m1 + " " + m2)) {
                        solutionPLL = m1 + " " + m2;
                        break solveLoop;
                    }
                }
            }
        }
        solLength++;
        postMessage([solLength]);
    }
    if (!timeInteruption) {
        solutionInfo += cleanAlg(solutionPLL) !== "" ? "<h1><b>PLL:</b> " + cleanAlg(solutionPLL) + "</h1>" : "";
        solution = cleanAlg([solutionCross, solutionF2L, solutionOLL, solutionPLL].join(" "));
        postMessage([solutionInfo, true, (cubeScramble + " " + solution)]);
        solveAUF();
    }
    else {
        postMessage([0]);
    }
}

function solveAUF() {
    let aufs = ["", "U", "U'", "U2"];
    solutionAUF = "";

    solveLoop : for (let m of aufs) {
        if (isSolved(m)) {
            solutionAUF = m;
            break solveLoop;
        }
    }
    
    solution = cleanAlg([solutionCross, solutionF2L, solutionOLL, solutionPLL, solutionAUF].join(" "));
    solutionInfo += solutionAUF !== "" ? ("<h1><b>AUF:</b> " + solutionAUF + "</h1><br><h1><b>Solution:</b> " + solution + "</h1><br><h1><b>Moves:</b> " + 
        solution.split(" ").filter(s => {return s.split("")[0] !== "x" || s.split("")[0] !== "y" || s.split("")[0] !== "z"}).length + "</h1>") :
        ("<h1><b>Solution:</b> " + solution + "</h1><br><h1><b>Moves:</b> " + 
        solution.split(" ").filter(s => {return s.split("")[0] !== "x" || s.split("")[0] !== "y" || s.split("")[0] !== "z"}).length + "</h1>");
    postMessage([solutionInfo, true, (cubeScramble + " " + solution)]);
    postMessage(["Solved"]);
}

function isCross(sol) {
    resetCubeState();
    getCubeState([cubeScramble, sol].join(" "));

    let cL = cubeState[13];
    let cF = cubeState[22];
    let cR = cubeState[31];
    let cB = cubeState[40];
    let cD = cubeState[49];

    let df = cubeState[46];
    let fd = cubeState[25];
    let dr = cubeState[50];
    let rd = cubeState[34];
    let db = cubeState[52];
    let bd = cubeState[43];
    let dl = cubeState[48];
    let ld = cubeState[16];

    return (
        df === cD && dr === cD && db === cD && dl === cD &&
        fd === cF && rd === cR && bd === cB && ld === cL
    );
}

function getNumberOfSolvedF2L(sol) {
    let num = 0;
    for (let i = 0; i < 4; i++) {
        if (isF2L(sol, i)) {
            num++;
        }
    }
    return num;
}

function isF2L(sol, i) {
    resetCubeState();
    getCubeState([cubeScramble, solutionCross, solutionF2L, sol].join(" "));
    
    let cL = cubeState[13];
    let cF = cubeState[22];
    let cR = cubeState[31];
    let cB = cubeState[40];
    let cD = cubeState[49];

    let fl = cubeState[21];
    let lf = cubeState[14];
    let fr = cubeState[23];
    let rf = cubeState[30];
    let bl = cubeState[41];
    let lb = cubeState[12];
    let br = cubeState[39];
    let rb = cubeState[32];
    
    let dfl = cubeState[45];
    let fdl = cubeState[24];
    let ldf = cubeState[17];
    let dfr = cubeState[47];
    let fdr = cubeState[26];
    let rdf = cubeState[33];
    let dbr = cubeState[53];
    let rdb = cubeState[35];
    let bdr = cubeState[42];
    let dbl = cubeState[51];
    let ldb = cubeState[15];
    let bdl = cubeState[44];
    
    let pairs = [
        (dbl === cD && bdl === cB && ldb === cL && bl === cB && lb === cL),
        (dbr === cD && bdr === cB && rdb === cR && br === cB && rb === cR),
        (dfl === cD && fdl === cF && ldf === cL && fl === cF && lf === cL),
        (dfr === cD && fdr === cF && rdf === cR && fr === cF && rf === cR)
    ];

    switch (i) {
        case 0:
            return isCross([solutionCross, solutionF2L, sol].join(" ")) && pairs[0];
        case 1:
            return isCross([solutionCross, solutionF2L, sol].join(" ")) && pairs[1];
        case 2:
            return isCross([solutionCross, solutionF2L, sol].join(" ")) && pairs[2];
        case 3:
            return isCross([solutionCross, solutionF2L, sol].join(" ")) && pairs[3];
    }
/* 
    switch (i) {
        case 0:
            return isCross([solutionCross, sol].join(" ")) && pairs[0];
        case 1:
            return isCross([solutionCross, solutionF2L, sol].join(" ")) && pairs[0] && pairs[1];
        case 2:
            return isCross([solutionCross, solutionF2L, sol].join(" ")) && pairs[0] && pairs[1] && pairs[2];
        case 3:
            return isCross([solutionCross, solutionF2L, sol].join(" ")) && pairs[0] && pairs[1] && pairs[2] && pairs[3];
    } */
}

function isOLL(sol) {
    resetCubeState();
    getCubeState([cubeScramble, solutionCross, solutionF2L, sol].join(" "));

    let cU = cubeState[4];

    let ubl = cubeState[0];
    let ubr = cubeState[2];
    let ufr = cubeState[8];
    let ufl = cubeState[6];

    let ub = cubeState[1];
    let ur = cubeState[5];
    let uf = cubeState[7];
    let ul = cubeState[3];

    return ubl === cU && ubr === cU && ufr === cU && ufl === cU && ub === cU && ur === cU && uf === cU && ul === cU;
}

function isPLL(sol) {
    resetCubeState()
    getCubeState([cubeScramble, solutionCross, solutionF2L, solutionOLL, sol].join(" "));

    let cU = cubeState[4];
    let cL = cubeState[13];
    let cF = cubeState[22];
    let cR = cubeState[31];
    let cB = cubeState[40];
    let cD = cubeState[49];
    
    return (
        (cubeState.join("") === 
        cU + cU + cU + cU + cU + cU + cU + cU + cU +
        cL + cL + cL + cL + cL + cL + cL + cL + cL +
        cF + cF + cF + cF + cF + cF + cF + cF + cF +
        cR + cR + cR + cR + cR + cR + cR + cR + cR +
        cB + cB + cB + cB + cB + cB + cB + cB + cB +
        cD + cD + cD + cD + cD + cD + cD + cD + cD) ||
        (cubeState.join("") === 
        cU + cU + cU + cU + cU + cU + cU + cU + cU +
        cF + cF + cF + cL + cL + cL + cL + cL + cL +
        cR + cR + cR + cF + cF + cF + cF + cF + cF +
        cB + cB + cB + cR + cR + cR + cR + cR + cR +
        cL + cL + cL + cB + cB + cB + cB + cB + cB +
        cD + cD + cD + cD + cD + cD + cD + cD + cD) ||
        (cubeState.join("") === 
        cU + cU + cU + cU + cU + cU + cU + cU + cU +
        cB + cB + cB + cL + cL + cL + cL + cL + cL +
        cL + cL + cL + cF + cF + cF + cF + cF + cF +
        cF + cF + cF + cR + cR + cR + cR + cR + cR +
        cR + cR + cR + cB + cB + cB + cB + cB + cB +
        cD + cD + cD + cD + cD + cD + cD + cD + cD) ||
        (cubeState.join("") === 
        cU + cU + cU + cU + cU + cU + cU + cU + cU +
        cR + cR + cR + cL + cL + cL + cL + cL + cL +
        cB + cB + cB + cF + cF + cF + cF + cF + cF +
        cL + cL + cL + cR + cR + cR + cR + cR + cR +
        cF + cF + cF + cB + cB + cB + cB + cB + cB +
        cD + cD + cD + cD + cD + cD + cD + cD + cD)
        );
}

function isSolved(sol) {
    resetCubeState()
    getCubeState([cubeScramble, solutionCross, solutionF2L, solutionOLL, solutionPLL, sol].join(" "));
    
    let cU = cubeState[4];
    let cL = cubeState[13];
    let cF = cubeState[22];
    let cR = cubeState[31];
    let cB = cubeState[40];
    let cD = cubeState[49];
    
    return cubeState.join("") === 
        cU + cU + cU + cU + cU + cU + cU + cU + cU +
        cL + cL + cL + cL + cL + cL + cL + cL + cL +
        cF + cF + cF + cF + cF + cF + cF + cF + cF +
        cR + cR + cR + cR + cR + cR + cR + cR + cR +
        cB + cB + cB + cB + cB + cB + cB + cB + cB +
        cD + cD + cD + cD + cD + cD + cD + cD + cD;
}

function getCubeState(sol) {
    let arr = Array.isArray(sol) ? sol : sol.trim().split(" ");
    for (let a of arr) {
        switch (a) {
            case "R":
                _r();
                break;
            case "R2":
            case "R2'":
                _r2();
                break;
            case "R'":
                _ri();
                break;
            case "L":
                _l();
                break;
            case "L2":
            case "L2'":
                _l2();
                break;
            case "L'":
                _li();
                break;
            case "F":
                _f();
                break;
            case "F2":
            case "F2'":
                _f2();
                break;
            case "F'":
                _fi();
                break;
            case "B":
                _b();
                break;
            case "B2":
            case "B2'":
                _b2();
                break;
            case "B'":
                _bi();
                break;
            case "U":
                _u();
                break;
            case "U2":
            case "U2'":
                _u2();
                break;
            case "U'":
                _ui();
                break;
            case "D":
                _d();
                break;
            case "D2":
            case "D2'":
                _d2();
                break;
            case "D'":
                _di();
                break;
            case "x":
                _x();
                break;
            case "x2":
            case "x2'":
                _x2();
                break;
            case "x'":
                _xi();
                break;
            case "y":
                _y();
                break;
            case "y2":
            case "y2'":
                _y2();
                break;
            case "y'":
                _yi();
                break;
            case "z":
                _z();
                break;
            case "z2":
            case "z2'":
                _z2();
                break;
            case "z'":
                _zi();
                break;
            case "M":
                _m();
                break;
            case "M2":
            case "M2'":
                _m2();
                break;
            case "M'":
                _mi();
                break;
            case "S":
                _s();
                break;
            case "S2":
            case "S2'":
                _s2();
                break;
            case "S'":
                _si();
                break;
            case "E":
                _e();
                break;
            case "E2":
            case "E2'":
                _e2();
                break;
            case "E'":
                _ei();
                break;
            case "Uw":
                _uw();
                break;
            case "Uw2":
            case "Uw2'":
                _uw2();
                break;
            case "Uw'":
                _uwi();
                break;
            case "Dw":
                _dw();
                break;
            case "Dw2":
            case "Dw2'":
                _dw2();
                break;
            case "Dw'":
                _dwi();
                break;
            case "Fw":
                _fw();
                break;
            case "Fw2":
            case "Fw2'":
                _fw2();
                break;
            case "Fw'":
                _fwi();
                break;
            case "Bw":
                _bw();
                break;
            case "Bw2":
            case "Bw2'":
                _bw2();
                break;
            case "Bw'":
                _bwi();
                break;
            case "Rw":
                _rw();
                break;
            case "Rw2":
            case "Rw2'":
                _rw2();
                break;
            case "Rw'":
                _rwi();
                break;
            case "Lw":
                _lw();
                break;
            case "Lw2":
            case "Lw2'":
                _lw2();
                break;
            case "Lw'":
                _lwi();
                break;
        }
    }

    cubeState = [
        u1,u2,u3,u4,u5,u6,u7,u8,u9,
        l1,l2,l3,l4,l5,l6,l7,l8,l9,
        f1,f2,f3,f4,f5,f6,f7,f8,f9,
        r1,r2,r3,r4,r5,r6,r7,r8,r9,
        b1,b2,b3,b4,b5,b6,b7,b8,b9,
        d1,d2,d3,d4,d5,d6,d7,d8,d9
    ];
}

function resetCubeState() {
    u1 = "w", u2 = "w", u3 = "w", u4 = "w", u5 = "w", u6 = "w", u7 = "w", u8 = "w", u9 = "w",
    l1 = "o", l2 = "o", l3 = "o", l4 = "o", l5 = "o", l6 = "o", l7 = "o", l8 = "o", l9 = "o",
    f1 = "g", f2 = "g", f3 = "g", f4 = "g", f5 = "g", f6 = "g", f7 = "g", f8 = "g", f9 = "g",
    r1 = "r", r2 = "r", r3 = "r", r4 = "r", r5 = "r", r6 = "r", r7 = "r", r8 = "r", r9 = "r",
    b1 = "b", b2 = "b", b3 = "b", b4 = "b", b5 = "b", b6 = "b", b7 = "b", b8 = "b", b9 = "b",
    d1 = "y", d2 = "y", d3 = "y", d4 = "y", d5 = "y", d6 = "y", d7 = "y", d8 = "y", d9 = "y";
}

{
    function _r() {
        nf1 = f1; nf2 = f2; nf3 = f3; nf4 = f4; nf6=f6; nf7=f7; nf8=f8; nf9=f9;
        nb1 = b1; nb2 = b2; nb3 = b3; nb4 = b4; nb6=b6; nb7=b7; nb8=b8; nb9=b9;
        nr1 = r1; nr2 = r2; nr3 = r3; nr4 = r4; nr6=r6; nr7=r7; nr8=r8; nr9=r9;
        nl1 = l1; nl2 = l2; nl3 = l3; nl4 = l4; nl6=l6; nl7=l7; nl8=l8; nl9=l9;
        nu1 = u1; nu2 = u2; nu3 = u3; nu4 = u4; nu6=u6; nu7=u7; nu8=u8; nu9=u9;
        nd1 = d1; nd2 = d2; nd3 = d3; nd4 = d4; nd6=d6; nd7=d7; nd8=d8; nd9=d9;

        u3 = nf3; u6 = nf6; u9 = nf9;
        f3 = nd3; f6 = nd6; f9 = nd9;
        d3 = nb7; d6 = nb4; d9 = nb1;
        b7 = nu3; b4 = nu6; b1= nu9;
        r1 = nr7; r2 = nr4; r3 = nr1; r4 = nr8; r6 = nr2; r7 = nr9; r8 = nr6; r9 = nr3;
    }
    function _r2() {
        _r();
        _r();
    }
    function _ri() {
        _r();
        _r();
        _r();
    }
    function _l() {
        nf1 = f1; nf2 = f2; nf3 = f3; nf4 = f4; nf6=f6; nf7=f7; nf8=f8; nf9=f9;
        nb1 = b1; nb2 = b2; nb3 = b3; nb4 = b4; nb6=b6; nb7=b7; nb8=b8; nb9=b9;
        nr1 = r1; nr2 = r2; nr3 = r3; nr4 = r4; nr6=r6; nr7=r7; nr8=r8; nr9=r9;
        nl1 = l1; nl2 = l2; nl3 = l3; nl4 = l4; nl6=l6; nl7=l7; nl8=l8; nl9=l9;
        nu1 = u1; nu2 = u2; nu3 = u3; nu4 = u4; nu6=u6; nu7=u7; nu8=u8; nu9=u9;
        nd1 = d1; nd2 = d2; nd3 = d3; nd4 = d4; nd6=d6; nd7=d7; nd8=d8; nd9=d9;

        u1 = nb9; u4 = nb6; u7 = nb3;
        f1 = nu1; f4 = nu4; f7 = nu7;
        d1 = nf1; d4 = nf4; d7 = nf7;
        b9 = nd1; b6 = nd4; b3= nd7;
        l1 = nl7; l2 = nl4; l3 = nl1; l4 = nl8; l6 = nl2; l7 = nl9; l8 = nl6; l9 = nl3;
    }
    function _l2() {
        _l();
        _l();
    }
    function _li() {
        _l();
        _l();
        _l();
    }
    function _f() {
        nf1 = f1; nf2 = f2; nf3 = f3; nf4 = f4; nf6=f6; nf7=f7; nf8=f8; nf9=f9;
        nb1 = b1; nb2 = b2; nb3 = b3; nb4 = b4; nb6=b6; nb7=b7; nb8=b8; nb9=b9;
        nr1 = r1; nr2 = r2; nr3 = r3; nr4 = r4; nr6=r6; nr7=r7; nr8=r8; nr9=r9;
        nl1 = l1; nl2 = l2; nl3 = l3; nl4 = l4; nl6=l6; nl7=l7; nl8=l8; nl9=l9;
        nu1 = u1; nu2 = u2; nu3 = u3; nu4 = u4; nu6=u6; nu7=u7; nu8=u8; nu9=u9;
        nd1 = d1; nd2 = d2; nd3 = d3; nd4 = d4; nd6=d6; nd7=d7; nd8=d8; nd9=d9;

        u7 = nl9; u8 = nl6; u9 = nl3;
        r1 = nu7; r4 = nu8; r7 = nu9;
        d3 = nr1; d2 = nr4; d1 = nr7;
        l9 = nd3; l6 = nd2; l3 = nd1;
        f1 = nf7; f2 = nf4; f3 = nf1; f4 = nf8; f6 = nf2; f7 = nf9; f8 = nf6; f9 = nf3;
    }
    function _f2() {
        _f();
        _f();
    }
    function _fi() {
        _f();
        _f();
        _f();
    }
    function _b() {
        nf1 = f1; nf2 = f2; nf3 = f3; nf4 = f4; nf6=f6; nf7=f7; nf8=f8; nf9=f9;
        nb1 = b1; nb2 = b2; nb3 = b3; nb4 = b4; nb6=b6; nb7=b7; nb8=b8; nb9=b9;
        nr1 = r1; nr2 = r2; nr3 = r3; nr4 = r4; nr6=r6; nr7=r7; nr8=r8; nr9=r9;
        nl1 = l1; nl2 = l2; nl3 = l3; nl4 = l4; nl6=l6; nl7=l7; nl8=l8; nl9=l9;
        nu1 = u1; nu2 = u2; nu3 = u3; nu4 = u4; nu6=u6; nu7=u7; nu8=u8; nu9=u9;
        nd1 = d1; nd2 = d2; nd3 = d3; nd4 = d4; nd6=d6; nd7=d7; nd8=d8; nd9=d9;

        u1 = nr3; u2 = nr6; u3 = nr9;
        r3 = nd9; r6 = nd8; r9 = nd7;
        d9 = nl7; d8 = nl4; d7 = nl1;
        l1 = nu3; l4 = nu2; l7 = nu1;
        b1 = nb7; b2 = nb4; b3 = nb1; b4 = nb8; b6 = nb2; b7 = nb9; b8 = nb6; b9 = nb3;
    }
    function _b2() {
        _b();
        _b();
    }
    function _bi() {
        _b();
        _b();
        _b();
    }
    function _u() {
        nf1 = f1; nf2 = f2; nf3 = f3; nf4 = f4; nf6=f6; nf7=f7; nf8=f8; nf9=f9;
        nb1 = b1; nb2 = b2; nb3 = b3; nb4 = b4; nb6=b6; nb7=b7; nb8=b8; nb9=b9;
        nr1 = r1; nr2 = r2; nr3 = r3; nr4 = r4; nr6=r6; nr7=r7; nr8=r8; nr9=r9;
        nl1 = l1; nl2 = l2; nl3 = l3; nl4 = l4; nl6=l6; nl7=l7; nl8=l8; nl9=l9;
        nu1 = u1; nu2 = u2; nu3 = u3; nu4 = u4; nu6=u6; nu7=u7; nu8=u8; nu9=u9;
        nd1 = d1; nd2 = d2; nd3 = d3; nd4 = d4; nd6=d6; nd7=d7; nd8=d8; nd9=d9;

        l1 = nf1; l2 = nf2; l3 = f3;
        f1 = nr1; f2 = nr2; f3 = nr3;
        r1 = nb1; r2 = nb2; r3 = nb3;
        b1 = nl1; b2 = nl2; b3= nl3;
        u1 = nu7; u2 = nu4; u3 = nu1; u4 = nu8; u6 = nu2; u7 = nu9; u8 = nu6; u9 = nu3;
    }
    function _u2() {
        _u();
        _u();
    }
    function _ui() {
        _u();
        _u();
        _u();
    }
    function _d() {
        nf1 = f1; nf2 = f2; nf3 = f3; nf4 = f4; nf6=f6; nf7=f7; nf8=f8; nf9=f9;
        nb1 = b1; nb2 = b2; nb3 = b3; nb4 = b4; nb6=b6; nb7=b7; nb8=b8; nb9=b9;
        nr1 = r1; nr2 = r2; nr3 = r3; nr4 = r4; nr6=r6; nr7=r7; nr8=r8; nr9=r9;
        nl1 = l1; nl2 = l2; nl3 = l3; nl4 = l4; nl6=l6; nl7=l7; nl8=l8; nl9=l9;
        nu1 = u1; nu2 = u2; nu3 = u3; nu4 = u4; nu6=u6; nu7=u7; nu8=u8; nu9=u9;
        nd1 = d1; nd2 = d2; nd3 = d3; nd4 = d4; nd6=d6; nd7=d7; nd8=d8; nd9=d9;

        l7 = nb7; l8 = nb8; l9 = nb9;
        f7 = nl7; f8 = nl8; f9 = nl9;
        r7 = nf7; r8 = nf8; r9 = nf9;
        b7 = nr7; b8 = nr8; b9 = nr9;
        d1 = nd7; d2 = nd4; d3 = nd1; d4 = nd8; d6 = nd2; d7 = nd9; d8 = nd6; d9 = nd3;
    }
    function _d2() {
        _d();
        _d();
    }
    function _di() {
        _d();
        _d();
        _d();
    }
    function _x() {
        nf1 = f1; nf2 = f2; nf3 = f3; nf4 = f4; nf5 = f5; nf6=f6; nf7=f7; nf8=f8; nf9=f9;
        nb1 = b1; nb2 = b2; nb3 = b3; nb4 = b4; nb5 = b5; nb6=b6; nb7=b7; nb8=b8; nb9=b9;
        nr1 = r1; nr2 = r2; nr3 = r3; nr4 = r4; nr5 = r5; nr6=r6; nr7=r7; nr8=r8; nr9=r9;
        nl1 = l1; nl2 = l2; nl3 = l3; nl4 = l4; nl5 = l5; nl6=l6; nl7=l7; nl8=l8; nl9=l9;
        nu1 = u1; nu2 = u2; nu3 = u3; nu4 = u4; nu5 = u5; nu6=u6; nu7=u7; nu8=u8; nu9=u9;
        nd1 = d1; nd2 = d2; nd3 = d3; nd4 = d4; nd5 = d5; nd6=d6; nd7=d7; nd8=d8; nd9=d9;

        u1 = nf1; u2 = nf2; u3 = nf3; u4 = nf4; u5 = nf5; u6 = nf6; u7 = nf7; u8 = nf8; u9 = nf9;
        d1 = nb9; d2 = nb8; d3 = nb7; d4 = nb6; d5 = nb5; d6 = nb4; d7 = nb3; d8 = nb2; d9 = nb1;
        f1 = nd1; f2 = nd2; f3 = nd3; f4 = nd4; f5 = nd5; f6 = nd6; f7 = nd7; f8 = nd8; f9 = nd9;
        b1 = nu9; b2 = nu8; b3 = nu7; b4 = nu6; b5 = nu5; b6 = nu4; b7 = nu3; b8 = nu2; b9 = nu1;
        r1 = nr7; r2 = nr4; r3 = nr1; r4 = nr8; r6 = nr2; r7 = nr9; r8 = nr6; r9 = nr3;
        l1 = nl3; l2 = nl6; l3 = nl9; l4 = nl2; l6 = nl8; l7 = nl1; l8 = nl4; l9 = nl7;
    }
    function _x2() {
        _x();
        _x();
    }
    function _xi() {
        _x();
        _x();
        _x();
    }
    function _y() {
        nf1 = f1; nf2 = f2; nf3 = f3; nf4 = f4; nf5 = f5; nf6=f6; nf7=f7; nf8=f8; nf9=f9;
        nb1 = b1; nb2 = b2; nb3 = b3; nb4 = b4; nb5 = b5; nb6=b6; nb7=b7; nb8=b8; nb9=b9;
        nr1 = r1; nr2 = r2; nr3 = r3; nr4 = r4; nr5 = r5; nr6=r6; nr7=r7; nr8=r8; nr9=r9;
        nl1 = l1; nl2 = l2; nl3 = l3; nl4 = l4; nl5 = l5; nl6=l6; nl7=l7; nl8=l8; nl9=l9;
        nu1 = u1; nu2 = u2; nu3 = u3; nu4 = u4; nu5 = u5; nu6=u6; nu7=u7; nu8=u8; nu9=u9;
        nd1 = d1; nd2 = d2; nd3 = d3; nd4 = d4; nd5 = d5; nd6=d6; nd7=d7; nd8=d8; nd9=d9;

        u1 = nu7; u2 = nu4; u3 = nu1; u4 = nu8; u6 = nu2; u7 = nu9; u8 = nu6; u9 = nu3;
        d1 = nd3; d2 = nd6; d3 = nd9; d4 = nd2; d6 = nd8; d7 = nd1; d8 = nd4; d9 = nd7;
        l1 = nf1; l2 = nf2; l3 = nf3; l4 = nf4; l5 = nf5; l6 = nf6; l7 = nf7; l8 = nf8; l9 = nf9;
        f1 = nr1; f2 = nr2; f3 = nr3; f4 = nr4; f5 = nr5; f6 = nr6; f7 = nr7; f8 = nr8; f9 = nr9;
        r1 = nb1; r2 = nb2; r3 = nb3; r4 = nb4; r5 = nb5; r6 = nb6; r7 = nb7; r8 = nb8; r9 = nb9;
        b1 = nl1; b2 = nl2; b3 = nl3; b4 = nl4; b5 = nl5; b6 = nl6; b7 = nl7; b8 = nl8; b9 = nl9;
    }
    function _y2() {
        _y();
        _y();
    }
    function _yi() {
        _y();
        _y();
        _y();
    }
    function _z() {
        nf1 = f1; nf2 = f2; nf3 = f3; nf4 = f4; nf5 = f5; nf6=f6; nf7=f7; nf8=f8; nf9=f9;
        nb1 = b1; nb2 = b2; nb3 = b3; nb4 = b4; nb5 = b5; nb6=b6; nb7=b7; nb8=b8; nb9=b9;
        nr1 = r1; nr2 = r2; nr3 = r3; nr4 = r4; nr5 = r5; nr6=r6; nr7=r7; nr8=r8; nr9=r9;
        nl1 = l1; nl2 = l2; nl3 = l3; nl4 = l4; nl5 = l5; nl6=l6; nl7=l7; nl8=l8; nl9=l9;
        nu1 = u1; nu2 = u2; nu3 = u3; nu4 = u4; nu5 = u5; nu6=u6; nu7=u7; nu8=u8; nu9=u9;
        nd1 = d1; nd2 = d2; nd3 = d3; nd4 = d4; nd5 = d5; nd6=d6; nd7=d7; nd8=d8; nd9=d9;

        u1 = nl7; u2 = nl4; u3 = nl1; u4 = nl8; u5 = nl5; u6 = nl2; u7 = nl9; u8 = nl6; u9 = nl3;
        d1 = nr7; d2 = nr4; d3 = nr1; d4 = nr8; d5 = nr5; d6 = nr2; d7 = nr9; d8 = nr6; d9 = nr3;
        r1 = nu7; r2 = nu4; r3 = nu1; r4 = nu8; r5 = nu5; r6 = nu2; r7 = nu9; r8 = nu6; r9 = nu3;
        l1 = nd7; l2 = nd4; l3 = nd1; l4 = nd8; l5 = nd5; l6 = nd2; l7 = nd9; l8 = nd6; l9 = nd3;
        f1 = nf7; f2 = nf4; f3 = nf1; f4 = nf8; f6 = nf2; f7 = nf9; f8 = nf6; f9 = nf3;
        b1 = nb3; b2 = nb6; b3 = nb9; b4 = nb2; b6 = nb8; b7 = nb1; b8 = nb4; b9 = nb7;
    }
    function _z2() {
        _z();
        _z();
    }
    function _zi() {
        _z();
        _z();
        _z();
    }
    function _m() {
        _xi();
        _r();
        _li();
    }
    function _m2() {
        _m();
        _m();
    }
    function _mi() {
        _m();
        _m();
        _m();
    }
    function _s() {
        _z();
        _fi();
        _b();
    }
    function _s2() {
        _s();
        _s();
    }
    function _si() {
        _s();
        _s();
        _s();
    }
    function _e() {
        _yi();
        _u();
        _di();
    }
    function _e2() {
        _e();
        _e();
    }
    function _ei() {
        _e();
        _e();
        _e();
    }
    function _uw() {
        _u();
        _ei();
    }
    function _uw2() {
        _u2();
        _e2();
    }
    function _uwi() {
        _ui();
        _e();
    }
    function _dw() {
        _d();
        _e();
    }
    function _dw2() {
        _d2();
        _e2();
    }
    function _dwi() {
        _di();
        _ei();
    }
    function _fw() {
        _f();
        _s();
    }
    function _fw2() {
        _f2();
        _s2();
    }
    function _fwi() {
        _fi();
        _si();
    }
    function _bw() {
        _b();
        _si();
    }
    function _bw2() {
        _b2();
        _s2();
    }
    function _bwi() {
        _bi();
        _s();
    }
    function _rw() {
        _r();
        _mi();
    }
    function _rw2() {
        _r2();
        _m2();
    }
    function _rwi() {
        _ri();
        _m();
    }
    function _lw() {
        _l();
        _m();
    }
    function _lw2() {
        _l2();
        _m2();
    }
    function _lwi() {
        _li();
        _mi();
    }
}

const plls = [
    "R2 F2 R' B' R F2 R' B R'",
    "R B' R F2 R' B R F2 R2",
    "L U' R D2 R' U L' R U' L D2 L' U R'",
    "F2 L2 B' F2 U B' R2 F D' B R2 B F'",
    "F' U' F R2 D B' U B U' B D' R2",
    "R2 D B' U B' U' B D' R2 F' U F",
    "F U F' L2 D' B U' B' U B' D L2",
    "L2 D' B U' B U B' D L2 F U' F'",
    "L2 B2 F2 R2 D L2 B2 F2 R2",
    "B2 L U L' B2 R D' R D R2",
    "B2 R' U' R B2 L' D L' D' L2",
    "R2 F2 U2 F2 U F2 R2 U2 R2 U F2 U2 R2",
    "L2 F2 U2 F2 U' F2 L2 U2 L2 U' F2 U2 L2",
    "R' U2 R U2 R' F R U R' U' R' F' R2",
    "L U2 L' U2 L F' L' U' L U L F L2",
    "R2 D B2 U' B2 R2 D' F2 U F2",
    "R2 U B' F R2 B F' U R2",
    "R2 U' B' F R2 B F' U' R2",
    "R D2 F2 D R' D' F2 U2 L' U' L D2 U' R'",
    "F2 U' F2 U' F2 U2 L' B' L F2 L' B L",
    "B2 F2 U' L2 R2 D L R' D2 U2 L R'",
  ];
  
  const olls = [
    "B R' U2 R B2 L' B2 L U2 B'",
    "B' R2 U' F U R U' F' R U B",
    "F R' F' U' F U R U' F'",
    "R L' B' L U2 L' B' R B' L R2",
    "F' L F L' U2 F2 R' F' R F'",
    "B L2 F' L' F L' B'",
    "F' L' B L' B' L2 F",
    "B F' L B' U2 B L F' L B' F2",
    "R U' R2 D' L F' L' D R2 U R'",
    "L' B2 R B R' B L",
    "R B' R' B U2 R2 F R F' R",
    "L F L' B' L U F' U' L' B",
    "L' U' B' U B L",
    "B' R' B L' B' R B L",
    "R' U' R F' B2 D L D' F B2",
    "L B D2 R2 U2 F R2 D2 L",
    "L' B' U R' U' R B L",
    "R B U B' R' B F2 D' L' D B' F2",
    "L' U' L U' L' U2 L",
    "R B L' B L B' U B' U' R'",
    "R' U' F' U F U' F' U F R",
    "B U L U' L' B'",
    "F' U' F U F R' F' R",
    "B U B' U B U' B' U B U2 B'",
    "R B U' L U L' U B' U' R'",
    "B U' F' U B' U' F",
    "B R U R' B' F D R' D' F'",
    "L' U' L B L' B' U B L B'",
    "B' R' U2 F R' F' R2 B L U2 L'",
    "L' B' L F' L' B2 L' B' L2 F",
    "R B L' B L B2 R'",
    "B' R B U2 L' B' R B' R2 B2 L",
    "L' B' U' B U B' U' B U L",
    "B F' U L U' L' B' U' F",
    "L' B L2 B' U2 B' U2 B L'",
    "B2 D' B U2 B' D B U2 B",
    "L' B L F' L' B' L F",
    "B L U L' U' L U L' U' B'",
    "R B L' B L' D L D' L B2 R'",
    "B U B' U' L' B' R B R' L",
    "B R' U2 R U2 R B2 R' B",
    "B' R U R2 U R2 U2 R' U B",
    "B' R B U B' R' B R U' R'",
    "B' R B U B' U' R' U B",
    "B L F L' B2 L U F' U' L' B",
    "R' F' U' F U R",
    "R U B U2 B' U' B U B' R'",
    "R U2 R2 U' R2 U' R2 U2 R",
    "B L B' F U F' U' B L' B'",
    "R B U B2 R B R2 U R U2 R'",
    "R D' R2 U F' U2 F U' R2 D R'",
    "L' B' R' U2 R U' B L F U2 F'",
    "R B U B2 U' R' U R B R'",
    "R U2 R2 F R F' R U2 R'",
    "L' U' B2 D' B U B' D B2 L",
    "L' B L B' U' B' U B",
    "R L' U' B' U B L U R'",
  ];

/* const plls = [
    "R U' R U R U R U' R' U' R2", "R2 U R U R' U' R' U' R' U R'", "M2 U M2 U M' U2 M2 U2 M'", "M2 U M2 U2 M2 U M2",
    "x' R U' R' D R U R' D' R U R' D R U' R' D' x", "R' U R' U' y R' F' R2 U' R' U R' F R F", "F R U' R' U' R U R' F' R U R' U' R' F R F'", "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'", "R' U R U' R' F' U' F R U R' F R' F' R U' R",
    "x R' U R' D2 R U' R' D2 R2 x'", "x R2 D2 R U R' D2 R U' R x'", "L U2 L' U2 L F' L' U' L U L F L2", "R' U2 R U2 R' F R U R' U' R' F' R2", "L' U' L F L' U' L U L F' L2 U L", "R U R' F' R U R' U' R' F R2 U' R'", "R U R' U' R' F R2 U' R' U' R U R' F'", "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R", "R2 Uw R' U R' U' R Uw' R2 y' R' U R", "R' U' R y R2 Uw R' U R U' R Uw' R2", "R2 Uw' R U' R U R' Uw R2 y R U' R'", "R U R' y' R2 Uw' R U' R' U R' Uw R2",
];

const olls = [
    "R U2 R2' F R F' U2 R' F R F'", "F R U R' U' F' Fw R U R' U' Fw'", "Fw R U R' U' Fw' U' F R U R' U' F'", "Fw R U R' U' Fw' U F R U R' U' F'",
    "Rw' U2 R U R' U Rw", "Rw U2 R' U' R U' Rw'", "Rw U R' U R U2 Rw'", "Rw' U' R U' R' U2 Rw", "R U R' U' R' F R2 U R' U' F'", "R U R' U R' F R F' R U2 R'",
    "Rw' R2 U R' U R U2 R' U M'", "F R U R' U' F' U F R U R' U' F'", "Rw U' Rw' U' Rw U Rw' F' U F", "R' F R U R' F' R F U' F'", "Lw' U' Lw L' U' L U Lw' U Lw",
    "Rw U Rw' R U R' U' Rw U' Rw'", "R U R' U R' F R F' U2 R' F R F'", "Rw U R' U R U2 Rw2 U' R U' R' U2 Rw", "M U R U R' U' M' R' F R F'", "M U R U R' U' M2 U R U' Rw'",
    "R U2 R' U' R U R' U' R U' R'", "R U2 R2 U' R2 U' R2 U2 R", "R2 D R' U2 R D' R' U2 R'", "Rw U R' U' Rw' F R F'", "F' Rw U R' U' Rw' F R", "R U2 R' U' R U' R'",
    "R U R' U R U2 R'", "Rw U R' U' M U R U' R'", "M U R U R' U' R' F R F' M'", "Rw' D' Rw U' Rw' D Rw2 U' Rw' U Rw U Rw'", "R' U' F U R U' R' F' R",
    "S R U R' U' R' F R Fw'", "R U R' U' R' F R F'", "R U R' U' B' R' F R F' B", "R U2 R2' F R F' R U2 R'", "L' U' L U' L' U L U L F' L' F", "F R U' R' U' R U R' F'",
    "R U R' U R U' R' U' R' F R F'", "L F' L' U' L U F U' L'", "R' F R U R' U' F' U R", "R U R' U R U2' R' F R U R' U' F'", "R' U' R U' R' U2 R F R U R' U' F'",
    "Fw' L' U' L U Fw", "Fw R U R' U' Fw'", "F R U R' U' F'", "R' U' R' F R F' U R", "F' L' U' L U L' U' L U F", "F R U R' U' R U R' U' F'", "Rw U' Rw2 U Rw2 U Rw2 U' Rw",
    "Rw' U Rw2 U' Rw2' U' Rw2 U Rw'", "Fw R U R' U' R U R' U' Fw'", "R U R' U R Dw' R U' R' F'", "Rw' U' R U' R' U R U' R' U2 Rw", "Rw U R' U R U' R' U R U2 Rw'",
    "R U2 R2 U' R U' R' U2 F R F'", "Rw U Rw' U R U' R' U R U' R' Rw U' Rw'", "R U R' U' M' U R U' Rw'"
] */

const zbllsT = [
    "U' R U R' U R U2 R' U2 R' U' R U' R' U2 R", "R' U R U2 R' U' R U' R U R' U' R' U' R U R U' R'", "U2 R' U2 R U R' U R2 U2 R' U' R U' R'", "R U2 R' U' R U' R2 U2 R U R' U R", "R' U R U2 R' U' R U2 R' U' R U' R' U R", "U2 R U' R' U2 R U R' U2 R U R' U R U' R'", "R' U R2 U R' U R' U' R U' R' U' R U R U' R'", "U' R U R' U R U' R' U R' U' R2 U' R2 U2 R", "U2 R' U2 R U R' U R U' R' U' R U' R' U2 R", "R U2 R' U' R U' R' U R U R'U R U2 R'", "U' R' U' R2 U R2 U R2 U2 R' U R' U R ", "U' R U R2 U' R2 U' R2 U2 R U' R U' R'",
    "U R U R' U R U R2 D' Rw U2 Rw' D R2 U R'", "U R' U' R U' R' U' R2 D Rw' U2 Rw D' R2 U' R", "U2 R U' R2 D' Rw U2 Rw' D R2 U R'", "R' U R2 D Rw' U2 Rw D' R2 U' R", "R' U' R U2 R D R' U' R D' R2 U R U' R' U R", "U' R U2 R' U' R U Rw' F Rw U2 R' Rw' F Rw", "R' U' R U R2 D' R U2 R' D R2 U2 R' U2 R", "U R U R' U' R U R2 D' R U' R' D R U2 R U' R'", "U R' D' R U' R' D R U' R U' R' U R U' R' U' R U R'", "R U' R' U R U R' U' R U R' U R' D' R U R' D R", "U R U R D R' U R D' R' U L' U R' U' L ", "U2 R2 F R U R' U' R' F' R' U' R2 U2 R U2 R",
    "R' U R U2 L' R' U R U' L ", "R' U2 R U R2 F R U R U' R' F' R", "U2 R' U' R2 U R' F' R U R' U' R' F R2 U' R' U' R' U R", "U2 Rw U' Rw U2 R' F R U2 Rw2 F", "U' R' U' R' D' R U R' D R U2 R U R' U R", "R' U' R y R U R' U' R Lw U' R' U Lw'", "U L' U2 R U2 R' U2 L U R U R' U' R U' R'", "F U' R' U2 R U F' R' U' R U R' U R", "U2 R' U' R U' R' U R F U' R' U2 R U F'", "R U R' U R U' R' U' L' U2 R U2 R' U2 L", "R' U2 R U R' U R F U R U2 R' U R U R' F'", "Rw' U' Lw' U2 R U' R' U2 Lw R U' R' U2 Rw",
    "U' Lw' U2 R' D2 R U2 R' D2 R2 x'", "R' U2 R U' R' F R U R' U' R' F' R U' R", "R' U2 R' D' R U2 R' D R' U R' U R U2 R'", "U2 R U2 R D R' U2 R D' R U' R U' R' U2 R", "R' D' R U R' D R U2 R U2 R' U R U R'", "U R' U' R' D' R U R' D R U' R U' R' U2 R", "R' U R2 D R' U R D' R' U R' U' R U' R' U' R ", "U2 R U' R2 D' R U' R' D R U' R U R' U R U R'", "U R' U' R U' F U' R' U R U F' R' U R", "R' D' R U R' D R2 U R' U2 R U' R' U' R U' R'", "U2 F R U R' U' R U' R' U' R U R' F'", "U' R U R' U2 R U' R' U2 R U' R2 F' R U R U' R' F",
    "R U R D R' U' R D' R2", "U' R U2 R' U2 R' F R U R U' R' F'", "U2 R2 B2 R' U2 R' U2 R B2 R' U R U' R'", "U' R' D' R U R' D R2 U' R' U R U R' U' R U R'", "U' F' U' Rw' F2 Rw U' Rw' F' Rw F ", "U' R U R' U' R U' R' L U' R U R' L'", "U R U R' U R U R' U2 L R U' R' U L'", "R' U' R U' R2' F' R U R U' R' F U R U' R' U2 R", "U R' U' R U R' U' R2 D R' U2 R D' R' U R' U R", "U2 R U R D R' U2 R D' R' U' R' U R U' R' U' R U' R'", "U2 F R U R' U' R' F' U2 R U R U' R2 U2 R", "U' R U' R' U' R U R D R' U2 R D' R' U' R'",
    "x' U' R' D R U R' D' R x", "U R U R' U' R' F' R U2 R U2 R' F", "R2 F2 R U2 R U2 R' F2 R U' R' U R", "U' R D R' U' R D' R2 U R U' R' U' R U R' U' R", "U F U R U2 R' U R U R' F'", "R U R' U' R U' R'  U' F R U R' U' R' F' R", "U R' U' R U' R' U' R U2 L' R' U R U' L", "U F R U R' U' R U R' U' F' R U R' U' R' F R F'", "U R U R' U' R U R2 D' R U2 R' D R U' R U' R'", "R' U2 R F U' R' U R U F' R' U R", "U R' U2 R2 U R' U' R' U2 F' R U2 R U2 R' F", "U' R' U R U R' U' R' D' R U2 R' D R U R",
];
const zbllsU = [
    "U R U2 R' U' R U' R' U2 R' U2 R U R' U R", "R U R' U' R U' R U2 R2 U' R U R' U' R2 U' R2", "R' U' R U' R' U2 R2 U R' U R U2 R'", "U2 R U R' U R U2 R2 U' R U' R' U2 R", "U' R U R' U' R U' R' U2 R U' R' U2 R U R'", "U' R' U' R U R' U R U2 R' U R U2 R' U' R", "U R U2 R2 U' R2 U' R' U R' U' R U R' U R", "U R' U2 R2 U R2 U R U' R U R' U' R U' R'", "U R' U2 R U R' U R U R' U' R U' R' U2 R", "U R U2 R' U' R U' R' U' R U R' U R U2 R'", "R' U' R U' R U2 R2 U' R2 U' R2 U R", "U2 R U R' U R' U2 R2 U R2 U R2 U' R'",
    "U2 R' U' R U' F U' R' U R U R' U R U' F'", "R U R' U L' U R U' M' x' U' R U' R'", "U' R U2 R2 F R F' M' U' R U' R' U M", "U' R' U2 R F U' R' U R U R' U R U' F'", "U2  R2 D R' U' R D' R' U' R' U R U R'", "R2 D' R U R' D R U R U' R' U' R", "R U' R' U' R U R D R' U R D' R2", "U2 R' U R U R' U' R' D' R U' R' D R2", "M U' M' F R U R' U' F' M U M'", "U' F R U R' U' R U R' U' F' U' R' F' U' F U R", "F R U' R' U' R U2 R' U' R U' R' U' R U2 R' U' F'", "U Rw' U' R' F R U Rw F R U' R' F'",
    "R' F R U' R' U' R U R' F' R U R' U' R' F R F' R", "U' F2 R U' R' U' R U R' F' R U R' U' R' F R F2", "R U' R' U R U' L U Rw' F U2 R U2 R2 x", "U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R' U2 R", "U R U' L U L' U R' U' Lw U2 R U2 R2 x", "U R' U L' U' L U' R U Lw' U2 R' U2 R2 x'", "F R U R U2 R' U' R U' R' U2 R' U2 R U' R' U' F'", "U' Rw U R' U' Rw' F R2 U' R' U' R U2 R' U' F'", "U F U R U2 R' U R U R2 F' Rw U R U' Rw'", "U' R U2 R' U2 R' F R U R U2 R' U' R U2 R' U' F'", "U' R' U' R F R2 D' R U R' D R2 U' F'", "U' Rw U R' U' Rw' F R U R' U' R F' R' U R",
    "x R2 U2 R' D2 R U2 R' D2 R' x'", "U2 x R2 D2 R U2 R' D2 R U2 Lw", "R U R' U R U' R' U2 R' D' R U2 R' D R2 U' R'", "U' R' U2 R U R' U R' D R' U2 R D' R' U2 R'", "U' R U' R' U' R U' R' U R' D' R U R' D R2 U R'", "U' R' U R U R' U R U' R D R' U' R D' R2 U' R", "R' U2 R U R' U R' D' R U' R' D R U R", "R U' R' U' R U2 R' U2 R' D' R U' R' D R", "R' U' R U2 R' F' R U R' U' R' F R2 U2 R' U R", "U2 R U R' U R U R' U2 R U' R2 D' R U' R' D R", "F R U' R' U R U R' U R U' R' F'", "U F' R U R' U' R' F R2 U R' U2 R U R' U2 R U' R'",
    "R2 D' Rw U2 Rw' D R U2 R", "R2 D' R U2 R' D R U2 R", "R U' R' D R' U' R D' R2 U R' U' R' U2 R'", "U2 R U R' U R U2 R2 U z U R' D R U' z'", "U R2 D' R U' R' D R2 U' R' U2 R", "U' R' U R U R' U2 R U2 y R U' R' U2 R U' R'", "U' R2 D R' U R D' R2 U' R U' R' U2 R U' R' U2 R U R'", "U R U L' U R' U' L U' R U R' U R U' R'", "U' R' U2 R2 D R' U2 R D' R2 U R U2 R' U2 R", "U' R U R' U2 F2 R U2 R' U2 R' F2 R2 U R'", "U' R' U2 R' D' R U2 R' D R U2 R U R' U R", "U' R' U R U' R' U' R U2 R D R' U' R D' R2 U' R",
    "R' U2 R U R2 F' R U R U' R' F R", "U2 R2 D R' U2 R D' R' U2 R'", "R' U' R U R U R' U' R' U F R U R U' R' F'", "R U' R' U' R U2 R' U' R' D' R U2 R' D R", "U R U R2 D' R U R' D R2 U2 R'", "U' R U' R' U' R U2 R' U2 y' R' U R U2 R' U R", "U R' U R' U' D' R U' R' U2 R U' R' D R U' R", "U R' U' L U' R U L' U R' U' R U' R' U R", "U' R' U' R U R' U R U2 F R' U R U' F' R' U2 R", "U R U R' U R U' R' U R U' R' U' L' U R U' R' L", "U' R U2 R D R' U2 R D' R' U2 R' U' R U' R'", "U' R U' R' U R U R' U2 R' D' R U R' D R2 U R'",
];
const zbllsL = [
    "R U2 R' U2 R' U' R U R U' R' U2 R' U2 R", "R U R' U R U' R' U R U' R' U R U2 R'", "U2 R U2 R' U' R U' R' U2 R U R' U R U2 R'", "U2 R U R' U R U2 R' U2 R U2 R' U' R U' R'", "R2 U R' U R' U' R U' R' U' R U R U' R2", "U' R2 U' R U' R U R' U R U R' U' R' U R2", "U R' U2 R U R' U R U' R U2 R' U' R U' R'", "U2 R U2 R' U' R U' R' U R' U2 R U R' U R", "U R2 U R' U' R' U R U R' U R U' R U' R2", "U2 R2 U' R U R U' R' U' R U' R' U R' U R2", "U2 R U R' U R U2 R' U R' U' R U' R' U2 R", "U R' U' R U' R' U2 R U' R U R' U R U2 R'",
    "F R U' R' U' R U R D R' U' R D' R' U2 R' U' F'", "U F R U R' U' R U' R' U2 R U2 R' U' F'", "L' U2 R U' R' U2 L R U' R'", "R' U' R U R' F' R U R' U' R' F R2", "F R U R' U' R' F R2 U' R' U' R U R' F2", "R' U' R U R' U' R' F R2 U' R' U' R U R' F' U R", "U Rw U2 R Rw2 F R' F' Rw2 U2 Rw'", "U2 Rw U2 Rw2 F R F' Rw2 R' U2 Rw'", "U2 F R U R' U' F' Rw U Rw' U R U' R' Rw U' Rw'", "U Rw U Rw' R U R' U' Rw U' Rw' F U R U' R' F'", "U R U2 R' U' L' U2 R U R' L U L' U L", "U R U R' U' R' U2 R' U D R' U' R U2 D' R",
    "U' F' Rw U R' U' Rw' F R", "R' U' R U R' F2 R U2 R' U2 R' F2 R2", "U' F' R U2 R' U2 R' F R U R U' R'", "U R' U R U' R' U R U R' U' R2 D R' U R D' R'", "F R U' R' U' R U2 R' U' F'", "U2 R' U' R U2 R' F' R U R' U' R' F R2 U R' U2 R", "R' F R U R U' R' F' U R U R' U R U' R'", "R' U R U2 R' L' U R U L U Rw' F Rw", "U F R' F' R U R U' R' F U R U' R' U R U' R' F'", "U' F' R U2 R' U2 R' F U2 R U R U' R2 U2 R", "U2 R U R' U R' D' R U2 R' D R2 U' R' U R U' R'", "U R' U' R' D' R U2 R' D R U R U' R' U' R",
    "U2 F R' F' Rw U R U' Rw'", "U' R U R' U' R B2 R' U2 R U2 R B2 R2", "U2 F R U R' U' R' F' R U2 R U2 R'", "U2 R U' R' U R U' R' U' R U R2 D' R U' R' D R", "U F' Rw' F Rw U Rw' F2 Rw U F", "U R U R' U R U R' U' R U R D R' U2 R D' R' U' R'", "U L R U' R' U R L' U R' U R U' R'", "U L U' R U R' L' U2 R U' R' U' R U' R'", "U R' U2 R U R' U' F' R U R' U' R' F R2 U R' U R", "U R' U2 R2 U R' U' R' U2 F R U R U' R' F'", "U R U R' U R U' R' U' L' U R U' M' x'", "U2 R U R D R' U2 R D' R' U' R' U R U R'",
    "U R' U2 R' D' R U2 R' D R2", "U R' U2 R' D' Rw U2 Rw' D R2", "U2 R D R' U2 R D' R' U' R' U2 R U' R' U' R", "U2 R U2 R U R U' R2 D R' U R D' R U R'", "U R U R' U2 R U R' U2 y' R' U2 R U' R' U' R", "R' U2 R U R2 D' R U R' D R2", "U R U R' U' R U' R' U L' U R U' L U' R'", "U R U' R' U2 R U R' U2 R U R' U R2 D R' U' R D' R2", "U R' U2 R U2 R' U' R2 D R' U2 R D' R2 U2 R", "U2 F' R U R' U' R' F R2 U' R' U' R U' R' U R U R'", "R U' R2 F2 R U2 R U2 R' F2 U2 R U' R'", "U R' U R2 D R' U R D' R' U2 R' U R U R' U' R",
    "U2 R U2 R D R' U2 R D' R2", "U R' F' R U R' U' R' F R2 U' R' U2 R", "U' L' U R U' L U R2 U2 R U R' U R", "U' F R U R' U' R' F' U' R U R U' R' U' R' U R", "U2 R' U' R U2 R' U' R y U2 R U2 R' U R U R'", "U' R U2 R' U' R2 D R' U' R D' R2", "U2 R' U' R U R' U R U' L U' R' U L' U R", "U2 R' U R' D' R U R' U2 R U R' D U R U' R", "U2 R U2 R' U2 R U R2 D' R U2 R' D R2 U2 R'", "U' R U R' U R U2 R D R' U2 R D' R' U2 R'", "U' R' U R2 B2 R' U2 R' U2 R B2 U2 R' U R", "U2 R U' R2 D' R U' R' D R U2 R U' R' U' R U R'",
];
const zbllsPi = [
    "R' U' R U R U2 R' U' R U' R2 U2 R", "R U R' U' R' U2 R U R' U R2 U2 R'", "U' R' U2 R U R' U R2 U R' U R U2 R'", "U R U2 R' U' R U' R2 U' R U' R' U2 R", "U' R U2 R' U2 R U' R' U2 R U' R' U2 R U R'", "U R' U2 R U2 R' U R U2 R' U R U2 R' U' R", "U2 R U' R' U2 R U R' U2 R U R' U2 R U2 R'", "U2 R' U R U2 R' U' R U2 R' U' R U2 R' U2 R", "R' U2 R2 U R2 U R2 U2 R'", "R U2 R2 U' R2 U' R2 U2 R", "R U R' U' R' U' R U R U R' U' R' U R U' R U' R'", "R U2 R' U' R U' R' U' R U2 R' U' R U' R'",
    "F R2 U' R U' R U' R' U2 R' U R2 F'", "U2 F R2 U' R U2 R U R' U R' U R2 F'", "F U R' U' R2 U' R2 U2 R U2 R U R' F'", "Rw' U' R U' R' U R U' R' U R' F R F' U Rw", "U R U2 R' U' F' R U2 R' U' R U' R' F R U' R'", "U R' U' R' D' R U R' D R U2 R' D' R U2 R' D R2", "U' R' U' R U R' U' R2 D R' U R D' R' U R' U2 R", "U R U R' U' R U R2 D' R U' R' D R U' R U2 R'", "U2 R U2 R' U R' D' R U R' D R2 U' R' U R U' R'", "U2 R' U2 R U' R D R' U' R D' R2 U R U' R' U R", "R2 D R' U' R D' R' U' R' U R U' R' U' R U' R'", "R2 D' R U R' D R U R U' R' U R U R' U R",
    "U' F U R U2 R' U R U R' F' R U2 R' U' R U' R'", "Rw U' Rw' U' Rw U Rw' U' Lw R U' R' U Lw'", "Rw' U Rw U Rw' U' Rw U R2 F R F' R", "Rw' U' R U' R' U2 Rw U' R U2 R' U2 R' F R F'", "R' U' R U R2 F' R U R U' R' F U' R U R' U R", "R U2 R D' R U' R' D R' U' R2 U2 R", "R' U' R U' R2 D' R U R' D R2 U' R' U2 R", "U2 L' U R U' L U' R' U' R U' R'", "R U' L' U R' U L U L' U L", "U R2 D' R U2 R' D R2 U R2 D' R U R' D R2", "U' R2 D R' U2 R D' R2 U' R2 D R' U' R D' R2", "U2 R U2 R' U' R U Rw' F2 Rw U2 R' U' Rw' F Rw",
    "U R U2 R2 U' R U' R' U2 F R U R U' R' F'", "U' R U R' U R U2 R2 F' Rw U R U' Rw' F", "U' Rw' F' Rw U' Rw' F2 Rw2 U R' U' Rw' F R F'", "F R U R' U' R' F' R U2 R' U' R2 U' R2 U2 R", "U R' U' R L U2 R' U2 R U2 L' U R' U2 R", "U' F U' R U' R' U R U R' U2 R U2 R' U F' U", "U R2 D' R U' R' D R U R' D' R U R' D R U R U' R' U' R", "R' U' F' R U R' U' R' F R2 U2' R' U2 R", "U' R U R' U R U' R' U' R' F' R U2 R U2' R' F", "U2 R' U' R' D' R U R' D R' U R' U R U2 R'", "U2 R U R D R' U' R D' R U' R U' R' U2 R", "U F U R U' R' U R U2 R' U' R U R' F'",
    "Rw' F' Rw U Rw U2 Rw' F2 U' R U R' U' R U' R'", "U2 R U2 R' U2 R' F R2 U' R' U2 R U2 R' U' F'", "R' F R U R' U' R' F' R2 U' R' U R U' R' U2 R", "R' L U2 R2 U R2 U R U L' U' R U2 R'", "Lw U2 Lw' U2 R' U2 R B2 U R' U R", "U' R U R' U F2 R U2 R' U2 R' F2 R", "U' R' U2 R U R' U R2 U' L' U R' U' L", "U R U R' U R U' R' U R U' R D R' U' R D' R2", "R U R' U' R' F R2 U R' U' R U R' U' F'", "U2 R' U' R U' R' U' R U' x' U L' U L U2 R U' R' U x", "R U2 R' U' R U R' U2 L' U R U' M' x'", "U' L R' U' R U L' U2 R' U R U' R' U2 R",
    "U' R U R' U R U' R' U F2 Rw U2 Rw' U' Rw' F Rw", "U F U R U2 R' U2 R U R2 F' R U2 R U2 R'", "R U' R' U' R U' R' U R U R' U R' F' R U R U' R' F", "R L' U2 R2 U' R2 U' R' U' L U R' U2 R", "R' F2 R U2 R U2 R' F2 U' R U' R'", "U R' U' R U' B2 R' U2 R U2 Lw U2 Lw'", "U R U2 R' U' R U' R2 U L U' R U L'", "U' R' U' R U' R' U R U' R' U R' D' R U R' D R2", "U F U R U' R' U R U' R2 F' R U R U' R'", "R U R' U R U2 R' U' R L' U R' U' L U2 R U2 R'", "R' U2 R U R' U' R U2 L U' R' U R L'", "U R L' U R' U' L U2 R U' R' U R U2 R'",
];
const zbllsH = [
    "R U2 R' U' R U' R' U' R' U' R U' R' U2 R", "R' U2 R U R' U R U R U R' U R U2 R'", "U R' U' R U' R' U R U' R' U2 R", "U' R U R' U R U' R' U R U2 R'", "R' U2 R U R' U' R U R' U R", "R U2 R' U' R U R' U' R U' R'", "U R U R' U R U' R' U R U' R' U R' U' R2 U' R' U R' U R", "U R U R' U R U2 R' U' R' U2 R U R' U R",
    "U x' U' R U' R' U R' F2 R U' R U R' U x", "F U R U' R' U R U' R' U R U' R' F'", "R U R' y' U R' U R U' R2 F R F' R", "R' U' R y U' R U' R' U R Lw U' R' U Lw'", "F R U R' U' R U R' U' F' U R' F' U' F U R", "R' U' R U' R' U2 R U R' U' R U R' F' R U R' U' R' F R2", "U L' U L U' L' U' L U R' U' R U L' U' L U2 R' U' R", "U R U' R' U R U R' U' L U L' U' R U R' U2 L U L'",
    "U2 R U R' U R U2 R' F R U' R' U' R U2 R' U' F'", "Lw U' R U R' Lw' U Rw U' Rw' U Rw U Rw'", "U2 R' F R' F' R2 U' Rw' U Rw U' Rw' U' Rw", "U R' U' R U' R' U' L U' R U L'", "U R U R' U R U L' U R' U' L", "U' R' U' R U' R U R2 U R2 U L' U R' U' L", "U' R U R' U R' U' R2 U' R2 U' L U' R U L'", "R U2 R2 U' R' D R' U' R D' R U2 R", "R U2 R' U' R2 D R' U R D' R2' U' R U' R'", "U2 R U R' U' L' U2 R U2 R' U L U' Rw' F2 Rw", "U' R2 D' R U' R' D R2 U' R2 D' R U2 R' D R2", "U' R2 D R' U R D' R2' U R2 D R' U2 R D' R2'",
    "U2 F R' F' Rw U R U' Rw2 F2 Rw U Rw' F Rw", "U R U R' U' R' F R U R U' R' F' R U R' U R U2 R'", "R' U2 R U' L U2 R' U2 R U2 L' R' U R", "R U2 R' U L' U2 R U2 R' U2 L R U' R'", "U' F U' R U2 R' U2 R U' R' U' R U R' U F'", "U' R' F R U R' U' F' R U' R' U R' F R F' U R", "U' R U2 R' U' R U' R D' R U' R' D R U R", "R U2 R2 F U' R2 U' R2 U F' U R", "U2 R' U2 R U2' R2 F' R U R U' R' F U R", "U' F B' R2 B R2 U' R2 U' R2 U R2 F'", "U2 F R U R' U' R' F' U2 R U R' U R2 U2 R'", "U F R U' R' U R U2 R' U' R U R' U' F'",
];
const zbllsS = [
    "U' R' U R2 U R' U R U2 R U2 R U R' U R2", "U' R' U2 R2 U R  U' R' U R U R2 U' R'", "R U R' U R U2 R'", "U' R' U2 R U R' U R", "R U R2 U' R2 U' R2 U2 R2 U2 R'", "U2 R' U' R U' R U R2 U R2 U2 R'", "U' R U R' U' R' U2 R U R U' R' U R' U R", "U' R' U' R U R U R' U' R' U R U R U' R'", "R U R' U R U' R' U R' U' R2 U' R' U R' U R", "R U R' U R U R U R U R U' R' U' R2", "U R U R' U R' U' R2 U' R' U R' U' R U R' U R", "R U R' U R U' R' U R' U' R' U R U' R' U' R2 U R",
    "F U' R' U R U F' R U R2 U R2 U2 R'", "U R' D' R U' R' D R U2 R U R' U2 R U R'", "R' U2 R U R' U' R F U' R' U' R U F'", "R' U R U2 R' U R U2 R D R' U' R D' R'", "L' U2 R U' R' U2 L U R U' R' U R U2 R'", "U F R U R' U' R U R2 U' F' U R U R U' R'", "U2 R U R' F' R U R' U R U2 R' F R U' R'", "U R U2 L' R' U2 R U2 R' U2 L U' R U' R'", "U' R U' R2 U2 D' R U R' U D R2 U R'", "U F U R' F R F' R U' R' U R U' R' F'", "R U R' U' L' U R U' L U' L' U R' U' L", "U2 Rw' F2 R F' Rw U' R' U Rw' F Rw U2 R U2 R'",
    "R U' L' U R' U' L", "U R' U2 R U R' U' R' D' R U2 R' D R2", "U' R' D U' R' U R U2 D' R2 U R' U' R'", "U R' U' R' U R2 D' U2 R U R' U' D R'", "R2 D R' U2 R D' R' U' R' U R U2 R'", "D' R U R' U R U' R' U' D R2 U' R U' R' U R' U R2", "R U R' U R U R' U' R U R D R' U' R D' R' U2 R'", "U' R' U2 R U R' U' R' D' R U' R' D R U R U' R' U' R", "U' R' U2 F' R U R' U' R' F R U2 R", "R2 U R U R' U' R' U' R' L' U R' U' L", "U R U2 R' U2 R' F R2 U R' U' R U R' U' F'", "R U R' U R U' R' U' R' F R2 U' R' U' R U R' F'",
    "R' D R2 D' R2 U R2 D R2 D' R2 U' R'", "U' R U R' U R U' R D R' U' R D' R2", "U2 R U' R' U' R U' R' U2 R U R2 D' R U2 R' D R", "U F U R U' R' U R U' Lw U' R2 D' R U R' x", "U2 R2 D' R U' R' D R U' R U R' U R", "U R U2 R' L' U2 R U R' U2 L R U2 R'", "R' D' R U R' D R2 U' R' U R U R' U' R U2 R' U R U2 R'", "R U' R' U' R U R D R' U2 R D' R2 U R U2 R'", "U' R' U2 R' D' R U R' D R U' R U R' U R", "U R' U' R U' R2 F' R U R U' R' F U2 R", "U2 R U R' U R' D' R U R' D R U' R U2 R'", "U2 R U2 R' U' R U R' U' R U R D R' U2 R D' R2",
    "Fw R' F' R U2 R U2 R' U2 S'", "U R' D' R U R' D R2 U R' U2 R U R'", "R' D R' U R D' U R U' R' U' R2 U R U' R'", "U R' U2 R U R2 D' R U' R' D R U2 R", "U2 R2 D' Rw U2 Rw' D R2 U R' U R", "R' U2 R U R' U R' D' R U2 R' D R U2 R", "R L' U R' U' L U2 R U2 R'", "U2 R2 D' R U2 R' D R2 U R' U R", "R2 F R U R U' R' F' R U' R' U R", "U R U R' U R' U' R' D' R U R' D R' U2 R'", "U' R' U' F U' R2 U R2 U F' R U' R U' R'", "U' R' U' R' D' R U' R' D R' U R2 U R U' R U' R'",
    "U2 R U R' U' R U R2 D' R U2 R' D R2 U2 R'", "R U R' U R U' R2 F' R U R U' R' F R U' R'", "U2 R U R' U R2 D Rw' U2 Rw D' R2", "R' U R U2 R' U R2 D R' U R D' R'", "U' R' U' R U R2 U' R' U' R U D' R U R' D R'", "U2 R U R' U R2 D R' U2 R D' R2", "U2 R' U2 R U2 L U' R' U L' R", "R U2 R D R' U2 R D' R' U R' U R U2 R'", "R U R2 F' R U2 R U2 R' F R U' R'", "U R U R' U' R U R2 D' R U R' D R U R U2 R'", "F' R U R' U R U2 R' F U R U' R' U2 R U' R'", "U R' F R U R' U' R' F' D' R U R' D R2",
];
const zbllsAS = [
    "U R U' R2 U' R U' R' U2 R' U2 R' U' R U' R2", "U R U2 R2 U' R' U R U' R' U' R2 U R", "R' U' R U' R' U2 R", "U R U2 R' U' R U' R'", "R' U' R2 U R2 U R2 U2 R2 U2 R", "U2 R U R' U R' U' R2 U' R2 U2 R", "U R' U' R U R U2 R' U' R' U R U' R U' R'", "U R U R' U' R' U' R U R U' R' U' R' U R", "U R U R' U R' U' R U R' U' R2 U' R2 U R U' R' U R", "R' U' R U' R' U' R' U' R' U' R' U R U R2", "U R U R' U' R U R2 U' R2 U' R' U R U' R' U R' U R", "U2 R U R' U R' U' R' U R U' R' U' R' U' R' U2 R",
    "U' R U2 R2 U' R2 U' R' F U' R' U' R U F'", "U' R D R' U R D' R' U2 R' U' R U2 R' U' R", "U' R U2 R' U' R U R' L' U R U' L U2 R'", "R U' R' U2 R U' R' U2 R' D' R U R' D R", "U' F U' R' U R U F' R' U R U' R' U2 R", "U R U R' U L' U2 R U2 R' U2 R L U2 R'", "R U R' F' R U2 R' U' R U' R' F R U' R'", "R U  R' U' R' U' F U R2 U' R' U R U' R' F'", "U R' U R2 U2 D R' U' R U' D' R2 U' R", "R' U R U R' U Rw U' R' U R U Rw' R' F R F' U R", "z D' R' D R U R' D' R U' R U R' D R U' z'", "R U2 R' U' R U Rw' F Rw U2 R' U' Rw' F2 Rw",
    "R' U L U' R U L'", "U' R U2 R' U' R U R D R' U2 R D' R2", "U R D' U R U' R' U2 D R2 U' R U R", "U' R U R U' R2 D U2 R' U' R U D' R", "R2 D' R U2 R' D R U R U' R' U2 R", "D R' U' R U' R' U R U D' R2 U R' U R U' R U' R2", "R' U' R U' R' U' R U R' U' R' D' R U R' D R U2 R", "U R U2 R' U' R U R D  R' U R D' R' U' R' U R U R'", "U2 F U R U' R' U R U' R2 F' R U2 R U2 R'", "U2 F R U' R' U R U R2 F' R U R U R' U' R U' R'", "U2 R' U2 R' F' R U R U' R' F U2 R", "U2 L' U R U' L R U R U R U' R' U' R2",
    "R D' R2 D R2 U' R2 D' R2 D R2 U R", "U R' U' R U' R' U R' D' R U R' D R2", "Lw U' R' D R2 U Lw' U R' U' R U R' U' F'", "U' R' D' R U2 R' D R2 U' R' U2 R U R' U R U R'", "U2 R2 D R' U R D' R' U R' U' R U' R'", "U R U2 R' L' U2 R U' R' U2 L R U2 R'", "U' R U R' U' R' U' R U R U' R' U' R2 D' R U' R' D R U2 R", "U' R U2 R' U' R2 D R' U2 R D' R' U' R' U R U R'", "U R U2 R' U R' D' R U' R' D R U' R U' R'", "U' R2 D R' U2 R D' R' U' R' U R U' R' U  R U2 R'", "U2 R' U' R U' R D R' U' R D' R' U R' U2 R", "U2 R' U2 F' R U R' U' R' F R2 U R' U R",
    "U' R U2 R2 D' R U2 R' D R2 U' R' U R U' R'", "U' R D R' U' R D' R2 U' R U2 R' U' R", "R D' R U' R' D U' R' U R U R2 U' R' U R", "R U R' F' R U R' U' R' F R2 U R' U' R U' R'", "U2 R2 D Rw' U2 Rw D' R2 U' R U' R'", "R U2 R' U' R U' R D R' U2 R D' R' U2 R'", "L R' U' R U L' U2 R' U2 R", "U2 R2 D R' U2 R D' R2 U' R U' R'", "R U R' F' R U2 R' U2 R' F R2 U' R'", "U' R' U' R U' R U R D R' U' R D' R U2 R", "U R U R' U2 R U R' U' F' R U2 R' U' R U' R' F", "R2 D' R U' R' D F R U R U' R' F' R",
    "U' R U2 R' U' F' R U R' U' R' F R2 U' R'", "U' R' U2 R' D' R U R' D R2 U' R' U2 R", "U2 R' U' R U' R2 D' Rw U2 Rw' D R2", "R U' R' U2 R U' R2 D' R U' R' D R", "U R U R' U' R2 U R U R' U' D R' U' R D' R", "U2 R' U' R U' R2 D' R U2 R' D R2", "U2 R U2 R' U2 L' U R U' R' L", "R' U2 R' D' R U2 R' D R U' R U' R' U2 R", "R' U' R U R' F R U R' U' R' F' R2", "U R U2 R D' R U' R' D R U R U' R U' R'", "U R U R' U R' F U' R2 U' R2 U F' U R", "U' R U R' U R' U' R2 U' R D' R U R' D R U R",
];

function cleanAlg(alg) {
    const moveArr = ["R","L","F","B","U","D","Rw","Lw","Fw","Bw","Uw","Dw","x","y","z"];
    const moves = alg.split(" ");
    let newAlg = alg.replaceAll("Rw","r").replaceAll("Lw","l").replaceAll("Uw","u").replaceAll("Dw","d").replaceAll("Fw","f").replaceAll("Bw","b");
    

    for (let _move of moves) {
        for (let m of moveArr) {
            //Fjerne doble mellomrom
            newAlg = newAlg.replaceAll(" ",";").replaceAll(";;",";").replaceAll(";"," ");

            newAlg = newAlg.replaceAll((m + " " + m + "2"),(m + "'"));
            newAlg = newAlg.replaceAll((m + " " + m + "'"),(""));
            newAlg = newAlg.replaceAll((m + " " + m),(m + "2"));

            newAlg = newAlg.replaceAll((m + "2 " + m + "2"),(""));
            newAlg = newAlg.replaceAll((m + "2 " + m + "'"),(m));
            newAlg = newAlg.replaceAll((m + "2 " + m),(m + "'"));

            newAlg = newAlg.replaceAll((m + "' " + m + "2"),(m));
            newAlg = newAlg.replaceAll((m + "' " + m + "'"),(m + "2"));
            newAlg = newAlg.replaceAll((m + "' " + m),(""));
            
            //Fjerne doble mellomrom
            newAlg = newAlg.replaceAll(" ",";").replaceAll(";;",";").replaceAll(";"," ");
        }
    }

    return newAlg.replaceAll("r","Rw").replaceAll("l","Lw").replaceAll("u","Uw").replaceAll("d","Dw").replaceAll("f","Fw").replaceAll("b","Bw").trim();
}