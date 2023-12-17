let cube2x2 = "111166663333555544442222".split("");
let cleanCube2x2 = "111166663333555544442222".split("");
let moves = ["R", "R2", "R'", "U", "U2", "U'", "F", "F2", "F'"];

$(() => {
    drawScrambleNxN("#svgCube", 2, "");
});

function scrambleCube(scr) {
    doTurns(scr);
    drawScrambleNxN("#svgCube", 2, scr);
}

function resetCubeState() {
    cube2x2 = "111166663333555544442222".split("");
}

function solveCube() {
    let start = Date.now();
    let scramble = $("#inpScramble").val();
    let solution = "";
    outerloop : while (solution === "") {
        let state = editState(getNumberState(2, scramble));console.log(state);
        let ind = solutions2x2.findIndex(s => s.state === state);
        if (ind !== -1) {
            solution = cleanMoves(solutions2x2[ind].solution);
            console.log(solution);
            break outerloop;
        }
        let solLength = 1;
        let arr = moves.slice();
        while (ind === -1) {
            if (solLength === 1) {
                for (let m of arr) {
                    state = editState(getNumberState(2, scramble + " " + m));
                    ind = solutions2x2.findIndex(s => s.state === state);
                    if (ind !== -1) {
                        solution = cleanMoves(m + " " + solutions2x2[ind].solution);
                        console.log(solution);
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
                        state = editState(getNumberState(2, scramble + " " + m1 + " " + m2));
                        ind = solutions2x2.findIndex(s => s.state === state);
                        if (ind !== -1) {
                            solution = cleanMoves(m1 + " " + m2 + " " + solutions2x2[ind].solution);
                            console.log(solution);
                            break outerloop;
                        }
                    }
                }
                arr = tArr.slice();
            }
            solLength++;
        }
    }
    $("#solution").html("<h1><b>Solution:</b> " + solution + "</h1><h1><b>Moves:</b> " + solution.split(" ").length + "</h1><br>");
    $("#searchDepth").html("<h1>" + (Date.now() - start) + " ms</h1>");
}

function editState(state) {
    let d = state.split("")[22];
    let l = state.split("")[6];
    let b = state.split("")[19];
    let u = oppNum(d);
    let f = oppNum(b);
    let r = oppNum(l);
    
    return (
        state.replaceAll(u, "a").replaceAll(d, "b").replaceAll(f, "c").replaceAll(b, "d").replaceAll(r, "e").replaceAll(l, "f")
        .replaceAll("a", "1").replaceAll("b", "2").replaceAll("c", "3").replaceAll("d", "4").replaceAll("e", "5").replaceAll("f", "6")
    );
}

function oppNum(n) {
    switch (n) {
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

function cleanMoves(m) {
    while (m.includes("&nbsp;&nbsp;")) {
        m.replaceAll("&nbsp;&nbsp;", "&nbsp;");
    }

    return m.trim();
}

function moveR() {
    let tempCube = cube2x2.slice();

    //Right slice
    cube2x2[1] = tempCube[9];
    cube2x2[3] = tempCube[11];
    cube2x2[9] = tempCube[21];
    cube2x2[11] = tempCube[23];
    cube2x2[21] = tempCube[18];
    cube2x2[23] = tempCube[16];
    cube2x2[18] = tempCube[1];
    cube2x2[16] = tempCube[3];
    //Right side
    cube2x2[12] = tempCube[14];
    cube2x2[13] = tempCube[12];
    cube2x2[14] = tempCube[15];
    cube2x2[15] = tempCube[13];
}

function moveU() {
    let tempCube = cube2x2.slice();

    //Up slice
    cube2x2[4] = tempCube[8];
    cube2x2[5] = tempCube[9];
    cube2x2[8] = tempCube[12];
    cube2x2[9] = tempCube[13];
    cube2x2[12] = tempCube[16];
    cube2x2[13] = tempCube[17];
    cube2x2[16] = tempCube[4];
    cube2x2[17] = tempCube[5];
    //Up side
    cube2x2[0] = tempCube[2];
    cube2x2[1] = tempCube[0];
    cube2x2[2] = tempCube[3];
    cube2x2[3] = tempCube[1];
}

function moveF() {
    let tempCube = cube2x2.slice();

    //Front slice
    cube2x2[2] = tempCube[7];
    cube2x2[3] = tempCube[5];
    cube2x2[12] = tempCube[2];
    cube2x2[14] = tempCube[3];
    cube2x2[21] = tempCube[12];
    cube2x2[20] = tempCube[14];
    cube2x2[7] = tempCube[21];
    cube2x2[5] = tempCube[20];
    //Front side
    cube2x2[8] = tempCube[10];
    cube2x2[9] = tempCube[8];
    cube2x2[10] = tempCube[11];
    cube2x2[11] = tempCube[9];
}

function doTurns(turns) {
    for (let t of turns.trim().split(" ")) {
        switch (t) {
            case "R":
                moveR();
                break;
            case "R2":
                moveR();
                moveR();
                break;
            case "R'":
                moveR();
                moveR();
                moveR();
                break;
            case "U":
                moveU();
                break;
            case "U2":
                moveU();
                moveU();
                break;
            case "U'":
                moveU();
                moveU();
                moveU();
                break;
            case "F":
                moveF();
                break;
            case "F2":
                moveF();
                moveF();
                break;
            case "F'":
                moveF();
                moveF();
                moveF();
                break;
        }
    }
}

function isSolved() {
    return ((
        cube2x2[0] + cube2x2[3] + cube2x2[9] + cube2x2[6] +
        cube2x2[1] + cube2x2[11] + cube2x2[10] + cube2x2[8] +
        cube2x2[7] + cube2x2[5] + cube2x2[4] + cube2x2[2] +
        cube2x2[23] + cube2x2[13] + cube2x2[14] + cube2x2[16] +
        cube2x2[17] + cube2x2[19] + cube2x2[20] + cube2x2[22] +
        cube2x2[12] + cube2x2[15] + cube2x2[21] + cube2x2[18]
    ) === cleanCube2x2);
}

function getState2x2(mvs) {
    resetCubeState();
    doTurns(mvs);

    return cube2x2.join("");
}

function printNiceCube() {
    let niceCube = "&nbsp;&nbsp;" + cube2x2[0] + cube2x2[3] + "<br/>" +
                    "&nbsp;&nbsp;" + cube2x2[9] + cube2x2[6] + "<br/>" +
                    cube2x2[1] + cube2x2[11] + cube2x2[10] + cube2x2[8] + cube2x2[7] + cube2x2[5] + cube2x2[4] + cube2x2[2] + "<br/>" +
                    cube2x2[23] + cube2x2[13] + cube2x2[14] + cube2x2[16] + cube2x2[17] + cube2x2[19] + cube2x2[20] + cube2x2[22] + "<br/>" +
                    "&nbsp;&nbsp;" + cube2x2[12] + cube2x2[15] + "<br/>" +
                    "&nbsp;&nbsp;" + cube2x2[21] + cube2x2[18];

    $("#drawCube").html(niceCube);
}