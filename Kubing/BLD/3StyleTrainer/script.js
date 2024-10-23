window.location = "https://einarkl.no" + location.pathname;
let locked;
let commType;
let commSet;
let letterScheme;
let corners = ["UBL", "BUL", "LUB", "UBR", "BUR", "RUB", "UFL", "FUL", "LUF", "DFL", "FDL", "LDF", "DFR", "FDR", "RDF", "DBL", "BDL", "LDB", "DBR", "BDR", "RDB"];
let edges = ["UB", "UL", "UR", "DF", "DL", "DR", "DB", "FL", "FR", "BR", "BL", "BU", "LU", "RU", "FD", "LD", "DR", "BD", "LF", "RF", "RB", "LB"];
let curComm = "";
let curScramble = "";
let curOrientation = "";
let combinedScr = "";
let start;

$(() => {
    $("button").prop("disabled", true);
    locked = false;

    init();
    changeOrientation($("#selOrientation").val());
    setTimeout(function() {
        nextComm();
        resetCube();
        $("button").prop("disabled", false);
    }, 1000);

    $(window).keydown(function(e) {
        if (!locked) {
            locked = true;
            getKey(e);
        }
    });

    $(window).keyup(function(e) {
        locked = false;
    });
});

function init() {
    commType = localStorage.getItem("einarklCommType") !== undefined ? localStorage.getItem("einarklCommType") : "ufr";
    letterScheme = localStorage.getItem("einarklLetterScheme") !== undefined ? localStorage.getItem("einarklLetterScheme") : "Speffz";
    commSet = localStorage.getItem("einarklCommSet") !== undefined ? localStorage.getItem("einarklCommSet") : "All";
    curOrientation = localStorage.getItem("einarklOrientation") !== undefined ? localStorage.getItem("einarklOrientation") : "";
    /* commType = "ufr";
    letterScheme = "Speffz";
    commSet = "All";
    curOrientation = ""; */

    initCommSetOptions();

    $("input[name='radComms'][value='"+commType+"']").prop("checked",true);
    $("#selCommSet").val(commSet).change();
    $("#selLetterScheme").val(letterScheme).change();
    $("#selOrientation").val(curOrientation).change();
}

function initCommSetOptions() {
    let arr = [corners, edges][["ufr", "uf"].indexOf(commType)];
    let commArr = [];

    if (arr[0].length === 3) {
        commArr = ["UBL", "UBR", "UFL", "LUB", "LUF", "LDF", "LDB", "FUL", "FDR", "FDL", "RUB", "RDB", "RDF", "BUR", "BUL", "BDL", "BDR", "DFL", "DFR", "DBR", "DBL"];
    }
    else if (arr[0].length == 2) {
        commArr = ["UB", "UR", "UL", "LU", "LF", "LD", "LB", "FR", "FD", "FL", "RU", "RB", "RD", "RF", "BU", "BL", "BD", "BL", "DF", "DR", "DB", "DL"];
    }

    let out = "<option value='All' selected>All</option>";
    for (let a of commArr) {
        out += "<option value='" + a + "'>" + a + "</option>";
    }

    $("#selCommSet").html(out);
}

function nextComm() {
    if (start) {
        console.log(getHHmmsshh(Date.now() - start));
    }

    $("#btnNextComm").blur();

    let arr = [ufr, uf][["ufr", "uf"].indexOf(commType)];
    let targets = arr.map(a => a.target);

    if (commSet !== "All") {
        targets = targets.filter(t => {return t.includes(commSet)});
    }
    
    curComm = targets[Math.floor(Math.random() * targets.length)];
    let t1 = curComm.split("_")[0];
    let t2 = curComm.split("_")[1];
    let lp = letterScheme[t1.toLowerCase()] + letterScheme[t2.toLowerCase()];

    let ind = arr.findIndex(c => c.target === curComm);
    let scr = removeRedundantMoves(toAlg(arr[ind].alg));
    curScramble = scr;
    let sol = arr[ind].alg.replace("*", "<br>");

    $("#cpDiv cube-player").attr("scramble", $("#cpDiv cube-player").attr("scramble") + " " + scr);
    $("#letterPair").text(lp);
    $("#solution").html(sol);

    $("#solution").css("display", "none");
    start = Date.now();
    combinedScr = [combinedScr, curScramble].join(" ");
}

function showComm() {
    $("#btnShowComm").blur();

    if ($("#solution").css("display") === "none") {
        $("#solution").css("display", "block");
    }
    else {
        $("#solution").css("display", "none");
    }
}

function changeLetterScheme(ls) {
    $("#selLetterScheme").blur();

    if (ls === "Speffz") {
        letterScheme = {
            ubl:"A",ub:"A",ubr:"B",ur:"B",ufr:"C",uf:"C",ufl:"D",ul:"D",lub:"E",lu:"E",luf:"F",lf:"F",ldf:"G",ld:"G",ldb:"H",lb:"H",
            ful:"I",fu:"I",fur:"J",fr:"J",fdr:"K",fd:"K",fdl:"L",fl:"L",ruf:"M",ru:"M",rub:"N",rb:"N",rdb:"O",rd:"O",rdf:"P",rf:"P",
            bur:"Q",bu:"Q",bul:"R",bl:"R",bdl:"S",bd:"S",bdr:"T",br:"T",dfl:"U",df:"U",dfr:"V",dr:"V",dbr:"W",db:"W",dbl:"X",dl:"X"
        }
    }
    else if (ls === "Einar") {
        letterScheme = {
            ubl:"A",ub:"A",ubr:"E",ur:"E",ufr:"C",uf:"C",ufl:"G",ul:"G",lub:"H",lu:"H",luf:"P",lf:"P",ldf:"W",ld:"W",ldb:"I",lb:"I",
            ful:"F",fu:"F",fur:"N",fr:"N",fdr:"U",fd:"U",fdl:"O",fl:"O",ruf:"D",ru:"D",rub:"L",rb:"L",rdb:"S",rd:"S",rdf:"M",rf:"M",
            bur:"B",bu:"B",bul:"J",bl:"J",bdl:"Q",bd:"Q",bdr:"K",br:"K",dfl:"V",df:"V",dfr:"T",dr:"T",dbr:"R",db:"R",dbl:"X",dl:"X"
        }
    }
    
    if (curComm !== "") {
        let c = curComm.toLowerCase().split("_");
        let lp = letterScheme[c[0]] + letterScheme[c[1]];
        $("#letterPair").text(lp);
    }

    localStorage.setItem("einarklLetterScheme", ls);
}

function changeCommType(ct) {
    $("input[name='radComms']").blur();

    commType = ct;
    commSet = "All";

    localStorage.setItem("einarklCommType", commType);
    localStorage.setItem("einarklCommSet", commSet);

    initCommSetOptions();

    nextComm();
}

function changeOrientation(o) {
    $("#cpDiv cube-player").attr("scramble", [o, combinedScr].join(" ").trim());
    localStorage.setItem("einarklOrientation", o);
    curOrientation = o;
}

function changeCommSet(cs) {
    $("#selCommSet").blur();

    commSet = cs;

    localStorage.setItem("einarklCommSet", commSet);

    nextComm();
    resetCube();
}

function getKey(e) {
    if (e.which === 32) {// spacebar
        showComm();
    }
    else if (e.which === 13) {// enter
        nextComm();
    }
    else if (e.which === 8) {// backspace
        resetCube();
    }
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
}

function cleanMoves(moves) {
    moves = moves.trim();
    moves = moves.replaceAll(" ", ";");

    while (moves.includes(";;")) {
        moves = moves.replaceAll(";;", ";");
    }

    return moves.replaceAll(";", " ");
}

function resetCube() {
    combinedScr = curScramble;
    $("#btnReset").blur();
    $("#cpDiv cube-player").attr("scramble", [curOrientation, curScramble].join(" ").trim());
}