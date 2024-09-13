let step = "0";
let start;
let targets;
let oScrambles;
let scrambles;
let solutions;

onmessage = e => {
    targets = [];
    scrambles = [];
    solutions = [];
    solveCube(e.data[0], e.data[1]);
};

function solveCube(scr) {
    let scrambles = scr;

    /* for (let j = 0; j < nScrambles.length; j++) {
        // for (let i = 0; i < nScrambles.length; i++) {
        for (let i = j; i < nScrambles.length; i++) {
            if (!isOtherOrientation(nTargets[j], nTargets[i])) {
                targets.push(nTargets[j] + "_" + nTargets[i]);
                scrambles.push(nScrambles[j] + "*" + inverseAlg(nScrambles[i]));
            }
        }
    } */
    oScrambles = scrambles.slice();

    for (let i = 0; i < scrambles.length; i++) {
        let s = scrambles[i];
        let s1 = s.split("*")[0];
        let s2 = s.split("*")[1];
        if ((s.includes("[") || s.includes("]")) && (s.includes(":") || s.includes(","))) {
            if ((s1.includes("[") || s1.includes("]")) && (s1.includes(":") || s1.includes(","))) {
                s1 = removeRedundantMoves(commToAlg(s1));
            }
            if ((s2.includes("[") || s2.includes("]")) && (s2.includes(":") || s2.includes(","))) {
                s2 = removeRedundantMoves(commToAlg(s2));
            }
            scrambles[i] = s1 + " " + s2;
        }
        if (s.includes("(") || s.includes(")")) {
            if (s1.includes("(") || s1.includes(")")) {
                s1 = removeRedundantMoves(algxNtoAlg(s1));
            }
            if (s2.includes("(") || s2.includes(")")) {
                s2 = removeRedundantMoves(algxNtoAlg(s2));
            }
            scrambles[i] = s1 + " " + s2;
        }
    }
    
    solve(scrambles[0], getSolution);
}

function isOtherOrientation(trg1, trg2) {
    let t1 = trg1.split("").sort().join("");
    let t2 = trg2.split("").sort().join("");
    return t1 === t2;
}

function getSolution(solution) {
    if (solution[0] === 1) {
        let sol = removeRedundantMoves(cleanMoves(solution[1]));

        // let s = "{target:\"" + targets[solutions] + "\", alg:\"" + oScrambles[solutions] + "\", scramble:\"" + sol + "\"},";
        // let s = {target: targets[solutions.length], alg: oScrambles[solutions.length], scramble: sol};
        let s = getTargetComm(targets[solutions.length], oScrambles[solutions.length], sol);
        solutions.push(s);
        
        calcProgress();

        postMessage([0, s]);
        if (solutions.length !== scrambles.length) {
            solve(scrambles[solutions.length], getSolution);
        }
    }
}

function getTargetComm(t, a, s) {
    return "{target:\"" + t + "\", alg:\"" + a + "\", scramble:\"" + s + "\"},";
}

function algxNtoAlg(comm) {
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

    postMessage([1, progress]);
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



function inverseAlg(alg) {
    let invAlg = "";
    
    if (alg.trim() === "") {
        return "";
    }
    else if (alg.includes("[") || alg.includes("]") || alg.includes(":") || alg.includes(",") || alg.includes("(") || alg.includes(")")) {
        if (alg.includes("[") || alg.includes("]") || alg.includes(":") || alg.includes(",")) {
            invAlg = inverseComm(alg);
        }
        if (alg.includes("(") || alg.includes(")")) {
            invAlg = inverseAlgxN(alg);
        }
    }
    else {
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
    }

    return invAlg;
}

function inverseComm(alg) {
    let invAlg = "";
    let leftBrackets = 0;
    let rightBrackets = 0;
    let colons = 0;
    let commas = 0;

    for (let a of alg) {
        if (a === "[") {
            leftBrackets++;
        }
        else if (a === "]") {
            rightBrackets++;
        }
        else if (a === ":") {
            colons++;
        }
        else if (a === ",") {
            commas++;
        }
    }

    if (leftBrackets !== rightBrackets || commas > leftBrackets || colons > leftBrackets || (alg[0] !== "[" && alg[alg.length - 1] !== "]")
        || (colons === commas && colons === leftBrackets)) {
        return "Illegal alg";
    }
    
    alg = alg.slice(1, alg.length - 1);
    
    let ABCBCABCBC = alg.match(/(.*)\,\ \[(.*)\,(.*)\]/);
    let ABAB = alg.match(/(.*)\,(.*)/);
    let ABCBCA = alg.match(/(.*)\:\ \[(.*)\,(.*)\]/);
    let ABA = alg.match(/(.*)\:(.*)/);
    
    if (ABCBCABCBC) {
        tempAlg = alg;
        invAlg = "[" + tempAlg.replace(alg.split(",")[0] + ",", "").trim() + ", " + alg.split(",")[0].trim() + "]";
    }
    else if (ABCBCA) {
        tempAlg = alg;
        invAlg = "[" + ABCBCA[1].trim() + ": " + inverseAlg(tempAlg.replace(ABCBCA[1] + ":", "").trim()) + "]";
    }
    else if (ABAB) {
        invAlg = "[" + ABAB[2].trim() + ", " + ABAB[1].trim() + "]";
    }
    else if (ABA) {
        invAlg = "[" + ABA[1].trim() + ": " + inverseAlg(ABA[2].trim()) + "]";
    }

    return invAlg;
}

function inverseAlgxN(alg) {
    let leftBrackets = 0;
    let rightBrackets = 0;

    if (leftBrackets !== rightBrackets || (alg[0] !== "(" && alg[alg.length - 2] !== ")")) {
        return "Illegal alg";
    }

    let n = alg.split(")")[1].trim();
    
    return "(" + inverseAlg(alg.split("(")[1].split(")")[0]) + ")" + n;
}

function removeRedundantMoves(mvs) {
    let change = true;
    let moves = [["U","D"], ["F","B"], ["R","L"]];

    function getAxis(m) {
        if (m[0] === "U" || m[0] === "D") {
            return 0;
        }
        else if (m[0] === "F" || m[0] === "B") {
            return 1;
        }
        else if (m[0] === "R" || m[0] === "L") {
            return 2;
        }
    }

    function fuse(m1, m2) {
        change = true;

        let nm;

        let e1 = m1.length === 1 ? "" : m1[m1.length - 1];
        let e2 = m2.length === 1 ? "" : m2[m2.length - 1];
        let e = e1 + e2;
        
        if (e === "" || e === "''") {
            nm = m1[0] + "2";
        }
        else if (e === "2'" || e === "'2") {
            nm = m1[0];
        }
        else if (e === "2") {
            nm = m1[0] + "'";
        }
        else if (e === "22" || e === "'") {
            nm = "";
        }

        return nm;
    }

    if (mvs.includes("w")) {
        return mvs;
    }
    else {
        let mArr = mvs.split(" ");
        while (change) {
            change = false;
            mArr = mArr.filter(a => a !== "*");
            for (let i = 1; i < mArr.length; i++) {
                let m = mArr[i];
                let pm = mArr[i - 1];
                if (m[0] === pm[0]) {
                    mArr[i] = fuse(m, pm);
                    mArr[i - 1] = "*";
                }
                if (i >= 2) {
                    let ppm = mArr[i - 2];
                    if (getAxis(m) === getAxis(pm) && getAxis(m) === getAxis(ppm)) {
                        if (m[0] === ppm[0]) {
                            mArr[i] = fuse(m, ppm);
                            mArr[i - 2] = "*";
                        }
                    }
                }
            }
        }
        return cleanAlg(mArr.join(" "));
    }
}

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