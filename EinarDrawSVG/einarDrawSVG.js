window.location = "https://einarkl.no" + location.pathname;
export function drawRect(svgID, x, y, width, height, rx = 0, ry = rx, fill = "none", stroke = "black", strokeWidth = "1") {
    let rect = document.createElementNS('http://www.w3.org/2000/svg', "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("style", "fill:"+fill+";stroke:"+stroke+";stroke-width:"+strokeWidth+";rx:"+rx+";ry:"+ry+";");

    document.getElementById(svgID).append(rect);
}

export function drawCircle(svgID, cx, cy, r, fill = "none", stroke = "black", strokeWidth = "1") {
    let circle = document.createElementNS('http://www.w3.org/2000/svg', "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", r);
    circle.setAttribute("style", "fill:"+fill+";stroke:"+stroke+";stroke-width:"+strokeWidth);

    document.getElementById(svgID).append(circle);
}

export function drawPoly(svgID, points, fill = "none", stroke = "black", strokeWidth = "1") {
    let poly = document.createElementNS('http://www.w3.org/2000/svg', "polygon");
    poly.setAttribute("points", points);
    poly.setAttribute("style", "fill:"+fill+";stroke:"+stroke+";stroke-width:"+strokeWidth);

    document.getElementById(svgID).append(poly);
}

export function clear(svgID) {
    document.getElementById(svgID).innerHTML = "";
}