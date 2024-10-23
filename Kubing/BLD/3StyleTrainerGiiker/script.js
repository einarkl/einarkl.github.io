window.location = "https://einarkl.no" + location.pathname;
let locked;
let commType;
let commSet;
let letterScheme;
let corners = ["UBL", "BUL", "LUB", "UBR", "BUR", "RUB", "UFL", "FUL", "LUF", "DFL", "FDL", "LDF", "DFR", "FDR", "RDF", "DBL", "BDL", "LDB", "DBR", "BDR", "RDB"];
let edges = ["UB", "UL", "UR", "DF", "DL", "DR", "DB", "FL", "FR", "BR", "BL", "BU", "LU", "RU", "FD", "LD", "DR", "BD", "LF", "RF", "RB", "LB"];
let curComm = "";
let start;

$(() => {
    locked = false;

    init();

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
    commType = localStorage.getItem("einarklCommType") || "ufr";
    letterScheme = localStorage.getItem("einarklLetterScheme") || "Speffz";
    commSet = localStorage.getItem("einarklCommSet") || "All";

    initCommSetOptions();

    $("input[name='radComms'][value='"+commType+"']").prop("checked",true);
    $("#selCommSet").val(commSet).change();
    $("#selLetterScheme").val(letterScheme).change();
}

function initCommSetOptions() {
    let arr = [corners, edges][["ufr", "uf"].indexOf(commType)];

    let out = "<option value='All' selected>All</option>";
    for (let a of arr.sort()) {
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
    let scr = removeRedundantMoves(arr[ind].scramble);
    let sol = arr[ind].alg.replace("*", "<br>");

    $("#cpDiv cube-player").attr("scramble", scr);
    $("#letterPair").text(lp);
    $("#solution").html(sol);

    $("#solution").css("display", "none");
    start = Date.now();
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

function changeCommSet(cs) {
    $("#selCommSet").blur();

    commSet = cs;

    localStorage.setItem("einarklCommSet", commSet);

    nextComm();
}

function getKey(e) {
    if (e.which === 32) {// spacebar
        showComm();
    }
    else if (e.which === 13) {// enter
        nextComm();
    }
}