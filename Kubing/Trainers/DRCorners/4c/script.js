let subset = ["", ""];
let prevSubset = "";
const subsets = {
    "1qt" : "1q|1q|odd",
    "2qt a" : "2q|2q|even",
    "2qt b" : "1q|1q|even",
    "3qt" : "1q|2q|odd",
    "4qt" : "1q|2q|even",
    "5qt" : "2q|2q|odd",
};

$(() => {
    nextSubset();
});

function nextSubset() {
    while (subset[0] === prevSubset) {
        let i = Math.floor(Math.random() * Object.keys(subsets).length);
        subset = [Object.keys(subsets)[i], Object.values(subsets)[i]];
    }
    prevSubset = subset[0];
    $("#subset").text(subset[1]);
}

function answer(c) {
    if (c !== subset[0]) {
        $("#subset").css("color", "red");
        setTimeout(() => {
            $("#subset").css("color", "#aaaaaa");
        }, 250);
    }
    else {
        $("#subset").css("color", "green");
        setTimeout(() => {
            $("#subset").css("color", "#aaaaaa");
            nextSubset();
        }, 250);
    }
}