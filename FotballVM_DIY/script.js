window.location = "https://einarkl.no" + location.pathname;
let brazil = "Brazil";
let belgium = "Belgium";
let argentina = "Argentina";
let france = "France";
let england = "England";
let spain = "Spain";
let netherlands = "Netherlands";
let portugal = "Portugal";
let denmark = "Denmark";
let germany = "Germany";
let croatia = "Croatia";
let mexico = "Mexico";
let uruguay = "Uruguay";
let switzerland = "Switzerland";
let usa = "USA";
let senegal = "Senegal";
let wales = "Wales";
let iran = "Iran";
let serbia = "Serbia";
let morocco = "Morocco";
let japan = "Japan";
let poland = "Poland";
let korea = "Korea";
let tunisia = "Tunisia";
let costarica = "Costa Rica";
let australia = "Australia";
let canada = "Canada";
let cameroon = "Cameroon";
let ecuador = "Ecuador";
let qatar = "Qatar";
let saudiarabia = "Saudi Arabia";
let ghana = "Ghana";

let teams = [
    {country : brazil, ranking : 1, points : 1841, group : "g", score : 0, goaldiff : 0},
    {country : belgium, ranking : 2, points : 1816, group : "f", score : 0, goaldiff : 0},
    {country : argentina, ranking : 3, points : 1773, group : "c", score : 0, goaldiff : 0},
    {country : france, ranking : 4, points : 1759, group : "d", score : 0, goaldiff : 0},
    {country : england, ranking : 5, points : 1728, group : "b", score : 0, goaldiff : 0},
    {country : spain, ranking : 7, points : 1715, group : "e", score : 0, goaldiff : 0},
    {country : netherlands, ranking : 8, points : 1694, group : "a", score : 0, goaldiff : 0},
    {country : portugal, ranking : 9, points : 1676, group : "h", score : 0, goaldiff : 0},
    {country : denmark, ranking : 10, points : 1666, group : "d", score : 0, goaldiff : 0},
    {country : germany, ranking : 11, points : 1650, group : "e", score : 0, goaldiff : 0},
    {country : croatia, ranking : 12, points : 1645, group : "f", score : 0, goaldiff : 0},
    {country : mexico, ranking : 13, points : 1644, group : "c", score : 0, goaldiff : 0},
    {country : uruguay, ranking : 14, points : 1638, group : "h", score : 0, goaldiff : 0},
    {country : switzerland, ranking : 15, points : 1635, group : "g", score : 0, goaldiff : 0},
    {country : usa, ranking : 16, points : 1627, group : "b", score : 0, goaldiff : 0},
    {country : senegal, ranking : 18, points : 1584, group : "a", score : 0, goaldiff : 0},
    {country : wales, ranking : 19, points : 1569, group : "b", score : 0, goaldiff : 0},
    {country : iran, ranking : 20, points : 1564, group : "b", score : 0, goaldiff : 0},
    {country : serbia, ranking : 21, points : 1563, group : "g", score : 0, goaldiff : 0},
    {country : morocco, ranking : 22, points : 1563, group : "f", score : 0, goaldiff : 0},
    {country : japan, ranking : 24, points : 1559, group : "e", score : 0, goaldiff : 0},
    {country : poland, ranking : 26, points : 1548, group : "c", score : 0, goaldiff : 0},
    {country : korea, ranking : 28, points : 1530, group : "h", score : 0, goaldiff : 0},
    {country : tunisia, ranking : 30, points : 1507, group : "d", score : 0, goaldiff : 0},
    {country : costarica, ranking : 31, points : 1503, group : "e", score : 0, goaldiff : 0},
    {country : australia, ranking : 38, points : 1488, group : "d", score : 0, goaldiff : 0},
    {country : canada, ranking : 41, points : 1475, group : "f", score : 0, goaldiff : 0},
    {country : cameroon, ranking : 43, points : 1471, group : "g", score : 0, goaldiff : 0},
    {country : ecuador, ranking : 44, points : 1464, group : "a", score : 0, goaldiff : 0},
    {country : qatar, ranking : 50, points : 1439, group : "a", score : 0, goaldiff : 0},
    {country : saudiarabia, ranking : 51, points : 1437, group : "c", score : 0, goaldiff : 0},
    {country : ghana, ranking : 61, points : 1393, group : "h", score : 0, goaldiff : 0}
];
let sixteenTeams = [];
let quarterTeams = [];
let semiTeams = [];
let finalTeams = [];
let winner;
let runnerup;

const groupMatches = {
    1 : [qatar, ecuador],
    2 : [england, iran],
    3 : [senegal, netherlands],
    4 : [usa, wales],
    5 : [argentina, saudiarabia],
    6 : [denmark, tunisia],
    7 : [mexico, poland],
    8 : [france, australia],
    9 : [morocco, croatia],
    10 : [germany, japan],
    11 : [spain, costarica],
    12 : [belgium, canada],
    13 : [switzerland, cameroon],
    14 : [uruguay, korea],
    15 : [portugal, ghana],
    16 : [brazil, serbia],
    17 : [wales, iran],
    18 : [qatar, senegal],
    19 : [netherlands, ecuador],
    20 : [england, usa],
    21 : [tunisia, australia],
    22 : [poland, saudiarabia],
    23 : [france, denmark],
    24 : [argentina, mexico],
    25 : [japan, costarica],
    26 : [belgium, morocco],
    27 : [croatia, canada],
    28 : [spain, germany],
    29 : [cameroon, serbia],
    30 : [korea, ghana],
    31 : [brazil, switzerland],
    32 : [portugal, uruguay],
    33 : [netherlands, qatar],
    34 : [ecuador, senegal],
    35 : [wales, england],
    36 : [iran, usa],
    37 : [australia, denmark],
    38 : [tunisia, france],
    39 : [poland, argentina],
    40 : [saudiarabia, mexico],
    41 : [croatia, belgium],
    42 : [canada, morocco],
    43 : [japan, spain],
    44 : [costarica, germany],
    45 : [ghana, uruguay],
    46 : [korea, portugal],
    47 : [serbia, switzerland],
    48 : [cameroon, brazil]
};
let sixteenMatches = {};
let quarterMatches = {};
let semiMatches = {};
let finalMatch = {};

$(() => {
    initTables();
    calculateMatches();
});

function match(tca, tcb, h, b) {
    let indA = teams.findIndex(t => t.country === tca);
    let indB = teams.findIndex(t => t.country === tcb);

    let ta = teams[indA];
    let tb = teams[indB];

    let pa = ta.points;
    let pb = tb.points;

    let scoreA, scoreB, diffA, diffB;

    if (h > b) {
        scoreA = 3;
        scoreB = 0;
        diffA = h - b;
        diffB = b - h;
    }
    else if (h < b) {
        scoreA = 0;
        scoreB = 3;
        diffA = h - b;
        diffB = b - h;
    }
    else {
        scoreA = 1;
        scoreB = 1;
        diffA = 0;
        diffB = 0;
    }

    ta.score += scoreA;
    ta.goaldiff += diffA;
    tb.score += scoreB;
    tb.goaldiff += diffB;
}

function pickBest(ta, tb) {
    let best = [ta, tb].sort((a, b) => b.score - a.score || b.goaldiff - a.goaldiff || b.points - a.points)[0];
    return best;
}

function makeSixteenMatches() {
    let groupA = teams.filter(t => t.group === "a").sort((a, b) => b.score - a.score || b.goaldiff - a.goaldiff || b.points - a.points);
    let groupB = teams.filter(t => t.group === "b").sort((a, b) => b.score - a.score || b.goaldiff - a.goaldiff || b.points - a.points);
    let groupC = teams.filter(t => t.group === "c").sort((a, b) => b.score - a.score || b.goaldiff - a.goaldiff || b.points - a.points);
    let groupD = teams.filter(t => t.group === "d").sort((a, b) => b.score - a.score || b.goaldiff - a.goaldiff || b.points - a.points);
    let groupE = teams.filter(t => t.group === "e").sort((a, b) => b.score - a.score || b.goaldiff - a.goaldiff || b.points - a.points);
    let groupF = teams.filter(t => t.group === "f").sort((a, b) => b.score - a.score || b.goaldiff - a.goaldiff || b.points - a.points);
    let groupG = teams.filter(t => t.group === "g").sort((a, b) => b.score - a.score || b.goaldiff - a.goaldiff || b.points - a.points);
    let groupH = teams.filter(t => t.group === "h").sort((a, b) => b.score - a.score || b.goaldiff - a.goaldiff || b.points - a.points);
    
    sixteenMatches = {
        49 : [groupA[0], groupB[1]],
        50 : [groupC[0], groupD[1]],
        51 : [groupB[0], groupA[1]],
        52 : [groupD[0], groupC[1]],
        53 : [groupE[0], groupF[1]],
        54 : [groupG[0], groupH[1]],
        55 : [groupF[0], groupE[1]],
        56 : [groupH[0], groupG[1]]
    };

    let i = 0;
    $("#groupranking").html("");
    for (let group of [groupA, groupB, groupC, groupD, groupE, groupF, groupG, groupH]) {
        let groupName = ["Group A", "Group B", "Group C", "Group D", "Group E", "Group F", "Group G", "Group H"][i];
        let table = "<table>";
        let j = 1;
        for (let team of group) {
            table += "<tr><th>" + j + ".</th><td>" + team.country + "</td><td>" + team.score + "p</td></tr>";
            j++;
        }
        table += "</table>";
        $("#groupranking").append("<b><label>" + groupName + "</label></b><br>" + table + "<br>");
        i++;
    }
}

function makeQuarterMatches() {
    quarterMatches = {
        57 : [quarterTeams[0], quarterTeams[1]],
        58 : [quarterTeams[4], quarterTeams[5]],
        59 : [quarterTeams[2], quarterTeams[3]],
        60 : [quarterTeams[6], quarterTeams[7]]
    };
}

function makeSemiMatches() {
    semiMatches = {
        61 : [semiTeams[0], semiTeams[1]],
        62 : [semiTeams[2], semiTeams[3]]
    };
}

function makeFinalMatch() {
    finalMatch = {
        64 : [finalTeams[0], finalTeams[1]]
    };
}

function updateGoals() {
    let inputs = [];
    teams = [
        {country : brazil, ranking : 1, points : 1841, group : "g", score : 0, goaldiff : 0},
        {country : belgium, ranking : 2, points : 1816, group : "f", score : 0, goaldiff : 0},
        {country : argentina, ranking : 3, points : 1773, group : "c", score : 0, goaldiff : 0},
        {country : france, ranking : 4, points : 1759, group : "d", score : 0, goaldiff : 0},
        {country : england, ranking : 5, points : 1728, group : "b", score : 0, goaldiff : 0},
        {country : spain, ranking : 7, points : 1715, group : "e", score : 0, goaldiff : 0},
        {country : netherlands, ranking : 8, points : 1694, group : "a", score : 0, goaldiff : 0},
        {country : portugal, ranking : 9, points : 1676, group : "h", score : 0, goaldiff : 0},
        {country : denmark, ranking : 10, points : 1666, group : "d", score : 0, goaldiff : 0},
        {country : germany, ranking : 11, points : 1650, group : "e", score : 0, goaldiff : 0},
        {country : croatia, ranking : 12, points : 1645, group : "f", score : 0, goaldiff : 0},
        {country : mexico, ranking : 13, points : 1644, group : "c", score : 0, goaldiff : 0},
        {country : uruguay, ranking : 14, points : 1638, group : "h", score : 0, goaldiff : 0},
        {country : switzerland, ranking : 15, points : 1635, group : "g", score : 0, goaldiff : 0},
        {country : usa, ranking : 16, points : 1627, group : "b", score : 0, goaldiff : 0},
        {country : senegal, ranking : 18, points : 1584, group : "a", score : 0, goaldiff : 0},
        {country : wales, ranking : 19, points : 1569, group : "b", score : 0, goaldiff : 0},
        {country : iran, ranking : 20, points : 1564, group : "b", score : 0, goaldiff : 0},
        {country : serbia, ranking : 21, points : 1563, group : "g", score : 0, goaldiff : 0},
        {country : morocco, ranking : 22, points : 1563, group : "f", score : 0, goaldiff : 0},
        {country : japan, ranking : 24, points : 1559, group : "e", score : 0, goaldiff : 0},
        {country : poland, ranking : 26, points : 1548, group : "c", score : 0, goaldiff : 0},
        {country : korea, ranking : 28, points : 1530, group : "h", score : 0, goaldiff : 0},
        {country : tunisia, ranking : 30, points : 1507, group : "d", score : 0, goaldiff : 0},
        {country : costarica, ranking : 31, points : 1503, group : "e", score : 0, goaldiff : 0},
        {country : australia, ranking : 38, points : 1488, group : "d", score : 0, goaldiff : 0},
        {country : canada, ranking : 41, points : 1475, group : "f", score : 0, goaldiff : 0},
        {country : cameroon, ranking : 43, points : 1471, group : "g", score : 0, goaldiff : 0},
        {country : ecuador, ranking : 44, points : 1464, group : "a", score : 0, goaldiff : 0},
        {country : qatar, ranking : 50, points : 1439, group : "a", score : 0, goaldiff : 0},
        {country : saudiarabia, ranking : 51, points : 1437, group : "c", score : 0, goaldiff : 0},
        {country : ghana, ranking : 61, points : 1393, group : "h", score : 0, goaldiff : 0}
    ];

    for (let i of $("#groupplay input")) {
        inputs.push($(i).val());
    }
    
    if (inputs.filter(i => i !== "" && i !== "-").length === 96) {
        $("#btnCopy").prop("disabled", false);

        let goalsA = [];
        let goalsB = [];
        for (let k = 0; k < inputs.length; k += 3) {
            goalsA.push(inputs[k]);
            goalsB.push(inputs[k + 2]);
        }
        
        // group play
        let j = 0;
        for (let m of Object.values(groupMatches)) {
            match(m[0], m[1], goalsA[j], goalsB[j]);
            j++;
        }

        calculateMatches();
    }
    else {
        $("#btnCopy").prop("disabled", true);
    }
}

function calculateMatches() {
    sixteenTeams = [];
    quarterTeams = [];
    semiTeams = [];
    finalTeams = [];
    sixteenMatches = {};
    quarterMatches = {};
    semiMatches = {};
    finalMatch = {};
    
    makeSixteenMatches();
    // sixteen play
    $("#quarterfinalists").html("");
    for (let m of Object.values(sixteenMatches)) {
        quarterTeams.push(pickBest(m[0], m[1]));
        $("#quarterfinalists").append("<tr><td>" + pickBest(m[0], m[1]).country + "</td></tr>");
    }

    makeQuarterMatches();
    // quarter play
    $("#semifinalists").html("");
    for (let m of Object.values(quarterMatches)) {
        semiTeams.push(pickBest(m[0], m[1]));
        $("#semifinalists").append("<tr><td>" + pickBest(m[0], m[1]).country + "</td></tr>");
    }

    makeSemiMatches();
    // semi play
    for (let m of Object.values(semiMatches)) {
        finalTeams.push(pickBest(m[0], m[1]));
    }

    makeFinalMatch();
    // final play
    let m = Object.values(finalMatch)[0];
    winner = pickBest(m[0], m[1]);
    runnerup = finalTeams.filter(t => t.country !== winner.country)[0];
    $("#winner").val(winner.country);
    $("#runnerup").val(runnerup.country);
}

function copy() {
    let toCopy = [];
    for (let tr of $("td.result").parent()) {
        let row = [];
        for (let i = 0; i < $(tr).children().length; i++) {
            if (i > 1) {
                let t = $(tr).children()[i].children[0];
                row.push($(t).val());
            }
        }
        toCopy.push(row.join("	"));
    }

    navigator.clipboard.writeText(toCopy.join("\n"));
}

function initTables() {
    for (let m of Object.values(groupMatches)) {
        $("#groupplay").append("<tr><td>" + m[0] + "</td><td>" + m[1] + "</td><td class='result'><input type='number' value='0'placeholder='H' oninput='updateGoals()'></td><td class='result'><input style='outline: none; border: none; text-align: center;' type='text' value='-' readonly></td><td class='result'><input type='number' placeholder='B' value='0' oninput='updateGoals()'></td></tr>");
    }
    $("#groupplay").parent().append("<br><div style='width: 100%; text-align: right;'><button id='btnCopy' onclick='copy()' disabled>Copy</button></div>");
}