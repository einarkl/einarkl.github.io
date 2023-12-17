onmessage = e => {
    let inp = e.data;
    genAlgs(inp[0], inp[1], inp[2] || null, inp[3] || null);
}

function genAlgs(len = 1, moves = ["U", "U'", "U2", "D", "D'", "D2", "R", "R'", "R2", "L", "L'", "L2", "F", "F'", "F2", "B", "B'", "B2"]) {
    let algs = [];
    let depth = 1;
    let arr = moves.slice();
    
    while (depth < len + 1) {
        if (depth === 1) {
            for (let m of arr) {
                algs.push(m);
            }
        }
        else {
            let tArr = arr.slice();
            for (let m1 of arr) {
                let prevMoveRaw = m1.split(" ")[m1.split(" ").length - 1];
                let prevMoveE = prevMoveRaw.split("")[prevMoveRaw.length - 1];
                let prevMove = prevMoveE === "2" || prevMoveE === "'" ? prevMoveRaw.slice(0, prevMoveRaw.length - 1) : prevMoveRaw;
                for (let m2 of moves/* .filter(m => {return ((m.split("")[m.length - 1] === "2" || m.split("")[m.length - 1] === "'") ? m.slice(0, m.length - 1) : m) !== prevMove}) */) {
                    tArr.push(m1 + " " + m2);
                    algs.push(m1 + " " + m2);
                }
            }
            arr = tArr.slice();
        }
        depth++;
    }

    postMessage(algs);
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