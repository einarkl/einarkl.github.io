window.location = "https://einarkl.no" + location.pathname;
$(() => {
    
});

function displayAlgs() {
    let flags = $("#taFlags").val();
    const n = parseInt($("#inpNxN").val()) || 3;
    const algs = $("#taAlgs").val().split("\n")
    .map(a =>
        a.replaceAll("(", "").replaceAll(")", "").replaceAll(",", "")
    )
    .map(a =>
        a.includes(".") ? a.split(".")[a.split(".").length - 1].trim() : a.trim()
    )
    .filter(a =>
        a !== ""
    );
    const indexes = $("#taAlgs").val().split("\n")
    .map((a, i) =>
        a.includes(".") ? a.split(".")[0].trim() : (i + 1)
    );
    
    let out = "";

    if (algs.length === 0) {
        algs.push("");
    }

    for (let i = 0; i < algs.length; i++) {
        out += "<tr class='trs' style='border: 1px solid #aaa'><th style='padding: 2.5vh;'><span>" + indexes[i] + "</span></th><td style='padding: 1vh;'><svg id='tblAlg" + i + "'></svg></td><td style='padding: 2.5vh;'><span>" + algs[i] + "</span></td></tr>";
    }

    $("#tblDisplay").html(out);

    for (let i = 0; i < algs.length; i++) {
        drawScrambleNxN_new("#tblAlg" + i, n, inverseAlg(algs[i]), flags);
    }

    if (algs.length > 0) {
        $("#btnDownloadPDF").prop("disabled", false);
    }
    else {
        $("#btnDownloadPDF").prop("disabled", true);
    }
}

function printToPDF() {
    $("#tblDisplay").css("color", "#000");
    $("span").css("font-size", "2vh");
    $(".trs").css("border", "1px solid #000")
    const table = document.getElementById("tblDisplay");
    const wme = window.open("", "", "width:210mm, height: 297mm");
    wme.document.write(table.outerHTML);
    wme.document.close();
    wme.focus();
    wme.print();
    // wme.close();
    $("#tblDisplay").css("color", "#aaa");
    $("span").css("font-size", "5vh");
    $(".trs").css("border", "1px solid #aaa")
}