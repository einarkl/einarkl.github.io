const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const board = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0]
];

const pieces = [
    [
        [1,0,0],
        [1,0,0],
        [1,1,1]
    ],
    [
        [2,2,0],
        [0,2,0],
        [0,2,2]
    ],
    [
        [3,3,3],
        [3,3,3]
    ],
    [
        [4,4,4],
        [4,0,4]
    ],
    [
        [0,5,5],
        [5,5,5]
    ],
    [
        [6,6,6,6],
        [6,0,0,0]
    ],
    [
        [7,7,7,7],
        [0,7,0,0]
    ],
    [
        [0,8,8,8],
        [8,8,0,0]
    ]
];

const allPieces = {};

$(() => {
    initSelOpt();
    drawBoard();
});

function initSelOpt() {
    for (let m of months) {
        $("#selMonth").append("<option value='" + m + "'>" + m + "</option>");
    }
    for (let i = 0; i < 31; i++) {
        $("#selDay").append("<option value='" + i + "'>" + (i + 1) + "</option>");
    }
}

function resetBoard() {
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            board[y][x] = 0;
        }
    }
    drawBoard();
}

function drawBoard() {
    $("#board").empty();
    let colors = ["#9c7846", "#ff5b5b", "#ffc164", "#ffff6e", "#9eff80", "#a6fcff", "#74beff", "#d27eff", "#ff7fbb", "#453013"];
    let fill = "#9c7846";
    let size = $("#board").height() / 8;
    let fontsize = $("#board").height() / 20;
    let stroke = "#000";
    let strokeWidth = 1;

    let coordinates = getCoordinates();
    let my = coordinates[0][0];
    let mx = coordinates[0][1];
    let dy = coordinates[1][0];
    let dx = coordinates[1][1];

    let bgrect = document.createElementNS('http://www.w3.org/2000/svg', "rect");
    $(bgrect).attr("x", 0);
    $(bgrect).attr("y", 0);
    $(bgrect).attr("width", $("#board").width());
    $(bgrect).attr("height", $("#board").width());
    $(bgrect).attr("style", "fill:"+"#453013"+";stroke:"+stroke+";stroke-width:"+strokeWidth);

    $("#board").append(bgrect);

    for (let y in board) {
        for (let x in board[y]) {
            fill = colors[board[y][x]];
            let id = getBoardValue(y, x);
            let rect = document.createElementNS('http://www.w3.org/2000/svg', "rect");
            let txt = document.createElementNS('http://www.w3.org/2000/svg', "text");
            const rectX = x * size + size / 2;
            const rectY = y * size + size / 2;
            $(rect).attr("id", id);
            $(rect).attr("x", rectX);
            $(rect).attr("y", rectY);
            $(rect).attr("width", size);
            $(rect).attr("height", size);
            $(rect).attr("style", "fill:"+fill+";stroke:"+stroke+";stroke-width:"+strokeWidth);

            $("#board").append(rect);

            if (board[y][x] == 0 || board[y][x] == 9) {
                $(txt).attr("text-anchor", "middle");
                $(txt).attr("dominant-baseline", "middle");
                $(txt).attr("x", rectX + size / 2);
                $(txt).attr("y", rectY + size / 2);
                $(txt).attr("fill", "#000");
                $(txt).attr("font-size", fontsize);
                $(txt).text(id);

                $("#board").append(txt);
            }
        }
    }
}

function getBoardValue(y, x) {
    y = parseInt(y);
    x = parseInt(x);

    if (y < 2) {
        return months[x + 6 * y];
    }
    else {
        return x + 1 + 7 * (y - 2);
    }
}

function getCoordinates(m = null, d = null) {
    let coordinateMY, coordinateMX, coordinateDY, coordinateDX;

    m = m == null ? $("#selMonth").val() : m;
    d = d == null ? $("#selDay").val() : d;

    coordinateMY = Math.floor(months.indexOf(m) / 6);
    coordinateMX = months.indexOf(m) % 6;

    coordinateDY = Math.floor(d / 7) + 2;
    coordinateDX = d % 7;

    return [[coordinateMY, coordinateMX], [coordinateDY, coordinateDX]];
}

function rotate(piece) {
    let newPiece = [];
    for (let x = 0; x < piece[0].length; x++) {
        let newRow = [];
        for (let y = piece.length - 1; y >= 0; y--) {
            newRow.push(piece[y][x]);
        }
        newPiece.push(newRow);
    }
    return newPiece;
}

function flip(piece) {
    let newPiece = [];
    for (let y = 0; y < piece.length; y++) {
        let newRow = [];
        for (let x = piece[y].length - 1; x >= 0; x--) {
            newRow.push(piece[y][x]);
        }
        newPiece.push(newRow);
    }
    return newPiece;
}

function getPieceOrientations(piece) {
    let orientations = [];
    let current = piece;
    for (let i = 0; i < 4; i++) {
        orientations.push(current);
        orientations.push(flip(current));
        current = rotate(current);
    }
    return orientations;
}


function getAllPieceOrientations() {
    // rotate and flip pieces, and store them in allPieces, skipping duplicates
    for (let piece of pieces) {
        let orientations = getPieceOrientations(piece);
        for (let orientation of orientations) {
            let key = JSON.stringify(orientation);
            if (!allPieces[key]) {
                allPieces[key] = orientation;
            }
        }
    }
}
function canPlacePiece(piece, y, x) {
    for (let py in piece) {
        for (let px in piece[py]) {
            if (y + parseInt(py) >= board.length || x + parseInt(px) >= board[0].length || y + parseInt(py) < 0 || x + parseInt(px) < 0) {
                return false;
            }
            else if (piece[py][px] != 0 && board[y + parseInt(py)][x + parseInt(px)] != 0) {
                return false;
            }
        }
    }
    return true;
}

function solve() {
    resetBoard();

    const coords = getCoordinates();
    const [monthCoord, dayCoord] = coords;

    board[monthCoord[0]][monthCoord[1]] = 9;
    board[dayCoord[0]][dayCoord[1]] = 9;

    const pieceIndexOrder = pieces
        .map((piece, idx) => ({ piece, idx, area: piece.flat().filter(v => v !== 0).length }))
        .sort((a, b) => b.area - a.area);

    const pieceOrientations = pieceIndexOrder.map(item => {
        const orientations = getPieceOrientations(item.piece)
            .map(o => JSON.stringify(o))
            .filter((value, index, self) => self.indexOf(value) === index)
            .map(json => JSON.parse(json));
        return {
            id: item.idx + 1,
            orientations,
        };
    });

    function canPlace(piece, y, x) {
        for (let py = 0; py < piece.length; py++) {
            for (let px = 0; px < piece[py].length; px++) {
                if (piece[py][px] === 0) continue;

                const ty = y + py;
                const tx = x + px;

                if (ty < 0 || ty >= board.length) return false;
                if (tx < 0 || tx >= board[ty].length) return false;
                if (board[ty][tx] !== 0) return false;
            }
        }
        return true;
    }

    function place(piece, y, x) {
        for (let py = 0; py < piece.length; py++) {
            for (let px = 0; px < piece[py].length; px++) {
                if (piece[py][px] === 0) continue;
                board[y + py][x + px] = piece[py][px];
            }
        }
    }

    function unplace(piece, y, x) {
        for (let py = 0; py < piece.length; py++) {
            for (let px = 0; px < piece[py].length; px++) {
                if (piece[py][px] === 0) continue;
                board[y + py][x + px] = 0;
            }
        }
    }

    function backtrack(pieceIdx) {
        if (pieceIdx >= pieceOrientations.length) {
            return true;
        }

        const { orientations } = pieceOrientations[pieceIdx];

        for (const orientation of orientations) {
            for (let y = 0; y < board.length; y++) {
                for (let x = 0; x < board[y].length; x++) {
                    if (!canPlace(orientation, y, x)) continue;

                    place(orientation, y, x);
                    if (backtrack(pieceIdx + 1)) {
                        return true;
                    }
                    unplace(orientation, y, x);
                }
            }
        }

        return false;
    }

    const solved = backtrack(0);

    if (!solved) {
        alert("No solution found for this date selection.");
    } else {
        console.log("Solution found:");
        for (let y = 0; y < board.length; y++) {
            console.log(board[y].map(v => (v === 0 ? "." : v)).join(" "));
        }
        console.log("Raw board data:", board);
    }

    drawBoard();
}