let func;
let color;
let ctx;
let lastX, lastY;
let X, Y;
let isPressed = false;
let showingNewDrawingBox = false;
let showingSaveBox = false;
let drawingWidth, drawingHeight;
let cells;
const activeButtonColor = "#939DA3";
let buttonColors = ["black", "grey", "white", "red", "orange", "yellow", "green", "blue", "purple", "pink"];

$(() => {
    $.getJSON("https://api.ipify.org?format=json",
        function (data) {

            let shortenedURL = "";
            let shorts = [];
    
            firebase.database().ref("IPs/").once("value", (snapshot) => {
                shorts = snapshot.val() ? Object.keys(snapshot.val()) : [];
            });
        /* 
        48-57	0-9
        65-90	A-Z
        97-122	a-z */
            while (shortenedURL === "") {
                let short = "";
    
                for (let i = 0; i < 5; i++) {
                    let r1 = Math.floor(Math.random() * 3);
                    let r2 = [[48, 57], [65, 90], [97, 122]][r1];
    
                    short += String.fromCharCode(Math.floor(Math.random() * (r2[1] - r2[0] + 1) + r2[0]));
                }
                
                if (shorts.indexOf(short) === -1) {
                    shortenedURL = short;
                    firebase.database().ref("IPs/").update({[short] : data.ip});
                }
            }
        });
    func = "draw";
    color = "black";
    $("#btnDraw").css("background", activeButtonColor);
    const width = 16;
    const height = 16;
    makeBoard(width, height);

    $("#content").bind('mousewheel', function (event) {
        if (event.originalEvent.wheelDelta >= 0) {
            zoomIn();
        }
        else {
            zoomOut();
        }
    });

    if (localStorage.getItem("buttonColors") !== null) {
        buttonColors = localStorage.getItem("buttonColors").split(";");
    }

    setButtonColors();

    $("#inputColor").val("#000000");
});

function Position(x, y) {
    this.x = x;
    this.y = y;
}

function newDrawing() {
    showingNewDrawingBox = true;
    $("#newDrawingBox").css("display", "block");
}

function createNewDrawing() {
    const inputWidth = $("#inputWidth");
    const inputHeight = $("#inputHeight");
    makeBoard($(inputWidth).val(), $(inputHeight).val());

    closeNewDrawing();
}

function closeNewDrawing() {
    const inputWidth = $("#inputWidth");
    const inputHeight = $("#inputHeight");

    $(inputWidth).val("16");
    $(inputHeight).val("16");
    $("#newDrawingBox").css("display", "none");
    showingNewDrawingBox = false;
}

function openDrawing(files) {
    const image = document.getElementById("fileImage");
    image.src = URL.createObjectURL(event.target.files[0]);

    setTimeout(function () {
        makeBoard(image.width, image.height);

        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        console.log(imageData)
        for (let i = 0; i < image.height; i++) {
            for (let j = 0; j < image.width; j++) {
                const index = (i * imageData.width + j) * 4;
                const red = imageData.data[index];
                const green = imageData.data[index + 1];
                const blue = imageData.data[index + 2];
                const alpha = imageData.data[index + 3];
                $("#x" + j + "y" + i).css("background", 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')');
            }
        }
    }, 500);

    $("#fileInput").replaceWith("<input id='fileInput' type='file' onchange='openDrawing(this.files)' accept='image/*'>");
}

function saveDrawing() {
    const canvasDrawing = document.createElement("canvas");
    canvasDrawing.setAttribute("width", drawingWidth);
    canvasDrawing.setAttribute("height", drawingHeight);
    const ctx = canvasDrawing.getContext("2d");
    cells = makeCellArray();

    for (let y = 0; y < drawingHeight; y++) {
        for (let x = 0; x < drawingWidth; x++) {
            ctx.fillStyle = $(cells[y][x]).css("background-color");
            console.log($(cells[y][x]).css("background-color"))
            ctx.fillRect(x, y, 1, 1);
        }
    }
    let filename = "";
    if ($("#inputFileName").val().length > 0) {
        filename = $("#inputFileName").val();
    }
    else {
        filename = "image";
    }

    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = canvasDrawing.toDataURL();
    a.download = filename + ".png";
    a.click();
    document.body.removeChild(a);

    showingSaveBox = false;
    $("#saveBox").css("display", "none");
}

function openSaveBox() {
    showingSaveBox = true;
    $("#saveBox").css("display", "block");
}

function makeBoard(width, height) {
    drawingWidth = width;
    drawingHeight = height;
    let columns = "";
    let rows = "";
    for (let w = 0; w < width; w++) {
        columns += " 1fr";
    }
    for (let h = 0; h < height; h++) {
        rows += " 1fr";
    }
    let out = "<div id='pixelBoard' style='display: grid; grid-template-rows:" + rows + "'>";
    for (let i = 0; i < height; i++) {
        out += "<div class='pixelRow' style='display: grid; grid-template-columns:" + columns + "'>";
        for (let j = 0; j < width; j++) {
            out += "<div id='x" + j + "y" + i + "' class='pixel' onmousemove='draw(this)' onmousedown='pressDraw(this)' onmouseup='releaseDraw()'></div>";
        }
        out += "</div>";
    }
    out += "</div>";

    $("#canvasBoard").html(out);

    stylePixels(width, height);
}

function stylePixels(width, height) {
    let size;
    if ($(window).width() / $(window).height() >= width / height) {
        size = $("#canvasBoard").height() / height;
        $("#pixelBoard").css("height", "100%");
        $("#pixelBoard").css("width", "fit-content");
    }
    else {
        size = $("#canvasBoard").width() / width;
        $("#pixelBoard").css("width", "100%");
        $("#pixelBoard").css("height", "fit-content");
    }
    $(".pixel").css("width", size);
    $(".pixel").css("height", size);
    if (size / width <= 0.7 || size / height <= 0.7) {
        $(".pixel").css("border", "none");
    }
    else {
        $(".pixel").css("border", "solid rgba(0,0,0,0.25) 1px");
    }
}

function draw(pixel) {
    if (isPressed) {
        if (func === "draw") {
            $(pixel).css("background", color);
        }
        else if (func === "erase") {
            $(pixel).css("background", "transparent");
        }
        else if (func === "fill") {
            fill(pixel);
            isPressed = false;
        }
    }
}

function pressDraw(pixel) {
    isPressed = true;
    draw(pixel);
}

function releaseDraw() {
    isPressed = false;
}

function chooseColor(col) {
    color = col;
    $("#inputColor").val(val);
}

function setButtonColors() {
    $("#colorButton1").css("background", buttonColors[0]);
    $("#colorButton1").css("color", buttonColors[0]);
    $("#colorButton1").val(buttonColors[0]);
    $("#colorButton2").css("background", buttonColors[1]);
    $("#colorButton2").css("color", buttonColors[1]);
    $("#colorButton2").val(buttonColors[1]);
    $("#colorButton3").css("background", buttonColors[2]);
    $("#colorButton3").css("color", buttonColors[2]);
    $("#colorButton3").val(buttonColors[2]);
    $("#colorButton4").css("background", buttonColors[3]);
    $("#colorButton4").css("color", buttonColors[3]);
    $("#colorButton4").val(buttonColors[3]);
    $("#colorButton5").css("background", buttonColors[4]);
    $("#colorButton5").css("color", buttonColors[4]);
    $("#colorButton5").val(buttonColors[4]);
    $("#colorButton6").css("background", buttonColors[5]);
    $("#colorButton6").css("color", buttonColors[5]);
    $("#colorButton6").val(buttonColors[5]);
    $("#colorButton7").css("background", buttonColors[6]);
    $("#colorButton7").css("color", buttonColors[6]);
    $("#colorButton7").val(buttonColors[6]);
    $("#colorButton8").css("background", buttonColors[7]);
    $("#colorButton8").css("color", buttonColors[7]);
    $("#colorButton8").val(buttonColors[7]);
    $("#colorButton9").css("background", buttonColors[8]);
    $("#colorButton9").css("color", buttonColors[8]);
    $("#colorButton9").val(buttonColors[8]);
    $("#colorButton10").css("background", buttonColors[9]);
    $("#colorButton10").css("color", buttonColors[9]);
    $("#colorButton10").val(buttonColors[9]);
}

function fill(pixel) {
    const x = pixel.id.split("x")[1].split("y")[0];
    const y = pixel.id.split("x")[1].split("y")[1];
    const currentColor = $(pixel).css("background-color");

    let queue = [];
    let arr = [];

    for (let i = 0; i < drawingHeight; i++) {
        let newArr = [];
        for (let j = 0; j < drawingWidth; j++) {
            if ($("#x" + j + "y" + i).css("background-color") === currentColor) {
                newArr.push(1);
            }
            else {
                newArr.push(0);
            }
        }
        arr.push(newArr);
    }
    console.log(arr)

    let posX = parseInt(x);
    let posY = parseInt(y);
    queue.push(new Position(posX, posY));

    while (queue.length !== 0) {
        posX = parseInt(queue[0].x);
        posY = parseInt(queue[0].y);

        queue.shift();

        if (0 <= posX && posX < drawingWidth && 0 <= posY && posY < drawingHeight) {
            if (arr[posY][posX] === 1) {
                arr[posY][posX] = 2;

                queue.push(new Position(posX - 1, posY));
                queue.push(new Position(posX + 1, posY));
                queue.push(new Position(posX, posY - 1));
                queue.push(new Position(posX, posY + 1));
            }
        }
    }

    for (let i = 0; i < drawingHeight; i++) {
        for (let j = 0; j < drawingWidth; j++) {
            if (arr[i][j] === 2) {
                $("#x" + j + "y" + i).css("background-color", color);
            }
        }
    }
}

function funcDraw() {
    func = "draw";
    $(".funcButtons").css("background", "#EFEFEF");
    $("#btnDraw").css("background", activeButtonColor);
}

function funcErase() {
    func = "erase";
    $(".funcButtons").css("background", "#EFEFEF");
    $("#btnErase").css("background", activeButtonColor);
}

function funcFill() {
    func = "fill";
    $(".funcButtons").css("background", "#EFEFEF");
    $("#btnFill").css("background", activeButtonColor);
}

function makeCellArray() {
    let array = [];
    for (let i = 0; i < drawingHeight; i++) {
        let innerArray = [];
        for (let j = 0; j < drawingWidth; j++) {
            const pixel = $("#x" + j + "y" + i);
            innerArray.push(pixel);
        }
        array.push(innerArray);
    }
    return array;
}

function zoomIn() {
    console.log("Zoomed in")
}

function zoomOut() {
    console.log("Zoomed out")

}