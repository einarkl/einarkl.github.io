let steps = {};

$(() => {
    initEvents();
    getParams();
});

function initEvents() {
    $("#inpScramble").on("input change", () => {
        $("#inpInverseScramble").val(inverseAlg($("#inpScramble").val().trim()));
        updateSolution();
        updateURL();
    });

    // $(".niss").on("click", e => {
    $(".btnAddStep").on("click", e => {
        addStep(e);
    });

    $(".niss input").on("click", e => {
        e.stopPropagation();
        console.log(e);
    });
}

function getParams() {
    if (window.location.search !== "") {
        const params = (window.location.search).split("?")[1].split("&");

        for (let p of params) {
            switch (p.split("=")[0]) {
                case "scramble":
                    $("#inpScramble").val(decodeURIComponent(p.split("=")[1])).change();
                    break;
                case "steps":
                    steps = JSON.parse(decodeURIComponent(p.split("=")[1]));
                    break;
            }
        }
    }
    updateSteps();
}

function deleteStep(n) {
    for (let i = n; i < Object.keys(steps).length; i++) {
        steps[i] = steps[i + 1];
    }

    delete steps[Object.keys(steps).reverse()[0]];

    updateSteps();
}

function addStep(e) {
    let n = Object.keys(steps).length + 1;
    
    steps[n] = {
        // niss: e.currentTarget.dataset.niss,
        niss: $(e.currentTarget).prev()[0].dataset.niss,
        moves: "",
        comment: ""
    };

    updateSteps();
}

function editSteps() {
    for (let n of Object.keys(steps)) {
        steps[n].moves = $("#inpStepsM" + n).val();
        steps[n].comment = $("#inpStepsC" + n).val();
    }

    updateSolution();
    updateURL();
}

function updateSteps() {
    $("#normal").html("");
    $("#inverse").html("");
    for (let n of Object.keys(steps)) {
        let step = "<div class='steps' id='step" + n +"'>" +
                "<input id='inpStesN" + n + "' class='inpStepsN' type='number' placeholder='#' value='" + n + "' oninput='editSteps()'>" +
                "<input id='inpStepsM" + n + "' class='inpStepsM' type='text' placeholder='Moves' value=\"" + steps[n].moves + "\" oninput='editSteps()'>" +
                "<input id='inpStepsC" + n + "' class='inpStepsC' type='text' placeholder='Comment' value=\"" + steps[n].comment + "\" oninput='editSteps()'>" +
                "<button id='btnDeleteStep" + n + "' class='btnDeleteStep' onclick='deleteStep(" + n + ")'>X</button>" +
                "</div>";
        $("#" + steps[n].niss).append(step);
    }
    
    updateSolution();
    updateURL();
}

function updateSolution() {
    let normal = [];
    let inverse = [];

    for (let s of Object.keys(steps)) {
        if (steps[s].niss === "normal") {
            normal.push(steps[s].moves);
        }
        else {
            inverse.push(steps[s].moves);
        }
    }

    let sol = removeRedundantMoves(normal.join(" ").trim() + " " + inverseAlg(inverse.join(" ").trim())).trim();
    let btn = sol !== "" ? " <button onclick='copySolution()'>Copy</button>" : "";
    let out = "<h1>" + [sol, (sol === "" ? 0 : sol.split(" ").length)].join("&nbsp;&nbsp;&nbsp;") + " (HTM)" + btn + "</h1>";
    $("#solution").html(out);
    $("cube-player").attr("scramble", $("#inpScramble").val().trim());
    $("cube-player").attr("solution", sol);
    $("cube-player").attr("time", sol.split(" ").length * 500);
}

function copySolution() {
    let normal = [];
    let inverse = [];
    let solution = "Scramble:\n" + $("#inpScramble").val() + "\n\n";
    for (let s of Object.keys(steps)) {
        let moves = steps[s].moves;
        let comment = steps[s].comment;
        let niss = steps[s].niss;
        if (niss === "normal") {
            solution += moves + " // " + comment + "\n";
            normal.push(steps[s].moves);
        }
        else {
            solution += "(" + moves + ") // " + comment + "\n";
            inverse.push(steps[s].moves);
        }
    }
    let sol = removeRedundantMoves(normal.join(" ").trim() + " " + inverseAlg(inverse.join(" ").trim())).trim();
    solution += "\n\nFinal solution:\n" + sol + " (" + sol.split(" ").length + ")";
    // console.log(solution);
    navigator.clipboard.writeText(solution);
}

function updateURL() {
    let rawScramble = $("#inpScramble").val();
    let scramble = rawScramble !== "" ? "scramble=" + encodeURIComponent(rawScramble) : "";
    let jsonSteps = "steps=" + encodeURIComponent(JSON.stringify(steps));

    let urlRest = [scramble, jsonSteps].filter(u => u !== "").join("&");
    let urlExtra = urlRest !== "" ? "?" + urlRest : "";

    const state = {};
    const title = "";

    if (urlExtra !== "") {
        history.pushState(state, title, urlExtra);
    }
}