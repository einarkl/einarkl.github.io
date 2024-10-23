window.location = "https://einarkl.no" + location.pathname;
let scramble = "";
let timing, showingParity, ready;
let start;
let interval;
let inspectionInterval;
let scrambling;
let locked;
let guessing;
let guess;
let curTime;
let inspection;
let timeList;
/* let graph; */
let settings;

$(() => {
    initActions();
});

$(window).resize(() => {
    drawGraph();
});

function initActions() {
    inspection = false;
    adjustSize();

    // Hent fra DB her
    timeList = localStorage.getItem("timeListOPA") ? localStorage.getItem("timeListOPA").split(";") : [];
    settings = localStorage.getItem("settingsOPA") ? JSON.parse(localStorage.getItem("settingsOPA")) : {};
    getSettings();

    if (timeList.length !== 0) {
        for (let t of timeList) {
            addToList(t.split("*")[0], t.split("*")[1]);
        }
    }

    restart();
    drawGraph();

    $(window).on("keyup", e => {
        if (e.which === 32 && !timing && !showingParity && ready && !scrambling && !guessing) {
            startTimer();
        }
        else if (e.which === 32 && timing) {
            readyTimer();
        }
        else if (scrambling) {
            scrambling = false;
        }
    });
    $(window).on("keydown", e => {
        if (guessing) {
            // if (e.which === 32) {
            if (e.which === 50) {
                guess = "Even";
                checkParity();
            }
            // else if (e.which === 8) {
            else if (e.which === 49) {
                guess = "Odd";
                checkParity();
            }
        }
        else if (e.which !== 27 && timing && !locked) {
            stopTimer();
        }
        else if (e.which === 32 && !timing && showingParity) {
            scr();
        }
        else if (e.which === 27 && !guessing && showingParity) {
            restart();
        }
    });
}

function restart() {
    scramble = getScramble4x4(30);
    $("#scramble").text(scramble);
    $("#answer").text("");
    $("#timer").text("0.00");
    $("#btnRestart").blur();

    drawScramble();

    timing = false;
    ready = true;
    showingParity = false;
    scrambling = false;
    guessing = false;
    locked = false;

    guess = "";
    curTime = 0;
}

function scr() {
    let scr = getScramble4x4(15 + Math.round(Math.random() * 5));
    scramble += " " + scr;

    drawScramble();

    $("#scramble").text(scr);
    $("#answer").text("");
    $("#timer").text("0.00");
    $("#btnScramble").blur();
    showingParity = false;
    scrambling = true;
}

function drawScramble() {
    /* $("#svgDrawScramble").html("<svg class='svgScramble' id='cube' preserveAspectRatio='xMaxYMax meet'></svg><scramble-display event='444' scramble=\""+
                scramble+"\"></scramble-display>"); */
    drawScrambleNxN("#svgDrawScramble", 4, scramble);

    if (settings["drawScramble"]) {
        $("#svgDrawScramble").css("display", "block");
    }
    else {
        $("#svgDrawScramble").css("display", "none");
    }
}

function guessParity() {
    guessing = true;
    $("#answer").text("Press [1] if odd targets, [2] if even targets.");
}

function checkParity() {
    guessing = false;
    showingParity = true;
    let qwt = 0;
    for (let m of scramble.split(" ")) {
        if (m.includes("w") && !m.includes("2")) {
            qwt++;
        }
    }

    let answer = qwt % 2 === 0 ? "Even" : "Odd";

    $("#answer").text(answer);
    $("#btnCheck").blur();

    timeList.push(curTime + "*" + (answer === guess));
    localStorage.setItem("timeListOPA", timeList.join(";"));

    $("#scramble").text("[spacebar] to scramble on top of previous scramble, [escape] for new scramble")

    addToList(curTime, answer === guess);
}

function addToList(t, g) {
    let i = $("#tblTimes tr").length;
    $("#tblTimes").append("<tr data-time='"+t+"' data-guess='"+g+"' onclick='deleteTime("+i+")'><th>"+(i + 1)+"</th><td>"+getHHmmsshh(t)+"</td><td>"+g+"</td></tr>");
    let d = $("#tblTimes").parent();
    d.scrollTop(d.prop("scrollHeight"));

    updateStats();
}

function clearList() {
    if (confirm("Do you really want to clear time list? There is no way back...")) {
        $("#tblTimes").html("");
        timeList = [];

        // Fjern fra localStorage
        localStorage.removeItem("timeListOPA");
        updateStats();
    }
    $("#btnClear").blur();
}

function deleteTime(i) {
    if (confirm("Are you sure you want do delete the time?")) {
        timeList[i] = "null";
        timeList = timeList.filter(t => t !== "null");
        $("#tblTimes").html("");
        for (let t of timeList) {
            addToList(t.split("*")[0], t.split("*")[1]);
        }
        localStorage.setItem("timeListOPA", timeList.join(";"));
        updateStats();
    }
}

function updateStats() {
    if (timeList.length === 0) {
        $("#tdBest").html("-");
        $("#tdRate").html("-");
        $("#tdMean").html("-");
    }
    else {
        let totalTime = 0;
        for (let t of timeList.map(t => t.split("*")[0])) {
            totalTime += parseInt(t);
        }
        let bestTime = timeList.filter(t => t.split("*")[1] === "true").map(t => parseInt(t.split("*")[0])).sort((a, b) => a - b)[0];
        let best = bestTime ? getHHmmsshh(bestTime) : "-";
        let attempts = timeList.length;
        let successes = timeList.map(t => t.split("*")[1]).filter(g => g === "true").length;
        let percentage = " (" + ((successes / attempts) * 100).toFixed(1) + "%)";
        $("#tdBest").html(best);
        $("#tdRate").html(successes + "/" + attempts + percentage);
        $("#tdMean").html(getHHmmsshh(Math.round(totalTime / attempts)));
    }
    drawGraph();
}

function startTimer() {
    timing = true;
    ready = false;
    start = Date.now();
    $("#timer").text("Timing");
    $("#scramble").html("<br>");

    if (inspection) {
        runInspection();
    }
}

function stopTimer() {
    stopInspection();
    locked = true;
    let time = Date.now() - start;
    $("#timer").text(getHHmmsshh(time));
    curTime = time;
    guessParity();
}

function readyTimer() {
    ready = true;
    timing = false;
    locked = false;
}

function runInspection() {
    $("body").css("background", "green");
    let i8 = false;
    let i12 = false;
    let i15 = false;
    let i17 = false;

    inspectionInterval = setInterval(() => {
        if (Date.now() - start >= 8000 && !i8) {
            $("body").css("background", "yellow");
        }
        if (Date.now() - start >= 12000 && !i12) {
            $("body").css("background", "orange");
        }
        if (Date.now() - start >= 15000 && !i15) {
            $("body").css("background", "red");
        }
        if (Date.now() - start >= 17000 && !i17) {
            $("body").css("background", "#500000");
        }
    }, 1000);
}

function stopInspection() {
    clearInterval(inspectionInterval);
    $("body").css("background", "transparent");
}

function getScramble4x4(num) {
    let n = 4;
    let scr = "";
    let movesExtra = ["", "'", "2"];
    let axises = [["U","D"], ["F","B"], ["R","L"]];
    let movesAxis = [["",""]];

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

/* function getHHmmsshh(ms, penalty = 0, stats = false) {
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
    
    return timeStr;
} */

function drawGraph() {
    $("#svgGraph").empty();
    let w = timeList.map(t => parseInt(t.split("*")[0])).sort((a, b) => b - a)[0];
    let b = timeList.map(t => parseInt(t.split("*")[0])).sort((a, b) => a - b)[0];
    let worstTime = timeList.length >= 2 ? getHHmmsshh(w) : "-";
    let bestTime = timeList.length >= 2 ? getHHmmsshh(b) : "-";
    
    let worst = document.createElementNS('http://www.w3.org/2000/svg', "text");
    $(worst).attr("x", 0);
    $(worst).attr("y", 15);
    $(worst).attr("font-size", 15);
    $(worst).attr("fill", "#aaaaaa");
    $(worst).text(worstTime);

    $("#svgGraph").append(worst);

    let best = document.createElementNS('http://www.w3.org/2000/svg', "text");
    $(best).attr("x", 0);
    $(best).attr("y", $("#svgGraph").height()-5);
    $(best).attr("font-size", 15);
    $(best).attr("text-align", "right");
    $(best).attr("fill", "#aaaaaa");
    $(best).text(bestTime);

    $("#svgGraph").append(best);

    let wWorst = $(worst)[0].getBoundingClientRect().width;
    let x = wWorst + 5;
    let y = 5;
    let width = $("#svgGraph").width() - x;
    let height = $("#svgGraph").height() - 10;

    /* if (graph === "light") {
        let rect = document.createElementNS('http://www.w3.org/2000/svg', "rect");
        $(rect).attr("x", x);
        $(rect).attr("y", y);
        $(rect).attr("width", width);
        $(rect).attr("height", height);
        $(rect).attr("style", "fill:#f1f1f1;");
    
        $("#svgGraph").append(rect);
    } */

    if (timeList.length >= 2) {
        let diff = w - b;
        let n = width / (timeList.length - 1);
        let i = 0;
        let points = [];
        
        for (let t of timeList) {
            points.push([x + i * n, y + (1 - ((t.split("*")[0] - b) / diff)) * height, t.split("*")[1]]);
            i++;
        }
        
        for (let p = 1; p < points.length; p++) {
            let colLine = "#aaaaaa";
            let x1 = points[p - 1][0];
            let x2 = points[p][0];
            let y1 = points[p - 1][1];
            let y2 = points[p][1];

            let line = document.createElementNS('http://www.w3.org/2000/svg', "line");
            $(line).attr("x1", x1);
            $(line).attr("y1", y1);
            $(line).attr("x2", x2);
            $(line).attr("y2", y2);
            $(line).attr("style", "stroke:"+colLine+";stroke-width:1");

            $("#svgGraph").append(line);
        }

        for (let p of points) {
            let cx = p[0];
            let cy = p[1];
            let color = p[2] === "true" ? "#00aa00" : "#FF0000";

            let circle = document.createElementNS('http://www.w3.org/2000/svg', "circle");
            $(circle).attr("cx", cx);
            $(circle).attr("cy", cy);
            $(circle).attr("r", 3);
            $(circle).attr("style", "fill:"+color);

            $("#svgGraph").append(circle);
        }
    }
}

function toggleButtons(val) {
    console.log(val);
}

function toggleInspection(val) {
    inspection = val;
    settings["inspection"] = val;
    $("#cbInspection").blur();
    updateSettings();
}

function toggleDrawScramble(val) {
    settings["drawScramble"] = val;
    $("#cbDrawScramble").blur();
    updateSettings();

    if (val) {
        $("#svgDrawScramble").css("display", "block");
    }
    else {
        $("#svgDrawScramble").css("display", "none");
    }
}

/* function toggleGraph(val) {
    graph = val ? "dark" : "light";
    settings["graph"] = graph;
    $("#cbGraph").blur();
    updateSettings();
    drawGraph();
} */

function updateSettings() {
    localStorage.setItem("settingsOPA", JSON.stringify(settings));
}

function getSettings() {
    $("#cbInspection").prop('checked', settings["inspection"]);
    $("#cbDrawScramble").prop('checked', settings["drawScramble"]);
    inspection = settings["inspection"];

    /* if (!settings["graph"]) {
        settings["graph"] = "dark";
    }
    $("#cbGraph").prop('checked', settings["graph"] === "dark");
    graph = settings["graph"]; */
}

function adjustSize() {
    let w = $(window).width();
    let h = $(window).height();
    $("#svgGraph").width("25%");
    $("#svgGraph").height($("#svgGraph").width() * 2 / 4);
    $("#svgGraph").css("right", "0.5%");
    $("#svgGraph").css("bottom", $("#svgGraph").css("right"));
    $("#svgGraph").attr("viewBox", "-10 -10 " + ($("#svgGraph").width() + 10) + " " + ($("#svgGraph").height() + 10));

    $("#svgDrawScramble").height(3 * $("#svgDrawScramble").width() / 4);
    $("#svgDrawScramble").css("left", "50%");
    $("#svgDrawScramble").css("transform", "translate(-50%)");
    $("#svgDrawScramble").css("bottom", "1%");

    $("#tblHeader th, #tblHeader td, #tblTimes th, #tblTimes td").width($("#tblTimes").width() / 3);
    $("#tblTimesParent").css("overflow-y", "scroll");
}