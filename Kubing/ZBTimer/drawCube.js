function drawBnW(context, contextSize, allMoves) {
    drawScrambleArray = allMoves.split(" ");

    r1 = "grey", r2 = "grey", r3 = "grey", r4 = "grey", r5 = "grey", r6 = "grey", r7 = "grey", r8 = "grey", r9 = "grey";
    l1 = "grey", l2 = "grey", l3 = "grey", l4 = "grey", l5 = "grey", l6 = "grey", l7 = "grey", l8 = "grey", l9 = "grey";
    f1 = "grey", f2 = "grey", f3 = "grey", f4 = "grey", f5 = "grey", f6 = "grey", f7 = "grey", f8 = "grey", f9 = "grey";
    b1 = "grey", b2 = "grey", b3 = "grey", b4 = "grey", b5 = "grey", b6 = "grey", b7 = "grey", b8 = "grey", b9 = "grey";
    u1 = "white", u2 = "white", u3 = "white", u4 = "white", u5 = "white", u6 = "white", u7 = "white", u8 = "white", u9 = "white";
    d1 = "grey", d2 = "grey", d3 = "grey", d4 = "grey", d5 = "grey", d6 = "grey", d7 = "grey", d8 = "grey", d9 = "grey";

    for (var i = 0; i < drawScrambleArray.length; i++) {
        switch (drawScrambleArray[i]) {
            case "R":
                _r();
                break;
            case "R2":
            case "R2'":
                _r2();
                break;
            case "R'":
                _ri();
                break;
            case "L":
                _l();
                break;
            case "L2":
            case "L2'":
                _l2();
                break;
            case "L'":
                _li();
                break;
            case "F":
                _f();
                break;
            case "F2":
            case "F2'":
                _f2();
                break;
            case "F'":
                _fi();
                break;
            case "B":
                _b();
                break;
            case "B2":
            case "B2'":
                _b2();
                break;
            case "B'":
                _bi();
                break;
            case "U":
                _u();
                break;
            case "U2":
            case "U2'":
                _u2();
                break;
            case "U'":
                _ui();
                break;
            case "D":
                _d();
                break;
            case "D2":
            case "D2'":
                _d2();
                break;
            case "D'":
                _di();
                break;
            case "x":
                _x();
                break;
            case "x2":
            case "x2'":
                _x2();
                break;
            case "x'":
                _xi();
                break;
            case "y":
                _y();
                break;
            case "y2":
            case "y2'":
                _y2();
                break;
            case "y'":
                _yi();
                break;
            case "z":
                _z();
                break;
            case "z2":
            case "z2'":
                _z2();
                break;
            case "z'":
                _zi();
                break;
            case "M":
                _m();
                break;
            case "M2":
            case "M2'":
                _m2();
                break;
            case "M'":
                _mi();
                break;
            case "S":
                _s();
                break;
            case "S2":
            case "S2'":
                _s2();
                break;
            case "S'":
                _si();
                break;
            case "E":
                _e();
                break;
            case "E2":
            case "E2'":
                _e2();
                break;
            case "E'":
                _ei();
                break;
            case "Uw":
                _uw();
                break;
            case "Uw2":
            case "Uw2'":
                _uw2();
                break;
            case "Uw'":
                _uwi();
                break;
            case "Dw":
                _dw();
                break;
            case "Dw2":
            case "Dw2'":
                _dw2();
                break;
            case "Dw'":
                _dwi();
                break;
            case "Fw":
                _fw();
                break;
            case "Fw2":
            case "Fw2'":
                _fw2();
                break;
            case "Fw'":
                _fwi();
                break;
            case "Bw":
                _bw();
                break;
            case "Bw2":
            case "Bw2'":
                _bw2();
                break;
            case "Bw'":
                _bwi();
                break;
            case "Rw":
                _rw();
                break;
            case "Rw2":
            case "Rw2'":
                _rw2();
                break;
            case "Rw'":
                _rwi();
                break;
            case "Lw":
                _lw();
                break;
            case "Lw2":
            case "Lw2'":
                _lw2();
                break;
            case "Lw'":
                _lwi();
                break;
        }
    }

    updateBnW(context, contextSize);
}

function updateBnW(context, contextSize) {
    const ctxSize = (contextSize/1.2)/5;
    const ctxGap = ctxSize/10;

    const up = [u1,u2,u3,u4,u5,u6,u7,u8,u9];
    const left = [l1,l2,l3];
    const right = [r1,r2,r3];
    const front = [f1,f2,f3];
    const back = [b1,b2,b3];

    context.fillStyle = "#414141";
    context.fillRect(ctxSize+ctxGap, 0, 3*ctxSize+4*ctxGap, 5*ctxSize+6*ctxGap);
    context.fillRect(0, ctxSize+ctxGap, 5*ctxSize+6*ctxGap, 3*ctxSize+4*ctxGap);

    let index = 0;
    for (let j = ctxSize+2*ctxGap; j < 4*(ctxSize+ctxGap); j += ctxSize+ctxGap) {
        for (let i = ctxSize+2*ctxGap; i < 4*(ctxSize+ctxGap); i += ctxSize+ctxGap) {
            context.fillStyle = up[index];
            context.fillRect(i, j, ctxSize, ctxSize);
            index++;
        }
    }
    index = back.length-1;
    for (let i = ctxSize+2*ctxGap; i < 4*(ctxSize+ctxGap); i += ctxSize+ctxGap) {
        context.fillStyle = back[index];
        context.fillRect(i, ctxGap, ctxSize, ctxSize);
        index--;
    }
    index = 0;
    for (let i = ctxSize+2*ctxGap; i < 4*(ctxSize+ctxGap); i += ctxSize+ctxGap) {
        context.fillStyle = front[index];
        context.fillRect(i, 4*ctxSize+5*ctxGap, ctxSize, ctxSize);
        index++;
    }
    index = 0;
    for (let j = ctxSize+2*ctxGap; j < 4*(ctxSize+ctxGap); j += ctxSize+ctxGap) {
        context.fillStyle = left[index];
        context.fillRect(ctxGap, j, ctxSize, ctxSize);
        index++;
    }
    index = right.length-1;
    for (let j = ctxSize+2*ctxGap; j < 4*(ctxSize+ctxGap); j += ctxSize+ctxGap) {
        context.fillStyle = right[index];
        context.fillRect(4*ctxSize+5*ctxGap, j, ctxSize, ctxSize);
        index--;
    }
}