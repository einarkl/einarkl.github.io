let affixes = [];
const kp = "Rw' U Rw' U' Rw2 R' U' Rw' U' R U2 Rw' U' Rw3 U2 Rw' U2 Rw'";
const moves4x4 = ["R", "R2", "R'", "U", "U2", "U'", "F", "F2", "F'", "D", "D2", "D'"];
let cleanState;
const colors = ["white", "#FFAA00", "#00FF00", "red", "blue", "yellow"];

onmessage = e => {
    let n = parseInt(e.data);
    cleanState = getNumberState(4, "");
    gen(n);
}

function gen(n) {

    genAffixes(n);
    let ops = genOPs();
}

function genAffixes(n) {
    let depth = 1;
    let arr = moves4x4.slice().filter(a => {return !a.includes("U") && !a.includes("D")});
    
    while (depth <= n) {
        if (depth === 1) {
            for (let m of arr) {
                affixes.push(m);
            }
        }
        else {
            let tArr = arr.slice();
            for (let m1 of arr) {
                let prevMove = m1.split(" ")[m1.split(" ").length - 1][0];
                let prevPrevMove = m1.split(" ")[m1.split(" ").length - 2] ? m1.split(" ")[m1.split(" ").length - 2][0] : "";
                for (let m2 of moves4x4.filter(m => {
                    if (m[0] === prevMove) {
                        return false;
                    }
                    if (prevMove === "D" && m[0] === "U") {
                        return false;
                    }
                    return true;
                })) {
                    tArr.push(m1 + " " + m2);
                    affixes.push(m1 + " " + m2);
                }
            }
            arr = tArr.slice();
        }
        depth++;
    }
}

function genOPs() {
    let ops = {};
    let num = 0;
    let maxN = affixes.length * affixes.filter(m => m.split(" ")[m.split(" ").length - 1].split("")[0] !== "U").length;
    postMessage(maxN.toString());
    for (let m1 of affixes) {
        for (let m2 of affixes.filter(m => m.split(" ")[m.split(" ").length - 1].split("")[0] !== "U")) {
            num++;
            postMessage(num);
            let alg = [m1, kp, m2].join(" ");
            let state = getNumberState(4, inverseAlg(alg));

            if (goodState(state)) {
                let uf = state[14];
                let ur = state[7];
                let ul = state[8];
                let ub = state[1];
                
                if (uf === "1" && ur !== "1") {
                    alg = "U' " + alg;
                }
                else if (ur === "1" && ub !== "1") {
                    alg = "U2 " + alg;
                }
                else if (ub === "1" && ul !== "1") {
                    alg = "U " + alg;
                }
                state = getNumberState(4, inverseAlg(alg));

                let states = [getNumberState(4, alg + " U"), getNumberState(4, alg + " U2"), getNumberState(4, alg + " U'")];
                let nState = getNewState(state);
                let dup = "";

                foundLoop : for (let s1 of states) {
                    for (let s2 of Object.keys(ops)) {
                        if (getNewState(s1) === s2) {
                            dup = s2;
                            break foundLoop;
                        }
                    }
                }
                
                if (dup === "") {
                    if (!ops[nState]) {
                        ops[nState] = [];
                    }
                    ops[nState].push(alg);
                }
                else {
                    ops[dup].push(alg);
                }
            }
        }
    }

    for (let k of Object.keys(ops)) {
        ops[k] = [...new Set(ops[k])];
    }
    ops = sortOps(ops);

    postMessage(ops);
}

function sortOps(ops) {
    let nOps = {};

    for (let k of Object.keys(ops)) {
        let arr = ops[k].sort((a, b) => {
            return getAlgScore(a) - getAlgScore(b);
        });
        nOps[k] = arr;
    }

    return nOps;
}

function getAlgScore(alg) {
    let sum = 0;

    for (let m of alg.split(" ")) {
        let p = 0;

        if (m.includes("R") || m.includes("U")) {
            p += 1;
        }
        else if (m.includes("F") || m.includes("D")) {
            p += 2;
        }
        if (m.includes("2")) {
            p *= 2;
        }

        sum += p;
    }

    return sum;
}

function goodState(state) {
    let u1 = cleanState.slice(0, 16);
    let l1 = cleanState.slice(20, 32);
    let f1 = cleanState.slice(36, 48);
    let r1 = cleanState.slice(52, 64);
    let b1 = cleanState.slice(68, 80);
    let d1 = cleanState.slice(80, 96);

    let u2 = state.slice(0, 16);
    let l2 = state.slice(20, 32);
    let f2 = state.slice(36, 48);
    let r2 = state.slice(52, 64);
    let b2 = state.slice(68, 80);
    let d2 = state.slice(80, 96);

    return l2 === l1 && f2 === f1 && r2 === r1 && b2 === b1 && d2 === d1;
}
/* 
function getNewState(state) {
    let u = state.slice(0, 16);
    let l = state.slice(16, 20);
    let f = state.slice(32, 36);
    let r = state.slice(48, 52);
    let b = state.slice(64, 68);

    return (u + l + f + r + b).replaceAll("2", "0").replaceAll("3", "0").replaceAll("4", "0").replaceAll("5", "0").replaceAll("6", "0");
} */

function getNewState(state) {
    /* 
    Codes:
    Number axyz 
    a = number of edges flipped, always 1 flipped UF and 1 non-flipped UL
    x,y,z = code for how UFL, UFR, UBR are flipped respectively. 0 = top color up, 1 = top color R/L, 2 = top color on F/B
    */
    let u = state.slice(0, 16);
    let l = state.slice(16, 20);
    let f = state.slice(32, 36);
    let r = state.slice(48, 52);
    let b = state.slice(64, 68);
    
    let uf = u[14];
    let ur = u[7];
    let ul = u[8];
    let ub = u[1];

    let ufl;
    let ufr;
    let ubr;

    let a = [ub, ul, ur, uf].filter(f => f !== "1").length;
    
    if (ul === "1" && uf !== "1") {
        ufl = [u[12], l[3], f[0]];
        ufr = [u[15], r[0], f[3]];
        ubr = [u[3], r[3], b[0]];
    }
    else if (uf === "1" && ur !== "1") {
        ufl = [u[15], f[3], r[0]];
        ufr = [u[3], b[0], r[3]];
        ubr = [u[0], b[3], l[0]];
    }
    else if (ur === "1" && ub !== "1") {
        ufl = [u[3], r[3], b[0]];
        ufr = [u[0], l[0], b[3]];
        ubr = [u[12], l[3], f[0]];
    }
    else if (ub === "1" && ul !== "1") {
        ufl = [u[0], b[3], l[0]];
        ufr = [u[12], f[0], l[3]];
        ubr = [u[15], f[3], r[0]];
    }

    let xyz = [ufl, ufr, ubr].map(c => c.indexOf("1")).join("");

    // return (u + l + f + r + b).replaceAll("2", "0").replaceAll("3", "0").replaceAll("4", "0").replaceAll("5", "0").replaceAll("6", "0");
    return a + xyz;
}

function getNumberState(n, scr) {
    let cube = [];

    for (let s = 0; s < 6; s++) {
        let side = [];
        for (let i = 0; i < n; i++) {
            let line = [];
            for (let j = 0; j < n; j++) {
                line.push(colors[s]);
            }
            side.push(line);
        }
        cube.push(side);
    }
    
    for (let s of scr.split(" ")) {
        if (!s.includes("w")) {
            s = "1" + s;
        }
        else if (s.split("")[1] === "w") {
            s = "2" + s;
        }
        s = s.replace("w", "").replace("'", "3");
        
        if (s.includes("R")) {
            let r = parseInt(s.split("R")[1]) || 1;
            move(cube, "R", parseInt(s.split("R")[0]), r);
        }
        else if (s.includes("L")) {
            let r = parseInt(s.split("L")[1]) || 1;
            move(cube, "L", parseInt(s.split("L")[0]), r);
        }
        else if (s.includes("U")) {
            let r = parseInt(s.split("U")[1]) || 1;
            move(cube, "U", parseInt(s.split("U")[0]), r);
        }
        else if (s.includes("D")) {
            let r = parseInt(s.split("D")[1]) || 1;
            move(cube, "D", parseInt(s.split("D")[0]), r);
        }
        else if (s.includes("F")) {
            let r = parseInt(s.split("F")[1]) || 1;
            move(cube, "F", parseInt(s.split("F")[0]), r);
        }
        else if (s.includes("B")) {
            let r = parseInt(s.split("B")[1]) || 1;
            move(cube, "B", parseInt(s.split("B")[0]), r);
        }
        else if (s.includes("x")) {
            let r = parseInt(s.split("x")[1]) || 1;
            move(cube, "x", parseInt(s.split("x")[0]), r);
        }
        else if (s.includes("y")) {
            let r = parseInt(s.split("y")[1]) || 1;
            move(cube, "y", parseInt(s.split("y")[0]), r);
        }
        else if (s.includes("z")) {
            let r = parseInt(s.split("z")[1]) || 1;
            move(cube, "z", parseInt(s.split("z")[0]), r);
        }
        else {
            let r = parseInt(s.split("")[2]) || 1;
            move(cube, s.split("")[1], 0, r);
        }
    }

    let cubeNumber = "";
    for (let f of cube) {
        for (let r of f) {
            for (let t of r) {
                cubeNumber += t.replace("white", "1").replace("yellow", "2").replace("#00FF00", "3").replace("blue", "4").replace("red", "5").replace("#FFAA00", "6");
            }
        }
    }
    
    return cubeNumber;
}

function move(cube, xyz, w, r) {
    let r1 = r;
    let r2 = 4 - r;

    if (xyz === "R") {
        /*  */
        rotateFace(cube, 4, 2);
        /*  */
        rotateFace(cube, 3, r1);
        if (w === cube[0].length) {
            rotateFace(cube, 1, r2);
        }
        for (let i = 0; i < r; i++) {
            for (let k = 0; k < cube[0].length; k++) {
                for (let j = cube[0].length - 1; j >= cube[0].length - w; j--) {
                    let temp = cube[0][k][j];
                    cube[0][k][j] = cube[2][k][j];
                    cube[2][k][j] = cube[5][k][j];
                    cube[5][k][j] = cube[4][k][j];
                    cube[4][k][j] = temp;
                }
            }
        }
        /*  */
        rotateFace(cube, 4, 2);
        /*  */
    }
    else if (xyz === "L") {
        /*  */
        rotateFace(cube, 4, 2);
        /*  */
        rotateFace(cube, 1, r1);
        if (w === cube[0].length) {
            rotateFace(cube, 3, r2);
        }
        for (let i = 0; i < r; i++) {
            for (let k = 0; k < cube[0].length; k++) {
                for (let j = 0; j < w; j++) {
                    let temp = cube[0][k][j];
                    cube[0][k][j] = cube[4][k][j];
                    cube[4][k][j] = cube[5][k][j];
                    cube[5][k][j] = cube[2][k][j];
                    cube[2][k][j] = temp;
                }
            }
        }
        /*  */
        rotateFace(cube, 4, 2);
        /*  */
    }
    else if (xyz === "U") {
        rotateFace(cube, 0, r1);
        if (w === cube[0].length) {
            rotateFace(cube, 5, r2);
        }
        for (let i = 0; i < r; i++) {
            for (let k = 0; k < w; k++) {
                for (let j = 0; j < cube[0].length; j++) {
                    let temp = cube[2][k][j];
                    cube[2][k][j] = cube[3][k][j];
                    cube[3][k][j] = cube[4][k][j];
                    cube[4][k][j] = cube[1][k][j];
                    cube[1][k][j] = temp;
                }
            }
        }
    }
    else if (xyz === "D") {
        rotateFace(cube, 5, r1);
        if (w === cube[0].length) {
            rotateFace(cube, 0, r2);
        }
        for (let i = 0; i < r; i++) {
            for (let k = cube[0].length - 1; k > cube[0].length - 1 - w; k--) {
                for (let j = 0; j < cube[0].length; j++) {
                    let temp = cube[2][k][j];
                    cube[2][k][j] = cube[1][k][j];
                    cube[1][k][j] = cube[4][k][j];
                    cube[4][k][j] = cube[3][k][j];
                    cube[3][k][j] = temp;
                }
            }
        }
    }
    else if (xyz === "F") {
        /*  */
        rotateFace(cube, 0, 3);
        rotateFace(cube, 5, 1);
        rotateFace(cube, 3, 2);
        /*  */
        rotateFace(cube, 2, r1);
        if (w === cube[0].length) {
            rotateFace(cube, 4, r2);
        }
        for (let i = 0; i < r; i++) {
            for (let k = 0; k < cube[0].length; k++) {
                for (let j = cube[0].length - 1; j >= cube[0].length - w; j--) {
                    let temp = cube[0][k][j];
                    cube[0][k][j] = cube[1][k][j];
                    cube[1][k][j] = cube[5][k][j];
                    cube[5][k][j] = cube[3][k][j];
                    cube[3][k][j] = temp;
                }
            }
        }
        /*  */
        rotateFace(cube, 0, 1);
        rotateFace(cube, 5, 3);
        rotateFace(cube, 3, 2);
        /*  */
    }
    else if (xyz === "B") {
        /*  */
        rotateFace(cube, 0, 3);
        rotateFace(cube, 5, 1);
        rotateFace(cube, 3, 2);
        /*  */
        rotateFace(cube, 4, r1);
        if (w === cube[0].length) {
            rotateFace(cube, 2, r2);
        }
        for (let i = 0; i < r; i++) {
            for (let k = 0; k < cube[0].length; k++) {
                for (let j = 0; j < w; j++) {
                    let temp = cube[0][k][j];
                    cube[0][k][j] = cube[3][k][j];
                    cube[3][k][j] = cube[5][k][j];
                    cube[5][k][j] = cube[1][k][j];
                    cube[1][k][j] = temp;
                }
            }
        }
        /*  */
        rotateFace(cube, 0, 1);
        rotateFace(cube, 5, 3);
        rotateFace(cube, 3, 2);
        /*  */
    }
    else if (xyz === "x") {
        /*  */
        rotateFace(cube, 4, 2);
        /*  */
        rotateFace(cube, 1, r2);
        rotateFace(cube, 3, r1);
        for (let i = 0; i < r; i++) {
            for (let k = 0; k < cube[0].length; k++) {
                for (let j = 0; j < cube[0].length; j++) {
                    let temp = cube[0][k][j];
                    cube[0][k][j] = cube[2][k][j];
                    cube[2][k][j] = cube[5][k][j];
                    cube[5][k][j] = cube[4][k][j];
                    cube[4][k][j] = temp;
                }
            }
        }
        /*  */
        rotateFace(cube, 4, 2);
        /*  */
    }
    else if (xyz === "y") {
        rotateFace(cube, 0, r1);
        rotateFace(cube, 5, r2);
        for (let i = 0; i < r; i++) {
            for (let k = 0; k < cube[0].length; k++) {
                for (let j = 0; j < cube[0].length; j++) {
                    let temp = cube[2][k][j];
                    cube[2][k][j] = cube[3][k][j];
                    cube[3][k][j] = cube[4][k][j];
                    cube[4][k][j] = cube[1][k][j];
                    cube[1][k][j] = temp;
                }
            }
        }
    }
    else if (xyz === "z") {
        /*  */
        rotateFace(cube, 0, 3);
        rotateFace(cube, 5, 1);
        rotateFace(cube, 3, 2);
        /*  */
        rotateFace(cube, 2, r1);
        rotateFace(cube, 4, r2);
        if (w === cube[0].length) {
            rotateFace(cube, 4, r2);
        }
        for (let i = 0; i < r; i++) {
            for (let k = 0; k < cube[0].length; k++) {
                for (let j = 0; j < cube[0].length; j++) {
                    let temp = cube[0][k][j];
                    cube[0][k][j] = cube[1][k][j];
                    cube[1][k][j] = cube[5][k][j];
                    cube[5][k][j] = cube[3][k][j];
                    cube[3][k][j] = temp;
                }
            }
        }
        /*  */
        rotateFace(cube, 0, 1);
        rotateFace(cube, 5, 3);
        rotateFace(cube, 3, 2);
        /*  */
    }

    return cube;
}

function rotateFace(cube, face, r) {
    for (let i = 0; i < r; i++) {
        rotate(cube[face]);
    }
    return cube;
}

function rotate(matrix) {
    const n = matrix.length;
    const x = Math.floor(n/ 2);
    const y = n - 1;
    for (let i = 0; i < x; i++) {
        for (let j = i; j < y - i; j++) {
            k = matrix[i][j];
            matrix[i][j] = matrix[y - j][i];
            matrix[y - j][i] = matrix[y - i][y - j];
            matrix[y - i][y - j] = matrix[j][y - i];
            matrix[j][y - i] = k;
        }
    }
    return matrix;
}

function inverseAlg(alg) {
    let invAlg = "";
    
    if (alg.trim() === "") {
        return "";
    }
    let arr = [];

    for (let a of alg.split(" ")) {
        if (a.includes("'")) {
            arr.unshift(a.slice(0, -1));
        }
        else if (a.includes("2")) {
            arr.unshift(a);
        }
        else {
            arr.unshift(a + "'");
        }
    }
    invAlg = arr.join(" ");

    return invAlg;
}