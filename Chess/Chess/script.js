let currentMove = "";
let prevMove = "";
let tiles = [];
let moves = {};
let legalMoves = [];
let checks = [];
let mouseDown = 0;
let curCol = "Light";
let curPos = null;
let curPiece = null;
let locked = false;
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

const circLight ="#D8C3A3";
const circDark ="#A37A59";

$(() => {
    init();
});

$(window).resize(() => {
    adjustSize();
});

function init() {
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
            let style = "background-color: " + col + "; width: " + size + "px; height: " + size + "px; text-align: center;";
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
    createLetters(!flipped);
    let fen = flipped ? "RNBKQBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbkqbnr w KQkq - 0 1" : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    placePieces(fen);
    flipped = !flipped;
}

// function placePieces(fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
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
    $(document).on("mousemove", e => {
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
            $(tarTile).addClass("dragging");
            $(".dragging").css("cursor", "grabbing");
        }
    });
    $(document).on("mouseup", e => {
        dragging = false;
        $(".dragging").removeClass("dragging");
        $(".tiles").css("cursor", "");
    });
}

function onMouseDown(e) {
    locked = false;

    $(".selectedPieceTile").removeClass("selectedPieceTile");

    if (e.which === 1) {
        // Left
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
                movePiece(curPiece, curPiece.dataset.position, newPos);
            }
        }
        else {
            mouseDown = 1;
            curPiece = e.target;

            if (curPiece && curCol === curPiece.dataset.color && curPiece.className === "pieces") {
                dragging = true;
                $("#" + tarDownTile).addClass("selectedPieceTile");

                curPos = e.target.dataset.position;
                getLegalMoves();
        
                $(curPiece).on("mousemove", e => {
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

        curPiece = null;
        legalMoves = [];
        drawMoves();
    }
}

function movePiece(piece, oldPos, newPos) {
    let style = "position: relative; width: 100%; height: 100%;";
    $(piece).attr("style", style);

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
                    console.log(checks);
                    console.log("CHECK!");
                    break loop;
                }
            }
        }

        let capture = $("#" + newPos).children().length === 1 ? "x" : "";
        let pieceType = piece.dataset.piece === "P" ? (capture ? piece.dataset.position.split("")[0] : "") : piece.dataset.piece;
        let multipPos = true ? "" : "x"; // If multiple possible pieces
        let castle = null;
        enPassant = "-";
        
        $("#" + newPos).html(piece);
        $("#" + oldPos).html("");
        piece.dataset.position = newPos;

        if (pieceType === "K") {
            if (curCol === "Light") {
                if (newPos === "g1" && castling["K"]) {
                    let r = getPieceAt("h1");
                    $("#f1").html(r);
                    $("#h1").html("");
                    r.dataset.position = "f1";
                    castle = "o-o";
                }
                if (newPos === "c1" && castling["Q"]) {
                    let r = getPieceAt("a1");
                    $("#d1").html(r);
                    $("#a1").html("");
                    r.dataset.position = "d1";
                    castle = "o-o-o";
                }
            }
            else {
                if (newPos === "g8" && castling["k"]) {
                    let r = getPieceAt("h8");
                    $("#f8").html(r);
                    $("#h8").html("");
                    r.dataset.position = "f8";
                    castle = "o-o";
                }
                if (newPos === "c8" && castling["q"]) {
                    let r = getPieceAt("a8");
                    $("#d8").html(r);
                    $("#a8").html("");
                    r.dataset.position = "d8";
                    castle = "o-o-o";
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
                    $("#" + newPos.split("")[0] + (parseInt(newPos.split("")[1]) - 1)).html("");
                }
                else {
                    $("#" + newPos.split("")[0] + (parseInt(newPos.split("")[1]) + 1)).html("");
                }
            }
        }

        if (curCol === "Light") {
            moves[(Object.keys(moves).length + 1) + "."] = [];
        }
        
        moves[(Object.keys(moves).length) + "."].push(castle ? castle : pieceType + multipPos + capture + newPos + chck);

        curPiece = null;
        curCol = curCol === "Light" ? "Dark" : "Light";
    }
    else if (oldPos === newPos && piece) {
        piece.dataset.position = newPos;
    }
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


    let y = piece.dataset.color === "Light" ? 0 : tileSize * 3.5;
    for (let p of promPieces) {
        if (p !== "X") {
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
            $("#prom" + p).on("mouseup", e => {
                e.preventDefault();
                e.stopPropagation();
                choosePromotion(piece, oldPos, newPos, p);
            });
            y += tileSize;
        }
        else {
            y += tileSize * 0.5;
        }
    }
}

function choosePromotion(piece, oldPos, newPos, prom) {
    $("#promotionLayer").html("");

    let capture = $("#" + newPos).children().length === 1 ? oldPos.split("")[0] + "x" : "";

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
    
    moves[(Object.keys(moves).length) + "."].push(capture + newPos + "=" + prom.split("")[0]);

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
    
    // Rook checks
    for (let y = -7; y < 8; y++) {
        if (columns[parseInt(k.x)] && rows[parseInt(k.y) + y]) {
            positions.push({
                x: parseInt(k.x),
                y: parseInt(k.y) + y,
                pos: columns[parseInt(k.x)] + rows[parseInt(k.y) + y],
                p: curCol === "Light" ? "R" : "r"
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
        }
    }
    console.log(positions);
    for (let p of positions) {
        if (legalMoves.includes(p.pos)) {
            checks.push({
                pos: p.pos,
                piece: p.p
            });
        }
    }
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

    let i = 0;
    for (let m of legalMoves) {
        let col = "#000";
        let circ = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        $(circ).attr("cx", s * (parseInt(columns.indexOf(m.replace("x", "").split("")[0])) + 0.5));
        $(circ).attr("cy", s * (parseInt(rows.indexOf(parseInt(m.replace("x", "").split("")[1]))) + 0.5));

        if (m.includes("x")) {
            $(circ).attr("r", s * 0.45);
            $(circ).attr("fill", "transparent");
            $(circ).attr("stroke", col);
            $(circ).attr("stroke-width", s / 10);
            $(circ).css("opacity", "0.1");
        }
        else {
            $(circ).attr("r", s / 6);
            $(circ).attr("fill:", col);
            $(circ).css("opacity", "0.1");
        }
        
        $("#dots").append(circ);

        legalMoves[i] = m.replace("x", "");
        i++;
    }
}

function getPieceAt(tile) {
    let p = $("#" + tile).children()[0];
    return p ? p : false;
}

function clickTile(tile) {

}

function adjustSize() {
    let size;
    if ($("body").width() >= $("body").height()) {
        size = $("#content").height() * 8 / 10;
    }
    else {
        size = $("#content").width() * 8 / 10;
    }
    $("#board").width(size);
    $("#board").height(size);
    
    $("#promotionLayer, #dots, #lettersNumbers").attr("width", size);
    $("#promotionLayer, #dots, #lettersNumbers").attr("height", size);
    $("#promotionLayer, #dots, #lettersNumbers").css("top", $("#board").position().top);
    $("#promotionLayer, #dots, #lettersNumbers").css("left", $("#board").position().left);

    /* $("#dots").attr("width", size);
    $("#dots").attr("height", size);
    $("#dots").css("top", $("#board").position().top);
    $("#dots").css("left", $("#board").position().left);
    
    $("#lettersNumbers").attr("width", size);
    $("#lettersNumbers").attr("height", size);
    $("#lettersNumbers").css("top", $("#board").position().top);
    $("#lettersNumbers").css("left", $("#board").position().left); */
}