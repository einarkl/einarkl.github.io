window.location = "https://einarkl.no" + location.pathname;
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
        if (n < 2) {
            return "Don't be silly :P";
        }

        let scr = "";
        let movesExtra = ["", "'", "2"];
        let axises = n > 2 ? [["U","D"], ["F","B"], ["R","L"]] : [["U"], ["F"], ["R"]];
        let movesAxis = [["",""]];
        let num = n > 3 ? 20*(n-2) : (n === 3 ? Math.floor(Math.random() * 4 + 19) : Math.floor(Math.random() * 3 + 9));

        for (let i = 4; i <= n; i++) {
            let nW = Math.floor(i/2) === 2 ? "" : Math.floor(i/2);
            let nA = [nW,"w"];
            
            if (!JSON.stringify(movesAxis).includes(JSON.stringify(nA))) {
                movesAxis.push(nA);
            }
        }
        
        let curAxis = -1;
        let moves = [];
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
            let moveE = movesExtra[Math.floor(Math.random() * movesExtra.length)];
            
            moves.splice(moves.indexOf(move), 1);

            scr += move + moveE + " ";
        }
        return scr.trim();
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

    function getScramble333NEW() {
        return "Under production";
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

    function getScramble444() {
        return "Under production";
    }

    function getScramble555() {
        return "Under production";
    }

    function getScramble666() {
        return "Under production";
    }

    function getScramble777() {
        return "Under production";
    }

    function getScrambleClock() {
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

        for (let p of c) {
            if (Math.round(Math.random() * 1) === 1) {
                scr += p + " ";
            }
        }

        return scr.trim();
    }

    function getScrambleMega() {
        let movesExtra = ["++", "--"];
        let scr = "";

        for (let j=0; j<7; j++) {
            scr += "<span>";
            let last = "";
            for (let i=0; i<11; i++) {
                if (i === 10) {
                    if (last === "++") {
                        scr += "U";
                    }
                    else {
                        scr += "U'";
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
                scr += "</span></br>";
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
                scr += " " + t + movesExtra[Math.floor(Math.random() * movesExtra.length)];
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

    function draw444Svg(svgID, scr) {
        resetDrawSvg(svgID);
        drawMissingSvg(svgID);
    }

    function draw555Svg(svgID, scr) {
        resetDrawSvg(svgID);
        drawMissingSvg(svgID);
    }

    function draw666Svg(svgID, scr) {
        resetDrawSvg(svgID);
        drawMissingSvg(svgID);
    }

    function draw777Svg(svgID, scr) {
        resetDrawSvg(svgID);
        drawMissingSvg(svgID);
    }

    function drawClockSvg(svgID, scr) {
        resetDrawSvg(svgID);
        drawMissingSvg(svgID);
    }

    function drawMegaSvg(svgID, scr) {
        resetDrawSvg(svgID);
        drawMissingSvg(svgID);
    }

    function drawPyraSvg(svgID, scr) {
        resetDrawSvg(svgID);
        drawMissingSvg(svgID);
    }

    function drawSkewbSvg(svgID, scr) {
        resetDrawSvg(svgID);
        drawMissingSvg(svgID);
    }

    //Sq1
    {
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

        let sSq1 = "";

        let colorsSq1 = [
            "#FFAA00","#FFAA00","#FFAA00","#00FF00","#00FF00","#00FF00","red","red","red","blue","blue","blue",
            "red","red","red","#00FF00","#00FF00","#00FF00","#FFAA00","#FFAA00","#FFAA00","blue","blue","blue"
        ];
        
        let iColorsSq1 = [
            colorT,colorT,colorT,colorT,colorT,colorT,colorT,colorT,colorT,colorT,colorT,colorT,
            colorB,colorB,colorB,colorB,colorB,colorB,colorB,colorB,colorB,colorB,colorB,colorB
        ];

        function rotateSq1(cx, cy, x, y, angle) {
            let radians = (Math.PI / 180) * angle,
                cos = Math.cos(radians),
                sin = Math.sin(radians),
                nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
                ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
            return [nx, ny];
        }
        
        function intersectSq1(x1, y1, x2, y2, x3, y3, x4, y4) {
        
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

        function drawSq1Svg(svgID, scr) {
            resetDrawSvg(svgID);

            let svgW = $(svgID).width() / 2;
            let svgH = svgW;

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
            
            let ep1 = intersectSq1(cx,cy,cp1[0],cp1[1],cp0[0],cp0[1],cp3[0],cp3[1]);
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
            
            let iep1 = intersectSq1(cx,cy,icp1[0],icp1[1],icp0[0],icp0[1],icp3[0],icp3[1]);
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
    let arr = alg.split(" ");

    for (let j = 0; j < alg.length; j++) {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i].slice(0, -1) === arr[i - 1].slice(0, -1)) {
                if (arr[i].includes("2")) {
                    if (arr[i - 1].includes("2")) {
                        arr[i - 1] = "";
                        arr[i] = "";
                    }
                    else if (arr[i - 1].includes("'")) {
                        arr[i - 1] = arr[i - 1].slice(0, -1);
                        arr[i] = "";
                    }
                    else {
                        arr[i - 1] = arr[i - 1].slice(0, -1) + "'";
                    }
                }
                else if (arr[i].includes("'")) {
                    if (arr[i - 1].includes("2")) {
                        arr[i - 1] = arr[i - 1].slice(0, -1);
                        arr[i] = "";
                    }
                    else if (arr[i - 1].includes("'")) {
                        arr[i - 1] = arr[i - 1].slice(0, -1) + "2";
                        arr[i] = "";
                    }
                    else {
                        arr[i - 1] = "";
                        arr[i] = "";
                    }
                }
                else {
                    if (arr[i - 1].includes("2")) {
                        arr[i - 1] = arr[i - 1].slice(0, -1) + "'";
                        arr[i] = "";
                    }
                    else if (arr[i - 1].includes("'")) {
                        arr[i - 1] = "";
                        arr[i] = "";
                    }
                    else {
                        arr[i - 1] += "2";
                        arr[i] = "";
                    }
                }
            }
        }
    
        arr = arr.filter(a => {return a !== ""});
    }

    return arr.join(" ");
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

function mirror(alg) {
    let newAlg = alg;

    //U
    newAlg.replaceAll("U2","/")
    newAlg.replaceAll("U'","i")
    newAlg.replaceAll("U","U'")
    newAlg.replaceAll("/","U2")
    newAlg.replaceAll("i","U")

    //D
    newAlg.replaceAll("D2","/")
    newAlg.replaceAll("D'","i")
    newAlg.replaceAll("D","D'")
    newAlg.replaceAll("/","D2")
    newAlg.replaceAll("i","D")

    //F
    newAlg.replaceAll("F2","/")
    newAlg.replaceAll("F'","i")
    newAlg.replaceAll("F","F'")
    newAlg.replaceAll("/","F2")
    newAlg.replaceAll("i","F")

    //B
    newAlg.replaceAll("B2","/")
    newAlg.replaceAll("B'","i")
    newAlg.replaceAll("B","B'")
    newAlg.replaceAll("/","B2")
    newAlg.replaceAll("i","B")

    //L
    newAlg.replaceAll("L2","/")
    newAlg.replaceAll("L'","i")
    newAlg.replaceAll("L","R'")
    newAlg.replaceAll("/","R2")
    newAlg.replaceAll("i","R")

    //R
    newAlg.replaceAll("R2","/")
    newAlg.replaceAll("R'","i")
    newAlg.replaceAll("R","L'")
    newAlg.replaceAll("/","L2")
    newAlg.replaceAll("i","L")

    //S
    newAlg.replaceAll("S2","/")
    newAlg.replaceAll("S'","i")
    newAlg.replaceAll("S","S'")
    newAlg.replaceAll("/","S2")
    newAlg.replaceAll("i","S")

    //E
    newAlg.replaceAll("E2","/")
    newAlg.replaceAll("E'","i")
    newAlg.replaceAll("E","E'")
    newAlg.replaceAll("/","E2")
    newAlg.replaceAll("i","E")

    return newAlg;
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