let state = {};

$(() => {
    initActions();
});

function initActions() {
    $(window).on("keyup", e => {
        if (e.which === 32) {
            answer();
        }
    });

    newScramble();
    updateQt();

    if ($(window).height() > $(window).width()) {
        $("#linkCSS").attr("href", "styleM.css");
    }
}

function newScramble() {
    let doubleMoves = ["U2", "D2", "R2", "L2", "F2", "B2"];
    let cx = Object.keys(subsetAlgs)[Math.floor(Math.random() * Object.keys(subsetAlgs).length)];
    let qt = Object.keys(subsetAlgs[cx])[Math.floor(Math.random() * Object.keys(subsetAlgs[cx]).length)];
    /* let cxqtAlgs = subsetAlgs[cx][qt];
    let cxqtAlg = cxqtAlgs[Math.floor(Math.random() * cxqtAlgs.length)]; */
    let cxqtAlg = subsetAlgs[cx][qt];
    let nMoves1 = Math.floor(Math.random() * 5) + (cxqtAlg === "" ? 10 : 0);
    let nMoves2 = cxqtAlg === "" ? 0 : Math.floor(Math.random() * 5);
    let pre = nMoves1 > 0 ? getSubsetScramble(doubleMoves, nMoves1) : "";
    let suf = nMoves2 > 0 ? getSubsetScramble(doubleMoves, nMoves2) : "";
    let scramble = removeRedundantMoves([pre.trim(), cxqtAlg.trim(), suf.trim()].join(" ").trim());
    
    $("cube-player").attr("scramble", scramble);
    $("#scrambleDisplay").text(scramble);
    
    state = {
        "cx" : cx,
        "qt" : qt
    }
    console.log(nMoves1, nMoves2, cxqtAlg, state);
}

function updateQt() {
    let cx = $("#selCx").val();
    let options = [];

    let out = "";
    
    if (cx === "0cxe") {
        options = ["0", "3", "4"];
    }
    else if (cx === "4cxe") {
        options = ["1", "2a", "2b", "3", "4", "5"];
    }
    else if (cx === "2cxe") {
        options = ["3", "4", "5"];
    }

    for (let o of options) {
        out += "<option value='" + o + "qt'>" + o + "</option>";
    }

    $("#selQt").html(out);
}

function answer() {
    let cx = $("#selCx").val();
    let qt = $("#selQt").val();

    if (cx === state.cx && qt === state.qt) {
        $("#result").text("");
        newScramble();
    }
    else {
        $("#result").text("Incorrect!");
    }
}

/* function getSubset(scramble) {
    let nState = getNumberState(3, scramble);
    let us = [nState[0], nState[2], nState[6], nState[8]];
    let ls = [nState[9], nState[11], nState[15], nState[17]];
    let fs = [nState[18], nState[20], nState[24], nState[26]];
    let rs = [nState[27], nState[29], nState[33], nState[35]];
    let bs = [nState[36], nState[38], nState[42], nState[44]];
    let ds = [nState[45], nState[47], nState[51], nState[53]];

    let cx = [...fs, ...bs].filter(c => c!== "3" && c !== "4").length;
    console.log(cx);

    if (cx === 0 || cx === 8) {
        
    }
    else if (cx === 4) {

    }
    else if (cx === 2 || cx === 6) {

    }
} */