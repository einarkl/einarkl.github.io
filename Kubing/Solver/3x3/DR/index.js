$(() => {
    draw333Svg('#svgCube', $("#inpScramble").val());

    $("#inpEO").val(parseInt(localStorage.getItem("inpEO")) || 1);
    $("#inpDR").val(parseInt(localStorage.getItem("inpDR")) || 1);
    $("#inpHTR").val(parseInt(localStorage.getItem("inpHTR")) || 1);
    updateTotalSolutions();

    adjustSize();
});

function solveCube(scr) {
    let start = Date.now();
    let w = new Worker("worker.js");
    $("#solution").html("");
    $("#searchDepth").html("");
    let step = 0;
    
    if (isValidScramble(scr)) {
        $("#inpScramble").prop('disabled', true);
        $("#btnSolve").prop('disabled', true);
        $("#btnScramble").prop('disabled', true);
        $("#inpEO").prop('disabled', true);
        $("#inpDR").prop('disabled', true);
        $("#inpHTR").prop('disabled', true);
        w.postMessage([scr, $("#inpEO").val(), $("#inpDR").val(), $("#inpHTR").val()]);
        w.onmessage = e => {
            if (e.data.length === 2 && e.data[0] === "Step") {
                $("#searchDepth").html("<h1>" + e.data[1] + "</h1>");
            }
            else if (e.data.length === 3) {
                let eo = e.data[2][0];
                let dr = e.data[2][1];
                let htr = e.data[2][2];
                let final = e.data[2][3];
                eo !== "" ? $("#solution").append("<h1><b>EO:</b> " + eo + "</h1><div><svg class='svgStep' id='svg_eo'></svg></div>") : "";
                eo !== "" ? draw333Svg("#svg_eo", [scr, eo].filter(s => {return s !== ""}).join(" ")) : "";
                dr !== "" ? $("#solution").append("<h1><b>DR:</b> " + dr + "</h1><div><svg class='svgStep' id='svg_dr'></svg></div>") : "";
                dr !== "" ? draw333Svg("#svg_dr", [scr, eo, dr].filter(s => {return s !== ""}).join(" ")) : "";
                htr !== "" ? $("#solution").append("<h1><b>HTR:</b> " + htr + "</h1><div><svg class='svgStep' id='svg_htr'></svg></div>") : "";
                htr !== "" ? draw333Svg("#svg_htr", [scr, eo, dr, htr].filter(s => {return s !== ""}).join(" ")) : "";
                final !== "" ? $("#solution").append("<h1><b>Final moves:</b> " + final + "</h1><div><svg class='svgStep' id='svg_final'></svg></div>") : "";
                final !== "" ? draw333Svg("#svg_final", [scr, eo, dr, htr, final].filter(s => {return s !== ""}).join(" ")) : "";
                $("#solution").append("<h1>" + e.data[0] + "</h1>");
                scrollDown();
                adjustSize();
                step++;
            }
            else if (e.data[0] === 0) {
                $("#searchDepth").html("<h1><b>Time interuption</b></h1>");
                $("#inpScramble").prop('disabled', false);
                $("#btnSolve").prop('disabled', false);
                $("#btnScramble").prop('disabled', false);
                $("#inpEO").prop('disabled', false);
                $("#inpDR").prop('disabled', false);
                $("#inpHTR").prop('disabled', false);
            }
            else if (e.data[0] !== "Solved") {
                $("#searchDepth").html("<h1>Searching at depth " + e.data[0] + "</h1>");
            }
            else {
                $("#searchDepth").html("<h1>" + (Date.now() - start) + " ms</h1>");
                $("#inpScramble").prop('disabled', false);
                $("#btnSolve").prop('disabled', false);
                $("#btnScramble").prop('disabled', false);
                $("#inpEO").prop('disabled', false);
                $("#inpDR").prop('disabled', false);
                $("#inpHTR").prop('disabled', false);
            }
        }
    }
}

function changeSolValues() {
    let eo = $("#inpEO");
    let dr = $("#inpDR");
    let htr = $("#inpHTR");

    if ($(eo).val() === "") {
        $(eo).val(1);
    }
    if ($(dr).val() === "") {
        $(dr).val(1);
    }
    if ($(htr).val() === "") {
        $(htr).val(1);
    }

    localStorage.setItem("inpEO", $(eo).val());
    localStorage.setItem("inpDR", $(dr).val());
    localStorage.setItem("inpHTR", $(htr).val());

    updateTotalSolutions();
}

function updateTotalSolutions() {
    let eo = $("#inpEO");
    let dr = $("#inpDR");
    let htr = $("#inpHTR");
    
    let solutions = $(eo).val() * $(dr).val() * $(htr).val();
    $("#totalSolutions").text(solutions + solutions === 1 ? solutions + " solution" : solutions + " solutions");
}

function isValidScramble(scr) {
    return scr.trim() !== "";
}

function scrollDown() {
    const element = document.getElementsByTagName("body")[0].parentElement;
    element.scrollTop = element.scrollHeight;
}

function adjustSize() {
    $("svg").height(3 * $("#svgCube").width() / 4);
    $("#inpScramble").css("font-size", "3vh");
    $("button").css("font-size", "3vh");
}