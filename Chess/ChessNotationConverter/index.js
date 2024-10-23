window.location = "https://einarkl.no" + location.pathname;
$(() => {
    
});

function convert(nor) {
    let eng = nor.replaceAll("L", "B").replaceAll("S", "N").replaceAll("T", "R").replaceAll("D", "Q");
    $("#taEng").val(eng);
}

function copy() {
    let copyText = document.getElementById("taEng");
    copyText.setSelectionRange(0, copyText.value.length);

    navigator.clipboard.writeText(copyText.value);
    copyText.setSelectionRange(0, 0);
}