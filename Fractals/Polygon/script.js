window.location = "https://einarkl.no" + location.pathname;
let svg;
let interval;
let w, h;

$(() => {
    $("#poly").css("width", "50vw");
    w = $("#poly").width();
    h = w;
    $("#poly").css("height", "50vw");

    $("#inpN").val(3);
    $("#inpK").val(10000);
});

function drawPoly() {
    clearPoly();
    let n = parseInt($("#inpN").val());

    let angle = ((n-2)*180)/n;
    let length = 2*w/n;
    
    p0 = [0.5*w + 0.5*length, 0, 0];
    let points = [];
    points.push(p0);

    for (let i = 1; i < n; i++) {
        let al = i === 1 ? 180 : (points[i-1][2] + 180 - angle);
        let p = [points[i-1][0]+(Math.cos(al*Math.PI/180) * length), points[i-1][1]-(Math.sin(al*Math.PI/180) * length), al];
        points.push(p);
    }

    let ps = [];
    
    for (let p of points) {
        ps.push(p[0] + "," + p[1]);
    }
    
    let poly = document.createElementNS('http://www.w3.org/2000/svg', "polygon");
    $(poly).attr("points", ps.join(" "));
    $(poly).attr("style", "fill:white;stroke:black;stroke-width:1");

    $("#poly").append(poly);

    fillPoly(p0, points);
}

function fillPoly(p0, points) {
    let prevPoint;
    const n = $("#inpN").val();
    const k = $("#inpK").val();

    for (let i = 0; i <= k; i++) {
        if (i === 0) {
            let p = p0;
            prevPoint = p;
        }
        else {
            let cp = points[Math.floor(Math.random() * n)];
            let p = [(cp[0] + prevPoint[0]) / 2.0, (cp[1] + prevPoint[1]) / 2.0];

            drawPoint(p);
            prevPoint = p;
        }
    }
}

function drawPoint(p) {
    let c = document.createElementNS('http://www.w3.org/2000/svg','circle');
    $(c).attr('cx', p[0]);
    $(c).attr('cy', p[1]);
    $(c).attr('r', 1);
    $(c).attr('fill', "black");
    $("#poly").append(c);
}

function drawCorners() {
    for (let p of points) {
        drawPoint(p);
    }
}

function drawEdges() {
    let poly = document.createElementNS('http://www.w3.org/2000/svg', "polygon");
    $(poly).attr("points", points[0].join(",")+" "+points[1].join(",")+" "+points[2].join(",")+" "+points[3].join(","));
    $(poly).attr("style", "fill:white;stroke:black;stroke-width:1");

    $("#square").append(poly);
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

function drawTriangle(k) {
    let prevPoint;

    for (let i = 0; i < k; i++) {
        if (i === 0) {
            let p = [Math.random()*w, Math.random()*w];
            if (insideTriangle(p)) {
                prevPoint = p;
            }
            else {
                i--;
            }
        }
        else {
            let cp = points[Math.floor(Math.random() * 4)];
            let p = [(cp[0] + prevPoint[0]) / 2.0, (cp[1] + prevPoint[1]) / 2.0];

            drawPoint(p);
            prevPoint = p;
        }
    }
}

function clearPoly() {
    $("#poly").empty();
}

function insideTriangle(p) {
    let p1 = points[0];
    let p2 = points[1];
    let p3 = points[2];

    let A = getArea(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
    let A1 = getArea(p[0], p[1], p2[0], p2[1], p3[0], p3[1]);
    let A2 = getArea(p1[0], p1[1], p[0], p[1], p3[0], p3[1]);
    let A3 = getArea(p1[0], p1[1], p2[0], p2[1], p[0], p[1]);

    return (A === A1 + A2 + A3);
}

function getArea(x1, y1, x2, y2, x3, y3) {
    return Math.abs((x1*(y2-y3) + x2*(y3-y1)+ x3*(y1-y2)) / 2.0);
}

function generateFast() {
    clearInterval(interval);
    let k  = $("#inpK").val();

    clearTriangle();
    drawTriangle(k);
}

function generateSlow() {
    clearInterval(interval);
    clearTriangle();

    const k = parseInt($("#inpK").val());
    const ms = 5000;
    let i = 0;
    let prevPoint = [w*0.5, w*0.5];
    
    while (i === 0) {
        let p = [Math.random()*w, Math.random()*w];
        if (insideTriangle(p)) {
            prevPoint = p;
            i++;
        }
        else {
            i--;
        }
    }
    interval = setInterval(() => {
        if (i <= k) {
            let cp = points[Math.floor(Math.random() * 4)];
            let p = [(cp[0] + prevPoint[0]) / 4.0, (cp[1] + prevPoint[1]) / 4.0];

            drawPoint(p);
            prevPoint = p;
            i++;
        }
        else {
            clearInterval(interval);
        }
    }, ms/k);
}