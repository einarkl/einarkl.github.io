let u1 = "ubl", u2 = "ub", u3 = "ubr", u4 = "ul", u5 = "u", u6 = "ur", u7 = "ufl", u8 = "uf", u9 = "ufr", nu1, nu2, nu3, nu4, nu5, nu6, nu7, nu8, nu9;
let l1 = "lub", l2 = "lu", l3 = "luf", l4 = "lb", l5 = "l", l6 = "lf", l7 = "ldb", l8 = "ld", l9 = "ldf", nl1, nl2, nl3, nl4, nl5, nl6, nl7, nl8, nl9;
let f1 = "ful", f2 = "fu", f3 = "fur", f4 = "fl", f5 = "f", f6 = "fr", f7 = "fdl", f8 = "fd", f9 = "fdr", nf1, nf2, nf3, nf4, nf5, nf6, nf7, nf8, nf9;
let r1 = "ruf", r2 = "ru", r3 = "rub", r4 = "rf", r5 = "r", r6 = "rb", r7 = "rdf", r8 = "rd", r9 = "rdb", nr1, nr2, nr3, nr4, nr5, nr6, nr7, nr8, nr9;
let b1 = "bur", b2 = "bu", b3 = "bul", b4 = "br", b5 = "b", b6 = "bl", b7 = "bdr", b8 = "bd", b9 = "bdl", nb1, nb2, nb3, nb4, nb5, nb6, nb7, nb8, nb9;
let d1 = "dfl", d2 = "df", d3 = "dfr", d4 = "dl", d5 = "d", d6 = "dr", d7 = "dbl", d8 = "db", d9 = "dbr", nd1, nd2, nd3, nd4, nd5, nd6, nd7, nd8, nd9;

const solvedState333 = [
    u1,u2,u3,u4,u5,u6,u7,u8,u9,
    l1,l2,l3,l4,l5,l6,l7,l8,l9,
    f1,f2,f3,f4,f5,f6,f7,f8,f9,
    r1,r2,r3,r4,r5,r6,r7,r8,r9,
    b1,b2,b3,b4,b5,b6,b7,b8,b9,
    d1,d2,d3,d4,d5,d6,d7,d8,d9
];

const solvedState222 = [
    u1,u3,u7,u9,
    l1,l3,l7,l9,
    f1,f3,f7,f9,
    r1,r3,r7,r9,
    b1,b3,b7,b9,
    d1,d3,d7,d9
];

const colors = ["white", "#FFAA00", "#00FF00", "red", "blue", "yellow"];

let colors333 = [
    "white", "white", "white", "white", "white", "white", "white", "white", "white",
    "#FFAA00", "#FFAA00", "#FFAA00", "#FFAA00", "#FFAA00", "#FFAA00", "#FFAA00", "#FFAA00", "#FFAA00",
    "#00FF00", "#00FF00", "#00FF00", "#00FF00", "#00FF00", "#00FF00", "#00FF00", "#00FF00", "#00FF00",
    "red", "red", "red", "red", "red", "red", "red", "red", "red",
    "blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue",
    "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow"
];

let colors222 = [
    "white", "white", "white", "white",
    "#FFAA00", "#FFAA00", "#FFAA00", "#FFAA00",
    "#00FF00", "#00FF00", "#00FF00", "#00FF00",
    "red", "red", "red", "red",
    "blue", "blue", "blue", "blue",
    "yellow", "yellow", "yellow", "yellow"
];

// Get scramble
{
    function getScrambleNxN(n) {
        let bld = false;
        if (n === "3b") {
            n = 3;
            bld = true;
        }
        if (n < 2) {
            return "Don't be silly :P";
        }

        let scr = "";
        let movesExtra = ["", "'", "2"];
        let axises = n > 2 ? [["U","D"], ["F","B"], ["R","L"]] : [["U"], ["F"], ["R"]];
        let movesAxis = [["",""]];
        let num = n > 3 ? 20*(n-2) : (n === 3 ? Math.floor(Math.random() * 4 + 21) : Math.floor(Math.random() * 3 + 9));

        for (let i = 4; i <= n; i++) {
            let nW = Math.floor(i/2) === 2 ? "" : Math.floor(i/2);
            let nA = [nW,"w"];
            
            if (!JSON.stringify(movesAxis).includes(JSON.stringify(nA))) {
                movesAxis.push(nA);
            }
        }
        
        let curAxis = -1;
        let moves = [];
        let r = bld ? Math.floor(Math.random() * 2 + 1) : 0;
        
        for (let i = 0; i < num; i++) {
            let axis = Math.floor(Math.random() * axises.length);

            if (axis !== curAxis) {
                curAxis = axis;
                moves = movesAxis.map(m => [m[0] + axises[curAxis][0] + m[1]])
                        .concat(movesAxis.map(m => [m[0] + axises[curAxis][1] + m[1]]));
                if (n % 2 === 0) {
                    moves.pop();
                }
            }
            else if (moves.length === 0) {
                i--;
                continue;
            }

            let move = moves[Math.floor(Math.random() * moves.length)];
            let moveW = r !== 0 && i >= num - r ? "w" : "";
            let moveE = movesExtra[Math.floor(Math.random() * movesExtra.length)];
            
            moves.splice(moves.indexOf(move), 1);

            scr += move + moveW + moveE + " ";
        }

        return scr.trim();
    }

    function getSubsetScramble(moves = ["U", "U'", "U2", "D", "D'", "D2", "R", "R'", "R2", "L", "L'", "L2", "F", "F'", "F2", "B", "B'", "B2"], len = null) {
        let scr = [];
        let num = len ? len : Math.floor(Math.random() * 4 + 19);
        
        genMoves(scr, moves, num);
        
        return scr.join(" ");
    
        function genMoves(arr, moves, n) {
            for (let i = 0; i < n; i++) {
                let again = false;
                let move = moves[Math.floor(Math.random() * moves.length)];
                let m = move.replace("2", "").replace("'", "");
                if (i >= 1) {
                    let pm = arr[i - 1].replace("2", "").replace("'", "");
                    if (m === pm || m.includes("w") && pm === m.replace("w", "")) {
                        i--;
                        again = true;
                    }
                }
                if (i >= 2) {
                    let pm = arr[i - 1].replace("2", "").replace("'", "");
                    let ppm = arr[i - 2].replace("2", "").replace("'", "");
                    if (opp(m) === pm && m === ppm) {
                        i--;
                        again = true;
                    }
                }
        
                if (!again) {
                    arr.push(move);
                }
            }
        }
    
        function opp(m) {
            switch (m) {
                case "U":
                    return "D";
                case "D":
                    return "U";
                case "R":
                    return "L";
                case "L":
                    return "R";
                case "F":
                    return "B";
                case "B":
                    return "F";
                case "Uw":
                    return "Dw";
                case "Dw":
                    return "Uw";
                case "Rw":
                    return "Lw";
                case "Lw":
                    return "Rw";
                case "Fw":
                    return "Bw";
                case "Bw":
                    return "Fw";
            }
        }
    }

    function genAlgs(len = 1, moves = ["U", "U'", "U2", "D", "D'", "D2", "R", "R'", "R2", "L", "L'", "L2", "F", "F'", "F2", "B", "B'", "B2"], n = null, importantFaces = null) {
        let algs = [];
        let algsObj = {};
        let depth = 1;
        let arr = moves.slice();
        let facesToExclude = importantFaces === null ? [] : ["U", "L", "F", "R", "B", "D"];

        if (importantFaces !== null) {
            for (let i = 0; i < facesToExclude.length; i++) {
                let f = facesToExclude[i];
                if (importantFaces.includes(f)) {
                    facesToExclude.splice(i, 1);
                }
            }
            facesToExclude = facesToExclude.map(m => m.replace("U", "1").replace("L", "6").replace("F", "3").replace("R", "5").replace("B", "4").replace("D", "2"));
        }console.log(facesToExclude);
        
        while (depth < len + 1) {
            if (depth === 1) {
                for (let m of arr) {
                    algs.push(m)
                    if (n !== null) {
                        let state = getNumberState(n, m);
                        state = state.split("").map(s => facesToExclude.includes(s) ? "0" : s).join("");

                        if (!algsObj[state]) {
                            algsObj[state] = [];
                        }

                        algsObj[state].push(inverseAlg(m));
                    }
                }
            }
            else {
                let tArr = arr.slice();
                for (let m1 of arr) {
                    let prevMoveRaw = m1.split(" ")[m1.split(" ").length - 1];
                    let prevMoveE = prevMoveRaw.split("")[prevMoveRaw.length - 1];
                    let prevMove = prevMoveE === "2" || prevMoveE === "'" ? prevMoveRaw.slice(0, prevMoveRaw.length - 1) : prevMoveRaw;
                    for (let m2 of moves.filter(m => {return ((m.split("")[m.length - 1] === "2" || m.split("")[m.length - 1] === "'") ? m.slice(0, m.length - 1) : m) !== prevMove})) {
                        tArr.push(m1 + " " + m2);
                        algs.push(m1 + " " + m2);
                        if (n !== null) {
                            let state = getNumberState(n, m1 + " " + m2);
                            state = state.split("").map(s => facesToExclude.includes(s) ? "0" : s).join("");

                            if (!algsObj[state]) {
                                algsObj[state] = [];
                            }
    
                            algsObj[state].push(inverseAlg(m1 + " " + m2));
                        }
                    }
                }
                arr = tArr.slice();
            }
            depth++;
        }

        if (n === null) {
            return algs;
        }
        else {
            return algsObj;
        }
    }

    function getScramble333() {
        let scr = "";
        let moves = ["R", "L", "F", "B", "U", "D"];
        let movesExtra = ["", "'", "2"];
        let numOfMoves = [19, 20, 21];
        let num = numOfMoves[Math.floor(Math.random() * numOfMoves.length)];
        let scrambleArray = [];

        for (let i=0; i<num; i++) {
            if (scrambleArray.length < 1) { //Sjekker om array er tomt
                scrambleArray[i] = moves[Math.floor(Math.random() * moves.length)];
            }
            else if (scrambleArray.length >= 1) {
                let like = true;
                while (like === true) {
                    let trekk1 = moves[Math.floor(Math.random() * moves.length)];
                    scrambleArray[i] = trekk1;

                    if (scrambleArray[i] === moves[0]) {        //R
                        if (scrambleArray[i] === scrambleArray[i-1]) {   //Sjekker om trekket er likt det forrige
                            i--;
                            scrambleArray[i] = trekk1;
                        }
                        else if (scrambleArray[i-1] === moves[1]) {   //Sjekker om trekket er motsatt av forrige
                            if (scrambleArray[i-2] === moves[0]) {  //Sjekker om trekket er det samme som forrige forrige
                                i--;
                                scrambleArray[i] = trekk1;
                            }
                            else {
                                like = false;
                            }
                        }
                        else {
                            like = false;
                        }
                    }
                    else if (scrambleArray[i] === moves[1]) {   //L
                        if (scrambleArray[i] === scrambleArray[i-1]) {   //Sjekker om trekket er likt det forrige
                            i--;
                            scrambleArray[i] = trekk1;
                        }
                        else if (scrambleArray[i-1] === moves[0]) {   //Sjekker om trekket er motsatt av forrige
                            if (scrambleArray[i-2] === moves[1]) {  //Sjekker om trekket er det samme som forrige forrige
                                i--;
                                scrambleArray[i] = trekk1;
                            }
                            else {
                                like = false;
                            }
                        }
                        else {
                            like = false;
                        }
                    }
                    else if (scrambleArray[i] === moves[2]) {   //F
                        if (scrambleArray[i] === scrambleArray[i-1]) {   //Sjekker om trekket er likt det forrige
                            i--;
                            scrambleArray[i] = trekk1;
                        }
                        else if (scrambleArray[i-1] === moves[3]) {   //Sjekker om trekket er motsatt av forrige
                            if (scrambleArray[i-2] === moves[2]) {  //Sjekker om trekket er det samme som forrige forrige
                                i--;
                                scrambleArray[i] = trekk1;
                            }
                            else {
                                like = false;
                            }
                        }
                        else {
                            like = false;
                        }
                    }
                    else if (scrambleArray[i] === moves[3]) {   //B
                        if (scrambleArray[i] === scrambleArray[i-1]) {   //Sjekker om trekket er likt det forrige
                            i--;
                            scrambleArray[i] = trekk1;
                        }
                        else if (scrambleArray[i-1] === moves[2]) {   //Sjekker om trekket er motsatt av forrige
                            if (scrambleArray[i-2] === moves[3]) {  //Sjekker om trekket er det samme som forrige forrige
                                i--;
                                scrambleArray[i] = trekk1;
                            }
                            else {
                                like = false;
                            }
                        }
                        else {
                            like = false;
                        }
                    }
                    else if (scrambleArray[i] === moves[4]) {   //U
                        if (scrambleArray[i] === scrambleArray[i-1]) {   //Sjekker om trekket er likt det forrige
                            i--;
                            scrambleArray[i] = trekk1;
                        }
                        else if (scrambleArray[i-1] === moves[5]) {   //Sjekker om trekket er motsatt av forrige
                            if (scrambleArray[i-2] === moves[4]) {  //Sjekker om trekket er det samme som forrige forrige
                                i--;
                                scrambleArray[i] = trekk1;
                            }
                            else {
                                like = false;
                            }
                        }
                        else {
                            like = false;
                        }
                    }
                    else if (scrambleArray[i] === moves[5]) {   //D
                        if (scrambleArray[i] === scrambleArray[i-1]) {   //Sjekker om trekket er likt det forrige
                            i--;
                            scrambleArray[i] = trekk1;
                        }
                        else if (scrambleArray[i-1] === moves[4]) {   //Sjekker om trekket er motsatt av forrige
                            if (scrambleArray[i-2] === moves[5]) {  //Sjekker om trekket er det samme som forrige forrige
                                i--;
                                scrambleArray[i] = trekk1;
                            }
                            else {
                                like = false;
                            }
                        }
                        else {
                            like = false;
                        }
                    }
                }
            }
        }

        for (let j=0; j<scrambleArray.length; j++) {
            scr += scrambleArray[j] + movesExtra[Math.floor(Math.random() * movesExtra.length)] + " ";
        }

        return scr.trim();
    }

    function getScramble222() {
        let scr = "";
        let moves = ["R", "F", "U"];
        let movesExtra = ["", "'", "2"];
        let numOfMoves = [9, 10, 11];
        let prevMove = "";

        let num = numOfMoves[Math.floor(Math.random() * numOfMoves.length)];

        for (let i=0; i<num; i++) {
            let move = moves[Math.floor(Math.random() * moves.length)];
            let extra = movesExtra[Math.floor(Math.random() * movesExtra.length)];
            
            if (prevMove !== move) {
                prevMove = move;
                scr += move+extra+" ";
            }
            else {
                i--;
            }
        }

        return scr.trim();
    }

    function getScrambleClock(pins = false) {
        let c = ["UR","DR","DL","UL"];
        let e = ["U","R","D","L"];
        let x = ["ALL","y2 "];
        let extra = ["0+ ","1+ ","2+ ","3+ ","4+ ","5+ ","6+ ","1- ","2- ","3- ","4- ","5- "];
        let scr = c[0] + extra[Math.floor(Math.random() * extra.length)] + c[1] + extra[Math.floor(Math.random() * extra.length)] + 
                    c[2] + extra[Math.floor(Math.random() * extra.length)] + c[3] + extra[Math.floor(Math.random() * extra.length)] + 
                    e[0] + extra[Math.floor(Math.random() * extra.length)] + e[1] + extra[Math.floor(Math.random() * extra.length)] + 
                    e[2] + extra[Math.floor(Math.random() * extra.length)] + e[3] + extra[Math.floor(Math.random() * extra.length)] + 
                    x[0] + extra[Math.floor(Math.random() * extra.length)] + x[1] + 
                    e[0] + extra[Math.floor(Math.random() * extra.length)] + e[1] + extra[Math.floor(Math.random() * extra.length)] + 
                    e[2] + extra[Math.floor(Math.random() * extra.length)] + e[3] + extra[Math.floor(Math.random() * extra.length)] + 
                    x[0] + extra[Math.floor(Math.random() * extra.length)];

        if (pins) {
            for (let p of c) {
                if (Math.round(Math.random() * 1) === 1) {
                    scr += p + " ";
                }
            }
        }

        return scr.trim();
    }

    function getScrambleMega(format = false) {
        let movesExtra = ["++", "--"];
        let scr = "";

        for (let j=0; j<7; j++) {
            scr += format ? "<span>" : "";
            let last = "";
            for (let i=0; i<11; i++) {
                if (i === 10) {
                    if (last === "++") {
                        scr += format ? "U" : "U ";
                    }
                    else {
                        scr += format ? "U'" : "U' ";
                    }
                }
                else {
                    if (i % 2 === 0) {
                        scr += "R"+movesExtra[Math.floor(Math.random() * movesExtra.length)]+" ";
                    }
                    else {
                        const e = movesExtra[Math.floor(Math.random() * movesExtra.length)];
                        scr += "D"+e+" ";
                        last = e;
                    }
                }
            }
            if (j < 6) {
                scr += format ? "</span></br>" : "";
            }
        }
        
        return scr;
    }

    function getScramblePyra() {
        //7-8 trekk
        //u r l b tips
        let scr = "";
        let moves = ["U", "R", "L", "B"];
        let tips = ["u", "r", "l", "b"];
        let movesExtra = ["", "'"];
        let numOfMoves = [7, 8];
        let prevMove = "";

        let num = numOfMoves[Math.floor(Math.random() * numOfMoves.length)];

        for (let i=0; i<num; i++) {
            let move = moves[Math.floor(Math.random() * moves.length)];
            let extra = movesExtra[Math.floor(Math.random() * movesExtra.length)];
            
            if (prevMove !== move) {
                prevMove = move;
                scr += move+extra+" ";
            }
            else {
                i--;
            }
        }

        for (let t of tips) {
            let r = Math.round(Math.random() * 1);
            if (r === 1) {
                scr += t + movesExtra[Math.floor(Math.random() * movesExtra.length)] + " ";
            }
        }

        return scr.trim();
    }

    function getScrambleSkewb() {
        //8-9 trekk
        //U R L B
        let scr = "";
        let moves = ["U", "R", "L", "B"];
        let movesExtra = ["", "'"];
        let numOfMoves = [8, 9];
        let prevMove = "";

        let num = numOfMoves[Math.floor(Math.random() * numOfMoves.length)];

        for (let i=0; i<num; i++) {
            let move = moves[Math.floor(Math.random() * moves.length)];
            let extra = movesExtra[Math.floor(Math.random() * movesExtra.length)];
            
            if (prevMove !== move) {
                prevMove = move;
                scr += move+extra+" ";
            }
            else {
                i--;
            }
        }

        return scr.trim();
    }

    let currentSq1 = ["a2","b","c1","c2","d","e1","e2","f","g1","g2","h","a1","i2","j","k1","k2","l","m1","m2","n","o1","o2","p","i1"];
    let currentTop = ["a2","b","c1","c2","d","e1","e2","f","g1","g2","h","a1"];
    let currentBottom = ["i2","j","k1","k2","l","m1","m2","n","o1","o2","p","i1"];
    function getScrambleSq1() {
        
        let movesBeforeShapeShift = 5;
        let numberOfMoves = 12;
        let scrambleSq1 = "";

        outerloop:
        for (let i=0; i<numberOfMoves; i++) {
            doResetSq1();
            let curMoves = "";
            let moveU = Math.floor(Math.random() * 12);
            let moveD = Math.floor(Math.random() * 12);

            if (moveU === 0 && moveD === 0) {
                i--;
                continue outerloop;
            }
            if (movesBeforeShapeShift > 0) {
                if ((i === 0 && moveU % 3 === moveD % 3) || (i > 0 && moveU % 3 !== moveD % 3)) {
                    i--;
                    continue outerloop;
                }
                else {
                    curMoves += "("+makeMoveSq1(moveU)+","+makeMoveSq1(moveD)+")";
                    doTurnsSq1(scrambleSq1 + curMoves);
                    if (!canDoSliceSq1() 
                        || (currentTop[1].split("").length === 1 && currentBottom[0].split("").length === 2) 
                        || (currentTop[1].split("").length === 2 && currentBottom[0].split("").length === 1)) {
                        i--;
                        continue outerloop;
                    }
                    else {
                        movesBeforeShapeShift--;
                    }
                }
            }
            else {
                curMoves += "("+makeMoveSq1(moveU)+","+makeMoveSq1(moveD)+")";
                doTurnsSq1(scrambleSq1 + curMoves);
                if (!canDoSliceSq1()) {
                    i--;
                    continue outerloop;
                }
            }

            if (i !== numberOfMoves-1) {
                curMoves += " / ";
            }
            else {
                if (canDoSliceSq1() && Math.random() < 0.5) {
                    curMoves += " / ";
                    if (Math.random() < 0.25) {
                        numberOfMoves++;
                    }
                }
            }
            scrambleSq1 += curMoves;
        }

        return scrambleSq1;
    }

    {

        function doTurnsSq1(scrambleToDo) {
            let us = [];
            let ds = [];
            let slices = 0;
            let scr = scrambleToDo.replaceAll(" ","");

            for (let s of scr.split("")) {
                if (s === "/") {
                    slices++;
                }
            }

            scr = scr.replaceAll("(","");
            scr = scr.replaceAll(")","");

            if (scr.split("")[0] === "/") {
                doSliceSq1();
                slices--;
            }

            for (let t of scr.split("/")) {
                if (t.split(",").length === 2) {
                    us.push(parseInt(t.split(",")[0]));
                    ds.push(parseInt(t.split(",")[1]));
                }
            }
            
            for (let i=0; i<us.length; i++) {
                doUSq1(us[i]);
                doDSq1(ds[i]);
                if (slices !== 0) {
                    doSliceSq1();
                    slices--;
                }
            }
        }

        function doUSq1(number) {
            let arr = [];
            let temp = currentTop;

            arr = doTurnFaceSq1(arr, temp, number);

            currentTop = arr;
        }

        function doDSq1(number) {
            let arr = [];
            let temp = currentBottom;

            arr = doTurnFaceSq1(arr, temp, number);

            currentBottom = arr;
        }

        function doSliceSq1() {
            if (canDoSliceSq1()) {
                let arrT = currentTop;
                let arrB = currentBottom;
                let temp = arrT.concat();

                for (let i=2; i<8; i++) {
                    arrT[i] = arrB[i-1];
                }
                for (let i=1; i<7; i++) {
                    arrB[i] = temp[i+1];
                }

                currentTop = arrT;
                currentBottom = arrB;
            }
        }

        function doTurnFaceSq1(arr, temp, number) {
            for (let i=0; i<temp.length; i++) {
                if (number === 0) {
                    arr = temp;
                }
                else if (number > 0) {
                    if (i-number < 0) {
                        arr[i] = temp[i-number+temp.length];
                    }
                    else {
                        arr[i] = temp[i-number];
                    }
                }
                else if (number < 0) {
                    if (i-number >= temp.length) {
                        arr[i] = temp[i-number-temp.length];
                    }
                    else {
                        arr[i] = temp[i-number];
                    }
                }
            }

            return arr;
        }

        function canDoSliceSq1() {
            return currentTop[1].split("")[0] !== currentTop[2].split("")[0] && currentTop[7].split("")[0] !== currentTop[8].split("")[0] && 
                currentBottom[0].split("")[0] !== currentBottom[1].split("")[0] && currentBottom[6].split("")[0] !== currentBottom[7].split("")[0];
        }


        function doResetSq1() {
            currentTop = currentSq1.slice(0,12);
            currentBottom = currentSq1.slice(12,24);
        }

        function makeMoveSq1 (move) {
            if (move > 6) {
                move = 6-move;
            }

            return move;
        }
    }
}

// Draw scramble
{
    let stroke = "#1E1E1E";

    function drawScrambleNxN_new(svgID, n, scr, flagsStr = "") {
        const clean = ["white", "#FFAA00", "#00FF00", "red", "blue", "yellow"];
        $(svgID).empty();
    
        // ignore () and ,
        scr = scr.replaceAll("(", "").replaceAll(")", "").replaceAll(",", "");

        let cube = getState_new(n, scr);
        let indCube = [];

        let ind = 0;
        for (let s = 0; s < 6; s++) {
            indCube.push([]);
            for (let i = 0; i < n; i++) {
                indCube[s].push([]);
                for (let j = 0; j < n; j++) {
                    // indCube[s][i].push({s: s, r: i, c: j});
                    indCube[s][i].push(ind);
                    ind++;
                }
            }
        }
        
        const corners = {
            "ubl": [indCube[0][0][0]],
            "ubr": [indCube[0][0][n-1]],
            "ufr": [indCube[0][n-1][n-1]],
            "ufl": [indCube[0][n-1][0]],
            "dfl": [indCube[5][0][0]],
            "dfr": [indCube[5][0][n-1]],
            "dbr": [indCube[5][n-1][n-1]],
            "dbl": [indCube[5][n-1][0]],
            "ful": [indCube[2][0][0]],
            "fur": [indCube[2][0][n-1]],
            "fdr": [indCube[2][n-1][n-1]],
            "fdl": [indCube[2][n-1][0]],
            "bur": [indCube[4][0][0]],
            "bul": [indCube[4][0][n-1]],
            "bdl": [indCube[4][n-1][n-1]],
            "bdr": [indCube[4][n-1][0]],
            "ruf": [indCube[3][0][0]],
            "rub": [indCube[3][0][n-1]],
            "rdb": [indCube[3][n-1][n-1]],
            "rdf": [indCube[3][n-1][0]],
            "lub": [indCube[1][0][0]],
            "luf": [indCube[1][0][n-1]],
            "ldf": [indCube[1][n-1][n-1]],
            "ldb": [indCube[1][n-1][0]],
            "ulb": [indCube[0][0][0]],
            "urb": [indCube[0][0][n-1]],
            "urf": [indCube[0][n-1][n-1]],
            "ulf": [indCube[0][n-1][0]],
            "dlf": [indCube[5][0][0]],
            "drf": [indCube[5][0][n-1]],
            "drb": [indCube[5][n-1][n-1]],
            "dlb": [indCube[5][n-1][0]],
            "flu": [indCube[2][0][0]],
            "fru": [indCube[2][0][n-1]],
            "frd": [indCube[2][n-1][n-1]],
            "fld": [indCube[2][n-1][0]],
            "bru": [indCube[4][0][0]],
            "blu": [indCube[4][0][n-1]],
            "bld": [indCube[4][n-1][n-1]],
            "brd": [indCube[4][n-1][0]],
            "rfu": [indCube[3][0][0]],
            "rbu": [indCube[3][0][n-1]],
            "rbd": [indCube[3][n-1][n-1]],
            "rfd": [indCube[3][n-1][0]],
            "lbu": [indCube[1][0][0]],
            "lfu": [indCube[1][0][n-1]],
            "lfd": [indCube[1][n-1][n-1]],
            "lbd": [indCube[1][n-1][0]]
        }
        
        const edges = {
            "ub": indCube[0][0].slice(1, -1),
            "ur": transpose(indCube[0])[n-1].slice(1, -1),
            "uf": indCube[0][n-1].slice(1, -1),
            "ul": transpose(indCube[0])[0].slice(1, -1),
            "df": indCube[5][0].slice(1, -1),
            "dr": transpose(indCube[5])[n-1].slice(1, -1),
            "db": indCube[5][n-1].slice(1, -1),
            "dl": transpose(indCube[5])[0].slice(1, -1),
            "fu": indCube[2][0].slice(1, -1),
            "fr": transpose(indCube[2])[n-1].slice(1, -1),
            "fd": indCube[2][n-1].slice(1, -1),
            "fl": transpose(indCube[2])[0].slice(1, -1),
            "bu": indCube[4][0].slice(1, -1),
            "bl": transpose(indCube[4])[n-1].slice(1, -1),
            "bd": indCube[4][n-1].slice(1, -1),
            "br": transpose(indCube[4])[0].slice(1, -1),
            "ru": indCube[3][0].slice(1, -1),
            "rb": transpose(indCube[3])[n-1].slice(1, -1),
            "rd": indCube[3][n-1].slice(1, -1),
            "rf": transpose(indCube[3])[0].slice(1, -1),
            "lu": indCube[1][0].slice(1, -1),
            "lf": transpose(indCube[1])[n-1].slice(1, -1),
            "ld": indCube[1][n-1].slice(1, -1),
            "lb": transpose(indCube[1])[0].slice(1, -1),
        }

        const centers = {
            "u": getCen(0),
            "d": getCen(5),
            "f": getCen(2),
            "b": getCen(4),
            "r": getCen(3),
            "l": getCen(1),
        }

        let pieceFlags = {};

        for (let k of Object.keys(corners)) {
            pieceFlags[k + "_"] = corners[k];
        }
        for (let k of Object.keys(edges)) {
            pieceFlags[k + "_"] = edges[k];
        }
        for (let k of Object.keys(corners)) {
            let ks = k.split("");
            let k2 = ks[1] + ks[2] + ks[0]
            let k3 = ks[2] + ks[0] + ks[1]
            pieceFlags[k] = corners[k].concat(corners[k2]).concat(corners[k3]);
        }
        for (let k of Object.keys(edges)) {
            let ks = k.split("");
            let k2 = ks[1] + ks[0]
            pieceFlags[k] = edges[k].concat(edges[k2]);
        }
        for (let k of Object.keys(centers)) {
            pieceFlags[k] = centers[k];
        }

        let flags = {};
        
        for (let k of Object.keys(pieceFlags)) {
            flags[k] = pieceFlags[k];
        }
        
        flags["all"] = $.map(cube, value => $.map(value, innerValue => innerValue));
        flags["a"] = flags["all"];
        flags["centers"] = flags["u"].concat(flags["d"], flags["f"], flags["b"], flags["r"], flags["l"]);
        flags["edges"] = flags["ub"].concat(flags["ur"], flags["uf"], flags["ul"], flags["df"], flags["dr"], flags["db"], flags["dl"], flags["fl"], flags["fr"], flags["br"], flags["bl"]);
        flags["corners"] = flags["ubl"].concat(flags["ubr"], flags["ufr"], flags["ufl"], flags["dfl"], flags["dfr"], flags["dbr"], flags["dbl"]);
        flags["slice_m"] = flags["u"].concat(flags["d"], flags["f"], flags["b"], flags["ub"], flags["uf"], flags["df"], flags["db"]);
        flags["slice_e"] = flags["f"].concat(flags["r"], flags["b"], flags["l"], flags["fl"], flags["fr"], flags["br"], flags["bl"]);
        flags["slice_s"] = flags["u"].concat(flags["r"], flags["d"], flags["l"], flags["ul"], flags["ur"], flags["dr"], flags["dl"]);
        flags["face_u"] = flags["u"].concat(flags["ubl_"], flags["ubr_"], flags["ufr_"], flags["ufl_"], flags["ub_"], flags["ur_"], flags["uf_"], flags["ul_"]);
        flags["face_d"] = flags["d"].concat(flags["dbl_"], flags["dbr_"], flags["dfr_"], flags["dfl_"], flags["db_"], flags["dr_"], flags["df_"], flags["dl_"]);
        flags["face_f"] = flags["f"].concat(flags["ful_"], flags["fur_"], flags["fdr_"], flags["fdl_"], flags["fu_"], flags["fr_"], flags["fd_"], flags["fl_"]);
        flags["face_b"] = flags["b"].concat(flags["bul_"], flags["bur_"], flags["bdr_"], flags["bdl_"], flags["bu_"], flags["br_"], flags["bd_"], flags["bl_"]);
        flags["face_r"] = flags["r"].concat(flags["ruf_"], flags["rub_"], flags["rdb_"], flags["rdf_"], flags["ru_"], flags["rb_"], flags["rd_"], flags["rf_"]);
        flags["face_l"] = flags["l"].concat(flags["luf_"], flags["lub_"], flags["ldb_"], flags["ldf_"], flags["lu_"], flags["lb_"], flags["ld_"], flags["lf_"]);
        flags["layer_u"] = flags["u"].concat(flags["ubl"], flags["ubr"], flags["ufr"], flags["ufl"], flags["ub"], flags["ur"], flags["uf"], flags["ul"]);
        flags["layer_d"] = flags["d"].concat(flags["dbl"], flags["dbr"], flags["dfr"], flags["dfl"], flags["db"], flags["dr"], flags["df"], flags["dl"]);
        flags["layer_f"] = flags["f"].concat(flags["ful"], flags["fur"], flags["fdr"], flags["fdl"], flags["fu"], flags["fr"], flags["fd"], flags["fl"]);
        flags["layer_b"] = flags["b"].concat(flags["bul"], flags["bur"], flags["bdr"], flags["bdl"], flags["bu"], flags["br"], flags["bd"], flags["bl"]);
        flags["layer_r"] = flags["r"].concat(flags["ruf"], flags["rub"], flags["rdb"], flags["rdf"], flags["ru"], flags["rb"], flags["rd"], flags["rf"]);
        flags["layer_l"] = flags["l"].concat(flags["luf"], flags["lub"], flags["ldb"], flags["ldf"], flags["lu"], flags["lb"], flags["ld"], flags["lf"]);
        flags["eo"] = flags["ub_"].concat(flags["ur_"], flags["uf_"], flags["ul_"], flags["df_"], flags["dr_"], flags["db_"], flags["dl_"], flags["fl_"], flags["fr_"], flags["br_"], flags["bl_"]);
        flags["eo_f"] = flags["eo"];
        flags["eo_b"] = flags["eo"];
        flags["eo_r"] = flags["ub_"].concat(flags["ur_"], flags["uf_"], flags["ul_"], flags["df_"], flags["dr_"], flags["db_"], flags["dl_"], flags["lf_"], flags["rf_"], flags["rb_"], flags["lb_"]);
        flags["eo_l"] = flags["eo_r"];
        flags["eo_u"] = flags["bd_"].concat(flags["br_"], flags["bu_"], flags["bl_"], flags["fu_"], flags["fr_"], flags["fd_"], flags["fl_"], flags["ul_"], flags["ur_"], flags["dr_"], flags["dl_"]);
        flags["eo_d"] = flags["eo_u"];
        flags["eoline"] = flags["eo"].concat(flags["df"], flags["db"]);
        flags["cross"] = flags["df"].concat(flags["dr"], flags["db"], flags["dl"]);
        flags["f2l_fl"] = flags["dfl"].concat(flags["fl"]);
        flags["f2l_fr"] = flags["dfr"].concat(flags["fr"]);
        flags["f2l_bl"] = flags["dbl"].concat(flags["bl"]);
        flags["f2l_br"] = flags["dbr"].concat(flags["br"]);
        flags["f2l_b"] = flags["f2l_bl"].concat(flags["f2l_br"]);
        flags["f2l_f"] = flags["f2l_fl"].concat(flags["f2l_fr"]);
        flags["f2l_r"] = flags["f2l_fr"].concat(flags["f2l_br"]);
        flags["f2l_l"] = flags["f2l_bl"].concat(flags["f2l_fl"]);
        flags["f2l"] = flags["f2l_f"].concat(flags["f2l_b"]);
        flags["oll"] = flags["face_u"];
        flags["pll"] = flags["bu_"].concat(flags["ru_"], flags["fu_"], flags["lu_"], flags["bul_"], flags["bur_"], flags["fur_"], flags["ful_"], flags["lub_"], flags["rub_"], flags["ruf_"], flags["luf_"]);
        flags["ll"] = flags["layer_u"];
        flags["ell"] = flags["ub"].concat(flags["ur"], flags["uf"], flags["ul"]);
        flags["cll"] = flags["ubl"].concat(flags["ubr"], flags["ufr"], flags["ufl"]);
        flags["dr"] = flags["face_u"].concat(flags["face_d"]);
        flags["dr_u"] = flags["dr"];
        flags["dr_d"] = flags["dr"];
        flags["dr_f"] = flags["face_f"].concat(flags["face_b"]);
        flags["dr_b"] = flags["dr_f"];
        flags["dr_r"] = flags["face_r"].concat(flags["face_l"]);
        flags["dr_l"] = flags["dr_r"];
        flags["fb"] = flags["f2l_l"].concat(flags["l"], flags["ld"]);
        flags["sb"] = flags["f2l_r"].concat(flags["r"], flags["rd"]);
        flags["l6e"] = flags["ub"].concat(flags["ur"], flags["uf"], flags["ul"], flags["df"], flags["db"]);
        flags["lse"] = flags["l6e"];
        
        let inpFlags = {};

        if (flagsStr.trim() === "") {
            inpFlags["all"] = "";
        }
        else {
            if (flagsStr === "--nautilus") {
                flagsStr = "-layer_f gray -layer_u gray -f2l_fl clean -u clean -f clean -df clean -fr_ white -uf_ white -ur_ white -ub_ white -ul_ white";
            }
            let flagsArr = flagsStr.split("-").filter(f => f.trim() !== "");
            for (let f of flagsArr) {
                const fs = f.split(" ");
                inpFlags[fs[0]] = isValidColor(fs[1]) ? fs[1].trim() : "clean";
            }
        }
        
        let col = {};

        for (let i = 0; i < 6*n*n; i++) {
            col[i] = clean[Math.floor(i / (n*n))];
        }
        for (let k of Object.keys(inpFlags)) {
            if (flags[k]) {
                for (let v of flags[k]) {
                    col[v] = inpFlags[k];
                    
                }
            }
        }

        let width = $(svgID).width();
        let height = 3 * width / 4;
        $(svgID).height(height);
        let space = width / 20;
        let size = ((width - 3 * space) / 4) / n;
        let fill = "";
        let strokeWidth = ((size / n) > 1) ? 1 : 0;
        let stroke = "#1E1E1E";
    
        let coordinates = [
            {
                x1: n * size + space,
                x2: 2 * n * size + space,
                y1: 0,
                y2: n * size,
            },
            {
                x1: 0,
                x2: n * size,
                y1: n * size + space,
                y2: 2 * n * size + space,
            },
            {
                x1: n * size + space,
                x2: 2 * n * size + space,
                y1: n * size + space,
                y2: 2 * n * size + space,
            },
            {
                x1: 2 * n * size + 2 * space,
                x2: 3 * n * size + 2 * space,
                y1: n * size + space,
                y2: 2 * n * size + space,
            },
            {
                x1: 3 * n * size + 3 * space,
                x2: 4 * n * size + 3 * space,
                y1: n * size + space,
                y2: 2 * n * size + space,
            },
            {
                x1: n * size + space,
                x2: 2 * n * size + space,
                y1: 2 * n * size + 2 * space,
                y2: 3 * n * size + 2 * space,
            }
        ];
        
        for (let i = 0; i < 6; i++) {
            let j = 0;
            let x1 = coordinates[i].x1;
            let x2 = coordinates[i].x2;
            let y1 = coordinates[i].y1;
            let y2 = coordinates[i].y2;
    
            let yCount = 0;
            for (let y = y1; y < y2; y += size) {
                let k = 0;
                let xCount = 0;
                for (let x = x1; x < x2; x += size) {
                    fill = isValidColor(col[cube[i][j][k]]) ? col[cube[i][j][k]] : clean[Math.floor(cube[i][j][k] / (n*n))];
                    
                    let rect = document.createElementNS('http://www.w3.org/2000/svg', "rect");
                    $(rect).attr("x", x);
                    $(rect).attr("y", y);
                    $(rect).attr("width", size);
                    $(rect).attr("height", size);
                    $(rect).attr("style", "fill:"+fill+";stroke:"+stroke+";stroke-width:"+strokeWidth);
                    
                    $(svgID).append(rect);
                    k++;
                    xCount++;
                    if (xCount === n) {
                        break;
                    }
                }
                j++;
                yCount++;
                if (yCount === n) {
                    break;
                }
            }
        }

        function transpose(arr) {
            const rows = arr.length;
            const cols = arr[0].length;

            const transposed = [];
            for (let i = 0; i < cols; i++) {
                transposed[i] = [];
                for (let j = 0; j < rows; j++) {
                    transposed[i][j] = arr[j][i];
                }
            }

            return transposed;
        }

        function getCen(s) {
            let cen = [];
            for (let i = 1; i < n - 1; i++) {
                for (let j = 1; j < n - 1; j++) {
                    cen.push(indCube[s][i][j]);
                }
            }
            return cen;
        }

        function isValidColor(inputColor) {
            const tempElement = $('<div>').css('color', 'transparent').css('color', inputColor);
            return tempElement.css('color') !== 'transparent' && inputColor.trim() !== "";
        }
    }

    function drawScrambleNxN(svgID, n, scr, col = ["white", "#FFAA00", "#00FF00", "red", "blue", "yellow"]) {
        $(svgID).empty();
    
        let cube = getState(n, scr);
    
        let width = $(svgID).width();
        let height = 3 * width / 4;
        $(svgID).height(height);
        let space = width / 20;
        let size = ((width - 3 * space) / 4) / n;
        let fill = "";
        let strokeWidth = ((size / n) > 1) ? 1 : 0;
        let stroke = "#1E1E1E";
    
        let coordinates = [
            {
                x1: n * size + space,
                x2: 2 * n * size + space,
                y1: 0,
                y2: n * size,
            },
            {
                x1: 0,
                x2: n * size,
                y1: n * size + space,
                y2: 2 * n * size + space,
            },
            {
                x1: n * size + space,
                x2: 2 * n * size + space,
                y1: n * size + space,
                y2: 2 * n * size + space,
            },
            {
                x1: 2 * n * size + 2 * space,
                x2: 3 * n * size + 2 * space,
                y1: n * size + space,
                y2: 2 * n * size + space,
            },
            {
                x1: 3 * n * size + 3 * space,
                x2: 4 * n * size + 3 * space,
                y1: n * size + space,
                y2: 2 * n * size + space,
            },
            {
                x1: n * size + space,
                x2: 2 * n * size + space,
                y1: 2 * n * size + 2 * space,
                y2: 3 * n * size + 2 * space,
            }
        ];
        
        for (let i = 0; i < 6; i++) {
            let j = 0;
            let x1 = coordinates[i].x1;
            let x2 = coordinates[i].x2;
            let y1 = coordinates[i].y1;
            let y2 = coordinates[i].y2;
    
            let yCount = 0;
            for (let y = y1; y < y2; y += size) {
                let k = 0;
                let xCount = 0;
                for (let x = x1; x < x2; x += size) {
                    if (col.join("") === "white#FFAA00#00FF00redblueyellow") {
                        fill = cube[i][j][k];
                    }
                    else {
                        const oldCols = ["white", "#FFAA00", "#00FF00", "red", "blue", "yellow"];
                        fill = col[oldCols.indexOf(cube[i][j][k])];
                    }
                    
                    let rect = document.createElementNS('http://www.w3.org/2000/svg', "rect");
                    $(rect).attr("x", x);
                    $(rect).attr("y", y);
                    $(rect).attr("width", size);
                    $(rect).attr("height", size);
                    $(rect).attr("style", "fill:"+fill+";stroke:"+stroke+";stroke-width:"+strokeWidth);
                    
                    $(svgID).append(rect);
                    k++;
                    xCount++;
                    if (xCount === n) {
                        break;
                    }
                }
                j++;
                yCount++;
                if (yCount === n) {
                    break;
                }
            }
        }
    }

    function draw333Svg(svgID, scr) {
        resetDrawSvg(svgID);
        applyMoves(scr);
        let arr = getCubeState333();

        
        //let w = $(svgID).width() / 12;
        let w = $(svgID).width() / 13;
        let h = w;
        let space = w/3;
        let fill = "";
        let strokeWidth = 1;
        let stroke = "#1E1E1E";

        let num = 0;
        for (let y = 0*h; y < 3*h; y += h) {
            for (let x = 3*w+space; x < 6*w; x += w) {
                fill = colors333[solvedState333.indexOf(arr[num])];
                
                let rect = document.createElementNS('http://www.w3.org/2000/svg', "rect");
                $(rect).attr("x", x);
                $(rect).attr("y", y);
                $(rect).attr("width", w);
                $(rect).attr("height", h);
                $(rect).attr("style", "fill:"+fill+";stroke:"+stroke+";stroke-width:"+strokeWidth);
                
                $(svgID).append(rect);

                num++;
            }
        }
        for (let y = 3*h+space; y < 6*h; y += h) {
            for (let x = 0*w; x < 3*w; x += w) {
                fill = colors333[solvedState333.indexOf(arr[num])];
                
                let rect = document.createElementNS('http://www.w3.org/2000/svg', "rect");
                $(rect).attr("x", x);
                $(rect).attr("y", y);
                $(rect).attr("width", w);
                $(rect).attr("height", h);
                $(rect).attr("style", "fill:"+fill+";stroke:"+stroke+";stroke-width:"+strokeWidth);
                
                $(svgID).append(rect);

                num++;
            }
        }
        for (let y = 3*h+space; y < 6*h; y += h) {
            for (let x = 3*w+space; x < 6*w; x += w) {
                fill = colors333[solvedState333.indexOf(arr[num])];
                
                let rect = document.createElementNS('http://www.w3.org/2000/svg', "rect");
                $(rect).attr("x", x);
                $(rect).attr("y", y);
                $(rect).attr("width", w);
                $(rect).attr("height", h);
                $(rect).attr("style", "fill:"+fill+";stroke:"+stroke+";stroke-width:"+strokeWidth);
                
                $(svgID).append(rect);

                num++;
            }
        }
        for (let y = 3*h+space; y < 6*h; y += h) {
            for (let x = 6*w+2*space; x < 9*w; x += w) {
                fill = colors333[solvedState333.indexOf(arr[num])];
                
                let rect = document.createElementNS('http://www.w3.org/2000/svg', "rect");
                $(rect).attr("x", x);
                $(rect).attr("y", y);
                $(rect).attr("width", w);
                $(rect).attr("height", h);
                $(rect).attr("style", "fill:"+fill+";stroke:"+stroke+";stroke-width:"+strokeWidth);
                
                $(svgID).append(rect);

                num++;
            }
        }
        for (let y = 3*h+space; y < 6*h; y += h) {
            for (let x = 9*w+3*space; x < 12*w+space; x += w) {
                fill = colors333[solvedState333.indexOf(arr[num])];
                
                let rect = document.createElementNS('http://www.w3.org/2000/svg', "rect");
                $(rect).attr("x", x);
                $(rect).attr("y", y);
                $(rect).attr("width", w);
                $(rect).attr("height", h);
                $(rect).attr("style", "fill:"+fill+";stroke:"+stroke+";stroke-width:"+strokeWidth);
                
                $(svgID).append(rect);

                num++;
            }
        }
        for (let y = 6*h+2*space; y < 9*h; y += h) {
            for (let x = 3*w+space; x < 6*w; x += w) {
                fill = colors333[solvedState333.indexOf(arr[num])];
                
                let rect = document.createElementNS('http://www.w3.org/2000/svg', "rect");
                $(rect).attr("x", x);
                $(rect).attr("y", y);
                $(rect).attr("width", w);
                $(rect).attr("height", h);
                $(rect).attr("style", "fill:"+fill+";stroke:"+stroke+";stroke-width:"+strokeWidth);
                
                $(svgID).append(rect);

                num++;
            }
        }
    }

    function draw222Svg(svgID, scr) {
        resetDrawSvg(svgID);
        applyMoves(scr);
        let arr = getCubeState222();
        
        //let w = $(svgID).width() / 12;
        let w = ($(svgID).width() / 13) * (3/2);
        let h = w;
        let space = ($(svgID).width() / 13) / 3;
        let fill = "";
        let strokeWidth = 1;
        let stroke = "#1E1E1E";

        let num = 0;
        for (let y = 0*h; y < 2*h; y += h) {
            for (let x = 2*w+space; x < 4*w; x += w) {
                fill = colors222[solvedState222.indexOf(arr[num])];
                
                let rect = document.createElementNS('http://www.w3.org/2000/svg', "rect");
                $(rect).attr("x", x);
                $(rect).attr("y", y);
                $(rect).attr("width", w);
                $(rect).attr("height", h);
                $(rect).attr("style", "fill:"+fill+";stroke:"+stroke+";stroke-width:"+strokeWidth);
                
                $(svgID).append(rect);

                num++;
            }
        }
        for (let y = 2*h+space; y < 4*h; y += h) {
            for (let x = 0*w; x < 2*w; x += w) {
                fill = colors222[solvedState222.indexOf(arr[num])];
                
                let rect = document.createElementNS('http://www.w3.org/2000/svg', "rect");
                $(rect).attr("x", x);
                $(rect).attr("y", y);
                $(rect).attr("width", w);
                $(rect).attr("height", h);
                $(rect).attr("style", "fill:"+fill+";stroke:"+stroke+";stroke-width:"+strokeWidth);
                
                $(svgID).append(rect);

                num++;
            }
        }
        for (let y = 2*h+space; y < 4*h; y += h) {
            for (let x = 2*w+space; x < 4*w; x += w) {
                fill = colors222[solvedState222.indexOf(arr[num])];
                
                let rect = document.createElementNS('http://www.w3.org/2000/svg', "rect");
                $(rect).attr("x", x);
                $(rect).attr("y", y);
                $(rect).attr("width", w);
                $(rect).attr("height", h);
                $(rect).attr("style", "fill:"+fill+";stroke:"+stroke+";stroke-width:"+strokeWidth);
                
                $(svgID).append(rect);

                num++;
            }
        }
        for (let y = 2*h+space; y < 4*h; y += h) {
            for (let x = 4*w+2*space; x < 6*w; x += w) {
                fill = colors222[solvedState222.indexOf(arr[num])];
                
                let rect = document.createElementNS('http://www.w3.org/2000/svg', "rect");
                $(rect).attr("x", x);
                $(rect).attr("y", y);
                $(rect).attr("width", w);
                $(rect).attr("height", h);
                $(rect).attr("style", "fill:"+fill+";stroke:"+stroke+";stroke-width:"+strokeWidth);
                
                $(svgID).append(rect);

                num++;
            }
        }
        for (let y = 2*h+space; y < 4*h; y += h) {
            for (let x = 6*w+3*space; x < 8*w+space; x += w) {
                fill = colors222[solvedState222.indexOf(arr[num])];
                
                let rect = document.createElementNS('http://www.w3.org/2000/svg', "rect");
                $(rect).attr("x", x);
                $(rect).attr("y", y);
                $(rect).attr("width", w);
                $(rect).attr("height", h);
                $(rect).attr("style", "fill:"+fill+";stroke:"+stroke+";stroke-width:"+strokeWidth);
                
                $(svgID).append(rect);

                num++;
            }
        }
        for (let y = 4*h+2*space; y < 6*h; y += h) {
            for (let x = 2*w+space; x < 4*w; x += w) {
                fill = colors222[solvedState222.indexOf(arr[num])];
                
                let rect = document.createElementNS('http://www.w3.org/2000/svg', "rect");
                $(rect).attr("x", x);
                $(rect).attr("y", y);
                $(rect).attr("width", w);
                $(rect).attr("height", h);
                $(rect).attr("style", "fill:"+fill+";stroke:"+stroke+";stroke-width:"+strokeWidth);
                
                $(svgID).append(rect);

                num++;
            }
        }
    }

    // Sq1
    function drawScrambleSq1(svgID, scr) {
        resetDrawSvg(svgID);
    
        let sq1 = ["a2","b","c1","c2","d","e1","e2","f","g1","g2","h","a1","i2","j","k1","k2","l","m1","m2","n","o1","o2","p","i1"];
        let sq1T = [];
        let sq1B = [];
        let eFlipped = false;
        let impossible = false;
        let colorT = "yellow";
        let colorB = "white";
        let colorE = "red";
        let colorEF = "#FFAA00";
        let colorBorder = "black";
        let stroke = "#1E1E1E";

        let sSq1 = "";

        let colorsSq1 = [
            "#FFAA00","#FFAA00","#FFAA00","#00FF00","#00FF00","#00FF00","red","red","red","blue","blue","blue",
            "red","red","red","#00FF00","#00FF00","#00FF00","#FFAA00","#FFAA00","#FFAA00","blue","blue","blue"
        ];
        
        let iColorsSq1 = [
            colorT,colorT,colorT,colorT,colorT,colorT,colorT,colorT,colorT,colorT,colorT,colorT,
            colorB,colorB,colorB,colorB,colorB,colorB,colorB,colorB,colorB,colorB,colorB,colorB
        ];

        let svgW = $(svgID).width() / 2;
        let svgH = svgW;
        $(svgID).height(svgH);

        if ($("#drawScrambleSq1").length) {
            $("#drawScrambleSq1").remove();
        }

        let svgs = "<div id='drawScrambleSq1' class='svgScramble'><svg id='sq1T'></svg><svg id='sq1B'></svg><div style='display: grid;place-items: center'><svg id='sq1E'></svg></div></div>";

        $(svgID).parent().append(svgs)
        $("#sq1T").attr("width", svgW);
        $("#sq1T").attr("height", svgH);
        $("#sq1B").attr("width", svgW);
        $("#sq1B").attr("height", svgH);
        $("#sq1E").attr("width", svgW*0.7);
        $("#sq1E").attr("height", svgH*0.7 / 3);

        sSq1 = scr;
        turnSq1();

        let svgWidth = $(svgID).width() / 2;

        let cx = svgWidth/2;
        let cy = svgWidth/2;

        let w = svgWidth;

        let cp0 = [0.2*w,0.2*w];
        let cp1 = rotateSq1(cx, cy, cp0[0], cp0[1], 330);
        let cp2 = rotateSq1(cx, cy, cp1[0], cp1[1], 330);
        let cp3 = rotateSq1(cx, cy, cp2[0], cp2[1], 330);
        let cp4 = rotateSq1(cx, cy, cp3[0], cp3[1], 330);
        let cp5 = rotateSq1(cx, cy, cp4[0], cp4[1], 330);
        let cp6 = rotateSq1(cx, cy, cp5[0], cp5[1], 330);
        let cp7 = rotateSq1(cx, cy, cp6[0], cp6[1], 330);
        let cp8 = rotateSq1(cx, cy, cp7[0], cp7[1], 330);
        let cp9 = rotateSq1(cx, cy, cp8[0], cp8[1], 330);
        let cp10 = rotateSq1(cx, cy, cp9[0], cp9[1], 330);
        let cp11 = rotateSq1(cx, cy, cp10[0], cp10[1], 330);

        let cps = [
            cp0,cp1,cp2,cp3,cp4,cp5,cp6,cp7,cp8,cp9,cp10,cp11
        ];
        
        let ep1 = intersectLines(cx,cy,cp1[0],cp1[1],cp0[0],cp0[1],cp3[0],cp3[1]);
        let ep2 = rotateSq1(cx, cy, ep1[0], ep1[1], 330);
        let ep3 = rotateSq1(cx, cy, ep2[0], ep2[1], 330);
        let ep4 = rotateSq1(cx, cy, ep3[0], ep3[1], 330);
        let ep5 = rotateSq1(cx, cy, ep4[0], ep4[1], 330);
        let ep6 = rotateSq1(cx, cy, ep5[0], ep5[1], 330);
        let ep7 = rotateSq1(cx, cy, ep6[0], ep6[1], 330);
        let ep8 = rotateSq1(cx, cy, ep7[0], ep7[1], 330);
        let ep9 = rotateSq1(cx, cy, ep8[0], ep8[1], 330);
        let ep10 = rotateSq1(cx, cy, ep9[0], ep9[1], 330);
        let ep11 = rotateSq1(cx, cy, ep10[0], ep10[1], 330);
        let ep0 = rotateSq1(cx, cy, ep11[0], ep11[1], 330);

        let eps = [
            ep0,ep1,ep2,ep3,ep4,ep5,ep6,ep7,ep8,ep9,ep10,ep11
        ];

        let icp0 = [0.25*w,0.25*w];
        let icp1 = rotateSq1(cx, cy, icp0[0], icp0[1], 330);
        let icp2 = rotateSq1(cx, cy, icp1[0], icp1[1], 330);
        let icp3 = rotateSq1(cx, cy, icp2[0], icp2[1], 330);
        let icp4 = rotateSq1(cx, cy, icp3[0], icp3[1], 330);
        let icp5 = rotateSq1(cx, cy, icp4[0], icp4[1], 330);
        let icp6 = rotateSq1(cx, cy, icp5[0], icp5[1], 330);
        let icp7 = rotateSq1(cx, cy, icp6[0], icp6[1], 330);
        let icp8 = rotateSq1(cx, cy, icp7[0], icp7[1], 330);
        let icp9 = rotateSq1(cx, cy, icp8[0], icp8[1], 330);
        let icp10 = rotateSq1(cx, cy, icp9[0], icp9[1], 330);
        let icp11 = rotateSq1(cx, cy, icp10[0], icp10[1], 330);

        let icps = [
            icp0,icp1,icp2,icp3,icp4,icp5,icp6,icp7,icp8,icp9,icp10,icp11
        ];
        
        let iep1 = intersectLines(cx,cy,icp1[0],icp1[1],icp0[0],icp0[1],icp3[0],icp3[1]);
        let iep2 = rotateSq1(cx, cy, iep1[0], iep1[1], 330);
        let iep3 = rotateSq1(cx, cy, iep2[0], iep2[1], 330);
        let iep4 = rotateSq1(cx, cy, iep3[0], iep3[1], 330);
        let iep5 = rotateSq1(cx, cy, iep4[0], iep4[1], 330);
        let iep6 = rotateSq1(cx, cy, iep5[0], iep5[1], 330);
        let iep7 = rotateSq1(cx, cy, iep6[0], iep6[1], 330);
        let iep8 = rotateSq1(cx, cy, iep7[0], iep7[1], 330);
        let iep9 = rotateSq1(cx, cy, iep8[0], iep8[1], 330);
        let iep10 = rotateSq1(cx, cy, iep9[0], iep9[1], 330);
        let iep11 = rotateSq1(cx, cy, iep10[0], iep10[1], 330);
        let iep0 = rotateSq1(cx, cy, iep11[0], iep11[1], 330);

        let ieps = [
            iep0,iep1,iep2,iep3,iep4,iep5,iep6,iep7,iep8,iep9,iep10,iep11
        ];

        $("#sq1T").empty();
        $("#sq1B").empty();
        $("#sq1E").empty();

        //OuterColors
        for (let i=0; i<cps.length; i++) {
            let poly = document.createElementNS('http://www.w3.org/2000/svg', "polygon");
            let polyT = document.createElementNS('http://www.w3.org/2000/svg', "polygon");
            let color = colorsSq1[sq1.indexOf(sq1T[i])];
            let iColor = iColorsSq1[sq1.indexOf(sq1T[i])];
            if (sq1T[i].split("").length === 2) {
                if (sq1T[i].split("")[1] === "1") {
                    if (i === cps.length-1) {
                        $(poly).attr("points", cps[0][0]+","+cps[0][1]+" "+cx+","+cy+" "+eps[i][0]+","+eps[i][1]);
                    }
                    else {
                        $(poly).attr("points", cps[i+1][0]+","+cps[i+1][1]+" "+cx+","+cy+" "+eps[i][0]+","+eps[i][1]);
                    }
                }
                else {
                    if (i === cps.length-1) {
                        $(poly).attr("points", cps[i][0]+","+cps[i][1]+" "+cx+","+cy+" "+eps[0][0]+","+eps[0][1]);
                    }
                    else {
                        $(poly).attr("points", cps[i][0]+","+cps[i][1]+" "+cx+","+cy+" "+eps[i+1][0]+","+eps[i+1][1]);
                    }
                }
            }
            else {
                if (i === cps.length-1) {
                    $(poly).attr("points", eps[i][0]+","+eps[i][1]+" "+cx+","+cy+" "+eps[0][0]+","+eps[0][1]);
                    $(polyT).attr("points", ieps[i][0]+","+ieps[i][1]+" "+cx+","+cy+" "+ieps[0][0]+","+ieps[0][1]);
                }
                else {
                    $(poly).attr("points", eps[i][0]+","+eps[i][1]+" "+cx+","+cy+" "+eps[i+1][0]+","+eps[i+1][1]);
                    $(polyT).attr("points", ieps[i][0]+","+ieps[i][1]+" "+cx+","+cy+" "+ieps[i+1][0]+","+ieps[i+1][1]);
                }
            }

            $(poly).attr("style", "fill:"+color+";stroke:"+stroke+";stroke-width:1");
            $(polyT).attr("style", "fill:"+iColor+";stroke:"+stroke+";stroke-width:1");

            $("#sq1T").append(poly);
            $("#sq1T").append(polyT);
        }

        //InnerColors
        for (let i=0; i<icps.length; i++) {
            let polyT = document.createElementNS('http://www.w3.org/2000/svg', "polygon");
            let iColor = iColorsSq1[sq1.indexOf(sq1T[i])];

            if (sq1T[i].split("").length === 2) {
                if (sq1T[i].split("")[1] === "1") {
                    if (i === cps.length-1) {
                        $(polyT).attr("points", cx+","+cy+" "+ieps[i][0]+","+ieps[i][1]+" "+icps[0][0]+","+icps[0][1]+" "+ieps[1][0]+","+ieps[1][1]);
                    }
                    else if (i === cps.length-2) {
                        $(polyT).attr("points", cx+","+cy+" "+ieps[i][0]+","+ieps[i][1]+" "+icps[i+1][0]+","+icps[i+1][1]+" "+ieps[0][0]+","+ieps[0][1]);
                    }
                    else {
                        $(polyT).attr("points", cx+","+cy+" "+ieps[i][0]+","+ieps[i][1]+" "+icps[i+1][0]+","+icps[i+1][1]+" "+ieps[i+2][0]+","+ieps[i+2][1]);
                    }
                }
            }

            $(polyT).attr("style", "fill:"+iColor+";stroke:"+stroke+";stroke-width:1");

            $("#sq1T").append(polyT);
        }

        //OuterColors
        for (let i=0; i<cps.length; i++) {
            let poly = document.createElementNS('http://www.w3.org/2000/svg', "polygon");
            let polyB = document.createElementNS('http://www.w3.org/2000/svg', "polygon");
            let color = colorsSq1[sq1.indexOf(sq1B[i])];
            let iColor = iColorsSq1[sq1.indexOf(sq1B[i])];
            if (sq1B[i].split("").length === 2) {
                if (sq1B[i].split("")[1] === "1") {
                    if (i === cps.length-1) {
                        $(poly).attr("points", cps[0][0]+","+cps[0][1]+" "+cx+","+cy+" "+eps[i][0]+","+eps[i][1]);
                    }
                    else {
                        $(poly).attr("points", cps[i+1][0]+","+cps[i+1][1]+" "+cx+","+cy+" "+eps[i][0]+","+eps[i][1]);
                    }
                }
                else {
                    if (i === cps.length-1) {
                        $(poly).attr("points", cps[i][0]+","+cps[i][1]+" "+cx+","+cy+" "+eps[0][0]+","+eps[0][1]);
                    }
                    else {
                        $(poly).attr("points", cps[i][0]+","+cps[i][1]+" "+cx+","+cy+" "+eps[i+1][0]+","+eps[i+1][1]);
                    }
                }
            }
            else {
                if (i === cps.length-1) {
                    $(poly).attr("points", eps[i][0]+","+eps[i][1]+" "+cx+","+cy+" "+eps[0][0]+","+eps[0][1]);
                    $(polyB).attr("points", ieps[i][0]+","+ieps[i][1]+" "+cx+","+cy+" "+ieps[0][0]+","+ieps[0][1]);
                }
                else {
                    $(poly).attr("points", eps[i][0]+","+eps[i][1]+" "+cx+","+cy+" "+eps[i+1][0]+","+eps[i+1][1]);
                    $(polyB).attr("points", ieps[i][0]+","+ieps[i][1]+" "+cx+","+cy+" "+ieps[i+1][0]+","+ieps[i+1][1]);
                }
            }

            $(poly).attr("style", "fill:"+color+";stroke:"+stroke+";stroke-width:1");
            $(polyB).attr("style", "fill:"+iColor+";stroke:"+stroke+";stroke-width:1");

            $("#sq1B").append(poly);
            $("#sq1B").append(polyB);
        }

        //InnerColors
        for (let i=0; i<icps.length; i++) {
            let polyB = document.createElementNS('http://www.w3.org/2000/svg', "polygon");
            let iColor = iColorsSq1[sq1.indexOf(sq1B[i])];

            if (sq1B[i].split("").length === 2) {
                if (sq1B[i].split("")[1] === "1") {
                    if (i === icps.length-1) {
                        $(polyB).attr("points", cx+","+cy+" "+ieps[i][0]+","+ieps[i][1]+" "+icps[0][0]+","+icps[0][1]+" "+ieps[1][0]+","+ieps[1][1]);
                    }
                    else if (i === icps.length-2) {
                        $(polyB).attr("points", cx+","+cy+" "+ieps[i][0]+","+ieps[i][1]+" "+icps[i+1][0]+","+icps[i+1][1]+" "+ieps[0][0]+","+ieps[0][1]);
                    }
                    else {
                        $(polyB).attr("points", cx+","+cy+" "+ieps[i][0]+","+ieps[i][1]+" "+icps[i+1][0]+","+icps[i+1][1]+" "+ieps[i+2][0]+","+ieps[i+2][1]);
                    }
                }
            }

            $(polyB).attr("style", "fill:"+iColor+";stroke:"+stroke+";stroke-width:1");

            $("#sq1B").append(polyB);
        }

        let sq1EW = $("#sq1E").width();
        let sq1EH = sq1EW/3;

        let rectE1 = document.createElementNS('http://www.w3.org/2000/svg', "rect");
        $(rectE1).attr("x", 0);
        $(rectE1).attr("y", 0);
        $(rectE1).attr("width", sq1EW/3);
        $(rectE1).attr("height", sq1EH);
        $(rectE1).attr("style", "fill:"+colorE+";stroke:"+stroke+";stroke-width:1");
        $("#sq1E").append(rectE1);

        let eW = eFlipped? sq1EW/3: 2*sq1EW/3;
        let eC = eFlipped? colorEF: colorE;
        let rectE2 = document.createElementNS('http://www.w3.org/2000/svg', "rect");
        $(rectE2).attr("x", sq1EW/3);
        $(rectE2).attr("y", 0);
        $(rectE2).attr("width", eW);
        $(rectE2).attr("height", sq1EH);
        $(rectE2).attr("style", "fill:"+eC+";stroke:"+stroke+";stroke-width:1");
        $("#sq1E").append(rectE2);

        function rotateSq1(cx, cy, x, y, angle) {
            let radians = (Math.PI / 180) * angle,
                cos = Math.cos(radians),
                sin = Math.sin(radians),
                nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
                ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
            return [nx, ny];
        }

        function turnSq1() {
            impossible = false;
            resetSq1();
            try {
                let us = [];
                let ds = [];
                let slices = 0;
                let commas = 0;
                let scr = sSq1.replaceAll(" ","");
        
                for (let s of scr.split("")) {
                    if (s === "/") {
                        slices++;
                    }
                    else if (s === ",") {
                        commas++;
                    }
                }
        
                scr = scr.replaceAll("(","");
                scr = scr.replaceAll(")","");
        
                if (scr.split("")[0] === "/") {
                    sliceSq1();
                    slices--;
                }
        
                for (let t of scr.split("/")) {
                    if (t.split(",").length === 2) {
                        us.push(parseInt(t.split(",")[0]));
                        ds.push(parseInt(t.split(",")[1]));
                    }
                }
        
                let scrambleOk = (
                    sSq1.replaceAll(" ","").replaceAll("(","").replaceAll(")","").replaceAll("-","").replaceAll("/","").replaceAll(",","")
                    .replaceAll("0","").replaceAll("1","").replaceAll("2","").replaceAll("3","").replaceAll("4","").replaceAll("5","").replaceAll("6","")) === "" 
                    && us.length === ds.length && !us.includes(NaN) && !ds.includes(NaN) && commas === us.length && (slices === us.length || slices === us.length + 1 || slices === us.length - 1);
        
                if (scrambleOk) {
                    for (let i=0; i<us.length; i++) {
                        uSq1(us[i]);
                        dSq1(ds[i]);
                        if (slices !== 0) {
                            sliceSq1();
                            slices--;
                        }
                    }
                }
                else {
                    resetSq1()
                }
        
                if (impossible) {
                    $("#inpScramble").css("color","red");
                    resetSq1();
                    drawSq1();
                }
            } catch (error) {
                resetSq1();
            }
        }
        
        function uSq1(number) {
            let arr = [];
            let temp = sq1T;
        
            arr = turnFaceSq1(arr, temp, number);
        
            sq1T = arr;
        }
        
        function dSq1(number) {
            let arr = [];
            let temp = sq1B;
        
            arr = turnFaceSq1(arr, temp, number);
        
            sq1B = arr;
        }
        
        function turnFaceSq1(arr, temp, number) {
            for (let i=0; i<temp.length; i++) {
                if (number === 0) {
                    arr = temp;
                }
                else if (number > 0) {
                    if (i-number < 0) {
                        arr[i] = temp[i-number+temp.length];
                    }
                    else {
                        arr[i] = temp[i-number];
                    }
                }
                else if (number < 0) {
                    if (i-number >= temp.length) {
                        arr[i] = temp[i-number-temp.length];
                    }
                    else {
                        arr[i] = temp[i-number];
                    }
                }
            }
        
            return arr;
        }
        
        function sliceSq1() {
            if (canSliceSq1()) {
                eFlipped = !eFlipped;
                let arrT = sq1T;
                let arrB = sq1B;
                let temp = arrT.concat();
        
                for (let i=2; i<8; i++) {
                    arrT[i] = arrB[i-1];
                }
                for (let i=1; i<7; i++) {
                    arrB[i] = temp[i+1];
                }
        
                sq1T = arrT;
                sq1B = arrB;
            }
            else {
                impossible = true;
            }
        }
        
        function canSliceSq1() {
            return (sq1T[1].split("")[0] !== sq1T[2].split("")[0] && sq1T[7].split("")[0] !== sq1T[8].split("")[0] && 
                    sq1B[0].split("")[0] !== sq1B[1].split("")[0] && sq1B[6].split("")[0] !== sq1B[7].split("")[0]);
        }
        
        function resetSq1() {
            sq1T = sq1.slice(0,12);
            sq1B = sq1.slice(12,24);
            eFlipped = false;
        }
    }

    // Skewb
    function drawScrambleSkewb(svgID, scr, advanced = false) {
        $(svgID).empty();
        let n = 3;
    
        let moves = ["U", "U'", "R", "R'", "L", "L'", "B", "B'"];
        let movesA = ["F", "F'", "R", "R'", "L", "L'", "B", "B'", "f", "f'", "r", "r'", "l", "l'", "b", "b'"];
        let movesAC = ["z y' R y z'", "z y' R' y z'", "z R z'", "z R' z'", "z' L z", "z' L' z", "x B x'", "x B' x'", "y' R y", "y' R' y", "R", "R'", "L", "L'", "B", "B'"];
    
        if (advanced) {
            scr = scr.split(" ").map(s => movesAC[movesA.indexOf(s)]).join(" ");
        }

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
        
        let cube = getSkewbState(scr);
    
        let width = $(svgID).width();
        let height = 3 * width / 4;
        $(svgID).height(height);
        let space = width / 20;
        let size = ((width - 3 * space) / 4) / n;
        let fill = "";
        let stroke = "#1E1E1E";
        let strokeWidth = ((size / n) > 1) ? 1 : 0;
    
        let coordinates = [
            {
                x1: n * size + space,
                x2: 2 * n * size + space,
                y1: 0,
                y2: n * size,
            },
            {
                x1: 0,
                x2: n * size,
                y1: n * size + space,
                y2: 2 * n * size + space,
            },
            {
                x1: n * size + space,
                x2: 2 * n * size + space,
                y1: n * size + space,
                y2: 2 * n * size + space,
            },
            {
                x1: 2 * n * size + 2 * space,
                x2: 3 * n * size + 2 * space,
                y1: n * size + space,
                y2: 2 * n * size + space,
            },
            {
                x1: 3 * n * size + 3 * space,
                x2: 4 * n * size + 3 * space,
                y1: n * size + space,
                y2: 2 * n * size + space,
            },
            {
                x1: n * size + space,
                x2: 2 * n * size + space,
                y1: 2 * n * size + 2 * space,
                y2: 3 * n * size + 2 * space,
            }
        ];
        
    
        let cWhite = [cube[0], cube[3], cube[6], cube[9], cube[24]];
        let cYellow = [cube[12], cube[15], cube[18], cube[21], cube[29]];
        let cGreen = [cube[10], cube[8], cube[16], cube[14], cube[26]];
        let cBlue = [cube[4], cube[2], cube[22], cube[20], cube[28]];
        let cRed = [cube[7], cube[5], cube[19], cube[17], cube[27]];
        let cOrange = [cube[1], cube[11], cube[13], cube[23], cube[25]];
        let colors = [cWhite, cOrange, cGreen, cRed, cBlue, cYellow];
    
        for (let i = 0; i < 6; i++) {
            let j = 0;
            let x1 = coordinates[i].x1;
            let x2 = coordinates[i].x2;
            let y1 = coordinates[i].y1;
            let y2 = coordinates[i].y2;
    
            let points = [
                x1+","+y1+" "+(x1+(x2-x1)/2)+","+y1+" "+x1+","+(y1+(y2-y1)/2)+" "+x1+","+y1,
                x2+","+y1+" "+x2+","+(y1+(y2-y1)/2)+" "+(x1+(x2-x1)/2)+","+y1+" "+x2+","+y1,
                x2+","+y2+" "+(x1+(x2-x1)/2)+","+y2+" "+x2+","+(y1+(y2-y1)/2)+" "+x2+","+y2,
                x1+","+y2+" "+x1+","+(y1+(y2-y1)/2)+" "+(x1+(x2-x1)/2)+","+y2+" "+x1+","+y2,
                (x1+(x2-x1)/2)+","+y1+" "+x2+","+(y1+(y2-y1)/2)+" "+(x1+(x2-x1)/2)+","+y2+" "+x1+","+(y1+(y2-y1)/2)+" "+(x1+(x2-x1)/2)+","+y1
            ];
    
            for (let p of points) {
                fill = getSkewbColor(colors[i].shift());
                    
                let poly = document.createElementNS('http://www.w3.org/2000/svg', "polygon");
                $(poly).attr("points", p);
                $(poly).attr("style", "fill:"+fill+";stroke:"+stroke+";stroke-width:"+strokeWidth);
                
                $(svgID).append(poly);
            }
        }
    
        function getSkewbColor(n) {
            switch (n) {
                case "1":
                    return "white";
                case "2":
                    return "yellow";
                case "3":
                    return "#00FF00";
                case "4":
                    return "blue";
                case "5":
                    return "red";
                case "6":
                    return "#FFAA00";
            }
        }
    
        function cleanMoves(m) {
            while (m.includes("&nbsp;&nbsp;")) {
                m.replaceAll("&nbsp;&nbsp;", "&nbsp;");
            }
        
            return m.trim();
        }
    
        function getSkewbState(sol) {
            resetCubeState();
            sol = cleanMoves(sol);
            let arr = Array.isArray(sol) ? sol : sol.trim().split(" ");
            for (let a of arr) {
                switch (a.replaceAll("*","")) {
                    case "R":
                        _r();
                        break;
                    case "R'":
                        _ri();
                        break;
                    case "L":
                        _l();
                        break;
                    case "L'":
                        _li();
                        break;
                    case "B":
                        _b();
                        break;
                    case "B'":
                        _bi();
                        break;
                    case "U":
                        _u();
                        break;
                    case "U'":
                        _ui();
                        break;
                    case "x":
                        _x();
                        break;
                    case "x2":
                        _x2();
                        break;
                    case "x'":
                        _xi();
                        break;
                    case "y":
                        _y();
                        break;
                    case "y2":
                        _y2();
                        break;
                    case "y'":
                        _yi();
                        break;
                    case "z":
                        _z();
                        break;
                    case "z2":
                        _z2();
                        break;
                    case "z'":
                        _zi();
                        break;
                }
            }
        
            return skewbCo.map(s => s.c1 + s.c2 + s.c3).join("") + skewbCe.map(s => s.c).join("");
        }
        
        function resetCubeState() {
            skewbCo = cleanSkewbCo.slice();
            skewbCe = cleanSkewbCe.slice();
        }
        
        function _r() {
            let tempCo = skewbCo.slice();
    
            skewbCo[6] = new Corner(tempCo[6].c3, tempCo[6].c1, tempCo[6].c2);
            skewbCo[1] = new Corner(tempCo[5].c2, tempCo[5].c3, tempCo[5].c1);
            skewbCo[7] = new Corner(tempCo[1].c2, tempCo[1].c3, tempCo[1].c1);
            skewbCo[5] = new Corner(tempCo[7].c2, tempCo[7].c3, tempCo[7].c1);
    
            let tempCe = skewbCe.slice();
    
            skewbCe[3] = new Center(tempCe[5].c);
            skewbCe[4] = new Center(tempCe[3].c);
            skewbCe[5] = new Center(tempCe[4].c);
        }
        function _ri() {
            _r();
            _r();
        }
        function _l() {
            let tempCo = skewbCo.slice();
    
            skewbCo[4] = new Corner(tempCo[4].c3, tempCo[4].c1, tempCo[4].c2);
            skewbCo[3] = new Corner(tempCo[7].c2, tempCo[7].c3, tempCo[7].c1);
            skewbCo[5] = new Corner(tempCo[3].c2, tempCo[3].c3, tempCo[3].c1);
            skewbCo[7] = new Corner(tempCo[5].c2, tempCo[5].c3, tempCo[5].c1);
    
            let tempCe = skewbCe.slice();
    
            skewbCe[1] = new Center(tempCe[5].c);
            skewbCe[2] = new Center(tempCe[1].c);
            skewbCe[5] = new Center(tempCe[2].c);
        }
        function _li() {
            _l();
            _l();
        }
        function _b() {
            let tempCo = skewbCo.slice();
    
            skewbCo[7] = new Corner(tempCo[7].c3, tempCo[7].c1, tempCo[7].c2);
            skewbCo[0] = new Corner(tempCo[6].c2, tempCo[6].c3, tempCo[6].c1);
            skewbCo[4] = new Corner(tempCo[0].c2, tempCo[0].c3, tempCo[0].c1);
            skewbCo[6] = new Corner(tempCo[4].c2, tempCo[4].c3, tempCo[4].c1);
    
            let tempCe = skewbCe.slice();
    
            skewbCe[1] = new Center(tempCe[4].c);
            skewbCe[4] = new Center(tempCe[5].c);
            skewbCe[5] = new Center(tempCe[1].c);
        }
        function _bi() {
            _b();
            _b();
        }
        function _u() {
            let tempCo = skewbCo.slice();
    
            skewbCo[0] = new Corner(tempCo[0].c3, tempCo[0].c1, tempCo[0].c2);
            skewbCo[1] = new Corner(tempCo[7].c2, tempCo[7].c3, tempCo[7].c1);
            skewbCo[3] = new Corner(tempCo[1].c2, tempCo[1].c3, tempCo[1].c1);
            skewbCo[7] = new Corner(tempCo[3].c2, tempCo[3].c3, tempCo[3].c1);
    
            let tempCe = skewbCe.slice();
    
            skewbCe[0] = new Center(tempCe[4].c);
            skewbCe[1] = new Center(tempCe[0].c);
            skewbCe[4] = new Center(tempCe[1].c);
        }
        function _ui() {
            _u();
            _u();
        }
        function _x() {
            let tempCo = skewbCo.slice();
    
            skewbCo[0] = new Corner(tempCo[3].c2, tempCo[3].c3, tempCo[3].c1);
            skewbCo[1] = new Corner(tempCo[2].c3, tempCo[2].c1, tempCo[2].c2);
            skewbCo[2] = new Corner(tempCo[5].c2, tempCo[5].c3, tempCo[5].c1);
            skewbCo[3] = new Corner(tempCo[4].c3, tempCo[4].c1, tempCo[4].c2);
            skewbCo[4] = new Corner(tempCo[7].c2, tempCo[7].c3, tempCo[7].c1);
            skewbCo[5] = new Corner(tempCo[6].c3, tempCo[6].c1, tempCo[6].c2);
            skewbCo[6] = new Corner(tempCo[1].c2, tempCo[1].c3, tempCo[1].c1);
            skewbCo[7] = new Corner(tempCo[0].c3, tempCo[0].c1, tempCo[0].c2);
    
            let tempCe = skewbCe.slice();
    
            skewbCe[0] = new Center(tempCe[2].c);
            skewbCe[2] = new Center(tempCe[5].c);
            skewbCe[5] = new Center(tempCe[4].c);
            skewbCe[4] = new Center(tempCe[0].c);
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
            let tempCo = skewbCo.slice();
    
            skewbCo[0] = new Corner(tempCo[3].c1, tempCo[3].c2, tempCo[3].c3);
            skewbCo[1] = new Corner(tempCo[0].c1, tempCo[0].c2, tempCo[0].c3);
            skewbCo[2] = new Corner(tempCo[1].c1, tempCo[1].c2, tempCo[1].c3);
            skewbCo[3] = new Corner(tempCo[2].c1, tempCo[2].c2, tempCo[2].c3);
            skewbCo[4] = new Corner(tempCo[5].c1, tempCo[5].c2, tempCo[5].c3);
            skewbCo[5] = new Corner(tempCo[6].c1, tempCo[6].c2, tempCo[6].c3);
            skewbCo[6] = new Corner(tempCo[7].c1, tempCo[7].c2, tempCo[7].c3);
            skewbCo[7] = new Corner(tempCo[4].c1, tempCo[4].c2, tempCo[4].c3);
    
            let tempCe = skewbCe.slice();
    
            skewbCe[1] = new Center(tempCe[2].c);
            skewbCe[2] = new Center(tempCe[3].c);
            skewbCe[3] = new Center(tempCe[4].c);
            skewbCe[4] = new Center(tempCe[1].c);
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
            let tempCo = skewbCo.slice();
    
            skewbCo[0] = new Corner(tempCo[7].c3, tempCo[7].c1, tempCo[7].c2);
            skewbCo[1] = new Corner(tempCo[0].c2, tempCo[0].c3, tempCo[0].c1);
            skewbCo[2] = new Corner(tempCo[3].c3, tempCo[3].c1, tempCo[3].c2);
            skewbCo[3] = new Corner(tempCo[4].c2, tempCo[4].c3, tempCo[4].c1);
            skewbCo[4] = new Corner(tempCo[5].c3, tempCo[5].c1, tempCo[5].c2);
            skewbCo[5] = new Corner(tempCo[2].c2, tempCo[2].c3, tempCo[2].c1);
            skewbCo[6] = new Corner(tempCo[1].c3, tempCo[1].c1, tempCo[1].c2);
            skewbCo[7] = new Corner(tempCo[6].c2, tempCo[6].c3, tempCo[6].c1);
    
            let tempCe = skewbCe.slice();
    
            skewbCe[0] = new Center(tempCe[1].c);
            skewbCe[1] = new Center(tempCe[5].c);
            skewbCe[5] = new Center(tempCe[3].c);
            skewbCe[3] = new Center(tempCe[0].c);
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
    }

    // Pyraminx
    function drawScramblePyraminx(svgID, scr) {
        $(svgID).empty();
    
        let moves = ["U", "U'", "R", "R'", "L", "L'", "B", "B'"];
        let tipsMoves = ["u", "u'", "r", "r'", "l", "l'", "b", "b'"];
    
        let cR = "1";
        let cG = "2";
        let cB = "3";
        let cY = "4";

        let pyraL = [cR, cR, cR, cR, cR, cR, cR, cR, cR];
        let pyraF = [cG, cG, cG, cG, cG, cG, cG, cG, cG];
        let pyraR = [cB, cB, cB, cB, cB, cB, cB, cB, cB];
        let pyraD = [cY, cY, cY, cY, cY, cY, cY, cY, cY];
    
        let cleanPyraminx = [pyraL, pyraF, pyraR, pyraD];
        let pyraminx = [pyraL, pyraF, pyraR, pyraD];
        
        let pyra = getPyraminxState(scr);
    
        let width = $(svgID).width() * 0.8;
        let height = Math.sqrt(3) * width / 2;
        $(svgID).height(height);
        let space = width / 20;
        let size = (height - space) / 2;
        let t = size / 3;
        let fill = "";
        let stroke = "#1E1E1E";
        let strokeWidth = 1;
    
        let coordinates = [
            {
                x1: 0,
                y1: 0
            },
            {
                x1: size + space,
                y1: 0
            },
            {
                x1: size + 2 * space,
                y1: 0
            },
            {
                x1: 0.5 * size + space,
                y1: space + size * Math.sqrt(3) / 2
            }
        ];
        
        let cRed = [pyra[0][0], pyra[0][1], pyra[0][2], pyra[0][3], pyra[0][4], pyra[0][5], pyra[0][6], pyra[0][7], pyra[0][8]];
        let cGreen = [pyra[1][0], pyra[1][1], pyra[1][2], pyra[1][3], pyra[1][4], pyra[1][5], pyra[1][6], pyra[1][7], pyra[1][8]];
        let cBlue = [pyra[2][0], pyra[2][1], pyra[2][2], pyra[2][3], pyra[2][4], pyra[2][5], pyra[2][6], pyra[2][7], pyra[2][8]];
        let cYellow = [pyra[3][0], pyra[3][1], pyra[3][2], pyra[3][3], pyra[3][4], pyra[3][5], pyra[3][6], pyra[3][7], pyra[3][8]];
    
        for (let i = 0; i < 4; i++) {
            let j = 0;
            let x1 = coordinates[i].x1;
            let y1 = coordinates[i].y1;
    
            let points = [
                x1+","+y1+" "+(x1+t)+","+y1+" "+(x1+0.5*t)+","+(y1+t*Math.sqrt(3)/2)+" "+x1+","+y1,
                (x1+t)+","+y1+" "+(x1+1.5*t)+","+(y1+t*Math.sqrt(3)/2)+" "+(x1+0.5*t)+","+(y1+t*Math.sqrt(3)/2)+" "+(x1+t)+","+y1,
                (x1+t)+","+y1+" "+(x1+2*t)+","+y1+" "+(x1+1.5*t)+","+(y1+t*Math.sqrt(3)/2)+" "+(x1+t)+","+y1,
                (x1+2*t)+","+y1+" "+(x1+2.5*t)+","+(y1+t*Math.sqrt(3)/2)+" "+(x1+1.5*t)+","+(y1+t*Math.sqrt(3)/2)+" "+(x1+2*t)+","+y1,
                (x1+2*t)+","+y1+" "+(x1+3*t)+","+y1+" "+(x1+2.5*t)+","+(y1+t*Math.sqrt(3)/2)+" "+(x1+2*t)+","+y1,
                (x1+0.5*t)+","+(y1+t*Math.sqrt(3)/2)+" "+(x1+1.5*t)+","+(y1+t*Math.sqrt(3)/2)+" "+(x1+t)+","+(y1+2*t*Math.sqrt(3)/2)+" "+(x1+t/2)+","+(y1+t*Math.sqrt(3)/2),
                (x1+1.5*t)+","+(y1+t*Math.sqrt(3)/2)+" "+(x1+2*t)+","+(y1+2*t*Math.sqrt(3)/2)+" "+(x1+t)+","+(y1+2*t*Math.sqrt(3)/2)+" "+(x1+1.5*t)+","+(y1+t*Math.sqrt(3)/2),
                (x1+1.5*t)+","+(y1+t*Math.sqrt(3)/2)+" "+(x1+2.5*t)+","+(y1+t*Math.sqrt(3)/2)+" "+(x1+2*t)+","+(y1+2*t*Math.sqrt(3)/2)+" "+(x1+1.5*t)+","+(y1+t*Math.sqrt(3)/2),
                (x1+t)+","+(y1+2*t*Math.sqrt(3)/2)+" "+(x1+2*t)+","+(y1+2*t*Math.sqrt(3)/2)+" "+(x1+1.5*t)+","+(y1+3*t*Math.sqrt(3)/2)+" "+(x1+t)+","+(y1+2*t*Math.sqrt(3)/2)
            ];
    
            let pointsF = [
                x1+","+y1+" "+(x1+0.5*t)+","+(y1+t*Math.sqrt(3)/2)+" "+(x1-0.5*t)+","+(y1+t*Math.sqrt(3)/2)+" "+x1+","+y1,
                (x1-0.5*t)+","+(y1+t*Math.sqrt(3)/2)+" "+x1+","+(y1+2*t*Math.sqrt(3)/2)+" "+(x1-1*t)+","+(y1+2*t*Math.sqrt(3)/2)+" "+(x1-0.5*t)+","+(y1+t*Math.sqrt(3)/2),
                (x1-0.5*t)+","+(y1+t*Math.sqrt(3)/2)+" "+(x1+0.5*t)+","+(y1+t*Math.sqrt(3)/2)+" "+x1+","+(y1+2*t*Math.sqrt(3)/2)+" "+(x1-0.5*t)+","+(y1+t*Math.sqrt(3)/2),
                (x1+0.5*t)+","+(y1+t*Math.sqrt(3)/2)+" "+(x1+t)+","+(y1+2*t*Math.sqrt(3)/2)+" "+x1+","+(y1+2*t*Math.sqrt(3)/2)+" "+(x1+0.5*t)+","+(y1+t*Math.sqrt(3)/2),
                (x1-1*t)+","+(y1+2*t*Math.sqrt(3)/2)+" "+(x1-0.5*t)+","+(y1+3*t*Math.sqrt(3)/2)+" "+(x1-1.5*t)+","+(y1+3*t*Math.sqrt(3)/2)+" "+(x1-1*t)+","+(y1+2*t*Math.sqrt(3)/2),
                (x1-1*t)+","+(y1+2*t*Math.sqrt(3)/2)+" "+x1+","+(y1+2*t*Math.sqrt(3)/2)+" "+(x1-0.5*t)+","+(y1+3*t*Math.sqrt(3)/2)+" "+(x1-1*t)+","+(y1+2*t*Math.sqrt(3)/2),
                x1+","+(y1+2*t*Math.sqrt(3)/2)+" "+(x1+0.5*t)+","+(y1+3*t*Math.sqrt(3)/2)+" "+(x1-0.5*t)+","+(y1+3*t*Math.sqrt(3)/2)+" "+x1+","+(y1+2*t*Math.sqrt(3)/2),
                x1+","+(y1+2*t*Math.sqrt(3)/2)+" "+(x1+t)+","+(y1+2*t*Math.sqrt(3)/2)+" "+(x1+0.5*t)+","+(y1+3*t*Math.sqrt(3)/2)+" "+x1+","+(y1+2*t*Math.sqrt(3)/2),
                (x1+t)+","+(y1+2*t*Math.sqrt(3)/2)+" "+(x1+1.5*t)+","+(y1+3*t*Math.sqrt(3)/2)+" "+(x1+0.5*t)+","+(y1+3*t*Math.sqrt(3)/2)+" "+(x1+t)+","+(y1+2*t*Math.sqrt(3)/2),
            ];

            let pts = i === 1 ? pointsF : points;
    
            for (let p of pts) {
                fill = getPyraminxColor(pyra[i][j]);
                    
                let poly = document.createElementNS('http://www.w3.org/2000/svg', "polygon");
                $(poly).attr("points", p);
                $(poly).attr("style", "fill:"+fill+";stroke:"+stroke+";stroke-width:"+strokeWidth);
                
                $(svgID).append(poly);
                j++;
            }
        }
    
        function getPyraminxColor(n) {
            switch (n) {
                case "1":
                    return "#FF0000";
                case "2":
                    return "#00FF00";
                case "3":
                    return "blue";
                case "4":
                    return "yellow";
            }
        }
    
        function cleanMoves(m) {
            while (m.includes("&nbsp;&nbsp;")) {
                m.replaceAll("&nbsp;&nbsp;", "&nbsp;");
            }
        
            return m.trim();
        }
    
        function getPyraminxState(sol) {
            resetCubeState();
            sol = cleanMoves(sol);
            let arr = Array.isArray(sol) ? sol : sol.trim().split(" ");
            for (let a of arr) {
                switch (a.replaceAll("*","")) {
                    case "R":
                        _R();
                        break;
                    case "R'":
                        _Ri();
                        break;
                    case "L":
                        _L();
                        break;
                    case "L'":
                        _Li();
                        break;
                    case "B":
                        _B();
                        break;
                    case "B'":
                        _Bi();
                        break;
                    case "U":
                        _U();
                        break;
                    case "U'":
                        _Ui();
                        break;
                    case "r":
                        _r();
                        break;
                    case "r'":
                        _ri();
                        break;
                    case "l":
                        _l();
                        break;
                    case "l'":
                        _li();
                        break;
                    case "b":
                        _b();
                        break;
                    case "b'":
                        _bi();
                        break;
                    case "u":
                        _u();
                        break;
                    case "u'":
                        _ui();
                        break;
                }
            }
        
            return pyraminx;
        }
        
        function resetCubeState() {
            pyraminx = cleanPyraminx.slice();
        }
        
        function _R() {
            let p = pyraminx;
            let tempTip = p[1][8];
            let tempCe = p[1][7];
            let tempE1 = p[1][6];
            let tempE2 = p[1][3];

            p[1][8] = p[3][4];
            p[3][4] = p[2][8];
            p[2][8] = tempTip;

            p[1][7] = p[3][3];
            p[3][3] = p[2][6];
            p[2][6] = tempCe;

            p[1][6] = p[3][7];
            p[3][7] = p[2][5];
            p[2][5] = tempE1;

            p[1][3] = p[3][2];
            p[3][2] = p[2][7];
            p[2][7] = tempE2;
        }
        function _Ri() {
            _R();
            _R();
        }
        function _L() {
            let p = pyraminx;
            let tempTip = p[1][4];
            let tempCe = p[1][5];
            let tempE1 = p[1][6];
            let tempE2 = p[1][1];

            p[1][4] = p[0][8];
            p[0][8] = p[3][0];
            p[3][0] = tempTip;

            p[1][5] = p[0][6];
            p[0][6] = p[3][1];
            p[3][1] = tempCe;

            p[1][6] = p[0][7];
            p[0][7] = p[3][5];
            p[3][5] = tempE1;

            p[1][1] = p[0][5];
            p[0][5] = p[3][2];
            p[3][2] = tempE2;
        }
        function _Li() {
            _L();
            _L();
        }
        function _B() {
            let p = pyraminx;
            let tempTip = p[3][8];
            let tempCe = p[3][6];
            let tempE1 = p[3][7];
            let tempE2 = p[3][5];

            p[3][8] = p[0][0];
            p[0][0] = p[2][4];
            p[2][4] = tempTip;

            p[3][6] = p[0][1];
            p[0][1] = p[2][3];
            p[2][3] = tempCe;

            p[3][7] = p[0][5];
            p[0][5] = p[2][2];
            p[2][2] = tempE1;

            p[3][5] = p[0][2];
            p[0][2] = p[2][7];
            p[2][7] = tempE2;
        }
        function _Bi() {
            _B();
            _B();
        }
        function _U() {
            let p = pyraminx;
            let tempTip = p[1][0];
            let tempCe = p[1][2];
            let tempE1 = p[1][1];
            let tempE2 = p[1][3];

            p[1][0] = p[2][0];
            p[2][0] = p[0][4];
            p[0][4] = tempTip;

            p[1][2] = p[2][1];
            p[2][1] = p[0][3];
            p[0][3] = tempCe;

            p[1][1] = p[2][5];
            p[2][5] = p[0][2];
            p[0][2] = tempE1;

            p[1][3] = p[2][2];
            p[2][2] = p[0][7];
            p[0][7] = tempE2;
        }
        function _Ui() {
            _U();
            _U();
        }
        function _r() {
            let p = pyraminx;
            let tempTip = p[1][8];

            p[1][8] = p[3][4];
            p[3][4] = p[2][8];
            p[2][8] = tempTip;
        }
        function _ri() {
            _r();
            _r();
        }
        function _l() {
            let p = pyraminx;
            let tempTip = p[1][4];

            p[1][4] = p[0][8];
            p[0][8] = p[3][0];
            p[3][0] = tempTip;
        }
        function _li() {
            _l();
            _l();
        }
        function _b() {
            let p = pyraminx;
            let tempTip = p[3][8];

            p[3][8] = p[0][0];
            p[0][0] = p[2][4];
            p[2][4] = tempTip;
        }
        function _bi() {
            _b();
            _b();
        }
        function _u() {
            let p = pyraminx;
            let tempTip = p[1][0];

            p[1][0] = p[2][0];
            p[2][0] = p[0][4];
            p[0][4] = tempTip;
        }
        function _ui() {
            _u();
            _u();
        }
    }

    // Megaminx
    function drawScrambleMegaminx(svgID, scr) {
        $(svgID).empty();
    
        let cleanMega = [
            ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1"],
            ["2", "2", "2", "2", "2", "2", "2", "2", "2", "2"],
            ["3", "3", "3", "3", "3", "3", "3", "3", "3", "3"],
            ["4", "4", "4", "4", "4", "4", "4", "4", "4", "4"],
            ["5", "5", "5", "5", "5", "5", "5", "5", "5", "5"],
            ["6", "6", "6", "6", "6", "6", "6", "6", "6", "6"],
            ["a", "a", "a", "a", "a", "a", "a", "a", "a", "a"],
            ["b", "b", "b", "b", "b", "b", "b", "b", "b", "b"],
            ["c", "c", "c", "c", "c", "c", "c", "c", "c", "c"],
            ["d", "d", "d", "d", "d", "d", "d", "d", "d", "d"],
            ["e", "e", "e", "e", "e", "e", "e", "e", "e", "e"],
            ["f", "f", "f", "f", "f", "f", "f", "f", "f", "f"]
        ];
        let mega = cleanMega.slice();

        let cleanMegaCenters = ["1", "2", "3", "4", "5", "6", "a", "b", "c", "d", "e", "f"];
        let megaCenters = cleanMegaCenters.slice();
        
        getMegaState(scr);
        
        let width = $(svgID).width();
        let height = width * 0.6;
        $(svgID).height(height);
        let space = width / 30;
        let a = width / 10;
        let diag = a * (1 + Math.sqrt(5)) / 2;
        let megaH = a * Math.sqrt(5 + 2*Math.sqrt(5)) / 2;
        let megaHs = megaH - (Math.sqrt(a*a-(diag/2)*(diag/2)));
        let size = width / 6;
        let ang = 360 / 5;
        let fill = "";
        let stroke = "#000000";
        let strokeWidth = 1;
        let megaColors = ["#FFFFFF", "#006600", "#DD0000", "#0000B3", "#FFCC00", "#8A1AFF", "#999999", "#71E600", "#FF99FF", "#FFFFB3", "#88DDFF", "#FF8433"];

        let points = [];
        let pntM;
        let pnt;
        let cxM;
        let cyM;
        let cx5;
        let cx2;
        let cy2;

        for (let i = 0; i < 12; i++) {
            let c = [0, 4, 3, 2, 1, 5, 0, 4, 3, 2, 1, 5][i];
            if (i === 0) {
                cxM = size*1.5;
                cyM = height / 2;
                pntM = [
                    {x: cxM, y: cyM},
                    {x: rotatePoint(cxM, cyM-a, cxM, cyM, 0, false).x, y: rotatePoint(cxM, cyM-a, cxM, cyM, 0, false).y},
                    {x: rotatePoint(cxM, cyM-a, cxM, cyM, ang * 1, false).x, y: rotatePoint(cxM, cyM-a, cxM, cyM, ang * 1, false).y},
                    {x: rotatePoint(cxM, cyM-a, cxM, cyM, ang * 2, false).x, y: rotatePoint(cxM, cyM-a, cxM, cyM, ang * 2, false).y},
                    {x: rotatePoint(cxM, cyM-a, cxM, cyM, ang * 3, false).x, y: rotatePoint(cxM, cyM-a, cxM, cyM, ang * 3, false).y},
                    {x: rotatePoint(cxM, cyM-a, cxM, cyM, ang * 4, false).x, y: rotatePoint(cxM, cyM-a, cxM, cyM, ang * 4, false).y},
                    {x: rotatePoint(cxM, cyM-a, cxM, cyM, ang * 5, false).x, y: rotatePoint(cxM, cyM-a, cxM, cyM, ang * 5, false).y}
                ];

                pnt = pntM.slice();
        
                points.push(pnt);
            }
            else if (i === 6) {
                cxM = 2 * cx2 - cx5;
                cyM = cy2;
                pntM = [
                    {x: cxM, y: cyM},
                    {x: rotatePoint(cxM, cyM+a, cxM, cyM, 0, false).x, y: rotatePoint(cxM, cyM+a, cxM, cyM, 0, false).y},
                    {x: rotatePoint(cxM, cyM+a, cxM, cyM, ang * 1, false).x, y: rotatePoint(cxM, cyM+a, cxM, cyM, ang * 1, false).y},
                    {x: rotatePoint(cxM, cyM+a, cxM, cyM, ang * 2, false).x, y: rotatePoint(cxM, cyM+a, cxM, cyM, ang * 2, false).y},
                    {x: rotatePoint(cxM, cyM+a, cxM, cyM, ang * 3, false).x, y: rotatePoint(cxM, cyM+a, cxM, cyM, ang * 3, false).y},
                    {x: rotatePoint(cxM, cyM+a, cxM, cyM, ang * 4, false).x, y: rotatePoint(cxM, cyM+a, cxM, cyM, ang * 4, false).y},
                    {x: rotatePoint(cxM, cyM+a, cxM, cyM, ang * 5, false).x, y: rotatePoint(cxM, cyM+a, cxM, cyM, ang * 5, false).y}
                ];

                pnt = pntM.slice();

                points.push(pnt);
            }
            else if (i === 1 || i === 7) {
                let cx = rotatePoint(cxM, cyM, (pntM[3].x+pntM[4].x)/2, pntM[3].y, 180, false).x;
                let cy = rotatePoint(cxM, cyM, (pntM[3].x+pntM[4].x)/2, pntM[3].y, 180, false).y;
                let point = [
                    {x: cx, y: cy},
                    {x: pntM[c].x, y: pntM[c].y},
                    {x: rotatePoint(pntM[c].x, pntM[c].y, cx, cy, ang * 1, false).x, y: rotatePoint(pntM[c].x, pntM[c].y, cx, cy, ang * 1, false).y},
                    {x: rotatePoint(pntM[c].x, pntM[c].y, cx, cy, ang * 2, false).x, y: rotatePoint(pntM[c].x, pntM[c].y, cx, cy, ang * 2, false).y},
                    {x: rotatePoint(pntM[c].x, pntM[c].y, cx, cy, ang * 3, false).x, y: rotatePoint(pntM[c].x, pntM[c].y, cx, cy, ang * 3, false).y},
                    {x: rotatePoint(pntM[c].x, pntM[c].y, cx, cy, ang * 4, false).x, y: rotatePoint(pntM[c].x, pntM[c].y, cx, cy, ang * 4, false).y},
                    {x: rotatePoint(pntM[c].x, pntM[c].y, cx, cy, ang * 5, false).x, y: rotatePoint(pntM[c].x, pntM[c].y, cx, cy, ang * 5, false).y}
                ];

                pnt = point.slice();

                points.push(pnt);
            }
            else {
                let cx = rotatePoint(pnt[0].x, pnt[0].y, cxM, cyM, -ang, false).x;
                let cy = rotatePoint(pnt[0].x, pnt[0].y, cxM, cyM, -ang, false).y;
                let point = [
                    {x: cx, y: cy},
                    {x: pntM[c].x, y: pntM[c].y},
                    {x: rotatePoint(pntM[c].x, pntM[c].y, cx, cy, ang * 1, false).x, y: rotatePoint(pntM[c].x, pntM[c].y, cx, cy, ang * 1, false).y},
                    {x: rotatePoint(pntM[c].x, pntM[c].y, cx, cy, ang * 2, false).x, y: rotatePoint(pntM[c].x, pntM[c].y, cx, cy, ang * 2, false).y},
                    {x: rotatePoint(pntM[c].x, pntM[c].y, cx, cy, ang * 3, false).x, y: rotatePoint(pntM[c].x, pntM[c].y, cx, cy, ang * 3, false).y},
                    {x: rotatePoint(pntM[c].x, pntM[c].y, cx, cy, ang * 4, false).x, y: rotatePoint(pntM[c].x, pntM[c].y, cx, cy, ang * 4, false).y},
                    {x: rotatePoint(pntM[c].x, pntM[c].y, cx, cy, ang * 5, false).x, y: rotatePoint(pntM[c].x, pntM[c].y, cx, cy, ang * 5, false).y}
                ];

                if (i === 2) {
                    cx2 = cx;
                    cy2 = cy;
                }
                else if (i === 5) {
                    cx5 = cx;
                }

                pnt = point.slice();

                points.push(pnt);
            }
        }
        
        let eL = ((points[0][3].x + points[0][4].x) / 2) / 5;
        let cL = 2 * eL;
        for (let i = 0; i < mega.length; i++) {
            let mCe = megaCenters[i];
            let polyCe = document.createElementNS('http://www.w3.org/2000/svg', "polygon");
            fill = getMegaColor(mCe);
            
            let facePoints = points[i].slice();
            let pointsCe = [];
            for (let i = 1; i < facePoints.length; i++) {
                let px = (facePoints[0].x + facePoints[i].x) / 2;
                let py = (facePoints[0].y + facePoints[i].y) / 2;
                pointsCe.push({x: px, y: py});
            }
            $(polyCe).attr("points", pointsCe.map(p => p.x + "," + p.y).join(" "));
            $(polyCe).attr("style", "fill:"+fill+";stroke:"+stroke+";stroke-width:"+1);
            
            $(svgID).append(polyCe);
            
            // Defining corner coordinates
            let pointsCo = [];
            let tempPoints = facePoints.slice(1);
            let lp = tempPoints.pop();
            let nlp = tempPoints.pop();
            tempPoints.unshift(nlp);
            tempPoints.push(lp);

            for (let j = 0; j < 1; j++) {
                let px0;
                let py0;
                let px1;
                let py1;
                let px2;
                let py2;
                let px3;
                let py3;

                px0 = tempPoints[j].x;
                py0 = tempPoints[j].y;

                let ep1 = rotatePoint(pointsCe[3].x, pointsCe[3].y, pointsCe[4].x, pointsCe[4].y, 180, false);
                px1 = intersectLines(px0, py0, tempPoints[1].x, tempPoints[1].y, pointsCe[3].x, pointsCe[3].y, ep1.x, ep1.y)[0];
                py1 = intersectLines(px0, py0, tempPoints[1].x, tempPoints[1].y, pointsCe[3].x, pointsCe[3].y, ep1.x, ep1.y)[1];

                px2 = pointsCe[4].x;
                py2 = pointsCe[4].y;
                
                let ep3 = rotatePoint(pointsCe[0].x, pointsCe[0].y, pointsCe[4].x, pointsCe[4].y, 180, false);
                px3 = intersectLines(px0, py0, tempPoints[4].x, tempPoints[4].y, pointsCe[0].x, pointsCe[0].y, ep3.x, ep3.y)[0];
                py3 = intersectLines(px0, py0, tempPoints[4].x, tempPoints[4].y, pointsCe[0].x, pointsCe[0].y, ep3.x, ep3.y)[1];

                pointsCo.push({
                    x0: px0, y0: py0,
                    x1: px1, y1: py1,
                    x2: px2, y2: py2,
                    x3: px3, y3: py3,
                    x4: px0, y4: py0,
                });
            }

            for (let j = 1; j < 5; j++) {
                let xy0 = rotatePoint(pointsCo[0].x0, pointsCo[0].y0, facePoints[0].x, facePoints[0].y, ang * j, false);
                let xy1 = rotatePoint(pointsCo[0].x1, pointsCo[0].y1, facePoints[0].x, facePoints[0].y, ang * j, false);
                let xy2 = rotatePoint(pointsCo[0].x2, pointsCo[0].y2, facePoints[0].x, facePoints[0].y, ang * j, false);
                let xy3 = rotatePoint(pointsCo[0].x3, pointsCo[0].y3, facePoints[0].x, facePoints[0].y, ang * j, false);
                pointsCo.push({
                    x0: xy0.x, y0: xy0.y,
                    x1: xy1.x, y1: xy1.y,
                    x2: xy2.x, y2: xy2.y,
                    x3: xy3.x, y3: xy3.y,
                    x4: xy0.x, y4: xy0.y,
                });
            }

            // Defining edge coordinates
            let pointsE = [];
            for (let j = 0; j < 1; j++) {
                let px0;
                let py0;
                let px1;
                let py1;
                let px2;
                let py2;
                let px3;
                let py3;

                px0 = pointsCo[0].x1;
                py0 = pointsCo[0].y1;

                px1 = pointsCo[1].x3;
                py1 = pointsCo[1].y3;

                px2 = pointsCe[0].x;
                py2 = pointsCe[0].y;

                px3 = pointsCe[4].x;
                py3 = pointsCe[4].y;

                pointsE.push({
                    x0: px0, y0: py0,
                    x1: px1, y1: py1,
                    x2: px2, y2: py2,
                    x3: px3, y3: py3,
                    x4: px0, y4: py0
                });
            }

            for (let j = 1; j < 5; j++) {
                let xy0 = rotatePoint(pointsE[0].x0, pointsE[0].y0, facePoints[0].x, facePoints[0].y, ang * j, false);
                let xy1 = rotatePoint(pointsE[0].x1, pointsE[0].y1, facePoints[0].x, facePoints[0].y, ang * j, false);
                let xy2 = rotatePoint(pointsE[0].x2, pointsE[0].y2, facePoints[0].x, facePoints[0].y, ang * j, false);
                let xy3 = rotatePoint(pointsE[0].x3, pointsE[0].y3, facePoints[0].x, facePoints[0].y, ang * j, false);
                pointsE.push({
                    x0: xy0.x, y0: xy0.y,
                    x1: xy1.x, y1: xy1.y,
                    x2: xy2.x, y2: xy2.y,
                    x3: xy3.x, y3: xy3.y,
                    x4: xy0.x, y4: xy0.y,
                });
            }

            // Combining points
            let pointsPieces = [];
            for (let j = 0; j < pointsCo.length; j++) {
                pointsPieces.push(pointsCo[j]);
                pointsPieces.push(pointsE[j]);
            }
            
            for (let j = 0; j < pointsPieces.length; j++) {
                let m = mega[i][j];
                let poly = document.createElementNS('http://www.w3.org/2000/svg', "polygon");
                fill = getMegaColor(m);
                
                let pnts = 
                    pointsPieces[j].x0+","+pointsPieces[j].y0+" "+
                    pointsPieces[j].x1+","+pointsPieces[j].y1+" "+
                    pointsPieces[j].x2+","+pointsPieces[j].y2+" "+
                    pointsPieces[j].x3+","+pointsPieces[j].y3+" "+
                    pointsPieces[j].x4+","+pointsPieces[j].y4;
                    
                $(poly).attr("points", pnts);
                $(poly).attr("style", "fill:"+fill+";stroke:"+stroke+";stroke-width:"+1);
                
                $(svgID).append(poly);
            }
        }
    
        // Bokstaver for U og F
        for (let i = 0; i < 2; i++) {
            let text = document.createElementNS('http://www.w3.org/2000/svg', "text");
            $(text).attr("x", points[i][0].x);
            $(text).attr("y", points[i][0].y);
            $(text).attr("style", "font-size:"+(a*0.5)+";font-family:monospace;font-weight:bold;fill:black;text-anchor:middle;dominant-baseline:middle;");
            let textNode = document.createTextNode(["U", "F"][i]);
            text.appendChild(textNode);

            $(svgID).append(text);
        }

        function cleanMoves(m) {
            while (m.includes("&nbsp;&nbsp;")) {
                m.replaceAll("&nbsp;&nbsp;", "&nbsp;");
            }
        
            return m.trim();
        }
    
        function getMegaState(sol) {
            resetMegaState();
            sol = cleanMoves(sol);
            let arr = Array.isArray(sol) ? sol : sol.trim().split(" ");
            for (let a of arr) {
                switch (a) {
                    case "U":
                        _U();
                        break;
                    case "U'":
                        _U();
                        _U();
                        _U();
                        _U();
                        break;
                    case "R++":
                        _R();
                        break;
                    case "R--":
                        _R();
                        _R();
                        _R();
                        _R();
                        break;
                    case "D++":
                        _D();
                        break;
                    case "D--":
                        _D();
                        _D();
                        _D();
                        _D();
                        break;
                }
            }
        }
        
        function resetMegaState() {
            mega = cleanMega.slice();
            megaCenters = cleanMegaCenters.slice();
        }

        function _U() {
            let temp = mega.slice();

            for (let i = 0; i < mega.length; i++) {
                temp[i] = mega[i].slice();
            }

            mega[0][2] = temp[0][0];
            mega[0][3] = temp[0][1];
            mega[0][4] = temp[0][2];
            mega[0][5] = temp[0][3];
            mega[0][6] = temp[0][4];
            mega[0][7] = temp[0][5];
            mega[0][8] = temp[0][6];
            mega[0][9] = temp[0][7];
            mega[0][0] = temp[0][8];
            mega[0][1] = temp[0][9];

            mega[1][2] = temp[2][2];
            mega[1][3] = temp[2][3];
            mega[1][4] = temp[2][4];

            mega[2][2] = temp[3][2];
            mega[2][3] = temp[3][3];
            mega[2][4] = temp[3][4];

            mega[3][2] = temp[4][2];
            mega[3][3] = temp[4][3];
            mega[3][4] = temp[4][4];

            mega[4][2] = temp[5][2];
            mega[4][3] = temp[5][3];
            mega[4][4] = temp[5][4];

            mega[5][2] = temp[1][2];
            mega[5][3] = temp[1][3];
            mega[5][4] = temp[1][4];
        }

        function _R() {
            let temp = mega.slice();
            let tempCe = megaCenters.slice();

            for (let i = 0; i < mega.length; i++) {
                temp[i] = mega[i].slice();
            }

            megaCenters[0] = tempCe[10];
            megaCenters[1] = tempCe[11];
            megaCenters[2] = tempCe[6];
            megaCenters[3] = tempCe[9];
            megaCenters[4] = tempCe[1];
            megaCenters[6] = tempCe[3];
            megaCenters[7] = tempCe[2];
            megaCenters[9] = tempCe[7];
            megaCenters[10] = tempCe[4];
            megaCenters[11] = tempCe[0];

            mega[8][0] = temp[8][6];
            mega[8][1] = temp[8][7];
            mega[8][2] = temp[8][8];
            mega[8][3] = temp[8][9];
            mega[8][4] = temp[8][0];
            mega[8][5] = temp[8][1];
            mega[8][6] = temp[8][2];
            mega[8][7] = temp[8][3];
            mega[8][8] = temp[8][4];
            mega[8][9] = temp[8][5];

            mega[0][1] = temp[10][9];
            mega[0][2] = temp[10][0];
            mega[0][3] = temp[10][1];
            mega[0][4] = temp[10][2];
            mega[0][5] = temp[10][3];
            mega[0][6] = temp[10][4];
            mega[0][7] = temp[10][5];

            mega[1][3] = temp[11][1];
            mega[1][4] = temp[11][2];
            mega[1][5] = temp[11][3];
            mega[1][6] = temp[11][4];
            mega[1][7] = temp[11][5];
            mega[1][8] = temp[11][6];
            mega[1][9] = temp[11][7];

            mega[10][9] = temp[4][7];
            mega[10][0] = temp[4][8];
            mega[10][1] = temp[4][9];
            mega[10][2] = temp[4][0];
            mega[10][3] = temp[4][1];
            mega[10][4] = temp[4][2];
            mega[10][5] = temp[4][3];

            mega[11][1] = temp[0][1];
            mega[11][2] = temp[0][2];
            mega[11][3] = temp[0][3];
            mega[11][4] = temp[0][4];
            mega[11][5] = temp[0][5];
            mega[11][6] = temp[0][6];
            mega[11][7] = temp[0][7];

            mega[4][7] = temp[1][3];
            mega[4][8] = temp[1][4];
            mega[4][9] = temp[1][5];
            mega[4][0] = temp[1][6];
            mega[4][1] = temp[1][7];
            mega[4][2] = temp[1][8];
            mega[4][3] = temp[1][9];
            
            mega[2][0] = temp[6][8];
            mega[2][1] = temp[6][9];
            mega[2][2] = temp[6][0];
            mega[2][3] = temp[6][1];
            mega[2][4] = temp[6][2];
            mega[2][5] = temp[6][3];
            mega[2][6] = temp[6][4];
            mega[2][7] = temp[6][5];
            mega[2][8] = temp[6][6];
            mega[2][9] = temp[6][7];
            
            mega[3][0] = temp[9][2];
            mega[3][1] = temp[9][3];
            mega[3][2] = temp[9][4];
            mega[3][3] = temp[9][5];
            mega[3][4] = temp[9][6];
            mega[3][5] = temp[9][7];
            mega[3][6] = temp[9][8];
            mega[3][7] = temp[9][9];
            mega[3][8] = temp[9][0];
            mega[3][9] = temp[9][1];
            
            mega[6][0] = temp[3][4];
            mega[6][1] = temp[3][5];
            mega[6][2] = temp[3][6];
            mega[6][3] = temp[3][7];
            mega[6][4] = temp[3][8];
            mega[6][5] = temp[3][9];
            mega[6][6] = temp[3][0];
            mega[6][7] = temp[3][1];
            mega[6][8] = temp[3][2];
            mega[6][9] = temp[3][3];
            
            mega[7][0] = temp[2][2];
            mega[7][1] = temp[2][3];
            mega[7][2] = temp[2][4];
            mega[7][3] = temp[2][5];
            mega[7][4] = temp[2][6];
            mega[7][5] = temp[2][7];
            mega[7][6] = temp[2][8];
            mega[7][7] = temp[2][9];
            mega[7][8] = temp[2][0];
            mega[7][9] = temp[2][1];
            
            mega[9][0] = temp[7][4];
            mega[9][1] = temp[7][5];
            mega[9][2] = temp[7][6];
            mega[9][3] = temp[7][7];
            mega[9][4] = temp[7][8];
            mega[9][5] = temp[7][9];
            mega[9][6] = temp[7][0];
            mega[9][7] = temp[7][1];
            mega[9][8] = temp[7][2];
            mega[9][9] = temp[7][3];
        }

        function _D() {
            let temp = mega.slice();
            let tempCe = megaCenters.slice();

            for (let i = 0; i < mega.length; i++) {
                temp[i] = mega[i].slice();
            }

            megaCenters[1] = tempCe[4];
            megaCenters[2] = tempCe[5];
            megaCenters[3] = tempCe[1];
            megaCenters[4] = tempCe[2];
            megaCenters[5] = tempCe[3];
            megaCenters[7] = tempCe[9];
            megaCenters[8] = tempCe[10];
            megaCenters[9] = tempCe[11];
            megaCenters[10] = tempCe[7];
            megaCenters[11] = tempCe[8];

            mega[6][0] = temp[6][6];
            mega[6][1] = temp[6][7];
            mega[6][2] = temp[6][8];
            mega[6][3] = temp[6][9];
            mega[6][4] = temp[6][0];
            mega[6][5] = temp[6][1];
            mega[6][6] = temp[6][2];
            mega[6][7] = temp[6][3];
            mega[6][8] = temp[6][4];
            mega[6][9] = temp[6][5];

            // for (let i = 3; i < 10; i++) {
            for (let i of [0, 1, 5, 6, 7, 8, 9]) {
                mega[1][i] = temp[4][i];
                mega[2][i] = temp[5][i];
                mega[3][i] = temp[1][i];
                mega[4][i] = temp[2][i];
                mega[5][i] = temp[3][i];
            }

            for (let i = 0; i < 10; i++) {
                mega[7][i] = temp[9][i];
                mega[8][i] = temp[10][i];
                mega[9][i] = temp[11][i];
                mega[10][i] = temp[7][i];
                mega[11][i] = temp[8][i];
            }
        }

        function getMegaColor(c) {
            return megaColors[["1", "2", "3", "4", "5", "6", "a", "b", "c", "d", "e", "f"].indexOf(c)];
        }
    }

    // Clock
    function drawScrambleClock(svgID, scr) {
        $(svgID).empty();
    
        let cleanClock = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
        let clock = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
        let pins = [[0, 0, 0, 0], [1, 1, 1, 1]];
        let clockFace = 1;
        
        getClockState(scr);
        
        let width = $(svgID).width();
        let height = 3 * width / 4;
        $(svgID).height(height);
        let space = width / 30;
        let size = ((width - space) / 2) / 3;
        let fill = "";
        let stroke = "#000000";
        let strokeWidth = 2;
        let light = "#55CCFF";
        let dark = "#3375B2";
        let pinUp = "#ffff00";
        let pinDown = "#885500";
        let hand = "#ffff00";
        let handStroke = "#FF0000";

        for (let i = 0; i < 2; i++) {
            // Background
            let colors = [light, dark];
            let colors2 = [dark, light];
            let cx = strokeWidth + i * ((width + space) / 2 - strokeWidth) + (width - space) / 4;
            let cy = height / 2;
            let r = (width - space - 4 * strokeWidth) / 4;
            let circ = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            $(circ).attr("cx", cx);
            $(circ).attr("cy", cy);
            $(circ).attr("r", r);
            $(circ).attr("style", "fill:"+colors[i]+";stroke:"+stroke+";stroke-width:"+strokeWidth);
            $(svgID).append(circ);

            let square = Math.sqrt(2 * Math.pow(r, 2)) + 2 * space;
            let squareStartX = cx - square / 2;
            let squareStartY = cy - square / 2;

            // Corners
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    let r2 = square / 5;
                    let cx2 = squareStartX + (square / 6 + (square / 3) * k);
                    let cy2 = squareStartY + (square / 6 + (square / 3) * j);
                    
                    if ((j === 0 || j === 2) && (k === 0 || k === 2)) {
                        let c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                        $(c).attr("cx", cx2);
                        $(c).attr("cy", cy2);
                        $(c).attr("r", r2);
                        $(c).attr("style", "fill:"+colors[i]+";stroke:"+stroke+";stroke-width:"+strokeWidth);
                        $(svgID).append(c);
                    }
                }
            }

            // Background again to remove corner strokes
            let cx1 = strokeWidth + i * ((width + space) / 2 - strokeWidth) + (width - space) / 4;
            let cy1 = height / 2;
            let r1 = (width - space - 4 * strokeWidth) / 4 - strokeWidth / 2;
            let circ1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            $(circ1).attr("cx", cx1);
            $(circ1).attr("cy", cy1);
            $(circ1).attr("r", r1);
            $(circ1).attr("style", "fill:"+colors[i]);
            $(svgID).append(circ1);
            
            // Inner clocks
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    let r2 = square / 9;
                    let cx2 = squareStartX + (square / 6 + (square / 3) * k);
                    let cy2 = squareStartY + (square / 6 + (square / 3) * j);
                    let circ2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    $(circ2).attr("cx", cx2);
                    $(circ2).attr("cy", cy2);
                    $(circ2).attr("r", r2);
                    $(circ2).attr("style", "fill:"+colors2[i]+";stroke:"+stroke+";stroke-width:"+strokeWidth);
                    $(svgID).append(circ2);

                    // Dots
                    for (let l = 0; l < 12; l++) {
                        let r3 = 1;
                        let a = (30 * Math.PI/180) * (1 + l);
                        let cx3 = cx2 + (r2 + 3 * r3) * Math.sin(a);
                        let cy3 = cy2 + (r2 + 3 * r3) * Math.cos(a);
                        let circ3 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                        $(circ3).attr("cx", cx3);
                        $(circ3).attr("cy", cy3);
                        $(circ3).attr("r", r3);
                        $(circ3).attr("style", "fill:"+colors2[i]+";stroke:"+stroke+";stroke-width:"+0);
                        $(svgID).append(circ3);
                    }

                    // Clock hand circles
                    let circ4 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    $(circ4).attr("cx", cx2);
                    $(circ4).attr("cy", cy2);
                    $(circ4).attr("r", 3);
                    $(circ4).attr("style", "fill:"+hand+";stroke:"+handStroke+";stroke-width:"+2);
                    $(svgID).append(circ4);
                }
            }

            // Pins
            let colorPins = [pinDown, pinUp];
            let pinPos = [
                [squareStartX + square / 3, squareStartY + square / 3],
                [squareStartX + 2 * square / 3, squareStartY + square / 3],
                [squareStartX + square / 3, squareStartY + 2 * square / 3],
                [squareStartX + 2 * square / 3, squareStartY + 2 * square / 3]
            ];
            let r5 = 4;
            for (let j = 0; j < pins[i].length; j++) {
                let cx5 = pinPos[j][0];
                let cy5 = pinPos[j][1];
                let circ5 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                $(circ5).attr("cx", cx5);
                $(circ5).attr("cy", cy5);
                $(circ5).attr("r", r5);
                $(circ5).attr("style", "fill:"+colorPins[pins[i][j]]+";stroke:"+stroke+";stroke-width:"+strokeWidth);
                $(svgID).append(circ5);

                if (pins[i][j] === 1) {
                    let cx6 = cx5;
                    let cy6 = cy5 - r5;
                    let circ6 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    $(circ6).attr("cx", cx6);
                    $(circ6).attr("cy", cy6);
                    $(circ6).attr("r", r5);
                    $(circ6).attr("style", "fill:"+colorPins[pins[i][j]]+";stroke:"+stroke+";stroke-width:"+strokeWidth);
                    $(svgID).append(circ6);
                }
            }
            
            let m = 0;
            // Clock hands
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    let poly = document.createElementNS('http://www.w3.org/2000/svg', "polygon");
                    
                    let points = [];
                    for (let l = 0; l < 12; l++) {
                        let cx8 = squareStartX + (square / 6 + (square / 3) * k);
                        let cy8 = squareStartY + (square / 6 + (square / 3) * j);
                        let r9 = 3;
                        let sq = Math.sqrt(2 * Math.pow(r9, 2));
                        let sqX1 = cx8 - sq / 2;
                        let sqY1 = cy8 - sq / 2;
                        let sqX2 = cx8 + sq / 2;
                        let sqY2 = cy8 - sq / 2;

                        let px1 = rotatePoint(sqX1, sqY1, cx8, cy8, 30 * l, false).x;
                        let py1 = rotatePoint(sqX1, sqY1, cx8, cy8, 30 * l, false).y;

                        let px2 = rotatePoint(cx8, cy8-2.5*sq, cx8, cy8, 30 * l, false).x;
                        let py2 = rotatePoint(cx8, cy8-2.5*sq, cx8, cy8, 30 * l, false).y;

                        let px3 = rotatePoint(sqX2, sqY2, cx8, cy8, 30 * l, false).x;
                        let py3 = rotatePoint(sqX2, sqY2, cx8, cy8, 30 * l, false).y;
                        
                        points.push([
                            {
                                x: px1,
                                y: py1
                            },
                            {
                                x: px2,
                                y: py2
                            },
                            {
                                x: px3,
                                y: py3
                            },
                            {
                                x: px1,
                                y: py1
                            }
                        ]);
                    }
                    
                    $(poly).attr("points", points[clock[i][m]].map(p => p.x + "," + p.y).join(" "));
                    $(poly).attr("style", "fill:"+hand+";stroke:"+handStroke+";stroke-width:"+1);
                    
                    $(svgID).append(poly);
                    m++;
                }
            }

            // Clock hand circles again to remove stroke
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    let cx7 = squareStartX + (square / 6 + (square / 3) * k);
                    let cy7 = squareStartY + (square / 6 + (square / 3) * j);
                    let circ7 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    $(circ7).attr("cx", cx7);
                    $(circ7).attr("cy", cy7);
                    $(circ7).attr("r", 3);
                    $(circ7).attr("style", "fill:"+hand);
                    $(svgID).append(circ7);
                }
            }
        }
    
        function cleanMoves(m) {
            while (m.includes("&nbsp;&nbsp;")) {
                m.replaceAll("&nbsp;&nbsp;", "&nbsp;");
            }
        
            return m.trim();
        }
    
        function getClockState(sol) {
            // Dark side first when scrambling
            resetClockState();
            sol = cleanMoves(sol);
            let arr = Array.isArray(sol) ? sol : sol.trim().split(" ");
            for (let a of arr) {
                let n = a.split("").slice(a.split("").length - 2).join("");
                if (a.length === 4) {
                    switch (a.substring(0, 2)) {
                        case "UR":
                            addToClock(1, n);
                            addToClock(2, n);
                            addToClock(4, n);
                            addToClock(5, n);
                            break;
                        case "DR":
                            addToClock(4, n);
                            addToClock(5, n);
                            addToClock(7, n);
                            addToClock(8, n);
                            break;
                        case "DL":
                            addToClock(3, n);
                            addToClock(4, n);
                            addToClock(6, n);
                            addToClock(7, n);
                            break;
                        case "UL":
                            addToClock(0, n);
                            addToClock(1, n);
                            addToClock(3, n);
                            addToClock(4, n);
                            break;
                    }
                }
                else if (a.length === 3) {
                    switch (a.substring(0, 1)) {
                        case "U":
                            addToClock(0, n);
                            addToClock(1, n);
                            addToClock(2, n);
                            addToClock(3, n);
                            addToClock(4, n);
                            addToClock(5, n);
                            break;
                        case "R":
                            addToClock(1, n);
                            addToClock(2, n);
                            addToClock(4, n);
                            addToClock(5, n);
                            addToClock(7, n);
                            addToClock(8, n);
                            break;
                        case "D":
                            addToClock(3, n);
                            addToClock(4, n);
                            addToClock(5, n);
                            addToClock(6, n);
                            addToClock(7, n);
                            addToClock(8, n);
                            break;
                        case "L":
                            addToClock(0, n);
                            addToClock(1, n);
                            addToClock(3, n);
                            addToClock(4, n);
                            addToClock(6, n);
                            addToClock(7, n);
                            break;
                    }
                }
                else if (a === "y2") {
                    clockFace = 0;
                }
                else if (a.includes("ALL")) {
                    addToClock(0, n);
                    addToClock(1, n);
                    addToClock(2, n);
                    addToClock(3, n);
                    addToClock(4, n);
                    addToClock(5, n);
                    addToClock(6, n);
                    addToClock(7, n);
                    addToClock(8, n);
                }
                else {
                    switch (a) {
                        case "UR":
                            pins[0][1] = 1;
                            pins[1][0] = 0;
                            break;
                        case "DR":
                            pins[0][3] = 1;
                            pins[1][2] = 0;
                            break;
                        case "DL":
                            pins[0][2] = 1;
                            pins[1][3] = 0;
                            break;
                        case "UL":
                            pins[0][0] = 1;
                            pins[1][1] = 0;
                            break;
                    }
                }
            }
        }

        function addToClock(i, n)  {
            if (n.includes("+")) {
                n = parseInt(n.replace("+", ""));
            }
            else if (n.includes("-")) {
                n = parseInt("-" + n.replace("-", ""));
            }
            
            clock[clockFace][i] = clock[clockFace][i] + n;
            if (clock[clockFace][i] < 0) {
                clock[clockFace][i] = clock[clockFace][i] + 12;
            }
            else if (clock[clockFace][i] > 11) {
                clock[clockFace][i] = clock[clockFace][i] - 12;
            }
            if (i === 0 || i === 2 || i === 6 || i === 8) {
                let face = clockFace === 0 ? 1 : 0;
                let j = i === 0 ? 2 : i === 2 ? 0 : i === 6 ? 8 : 6;
                clock[face][j] = clock[face][j] - n;
                if (clock[face][j] < 0) {
                    clock[face][j] = clock[face][j] + 12;
                }
                else if (clock[face][j] > 11) {
                    clock[face][j] = clock[face][j] - 12;
                }
            }
        }
        
        function resetClockState() {
            clockFace = 1;
            clock = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            pins = pins = [[0, 0, 0, 0], [1, 1, 1, 1]];
        }
    }

    function drawMissingSvg(svgID) {
        resetDrawSvg(svgID);
        let x = "50%";
        let y = "90%";
        
        let text = document.createElementNS('http://www.w3.org/2000/svg', "text");
        $(text).attr("x", x);
        $(text).attr("y", y);
        $(text).attr("font-size", "2vh");
        $(text).attr("fill", "white");
        $(text).attr("text-anchor", "middle");
        $(text).attr("dominant-baseline", "middle");
        let textNode = document.createTextNode("Unavailable for this scramble type");
        text.appendChild(textNode);

        $(svgID).append(text);
    }

    function resetDrawSvg(svgID) {
        $(svgID).empty();

        const svg = $(svgID);

        $(svgID).parent().html(svg);
    }
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

        if (m1.includes("2'")) {
            m1 = m1.replace("2'", "2");
        }
        if (m2.includes("2'")) {
            m2 = m2.replace("2'", "2");
        }

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

function getMovesWithoutRotations(mvs) {
    let mainMoves = ["U", "D", "R", "L", "F", "B"];
    
    function doRotation(m, rot) {
        switch (rot) {
            case "x":
                m = m
                .replaceAll(mainMoves[5], mainMoves[0].toLowerCase())
                .replaceAll(mainMoves[4], mainMoves[1].toLowerCase())
                .replaceAll(mainMoves[1], mainMoves[5].toLowerCase())
                .replaceAll(mainMoves[0], mainMoves[4].toLowerCase());
                break;
            case "x'":
                m = m
                .replaceAll(mainMoves[5], mainMoves[1].toLowerCase())
                .replaceAll(mainMoves[4], mainMoves[0].toLowerCase())
                .replaceAll(mainMoves[1], mainMoves[4].toLowerCase())
                .replaceAll(mainMoves[0], mainMoves[5].toLowerCase());
                break;
            case "x2":
                m = m
                .replaceAll(mainMoves[5], mainMoves[4].toLowerCase())
                .replaceAll(mainMoves[4], mainMoves[5].toLowerCase())
                .replaceAll(mainMoves[1], mainMoves[0].toLowerCase())
                .replaceAll(mainMoves[0], mainMoves[1].toLowerCase());
                break;
            case "y":
                m = m
                .replaceAll(mainMoves[5], mainMoves[3].toLowerCase())
                .replaceAll(mainMoves[4], mainMoves[2].toLowerCase())
                .replaceAll(mainMoves[3], mainMoves[4].toLowerCase())
                .replaceAll(mainMoves[2], mainMoves[5].toLowerCase());
                break;
            case "y'":
                m = m
                .replaceAll(mainMoves[5], mainMoves[2].toLowerCase())
                .replaceAll(mainMoves[4], mainMoves[3].toLowerCase())
                .replaceAll(mainMoves[3], mainMoves[5].toLowerCase())
                .replaceAll(mainMoves[2], mainMoves[4].toLowerCase());
                break;
            case "y2":
                m = m
                .replaceAll(mainMoves[5], mainMoves[4].toLowerCase())
                .replaceAll(mainMoves[4], mainMoves[5].toLowerCase())
                .replaceAll(mainMoves[3], mainMoves[2].toLowerCase())
                .replaceAll(mainMoves[2], mainMoves[3].toLowerCase());
                break;
            case "z":
                m = m
                .replaceAll(mainMoves[3], mainMoves[1].toLowerCase())
                .replaceAll(mainMoves[2], mainMoves[0].toLowerCase())
                .replaceAll(mainMoves[1], mainMoves[2].toLowerCase())
                .replaceAll(mainMoves[0], mainMoves[3].toLowerCase());
                break;
            case "z'":
                m = m
                .replaceAll(mainMoves[3], mainMoves[0].toLowerCase())
                .replaceAll(mainMoves[2], mainMoves[1].toLowerCase())
                .replaceAll(mainMoves[1], mainMoves[3].toLowerCase())
                .replaceAll(mainMoves[0], mainMoves[2].toLowerCase());
                break;
            case "z2":
                m = m
                .replaceAll(mainMoves[3], mainMoves[2].toLowerCase())
                .replaceAll(mainMoves[2], mainMoves[3].toLowerCase())
                .replaceAll(mainMoves[1], mainMoves[0].toLowerCase())
                .replaceAll(mainMoves[0], mainMoves[1].toLowerCase());
                break;
        }
    
        return m.toUpperCase();
    }

    mvs = mvs
            .replaceAll("Uw2", "y2 D2").replaceAll("Uw'", "y' D'").replaceAll("Uw", "y D")
            .replaceAll("Dw2", "y2 U2").replaceAll("Dw'", "y U'").replaceAll("Dw", "y' U")
            .replaceAll("Rw2", "x2 L2").replaceAll("Rw'", "x' L'").replaceAll("Rw", "x L")
            .replaceAll("Lw2", "x2 R2").replaceAll("Lw'", "x R'").replaceAll("Lw", "x' R")
            .replaceAll("Fw2", "z2 B2").replaceAll("Fw'", "z' B'").replaceAll("Fw", "z B")
            .replaceAll("Bw2", "z2 F2").replaceAll("Bw'", "z F'").replaceAll("Bw", "z' F")

            .replaceAll("M2", "x2 R2 L2").replaceAll("M'", "x R' L").replaceAll("M", "x' R L'")
            .replaceAll("S2", "z2 F2 B2").replaceAll("S'", "z' F B'").replaceAll("S", "z F' B")
            .replaceAll("E2", "y2 U2 D2").replaceAll("E'", "y U' D").replaceAll("E", "y' U D'")
            .replaceAll("x", "_x").replaceAll("y", "_y").replaceAll("z", "_z");
    let newMoves = [];
    if (mvs.split("_")[0].trim() !== "") {
        newMoves.push(mvs.split("_")[0].trim());
    }
    for (let r of mvs.split("_").slice(1)) {
        let rot = r.split(" ")[0];
        let rest = r.split(" ").slice(1).join(" ").trim();
        mainMoves = doRotation(mainMoves.slice().join(" "), rot).split(" ");
        newMoves.push((rest
            .replaceAll("U", mainMoves[0].toLowerCase())
            .replaceAll("D", mainMoves[1].toLowerCase())
            .replaceAll("R", mainMoves[2].toLowerCase())
            .replaceAll("L", mainMoves[3].toLowerCase())
            .replaceAll("F", mainMoves[4].toLowerCase())
            .replaceAll("B", mainMoves[5].toLowerCase())
        ).toUpperCase().replaceAll("W", "w"));
    }
    
    return newMoves.join(" ").trim();
}

function getHHmmsshh(ms, penalty = 0, stats = false) {
    if (ms === "DNF" || ms === "-") {
        return ms;
    }
    else if (ms === undefined) {
        return "-";
    }
    else if (penalty === -1 && !stats) {
        return "DNF";
    }
    else if (penalty === 2000) {
        ms += 2000;
    }
    else if (ms === Infinity) {
        return "DNF";
    }

    let timeStr = "";
    let cs = Math.floor((ms % 1000) / 10);
    let s = Math.floor((ms / 1000) % 60);
    let m = Math.floor((ms / 60000) % 60);
    let h = Math.floor((ms / 3600000) % 24);

    if (h !== 0) {
        if (m < 10) {
            m = "0" + m;
        }
        if (s < 10) {
            s = "0" + s;
        }
        if (cs < 10) {
            cs = "0" + cs;
        }
        timeStr = h + ":" + m + ":" + s + "." + cs;
    }
    else {
        if (m !==0) {
            if (s < 10) {
                s = "0" + s;
            }
            if (cs < 10) {
                cs = "0" + cs;
            }
            timeStr = m + ":" + s + "." + cs;
        }
        else {
            if (cs < 10) {
                cs = "0" + cs;
            }
            timeStr = s + "." + cs;
        }
    }
    
    if (penalty === 2000) {
        timeStr += "+";
    }
    else if (penalty === -1 && stats) {
        timeStr = "DNF (" + timeStr + ")";
    }
    
    return timeStr;
}

function timeToMs(val) {
    val = val.replace(",", ".");
    let h = 0;
    let m = 0;
    let s = 0;
    let hs = 0;

    if (val.split(":").length - 1 === 2) {
        h = val.split(":")[0];
        m = val.split(":")[1];
        s = val.split(":")[1].split(".")[0];
        hs = val.split(":")[1].split(".")[1];
    }
    else if (val.split(":").length - 1 === 1) {
        m = val.split(":")[0];
        s = val.split(":")[0].split(".")[0];
        hs = val.split(":")[0].split(".")[1];
    }
    else {
        s = val.split(".")[0];
        hs = val.split(".")[1];
    }

    return h * 3600000 + m * 60000 + s * 1000 + hs * 10;
}

function resetCubeState() {
    u1 = "ubl", u2 = "ub", u3 = "ubr", u4 = "ul", u5 = "u", u6 = "ur", u7 = "ufl", u8 = "uf", u9 = "ufr",
    l1 = "lub", l2 = "lu", l3 = "luf", l4 = "lb", l5 = "l", l6 = "lf", l7 = "ldb", l8 = "ld", l9 = "ldf",
    f1 = "ful", f2 = "fu", f3 = "fur", f4 = "fl", f5 = "f", f6 = "fr", f7 = "fdl", f8 = "fd", f9 = "fdr",
    r1 = "ruf", r2 = "ru", r3 = "rub", r4 = "rf", r5 = "r", r6 = "rb", r7 = "rdf", r8 = "rd", r9 = "rdb",
    b1 = "bur", b2 = "bu", b3 = "bul", b4 = "br", b5 = "b", b6 = "bl", b7 = "bdr", b8 = "bd", b9 = "bdl",
    d1 = "dfl", d2 = "df", d3 = "dfr", d4 = "dl", d5 = "d", d6 = "dr", d7 = "dbl", d8 = "db", d9 = "dbr";
}

function applyMoves(allMoves) {
    scrambleArray = allMoves.split(" ");

    resetCubeState();

    for (let i = 0; i < scrambleArray.length; i++) {
        switch (scrambleArray[i]) {
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

    return getCubeState333();
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

function getState_new(n, scr) {
    let cube = [];

    let nScr = [];
    for (let s of scr.split(" ")) {
        if (s.includes("M2")) {
            nScr.push("R2 L2 x2");
        }
        else if (s.includes("M'")) {
            nScr.push("R' L x");
        }
        else if (s.includes("M")) {
            nScr.push("R L' x'");
        }
        else if (s.includes("S2")) {
            nScr.push("F2 B2 z2");
        }
        else if (s.includes("S'")) {
            nScr.push("F B' z'");
        }
        else if (s.includes("S")) {
            nScr.push("F' B Z");
        }
        else if (s.includes("E2")) {
            nScr.push("U2 D2 y2");
        }
        else if (s.includes("E'")) {
            nScr.push("U' D y");
        }
        else if (s.includes("E")) {
            nScr.push("U D' y'");
        }
        else {
            nScr.push(s);
        }
    }
    scr = nScr.join(" ");

    let ind = 0;
    for (let s = 0; s < 6; s++) {
        let side = [];
        for (let i = 0; i < n; i++) {
            let line = [];
            for (let j = 0; j < n; j++) {
                line.push(ind);
                ind++;
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
        else {
            let r = parseInt(s.split("")[2]) || 1;
            move(cube, s.split("")[1], 0, r);
        }
    }
    
    return cube;
}

function getState(n, scr) {
    let cube = [];

    let nScr = [];
    for (let s of scr.split(" ")) {
        if (s.includes("M2")) {
            nScr.push("R2 L2 x2");
        }
        else if (s.includes("M'")) {
            nScr.push("R' L x");
        }
        else if (s.includes("M")) {
            nScr.push("R L' x'");
        }
        else if (s.includes("S2")) {
            nScr.push("F2 B2 z2");
        }
        else if (s.includes("S'")) {
            nScr.push("F B' z'");
        }
        else if (s.includes("S")) {
            nScr.push("F' B Z");
        }
        else if (s.includes("E2")) {
            nScr.push("U2 D2 y2");
        }
        else if (s.includes("E'")) {
            nScr.push("U' D y");
        }
        else if (s.includes("E")) {
            nScr.push("U D' y'");
        }
        else {
            nScr.push(s);
        }
    }
    scr = nScr.join(" ");

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
        else {
            let r = parseInt(s.split("")[2]) || 1;
            move(cube, s.split("")[1], 0, r);
        }
    }
    
    return cube;
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

function getCubeState333() {
    return [
        u1,u2,u3,u4,u5,u6,u7,u8,u9,
        l1,l2,l3,l4,l5,l6,l7,l8,l9,
        f1,f2,f3,f4,f5,f6,f7,f8,f9,
        r1,r2,r3,r4,r5,r6,r7,r8,r9,
        b1,b2,b3,b4,b5,b6,b7,b8,b9,
        d1,d2,d3,d4,d5,d6,d7,d8,d9
    ];
}

function getCubeState222() {
    return [
        u1,u3,u7,u9,
        l1,l3,l7,l9,
        f1,f3,f7,f9,
        r1,r3,r7,r9,
        b1,b3,b7,b9,
        d1,d3,d7,d9
    ];
}

function getCubeStateWoCenters() {
    return [
        u1,u2,u3,u4,u6,u7,u8,u9,
        l1,l2,l3,l4,l6,l7,l8,l9,
        f1,f2,f3,f4,f6,f7,f8,f9,
        r1,r2,r3,r4,r6,r7,r8,r9,
        b1,b2,b3,b4,b6,b7,b8,b9,
        d1,d2,d3,d4,d6,d7,d8,d9
    ];
}

function getEdgeState() {
    return [
        u2,u4,u6,u8,
        l2,l4,l6,l8,
        f2,f4,f6,f8,
        r2,r4,r6,r8,
        b2,b4,b6,b8,
        d2,d4,d6,d8
    ];
}

function getEdgeStateBLD() {
    return [
        u2,u6,u8,u4,
        l2,l6,l8,l4,
        f2,f6,f8,f4,
        r2,r6,r8,r4,
        b2,b6,b8,b4,
        d2,d6,d8,d4
    ];
}

function getCornerState() {
    return [
        u1,u3,u7,u9,
        l1,l3,l7,l9,
        f1,f3,f7,f9,
        r1,r3,r7,r9,
        b1,b3,b7,b9,
        d1,d3,d7,d9
    ];
}

function getCornerStateBLD() {
    return [
        u1,u3,u9,u7,
        l1,l3,l9,l7,
        f1,f3,f9,f7,
        r1,r3,r9,r7,
        b1,b3,b9,b7,
        d1,d3,d9,d7
    ];
}

function getCenters() {
    return [
        u5,l5,f5,r5,b5,d5
    ];
}

function mirror(alg, axis) {
    let newAlg = "";
    let moves = {
        "M" : ["R", "L"],
        "S" : ["F", "B"],
        "E" : ["U", "D"]
    }

    for (let i = 0; i < alg.split(" ").length; i++) {
        let a = alg.split(" ")[i];
        let w = a.includes("w") ? "w" : "";
        if (moves[axis][0].includes(a[0])) {
            if (a.includes("2'")) {
                newAlg += getOpp(a[0]) + w + "2 ";
            }
            else if (a[a.length - 1] === "2") {
                newAlg += getOpp(a[0]) + w + "2 ";
            }
            else if (a[a.length - 1] === "'") {
                newAlg += getOpp(a[0]) + w + " ";
            }
            else {
                newAlg += getOpp(a[0]) + w + "' ";
            }
        }
        else if (a[0] !== axis) {
            if (a.includes("2'")) {
                newAlg += a[0] + w + "2 ";
            }
            else if (a[a.length - 1] === "2") {
                newAlg += a[0] + w + "2 ";
            }
            else if (a[a.length - 1] === "'") {
                newAlg += a[0] + w + " ";
            }
            else {
                newAlg += a[0] + w + "' ";
            }
        }
    }

    function getOpp(m) {
        switch (m) {
            case "R":
                return "L";
            case "L":
                return "R";
            case "U":
                return "D";
            case "D":
                return "U";
            case "F":
                return "B";
            case "B":
                return "F";
        }
    }

    return newAlg.trim();
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

function rotatePoint(pointToRotateX, pointToRotateY, centerOfRotationX, centerOfRotationY, angle, radians = true) {
    let x1;
    let y1;
    if (radians) {
        x1 = (pointToRotateX - centerOfRotationX) * Math.cos(angle) - (pointToRotateY - centerOfRotationY) * Math.sin(angle) + centerOfRotationX;
        y1 = (pointToRotateX - centerOfRotationX) * Math.sin(angle) + (pointToRotateY - centerOfRotationY) * Math.cos(angle) + centerOfRotationY;
    }
    else {
        angle = (angle * Math.PI/180);
        x1 = (pointToRotateX - centerOfRotationX) * Math.cos(angle) - (pointToRotateY - centerOfRotationY) * Math.sin(angle) + centerOfRotationX;
        y1 = (pointToRotateX - centerOfRotationX) * Math.sin(angle) + (pointToRotateY - centerOfRotationY) * Math.cos(angle) + centerOfRotationY;
    }
    return {x: x1, y: y1};
}
        
function intersectLines(x1, y1, x2, y2, x3, y3, x4, y4) {

    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false
    }

    denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

    // Lines are parallel
    if (denominator === 0) {
        return false
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false
    }

    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)

    return [x,y]
}

function inverseAlg(alg) {
    let invAlg = "";
    
    if (alg.trim() === "") {
        return "";
    }
    let arr = [];

    if (alg.includes("[") || alg.includes("]") || alg.includes("(") || alg.includes(")")) {
        alg = commToAlg(alg);
    }
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

/* function inverseAlg2(alg) {
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

    if (alg.includes("] [")) {
        let c = alg.split("] [");
        let c1 = c[0] + "]";
        let c2 = "[" + c[1];
        invAlg = inverseAlg(c2) + " " + inverseAlg(c1);
    }
    else {
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

        if (leftBrackets === rightBrackets + 1) {
            alg += "]";
            rightBrackets++;
        }

        if (leftBrackets !== rightBrackets || commas > leftBrackets || colons > leftBrackets || (alg[0] !== "[" && alg[alg.length - 1] !== "]")
            || (colons === commas && colons === leftBrackets)) {
                console.log(leftBrackets);
                console.log(rightBrackets);
                console.log(commas);
                console.log(colons);
                console.log(alg);
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

function toAlg(a) {
    if (a.includes("(") || a.includes(")")) {
        a = removeRedundantMoves(algxNtoAlg(a));
    }
    if ((a.includes("[") || a.includes("]")) && (a.includes(":") || a.includes(","))) {
        if (a.includes("] [")) {
            let c = a.split("] [");
            let c1 = c[0] + "]";
            let c2 = "[" + c[1];
            a = removeRedundantMoves(commToAlg(c1) + " " + commToAlg(c2));
        }
        else {
            a = removeRedundantMoves(commToAlg(a));
        }
    }

    return a;
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

function commToAlg_old(comm) {
    let leftSqBrackets = 0;
    let rightSqBrackets = 0;
    let colons = 0;
    let commas = 0;
    let commArr = [];

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

    if (leftSqBrackets === rightSqBrackets + 1) {
        commArr.push("]");
        rightSqBrackets++;
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
} */

function commToAlg(comm) {
    let nComm = [];

    comm = comm.trim();
    comm = comm.replaceAll("][", "] [");
    if (comm.includes("(")) {
        let c = comm.split("(");
        let c1 = c[0];
        let c2 = c[1].split(")")[0];
        let n = comm.match(/([0-9]+)([^0-9]+)/)[1];
        let c3 = comm.match(/([0-9]+)([^0-9]+)/)[2];
        comm = [c1, algXN(c2, n), c3].join(" ").trim();
    }

    comm = comm.replace(/\,/g, " comma ");
    comm = comm.replace(/\:/g, " colon ");
    comm = comm.replace(/\]\s/g, "], ");
    comm = "[" + comm + "]";
    comm = comm.replace(/[^\[\]\,\s]+/g, "\"$&\"");
    comm = comm.replace(/" /g, "\", ");
    
    let commArr = JSON.parse(comm);

    for (let c of commArr) {
        nComm.push(expandComm(c));
    }

    return nComm.join(" ");

    function algXN(alg, n) {
        let nAlg = [];
        for (let i = 0; i < n; i++) {
            nAlg.push(alg.trim());
        }
        return cleanMoves("[" + nAlg.join(" ") + "]");
    }

    function expandComm(c) {
        let newComm;

        if (c.includes("comma") || c.includes("colon")) {
            if (c.filter(co => typeof co === "object").length > 0) {
                let nC = [];
                for (let c1 of c) {
                    if (typeof c1 === "object") {
                        nC.push(expandComm(c1));
                    }
                    else {
                        nC.push(c1);
                    }
                }
                c = nC;
            }
            
            if (c.includes("comma")) {
                let c1 = c.slice(0, c.indexOf("comma")).join(" ");
                let c2 = c.slice(c.indexOf("comma") + 1).join(" ");
                let c3 = inverseAlg(c1);
                let c4 = inverseAlg(c2);
                newComm = cleanMoves([c1, c2, c3, c4].join(" "));
            }
            else if (c.includes("colon")) {
                let c1 = c.slice(0, c.indexOf("colon")).join(" ");
                let c2 = c.slice(c.indexOf("colon") + 1).join(" ");
                let c3 = inverseAlg(c1);
                newComm = cleanMoves([c1, c2, c3].join(" "));
            }
        }
        else {
            newComm = typeof c === "object" ? cleanMoves(c.join(" ")) : c;
        }
        
        return newComm;
    }

    function cleanMoves(moves) {
        moves = moves.trim();
        moves = moves.replaceAll(" ", ";");
    
        while (moves.includes(";;")) {
            moves = moves.replaceAll(";;", ";");
        }
    
        return moves.replaceAll(";", " ");
    }
}

function indexOf2d(arr, el) {
    let i = -1;
    for (let y = 0; y < arr.length; y++) {
        for (let x = 0; x < arr[y].length; x++) {
            if (arr[y][x] === el) {
                i = {
                    x: x,
                    y: y
                };
            }
        }
    }
    return i;
}

function splitN(str, delimiter, n) {
    let arr = str.split(delimiter);
    let nArr = [];
    for (let i = 0; i < arr.length; i+=n) {
        nArr.push(arr.slice(i, i + n).join(delimiter));
    }
    return nArr;
}