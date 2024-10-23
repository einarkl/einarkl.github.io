window.location = "https://einarkl.no" + location.pathname;
let cubeState = [];
let drawScrambleArray = [];
let gap = 3;
let displayWidth = $("#cubeCanvas").width();
let size = Math.floor((displayWidth-6*gap) / 5);
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

function _r() {
    nf1 = f1; nf2 = f2; nf3 = f3; nf4 = f4; nf6=f6; nf7=f7; nf8=f8; nf9=f9;
    nb1 = b1; nb2 = b2; nb3 = b3; nb4 = b4; nb6=b6; nb7=b7; nb8=b8; nb9=b9;
    nr1 = r1; nr2 = r2; nr3 = r3; nr4 = r4; nr6=r6; nr7=r7; nr8=r8; nr9=r9;
    nl1 = l1; nl2 = l2; nl3 = l3; nl4 = l4; nl6=l6; nl7=l7; nl8=l8; nl9=l9;
    nu1 = u1; nu2 = u2; nu3 = u3; nu4 = u4; nu6=u6; nu7=u7; nu8=u8; nu9=u9;
    nd1 = d1; nd2 = d2; nd3 = d3; nd4 = d4; nd6=d6; nd7=d7; nd8=d8; nd9=d9;

    u3 = nf3; u6 = nf6; u9 = nf9;
    f3 = nd3; f6 = nd6; f9 = nd9;
    d3 = nb7; d6 = nb4; d9 = nb1;
    b7 = nu3; b4 = nu6; b1= nu9;
    r1 = nr7; r2 = nr4; r3 = nr1; r4 = nr8; r6 = nr2; r7 = nr9; r8 = nr6; r9 = nr3;
}
function _r2() {
    _r();
    _r();
}
function _ri() {
    _r();
    _r();
    _r();
}
function _l() {
    nf1 = f1; nf2 = f2; nf3 = f3; nf4 = f4; nf6=f6; nf7=f7; nf8=f8; nf9=f9;
    nb1 = b1; nb2 = b2; nb3 = b3; nb4 = b4; nb6=b6; nb7=b7; nb8=b8; nb9=b9;
    nr1 = r1; nr2 = r2; nr3 = r3; nr4 = r4; nr6=r6; nr7=r7; nr8=r8; nr9=r9;
    nl1 = l1; nl2 = l2; nl3 = l3; nl4 = l4; nl6=l6; nl7=l7; nl8=l8; nl9=l9;
    nu1 = u1; nu2 = u2; nu3 = u3; nu4 = u4; nu6=u6; nu7=u7; nu8=u8; nu9=u9;
    nd1 = d1; nd2 = d2; nd3 = d3; nd4 = d4; nd6=d6; nd7=d7; nd8=d8; nd9=d9;

    u1 = nb9; u4 = nb6; u7 = nb3;
    f1 = nu1; f4 = nu4; f7 = nu7;
    d1 = nf1; d4 = nf4; d7 = nf7;
    b9 = nd1; b6 = nd4; b3= nd7;
    l1 = nl7; l2 = nl4; l3 = nl1; l4 = nl8; l6 = nl2; l7 = nl9; l8 = nl6; l9 = nl3;
}
function _l2() {
    _l();
    _l();
}
function _li() {
    _l();
    _l();
    _l();
}
function _f() {
    nf1 = f1; nf2 = f2; nf3 = f3; nf4 = f4; nf6=f6; nf7=f7; nf8=f8; nf9=f9;
    nb1 = b1; nb2 = b2; nb3 = b3; nb4 = b4; nb6=b6; nb7=b7; nb8=b8; nb9=b9;
    nr1 = r1; nr2 = r2; nr3 = r3; nr4 = r4; nr6=r6; nr7=r7; nr8=r8; nr9=r9;
    nl1 = l1; nl2 = l2; nl3 = l3; nl4 = l4; nl6=l6; nl7=l7; nl8=l8; nl9=l9;
    nu1 = u1; nu2 = u2; nu3 = u3; nu4 = u4; nu6=u6; nu7=u7; nu8=u8; nu9=u9;
    nd1 = d1; nd2 = d2; nd3 = d3; nd4 = d4; nd6=d6; nd7=d7; nd8=d8; nd9=d9;

    u7 = nl9; u8 = nl6; u9 = nl3;
    r1 = nu7; r4 = nu8; r7 = nu9;
    d3 = nr1; d2 = nr4; d1 = nr7;
    l9 = nd3; l6 = nd2; l3 = nd1;
    f1 = nf7; f2 = nf4; f3 = nf1; f4 = nf8; f6 = nf2; f7 = nf9; f8 = nf6; f9 = nf3;
}
function _f2() {
    _f();
    _f();
}
function _fi() {
    _f();
    _f();
    _f();
}
function _b() {
    nf1 = f1; nf2 = f2; nf3 = f3; nf4 = f4; nf6=f6; nf7=f7; nf8=f8; nf9=f9;
    nb1 = b1; nb2 = b2; nb3 = b3; nb4 = b4; nb6=b6; nb7=b7; nb8=b8; nb9=b9;
    nr1 = r1; nr2 = r2; nr3 = r3; nr4 = r4; nr6=r6; nr7=r7; nr8=r8; nr9=r9;
    nl1 = l1; nl2 = l2; nl3 = l3; nl4 = l4; nl6=l6; nl7=l7; nl8=l8; nl9=l9;
    nu1 = u1; nu2 = u2; nu3 = u3; nu4 = u4; nu6=u6; nu7=u7; nu8=u8; nu9=u9;
    nd1 = d1; nd2 = d2; nd3 = d3; nd4 = d4; nd6=d6; nd7=d7; nd8=d8; nd9=d9;

    u1 = nr3; u2 = nr6; u3 = nr9;
    r3 = nd9; r6 = nd8; r9 = nd7;
    d9 = nl7; d8 = nl4; d7 = nl1;
    l1 = nu3; l4 = nu2; l7 = nu1;
    b1 = nb7; b2 = nb4; b3 = nb1; b4 = nb8; b6 = nb2; b7 = nb9; b8 = nb6; b9 = nb3;
}
function _b2() {
    _b();
    _b();
}
function _bi() {
    _b();
    _b();
    _b();
}
function _u() {
    nf1 = f1; nf2 = f2; nf3 = f3; nf4 = f4; nf6=f6; nf7=f7; nf8=f8; nf9=f9;
    nb1 = b1; nb2 = b2; nb3 = b3; nb4 = b4; nb6=b6; nb7=b7; nb8=b8; nb9=b9;
    nr1 = r1; nr2 = r2; nr3 = r3; nr4 = r4; nr6=r6; nr7=r7; nr8=r8; nr9=r9;
    nl1 = l1; nl2 = l2; nl3 = l3; nl4 = l4; nl6=l6; nl7=l7; nl8=l8; nl9=l9;
    nu1 = u1; nu2 = u2; nu3 = u3; nu4 = u4; nu6=u6; nu7=u7; nu8=u8; nu9=u9;
    nd1 = d1; nd2 = d2; nd3 = d3; nd4 = d4; nd6=d6; nd7=d7; nd8=d8; nd9=d9;

    l1 = nf1; l2 = nf2; l3 = f3;
    f1 = nr1; f2 = nr2; f3 = nr3;
    r1 = nb1; r2 = nb2; r3 = nb3;
    b1 = nl1; b2 = nl2; b3= nl3;
    u1 = nu7; u2 = nu4; u3 = nu1; u4 = nu8; u6 = nu2; u7 = nu9; u8 = nu6; u9 = nu3;
}
function _u2() {
    _u();
    _u();
}
function _ui() {
    _u();
    _u();
    _u();
}
function _d() {
    nf1 = f1; nf2 = f2; nf3 = f3; nf4 = f4; nf6=f6; nf7=f7; nf8=f8; nf9=f9;
    nb1 = b1; nb2 = b2; nb3 = b3; nb4 = b4; nb6=b6; nb7=b7; nb8=b8; nb9=b9;
    nr1 = r1; nr2 = r2; nr3 = r3; nr4 = r4; nr6=r6; nr7=r7; nr8=r8; nr9=r9;
    nl1 = l1; nl2 = l2; nl3 = l3; nl4 = l4; nl6=l6; nl7=l7; nl8=l8; nl9=l9;
    nu1 = u1; nu2 = u2; nu3 = u3; nu4 = u4; nu6=u6; nu7=u7; nu8=u8; nu9=u9;
    nd1 = d1; nd2 = d2; nd3 = d3; nd4 = d4; nd6=d6; nd7=d7; nd8=d8; nd9=d9;

    l7 = nb7; l8 = nb8; l9 = nb9;
    f7 = nl7; f8 = nl8; f9 = nl9;
    r7 = nf7; r8 = nf8; r9 = nf9;
    b7 = nr7; b8 = nr8; b9 = nr9;
    d1 = nd7; d2 = nd4; d3 = nd1; d4 = nd8; d6 = nd2; d7 = nd9; d8 = nd6; d9 = nd3;
}
function _d2() {
    _d();
    _d();
}
function _di() {
    _d();
    _d();
    _d();
}
function _x() {
    nf1 = f1; nf2 = f2; nf3 = f3; nf4 = f4; nf5 = f5; nf6=f6; nf7=f7; nf8=f8; nf9=f9;
    nb1 = b1; nb2 = b2; nb3 = b3; nb4 = b4; nb5 = b5; nb6=b6; nb7=b7; nb8=b8; nb9=b9;
    nr1 = r1; nr2 = r2; nr3 = r3; nr4 = r4; nr5 = r5; nr6=r6; nr7=r7; nr8=r8; nr9=r9;
    nl1 = l1; nl2 = l2; nl3 = l3; nl4 = l4; nl5 = l5; nl6=l6; nl7=l7; nl8=l8; nl9=l9;
    nu1 = u1; nu2 = u2; nu3 = u3; nu4 = u4; nu5 = u5; nu6=u6; nu7=u7; nu8=u8; nu9=u9;
    nd1 = d1; nd2 = d2; nd3 = d3; nd4 = d4; nd5 = d5; nd6=d6; nd7=d7; nd8=d8; nd9=d9;

    u1 = nf1; u2 = nf2; u3 = nf3; u4 = nf4; u5 = nf5; u6 = nf6; u7 = nf7; u8 = nf8; u9 = nf9;
    d1 = nb9; d2 = nb8; d3 = nb7; d4 = nb6; d5 = nb5; d6 = nb4; d7 = nb3; d8 = nb2; d9 = nb1;
    f1 = nd1; f2 = nd2; f3 = nd3; f4 = nd4; f5 = nd5; f6 = nd6; f7 = nd7; f8 = nd8; f9 = nd9;
    b1 = nu9; b2 = nu8; b3 = nu7; b4 = nu6; b5 = nu5; b6 = nu4; b7 = nu3; b8 = nu2; b9 = nu1;
    r1 = nr7; r2 = nr4; r3 = nr1; r4 = nr8; r6 = nr2; r7 = nr9; r8 = nr6; r9 = nr3;
    l1 = nl3; l2 = nl6; l3 = nl9; l4 = nl2; l6 = nl8; l7 = nl1; l8 = nl4; l9 = nl7;
}
function _x2() {
    _x();
    _x();
}
function _xi() {
    _x();
    _x();
    _x();
}
function _y() {
    nf1 = f1; nf2 = f2; nf3 = f3; nf4 = f4; nf5 = f5; nf6=f6; nf7=f7; nf8=f8; nf9=f9;
    nb1 = b1; nb2 = b2; nb3 = b3; nb4 = b4; nb5 = b5; nb6=b6; nb7=b7; nb8=b8; nb9=b9;
    nr1 = r1; nr2 = r2; nr3 = r3; nr4 = r4; nr5 = r5; nr6=r6; nr7=r7; nr8=r8; nr9=r9;
    nl1 = l1; nl2 = l2; nl3 = l3; nl4 = l4; nl5 = l5; nl6=l6; nl7=l7; nl8=l8; nl9=l9;
    nu1 = u1; nu2 = u2; nu3 = u3; nu4 = u4; nu5 = u5; nu6=u6; nu7=u7; nu8=u8; nu9=u9;
    nd1 = d1; nd2 = d2; nd3 = d3; nd4 = d4; nd5 = d5; nd6=d6; nd7=d7; nd8=d8; nd9=d9;

    u1 = nu7; u2 = nu4; u3 = nu1; u4 = nu8; u6 = nu2; u7 = nu9; u8 = nu6; u9 = nu3;
    d1 = nd3; d2 = nd6; d3 = nd9; d4 = nd2; d6 = nd8; d7 = nd1; d8 = nd4; d9 = nd7;
    l1 = nf1; l2 = nf2; l3 = nf3; l4 = nf4; l5 = nf5; l6 = nf6; l7 = nf7; l8 = nf8; l9 = nf9;
    f1 = nr1; f2 = nr2; f3 = nr3; f4 = nr4; f5 = nr5; f6 = nr6; f7 = nr7; f8 = nr8; f9 = nr9;
    r1 = nb1; r2 = nb2; r3 = nb3; r4 = nb4; r5 = nb5; r6 = nb6; r7 = nb7; r8 = nb8; r9 = nb9;
    b1 = nl1; b2 = nl2; b3 = nl3; b4 = nl4; b5 = nl5; b6 = nl6; b7 = nl7; b8 = nl8; b9 = nl9;
}
function _y2() {
    _y();
    _y();
}
function _yi() {
    _y();
    _y();
    _y();
}
function _z() {
    nf1 = f1; nf2 = f2; nf3 = f3; nf4 = f4; nf5 = f5; nf6=f6; nf7=f7; nf8=f8; nf9=f9;
    nb1 = b1; nb2 = b2; nb3 = b3; nb4 = b4; nb5 = b5; nb6=b6; nb7=b7; nb8=b8; nb9=b9;
    nr1 = r1; nr2 = r2; nr3 = r3; nr4 = r4; nr5 = r5; nr6=r6; nr7=r7; nr8=r8; nr9=r9;
    nl1 = l1; nl2 = l2; nl3 = l3; nl4 = l4; nl5 = l5; nl6=l6; nl7=l7; nl8=l8; nl9=l9;
    nu1 = u1; nu2 = u2; nu3 = u3; nu4 = u4; nu5 = u5; nu6=u6; nu7=u7; nu8=u8; nu9=u9;
    nd1 = d1; nd2 = d2; nd3 = d3; nd4 = d4; nd5 = d5; nd6=d6; nd7=d7; nd8=d8; nd9=d9;

    u1 = nl7; u2 = nl4; u3 = nl1; u4 = nl8; u5 = nl5; u6 = nl2; u7 = nl9; u8 = nl6; u9 = nl3;
    d1 = nr7; d2 = nr4; d3 = nr1; d4 = nr8; d5 = nr5; d6 = nr2; d7 = nr9; d8 = nr6; d9 = nr3;
    r1 = nu7; r2 = nu4; r3 = nu1; r4 = nu8; r5 = nu5; r6 = nu2; r7 = nu9; r8 = nu6; r9 = nu3;
    l1 = nd7; l2 = nd4; l3 = nd1; l4 = nd8; l5 = nd5; l6 = nd2; l7 = nd9; l8 = nd6; l9 = nd3;
    f1 = nf7; f2 = nf4; f3 = nf1; f4 = nf8; f6 = nf2; f7 = nf9; f8 = nf6; f9 = nf3;
    b1 = nb3; b2 = nb6; b3 = nb9; b4 = nb2; b6 = nb8; b7 = nb1; b8 = nb4; b9 = nb7;
}
function _z2() {
    _z();
    _z();
}
function _zi() {
    _z();
    _z();
    _z();
}
function _m() {
    _xi();
    _r();
    _li();
}
function _m2() {
    _m();
    _m();
}
function _mi() {
    _m();
    _m();
    _m();
}
function _s() {
    _z();
    _fi();
    _b();
}
function _s2() {
    _s();
    _s();
}
function _si() {
    _s();
    _s();
    _s();
}
function _e() {
    _yi();
    _u();
    _di();
}
function _e2() {
    _e();
    _e();
}
function _ei() {
    _e();
    _e();
    _e();
}
function _uw() {
    _u();
    _ei();
}
function _uw2() {
    _u2();
    _e2();
}
function _uwi() {
    _ui();
    _e();
}
function _dw() {
    _d();
    _e();
}
function _dw2() {
    _d2();
    _e2();
}
function _dwi() {
    _di();
    _ei();
}
function _fw() {
    _f();
    _s();
}
function _fw2() {
    _f2();
    _s2();
}
function _fwi() {
    _fi();
    _si();
}
function _bw() {
    _b();
    _si();
}
function _bw2() {
    _b2();
    _s2();
}
function _bwi() {
    _bi();
    _s();
}
function _rw() {
    _r();
    _mi();
}
function _rw2() {
    _r2();
    _m2();
}
function _rwi() {
    _ri();
    _m();
}
function _lw() {
    _l();
    _m();
}
function _lw2() {
    _l2();
    _m2();
}
function _lwi() {
    _li();
    _mi();
}

function updateCube() {
    const up = [u1,u2,u3,u4,u5,u6,u7,u8,u9];
    const left = [l1,l2,l3];
    const right = [r1,r2,r3];
    const front = [f1,f2,f3];
    const back = [b1,b2,b3];

    ctx.fillStyle = "black";
    ctx.fillRect(size+gap, 0, 3*size+4*gap, 5*size+6*gap);
    ctx.fillRect(0, size+gap, 5*size+6*gap, 3*size+4*gap);

    let index = 0;
    for (let j = size+2*gap; j < 4*(size+gap); j += size+gap) {
        for (let i = size+2*gap; i < 4*(size+gap); i += size+gap) {
            ctx.fillStyle = up[index];
            ctx.fillRect(i, j, size, size);
            index++;
        }
    }
    index = back.length-1;
    for (let i = size+2*gap; i < 4*(size+gap); i += size+gap) {
        ctx.fillStyle = back[index];
        ctx.fillRect(i, gap, size, size);
        index--;
    }
    index = 0;
    for (let i = size+2*gap; i < 4*(size+gap); i += size+gap) {
        ctx.fillStyle = front[index];
        ctx.fillRect(i, 4*size+5*gap, size, size);
        index++;
    }
    index = 0;
    for (let j = size+2*gap; j < 4*(size+gap); j += size+gap) {
        ctx.fillStyle = left[index];
        ctx.fillRect(gap, j, size, size);
        index++;
    }
    index = right.length-1;
    for (let j = size+2*gap; j < 4*(size+gap); j += size+gap) {
        ctx.fillStyle = right[index];
        ctx.fillRect(4*size+5*gap, j, size, size);
        index--;
    }
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