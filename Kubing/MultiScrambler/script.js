function scrambleN() {
    let n = parseInt($("#inpN").val()) || 5;
    let sets = parseInt($("#inpSets").val()) || 1;
    let prefix = $("#selPrefix").find(":selected").val() !== "none" ? $("#selPrefix").find(":selected").val() + " " : "";
    let linesBetweenSets = parseInt($("#inpLines").val()) || 3;
    let lines = "";
    for (let i = 0; i < linesBetweenSets; i++) {
        lines += "\n";
    }
    let scr = "";
    for (let j = 0; j < sets; j++) {
        for (let i = 0; i < n; i++) {
            let pre = "";
            if (prefix !== "") {
                pre = (i + 1) + prefix;
            }
            scr += pre + getScramble() + "\n";
        }

        if (j !== (sets - 1)) {
            scr += lines;
        }
    }
    $("#scrambles").html(scr);
}

function copyScrambles() {
    let copyText = document.getElementById("scrambles");
    copyText.setSelectionRange(0, copyText.value.length);

    navigator.clipboard.writeText(copyText.value);
    copyText.setSelectionRange(0, 0);
}

function getScramble() {
    switch ($("#selEvent").find(":selected").val()) {
        case "333":
            scramble = getScrambleNxN(3);
            break;
        case "222":
            scramble = getScrambleNxN(2);
            break;
        case "444":
            scramble = getScrambleNxN(4);
            break;
        case "555":
            scramble = getScrambleNxN(5);
            break;
        case "666":
            scramble = getScrambleNxN(6);
            break;
        case "777":
            scramble = getScrambleNxN(7);
            break;
        case "clock":
            scramble = getScrambleClock();
            break;
        case "minx":
            scramble = getScrambleMega(true);
            break;
        case "pyram":
            scramble = getScramblePyra();
            break;
        case "skewb":
            scramble = getScrambleSkewb();
            break;
        case "sq1":
            scramble = getScrambleSq1();
            break;
        default:
            scramble = getScrambleNxN(3);
            break;
    }

    return scramble;
}