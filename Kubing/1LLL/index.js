window.location = "https://einarkl.no" + location.pathname;
let currentAlgset = localStorage.getItem("currentAlgset") || 0;
let nextAlg = 0;
let algList = [];
let currentAlg = "";

$(function() {
    showContent();
    draw("");
    
    getCustomAlgs();
    listCases();
    setAlgset(currentAlgset);
    adjustSize();

    $(window).keypress(function(e) {
        keyListener(e.keyCode);
    });
});

$(window).resize(function(){
    adjustSize();
});

function showContent() {
    let out = "";
    const select = "<div><label for='selectAlgset'>Choose algset</label><select id='selectAlgset' onchange='setAlgset(this.value)'></select></div>";
    const cubeDiv = "<div id='cubeDisplay'><h1 id='setupAlg'></h1><canvas id='cubeCanvas' width='400' height='400' style='margin: auto;'></canvas><button onclick='showSolution(); this.blur()'>Show solution</button><h1 id='solutionAlg'></h1></div>";

    if ($(window).width() >= $(window).height()) {
        //out = cubeDiv + select;
        $("#content").css("grid-template-columns", "3fr 1fr");
    }
    else {
        //out = select + cubeDiv;
        $("#content").css("grid-template-columns", "1fr");
    }
    //$("#content").html(out);
}

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
        let algorithm = Object.values(a)[0][0];
        if (a.name !== "Custom") {
            algorithm = algorithm.split("/")[0].replaceAll("(", "").replaceAll(")", "");
        }
        else {
            algorithm = "";
        }

        let c = $("#canvas"+i)[0];
        let ctx = c.getContext("2d");

        drawBnW(ctx, canvasSize, inverse(algorithm));
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
        $("#btnDropdown").text("Oll"+(parseInt(currentAlgset)+1));
    }
    
    if (algs[algset].name !== "Custom") {
        const cbCount = Object.keys(algs[algset]).length;
        let out = "";
        
        for (let i=1; i<cbCount; i++) {
            out += "<label>"+i+"<input type='checkbox' value='"+i+"' onchange='setSubsets(); this.blur()'></label>";
        }

        $("#cbSubsetDiv").html(out);
    }
    else {
        $("#cbSubsetDiv").html("<button id='btnRemoveAllCustom' onclick='removeAllCustomAlgs(); this.blur()'>Remove all from custom</button>");
    }

    setSubsets();
    adjustSize();
}

function setSubsets() {
    const algset = localStorage.getItem("currentAlgset") || 0;
    let checkedCBs = [];
    algList = [];

    for (let c of $("#cbSubsetDiv input:checked")) {
        checkedCBs.push(c.value);
    }
    
    if (checkedCBs.length === 0) {
        for (let i=1; i<Object.keys(algs[algset]).length; i++) {
            for (let a of algs[algset][i]) {
                algList.push(a.split("/")[0].replaceAll("(", "").replaceAll(")", ""));
            }
        }
    }
    else {
        for (let c of checkedCBs) {
            for (let a of algs[algset][c]) {
                algList.push(a.split("/")[0].replaceAll("(", "").replaceAll(")", ""));
            }
        }
    }

    nextAlg = 0;
    nextCase();
}

function nextCase() {
    currentAlg = algList[nextAlg].split("/")[0].replaceAll("(", "").replaceAll(")", "");
    
    if (currentAlg) {
        const scramble = inverse(currentAlg);
        draw(scramble);
        $("#setupAlg").html(scramble);
        $("#solutionAlg").html(currentAlg);
        $("#btnRemoveAllCustom").prop("disabled", false);
        addCustomAlgButton();
        nextAlg++;

        if (nextAlg === algList.length) {
            nextAlg = 0;
        }

        hideSolution();
    }
    else {
        draw("");
        $("#setupAlg").html("Currently no algs");
        $("#btnRemoveAllCustom").prop("disabled", true);
        $("#addToCustom").html("");
    }

    adjustSize();
}

function addCustomAlgButton() {
    let out = "";

    if (!algs[algs.length-1][1].includes(currentAlg)) {
        out = "<button id='customAlgButton' onclick='addCustomAlg(); this.blur()'>Add to custom</button>";
    }
    else {
        out = "<button id='customAlgButton' onclick='removeCustomAlg(); this.blur()'>Remove from custom</button>";
    }
    
    $("#addToCustom").html(out);
}

function addCustomAlg() {
    algs[algs.length-1][1].push(currentAlg);
    addCustomAlgButton();
    saveCustomAlgs();
}

function removeCustomAlg() {
    const index = algs[algs.length-1][1].indexOf(currentAlg);
    if (index !== -1) {
        algs[algs.length-1][1].splice(index, 1);
    }
    addCustomAlgButton();
    setAlgset(currentAlgset);
    saveCustomAlgs();
}

function removeAllCustomAlgs() {
    const r = confirm("Are you sure you want to remove all algs from custom?");
    if (r) {
        while (algs[algs.length-1][1].length > 0) {
            algs[algs.length-1][1].pop();
        }
        addCustomAlgButton();
        setAlgset(currentAlgset);
        saveCustomAlgs();
    }    
}

function saveCustomAlgs() {
    localStorage.setItem("customAlgs", algs[algs.length-1][1].join(";"));
}

function getCustomAlgs() {
    if (localStorage.getItem("customAlgs")) {
        const customAlgs = localStorage.getItem("customAlgs").split(";");

        for (let a of customAlgs) {
            algs[algs.length-1][1].push(a);
        }
    }
}

function toggleSolution() {
    if ($("#solutionAlg").css("visibility") === "hidden") {
        showSolution();
    }
    else {
        hideSolution();
    }
}

function showSolution() {
    $("#solutionAlg").css("visibility", "visible");
    $("#btnShowSolution").text("Hide solution");
}

function hideSolution() {
    $("#solutionAlg").css("visibility", "hidden");
    $("#btnShowSolution").text("Show solution");
}

function inverse(alg) {
    let newAlg = "";

    if (alg) {
        for (let m of alg.split(" ").slice().reverse()) {
            if (m.includes("'")) {
                newAlg += m.replace("'"," ");
            }
            else if (m.includes("2")) {
                newAlg += m.replace("2","2 ");
            }
            else {
                newAlg += m + "' ";
            }
        }
    }

    return newAlg.trim();
}

function adjustSize() {
    let cbSize = 0;
    if ($("#content").width() >= $("#content").height()) {
        cbSize = $("#content").height() / 40;
        $("#cubeDisplay").css("grid-template-rows","0fr 1fr 5fr 1fr 1fr 1fr");
        $("#setupAlg").css("font-size", $("#content").height() / 25);
        $("#solutionAlg").css("font-size", $("#content").height() / 25);
    }
    else {
        cbSize = $("#content").width() / 40;
        $("#cubeDisplay").css("grid-template-rows","1fr 1fr 5fr 1fr 1fr 1fr");
        $("#setupAlg").css("font-size", $("#content").width() / 15);
        $("#solutionAlg").css("font-size", $("#content").width() / 15);
    }

    $("input[type='checkbox']").css("width", cbSize);
    $("input[type='checkbox']").css("height", cbSize);
    $("#selectDiv label").css("font-size", cbSize);
    $("#selectAlgset").css("font-size", cbSize);
    $("#buttonDiv").css("font-size", "2.5vh");
    $("#customAlgButton").css("font-size", "2.5vh");
    $("#btnRemoveAllCustom").css("font-size", "2.5vh");
}

function keyListener(e) {
    // Space
    if (e === 32) {
        toggleSolution();
    }
    // Enter
    else if (e === 13) {
        nextCase();
    }
}