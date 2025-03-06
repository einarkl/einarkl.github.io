let currentAlgset = localStorage.getItem("currentAlgset") || 0;
let currentAUFs = $.parseJSON(localStorage.getItem("currentAUFs")) || {"-" : true, "U" : false, "U2" : false, "U'" : false};
let nextAlg = 0;
let algList = [];
let currentAlg = "";
let currentAUF = "";

class Solution {
    constructor(
        time, penalty, scramble, comment, date, totalTime, index, alg, auf,
        ao3 = "-", ao5 = "-", ao12 = "-", ao25 = "-", ao50 = "-", ao100 = "-",
        ao200 = "-", ao500 = "-", ao1000 = "-", ao2000 = "-", ao5000 = "-", ao10000 = "-"
    ) {
        this.time = time;
        this.penalty = penalty;
        this.scramble = scramble;
        this.comment = comment;
        this.date = date;
        this.totalTime = totalTime;
        this.index = index;
        this.alg = alg;
        this.auf = auf;
        this.ao3 = ao3;
        this.ao5 = ao5;
        this.ao12 = ao12;
        this.ao25 = ao25;
        this.ao50 = ao50;
        this.ao100 = ao100;
        this.ao200 = ao200;
        this.ao500 = ao500;
        this.ao1000 = ao1000;
        this.ao2000 = ao2000;
        this.ao5000 = ao5000;
        this.ao10000 = ao10000
    }
}

class Session {
    constructor(id, name, rank, scrType, solutions) {
        this.id = id;
        this.name = name;
        this.rank = rank;
        this.scrType = scrType;
        this.solutions = solutions;
    }
}

let timing, waiting, ready = false;
let stopped = true;
let scramble;
let curSession;

let interval;
let waitingInterval;
let start;

let green = "#00FF00";
let yellow = "#F5E801";
let red = "#FF0000";

const scrTypes = ["333", "222", "444", "555", "666", "777", "clock", "minx", "pyram", "skewb", "sq1"];

let wait055;
let showTime;
let listLatestFirst;
let customPlaceholder;

let svgWidth, svgHeight;

let rawTime = -1;
let curSingle = -1;
let bestSingle = -1;

let solutionsSorted = [];
let solutionsUnsorted = [];

let sessionList = [];

let doNotScramble = false;
let doNotCreateNew = false;

let calcStats;

let updateFromIndex = 0;

let settings;

let showingOuterInner = false;

let avgList = ["3", "5", "12", "25", "50", "100", "200", "500", "1000", "2000", "5000", "10000"];

let averages = {
    "cur" : {
        "3" : Infinity,
        "5" : Infinity,
        "12" : Infinity,
        "25" : Infinity,
        "50" : Infinity,
        "100" : Infinity,
        "200" : Infinity,
        "500" : Infinity,
        "1000" : Infinity,
        "2000" : Infinity,
        "5000" : Infinity,
        "10000" : Infinity
    },
    "best" : {
        "3" : Infinity,
        "5" : Infinity,
        "12" : Infinity,
        "25" : Infinity,
        "50" : Infinity,
        "100" : Infinity,
        "200" : Infinity,
        "500" : Infinity,
        "1000" : Infinity,
        "2000" : Infinity,
        "5000" : Infinity,
        "10000" : Infinity
    },
    "bestLastIDX" : {
        "3" : 0,
        "5" : 0,
        "12" : 0,
        "25" : 0,
        "50" : 0,
        "100" : 0,
        "200" : 0,
        "500" : 0,
        "1000" : 0,
        "2000" : 0,
        "5000" : 0,
        "10000" : 0
    }
}

$(function () {
    initActions();
    adjustSize();
});

$(window).resize(function(){
    adjustSize();
});

function listCases() {

    let out = "";
    let dOut = "";

    const canvasSize = $("#selectAlgset").height() * 2;
    
    let i = 0;
    for (let a of algs) {
        out += "<option id='algOpt"+i+"' value='"+i+"'>"+a.name+"<canvas id='canvas"+i+"' width='"+canvasSize+"' height='"+canvasSize+"'></canvas></option>";
        i++;
    }

    $("#selectAlgset").append(out);
    $("#selectAlgset").val(currentAlgset);


    let j = 0;
    for (let a of algs) {
        dOut += "<span value='"+j+"' class='dropdown-item'' onclick='setAlgset("+j+"); this.blur()'><img id='algImg"+j+"' src='' alt=''>&nbsp;&nbsp;"+a.name+"</span>";
        j++;
    }
    
    $("#dropdownAlgset").append(dOut);
    $("#dropdownAlgset").val(currentAlgset);

    listImages();
}

function listImages() {
    const canvasSize = $("#selectAlgset").height() * 2;

    let i = 0;
    for (let a of algs) {
        let algorithm = Object.values(a)[0];
        if (a.name !== "Custom") {
            algorithm = algorithm.split("/")[0].replaceAll("(", "").replaceAll(")", "");
        }
        else {
            algorithm = "";
        }

        let c = $("#canvas"+i)[0];
        let ctx = c.getContext("2d");

        drawBnW(ctx, canvasSize, algorithm);
        let img = c.toDataURL("image/png");

        $("#algImg"+i).attr("src", img);

        i++;
    }

    $("#selectAlgset").remove();
}

function setAlgset(algset) {
    localStorage.setItem("currentAlgset", algset);
    currentAlgset = algset;

    if (currentAlgset === 57) {
        $("#btnDropdown").text("Pll");
    }
    else if (currentAlgset === 58) {
        $("#btnDropdown").text("Custom");
    }
    else {
        $("#btnDropdown").text(algs[parseInt(currentAlgset)].name);
    }
    adjustSize();
    getScramble();
}

function waitForTimer() {
    $("#scramble").css("visibility","hidden");
    $("#left").css("visibility","hidden");
    $("#right").css("visibility","hidden");
    $("#scramble h1").text("");

    if (wait055 && !waiting && stopped) {
        waiting = true;
        //Fiks denne
        $("#display h1").css("color", red);
        const waitStart = new Date().getTime();
        let waitingTime = 0;

        waitingInterval = setInterval(function() {
            waitingTime = new Date().getTime() - waitStart;
            if (waitingTime >= 550) {
                clearInterval(waitingInterval);
                readyTimer();
            }            
        }, 10);
    }
    else {
        readyTimer();
    }
}

function readyTimer() {
    if (!ready) {
        ready = true;
        $("#display h1").css("color", green);
    }
}

function startTimer() {
    timing = true;
    waiting = false;
    ready = false;
    stopped = false;
    $("#display h1").css("color", "white");

    start = new Date().getTime();
    interval = setInterval(function() {
        rawTime = new Date().getTime() - start;
        if (showTime) {
            $("#display h1").text(getHHmmsshh(rawTime));
        }
        else {
            $("#display h1").text(customPlaceholder);
        }
    }, 10);
    
}

function stopTimer() {
    if (!stopped) {
        $("#scramble").css("visibility","visible");
        $("#left").css("visibility","visible");
        $("#right").css("visibility","visible");
        $("#display h1").text(getHHmmsshh(rawTime));
        clearInterval(interval);
        stopped = true;

        // Save time and scramble
        saveSolution();

        getScramble();
    }
}

function resetTimer() {
    clearInterval(interval);
    clearInterval(waitingInterval);
    timing = false;
    ready = false;
    waiting = false;
    stopped = true;
    $("#scramble").css("visibility","visible");
    $("#left").css("visibility","visible");
    $("#right").css("visibility","visible");
    $("#display h1").css("color", "white");
    $("#display h1").text("0.00");
    $("#scramble h1").text(scramble);
}

function getScramble() {
    if (!doNotScramble) {
        let curZBLL = algs[parseInt(currentAlgset)];
        let r = Math.floor(Math.random() * (Object.keys(curZBLL).length - 1));
        let aufs = [];
        for (let k of Object.keys(currentAUFs)) {
            if (currentAUFs[k]) {
                aufs.push(k);
            }
        }
        currentAUF = aufs[Math.floor(Math.random() * (aufs.length))];
        console.log(currentAUF);
        
        let rauf = currentAUF.replace("U", "y");
        if (rauf === "-") {
            rauf = "";
        }
        else if (rauf === "y'") {
            rauf = "y";
        }
        else if (rauf === "y") {
            rauf === "y'";
        }

        currentAlg = curZBLL[r];
        scramble = getMovesWithoutRotations(rauf + " " + currentAlg);
        $("#scramble h1").html(scramble);
    
        drawScramble();
    }

    doNotScramble = false;
}

function drawScramble() {
    resetDrawSvg("#cube");
    drawScrambleNxN("#cube", 3, scramble);
}

function saveSolution() {
    //Add solution to solutions
    calcStats = true;
    const date = Date.now().toString().split("").slice(0, 10).join("");
    const newSolution = new Solution(rawTime, 0, scramble, "", date, rawTime, sessionList[curSession].solutions.length, currentAlg, currentAUF);
    sessionList[curSession].solutions.push(newSolution);
    
    updateFromIndex = sessionList[curSession].solutions.length - 1;
    openDB(editDB, sessionList[curSession].id, sessionList[curSession]);
}

function showOptions() {
    showingOuterInner = true;
    $("#outerOptions").css("display", "block");
}

function closeOptions() {
    showingOuterInner = false;
    $("#outerOptions").css("display", "none");
}

function showTimeStats() {
    showingOuterInner = true;
    $("#outerTimeStats").css("display", "block");
}

function closeTimeStats() {
    showingOuterInner = false;
    $("#outerTimeStats").css("display", "none");
}

function connectAndGetDataFromDB() {
    openDB(getAllFromDB);
}
let startTime;
function getData(data) {
    let arr = data.slice().sort(function(a,b){return a.rank-b.rank});
    
    if (arr.length !== 0) {
        sessionList = arr.slice();

        checkSessions();
    }
    else {
        if (!doNotCreateNew) {
            createSession();
        }
        doNotCreateNew = false;
    }
}

function createSession() {
    $("#btnNew").blur();
    let num = sessionList.length + 1;
    let sessionId = "session"+num;
    let sessionName = "Session "+num;
    let sessionRank = sessionList.length + 1;
    let sessionScrType = scrTypes[0];
    let sessionSolutions = [];

    if (sessionList[curSession] && sessionScrType === sessionList[curSession].scrType) {
        doNotScramble = true;
    }
    
    curSession = sessionList.length;

    if (sessionList.some(e => e.name === sessionName)) {
        let sNum = 1;

        for (let s of sessionList) {
            if (s.name.includes("_")) {
                sNum++;
            }
        }

        if (sNum < 10) {
            sessionName += "_0" + sNum;
        }
        else {
            sessionName += "_" + sNum;
        }
    }
    
    const nSession = new Session(sessionId, sessionName,sessionRank,sessionScrType, sessionSolutions);

    openDB(editDB, sessionId, nSession);
    resetTimer();
}

function renameSession() {
    let sName = prompt("Enter session name:", sessionList[curSession].name);
    if (sName) {
        sessionList[curSession].name = sName;
        doNotScramble = true;
        openDB(editDB, sessionList[curSession].id, sessionList[curSession]);
    }
}

function resetSession() {
    if (confirm("Are you sure you want do reset the session?")) {
        sessionList[curSession].solutions = [];
        doNotScramble = true;
        openDB(editDB, sessionList[curSession].id, sessionList[curSession]);
    }
}

function deleteSession() {
    if (confirm("Are you sure you want do delete the session?")) {
        let lastSession = curSession === sessionList.length - 1;
        let scr = sessionList[curSession].scrType;

        for (let i = curSession; i < sessionList.length; i++) {
            if (sessionList[i + 1]) {
                sessionList[i].name = sessionList[i + 1].name;
                sessionList[i].scrType = sessionList[i + 1].scrType;
                sessionList[i].solutions = sessionList[i + 1].solutions;
            }
        }
        let lastID = sessionList.pop().id;
        
        for (let i = curSession; i < sessionList.length; i++) {
            doNotScramble = true;
            openDB(editDB, sessionList[i].id, sessionList[i]);
        }

        openDB(removeFromDB(lastID));

        if (lastSession) {
            let id = sessionList[sessionList.length - 1].id;
            //$("#sessionList").val(name).change();
            $("#sessionList option[id="+id+"]").attr("selected","selected");

            curSession = sessionList.length - 1;
        }

        if (scr === sessionList[curSession].scrType) {
            doNotScramble = true;
        }

        checkSessions();
        resetTimer();
    }
}

function checkSessions() {
    // Clear sessionList
    $("#sessionList").empty();
    // List sessions
    for (let s of sessionList) {
        if (s.rank - 1 === curSession) {
            $("#sessionList").append("<option id='"+s.id+"' value='"+(s.rank - 1)+"' data-rank='"+s.rank+"' selected>"+s.name+"</option>");
        }
        else {
            $("#sessionList").append("<option id='"+s.id+"' value='"+(s.rank - 1)+"' data-rank='"+s.rank+"'>"+s.name+"</option>");
        }
    }

    // Session buttons
    if (sessionList.length === 1) {
        $("#btnDelete").prop('disabled', true);
    }
    else {
        $("#btnDelete").prop('disabled', false);
    }

    if ($("#sessionList").length === 99) {
        $("#btnNew").prop('disabled', true);
    }
    else {
        $("#btnNew").prop('disabled', false);
    }

    updateSession();
}

function changeSession() {
    let scr = sessionList[curSession].scrType;
    curSession = parseInt($("#sessionList").val());
    changeSettings();
    
    if (scr === sessionList[curSession].scrType) {
        doNotScramble = true;
    }
    
    resetTimer();
    
    updateFromIndex = 0;
    checkSessions();
    $("#sessionList").blur();
}

function updateSession() {
    addSolutionsToDB(sessionList[curSession].solutions, updateFromIndex);
    updateFromIndex = 0;
}

function updateStats() {
    let solArr = sessionList[curSession].solutions.map(s => s.time);
    let arr = solArr.slice();
    let sols = sessionList[curSession].solutions;
    
    // pbList
    $("#pbList").empty();
    $("#pbList").append("<tr><th>Single</th><td id='curSingle' class='cellToClick'>-</td><td id='bestSingle' class='cellToClick'>-</td></tr>");

    // timeList
    $("#timeList").empty();

    // emptyAvgArrays();

    if (arr.length !== 0) {
        // timeList
        let solsToShow = sols.length > 100 ? sols.slice(sols.length - 100) : sols;
        for (let s of solsToShow) {
            let i = sessionList[curSession].solutions.indexOf(s);
            let i5 = i - 4;
            let i12 = i - 11;
            let c = s.comment !== "" ? "*" : "&nbsp;";
            
            let single = "<td class='cellToClick' onclick='showInfo("+i+", 1)'>"+getHHmmsshh(s.time, s.penalty)+"</td>";
            let ao5 = "<td class='cellToClick' onclick='showInfo("+i+", 5)'>"+getHHmmsshh(getAvgSorted(i, 5))+"</td>";
            let ao12 = "<td class='cellToClick' onclick='showInfo("+i+", 12)'>"+getHHmmsshh(getAvgSorted(i, 12))+"</td>";
            $("#timeList").append("<tr><td>"+(i + 1) + c +"</td>"+single+ao5+ao12+"</tr>");
        }

        if (listLatestFirst) {
            reverseTable("#timeList");
        }

        // pbList
        curSingle = arr[arr.length - 1];
        bestSingle = solutionsSorted[0].totalTime;

        $("#curSingle").text(getHHmmsshh(curSingle));
        $("#bestSingle").text(getHHmmsshh(bestSingle));
        
        $("#curSingle").on("click", function() {
            let i = sols.length - 1;
            showInfo(i, 1, true);
        });
        
        $("#bestSingle").on("click", function() {
            let i = sols.map(s => s.totalTime).indexOf(bestSingle);
            showInfo(i, 1, true);
        });
        
        for (let n of avgList.map(t => parseInt(t))) {
            if (sols.length >= n) {
                addToPBList(sols.map(s => s.totalTime), n);
            }
        }
    }
    adjustSize();
}

function addToPBList(arr, num) {
    // let curAvg = getAvg(arr.slice(arr.length - num), num);
    let curAvg = getAvgSorted(arr.length-1, num);
    let bestAvg = averages["best"][num];

    let avgName = num === 3 ? "Mo3" : "Ao" + num;
    let curAvgID = num === 3 ? "curMo3" : "curAo" + num;
    let bestAvgID = num === 3 ? "bestMo3" : "bestAo" + num;

    $("#pbList").append("<tr><th>"+avgName+"</th><td id='"+curAvgID+"' class='cellToClick'>"+getHHmmsshh(curAvg)+"</td><td id='"+bestAvgID+"' class='cellToClick'>"+getHHmmsshh(bestAvg)+"</td></tr>");

    $("#"+curAvgID).on("click", function() {
        let i = arr.length-1;
        showInfo(i, num, true);
    });
    
    if (bestAvg === Infinity) {
        bestAvg = "DNF";
    }

    $("#"+bestAvgID).on("click", function() {
        let i = averages["bestLastIDX"][num];
        showInfo(i, num, true, "best");
    });

    $("#loader").css("visibility", "hidden");
}

function reverseTable(table) {
    $(table).each(function(){
        let list = $(this).children('tr');
        $(this).html(list.get().reverse());
    });
}

function showInfo(i, num, pb = null, avg = "cur") {
    if (i < num - 1) {
        return;
    }
    let info = "Date: " + getDDMMYYYY(sessionList[curSession].solutions[i].date) + "<br/><br/>";
    if (num === 1) {
        let s = sessionList[curSession].solutions[i];
        let c = s.comment !== "" ? " [" + s.comment + "]" : s.comment;
        info += getHHmmsshh(s.time, s.penalty, true) + stripHTML(c) + "&nbsp;&nbsp;&nbsp;" + s.scramble;
    }
    else {
        if (num === 3) {
            info += "Mo3: " + getHHmmsshh(averages[avg]["3"]) + "<br/><br/>"
        }
        else {
            info += "Ao" + num + ": " + getHHmmsshh(averages[avg][num+""]) + "<br/><br/>";
        }

        let arr = [];
        let sArr = [];
        let iArr = [];
        let nRemove = num === 1 || num === 3 ? 0 : Math.ceil(0.05 * num);

        for (let j = 0; j < num; j++) {
            let s = sessionList[curSession].solutions[i-j];
            arr.push(s.totalTime);
        }
        arr.sort(function (a, b) {
            return a-b;
        });
        for (let j = 0; j < nRemove; j++) {
            sArr.push(arr[j]);
            iArr.push(j);
        }
        for (let j = arr.length-nRemove; j < arr.length; j++) {
            sArr.push(arr[j]);
            iArr.push(j);
        }
        
        for (let n = 0; n < num; n++) {
            let s = sessionList[curSession].solutions[i+n-num+1];
            let p = s.penalty === -1 ? Infinity : s.penalty;
            let c = s.comment !== "" ? "[" + s.comment + "]" : s.comment;

            if (sArr.indexOf(s.time + p) !== -1) {
                info += (n + 1) + ". (" + getHHmmsshh(s.time, s.penalty, true) + c + ")&nbsp;&nbsp;&nbsp;" + s.scramble + "<br/>";
                sArr.splice(sArr.indexOf(s.time), 1);
            }
            else {
                info += (n + 1) + ". " + getHHmmsshh(s.time, s.penalty, true) + c + "&nbsp;&nbsp;&nbsp;" + s.scramble + "<br/>";
            }
        }
    }

    $("#innerTimeStats div").html(info);

    let buttons;
    if (num === 1 && !pb) {
        buttons = "<br/><br/><div id='penaltyOptions'>Penalty:<br/>"
                +"<label>OK <input id='radioPenaltyOK' type='radio' name='penalty' value='0' onclick='changePenalty("+i+")'></label>&nbsp;&nbsp;"
                +"<label>+2 <input id='radioPenalty2' type='radio' name='penalty' value='2000' onclick='changePenalty("+i+")'></label>&nbsp;&nbsp;"
                +"<label>DNF <input id='radioPenaltyDNF' type='radio' name='penalty' value='-1' onclick='changePenalty("+i+")'></label>&nbsp;&nbsp;"
                +"<button onclick='editComment("+i+")'>Comment</button><br/><br/>"
                +"<button onclick='deleteSolve("+i+")'>Delete</button>"
                +"</div>";
        $("#innerTimeStats div").append(buttons);

        let p = sessionList[curSession].solutions[i].penalty;
        $("input:radio[name=penalty]").filter("[value="+p+"]").prop('checked', true);
    }
    showTimeStats();
}

function changePenalty(i) {
    calcStats = true;
    updateFromIndex = i;
    let t = sessionList[curSession].solutions[i].time;
    let p = parseInt($('input[name="penalty"]:checked').val());
    sessionList[curSession].solutions[i].penalty = p;
    sessionList[curSession].solutions[i].totalTime = t + (p === -1 ? Infinity : p);

    doNotScramble = true;
    openDB(editDB, sessionList[curSession].id, sessionList[curSession]);
    showInfo(i, 1);
}

function editComment(i) {
    let c = prompt("Comment", sessionList[curSession].solutions[i].comment);
    if (c || c === "") {
        updateFromIndex = i;
        sessionList[curSession].solutions[i].comment = c;
        doNotScramble = true;
        openDB(editDB, sessionList[curSession].id, sessionList[curSession]);
    }
    showInfo(i, 1);
}

function stripHTML(html){
    return html.replaceAll("<","&lt;").replaceAll(">","&gt;");
}

function deleteSolve(i) {
    if (confirm("Are you sure you want do delete the time?")) {
        updateFromIndex = i;
        sessionList[curSession].solutions.splice(i, 1);

        doNotScramble = true;
        openDB(editDB, sessionList[curSession].id, sessionList[curSession]);
        closeTimeStats();
    }
}

function getDDMMYYYY(ms) {
    if (ms.toString().length === 10) {
        ms *= 1000;
    }

    const d = new Date(ms);
    const day = d.getDate().toString().length < 2 ? "0" + d.getDate() : d.getDate();
    const month = (d.getMonth() + 1).toString().length < 2 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
    const year = d.getFullYear();
    const hours = d.getHours().toString().length < 2 ? "0" + d.getHours() : d.getHours();
    const minutes = d.getMinutes().toString().length < 2 ? "0" + d.getMinutes() : d.getMinutes();
    const seconds = d.getSeconds().toString().length < 2 ? "0" + d.getSeconds() : d.getSeconds();

    return day + "." + month + "." + year + " " + hours + ":" + minutes + "." + seconds;
}

function getAvg(arr, num) {
    arr = arr.sort((a, b) => {return a - b});
    let toRemove = Math.ceil(0.05 * num);
    
    if (arr.length >= num) {
        let avg = 0;

        let nArr;
        if (num === 3) {
            nArr = arr.slice();
        }
        else {
            nArr = arr.slice(toRemove, (num-toRemove));
        }

        for (let a of nArr) {
            avg += Math.floor(a/10);
        }
        
        avg /= nArr.length;
        
        if (avg === Infinity) {
            return ("DNF");
        }
        else {
            return avg*10;
        }
    }
    else {
        return "-";
    }
}

function getAvgSorted(i, num) {
    let arr = solutionsSorted.filter(t => t.index > i - num && t.index <= i)
    let toRemove = Math.ceil(0.05 * num);
    
    if (arr.length >= num) {
        let avg = 0;

        let nArr;
        if (num === 3) {
            nArr = arr.slice();
        }
        else {
            nArr = arr.slice(toRemove, (num-toRemove));
        }

        for (let a of nArr) {
            avg += Math.floor(a.totalTime/10);
        }
        
        avg /= nArr.length;
        
        if (avg === Infinity) {
            return ("DNF");
        }
        else {
            return avg*10;
        }
    }
    else {
        return "-";
    }
}

function emptyAvgArrays() {
    averages = {
        "cur" : {
            "3" : Infinity,
            "5" : Infinity,
            "12" : Infinity,
            "25" : Infinity,
            "50" : Infinity,
            "100" : Infinity,
            "200" : Infinity,
            "500" : Infinity,
            "1000" : Infinity,
            "2000" : Infinity,
            "5000" : Infinity,
            "10000" : Infinity
        },
        "best" : {
            "3" : Infinity,
            "5" : Infinity,
            "12" : Infinity,
            "25" : Infinity,
            "50" : Infinity,
            "100" : Infinity,
            "200" : Infinity,
            "500" : Infinity,
            "1000" : Infinity,
            "2000" : Infinity,
            "5000" : Infinity,
            "10000" : Infinity
        },
        "bestLastIDX" : {
            "3" : 0,
            "5" : 0,
            "12" : 0,
            "25" : 0,
            "50" : 0,
            "100" : 0,
            "200" : 0,
            "500" : 0,
            "1000" : 0,
            "2000" : 0,
            "5000" : 0,
            "10000" : 0
        }
    }
}

function changeListingOrder() {
    listLatestFirst = !listLatestFirst;
    updateStats();
    changeSettings();
}

function toggleShowTime(val) {
    if (val === "1") {
        showTime = true;
        $("#inpCustomPlaceholder").prop("disabled",true);
    }
    else {
        showTime = false;
        $("#inpCustomPlaceholder").prop("disabled",false);
    }
    changeSettings();
}

function toggleWaitingTime(val) {
    if (val === "1") {
        wait055 = true;
    }
    else {
        wait055 = false;
    }
    changeSettings();
}

function changeCustomPlaceholder(val) {
    if (val.trim() !== "") {
        customPlaceholder = val.trim();
        $("#inpCustomPlaceholder").val(customPlaceholder);
    }
    else {
        $("#inpCustomPlaceholder").val(settings.customPlaceholder);
    }
    changeSettings();
}

async function importFromCSTimer() {
    let fileHandle;
    [fileHandle] = await window.showOpenFilePicker();
    let file = await fileHandle.getFile();
    let content = await file.text();
    
    if (content) {
        let json = $.parseJSON(content);

        if (json) {
            if (confirm("Importing will override current data. Do you still want to import?")) {
                $("#loader").css("visibility", "visible");
                calcStats = true;
                // resetSession();
                startTime = Date.now();
                sessionList = [];
                let numOfSessions = json.properties.sessionN || json.properties.session || Object.keys(json).map(k => k).filter(function(k){if (k.includes("session")) {return k};}).length;
                let sessionData = Object.values($.parseJSON(json.properties.sessionData)).splice(0, numOfSessions);
                let i = 0;
                $.each(json, function(key, sessions) {
                    if (key.includes("session")) {
                        // Add to current data
                        let num = sessionList.length + 1;
                        let sessionId = "session"+num;
                        let sessionName = sessionData[i].name || "Session " + num;
                        let sessionRank = sessionData[i].rank;
                        let sessionScrType = getScrType(sessionData[i].opt);
                        let sessionSolutions = [];

                        $.each(sessions, function(k, solve){
                            let penalty = solve[0][0];
                            let time = solve[0][1];
                            let scramble = solve[1];
                            let comment = solve[2];
                            let date = solve[3] !== undefined ? solve[3] : Math.floor(Date.now() / 1000);
                            let totalTime = solve[0][1] + solve[0][0] === -1 ? Infinity : solve[0][1];
                            // const newSolution = new Solution(solve[0][1], solve[0][0], solve[1], solve[2], solve[3], totalTime, k);
                            const newSolution = new Solution(time, penalty, scramble, comment, date, totalTime, k);
                            sessionSolutions.push(newSolution);
                        });
                        
                        const nSession = new Session(sessionId, sessionName,sessionRank,sessionScrType, sessionSolutions);
                        sessionList.push(nSession);

                        resetTimer();
                        i++;
                    }
                });

                doNotScramble = true; 
                dontGetAll = true; 
                openDB(removeAllFromDB);
                for (let s of sessionList) {
                    doNotScramble = true;
                    dontGetAll = (sessionList.indexOf(s) !== sessionList.length - 1);
                    openDB(editDB, s.id, s, dontGetAll);
                }
                curSession = 0;
                closeOptions();
            }
        }
    }
}

function getScrType(opt) {
    let st = opt.scrType;
    
    if (Object.keys(opt).length === 0) {
        return "333";
    }
    else if (st.includes("333")) {
        return "333";
    }
    else if (st.includes("222")) {
        return "222";
    }
    else if (st.includes("444")) {
        return "444";
    }
    else if (st.includes("555")) {
        return "555";
    }
    else if (st.includes("666")) {
        return "666";
    }
    else if (st.includes("777")) {
        return "777";
    }
    else if (st.includes("clk")) {
        return "clock";
    }
    else if (st.includes("mg")) {
        return "minx";
    }
    else if (st.includes("pyr")) {
        return "pyra";
    }
    else if (st.includes("skb")) {
        return "skewb";
    }
    else if (st.includes("sq")) {
        return "sq1";
    }
    else {
        return "333";
    }
}

function exportToCSTimer() {
    openDB(getAllFromDB, true);
}

function getExportData(data) {
    const date = getYYYYMMDD_HHmmss();

    let json = {};
    json["properties"] = {
        "sessionN" : 0,
        "sessionData": {}
    };
    let sessionN = 0;
    let solvesN = 0;
    let penalties = 0;
    let mean = 0;
    let sData = {};
    $.each(data, function(index, keys) {
        sessionN++;
        json[keys.id] = [];
        let solves = Object.values(keys)[4];
        for (let s of solves) {
            json[keys.id].push([[s.penalty, s.time], s.scramble, s.comment, s.date]);
            if (s.penalty !== 0) {
                penalties++;
            }
            solvesN++;
            mean += s;
        }

        let name = keys.name;
        let sType = keys.scrType;
        let rank = keys.rank;
        let stat = [solvesN,penalties,Math.round(mean/10)*10];
        let fDate = null;
        let lDate = null;

        if (json[keys.id]) {
            if (json[keys.id][0]) {
                fDate = json[keys.id][0][3];
            }
            if (json[keys.id][json[keys.id].length - 1]) {
                lDate = json[keys.id][json[keys.id].length-1][3];
            }
        }
        
        sData[keys.id.split("session")[1]] = {
            "name":name,
            "opt":{
                "scrType":sType
            },
            "rank":rank,
            "stat":stat,
            "date":[fDate,lDate]
        };
    });

    json["properties"].sessionN = sessionN;
    json["properties"].sessionData = JSON.stringify(sData);
    
    let blob = new Blob([JSON.stringify(json)],{type:"application/json; utf-8"});
    let a = document.createElement("a");
    a.download = "einarkl_timer_"+date+".txt";
    a.href = window.URL.createObjectURL(blob);
    a.click();
}

function getYYYYMMDD_HHmmss() {
    const d = new Date;
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().length < 2 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
    const day = d.getDate().toString().length < 2 ? "0" + d.getDate() : d.getDate();
    const hours = d.getHours().toString().length < 2 ? "0" + d.getHours() : d.getHours();
    const minutes = d.getMinutes().toString().length < 2 ? "0" + d.getMinutes() : d.getMinutes();
    const seconds = d.getSeconds().toString().length < 2 ? "0" + d.getSeconds() : d.getSeconds();

    return year + month + day + "_" + hours + minutes + seconds;
}

function changeSettings() {
    settings = {
        "curSession": curSession,
        "wait055": wait055,
        "showTime": showTime,
        "listLatestFirst": listLatestFirst,
        "customPlaceholder": customPlaceholder
    };

    localStorage.setItem("einarkl_timer_settings", JSON.stringify(settings));
}

function getSettings() {
    if (localStorage.getItem("einarkl_timer_settings")) {
        settings = $.parseJSON(localStorage.getItem("einarkl_timer_settings"));
    }
    else {
        settings = {
            "curSession": 0,
            "wait055": false,
            "showTime": true,
            "listLatestFirst": true,
            "customPlaceholder": "Timing"
        };
    }

    curSession = settings.curSession;
    wait055 = settings.wait055;
    showTime = settings.showTime;
    listLatestFirst = settings.listLatestFirst;
    customPlaceholder = settings.customPlaceholder;

    if (showTime) {
        $("input:radio[name=showTime]").filter("[value=1]").prop('checked', true);
        $("#inpCustomPlaceholder").prop("disabled",true);
    }
    else {
        $("input:radio[name=showTime]").filter("[value=0]").prop('checked', true);
        $("#inpCustomPlaceholder").prop("disabled",false);
    }
    $("#inpCustomPlaceholder").val(customPlaceholder);

    if (wait055) {
        $("input:radio[name=wait055]").filter("[value=1]").prop('checked', true);
    }
    else {
        $("input:radio[name=wait055]").filter("[value=0]").prop('checked', true);
    }

    $("#aufu0").prop('checked', currentAUFs["-"]);
    $("#aufu1").prop('checked', currentAUFs["U"]);
    $("#aufu3").prop('checked', currentAUFs["U'"]);
    $("#aufu2").prop('checked', currentAUFs["U2"]);
}

function updateAUF() {
    let u1 = $("#aufu1").is(':checked');
    let u2 = $("#aufu2").is(':checked');
    let u3 = $("#aufu3").is(':checked');
    let u0 = $("#aufu0").is(':checked') || (!u1 && !u2 && !u3);
    currentAUFs = {"-" : u0, "U" : u1, "U2" : u2, "U'" : u3};
    localStorage.setItem("currentAUFs", JSON.stringify(currentAUFs));
    
    $("#aufu0").prop('checked', currentAUFs["-"]);
}

function initActions() {
    calcStats = false;
    getSettings();
    updateAUF();

    connectAndGetDataFromDB();
    keyActions();
    touchActions();
    
    listCases();
    setAlgset(currentAlgset);

    getScramble();

    $("#timeList").parent().css("overflow-y", "scroll");

    $(".inner").on("mousedown", function (e) {
        e.stopPropagation();
    });

    $("#display").bind("contextmenu", function(e){
        return false;
    });
}

function keyActions() {
    $("html").on('keydown', function (e) {
        if (!showingOuterInner) {
            if (timing) {
                if (e.keyCode !== 27) {
                    stopTimer();
                }
            }
            else {
                if (e.keyCode === 32) {
                    if (!ready) {
                        waitForTimer();
                    }
                }
            }
            if (e.keyCode === 27) {
                resetTimer();
            }
            if (!waiting && !ready && stopped) {
                if (e.altKey && e.keyCode === 90) {
                    deleteSolve(sessionList[curSession].solutions.length - 1);
                }
                else if (e.altKey && e.keyCode === 39) {
                    getScramble();
                }
            }
        }
    })
    .on('keyup', function (e) {
        if (!showingOuterInner) {
            if (timing && e.keyCode !== 27) {
                setTimeout(
                    function() {
                        timing = false;
                    }, 100);
            }
            else if (e.keyCode === 32) {
                if (ready && !timing) {
                    startTimer();
                }
                else if (wait055 && !ready && !timing) {
                    waiting = false;
                    clearInterval(waitingInterval);
                    resetTimer();
                }
            }
        }
    });
}

function touchActions() {
    $("html").on({'touchstart' : function() {
        if (!showingOuterInner && timing) {
            stopTimer();
        }
    }});
    
    $("#display").on({'touchstart' : function(e) {
        if (!showingOuterInner && !ready && !timing) {
            e.stopPropagation();
            waitForTimer();
        }
        else if (!showingOuterInner && timing) {
            stopTimer();
        }
    }})
    .on({'touchend' : function() {
        if (!showingOuterInner) {
            if (ready && !timing) {
                startTimer();
            }
            else if (wait055 && !ready && !timing) {
                waiting = false;
                clearInterval(waitingInterval);
                resetTimer();
            }
            else if (timing) {
                setTimeout(
                    function() {
                        timing = false;
                    }, 100);
            }
        }
    }});
}

function adjustSize() {
    //Fix size for phone screen
    /*if ($("#content").width() >= $("#content").height()) {
        $("#left").css("display", "block");
        $("#content").css("grid-template-columns", "1fr 2fr 1fr");
        $("#content").css("grid-template-rows", "");
    }
    else {
        $("#left").css("display", "none");
        $("#content").css("grid-template-rows", "0fr 4fr 1fr");
        $("#content").css("grid-template-columns", "");
    }*/

    let svgWidth = $("#right").width() * 0.75;
    let svgHeight = svgWidth * 3/4;

    let h = $("#content").height() - $("#notTimeList").height();
    $("#timeList").parent().css("max-height", h);
    $("#innerTimeStats div").height("100%");
    $("#innerTimeStats div").css("overflow-y", "scroll");
    
    if (!listLatestFirst) {
        let d = $('#timeList').parent();
        d.scrollTop(d.prop("scrollHeight"));
    }
    else {
        let d = $('#timeList').parent();
        d.scrollTop(0);
    }
}