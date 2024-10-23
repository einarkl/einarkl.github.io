window.location = "https://einarkl.no" + location.pathname;
let currentMove = "";
let prevMove = "";
let fromTo = [];
let moveTime = 200;
let loadedPGN = {};
let currentPGNMove = 0;
let playingPGN = false;
let lastPGNMove = [];
let pgnMoves = 0;
let tiles = [];
let moves = {};
let legalMoves = [];
let allLegalMoves = {};
let checks = [];
let checks2 = {
    w: [],
    b: []
};
let mouseDown = 0;
let curCol = "Light";
let curPos = null;
let curPiece = null;
let locked = false;
let promReady = false;
let jadoubeLock = true;
let dragging = false;
let columns = ["a", "b", "c", "d", "e", "f", "g", "h"];
let rows = [8, 7, 6, 5, 4, 3, 2, 1];
let flipped = false;
let check = false;
let castling = {
    "K" : true,
    "Q" : true,
    "k" : true,
    "q" : true
};
let enPassant = "-";
let halfMoves = 0;
let fullMoves = 0;

let buttons = ["Control", "Shift", "Alt"];
let curBtn = null;

let arrowDown = null;
let arrowUp = null;

let lastTouch = null;

let fenPositions = {
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -" : 1
};

let sfx = {
    start: null,
    move: null,
    capture: null,
    castling: null,
    check: null,
    gameOver: null,
    stalemate: null,
    checkmate: null,
    jadoube: null
};

const circLight ="#D8C3A3";
const circDark ="#A37A59";

const cellColor = "#494949";

$(() => {
    $(window).on("keydown", e => {
        if (buttons.includes(e.key)) {
            curBtn = e.key;
        }
    });
    $(window).on("keyup", e => {
        if (buttons.includes(e.key)) {
            curBtn = null;
        }
    });
    init();
});

$(window).resize(() => {
    adjustSize();
});

function init() {
    currentMove = "";
    prevMove = "";
    fromTo = [];
    moveTime = 200;
    loadedPGN = {};
    currentPGNMove = 0;
    playingPGN = false;
    lastPGNMove = [];
    pgnMoves = 0;
    tiles = [];
    moves = {};
    legalMoves = [];
    allLegalMoves = {};
    checks = [];
    checks2 = {
        w: [],
        b: []
    };
    mouseDown = 0;
    curCol = "Light";
    curPos = null;
    curPiece = null;
    locked = false;
    promReady = false;
    jadoubeLock = true;
    dragging = false;
    columns = ["a", "b", "c", "d", "e", "f", "g", "h"];
    rows = [8, 7, 6, 5, 4, 3, 2, 1];
    flipped = false;
    check = false;
    castling = {
        "K" : true,
        "Q" : true,
        "k" : true,
        "q" : true
    };
    enPassant = "-";
    halfMoves = 0;
    fullMoves = 0;
    buttons = ["Control", "Shift", "Alt"];
    curBtn = null;
    arrowDown = null;
    arrowUp = null;
    lastTouch = null;
    fenPositions = {
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -" : 1
    };
    loadSFX();
    adjustSize();
    createSquares();
    createLetters();
    placePieces();

    curCol = "Light";

    $("#board").on('contextmenu', e => {
        e.preventDefault();
    });
    $(document).on("mouseup", () => {
        mouseDown = 0;
    });
    
    updateSavedPGNsList();
}

function loadSFX() {
    for (let s of Object.keys(sfx)) {
        let audio = new Audio();
        audio.src = "../sfx/" + s + ".mp3";
        audio.preload = "auto";
        sfx[s] = audio;
    }
}

function createSquares() {
    let size = $("#board").width() / 8;
    $("#dots").attr("width", $("#board").width());
    $("#dots").attr("height", $("#board").height());
    for (let y = 0; y < 8; y++) {
        let row = "<tr>";
        for (let x = 0; x < 8; x++) {
            let col = (y + x) % 2 === 0 ? "#F0D9B5" : "#B58863";
            let dataCol = (y + x) % 2 === 0 ? "Light" : "Dark";
            let id = columns[x] + rows[y];
            let brdRad = 0;

            if (y === 0 && x === 0) {
                brdRad = "5% 0 0 0";
            }
            else if (y === 0 && x === 7) {
                brdRad = "0 5% 0 0";
            }
            else if (y === 7 && x === 0) {
                brdRad = "0 0 0 5%";
            }
            else if (y === 7 && x === 7) {
                brdRad = "0 0 5% 0";
            }

            let style = "background-color: " + col + "; width: " + size + "px; height: " + size + "px; text-align: center; border-radius: " + brdRad;

            let tile = "<td><div id='" + id + "' class='tiles' data-color='" + dataCol + "' style='" + style + "' onclick='clickTile(\"" + id + "\")'></div></td>";
            row += tile;
        }
        row += "</tr>";
        $("#board").append(row);
    }
    for (let t of $(".tiles")) {
        tiles.push(t);
    }
}

function clearBoard() {
    for (t of tiles) {
        $("#" + t.id).html("");
    }
}

function createLetters(flipped = false) {
    $("#lettersNumbers").html("");
    let tileSize = $("#board").width() / 8;
    let ro = flipped ? rows.reverse() : rows;
    for (let r of ro) {
        let col = ro.indexOf(r) % 2 === 0 ? "#B58863" : "#F0D9B5";
        let l = document.createElementNS("http://www.w3.org/2000/svg", "text");
        $(l).attr("x", tileSize * 0.05);
        $(l).attr("y", tileSize * (parseInt(ro.indexOf(r)) + 0.25));
        $(l).attr("font-size", tileSize * 0.25);
        $(l).attr("font-family", "arial");
        $(l).attr("fill", col);
        $(l).text(r);

        $("#lettersNumbers").append(l);
    }
    let co = flipped ? columns.reverse() : columns;
    for (let c of co) {
        let col = co.indexOf(c) % 2 === 0 ? "#F0D9B5" : "#B58863";
        let l = document.createElementNS("http://www.w3.org/2000/svg", "text");
        $(l).attr("x", tileSize * (parseInt(co.indexOf(c)) + 0.8));
        $(l).attr("y", 8 * (tileSize - 0.6));
        $(l).attr("font-size", tileSize * 0.25);
        $(l).attr("font-family", "arial");
        $(l).attr("fill", col);
        $(l).text(c);

        $("#lettersNumbers").append(l);
    }
}

function flipTable() {
    /* createLetters(!flipped);
    let fen = flipped ? "RNBKQBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbkqbnr w KQkq - 0 1" : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    placePieces(fen); */
    flipped = !flipped;

    if (flipped) {
        $("#board").addClass("flipped");
        $("#dots").addClass("flipped");
        $("#arrowLayer").addClass("flipped");
        $("#squareLayer").addClass("flipped");
        $("#promotionLayer").addClass("flipped");

        for (let p of $(".pieces")) {
            $(p).addClass("flipped");
        }
    }
    else {
        $("#board").removeClass("flipped");
        $("#dots").removeClass("flipped");
        $("#arrowLayer").removeClass("flipped");
        $("#squareLayer").removeClass("flipped");
        $("#promotionLayer").removeClass("flipped");

        for (let p of $(".pieces")) {
            $(p).removeClass("flipped");
        }
    }
    
    createLetters(flipped);
    drawMoves();
}

function loadFEN(fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
    
}

function exportFEN() {
    let raw = tiles.map(t => $(t).children().length === 0 ? 1 : ($(t).children()[0].dataset.color === "Light" ? $(t).children()[0].dataset.piece : $(t).children()[0].dataset.piece.toLowerCase()));
    let rows = [];
    let nRows = [];
    for (let i = 0; i < 8; i++) {
        rows.push(raw.slice(i * 8, i * 8 + 8));
    }
    for (let r of rows) {
        let nr = [];
        let sum = 0;
        for (let i = 0; i < r.length; i++) {
            if (r[i] !== 1) {
                nr.push(sum);
                sum = 0;
                nr.push(r[i]);
            }
            else {
                sum++;
            }

            if (i === r.length - 1) {
                nr.push(sum);
                sum = 0;
            }
        }
        nRows.push(nr.filter(c => c !== 0).join(""));
    }

    let fenPieces = nRows.join("/");
    let fenTurn = curCol === "Light" ? "w" : "b";
    let fenCastling = Object.keys(castling).filter(k => Object.values(castling)[Object.keys(castling).indexOf(k)] === true);
    fenCastling = fenCastling.length === 0 ? "-" : fenCastling.join("");
    let fenEnPassant = enPassant;
    let fenHalfMoves = halfMoves;
    let fenFullMoves = fullMoves;

    return [fenPieces, fenTurn, fenCastling, fenEnPassant, fenHalfMoves, fenFullMoves].join(" ");
}

function placePieces(fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
    clearBoard();
    let style = "position: relative; width: 100%; height: 100%;";
    for (let y = 0; y < 8; y++) {
        let pieces = fen.split(" ")[0].split("/")[y];
        curCol = fen.split(" ")[1] ? (fen.split(" ")[1] === "w" ? "Light" : "Dark") : "Light";
        if (fen.split(" ")[2]) {
            for (let c of Object.keys(castling)) {
                castling[c] = false;
            }
            for (let c of fen.split(" ")[2].split("")) {
                castling[c] = true;
            }
        }
        enPassant = fen.split(" ")[3] ? fen.split(" ")[3] : "-";
        halfMoves = fen.split(" ")[4] ? parseInt(fen.split(" ")[4]) : 0;
        fullMoves = fen.split(" ")[5] ? parseInt(fen.split(" ")[5]) : 0;
        let x = 0;
        dataCol = "";
        for (let p of pieces.split("")) {
            let svg = "";
            let piece = "";
            if (!isNaN(parseInt(p))) {
                x += parseInt(p);
            }
            else {
                switch (p) {
                    case "r":
                        svg = "Rb";
                        piece = "R";
                        dataCol = "Dark";
                        break;
                    case "n":
                        svg = "Nb";
                        piece = "N";
                        dataCol = "Dark";
                        break;
                    case "b":
                        svg = "Bb";
                        piece = "B";
                        dataCol = "Dark";
                        break;
                    case "q":
                        svg = "Qb";
                        piece = "Q";
                        dataCol = "Dark";
                        break;
                    case "k":
                        svg = "Kb";
                        piece = "K";
                        dataCol = "Dark";
                        break;
                    case "p":
                        svg = "Pb";
                        piece = "P";
                        dataCol = "Dark";
                        break;
                    case "R":
                        svg = "Rw";
                        piece = "R";
                        dataCol = "Light";
                        break;
                    case "N":
                        svg = "Nw";
                        piece = "N";
                        dataCol = "Light";
                        break;
                    case "B":
                        svg = "Bw";
                        piece = "B";
                        dataCol = "Light";
                        break;
                    case "Q":
                        svg = "Qw";
                        piece = "Q";
                        dataCol = "Light";
                        break;
                    case "K":
                        svg = "Kw";
                        piece = "K";
                        dataCol = "Light";
                        break;
                    case "P":
                        svg = "Pw";
                        piece = "P";
                        dataCol = "Light";
                        break;
                }

                let id = columns[x] + rows[y];

                if (x < 8) {
                    $("#" + id).append("<img id='" + piece + "_" + id + "' class='pieces' src='../Pieces/" + svg + ".svg' data-piece='" + piece + "' data-color='" + dataCol + "' data-position='" + id + "' style='" + style + "' draggable='false'></img>");
                }
                x++;
            }
        }
    }

    $(".tiles").on("mousedown", e => {
        onMouseDown(e);
    });
    /* $(document).on("mousemove", e => {
        if (dragging) {
            $(".dragging").removeClass("dragging");
            let targets = document.elementsFromPoint(e.clientX, e.clientY);
            let tarI = -1;
            for (let i = 0; i < targets.length; i++) {
                if (targets[i].className.includes("tiles")) {
                    tarI = i;
                }
            }
            let tarTile = targets[tarI];
            preTileHover = tarTile;
            $(tarTile).addClass("dragging");
            $(".dragging").css("cursor", "grabbing");
        }
    }); */
    $(document).on("mousemove", e => {
        if (dragging) {
            if (!flipped) {
                $(".dragging").removeClass("dragging");
                let targets = document.elementsFromPoint(e.clientX, e.clientY);
                let tarI = -1;
                for (let i = 0; i < targets.length; i++) {
                    if (targets[i].className.includes("tiles")) {
                        tarI = i;
                    }
                }
                let tarTile = targets[tarI];
                preTileHover = tarTile;
                $(tarTile).addClass("dragging");
                $(".dragging").css("cursor", "grabbing");
            }
            else {
                let boardOffset = $("#board").offset(); // Get board's position
                let size = $("#board").width() / 8;
                let offsetX, offsetY;
        
                if (flipped) {
                    offsetX = (boardOffset.left + $("#board").width()) - e.pageX - size/2;
                    offsetY = (boardOffset.top + $("#board").height()) - e.pageY - size/2;
                } else {
                    offsetX = e.pageX - boardOffset.left - size/2;
                    offsetY = e.pageY - boardOffset.top - size/2;
                }
        
                $(curPiece).css({
                    position: 'absolute',
                    left: offsetX + 'px',
                    top: offsetY + 'px',
                    width: size + 'px',
                    height: size + 'px',
                    transform: flipped ? 'rotate(180deg)' : ''
                });
            }
        }
    });
    $(document).on("mouseup", e => {
        dragging = false;
        $(".dragging").removeClass("dragging");
        $(".tiles").css("cursor", "");
    });
    /////////////////////////////////////////7
    $(".tiles").on("touchstart", e => {
        onTouchStart(e);
    });
    $(document).on("toucmove", e => {
        if (dragging) {
            $(".dragging").removeClass("dragging");
            let touch = e.targetTouches[0];
            let targets = document.elementsFromPoint(touch.pageX, touch.pageY);
            lastTouch = {x: touch.pageX, y: touch.pageY};
            let tarI = -1;
            for (let i = 0; i < targets.length; i++) {
                if (targets[i].className.includes("tiles")) {
                    tarI = i;
                }
            }
            let tarTile = targets[tarI];
            preTileHover = tarTile;
            $(tarTile).addClass("dragging");
            $(".dragging").css("cursor", "grabbing");
        }
    });
    $(document).on("touchend", e => {
        dragging = false;
        $(".dragging").removeClass("dragging");
        $(".tiles").css("cursor", "");
    });
}

function onMouseDown(e) {
    locked = false;
    jadoubeLock = true;

    $(".selectedPieceTile").removeClass("selectedPieceTile");

    if (e.which === 1) {
        // Left

        $("#squareLayer, #arrowLayer").html("");

        let targetsDown = document.elementsFromPoint(e.clientX, e.clientY);
        let tarDownI = -1;
        for (let i = 0; i < targetsDown.length; i++) {
            if (targetsDown[i].className.includes("tiles")) {
                tarDownI = i;
            }
        }
        let tarDownTile = targetsDown[tarDownI].id;
        if (curPiece !== null && legalMoves.includes(tarDownTile)) {
            let newPos = tarDownTile;
            
            if (curPiece.dataset.piece === "P" && (newPos.split("")[1] === "1" || newPos.split("")[1] === "8") && legalMoves.includes(newPos)) {
                promote(curPiece, curPiece.dataset.position, newPos);
            }
            else {
                movePiece(curPiece, curPiece.dataset.position, newPos, false);
            }
        }
        else {
            mouseDown = 1;
            curPiece = e.target;
            if (curPiece && curCol === curPiece.dataset.color && curPiece.className.includes("pieces")) {
                dragging = true;
                $("#" + tarDownTile).addClass("selectedPieceTile");

                curPos = e.target.dataset.position;
                getLegalMoves();
        
                $(curPiece).on("mousemove", e => {
                    let targets = document.elementsFromPoint(e.clientX, e.clientY);
                    let tarI = -1;
                    for (let i = 0; i < targets.length; i++) {
                        if (targets[i].className.includes("tiles")) {
                            tarI = i;
                        }
                    }
                    let tarTile = targets[tarI].id;
                    
                    if (curPiece && tarTile !== curPiece.dataset.position) {
                        jadoubeLock = false;
                    }
                    $("img").css("z-index", "1");
                    $(curPiece).css("z-index", "2");
        
                    let size = $("#board").width() / 8;
                    if (mouseDown === 1) {
                        $(curPiece).css("position", "absolute");
                        $(curPiece).css("width", size);
                        $(curPiece).css("height", size);
                        $(curPiece).css({
                            left: e.pageX - (size / 2),
                            top: e.pageY - (size / 2)
                        });
                    }
                });
        
                $(document).on("mouseup", e => {
                    if (!locked && curPiece) {
                        locked = true;
                        mouseDown = 0;
                        let targetsUp = document.elementsFromPoint(e.clientX, e.clientY);
                        let tarUpI = -1;
                        for (let i = 0; i < targetsUp.length; i++) {
                            if (targetsUp[i].className.includes("tiles")) {
                                tarUpI = i;
                            }
                        }
                        let tarUpTile = targetsUp[tarUpI].id;
                        if (curPiece !== null && legalMoves.includes(tarUpTile)) {
                            let newPos = tarUpTile;
                            if (curPiece.dataset.piece === "P" && (newPos.split("")[1] === "1" || newPos.split("")[1] === "8") && legalMoves.includes(newPos)) {
                                promote(curPiece, curPos, newPos);
                            }
                            else {
                                movePiece(curPiece, curPos, newPos);
                            }
                        }
                        else {
                            movePiece(curPiece, curPos, curPos);
                        }
        
                        $("img").css("z-index", "1");
                        $(".tiles").unbind();
                        $(".tiles").on("mousedown", e => {
                            onMouseDown(e);
                        });
                        $(".tiles").on("touchstart", e => {
                            onTouchStart(e);
                        });
                    }
                });
            }
            else {
                curPiece = null;
                legalMoves = [];
                drawMoves();
            }
        }
    }
    else if (e.which === 2) {
        // Middle
        mouseDown = 2;

        curPiece = null;
        legalMoves = [];
        drawMoves();
    }
    else if (e.which === 3) {
        // Right

        mouseDown = 3;

        let targetsDown = document.elementsFromPoint(e.clientX, e.clientY);
        let tarDownI = -1;
        for (let i = 0; i < targetsDown.length; i++) {
            if (targetsDown[i].className.includes("tiles")) {
                tarDownI = i;
            }
        }
        arrowDown = targetsDown[tarDownI].id;

        $(document).on("mouseup", e => {
            if (!locked && e.which === 3) {
                locked = true;
                mouseDown = 0;
                let targetsUp = document.elementsFromPoint(e.clientX, e.clientY);
                let tarUpI = -1;
                for (let i = 0; i < targetsUp.length; i++) {
                    if (targetsUp[i].className.includes("tiles")) {
                        tarUpI = i;
                    }
                }
                if (targetsUp[tarUpI]) {
                    arrowUp = targetsUp[tarUpI].id;

                    drawArrow();
                }

                $(".tiles").unbind();
                $(".tiles").on("mousedown", e => {
                    onMouseDown(e);
                });
            }
        });

        curPiece = null;
        legalMoves = [];
        drawMoves();
    }
}

function onTouchStart(e) {
    locked = false;
    jadoubeLock = true;

    $(".selectedPieceTile").removeClass("selectedPieceTile");

    // Left

    $("#squareLayer, #arrowLayer").html("");

    let touchDown = e.targetTouches[0];
    let targetsDown = document.elementsFromPoint(touchDown.pageX, touchDown.pageY);
    lastTouch = {x: touchDown.pageX, y: touchDown.pageY};
    let tarDownI = -1;
    for (let i = 0; i < targetsDown.length; i++) {
        if (targetsDown[i].className.includes("tiles")) {
            tarDownI = i;
        }
    }
    let tarDownTile = targetsDown[tarDownI].id;
    if (curPiece !== null && legalMoves.includes(tarDownTile)) {
        let newPos = tarDownTile;
        
        if (curPiece.dataset.piece === "P" && (newPos.split("")[1] === "1" || newPos.split("")[1] === "8") && legalMoves.includes(newPos)) {
            promote(curPiece, curPiece.dataset.position, newPos);
        }
        else {
            movePiece(curPiece, curPiece.dataset.position, newPos, false);
        }
    }
    else {
        mouseDown = 1;
        curPiece = e.target;

        if (curPiece && curCol === curPiece.dataset.color && curPiece.className.includes("pieces")) {
            dragging = true;
            $("#" + tarDownTile).addClass("selectedPieceTile");

            curPos = e.target.dataset.position;
            getLegalMoves();
    
            $(curPiece).on("touchmove", e => {
                let touch = e.targetTouches[0];
                let targets = document.elementsFromPoint(touch.pageX, touch.pageY);
                lastTouch = {x: touch.pageX, y: touch.pageY};
                let tarI = -1;
                for (let i = 0; i < targets.length; i++) {
                    if (targets[i].className.includes("tiles")) {
                        tarI = i;
                    }
                }
                let tarTile = targets[tarI].id;
                
                if (curPiece && tarTile !== curPiece.dataset.position) {
                    jadoubeLock = false;
                }
                $("img").css("z-index", "1");
                $(curPiece).css("z-index", "2");
    
                let size = $("#board").width() / 8;
                if (mouseDown === 1) {
                    $(curPiece).css("position", "absolute");
                    $(curPiece).css("width", size);
                    $(curPiece).css("height", size);
                    $(curPiece).css({
                        left: touch.pageX - (size / 2),
                        top: touch.pageY - (size / 2)
                    });
                }
            });
            $(document).on("touchend", e => {
                if (!locked && curPiece) {
                    locked = true;
                    mouseDown = 0;
                    let targetsUp = document.elementsFromPoint(lastTouch.x, lastTouch.y);
                    let tarUpI = -1;
                    for (let i = 0; i < targetsUp.length; i++) {
                        if (targetsUp[i].className.includes("tiles")) {
                            tarUpI = i;
                        }
                    }
                    let tarUpTile = targetsUp[tarUpI].id;
                    if (curPiece !== null && legalMoves.includes(tarUpTile)) {
                        let newPos = tarUpTile;
                        if (curPiece.dataset.piece === "P" && (newPos.split("")[1] === "1" || newPos.split("")[1] === "8") && legalMoves.includes(newPos)) {
                            promote(curPiece, curPos, newPos);
                        }
                        else {
                            movePiece(curPiece, curPos, newPos);
                        }
                    }
                    else {
                        movePiece(curPiece, curPos, curPos);
                    }
    
                    $("img").css("z-index", "1");
                    $(".tiles").unbind();
                    $(".tiles").on("mousedown", e => {
                        onMouseDown(e);
                    });
                    $(".tiles").on("touchstart", e => {
                        onTouchStart(e);
                    });
                }
            });
        }
        else {
            curPiece = null;
            legalMoves = [];
            drawMoves();
        }
    }
}

function drawArrow(arrowFrom = arrowDown, arrowTo = arrowUp, aCol = null) {
    let s = $("#board").width() / 8;

    let cs = flipped ? columns.reverse() : columns;
    let rs = flipped ? rows.reverse() : rows;
    if (arrowFrom === arrowTo) {
        drawSquare();
    }
    else {
        let arrowStyles = [
            "rgba(248, 85, 63, 0.8)",//red "ctrl"
            "rgba(159, 207, 63, 0.8)",//green "shift"
            "rgba(72, 193, 249, 0.8)",//blue "alt"
            "rgba(255, 170, 0, 0.8)",//yellow ""
        ];

        let tileFrom = arrowFrom ? arrowFrom : "a1";
        let tileTo = arrowTo ? arrowTo : "a1";

        let id = "arr" + tileFrom + "_" + tileTo;
        let arrowCol = aCol !== null ? aCol : (curBtn === null ? arrowStyles[arrowStyles.length - 1] : arrowStyles[buttons.indexOf(curBtn)]);
        
        if ($("#" + id).length !== 0 && $("#" + id).css("fill") === arrowCol) {
            $("#" + id).remove();
        }
        else if ($("#" + id).length !== 0) {
            $("#" + id).css("fill", arrowCol);
        }
        else {
            let rad = s * 3.5 / 10;
            let widthFromCenter = s / 10;

            let destX = s * (parseInt(cs.indexOf(tileTo.split("")[0])) + 0.5);
            let destY = s * (parseInt(rs.indexOf(parseInt(tileTo.split("")[1]))) + 0.5);
            let srcX = s * (parseInt(cs.indexOf(tileFrom.split("")[0])) + 0.5);
            let srcY = s * (parseInt(rs.indexOf(parseInt(tileFrom.split("")[1]))) + 0.5);
            
            let points = [];

            let cFrom = parseInt(cs.indexOf(tileFrom.split("")[0])); 
            let cTo = parseInt(cs.indexOf(tileTo.split("")[0]));
            let rFrom = parseInt(rs.indexOf(parseInt(tileFrom.split("")[1])));
            let rTo = parseInt(rs.indexOf(parseInt(tileTo.split("")[1])));

            if ((Math.abs(cTo - cFrom) === 1 || Math.abs(cTo - cFrom) === 2) && (Math.abs(rTo - rFrom) === 1 || Math.abs(rTo - rFrom) === 2) && Math.abs(cTo - cFrom) !== Math.abs(rTo - rFrom)) {
                let tempX, tempY;

                if (Math.abs(cTo - cFrom) === 2) {
                    tempX = s * (parseInt(cs.indexOf(tileTo.split("")[0])) + 0.5);
                    tempY = s * (parseInt(rs.indexOf(parseInt(tileFrom.split("")[1]))) + 0.5);
                }
                else {
                    tempX = s * (parseInt(cs.indexOf(tileFrom.split("")[0])) + 0.5);
                    tempY = s * (parseInt(rs.indexOf(parseInt(tileTo.split("")[1]))) + 0.5);
                }

                let dtx = tempX - srcX;
                let dty = tempY - srcY;
                let angleT = Math.atan2(dty, dtx);

                let dx = destX - tempX;
                let dy = destY - tempY;
                let angle = Math.atan2(dy, dx);

                let a = 145 * Math.PI / 180;
                let arrowPnt = {x: destX, y: destY};
                let mvPoint = movePoint(destX, destY, angle + Math.PI / 2, 0.4 * s);
                let arrowWingRight = rotatePoint(mvPoint.x, mvPoint.y, destX, destY, a);
                let arrowWingLeft = rotatePoint(mvPoint.x, mvPoint.y, destX, destY, -a);
                let arrowWingCornerRight = moveTowardsPoint(arrowWingRight.x, arrowWingRight.y, arrowWingLeft.x, arrowWingLeft.y,
                    (getDistance(arrowWingRight.x, arrowWingRight.y, arrowWingLeft.x, arrowWingLeft.y) / 2) - widthFromCenter);
                let arrowWingCornerLeft = moveTowardsPoint(arrowWingLeft.x, arrowWingLeft.y, arrowWingRight.x, arrowWingRight.y,
                    (getDistance(arrowWingRight.x, arrowWingRight.y, arrowWingLeft.x, arrowWingLeft.y) / 2) - widthFromCenter);
                let tmp, tmp2, tempRight, tempLeft;
                if (cTo - cFrom === -1 && rTo - rFrom === -2 || cTo - cFrom === -2 && rTo - rFrom === 1 || cTo - cFrom === 1 && rTo - rFrom === 2 || cTo - cFrom === 2 && rTo - rFrom === -1) {
                    tmp = movePoint(tempX, tempY, - angleT, widthFromCenter);
                    tmp2 = movePoint(tempX, tempY, angleT, widthFromCenter);
                    tempLeft = movePoint(tmp2.x, tmp2.y, getAngle(arrowWingRight.x, arrowWingRight.y, arrowWingLeft.x, arrowWingLeft.y) + Math.PI / 2, widthFromCenter);
                }
                else {
                    tmp = movePoint(tempX, tempY, angleT, widthFromCenter);
                    tmp2 = movePoint(tempX, tempY, -angleT, widthFromCenter);
                    tempLeft = movePoint(tmp.x, tmp.y, getAngle(arrowWingRight.x, arrowWingRight.y, arrowWingLeft.x, arrowWingLeft.y) + Math.PI / 2, widthFromCenter);
                }
                tempRight = rotatePoint(tempLeft.x, tempLeft.y, tempX, tempY, Math.PI);
                let arrowStrt = rotatePoint(srcX + rad, srcY, srcX, srcY, angleT);
                let mvPointStrt = movePoint(arrowStrt.x, arrowStrt.y, angleT, widthFromCenter);
                let arrowStrtRight = rotatePoint(mvPointStrt.x, mvPointStrt.y, arrowStrt.x, arrowStrt.y, Math.PI);
                let arrowStrtLeft = rotatePoint(arrowStrtRight.x, arrowStrtRight.y, arrowStrt.x, arrowStrt.y, Math.PI);

                points = [
                    arrowPnt.x + "," + arrowPnt.y,
                    arrowWingRight.x + "," + arrowWingRight.y,
                    arrowWingCornerRight.x + "," + arrowWingCornerRight.y,
                    tempRight.x + "," + tempRight.y,
                    arrowStrtRight.x + "," + arrowStrtRight.y,
                    arrowStrt.x + "," + arrowStrt.y,
                    arrowStrtLeft.x + "," + arrowStrtLeft.y,
                    tempLeft.x + "," + tempLeft.y,
                    arrowWingCornerLeft.x + "," + arrowWingCornerLeft.y,
                    arrowWingLeft.x + "," + arrowWingLeft.y,
                    arrowPnt.x + "," + arrowPnt.y
                ];
            }
            else {
                let dx = destX - srcX;
                let dy = destY - srcY;
                let angle = Math.atan2(dy, dx);

                let a = 145 * Math.PI / 180;
                let arrowPnt = {x: destX, y: destY};
                let mvPoint = movePoint(destX, destY, angle + Math.PI / 2, 0.4 * s);
                let arrowWingRight = rotatePoint(mvPoint.x, mvPoint.y, destX, destY, a);
                let arrowWingLeft = rotatePoint(mvPoint.x, mvPoint.y, destX, destY, -a);
                let arrowWingCornerRight = moveTowardsPoint(arrowWingRight.x, arrowWingRight.y, arrowWingLeft.x, arrowWingLeft.y,
                    (getDistance(arrowWingRight.x, arrowWingRight.y, arrowWingLeft.x, arrowWingLeft.y) / 2) - widthFromCenter);
                let arrowWingCornerLeft = moveTowardsPoint(arrowWingLeft.x, arrowWingLeft.y, arrowWingRight.x, arrowWingRight.y,
                    (getDistance(arrowWingRight.x, arrowWingRight.y, arrowWingLeft.x, arrowWingLeft.y) / 2) - widthFromCenter);
                let arrowStrt = rotatePoint(srcX + rad, srcY, srcX, srcY, angle);
                let arrowStrtRight = movePoint(arrowWingCornerRight.x, arrowWingCornerRight.y, angle - Math.PI / 2,
                    getDistance((arrowWingRight.x + arrowWingLeft.x) / 2, (arrowWingRight.y + arrowWingLeft.y) / 2, arrowStrt.x, arrowStrt.y));
                let arrowStrtLeft = movePoint(arrowWingCornerLeft.x, arrowWingCornerLeft.y, angle - Math.PI / 2,
                    getDistance((arrowWingRight.x + arrowWingLeft.x) / 2, (arrowWingRight.y + arrowWingLeft.y) / 2, arrowStrt.x, arrowStrt.y));

                points = [
                    arrowPnt.x + "," + arrowPnt.y,
                    arrowWingRight.x + "," + arrowWingRight.y,
                    arrowWingCornerRight.x + "," + arrowWingCornerRight.y,
                    arrowStrtRight.x + "," + arrowStrtRight.y,
                    arrowStrt.x + "," + arrowStrt.y,
                    arrowStrtLeft.x + "," + arrowStrtLeft.y,
                    arrowWingCornerLeft.x + "," + arrowWingCornerLeft.y,
                    arrowWingLeft.x + "," + arrowWingLeft.y,
                    arrowPnt.x + "," + arrowPnt.y
                ];
            }

            let poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            $(poly).attr("id", id);
            $(poly).attr("points", points.join(" "));
            $(poly).attr("style", "fill: " + arrowCol);

            $("#arrowLayer").append(poly);
        }
    }
}

function drawSquare() {
    let s = $("#board").width() / 8;
    let squareStyles = [
        "rgba(255, 170, 0, 0.8)",//yellow "ctrl"
        "rgba(159, 207, 63, 0.8)",//green "shift"
        "rgba(72, 193, 249, 0.8)",//blue "alt"
        "rgba(248, 85, 63, 0.8)",//red ""
    ];

    let tile = arrowUp;
    let id = "sq" + arrowUp;
    let squareCol = (curBtn === null ? squareStyles[squareStyles.length - 1] : squareStyles[buttons.indexOf(curBtn)]);
    
    if ($("#" + id).length !== 0 && $("#" + id).css("fill") === squareCol) {
        $("#" + id).remove();
    }
    else if ($("#" + id).length !== 0) {
        $("#" + id).css("fill", squareCol);
    }
    else {
        let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        $(rect).attr("x", s * (parseInt(columns.indexOf(tile.split("")[0]))));
        $(rect).attr("y", s * (parseInt(rows.indexOf(parseInt(tile.split("")[1])))));
        $(rect).attr("width", s);
        $(rect).attr("height", s);
        $(rect).attr("id", id);
        $(rect).attr("style", "fill: " + squareCol);

        $("#squareLayer").append(rect);
    }
}

function rotatePoint(pointToRotateX, pointToRotateY, centerOfRotationX, centerOfRotationY, angle, radians = true) {
    let x1;
    let y1;
    if (radians) {
        x1 = (pointToRotateX - centerOfRotationX) * Math.cos(angle) - (pointToRotateY - centerOfRotationY) * Math.sin(angle) + centerOfRotationX;
        y1 = (pointToRotateX - centerOfRotationX) * Math.sin(angle) + (pointToRotateY - centerOfRotationY) * Math.cos(angle) + centerOfRotationY;
    }
    else {
        angle = (angle * Math.PI/180);
        x1 = (pointToRotateX - centerOfRotationX) * Math.cos(angle) - (pointToRotateY - centerOfRotationY) * Math.sin(angle) + centerOfRotationX;
        y1 = (pointToRotateX - centerOfRotationX) * Math.sin(angle) + (pointToRotateY - centerOfRotationY) * Math.cos(angle) + centerOfRotationY;
    }
    return {x: x1, y: y1};
}

function movePoint(px, py, angle, dist) {
    let x = px;
    let y = py;
  
    x += dist * Math.sin(angle);
    y -= dist * Math.cos(angle);
  
    return {x: x, y: y};
}

function moveTowardsPoint(p0x, p0y, px, py, dist) {
    let dx = px - p0x;
    let dy = py - p0y;
    let angle = Math.atan2(dy, dx) + Math.PI / 2;
    
    let x = p0x;
    let y = p0y;
  
    x += dist * Math.sin(angle);
    y -= dist * Math.cos(angle);
  
    return {x: x, y: y};
}

function getDistance(p0x, p0y, px, py) {
    let a = px - p0x;
    let b = py - p0y;

    let c = Math.sqrt(a*a + b*b);
    return c;
}

function getAngle(p0x, p0y, px, py) {
    let dx = px - p0x;
    let dy = py - p0y;
    let angle = Math.atan2(dy, dx);

    return angle;
}

function movePiece(piece, oldPos, newPos, drag = true, promotedPiece = null) {
    let style = "position: relative; width: 100%; height: 100%; z-index: 2;";
    $(piece).attr("style", style);
    let clickEnPassant = null;
    let capture = "";

    if (oldPos !== newPos && legalMoves.includes(newPos) && curPiece !== null) {
        $(".movedPieceTile").removeClass("movedPieceTile");
        $("#" + oldPos).addClass("movedPieceTile");
        $("#" + newPos).addClass("movedPieceTile");

        legalMoves = [];
        drawMoves();
        
        let mate = false;
        let chck = "";
        check = false;
        if (checks.length > 0 && checks.map(c => c.pos.substr(c.pos.length - 2)).includes(newPos)) {
            let p = curCol === "Light" ? piece.dataset.piece : piece.dataset.piece.toLowerCase();
            loop : for (let i = 0; i < checks.length; i++) {
                if (checks[i].pos.substr(checks[i].pos.length - 2) === newPos && checks[i].piece === p) {
                    check = true;
                    chck = mate ? "#" : "+";
                    // console.log("Check!");
                    break loop;
                }
            }
        }

        capture = $("#" + newPos).children().length === 1 ? "x" : "";
        let pieceType = piece.dataset.piece === "P" ? (capture ? piece.dataset.position.split("")[0] : "") : piece.dataset.piece;
        let multipPos = true ? "" : "x"; // If multiple possible pieces
        let castle = null;
        enPassant = "-";
        
        piece.dataset.position = newPos;

        // If rook captured
        if ($("#" + newPos).children()[0] && $("#" + newPos).children()[0].dataset.piece === "R") {
            let rPos = $("#" + newPos).children()[0].dataset.position;
            if (rPos === "a1") {
                castling["Q"] = false;
            }
            else if (rPos === "h1") {
                castling["K"] = false;
            }
            else if (rPos === "a8") {
                castling["q"] = false;
            }
            else if (rPos === "h8") {
                castling["k"] = false;
            }
        }

        let castlingRook = null;
        let castlingRookOP = null;
        let castlingRookNP = null;
        if (pieceType === "K") {
            if (curCol === "Light") {
                if (newPos === "g1" && castling["K"]) {
                    let r = getPieceAt("h1");
                    if (drag) {
                        $("#f1").html(r);
                        $("#h1").html("");
                    }
                    r.dataset.position = "f1";
                    castle = "o-o";
                    castlingRook = r;
                    castlingRookOP = "h1";
                    castlingRookNP = "f1";
                }
                if (newPos === "c1" && castling["Q"]) {
                    let r = getPieceAt("a1");
                    if (drag) {
                        $("#d1").html(r);
                        $("#a1").html("");
                    }
                    r.dataset.position = "d1";
                    castle = "o-o-o";
                    castlingRook = r;
                    castlingRookOP = "a1";
                    castlingRookNP = "d1";
                }
            }
            else {
                if (newPos === "g8" && castling["k"]) {
                    let r = getPieceAt("h8");
                    if (drag) {
                        $("#f8").html(r);
                        $("#h8").html("");
                    }
                    r.dataset.position = "f8";
                    castle = "o-o";
                    castlingRook = r;
                    castlingRookOP = "h8";
                    castlingRookNP = "f8";
                }
                if (newPos === "c8" && castling["q"]) {
                    let r = getPieceAt("a8");
                    if (drag) {
                        $("#d8").html(r);
                        $("#a8").html("");
                    }
                    r.dataset.position = "d8";
                    castle = "o-o-o";
                    castlingRook = r;
                    castlingRookOP = "a8";
                    castlingRookNP = "d8";
                }
            }

            let cast = curCol === "Light" ? ["K", "Q"] : ["k", "q"];
            for (let c of cast) {
                castling[c] = false;
            }
        }
        else if (pieceType === "R") {
            let r = piece.id.split("_")[1].split("")[0];
            let p = r === "a" ? "Q" : "K";
            let c = curCol === "Light" ? p.toUpperCase() : p.toLowerCase();
            castling[c] = false;
        }

        if (piece.dataset.piece === "P") {
            if (Math.abs(parseInt(oldPos.split("")[1]) - parseInt(newPos.split("")[1])) === 2) {
                let i = curCol === "Light" ? -1 : 1;
                enPassant = newPos.split("")[0] + (parseInt(newPos.split("")[1]) + i);
            }

            if (!capture && oldPos.split("")[0] !== newPos.split("")[0]) {
                // en passant
                if (curCol === "Light") {
                    if (drag) {
                        $("#" + newPos.split("")[0] + (parseInt(newPos.split("")[1]) - 1)).html("");
                    }
                    else {
                        clickEnPassant = "#" + newPos.split("")[0] + (parseInt(newPos.split("")[1]) - 1);
                    }
                }
                else {
                    if (drag) {
                        $("#" + newPos.split("")[0] + (parseInt(newPos.split("")[1]) + 1)).html("");
                    }
                    else {
                        clickEnPassant = "#" + newPos.split("")[0] + (parseInt(newPos.split("")[1]) + 1);
                    }
                }
            }
        }

        if (!drag) {
            let s = $("#board").width() / 8;
            let nX = columns.indexOf(newPos.split("")[0]) - columns.indexOf(oldPos.split("")[0]);
            let nY = rows.indexOf(parseInt(newPos.split("")[1])) - rows.indexOf(parseInt(oldPos.split("")[1]));
            let eqX = nX >= 0 ? "+=" : "-=";
            let eqY = nY >= 0 ? "+=" : "-=";
            
            if (castlingRook) {
                $(castlingRook).attr("style", style);
                let nrX = columns.indexOf(castlingRookNP.split("")[0]) - columns.indexOf(castlingRookOP.split("")[0]);
                let nrY = rows.indexOf(parseInt(castlingRookNP.split("")[1])) - rows.indexOf(parseInt(castlingRookOP.split("")[1]));
                let eqrX = nrX >= 0 ? "+=" : "-=";
                let eqrY = nrY >= 0 ? "+=" : "-=";

                $(castlingRook).animate({ 
                    top: eqrY + (s * Math.abs(nrY)),
                    left: eqrX + (s * Math.abs(nrX)),
                }, moveTime);
            }

            $(piece).animate({ 
                top: eqY + (s * Math.abs(nY)),
                left: eqX + (s * Math.abs(nX)),
            }, moveTime);

            setTimeout(() => {
                if (clickEnPassant) {
                    $(clickEnPassant).html("");
                }
            }, moveTime);

            setTimeout(() => {
                if (castlingRook) {
                    $("#" + castlingRookNP).html(castlingRook);
                    $("#" + castlingRookOP).html("");
                    $(castlingRook).css({ 
                        top: 0,
                        left: 0,
                    });
                }

                $("#" + newPos).html(piece);
                $("#" + oldPos).html("");
                $(piece).css({ 
                    top: 0,
                    left: 0,
                });
            }, moveTime + 50);

        }
        else {
            $("#" + newPos).html(piece);
            $("#" + oldPos).html("");
        }

        if (curCol === "Light") {
            moves[(Object.keys(moves).length + 1) + "."] = [];
        }
        
        moves[(Object.keys(moves).length) + "."].push(castle ? castle : pieceType + multipPos + capture + newPos + chck);
        
        let sound = mate ? sfx.checkmate : check ? sfx.check : capture ? sfx.capture: castle !== null ? sfx.castling : sfx.move;
        sound.play();

        if (piece.dataset.piece === "P" || capture === "x") {
            halfMoves = 0;
        }
        else {
            halfMoves++;
        }

        if (curCol === "Dark") {
            fullMoves++;
        }

        curPiece = null;
        curCol = curCol === "Light" ? "Dark" : "Light";

        let fenPos = exportFEN().split(" ").slice(0, 4).join(" ");
        if (fenPositions[fenPos]) {
            fenPositions[fenPos]++;
        }
        else {
            fenPositions[fenPos] = 1;
        }

        if (allLegalMoves.length === 0) {
            gameDraw("Stalemate");
        }
        if (halfMoves === 100) {
            gameDraw("50-Move Rule");
        }
        if (fenPositions[fenPos] === 3) {
            gameDraw("Threefold Repetition");
        }
        let boardPiecesRaw = tiles.filter(t => $(t).children().length > 0).map(t => ($(t).children()[0].dataset.color === "Light" ? $(t).children()[0].dataset.piece : $(t).children()[0].dataset.piece.toLowerCase()) + ($(t).children()[0].dataset.piece.toLowerCase() === "b" ? (getTileColor(t.id) === "Light" ? "w" : "b") : "")).sort((a, b) => a.localeCompare(b));
        let boardPieces = boardPiecesRaw.map(p => p.split("")[0]);

        if (
            boardPieces.length === 2 ||
            (boardPieces.length === 3 && (boardPieces.join("") === ["b", "k", "K"].join("") || boardPieces.join("") === ["B", "k", "K"].join("") || boardPieces.join("") === ["k", "K", "n"].join("") || boardPieces.join("") === ["k", "K", "N"].join(""))) ||
            boardPieces.length === 4 && (boardPiecesRaw.join("") === ["bb", "Bb", "k", "K"].join("") || boardPiecesRaw.join("") === ["bw", "Bw", "k", "K"].join(""))
        ) {
            gameDraw("Dead Position");
        }
        /* 
        King vs. king
        King and bishop vs. king
        King and knight vs. king
        King and bishop vs. king and bishop of the same color as the opponent's bishop
        */
    }
    else if (oldPos === newPos && piece) {
        piece.dataset.position = newPos;
        if (!jadoubeLock) {
            sfx.jadoube.play();
        }
    }
    jadoubeLock = true;

    if (oldPos !== newPos) {
        $("th, td").css("background", "");
        let curIdx = (1 + Math.floor(pgnMoves / 2));
        let curTd = 1 + (pgnMoves % 2);
        $("#th" + curIdx + ", #td" + curIdx + curTd).css("background", cellColor);

        lastPGNMove = [
            (piece.dataset.piece === "P" ? "" : piece.dataset.piece) + capture + newPos + (promotedPiece ? "=" + promotedPiece : ""),
            (piece.dataset.piece === "P" ? "" : piece.dataset.piece) + oldPos + capture + newPos + (promotedPiece ? "=" + promotedPiece : ""),
            (piece.dataset.piece === "P" ? "" : piece.dataset.piece) + oldPos.substring(0, 1) + capture + newPos + (promotedPiece ? "=" + promotedPiece : ""),
            (piece.dataset.piece === "P" ? "" : piece.dataset.piece) + oldPos.substring(1, 2) + capture + newPos + (promotedPiece ? "=" + promotedPiece : "")
        ];
        if (lastPGNMove.includes("Ke8g8") || lastPGNMove.includes("Ke1g1")) {
            lastPGNMove = ["O-O"]
        }
        else if (lastPGNMove.includes("Ke8c8") || lastPGNMove.includes("Ke1c1")) {
            lastPGNMove = ["O-O-O"]
        }
        
        if (playingPGN) {
            pgnMoves++;
        
            if (pgnMoves % 2 === 0) {
                currentPGNMove++;
            }

            if ((pgnMoves % 2 === 0) === flipped) {
                computerMove();
            }
        }
    }
}

function getTileColor(tile) {
    let t = tile.includes("#") ? tile : "#" + tile;
    
    return $(t)[0].dataset.color;
}

function promote(piece, oldPos, newPos) {
    let tileSize = $("#board").width() / 8;
    let promPieces = piece.dataset.color === "Light" ? ["Qw", "Nw", "Rw", "Bw", "X"] : ["X", "Bb", "Rb", "Nb", "Qb"];
    let style = "position: relative; width: 100%; height: 100%;";
    
    let rect = document.createElementNS('http://www.w3.org/2000/svg', "rect");
    $(rect).attr("x", tileSize * columns.indexOf(newPos.split("")[0]));
    $(rect).attr("y", piece.dataset.color === "Light" ? 0 : tileSize * 3.5);
    $(rect).attr("width", tileSize);
    $(rect).attr("height", tileSize * 4.5);
    $(rect).attr("rx", tileSize * 0.05);
    $(rect).attr("ry", tileSize * 0.05);
    $(rect).attr("fill", "#f1f1f1");
    $(rect).attr("stroke", "rgba(0, 0, 0, 0.2)");
    $(rect).attr("id", "promotion");

    $("#promotionLayer").append(rect);
    $("#promotionLayer").css("pointer-events", "auto");

    let y = piece.dataset.color === "Light" ? 0 : tileSize * 3.5;
    for (let p of promPieces) {
        if (p !== "X") {
            let imgBG = document.createElementNS('http://www.w3.org/2000/svg', "rect");
            $(imgBG).attr("x", tileSize * columns.indexOf(newPos.split("")[0]));
            $(imgBG).attr("y", y);
            $(imgBG).attr("width", tileSize);
            $(imgBG).attr("height", tileSize);
            $(imgBG).attr("fill", "#fff");
            $(imgBG).attr("style", "position: absolute; z-index: 3;");
            $(imgBG).attr("id", "promCross");

            $("#promotionLayer").append(imgBG);
            let img = document.createElementNS('http://www.w3.org/2000/svg','image');
            img.setAttributeNS(null, "width", tileSize);
            img.setAttributeNS(null, "height", tileSize);
            img.setAttributeNS("http://www.w3.org/1999/xlink", "href", "../Pieces/" + p + ".svg");
            img.setAttributeNS(null, "x", tileSize * columns.indexOf(newPos.split("")[0]));
            img.setAttributeNS(null, "y", y);
            img.setAttributeNS(null, "style", "position: absolute; z-index: 3;");
            img.setAttributeNS(null, "id", "prom" + p);
            $("#promotionLayer").append(img);
            $("#prom" + p).css("pointer-events", "auto");
            $("#prom" + p).unbind();
            $("#prom" + p).on("mousedown", e => {
                e.preventDefault();
                e.stopPropagation();
                promReady = true;
            });
            $("#prom" + p).on("mouseup", e => {
                e.preventDefault();
                e.stopPropagation();
                if (promReady) {
                    choosePromotion(piece, oldPos, newPos, p);
                }
            });
            y += tileSize;
        }
        else {
            let crossW = tileSize * 0.2;
            let crossH = crossW * 0.2;
            let cross1 = document.createElementNS('http://www.w3.org/2000/svg', "rect");
            $(cross1).attr("x", tileSize * columns.indexOf(newPos.split("")[0]) + tileSize * 0.5 - crossW * 0.5);
            $(cross1).attr("y", y + tileSize * 0.25 - crossH * 0.5);
            $(cross1).attr("rx", crossH / 4);
            $(cross1).attr("ry", crossH / 4);
            $(cross1).attr("width", crossW);
            $(cross1).attr("height", crossH);
            $(cross1).attr("fill", "#8B8987");
            $(cross1).attr("style", "position: absolute; z-index: 3; transform-box: fill-box; transform-origin: center; transform: rotate(45deg);");

            $("#promotionLayer").append(cross1);

            let cross2 = document.createElementNS('http://www.w3.org/2000/svg', "rect");
            $(cross2).attr("x", tileSize * columns.indexOf(newPos.split("")[0]) + tileSize * 0.5 - crossW * 0.5);
            $(cross2).attr("y", y + tileSize * 0.25 - crossH * 0.5);
            $(cross2).attr("width", crossW);
            $(cross2).attr("height", crossH);
            $(cross2).attr("rx", crossH / 4);
            $(cross2).attr("ry", crossH / 4);
            $(cross2).attr("fill", "#8B8987");
            $(cross2).attr("style", "position: absolute; z-index: 3; transform-box: fill-box; transform-origin: center; transform: rotate(-45deg);");

            $("#promotionLayer").append(cross2);

            $("#promotionLayer").on("mousedown", e => {
                e.preventDefault();
                e.stopPropagation();
                promReady = true;
            });
            $("#promotionLayer").on("mouseup", e => {
                e.preventDefault();
                e.stopPropagation();
                if (promReady) {
                    cancelPromotion(piece, oldPos, newPos);
                }
            });
            y += tileSize * 0.5;
        }
    }
}

function cancelPromotion(piece, oldPos, newPos) {
    promReady = false;
    $("#promotionLayer").html("");
    $("#promotionLayer").unbind();
    $("#promotionLayer").css("pointer-events", "none");
    curPiece = null;
    legalMoves = [];
    drawMoves();
    $("#" + oldPos).html(piece);
    let style = "position: relative; width: 100%; height: 100%;";
    $(piece).attr("style", style);
}

function choosePromotion(piece, oldPos, newPos, prom) {
    promReady = false;
    $("#promotionLayer").html("");
    $("#promotionLayer").unbind();
    $("#promotionLayer").css("pointer-events", "none");
    $(".movedPieceTile").removeClass("movedPieceTile");
    $("#" + oldPos).addClass("movedPieceTile");
    $("#" + newPos).addClass("movedPieceTile");

    let capture = $("#" + newPos).children().length === 1 ? oldPos.split("")[0] + "x" : "";

    // If rook captured
    if ($("#" + newPos).children()[0] && $("#" + newPos).children()[0].dataset.piece === "R") {
        let rPos = $("#" + newPos).children()[0].dataset.position;
        if (rPos === "a1") {
            castling["Q"] = false;
        }
        else if (rPos === "h1") {
            castling["K"] = false;
        }
        else if (rPos === "a8") {
            castling["q"] = false;
        }
        else if (rPos === "h8") {
            castling["k"] = false;
        }
    }

    $("#" + newPos).html(piece);
    $("#" + oldPos).html("");
    piece.dataset.position = newPos;
    piece.dataset.piece = prom.split("")[0];
    $(piece).attr("src", "../Pieces/" + prom + ".svg");
    let style = "position: relative; width: 100%; height: 100%;";
    $(piece).attr("style", style);

    if (curCol === "Light") {
        moves[(Object.keys(moves).length + 1) + "."] = [];
    }
    let mate = false;
    let check = false;
    if (checks.length > 0 && checks.map(c => c.pos.substr(c.pos.length - 2)).includes(newPos)) {
        let p = curCol === "Light" ? piece.dataset.piece : piece.dataset.piece.toLowerCase();
        loop : for (let i = 0; i < checks.length; i++) {
            if (checks[i].pos.substr(checks[i].pos.length - 2) === newPos && checks[i].piece === p) {
                check = true;
                chck = mate ? "#" : "+";
                console.log("Check!");
                break loop;
            }
        }
    }

    moves[(Object.keys(moves).length) + "."].push(capture + newPos + "=" + prom.split("")[0] + (mate ? "#" : check ? "+" : ""));

    let sound = mate ? sfx.checkmate : check ? sfx.check : capture.includes("x") ? sfx.capture : sfx.move;
    sound.play();

    curPiece = null;
    curCol = curCol === "Light" ? "Dark" : "Light";
    legalMoves = [];
    drawMoves();
}

function getLegalMoves() {
    // Also check checks, mates and discovered checks
    legalMoves = [];
    let pos = curPiece.dataset.position.split("");
    let u = true;
    let d = true;
    let r = true;
    let l = true;
    let ur = true;
    let ul = true;
    let dr = true;
    let dl = true;
    switch (curPiece.dataset.piece) {
        case "P":
            if (curPiece.dataset.color === "Light") {
                if (!getPieceAt(pos[0] + (parseInt(pos[1]) + 1))) {
                    legalMoves.push(pos[0] + (parseInt(pos[1]) + 1));
                    if (pos[1] === "2" && !getPieceAt(pos[0] + (parseInt(pos[1]) + 2))) {
                        legalMoves.push(pos[0] + (parseInt(pos[1]) + 2));
                    }
                }
                if (columns[columns.indexOf(pos[0]) - 1]) {
                    let po = columns[columns.indexOf(pos[0]) - 1] + (parseInt(pos[1]) + 1);
                    let p = getPieceAt(po);
                    if (p && p.dataset.color === "Dark") {
                        legalMoves.push("x" + po);
                    }
                }
                if (columns[columns.indexOf(pos[0]) + 1]) {
                    let po = columns[columns.indexOf(pos[0]) + 1] + (parseInt(pos[1]) + 1);
                    let p = getPieceAt(po);
                    if (p && p.dataset.color === "Dark") {
                        legalMoves.push("x" + po);
                    }
                }
                if (enPassant !== "-") {
                    let po1 = columns[columns.indexOf(enPassant.split("")[0]) - 1] + (parseInt(enPassant.split("")[1]) - 1);
                    let po2 = columns[columns.indexOf(enPassant.split("")[0]) + 1] + (parseInt(enPassant.split("")[1]) - 1);
                    if (pos.join("") === po1 || pos.join("") === po2) {
                        legalMoves.push("x" + enPassant);
                    }
                }
            }
            else if (curPiece.dataset.color === "Dark") {
                if (!getPieceAt(pos[0] + (parseInt(pos[1]) - 1))) {
                    legalMoves.push(pos[0] + (parseInt(pos[1]) - 1));
                    if (pos[1] === "7" && !getPieceAt(pos[0] + (parseInt(pos[1]) - 2))) {
                        legalMoves.push(pos[0] + (parseInt(pos[1]) - 2));
                    }
                }
                if (columns[columns.indexOf(pos[0]) - 1]) {
                    let po = columns[columns.indexOf(pos[0]) - 1] + (parseInt(pos[1]) - 1);
                    let p = getPieceAt(po);
                    if (p && p.dataset.color === "Light") {
                        legalMoves.push("x" + po);
                    }
                }
                if (columns[columns.indexOf(pos[0]) + 1]) {
                    let po = columns[columns.indexOf(pos[0]) + 1] + (parseInt(pos[1]) - 1);
                    let p = getPieceAt(po);
                    if (p && p.dataset.color === "Light") {
                        legalMoves.push("x" + po);
                    }
                }
                if (enPassant !== "-") {
                    let po1 = columns[columns.indexOf(enPassant.split("")[0]) - 1] + (parseInt(enPassant.split("")[1]) + 1);
                    let po2 = columns[columns.indexOf(enPassant.split("")[0]) + 1] + (parseInt(enPassant.split("")[1]) + 1);
                    if (pos.join("") === po1 || pos.join("") === po2) {
                        legalMoves.push("x" + enPassant);
                    }
                }
            }

            break;
        case "K":
            for (let i = 1; i < 2; i++) {
                if (u && parseInt(pos[1]) + i <= 8) {
                    if (!getPieceAt(pos[0] + (parseInt(pos[1]) + i))) {
                        legalMoves.push(pos[0] + (parseInt(pos[1]) + i));
                    }
                    else if (getPieceAt(pos[0] + (parseInt(pos[1]) + i)).dataset.color !== curPiece.dataset.color) {
                        legalMoves.push("x" + pos[0] + (parseInt(pos[1]) + i));
                        u = false;
                    }
                    else {
                        u = false;
                    }
                }
                else {
                    u = false;
                }
                if (d && parseInt(pos[1]) - i >= 1) {
                    if (!getPieceAt(pos[0] + (parseInt(pos[1]) - i))) {
                        legalMoves.push(pos[0] + (parseInt(pos[1]) - i));
                    }
                    else if (getPieceAt(pos[0] + (parseInt(pos[1]) - i)).dataset.color !== curPiece.dataset.color) {
                        legalMoves.push("x" + pos[0] + (parseInt(pos[1]) - i));
                        d = false;
                    }
                    else {
                        d = false;
                    }
                }
                else {
                    d = false;
                }
                if (r && columns.indexOf(pos[0]) + i < 8) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) + i] + pos[1])) {
                        legalMoves.push(columns[columns.indexOf(pos[0]) + i] + pos[1]);
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) + i] + pos[1]).dataset.color !== curPiece.dataset.color) {
                        legalMoves.push("x" + columns[columns.indexOf(pos[0]) + i] + pos[1]);
                        r = false;
                    }
                    else {
                        r = false;
                    }
                }
                else {
                    r = false;
                }
                if (l && columns.indexOf(pos[0]) - i > 0) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) - i] + pos[1])) {
                        legalMoves.push(columns[columns.indexOf(pos[0]) - i] + pos[1]);
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) - i] + pos[1]).dataset.color !== curPiece.dataset.color) {
                        legalMoves.push("x" + columns[columns.indexOf(pos[0]) - i] + pos[1]);
                        l = false;
                    }
                    else {
                        l = false;
                    }
                }
                else {
                    l = false;
                }
            }
            for (let i = 1; i < 2; i++) {
                if (ur && columns.indexOf(pos[0]) + i < 8 && parseInt(pos[1]) + i <= 8) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) + i))) {
                        legalMoves.push(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) + i)).toString();
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) + i)).dataset.color !== curPiece.dataset.color) {
                        legalMoves.push("x" + columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) + i));
                        ur = false;
                    }
                    else {
                        ur = false;
                    }
                }
                else {
                    ur = false;
                }
                if (ul && columns.indexOf(pos[0]) - i >= 0 && parseInt(pos[1]) + i <= 8) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) + i))) {
                        legalMoves.push(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) + i)).toString();
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) + i)).dataset.color !== curPiece.dataset.color) {
                        legalMoves.push("x" + columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) + i));
                        ul = false;
                    }
                    else {
                        ul = false;
                    }
                }
                else {
                    ul = false;
                }
                if (dr && columns.indexOf(pos[0]) + i < 8 && parseInt(pos[1]) - i > 0) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) - i))) {
                        legalMoves.push(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) - i)).toString();
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) - i)).dataset.color !== curPiece.dataset.color) {
                        legalMoves.push("x" + columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) - i));
                        dr = false;
                    }
                    else {
                        dr = false;
                    }
                }
                else {
                    dr = false;
                }
                if (dl && columns.indexOf(pos[0]) - i >= 0 && parseInt(pos[1]) - i > 0) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) - i))) {
                        legalMoves.push(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) - i)).toString();
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) - i)).dataset.color !== curPiece.dataset.color) {
                        legalMoves.push("x" + columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) - i));
                        dl = false;
                    }
                    else {
                        dl = false;
                    }
                }
                else {
                    dl = false;
                }
            }
            if (curPiece.dataset.color === "Light") {
                if (castling["K"] && !getPieceAt("f1") && !getPieceAt("g1")) {
                    legalMoves.push("g1");
                }
                if (castling["Q"] && !getPieceAt("b1") && !getPieceAt("c1") && !getPieceAt("d1")) {
                    legalMoves.push("c1");
                }
            }
            else {
                if (castling["k"] && !getPieceAt("f8") && !getPieceAt("g8")) {
                    legalMoves.push("g8");
                }
                if (castling["q"] && !getPieceAt("b8") && !getPieceAt("c8") && !getPieceAt("d8")) {
                    legalMoves.push("c8");
                }
            }
            break;
        case "Q":
            for (let i = 1; i < 8; i++) {
                if (u && parseInt(pos[1]) + i <= 8) {
                    if (!getPieceAt(pos[0] + (parseInt(pos[1]) + i))) {
                        legalMoves.push(pos[0] + (parseInt(pos[1]) + i));
                    }
                    else if (getPieceAt(pos[0] + (parseInt(pos[1]) + i)).dataset.color !== curPiece.dataset.color) {
                        legalMoves.push("x" + pos[0] + (parseInt(pos[1]) + i));
                        u = false;
                    }
                    else {
                        u = false;
                    }
                }
                else {
                    u = false;
                }
                if (d && parseInt(pos[1]) - i >= 1) {
                    if (!getPieceAt(pos[0] + (parseInt(pos[1]) - i))) {
                        legalMoves.push(pos[0] + (parseInt(pos[1]) - i));
                    }
                    else if (getPieceAt(pos[0] + (parseInt(pos[1]) - i)).dataset.color !== curPiece.dataset.color) {
                        legalMoves.push("x" + pos[0] + (parseInt(pos[1]) - i));
                        d = false;
                    }
                    else {
                        d = false;
                    }
                }
                else {
                    d = false;
                }
                if (r && columns.indexOf(pos[0]) + i < 8) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) + i] + pos[1])) {
                        legalMoves.push(columns[columns.indexOf(pos[0]) + i] + pos[1]);
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) + i] + pos[1]).dataset.color !== curPiece.dataset.color) {
                        legalMoves.push("x" + columns[columns.indexOf(pos[0]) + i] + pos[1]);
                        r = false;
                    }
                    else {
                        r = false;
                    }
                }
                else {
                    r = false;
                }
                if (l && columns.indexOf(pos[0]) - i >= 0) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) - i] + pos[1])) {
                        legalMoves.push(columns[columns.indexOf(pos[0]) - i] + pos[1]);
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) - i] + pos[1]).dataset.color !== curPiece.dataset.color) {
                        legalMoves.push("x" + columns[columns.indexOf(pos[0]) - i] + pos[1]);
                        l = false;
                    }
                    else {
                        l = false;
                    }
                }
                else {
                    l = false;
                }
            }
            for (let i = 1; i < 8; i++) {
                if (ur && columns.indexOf(pos[0]) + i < 8 && parseInt(pos[1]) + i <= 8) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) + i))) {
                        legalMoves.push(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) + i)).toString();
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) + i)).dataset.color !== curPiece.dataset.color) {
                        legalMoves.push("x" + columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) + i));
                        ur = false;
                    }
                    else {
                        ur = false;
                    }
                }
                else {
                    ur = false;
                }
                if (ul && columns.indexOf(pos[0]) - i >= 0 && parseInt(pos[1]) + i <= 8) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) + i))) {
                        legalMoves.push(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) + i)).toString();
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) + i)).dataset.color !== curPiece.dataset.color) {
                        legalMoves.push("x" + columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) + i));
                        ul = false;
                    }
                    else {
                        ul = false;
                    }
                }
                else {
                    ul = false;
                }
                if (dr && columns.indexOf(pos[0]) + i < 8 && parseInt(pos[1]) - i > 0) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) - i))) {
                        legalMoves.push(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) - i)).toString();
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) - i)).dataset.color !== curPiece.dataset.color) {
                        legalMoves.push("x" + columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) - i));
                        dr = false;
                    }
                    else {
                        dr = false;
                    }
                }
                else {
                    dr = false;
                }
                if (dl && columns.indexOf(pos[0]) - i >= 0 && parseInt(pos[1]) - i > 0) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) - i))) {
                        legalMoves.push(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) - i)).toString();
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) - i)).dataset.color !== curPiece.dataset.color) {
                        legalMoves.push("x" + columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) - i));
                        dl = false;
                    }
                    else {
                        dl = false;
                    }
                }
                else {
                    dl = false;
                }
            }
            break;
        case "B":
            for (let i = 1; i < 8; i++) {
                if (ur && columns.indexOf(pos[0]) + i < 8 && parseInt(pos[1]) + i <= 8) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) + i))) {
                        legalMoves.push(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) + i)).toString();
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) + i)).dataset.color !== curPiece.dataset.color) {
                        legalMoves.push("x" + columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) + i));
                        ur = false;
                    }
                    else {
                        ur = false;
                    }
                }
                else {
                    ur = false;
                }
                if (ul && columns.indexOf(pos[0]) - i >= 0 && parseInt(pos[1]) + i <= 8) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) + i))) {
                        legalMoves.push(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) + i)).toString();
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) + i)).dataset.color !== curPiece.dataset.color) {
                        legalMoves.push("x" + columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) + i));
                        ul = false;
                    }
                    else {
                        ul = false;
                    }
                }
                else {
                    ul = false;
                }
                if (dr && columns.indexOf(pos[0]) + i < 8 && parseInt(pos[1]) - i > 0) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) - i))) {
                        legalMoves.push(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) - i)).toString();
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) - i)).dataset.color !== curPiece.dataset.color) {
                        legalMoves.push("x" + columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) - i));
                        dr = false;
                    }
                    else {
                        dr = false;
                    }
                }
                else {
                    dr = false;
                }
                if (dl && columns.indexOf(pos[0]) - i >= 0 && parseInt(pos[1]) - i > 0) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) - i))) {
                        legalMoves.push(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) - i)).toString();
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) - i)).dataset.color !== curPiece.dataset.color) {
                        legalMoves.push("x" + columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) - i));
                        dl = false;
                    }
                    else {
                        dl = false;
                    }
                }
                else {
                    dl = false;
                }
            }
            break;
        case "N":
            if (columns.indexOf(pos[0]) + 1 < 8 && parseInt(pos[1]) + 2 <= 8) {
                if (!getPieceAt(columns[columns.indexOf(pos[0]) + 1] + (parseInt(pos[1]) + 2))) {
                    legalMoves.push(columns[columns.indexOf(pos[0]) + 1] + (parseInt(pos[1]) + 2));
                }
                else if (getPieceAt(columns[columns.indexOf(pos[0]) + 1] + (parseInt(pos[1]) + 2)).dataset.color !== curPiece.dataset.color) {
                    legalMoves.push("x" + columns[columns.indexOf(pos[0]) + 1] + (parseInt(pos[1]) + 2));
                }
            }
            if (columns.indexOf(pos[0]) + 2 < 8 && parseInt(pos[1]) + 1 <= 8) {
                if (!getPieceAt(columns[columns.indexOf(pos[0]) + 2] + (parseInt(pos[1]) + 1))) {
                    legalMoves.push(columns[columns.indexOf(pos[0]) + 2] + (parseInt(pos[1]) + 1));
                }
                else if (getPieceAt(columns[columns.indexOf(pos[0]) + 2] + (parseInt(pos[1]) + 1)).dataset.color !== curPiece.dataset.color) {
                    legalMoves.push("x" + columns[columns.indexOf(pos[0]) + 2] + (parseInt(pos[1]) + 1));
                }
            }
            if (columns.indexOf(pos[0]) + 1 < 8 && parseInt(pos[1]) - 2 > 0) {
                if (!getPieceAt(columns[columns.indexOf(pos[0]) + 1] + (parseInt(pos[1]) - 2))) {
                    legalMoves.push(columns[columns.indexOf(pos[0]) + 1] + (parseInt(pos[1]) - 2));
                }
                else if (getPieceAt(columns[columns.indexOf(pos[0]) + 1] + (parseInt(pos[1]) - 2)).dataset.color !== curPiece.dataset.color) {
                    legalMoves.push("x" + columns[columns.indexOf(pos[0]) + 1] + (parseInt(pos[1]) - 2));
                }
            }
            if (columns.indexOf(pos[0]) + 2 < 8 && parseInt(pos[1]) - 1 > 0) {
                if (!getPieceAt(columns[columns.indexOf(pos[0]) + 2] + (parseInt(pos[1]) - 1))) {
                    legalMoves.push(columns[columns.indexOf(pos[0]) + 2] + (parseInt(pos[1]) - 1));
                }
                else if (getPieceAt(columns[columns.indexOf(pos[0]) + 2] + (parseInt(pos[1]) - 1)).dataset.color !== curPiece.dataset.color) {
                    legalMoves.push("x" + columns[columns.indexOf(pos[0]) + 2] + (parseInt(pos[1]) - 1));
                }
            }
            if (columns.indexOf(pos[0]) - 1 >= 0 && parseInt(pos[1]) + 2 <= 8) {
                if (!getPieceAt(columns[columns.indexOf(pos[0]) - 1] + (parseInt(pos[1]) + 2))) {
                    legalMoves.push(columns[columns.indexOf(pos[0]) - 1] + (parseInt(pos[1]) + 2));
                }
                else if (getPieceAt(columns[columns.indexOf(pos[0]) - 1] + (parseInt(pos[1]) + 2)).dataset.color !== curPiece.dataset.color) {
                    legalMoves.push("x" + columns[columns.indexOf(pos[0]) - 1] + (parseInt(pos[1]) + 2));
                }
            }
            if (columns.indexOf(pos[0]) - 2 >= 0 && parseInt(pos[1]) + 1 <= 8) {
                if (!getPieceAt(columns[columns.indexOf(pos[0]) - 2] + (parseInt(pos[1]) + 1))) {
                    legalMoves.push(columns[columns.indexOf(pos[0]) - 2] + (parseInt(pos[1]) + 1));
                }
                else if (getPieceAt(columns[columns.indexOf(pos[0]) - 2] + (parseInt(pos[1]) + 1)).dataset.color !== curPiece.dataset.color) {
                    legalMoves.push("x" + columns[columns.indexOf(pos[0]) - 2] + (parseInt(pos[1]) + 1));
                }
            }
            if (columns.indexOf(pos[0]) - 1 >= 0 && parseInt(pos[1]) - 2 > 0) {
                if (!getPieceAt(columns[columns.indexOf(pos[0]) - 1] + (parseInt(pos[1]) - 2))) {
                    legalMoves.push(columns[columns.indexOf(pos[0]) - 1] + (parseInt(pos[1]) - 2));
                }
                else if (getPieceAt(columns[columns.indexOf(pos[0]) - 1] + (parseInt(pos[1]) - 2)).dataset.color !== curPiece.dataset.color) {
                    legalMoves.push("x" + columns[columns.indexOf(pos[0]) - 1] + (parseInt(pos[1]) - 2));
                }
            }
            if (columns.indexOf(pos[0]) - 2 >= 0 && parseInt(pos[1]) - 1 > 0) {
                if (!getPieceAt(columns[columns.indexOf(pos[0]) - 2] + (parseInt(pos[1]) - 1))) {
                    legalMoves.push(columns[columns.indexOf(pos[0]) - 2] + (parseInt(pos[1]) - 1));
                }
                else if (getPieceAt(columns[columns.indexOf(pos[0]) - 2] + (parseInt(pos[1]) - 1)).dataset.color !== curPiece.dataset.color) {
                    legalMoves.push("x" + columns[columns.indexOf(pos[0]) - 2] + (parseInt(pos[1]) - 1));
                }
            }
            break;
        case "R":
            for (let i = 1; i < 8; i++) {
                if (u && parseInt(pos[1]) + i <= 8) {
                    if (!getPieceAt(pos[0] + (parseInt(pos[1]) + i))) {
                        legalMoves.push(pos[0] + (parseInt(pos[1]) + i));
                    }
                    else if (getPieceAt(pos[0] + (parseInt(pos[1]) + i)).dataset.color !== curPiece.dataset.color) {
                        legalMoves.push("x" + pos[0] + (parseInt(pos[1]) + i));
                        u = false;
                    }
                    else {
                        u = false;
                    }
                }
                else {
                    u = false;
                }
                if (d && parseInt(pos[1]) - i >= 1) {
                    if (!getPieceAt(pos[0] + (parseInt(pos[1]) - i))) {
                        legalMoves.push(pos[0] + (parseInt(pos[1]) - i));
                    }
                    else if (getPieceAt(pos[0] + (parseInt(pos[1]) - i)).dataset.color !== curPiece.dataset.color) {
                        legalMoves.push("x" + pos[0] + (parseInt(pos[1]) - i));
                        d = false;
                    }
                    else {
                        d = false;
                    }
                }
                else {
                    d = false;
                }
                if (r && columns.indexOf(pos[0]) + i < 8) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) + i] + pos[1])) {
                        legalMoves.push(columns[columns.indexOf(pos[0]) + i] + pos[1]);
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) + i] + pos[1]).dataset.color !== curPiece.dataset.color) {
                        legalMoves.push("x" + columns[columns.indexOf(pos[0]) + i] + pos[1]);
                        r = false;
                    }
                    else {
                        r = false;
                    }
                }
                else {
                    r = false;
                }
                if (l && columns.indexOf(pos[0]) - i >= 0) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) - i] + pos[1])) {
                        legalMoves.push(columns[columns.indexOf(pos[0]) - i] + pos[1]);
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) - i] + pos[1]).dataset.color !== curPiece.dataset.color) {
                        legalMoves.push("x" + columns[columns.indexOf(pos[0]) - i] + pos[1]);
                        l = false;
                    }
                    else {
                        l = false;
                    }
                }
                else {
                    l = false;
                }
            }
            break;
    }

    // Check for checks before moving
    findChecks();

    drawMoves();
}

function getAllLegalMoves() {
    // Also check checks, mates and discovered checks
    allLegalMoves = {};
    let boardPieces = tiles.filter(t => $(t).children().length > 0).map(t => ($(t).children()[0]));
    for (let currentPiece of boardPieces) {
        if (!(currentPiece.dataset.piece in allLegalMoves)) {
            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position] = [];
        }
        let pos = currentPiece.dataset.position.split("");
        let u = true;
        let d = true;
        let r = true;
        let l = true;
        let ur = true;
        let ul = true;
        let dr = true;
        let dl = true;
        switch (currentPiece.dataset.piece) {
            case "P":
                if (currentPiece.dataset.color === "Light") {
                    if (!getPieceAt(pos[0] + (parseInt(pos[1]) + 1))) {
                        allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(pos[0] + (parseInt(pos[1]) + 1));
                        if (pos[1] === "2" && !getPieceAt(pos[0] + (parseInt(pos[1]) + 2))) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(pos[0] + (parseInt(pos[1]) + 2));
                        }
                    }
                    if (columns[columns.indexOf(pos[0]) - 1]) {
                        let po = columns[columns.indexOf(pos[0]) - 1] + (parseInt(pos[1]) + 1);
                        let p = getPieceAt(po);
                        if (p && p.dataset.color === "Dark") {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + po);
                        }
                    }
                    if (columns[columns.indexOf(pos[0]) + 1]) {
                        let po = columns[columns.indexOf(pos[0]) + 1] + (parseInt(pos[1]) + 1);
                        let p = getPieceAt(po);
                        if (p && p.dataset.color === "Dark") {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + po);
                        }
                    }
                    if (enPassant !== "-") {
                        let po1 = columns[columns.indexOf(enPassant.split("")[0]) - 1] + (parseInt(enPassant.split("")[1]) - 1);
                        let po2 = columns[columns.indexOf(enPassant.split("")[0]) + 1] + (parseInt(enPassant.split("")[1]) - 1);
                        if (pos.join("") === po1 || pos.join("") === po2) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + enPassant);
                        }
                    }
                }
                else if (currentPiece.dataset.color === "Dark") {
                    if (!getPieceAt(pos[0] + (parseInt(pos[1]) - 1))) {
                        allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(pos[0] + (parseInt(pos[1]) - 1));
                        if (pos[1] === "7" && !getPieceAt(pos[0] + (parseInt(pos[1]) - 2))) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(pos[0] + (parseInt(pos[1]) - 2));
                        }
                    }
                    if (columns[columns.indexOf(pos[0]) - 1]) {
                        let po = columns[columns.indexOf(pos[0]) - 1] + (parseInt(pos[1]) - 1);
                        let p = getPieceAt(po);
                        if (p && p.dataset.color === "Light") {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + po);
                        }
                    }
                    if (columns[columns.indexOf(pos[0]) + 1]) {
                        let po = columns[columns.indexOf(pos[0]) + 1] + (parseInt(pos[1]) - 1);
                        let p = getPieceAt(po);
                        if (p && p.dataset.color === "Light") {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + po);
                        }
                    }
                    if (enPassant !== "-") {
                        let po1 = columns[columns.indexOf(enPassant.split("")[0]) - 1] + (parseInt(enPassant.split("")[1]) + 1);
                        let po2 = columns[columns.indexOf(enPassant.split("")[0]) + 1] + (parseInt(enPassant.split("")[1]) + 1);
                        if (pos.join("") === po1 || pos.join("") === po2) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + enPassant);
                        }
                    }
                }

                break;
            case "K":
                for (let i = 1; i < 2; i++) {
                    if (u && parseInt(pos[1]) + i <= 8) {
                        if (!getPieceAt(pos[0] + (parseInt(pos[1]) + i))) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(pos[0] + (parseInt(pos[1]) + i));
                        }
                        else if (getPieceAt(pos[0] + (parseInt(pos[1]) + i)).dataset.color !== currentPiece.dataset.color) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + pos[0] + (parseInt(pos[1]) + i));
                            u = false;
                        }
                        else {
                            u = false;
                        }
                    }
                    else {
                        u = false;
                    }
                    if (d && parseInt(pos[1]) - i >= 1) {
                        if (!getPieceAt(pos[0] + (parseInt(pos[1]) - i))) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(pos[0] + (parseInt(pos[1]) - i));
                        }
                        else if (getPieceAt(pos[0] + (parseInt(pos[1]) - i)).dataset.color !== currentPiece.dataset.color) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + pos[0] + (parseInt(pos[1]) - i));
                            d = false;
                        }
                        else {
                            d = false;
                        }
                    }
                    else {
                        d = false;
                    }
                    if (r && columns.indexOf(pos[0]) + i < 8) {
                        if (!getPieceAt(columns[columns.indexOf(pos[0]) + i] + pos[1])) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) + i] + pos[1]);
                        }
                        else if (getPieceAt(columns[columns.indexOf(pos[0]) + i] + pos[1]).dataset.color !== currentPiece.dataset.color) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) + i] + pos[1]);
                            r = false;
                        }
                        else {
                            r = false;
                        }
                    }
                    else {
                        r = false;
                    }
                    if (l && columns.indexOf(pos[0]) - i > 0) {
                        if (!getPieceAt(columns[columns.indexOf(pos[0]) - i] + pos[1])) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) - i] + pos[1]);
                        }
                        else if (getPieceAt(columns[columns.indexOf(pos[0]) - i] + pos[1]).dataset.color !== currentPiece.dataset.color) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) - i] + pos[1]);
                            l = false;
                        }
                        else {
                            l = false;
                        }
                    }
                    else {
                        l = false;
                    }
                }
                for (let i = 1; i < 2; i++) {
                    if (ur && columns.indexOf(pos[0]) + i < 8 && parseInt(pos[1]) + i <= 8) {
                        if (!getPieceAt(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) + i))) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) + i)).toString();
                        }
                        else if (getPieceAt(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) + i)).dataset.color !== currentPiece.dataset.color) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) + i));
                            ur = false;
                        }
                        else {
                            ur = false;
                        }
                    }
                    else {
                        ur = false;
                    }
                    if (ul && columns.indexOf(pos[0]) - i >= 0 && parseInt(pos[1]) + i <= 8) {
                        if (!getPieceAt(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) + i))) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) + i)).toString();
                        }
                        else if (getPieceAt(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) + i)).dataset.color !== currentPiece.dataset.color) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) + i));
                            ul = false;
                        }
                        else {
                            ul = false;
                        }
                    }
                    else {
                        ul = false;
                    }
                    if (dr && columns.indexOf(pos[0]) + i < 8 && parseInt(pos[1]) - i > 0) {
                        if (!getPieceAt(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) - i))) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) - i)).toString();
                        }
                        else if (getPieceAt(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) - i)).dataset.color !== currentPiece.dataset.color) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) - i));
                            dr = false;
                        }
                        else {
                            dr = false;
                        }
                    }
                    else {
                        dr = false;
                    }
                    if (dl && columns.indexOf(pos[0]) - i >= 0 && parseInt(pos[1]) - i > 0) {
                        if (!getPieceAt(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) - i))) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) - i)).toString();
                        }
                        else if (getPieceAt(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) - i)).dataset.color !== currentPiece.dataset.color) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) - i));
                            dl = false;
                        }
                        else {
                            dl = false;
                        }
                    }
                    else {
                        dl = false;
                    }
                }
                if (currentPiece.dataset.color === "Light") {
                    if (castling["K"] && !getPieceAt("f1") && !getPieceAt("g1")) {
                        allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("g1");
                    }
                    if (castling["Q"] && !getPieceAt("b1") && !getPieceAt("c1") && !getPieceAt("d1")) {
                        allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("c1");
                    }
                }
                else {
                    if (castling["k"] && !getPieceAt("f8") && !getPieceAt("g8")) {
                        allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("g8");
                    }
                    if (castling["q"] && !getPieceAt("b8") && !getPieceAt("c8") && !getPieceAt("d8")) {
                        allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("c8");
                    }
                }
                break;
            case "Q":
                for (let i = 1; i < 8; i++) {
                    if (u && parseInt(pos[1]) + i <= 8) {
                        if (!getPieceAt(pos[0] + (parseInt(pos[1]) + i))) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(pos[0] + (parseInt(pos[1]) + i));
                        }
                        else if (getPieceAt(pos[0] + (parseInt(pos[1]) + i)).dataset.color !== currentPiece.dataset.color) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + pos[0] + (parseInt(pos[1]) + i));
                            u = false;
                        }
                        else {
                            u = false;
                        }
                    }
                    else {
                        u = false;
                    }
                    if (d && parseInt(pos[1]) - i >= 1) {
                        if (!getPieceAt(pos[0] + (parseInt(pos[1]) - i))) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(pos[0] + (parseInt(pos[1]) - i));
                        }
                        else if (getPieceAt(pos[0] + (parseInt(pos[1]) - i)).dataset.color !== currentPiece.dataset.color) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + pos[0] + (parseInt(pos[1]) - i));
                            d = false;
                        }
                        else {
                            d = false;
                        }
                    }
                    else {
                        d = false;
                    }
                    if (r && columns.indexOf(pos[0]) + i < 8) {
                        if (!getPieceAt(columns[columns.indexOf(pos[0]) + i] + pos[1])) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) + i] + pos[1]);
                        }
                        else if (getPieceAt(columns[columns.indexOf(pos[0]) + i] + pos[1]).dataset.color !== currentPiece.dataset.color) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) + i] + pos[1]);
                            r = false;
                        }
                        else {
                            r = false;
                        }
                    }
                    else {
                        r = false;
                    }
                    if (l && columns.indexOf(pos[0]) - i >= 0) {
                        if (!getPieceAt(columns[columns.indexOf(pos[0]) - i] + pos[1])) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) - i] + pos[1]);
                        }
                        else if (getPieceAt(columns[columns.indexOf(pos[0]) - i] + pos[1]).dataset.color !== currentPiece.dataset.color) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) - i] + pos[1]);
                            l = false;
                        }
                        else {
                            l = false;
                        }
                    }
                    else {
                        l = false;
                    }
                }
                for (let i = 1; i < 8; i++) {
                    if (ur && columns.indexOf(pos[0]) + i < 8 && parseInt(pos[1]) + i <= 8) {
                        if (!getPieceAt(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) + i))) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) + i)).toString();
                        }
                        else if (getPieceAt(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) + i)).dataset.color !== currentPiece.dataset.color) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) + i));
                            ur = false;
                        }
                        else {
                            ur = false;
                        }
                    }
                    else {
                        ur = false;
                    }
                    if (ul && columns.indexOf(pos[0]) - i >= 0 && parseInt(pos[1]) + i <= 8) {
                        if (!getPieceAt(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) + i))) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) + i)).toString();
                        }
                        else if (getPieceAt(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) + i)).dataset.color !== currentPiece.dataset.color) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) + i));
                            ul = false;
                        }
                        else {
                            ul = false;
                        }
                    }
                    else {
                        ul = false;
                    }
                    if (dr && columns.indexOf(pos[0]) + i < 8 && parseInt(pos[1]) - i > 0) {
                        if (!getPieceAt(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) - i))) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) - i)).toString();
                        }
                        else if (getPieceAt(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) - i)).dataset.color !== currentPiece.dataset.color) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) - i));
                            dr = false;
                        }
                        else {
                            dr = false;
                        }
                    }
                    else {
                        dr = false;
                    }
                    if (dl && columns.indexOf(pos[0]) - i >= 0 && parseInt(pos[1]) - i > 0) {
                        if (!getPieceAt(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) - i))) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) - i)).toString();
                        }
                        else if (getPieceAt(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) - i)).dataset.color !== currentPiece.dataset.color) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) - i));
                            dl = false;
                        }
                        else {
                            dl = false;
                        }
                    }
                    else {
                        dl = false;
                    }
                }
                break;
            case "B":
                for (let i = 1; i < 8; i++) {
                    if (ur && columns.indexOf(pos[0]) + i < 8 && parseInt(pos[1]) + i <= 8) {
                        if (!getPieceAt(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) + i))) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) + i)).toString();
                        }
                        else if (getPieceAt(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) + i)).dataset.color !== currentPiece.dataset.color) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) + i));
                            ur = false;
                        }
                        else {
                            ur = false;
                        }
                    }
                    else {
                        ur = false;
                    }
                    if (ul && columns.indexOf(pos[0]) - i >= 0 && parseInt(pos[1]) + i <= 8) {
                        if (!getPieceAt(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) + i))) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) + i)).toString();
                        }
                        else if (getPieceAt(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) + i)).dataset.color !== currentPiece.dataset.color) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) + i));
                            ul = false;
                        }
                        else {
                            ul = false;
                        }
                    }
                    else {
                        ul = false;
                    }
                    if (dr && columns.indexOf(pos[0]) + i < 8 && parseInt(pos[1]) - i > 0) {
                        if (!getPieceAt(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) - i))) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) - i)).toString();
                        }
                        else if (getPieceAt(columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) - i)).dataset.color !== currentPiece.dataset.color) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) + i] + (parseInt(pos[1]) - i));
                            dr = false;
                        }
                        else {
                            dr = false;
                        }
                    }
                    else {
                        dr = false;
                    }
                    if (dl && columns.indexOf(pos[0]) - i >= 0 && parseInt(pos[1]) - i > 0) {
                        if (!getPieceAt(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) - i))) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) - i)).toString();
                        }
                        else if (getPieceAt(columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) - i)).dataset.color !== currentPiece.dataset.color) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) - i] + (parseInt(pos[1]) - i));
                            dl = false;
                        }
                        else {
                            dl = false;
                        }
                    }
                    else {
                        dl = false;
                    }
                }
                break;
            case "N":
                if (columns.indexOf(pos[0]) + 1 < 8 && parseInt(pos[1]) + 2 <= 8) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) + 1] + (parseInt(pos[1]) + 2))) {
                        allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) + 1] + (parseInt(pos[1]) + 2));
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) + 1] + (parseInt(pos[1]) + 2)).dataset.color !== currentPiece.dataset.color) {
                        allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) + 1] + (parseInt(pos[1]) + 2));
                    }
                }
                if (columns.indexOf(pos[0]) + 2 < 8 && parseInt(pos[1]) + 1 <= 8) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) + 2] + (parseInt(pos[1]) + 1))) {
                        allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) + 2] + (parseInt(pos[1]) + 1));
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) + 2] + (parseInt(pos[1]) + 1)).dataset.color !== currentPiece.dataset.color) {
                        allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) + 2] + (parseInt(pos[1]) + 1));
                    }
                }
                if (columns.indexOf(pos[0]) + 1 < 8 && parseInt(pos[1]) - 2 > 0) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) + 1] + (parseInt(pos[1]) - 2))) {
                        allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) + 1] + (parseInt(pos[1]) - 2));
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) + 1] + (parseInt(pos[1]) - 2)).dataset.color !== currentPiece.dataset.color) {
                        allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) + 1] + (parseInt(pos[1]) - 2));
                    }
                }
                if (columns.indexOf(pos[0]) + 2 < 8 && parseInt(pos[1]) - 1 > 0) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) + 2] + (parseInt(pos[1]) - 1))) {
                        allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) + 2] + (parseInt(pos[1]) - 1));
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) + 2] + (parseInt(pos[1]) - 1)).dataset.color !== currentPiece.dataset.color) {
                        allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) + 2] + (parseInt(pos[1]) - 1));
                    }
                }
                if (columns.indexOf(pos[0]) - 1 >= 0 && parseInt(pos[1]) + 2 <= 8) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) - 1] + (parseInt(pos[1]) + 2))) {
                        allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) - 1] + (parseInt(pos[1]) + 2));
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) - 1] + (parseInt(pos[1]) + 2)).dataset.color !== currentPiece.dataset.color) {
                        allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) - 1] + (parseInt(pos[1]) + 2));
                    }
                }
                if (columns.indexOf(pos[0]) - 2 >= 0 && parseInt(pos[1]) + 1 <= 8) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) - 2] + (parseInt(pos[1]) + 1))) {
                        allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) - 2] + (parseInt(pos[1]) + 1));
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) - 2] + (parseInt(pos[1]) + 1)).dataset.color !== currentPiece.dataset.color) {
                        allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) - 2] + (parseInt(pos[1]) + 1));
                    }
                }
                if (columns.indexOf(pos[0]) - 1 >= 0 && parseInt(pos[1]) - 2 > 0) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) - 1] + (parseInt(pos[1]) - 2))) {
                        allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) - 1] + (parseInt(pos[1]) - 2));
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) - 1] + (parseInt(pos[1]) - 2)).dataset.color !== currentPiece.dataset.color) {
                        allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) - 1] + (parseInt(pos[1]) - 2));
                    }
                }
                if (columns.indexOf(pos[0]) - 2 >= 0 && parseInt(pos[1]) - 1 > 0) {
                    if (!getPieceAt(columns[columns.indexOf(pos[0]) - 2] + (parseInt(pos[1]) - 1))) {
                        allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) - 2] + (parseInt(pos[1]) - 1));
                    }
                    else if (getPieceAt(columns[columns.indexOf(pos[0]) - 2] + (parseInt(pos[1]) - 1)).dataset.color !== currentPiece.dataset.color) {
                        allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) - 2] + (parseInt(pos[1]) - 1));
                    }
                }
                break;
            case "R":
                for (let i = 1; i < 8; i++) {
                    if (u && parseInt(pos[1]) + i <= 8) {
                        if (!getPieceAt(pos[0] + (parseInt(pos[1]) + i))) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(pos[0] + (parseInt(pos[1]) + i));
                        }
                        else if (getPieceAt(pos[0] + (parseInt(pos[1]) + i)).dataset.color !== currentPiece.dataset.color) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + pos[0] + (parseInt(pos[1]) + i));
                            u = false;
                        }
                        else {
                            u = false;
                        }
                    }
                    else {
                        u = false;
                    }
                    if (d && parseInt(pos[1]) - i >= 1) {
                        if (!getPieceAt(pos[0] + (parseInt(pos[1]) - i))) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(pos[0] + (parseInt(pos[1]) - i));
                        }
                        else if (getPieceAt(pos[0] + (parseInt(pos[1]) - i)).dataset.color !== currentPiece.dataset.color) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + pos[0] + (parseInt(pos[1]) - i));
                            d = false;
                        }
                        else {
                            d = false;
                        }
                    }
                    else {
                        d = false;
                    }
                    if (r && columns.indexOf(pos[0]) + i < 8) {
                        if (!getPieceAt(columns[columns.indexOf(pos[0]) + i] + pos[1])) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) + i] + pos[1]);
                        }
                        else if (getPieceAt(columns[columns.indexOf(pos[0]) + i] + pos[1]).dataset.color !== currentPiece.dataset.color) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) + i] + pos[1]);
                            r = false;
                        }
                        else {
                            r = false;
                        }
                    }
                    else {
                        r = false;
                    }
                    if (l && columns.indexOf(pos[0]) - i >= 0) {
                        if (!getPieceAt(columns[columns.indexOf(pos[0]) - i] + pos[1])) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push(columns[columns.indexOf(pos[0]) - i] + pos[1]);
                        }
                        else if (getPieceAt(columns[columns.indexOf(pos[0]) - i] + pos[1]).dataset.color !== currentPiece.dataset.color) {
                            allLegalMoves[currentPiece.dataset.piece + "_" + currentPiece.dataset.color + "_" + currentPiece.dataset.position].push("x" + columns[columns.indexOf(pos[0]) - i] + pos[1]);
                            l = false;
                        }
                        else {
                            l = false;
                        }
                    }
                    else {
                        l = false;
                    }
                }
                break;
        }

        // Check for checks before moving
        findChecks();
    }
}

function findChecks() {
    checks = [];
    let pBoard = [];
    let i = 0;
    for (let y = 0; y < 8; y++) {
        pBoard.push([]);
        for (let x = 0; x < 8; x++) {
            let t = tiles[i];
            let p = $(t).children().length > 0 ? ($(t).children()[0].dataset.color === "Light" ? $(t).children()[0].dataset.piece : $(t).children()[0].dataset.piece.toLowerCase()) : "";

            pBoard[y].push(p);
            i++;
        }
    }

    let kW = posKing(pBoard, "K");
    let kB = posKing(pBoard, "k");
    
    let positions = [];

    let k = curCol === "Light" ? kB : kW;

    // Pawn checks
    let pawnY = curCol === "Light" ? 1 : -1;
    for (let x of [-1, 1]) {
        if (columns[parseInt(k.x) + x] && rows[parseInt(k.y) + pawnY]) {
            positions.push({
                x: parseInt(k.x) + x,
                y: parseInt(k.y) + pawnY,
                pos: columns[parseInt(k.x) + x] + rows[parseInt(k.y) + pawnY],
                p: curCol === "Light" ? "P" : "p"
            });
        }
    }
    
    // Knight checks
    for (let y of [-2, -1, 1, 2]) {
        for (let x of [-2, -1, 1, 2]) {
            if (Math.abs(y / x) !== 1 && columns[parseInt(k.x) + x] && rows[parseInt(k.y) + y]) {
                positions.push({
                    x: parseInt(k.x) + x,
                    y: parseInt(k.y) + y,
                    pos: columns[parseInt(k.x) + x] + rows[parseInt(k.y) + y],
                    p: curCol === "Light" ? "N" : "n"
                });
            }
        }
    }
    
    // Queen checks
    // Rook checks
    for (let y = -7; y < 8; y++) {
        if (columns[parseInt(k.x)] && rows[parseInt(k.y) + y]) {
            positions.push({
                x: parseInt(k.x),
                y: parseInt(k.y) + y,
                pos: columns[parseInt(k.x)] + rows[parseInt(k.y) + y],
                p: curCol === "Light" ? "R" : "r"
            });
            positions.push({
                x: parseInt(k.x),
                y: parseInt(k.y) + y,
                pos: columns[parseInt(k.x)] + rows[parseInt(k.y) + y],
                p: curCol === "Light" ? "Q" : "q"
            });
        }
    }
    for (let x = -7; x < 8; x++) {
        if (columns[parseInt(k.x) + x] && rows[parseInt(k.y)]) {
            positions.push({
                x: parseInt(k.x) + x,
                y: parseInt(k.y),
                pos: columns[parseInt(k.x) + x] + rows[parseInt(k.y)],
                p: curCol === "Light" ? "R" : "r"
            });
            positions.push({
                x: parseInt(k.x) + x,
                y: parseInt(k.y),
                pos: columns[parseInt(k.x) + x] + rows[parseInt(k.y)],
                p: curCol === "Light" ? "Q" : "q"
            });
        }
    }
    
    // Bishop checks
    for (let y = -7; y < 8; y++) {
        for (let x = -7; x < 8; x++) {
            if (Math.abs(y / x) === 1 && columns[parseInt(k.x) + x] && rows[parseInt(k.y) + y]) {
                positions.push({
                    x: parseInt(k.x) + x,
                    y: parseInt(k.y) + y,
                    pos: columns[parseInt(k.x) + x] + rows[parseInt(k.y) + y],
                    p: curCol === "Light" ? "B" : "b"
                });
                positions.push({
                    x: parseInt(k.x) + x,
                    y: parseInt(k.y) + y,
                    pos: columns[parseInt(k.x) + x] + rows[parseInt(k.y) + y],
                    p: curCol === "Light" ? "Q" : "q"
                });
            }
        }
    }
    
    // "King checks"
    for (let y = -1; y < 2; y++) {
        for (let x = -1; x < 2; x++) {
            if (columns[parseInt(k.x) + x] && rows[parseInt(k.y) + y]) {
                positions.push({
                    x: parseInt(k.x) + x,
                    y: parseInt(k.y) + y,
                    pos: columns[parseInt(k.x) + x] + rows[parseInt(k.y) + y],
                    p: curCol === "Light" ? "K" : "k"
                });
            }
        }
    }
    
    for (let p of positions) {
        if (legalMoves.map(m => m.substr(m.length - 2)).includes(p.pos)) {
            checks.push({
                pos: p.pos,
                piece: p.p
            });
        }
    }
    checks = checks.sort((a, b) => {
        if (a.piece < b.piece){
            return -1;
        }
        else if (a.piece > b.piece){
            return 1;
        }
        return 0;
    });
}

function findChecks2(pos) {
    checks2 = {
        w: [],
        b: []
    };
    let pBoard = [];
    let i = 0;
    for (let y = 0; y < 8; y++) {
        pBoard.push([]);
        for (let x = 0; x < 8; x++) {
            let t = tiles[i];
            let p = $(t).children().length > 0 ? ($(t).children()[0].dataset.color === "Light" ? $(t).children()[0].dataset.piece : $(t).children()[0].dataset.piece.toLowerCase()) : "";

            pBoard[y].push(p);
            i++;
        }
    }

    let kW = posKing(pBoard, "K");
    let kB = posKing(pBoard, "k");
    
    let positions = [];

    let k = curCol === "Light" ? kB : kW;

    // Pawn checks
    let pawnY = curCol === "Light" ? 1 : -1;
    for (let x of [-1, 1]) {
        if (columns[parseInt(k.x) + x] && rows[parseInt(k.y) + pawnY]) {
            positions.push({
                x: parseInt(k.x) + x,
                y: parseInt(k.y) + pawnY,
                pos: columns[parseInt(k.x) + x] + rows[parseInt(k.y) + pawnY],
                p: curCol === "Light" ? "P" : "p"
            });
        }
    }
    
    // Knight checks
    for (let y of [-2, -1, 1, 2]) {
        for (let x of [-2, -1, 1, 2]) {
            if (Math.abs(y / x) !== 1 && columns[parseInt(k.x) + x] && rows[parseInt(k.y) + y]) {
                positions.push({
                    x: parseInt(k.x) + x,
                    y: parseInt(k.y) + y,
                    pos: columns[parseInt(k.x) + x] + rows[parseInt(k.y) + y],
                    p: curCol === "Light" ? "N" : "n"
                });
            }
        }
    }
    
    // Queen checks
    // Rook checks
    for (let y = -7; y < 8; y++) {
        if (columns[parseInt(k.x)] && rows[parseInt(k.y) + y]) {
            positions.push({
                x: parseInt(k.x),
                y: parseInt(k.y) + y,
                pos: columns[parseInt(k.x)] + rows[parseInt(k.y) + y],
                p: curCol === "Light" ? "R" : "r"
            });
            positions.push({
                x: parseInt(k.x),
                y: parseInt(k.y) + y,
                pos: columns[parseInt(k.x)] + rows[parseInt(k.y) + y],
                p: curCol === "Light" ? "Q" : "q"
            });
        }
    }
    for (let x = -7; x < 8; x++) {
        if (columns[parseInt(k.x) + x] && rows[parseInt(k.y)]) {
            positions.push({
                x: parseInt(k.x) + x,
                y: parseInt(k.y),
                pos: columns[parseInt(k.x) + x] + rows[parseInt(k.y)],
                p: curCol === "Light" ? "R" : "r"
            });
            positions.push({
                x: parseInt(k.x) + x,
                y: parseInt(k.y),
                pos: columns[parseInt(k.x) + x] + rows[parseInt(k.y)],
                p: curCol === "Light" ? "Q" : "q"
            });
        }
    }
    
    // Bishop checks
    for (let y = -7; y < 8; y++) {
        for (let x = -7; x < 8; x++) {
            if (Math.abs(y / x) === 1 && columns[parseInt(k.x) + x] && rows[parseInt(k.y) + y]) {
                positions.push({
                    x: parseInt(k.x) + x,
                    y: parseInt(k.y) + y,
                    pos: columns[parseInt(k.x) + x] + rows[parseInt(k.y) + y],
                    p: curCol === "Light" ? "B" : "b"
                });
                positions.push({
                    x: parseInt(k.x) + x,
                    y: parseInt(k.y) + y,
                    pos: columns[parseInt(k.x) + x] + rows[parseInt(k.y) + y],
                    p: curCol === "Light" ? "Q" : "q"
                });
            }
        }
    }
    
    // "King checks"
    for (let y = -1; y < 2; y++) {
        for (let x = -1; x < 2; x++) {
            if (columns[parseInt(k.x) + x] && rows[parseInt(k.y) + y]) {
                positions.push({
                    x: parseInt(k.x) + x,
                    y: parseInt(k.y) + y,
                    pos: columns[parseInt(k.x) + x] + rows[parseInt(k.y) + y],
                    p: curCol === "Light" ? "K" : "k"
                });
            }
        }
    }
    
    for (let p of positions) {
        if (legalMoves.map(m => m.substr(m.length - 2)).includes(p.pos)) {
            checks.push({
                pos: p.pos,
                piece: p.p
            });
        }
    }
    checks = checks.sort((a, b) => {
        if (a.piece < b.piece){
            return -1;
        }
        else if (a.piece > b.piece){
            return 1;
        }
        return 0;
    });
}

function posKing(arr, el) {
    let pos = -1;
    for (let y = 0; y < arr.length; y++) {
        for (let x = 0; x < arr[y].length; x++) {
            if (arr[y][x] === el) {
                pos = {
                    tile: columns[x] + rows[y],
                    x: x,
                    y: y
                };
            }
        }
    }
    return pos;
}

function drawMoves() {
    let b = $("#board").width();
    let s = b / 8;
    $("#dots").html("");

    let cs = flipped ? columns.reverse() : columns;
    let rs = flipped ? rows.reverse() : rows;
    
    let i = 0;
    for (let m of legalMoves) {
        let mf = flipped ? flipMove(m.replace("x", "")) : m.replace("x", "");
        let col = "#000";
        let circ = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        $(circ).attr("cx", s * (parseInt(cs.indexOf(mf.split("")[0])) + 0.5));
        $(circ).attr("cy", s * (parseInt(rs.indexOf(parseInt(mf.split("")[1]))) + 0.5));

        if (m.includes("x")) {
            $(circ).attr("r", s * 0.45);
            $(circ).attr("fill", "transparent");
            $(circ).attr("stroke", col);
            $(circ).attr("stroke-width", s / 10);
            $(circ).css("opacity", "0.1");
        }
        else {
            $(circ).attr("r", s / 6);
            $(circ).attr("fill", col);
            $(circ).css("opacity", "0.1");
        }
        
        $("#dots").append(circ);

        legalMoves[i] = m.replace("x", "");
        i++;
    }
}

function gameDraw(reason) {
    sfx.gameOver.play();
    alert("Draw: " + reason);
}

function getPieceAt(tile) {
    let p = $("#" + tile).children()[0];
    return p ? p : false;
}

function clickTile(tile) {

}

function purifyPgn(pgn) {
    // Remove metadata enclosed in square brackets
    function removeMetadata(text) {
        return text.replace(/^\[\s*.*?\s*\][\r\n]*/gm, '');
    }

    // Removes content enclosed in the specified brackets, handles nesting
    function removeEnclosedContent(text, open, close) {
        let result = '';
        let depth = 0; // Track depth of nested brackets
        for (let i = 0; i < text.length; i++) {
            if (text[i] === open) {
                depth++;
                continue; // Skip adding the opening bracket to result
            }
            if (text[i] === close && depth > 0) {
                depth--;
                continue; // Skip adding the closing bracket to result
            }
            if (depth === 0) {
                result += text[i]; // Add characters outside brackets
            }
        }
        return result;
    }

    // Remove instances of move numbers followed by "..."
    function removeMoveNumbersWithEllipsis(text) {
        return text.replace(/\d+\.\.\./g, '');
    }

    // Sequentially apply text cleaning operations
    pgn = removeMetadata(pgn);
    pgn = removeEnclosedContent(pgn, '(', ')');
    pgn = removeEnclosedContent(pgn, '{', '}');
    pgn = removeMoveNumbersWithEllipsis(pgn);

    // Replace line breaks with a space
    pgn = pgn.replace(/[\r\n]+/g, ' ');

    return pgn.replace(/\s*(1-0|0-1|1\/2-1\/2)\s*$/, '').replaceAll("*", "").replaceAll("?", "").replaceAll("!", "").replace(/\s\s+/g, ' ').trim();
}

function loadPGN() {
    $("#btnFlip").prop("disabled", "");
    $("#btnPlay").prop("disabled", "");
    $("#content").html(`
        <table id="board"></table>
        <svg id="lettersNumbers"></svg>
        <svg id="dots"></svg>
        <svg id="arrowLayer"></svg>
        <svg id="squareLayer"></svg>
        <svg id="promotionLayer"></svg>
        <button id="btnFlip" onclick="flipTable()">Flip</button>
    `);
    $("#moves").html("");
    init();
    let pgn = $("#taPGN").val();
    $('.selected').removeClass('selected');

    if (pgn.trim() !== "") {
        pgn = purifyPgn(pgn);
        $("#taPGN").val("");
    
        let curIndex = "";
        let tdIndex = 1;
        for (let m of pgn.split(" ")) {
            if (m.includes("*")) {
                continue;
            }
            else if (m.includes(".")) {
                curIndex = m.replace(".", "");
                loadedPGN[curIndex] = [];
                $("#moves").append("<tr id='tr" + curIndex + "'><th id='th" + curIndex + "'>" + m + "</th></tr>");
                tdIndex = 1;
            }
            else {
                $("#tr" + curIndex).append("<td id='td" + curIndex + tdIndex + "'>" + m + "</td>");
                loadedPGN[curIndex].push(m);
                tdIndex++;
            }
        }

        $("#btnPlay").prop("disabled", "");
    }
}

function savePGN() {
    const pgn = $('#taPGN').val();
    const pgnName = prompt('Enter a name for the PGN:');

    if (pgnName) {
        let savedPGNs = localStorage.getItem('savedPGNs');
        savedPGNs = savedPGNs ? JSON.parse(savedPGNs) : {};

        if (savedPGNs.hasOwnProperty(pgnName)) {
            alert('A PGN with this name already exists.');
        } else {
            savedPGNs[pgnName] = pgn;
            localStorage.setItem('savedPGNs', JSON.stringify(savedPGNs));
            updateSavedPGNsList();
            alert('PGN saved!');
        }
    }
}

function updateSavedPGNsList() {
    let savedPGNs = localStorage.getItem('savedPGNs');
    savedPGNs = savedPGNs ? JSON.parse(savedPGNs) : {};
    const savedPGNsContainer = $('#savedPGNs');
    savedPGNsContainer.empty();

    // Get the keys (names) and sort them alphabetically
    const sortedNames = Object.keys(savedPGNs).sort();

    // Iterate over the sorted names
    $.each(sortedNames, function(index, name) {
        const pgn = savedPGNs[name];
        const entry = $('<div></div>').addClass('entry');

        const pgnNameText = $('<span></span>').text(name);
        const deleteButton = $('<button></button>').addClass('deleteButton').text('X').click(function(e) {
            e.stopPropagation(); // Prevent the click event from reaching the entry
            if (confirm('Are you sure you want to delete this PGN?')) {
                delete savedPGNs[name];
                localStorage.setItem('savedPGNs', JSON.stringify(savedPGNs));
                updateSavedPGNsList();
            }
        });

        entry.append(pgnNameText, deleteButton).click(function() {
            $('#taPGN').val(pgn);
            $('.selected').removeClass('selected'); // Remove the selection from previously selected entries
            $(this).addClass('selected'); // Highlight the selected entry
        });

        savedPGNsContainer.append(entry);
    });
}

function playPGN() {
    playingPGN = true;
    currentPGNMove = 1;
    getAllLegalMoves();
    fromTo = getFromTo(loadedPGN[1][flipped ? 1 : 0]);
    $("#btnFlip").prop("disabled", "disabled");
    $("#btnPlay").prop("disabled", "disabled");

    $("th, td").css("background", "");

    if (flipped) {
        computerMove();
    }
}

function getFromTo(pgnMove) {
    pgnMove = pgnMove.replace('+', '').replace('#', '').replace('x', '');
    let pieceType = "P";
    let destination = pgnMove.substring(pgnMove.length - 2);
    let fromPosition = "a1";
    let promotion = pgnMove.includes('=');
    // pieceColor is opposite of curCol since curCol hasn't changed yet
    let pieceColor = curCol === "Light" ? "Dark" : "Light";

    if (promotion) {
        destination = pgnMove.split('=')[0].substring(pgnMove.length - 3, pgnMove.length - 1);
    }

    if (pgnMove === "O-O") {
        if (pieceColor === "Light") {
            fromPosition = "e1";
            destination = "g1";
        }
        else {
            fromPosition = "e8";
            destination = "g8";
        }
    }
    else if (pgnMove === "O-O-O") {
        if (pieceColor === "Light") {
            fromPosition = "e1";
            destination = "c1";
        }
        else {
            fromPosition = "e8";
            destination = "c8";
        }
    }
    else {
        if (pgnMove[0].toUpperCase() === pgnMove[0] && isNaN(pgnMove[0])) {
            pieceType = pgnMove[0];
            pgnMove = pgnMove.substring(1);
        }

        let pos = pgnMove.replace(pieceType, "").replace(destination, "");
        for (let key of Object.keys(allLegalMoves)) {
            const k = key.split("_");
            const lMoves = allLegalMoves[key].map(m => m.substring(m.length - 2, m.length));
            if (key.includes(pieceType + "_" + pieceColor + "_") && k[2].includes(pos) && lMoves.includes(pgnMove.substring(pgnMove.length - 2))) {
                fromPosition = k[2];
                break;
            };
        };
    }

    console.log(pgnMove, fromPosition, destination);
    
    if (flipped) {
        fromPosition = flipMove(fromPosition);
        destination = flipMove(destination);
    }
    
    return [fromPosition, destination];
}

function flipMove(move) {
    let letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    let numbers = ["1", "2", "3", "4", "5", "6", "7", "8"];
    let rLetters = ["h", "g", "f", "e", "d", "c", "b", "a"];
    let rNumbers = ["8", "7", "6", "5", "4", "3", "2", "1"];
    return rLetters[letters.indexOf(move[0])] + rNumbers[numbers.indexOf(move[1])];
}

function computerMove() {
    getAllLegalMoves();
    let nextMove = loadedPGN[currentPGNMove];
    if (nextMove && nextMove[flipped ? 0 : 1]) {
        if ((lastPGNMove.length === 0 && flipped) || lastPGNMove.map(m => m.replace("+", "").replace("x", "")).includes(loadedPGN[currentPGNMove - (flipped ? 1 : 0)][flipped ? 1 : 0].replace("+", "").replace("x", ""))) {
            setTimeout(() => {
                if (flipped) { // CPU starts
                    movePiecePGN(nextMove[0]);
                }
                else { // Player starts
                    movePiecePGN(nextMove[1]);
                }
            }, moveTime * 1.5);
        }
        else {
            let col = "rgba(248, 85, 63, 0.8)";
            setTimeout(() => {
                fromTo = getFromTo(loadedPGN[currentPGNMove - (flipped ? 1 : 0)][flipped ? 1 : 0]);
                console.log(loadedPGN[currentPGNMove - (flipped ? 1 : 0)][flipped ? 1 : 0], fromTo);
                drawArrow(fromTo[0], fromTo[1], col);
                setTimeout(() => {
                    if (confirm("Exit study?")){
                        console.log("Exiting study");
                        $("#btnFlip").prop("disabled", "");
                        $("#btnPlay").prop("disabled", "disabled");
                        $("#content").html(`
                            <table id="board"></table>
                            <svg id="lettersNumbers"></svg>
                            <svg id="dots"></svg>
                            <svg id="arrowLayer"></svg>
                            <svg id="squareLayer"></svg>
                            <svg id="promotionLayer"></svg>
                            <button id="btnFlip" onclick="flipTable()">Flip</button>
                        `);
                        $("#moves").html("");
                        init();
                    }
                }, moveTime);
            }, moveTime);
            /* setTimeout(() => {
                if (confirm("Start over?")){
                    
                }
            }, moveTime); */
        }
    }
    else {
        setTimeout(() => {
            if (confirm("No more moves! Exit study?")){
                console.log("Exiting study");
                $("#btnFlip").prop("disabled", "");
                $("#btnPlay").prop("disabled", "disabled");
                $("#content").html(`
                    <table id="board"></table>
                    <svg id="lettersNumbers"></svg>
                    <svg id="dots"></svg>
                    <svg id="arrowLayer"></svg>
                    <svg id="squareLayer"></svg>
                    <svg id="promotionLayer"></svg>
                    <button id="btnFlip" onclick="flipTable()">Flip</button>
                `);
                $("#moves").html("");
                init();
            }
        }, moveTime * 1.5);
    }
}

function movePiecePGN(pgnMove) {
    pgnMove = pgnMove.replace('+', '').replace('#', '').replace('x', '');

    let pieceType = "P";
    let destination = pgnMove.substring(pgnMove.length - 2);

    // For promotions (e.g., e8=Q), handle the promotion aspect
    let promotion = pgnMove.includes('=');
    let promotedPiece = null;
    if (promotion) {
        promotedPiece = pgnMove.split('=')[1][0];
        destination = pgnMove.split('=')[0].substring(pgnMove.length - 2);
    }

    // Castling is a special move
    if (pgnMove === "O-O") {
        if (curCol === "Light") {
            movePieceAlgebraic("K", "g1", "e1");
        }
        else {
            movePieceAlgebraic("K", "g8", "e8");
        }
        return;
    }
    else if (pgnMove === "O-O-O") {
        if (curCol === "Light") {
            movePieceAlgebraic("K", "c1", "e1");
        }
        else {
            movePieceAlgebraic("K", "c8", "e8");
        }
        return;
    }
    
    if (pgnMove[0].toUpperCase() === pgnMove[0]) {
        // It's an uppercase letter, meaning it's a piece (not a pawn)
        pieceType = pgnMove[0];
        pgnMove = pgnMove.substring(1); // Remove piece notation for further processing
    }

    let pos = pgnMove.replace(pieceType, "").replace(destination, "");
    movePieceAlgebraic(pieceType, destination, pos, promotedPiece);
}

function movePieceAlgebraic(pieceType, destination, pos = "", promotedPiece = null) {
    getAllLegalMoves();
    let pieceToMove = null;
    let pieces = $('.pieces').toArray();

    for (let key of Object.keys(allLegalMoves)) {
        const k = key.split("_");
        const lMoves = allLegalMoves[key].map(m => m.substring(m.length - 2, m.length));
        if (lMoves.includes(destination) && pieceType === k[0]) {
            for (let piece of pieces) {
                const pPiece = $(piece).attr("data-piece");
                const pColor = $(piece).attr("data-color");
                const pPosition = $(piece).attr("data-position");
                if (pieceType === pPiece && curCol === pColor) {
                    if (k[0] === pPiece &&
                        k[1] === curCol && k[1] === pColor &&
                        k[2].includes(pos) && k[2].includes(pPosition)) {
                        pieceToMove = piece;
                        break;
                    };
                }
            };
        };
    };

    if (pieceToMove) {
        curPiece = pieceToMove;
        getLegalMoves();
        movePiece($(pieceToMove)[0], $(pieceToMove).attr("data-position"), destination, drag=false, promotedPiece=promotedPiece);
    }
    else {
        console.log(`No legal piece found for ${curCol} ${pieceType} to ${destination}:`);
        console.log(pieceType, destination, pos);
        console.log(allLegalMoves);
        console.log($(pieces));
    }
}

function adjustSize() {
    let size;
    if ($("body").width() >= $("body").height()) {
        size = $("#content").height() * 0.95;
    }
    else {
        size = $("#content").width() * 0.95;
    }
    $("#board").width(size);
    $("#board").height(size);
    
    $("#promotionLayer, #dots, #arrowLayer, #squareLayer, #lettersNumbers").attr("width", size);
    $("#promotionLayer, #dots, #arrowLayer, #squareLayer, #lettersNumbers").attr("height", size);
    $("#promotionLayer, #dots, #arrowLayer, #squareLayer, #lettersNumbers").css("top", $("#board").position().top);
    $("#promotionLayer, #dots, #arrowLayer, #squareLayer, #lettersNumbers").css("left", $("#board").position().left);
}