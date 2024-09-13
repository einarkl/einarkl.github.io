const kp = "Rw' U Rw' U' Rw2 R' U' Rw' U' R U2 Rw' U' Rw3 U2 Rw' U2 Rw'";
const moves4x4 = ["R", "R2", "R'", "U", "U2", "U'", "F", "F2", "F'", "D", "D2", "D'"];
let kps = {};
let maxN = 1;
let depth = 0;

$(() => {
    
});

function gen() {
    $("#scrambleDiv").html("");
    $("#btnGen").attr("disabled", true);
    let w = new Worker("worker.js");
    w.postMessage("GO!");
    w.onmessage = e => {
        if (typeof e.data === "number") {
            $("#status").text(+parseFloat((e.data / maxN) * 100).toFixed(2) + "%");
        }
        else if (typeof e.data === "string") {
            maxN = parseInt(e.data);
        }
        else {
            kps = e.data;
            getOps(e.data);
        }
    }
}

function getOps(kps) {
    $("#status").text("");
    $("#btnGen").attr("disabled", false);
    let out = "";

    out += "<button onclick=\"downloadFile()\">Download</button>";
    for (let i = 0; i < Object.keys(kps).length; i++) {
        out += "<h1 style=\"text-align: left;\">" + Object.keys(kps)[i] + ":</h1><br><div style=\"display: grid; grid-template-columns: 1fr 1fr;\"><svg id=\"svgScramble" + i + "\"></svg><div id=\"scramble" + i + "\" style=\"height: 25vh; overflow-y: scroll;\"></div></div><br><br>";
    }

    $("#scrambleDiv").html(out);

    for (let i = 0; i < Object.keys(kps).length; i++) {
        let alg = Object.values(kps)[i][0];
        for (let j = 1; j <= Object.values(kps)[i].length; j++) {
            let ks = Object.values(kps)[i][j - 1].replace(kp, "[KP]");
            if (ks.split(" ")[0].split("")[0] === "U") {
                ks = ["(" + ks.split(" ")[0] + ")", ks.split(" ").slice(1).join(" ")].join(" ");
            }
            $("#scramble" + i).append("<h2>" + j + ". " + ks + "</h2>");
        }
        drawScrambleNxN("#svgScramble" + i, 4, inverseAlg(alg), ["white", "gray", "gray", "gray", "gray", "gray"]);
    }
    
    if (Object.keys(kps).length === 0) {
        $("#scrambleDiv").append("No algs found");
    }
}

function downloadFile() {
    const link = document.createElement("a");
    const content = JSON.stringify(kps).replaceAll(kp, "[KP]").replaceAll(":[\"U ", ":[\"(U) ").replaceAll(":[\"U'", ":[\"(U')").replaceAll(":[\"U2", ":[\"(U2)");
    const file = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = "kpAlgs_" + depth + ".txt";
    link.click();
    URL.revokeObjectURL(link.href);
};