let locked;
let commType;
let letterScheme;
let corners = ["UBL", "BUL", "LUB", "UBR", "BUR", "RUB", "UFL", "FUL", "LUF", "DFL", "FDL", "LDF", "DFR", "FDR", "RDF", "DBL", "BDL", "LDB", "DBR", "BDR", "RDB"];
let edges = ["UB", "UL", "UR", "DF", "DL", "DR", "DB", "FL", "FR", "BR", "BL", "BU", "LU", "RU", "FD", "LD", "DR", "BD", "LF", "RF", "RB", "LB"];
let curComm = [];
let start;

$(() => {
    locked = false;

    init();
    changeCommType();
    changeLetterScheme($("#selLetterScheme").val());

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
    commType = localStorage.getItem("einarklOrozcoCommType") || "ufr_ubr";
    let ls = localStorage.getItem("einarklOrozcoLetterScheme") || "Speffz";
    $("input[name='radComms'][value='"+commType+"']").prop("checked",true);
    $("#selLetterScheme").val(ls).change();
}

function nextComm() {
    if (start) {
        console.log(getHHmmsshh(Date.now() - start));
    }
    $("#btnNextComm").blur();

    let pieces = [corners, edges, edges][["ufr_ubr", "uf_ur", "uf_bu"].indexOf(commType)].slice();
    let arr = [ufr_ubr, uf_ur, uf_bu][["ufr_ubr", "uf_ur", "uf_bu"].indexOf(commType)];

    let l1 = pieces.splice(Math.floor(Math.random() * pieces.length), 1)[0];
    let toRemove = [];
    let pArr = l1.split("");
    for (let p of pieces) {
        let n = 0;
        for (let p1 of pArr) {
            if (p.includes(p1)) {
                n++;
            }
        }
        if (n === pArr.length) {
            toRemove.push(pieces.indexOf(p));
        }
    }
    
    for (let r of toRemove.reverse()) {
        pieces.splice(r, 1);
    }

    let l2 = pieces.splice(Math.floor(Math.random() * pieces.length), 1)[0];
    curComm = [l1, l2];
    let lp = letterScheme[l1.toLowerCase()] + letterScheme[l2.toLowerCase()];

    let ind1 = arr.findIndex(c => c.target === l1);
    let ind2 = arr.findIndex(c => c.target === l2);
    let scr = removeRedundantMoves(inverseAlg(arr[ind2].scramble) + " " + arr[ind1].scramble);
    let sol = arr[ind1].alg + "<br>" + inverseAlg(arr[ind2].alg);

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
    
    if (curComm.length !== 0) {
        let lp = letterScheme[curComm[0].toLowerCase()] + letterScheme[curComm[1].toLowerCase()];
        $("#letterPair").text(lp);
    }

    localStorage.setItem("einarklOrozcoLetterScheme", ls);
}

function changeCommType() {
    $("input[name='radComms']").blur();

    commType = $("input[name='radComms']:checked").val();

    localStorage.setItem("einarklOrozcoCommType", commType);

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