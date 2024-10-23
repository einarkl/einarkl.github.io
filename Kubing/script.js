window.location = "https://einarkl.no" + location.pathname;
let tabContents = [];
let currentTab = 0;

$(function() {
    tabContents = $(".tabContent");

    adjustImg();
    makeUnderline();
    showHome();
        
    $(window).resize(function(){
        updateUnderline(currentTab);
    });
});


function hideAll() {
    for (let c of tabContents) {
        $(c).css("display", "none");
    }
}

function showHome() {
    currentTab = 0;
    hideAll();
    $("#tabHome").css("display", "block");
    $("#underline").css("margin-left", $(window).width() / 6);
    $("#underline").css("transition", "margin-left 0.1s linear");
    $("#underline").css("-webkit-transition", "margin-left 0.1s linear");
}

function showProjects() {
    currentTab = 1;
    hideAll();
    $("#tabProjects").css("display", "block");
    $("#underline").css("margin-left", ($(window).width() / 6) * 4);
    $("#underline").css("transition", "margin-left 0.1s linear");
    $("#underline").css("-webkit-transition", "margin-left 0.1s linear");
}

function makeUnderline() {
    $("#underline").css("height", "5px");
    $("#underline").css("width", $(window).width() / 6);
    $("#underline").css("margin-left", $(window).width() / 6);
}

function adjustImg() {
    const size = $("h1").css("font-size");

    $(".tabAppsImg").css("height", size);
    $(".tabAppsImg").css("width", "auto");
    $(".tabAppsImg").css("margin-right", "0.25%");
}

function updateUnderline(tab) {
    $("#underline").css("width", $(window).width() / 6);
    
    if (tab === 0) {
        $("#underline").css("margin-left", $(window).width() / 6);
    }
    else if (tab === 1) {
        $("#underline").css("margin-left", ($(window).width() / 6) * 4);
    }
}