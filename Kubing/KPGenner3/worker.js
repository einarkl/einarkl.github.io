let affixes = [];
const kp = "Rw' U Rw' U' Rw2 R' U' Rw' U' R U2 Rw' U' Rw3 U2 Rw' U2 Rw'";
const moves4x4 = ["R", "R2", "R'", "U", "U2", "U'", "F", "F2", "F'", "D", "D2", "D'"];
let cleanState;
const colors = ["1", "2", "3", "4", "5", "6"];

onmessage = e => {
    cleanState = getNumberState(4, "");
    gen();
}

function gen() {
    genOPs();
}

function genOPs() {
    let moves  = gennedMoves_2.slice();
    let ops = {};
    let num = 0;
    let maxN = moves.length;
    postMessage(maxN.toString());
    
    for (let m0 of moves) {
        num++;
        postMessage(num);
        let alg = [m0.split(";")[1], kp].join(" ");
        let state = getNumberState(4, alg);
        console.log(state, m0.split(";")[1]);
        let ind = moves.findIndex(s => s.split(";")[0] === state);
        if (ind !== -1) {
            let suf = moves[ind].split(";")[0];
            alg = [alg, suf].join(" ");
            /* let uf = state[14];
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
            state = getNumberState(4, inverseAlg(alg)); */

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

function getNewState(state) {
    /* 
    Codes:
    Number axyz 
    a = number of edges flipped, always 1 flipped UF and 1 non-flipped UL
    x,y,z = code for how UFL, UFR, UBR are twisted respectively. 0 = top color up, 1 = top color R/L, 2 = top color on F/B
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

    return a + xyz;
}

function getNumberState(n, scr) {
    let cube = [];

    for (let s = 0; s < 6; s++) {
        let side = [];
        for (let i = 0; i < n; i++) {
            let line = [];
            for (let j = 0; j < n; j++) {
                if (s !== 0 && s !== 5 && i === 0) {
                    line.push("0");
                }
                else {
                    line.push(colors[s]);
                }
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

const gennedMoves_2 = [
    "111111111111111100002222222222220000333333333333000044444444444400005555555555556666666666666666;",
    "111511151115111000002222222222220001333133313331044404440444044460006555655565556660666366636663;R",
    "111011131113111300002222222222220006333633363336444044404440444010001555155515556665666566656660;R2",
    "111011131113111300002222222222220006333633363336444044404440444010001555155515556665666566656660;R'",
    "111111111111044400012221222122210333033303330333600064446444644400005555555555550222666666666666;F",
    "111111111111222000062226222622263330333033303330100014441444144400005555555555554440666666666666;F2",
    "111111111111222000062226222622263330333033303330100014441444144400005555555555554440666666666666;F'",
    "111511151115111000002222222222220001333133313331044404440444044460006555655565556660666366636663;R U",
    "111511151115111000002222222222220001333133313331044404440444044460006555655565556660666366636663;R U2",
    "111511151115111000002222222222220001333133313331044404440444044460006555655565556660666366636663;R U'",
    "111511151115044000012221222122210331033103310334044404440444666660006555655525550223666366636663;R F",
    "111511151115222000062226222622263331333133313330044404440444111160006555655505554440666066606660;R F2",
    "111511151115222000062226222622263331333133313330044404440444111160006555655505554440666066606660;R F'",
    "111211151115111000002222222233330001333133314441044504450445044560006555655562226660666366636664;R D",
    "111411151115111000002222222255550001333133312221044304430443044360006555655564446660666366636662;R D2",
    "111411151115111000002222222255550001333133312221044304430443044360006555655564446660666366636662;R D'",
    "111011131113111300002222222222220006333633363336444044404440444010001555155515556665666566656660;R2 U",
    "111011131113111300002222222222220006333633363336444044404440444010001555155515556665666566656660;R2 U2",
    "111011131113111300002222222222220006333633363336444044404440444010001555155515556665666566656660;R2 U'",
    "111311131113044300012221222122210332033603360336666644404440444040001555155515550225666566656660;R2 F",
    "111011101110222000062226222622263330333633363336111144404440444000001555155515554445666566656660;R2 F2",
    "111011101110222000062226222622263330333633363336111144404440444000001555155515554445666566656660;R2 F'",
    "111011131113111400002222222233330006333633364446544054405440544010001555155512226662666566656660;R2 D",
    "111011131113111200002222222255550006333633362226344034403440344010001555155514446664666566656660;R2 D2",
    "111011131113111200002222222255550006333633362226344034403440344010001555155514446664666566656660;R2 D'",
    "111011131113111300002222222222220006333633363336444044404440444010001555155515556665666566656660;R' U",
    "111011131113111300002222222222220006333633363336444044404440444010001555155515556665666566656660;R' U2",
    "111011131113111300002222222222220006333633363336444044404440444010001555155515556665666566656660;R' U'",
    "111311131113044300012221222122210332033603360336666644404440444040001555155515550225666566656660;R' F",
    "111011101110222000062226222622263330333633363336111144404440444000001555155515554445666566656660;R' F2",
    "111011101110222000062226222622263330333633363336111144404440444000001555155515554445666566656660;R' F'",
    "111011131113111400002222222233330006333633364446544054405440544010001555155512226662666566656660;R' D",
    "111011131113111200002222222255550006333633362226344034403440344010001555155514446664666566656660;R' D2",
    "111011131113111200002222222255550006333633362226344034403440344010001555155514446664666566656660;R' D'",
    "111511151115000000002221222122211111033303330333044464446444644460006555655565550222666366636663;F R",
    "111011131113444400032221222122216666033303330333544064406440644010001555155515550222666566656660;F R2",
    "111011131113444400032221222122216666033303330333544064406440644010001555155515550222666566656660;F R'",
    "111111111111044400012221222122210333033303330333600064446444644400005555555555550222666666666666;F U",
    "111111111111044400012221222122210333033303330333600064446444644400005555555555550222666666666666;F U2",
    "111111111111044400012221222122210333033303330333600064446444644400005555555555550222666666666666;F U'",
    "111111111111044500012221222133310334033403340334600064446444655500005555555522220223666666666666;F D",
    "111111111111044300012221222155510332033203320332600064446444633300005555555544440225666666666666;F D2",
    "111111111111044300012221222155510332033203320332600064446444633300005555555544440225666666666666;F D'",
    "111511151115222000062226222622203330333033301111144414441444044460006555655565550000666366636663;F2 R",
    "111011131113222000062226222622253330333033306666144014401440344010001555155515554444666566656660;F2 R2",
    "111011131113222000062226222622253330333033306666144014401440344010001555155515554444666566656660;F2 R'",
    "111111111111222000062226222622263330333033303330100014441444144400005555555555554440666666666666;F2 U",
    "111111111111222000062226222622263330333033303330100014441444144400005555555555554440666666666666;F2 U2",
    "111111111111222000062226222622263330333033303330100014441444144400005555555555554440666666666666;F2 U'",
    "111111111111322000062226222633364330433043304330100014441444155500005555555522225440666666666666;F2 D",
    "111111111111522000062226222655562330233023302330100014441444133300005555555544443440666666666666;F2 D2",
    "111111111111522000062226222655562330233023302330100014441444133300005555555544443440666666666666;F2 D'",
    "111511151115222000062226222622203330333033301111144414441444044460006555655565550000666366636663;F' R",
    "111011131113222000062226222622253330333033306666144014401440344010001555155515554444666566656660;F' R2",
    "111011131113222000062226222622253330333033306666144014401440344010001555155515554444666566656660;F' R'",
    "111111111111222000062226222622263330333033303330100014441444144400005555555555554440666666666666;F' U",
    "111111111111222000062226222622263330333033303330100014441444144400005555555555554440666666666666;F' U2",
    "111111111111222000062226222622263330333033303330100014441444144400005555555555554440666666666666;F' U'",
    "111111111111322000062226222633364330433043304330100014441444155500005555555522225440666666666666;F' D",
    "111111111111522000062226222655562330233023302330100014441444133300005555555544443440666666666666;F' D2",
    "111111111111522000062226222655562330233023302330100014441444133300005555555544443440666666666666;F' D'",
];