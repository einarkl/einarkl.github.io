window.location = "https://einarkl.no" + location.pathname;
let w, h;
let interval;
let length;
let depth;
let points, nPoints;
let multiplier;

$(() => {
    $("#tree").css("width", "100vw");
    $("#tree").css("height", "90vh");

    w = $("#tree").width();
    h = $("#tree").height();

    points = [];
    nPoints = [];
    $("#inpK").val(10);
    $("#rangeAngle").val(30);
    $("#rangeMulti").val(0.8);
    setDepth();
    setAngle();
    setMulti();
});

function setDepth() {
    $("#lblDepth").text($("#inpK").val());
}

function setAngle() {
    $("#lblAngle").text($("#rangeAngle").val() + "°");
}

function setMulti() {
    multiplier = parseFloat($("#rangeMulti").val());
    $("#lblMulti").text($("#rangeMulti").val());
}

function drawBranch(p0, dir) {
    let angle = parseInt($("#rangeAngle").val());
    let p;
    let al =  p0[2] + angle;
    let ar =  p0[2] - angle;

    let pl = [p0[0]+(Math.cos(al*Math.PI/180) * length), p0[1]-(Math.sin(al*Math.PI/180) * length), al];
    let pr = [p0[0]+(Math.cos(ar*Math.PI/180) * length), p0[1]-(Math.sin(ar*Math.PI/180) * length), ar];
    
    if (dir === 0) {
        p = [p0[0], p0[1] - length, p0[2]];
    }
    else if (dir === 1) {
        p = pl;
    }
    else if (dir === 2) {
        p = pr;
    }

    nPoints.push(p);

    let line = document.createElementNS('http://www.w3.org/2000/svg', "line");
    $(line).attr("x1", p0[0]);
    $(line).attr("y1", p0[1]);
    $(line).attr("x2", p[0]);
    $(line).attr("y2", p[1]);
    $(line).attr("style", "stroke:black;stroke-width:1");

    $("#tree").append(line);
}

function drawTree(k) {
    clearTree();
    for (let i = 0; i < k; i++) {
        depth = i;
        if (i === 0) {
            let p = [0.5*w, h, 90];
            drawBranch(p, 0);
        }
        else {
            points = nPoints.slice();
            nPoints = [];

            length *= multiplier;

            for (let p of points) {
                drawBranch(p, 1);
                drawBranch(p, 2);
            }
        }
    }
}

function clearTree() {
    $("#tree").empty();
    length = h / 5;

    points = [];
    nPoints = [];
}

function generateFast() {
    clearInterval(interval);
    let k  = parseInt($("#inpK").val());

    clearTree();
    drawTree(k);
}

function generateSlow() {
    clearInterval(interval);
    clearTree();

    const k = parseInt($("#inpK").val());
    const ms = 5000;
    let i = 0;
    
    interval = setInterval(() => {
        depth = i;
        if (i <= k) {
            if (i === 0) {
                let p = [0.5*w, h, 90];
                drawBranch(p, 0);
            }
            else {
                points = nPoints.slice();
                nPoints = [];
    
                length *= multiplier;
    
                for (let p of points) {
                    drawBranch(p, 1);
                    drawBranch(p, 2);
                }
            }
            i++;
        }
        else {
            clearInterval(interval);
        }
    }, ms/k);
}