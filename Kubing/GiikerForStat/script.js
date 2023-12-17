let scene, camera, renderer;

let cubies = [];
let planes = [];

let cube;
let planeCube;

let origo;
let xAxis, yAxis, zAxis;

let anim;
let tween;

let time = 0;
let moveCount = 0;
let tps = 0;
let interval;
let timing = false;
let ready = false;

let prevTurn;

let solved;
let solvedState = "111111111666666666333333333555555555444444444222222222";
let scrambledState = "111111111666666666333333333555555555444444444222222222";

let scramble = "";
let stats = {};

const database = firebase.database();

let r1 = "5", r2 = "5", r3 = "5", r4 = "5", r5 = "5", r6 = "5", r7 = "5", r8 = "5", r9 = "5", nr1, nr2, nr3, nr4, nr5, nr6, nr7, nr8, nr9;
let l1 = "6", l2 = "6", l3 = "6", l4 = "6", l5 = "6", l6 = "6", l7 = "6", l8 = "6", l9 = "6", nl1, nl2, nl3, nl4, nl5, nl6, nl7, nl8, nl9;
let f1 = "3", f2 = "3", f3 = "3", f4 = "3", f5 = "3", f6 = "3", f7 = "3", f8 = "3", f9 = "3", nf1, nf2, nf3, nf4, nf5, nf6, nf7, nf8, nf9;
let b1 = "4", b2 = "4", b3 = "4", b4 = "4", b5 = "4", b6 = "4", b7 = "4", b8 = "4", b9 = "4", nb1, nb2, nb3, nb4, nb5, nb6, nb7, nb8, nb9;
let u1 = "1", u2 = "1", u3 = "1", u4 = "1", u5 = "1", u6 = "1", u7 = "1", u8 = "1", u9 = "1", nu1, nu2, nu3, nu4, nu5, nu6, nu7, nu8, nu9;
let d1 = "2", d2 = "2", d3 = "2", d4 = "2", d5 = "2", d6 = "2", d7 = "2", d8 = "2", d9 = "2", nd1, nd2, nd3, nd4, nd5, nd6, nd7, nd8, nd9;

$(() => {
    init();
});

function init() {
    solved = true;

    prevTurn = "";

    lock = false;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 0.1, 1000 );

    cube = new THREE.Object3D();
    planeCube = new THREE.Object3D();
    
    let planeSize = 0.9;
    let geometry = new THREE.BoxGeometry( 1, 1, 1 );
    let planeGeometry = new THREE.PlaneGeometry( planeSize, planeSize );

    let colWhite = 0xffffff;
    let colYellow = 0xffff00;
    let colGreen = 0x00ff00;
    let colBlue = 0x0000ff;
    let colRed = 0xff0000;
    let colOrange = 0xffaa00;
    
    let white = new THREE.MeshBasicMaterial( { color: colWhite });
    let yellow = new THREE.MeshBasicMaterial( { color: colYellow } );
    let green = new THREE.MeshBasicMaterial( { color: colGreen } );
    let blue = new THREE.MeshBasicMaterial( { color: colBlue } );
    let red = new THREE.MeshBasicMaterial( { color: colRed } );
    let orange = new THREE.MeshBasicMaterial( { color: colOrange } );
    
    let materials = [
        red,
        orange,
        white,
        yellow,
        green,
        blue
    ];

    for (let z = -1; z < 2; z++) {
        for (let y = -1; y < 2; y++) {
            for (let x = -1; x < 2; x++) {
                if (!(x === 0 && y === 0 && z === 0)) {
                    let c = new THREE.Mesh(geometry, materials);
                    c.position.set(x * 1.01, y * 1.01, z * 1.01);
        
                    let edges = new THREE.LineSegments(
                        new THREE.EdgesGeometry( c.geometry ),
                        new THREE.LineBasicMaterial({color: 0x000000, linewidth: 1})
                    );
                    c.add(edges);
                    //cubies.push(c);
                    //cube.add(c);
                }
            }
        }
    }
    let m1 = 1.01;
    let m2 = 1.5// + planeSize / 2;
    // White
    for (let z = -1; z < 2; z++) {
        for (let x = -1; x < 2; x++) {
            let planeMaterial = new THREE.MeshBasicMaterial( {color: colWhite, side: THREE.DoubleSide} );
            let plane = new THREE.Mesh( planeGeometry, planeMaterial );

            plane.position.set(x * m1, 1*m2 * m1, z * m1);
            plane.rotateX(-Math.PI / 2);
            planeCube.add(plane);
            planes.push(plane);
        }
    }
    // Yellow
    for (let z = -1; z < 2; z++) {
        for (let x = -1; x < 2; x++) {
            let planeMaterial = new THREE.MeshBasicMaterial( {color: colYellow, side: THREE.DoubleSide} );
            let plane = new THREE.Mesh( planeGeometry, planeMaterial );

            plane.position.set(x * m1, -1*m2 * m1, z * m1);
            plane.rotateX(Math.PI / 2);
            planeCube.add(plane);
            planes.push(plane);
        }
    }
    // Green
    for (let y = -1; y < 2; y++) {
        for (let x = -1; x < 2; x++) {
            let planeMaterial = new THREE.MeshBasicMaterial( {color: colGreen, side: THREE.DoubleSide} );
            let plane = new THREE.Mesh( planeGeometry, planeMaterial );

            plane.position.set(x * m1, y * m1, 1*m2 * m1);
            planeCube.add(plane);
            planes.push(plane);
        }
    }
    // Blue
    for (let y = -1; y < 2; y++) {
        for (let x = -1; x < 2; x++) {
            let planeMaterial = new THREE.MeshBasicMaterial( {color: colBlue, side: THREE.DoubleSide} );
            let plane = new THREE.Mesh( planeGeometry, planeMaterial );

            plane.position.set(x * m1, y * m1, -1*m2 * m1);
            planeCube.add(plane);
            planes.push(plane);
        }
    }
    // Orange
    for (let y = -1; y < 2; y++) {
        for (let z = -1; z < 2; z++) {
            let planeMaterial = new THREE.MeshBasicMaterial( {color: colOrange, side: THREE.DoubleSide} );
            let plane = new THREE.Mesh( planeGeometry, planeMaterial );

            plane.position.set(-1*m2 * m1, y * m1, z * m1);
            plane.rotateY(-Math.PI / 2);
            planeCube.add(plane);
            planes.push(plane);
        }
    }
    // Red
    for (let y = -1; y < 2; y++) {
        for (let z = -1; z < 2; z++) {
            let planeMaterial = new THREE.MeshBasicMaterial( {color: colRed, side: THREE.DoubleSide} );
            let plane = new THREE.Mesh( planeGeometry, planeMaterial );

            plane.position.set(1*m2 * m1, y * m1, z * m1);
            plane.rotateY(-Math.PI / 2);
            planeCube.add(plane);
            planes.push(plane);
        }
    }

    //scene.add(cube);
    scene.add(planeCube);
    
    // Cubes for axises
    /* let redcube = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), red);
    redcube.position.set(3, 0, 0);
    scene.add(redcube);

    let greencube = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), white);
    greencube.position.set(0, 3, 0);
    scene.add(greencube);

    let bluecube = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), green);
    bluecube.position.set(0, 0, 3);
    scene.add(bluecube); */
    
    camera.position.x = 0;
    camera.position.y = 5;
    camera.position.z = 5;
    
    camera.rotateX(-Math.PI / 4);
    
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor( 0x000000, 0 );
    renderer.setSize( window.innerWidth, window.innerHeight );
    $("#cubeDisplay").append( renderer.domElement );

    origo = new THREE.Vector3(0, 0, 0);
    xAxis = new THREE.Vector3(1, 0, 0);
    yAxis = new THREE.Vector3(0, 1, 0);
    zAxis = new THREE.Vector3(0, 0, 1);
    
    anim = true;
    animate();
    
    applyScramble();
}

function animate() {
    requestAnimationFrame( animate );

    renderer.render( scene, camera );
};

function applyScramble() {
    scramble = getScrambleNxN(3);
    scrambledState = getCubeState333(scramble);
    $("#scramble").text(scramble);
}

function getTurn(e) {
    if (!ready && !timing && solved) {
        if (e.which === 32) {
            getReady();
            if (e.target === document.body) {  
                e.preventDefault();  
            }
        }
    }
    else if (!solved) {
        const key = keyBinds.indexOf(String.fromCharCode(e.which).toLowerCase());
        const turn = possibleMoves[key];
        if (turn) {
            if (turn.includes("x") || turn.includes("y") || turn.includes("z")) {}
            else {
                if (ready) {
                // Start timer
                    ready = false;
                    timing = true;
                    startTimer();
                }
                // Count move
                moveCount++;
                $("#moves").html(moveCount + " moves");
            }
            
            if (tween) {
                tween.progress(1);
            }

            applyMove(turn);
            prevTurn = turn;
        }
    }
}

function applyMove(turn) {
    if (tween) {
        tween.progress(1);
    }
    switch (turn) {
        case "R":
            doR();
            break;
        case "R'":
            doRi();
            break;
        case "R2":
            doR();
            doR();
            break;
        case "L":
            doL();
            break;
        case "L'":
            doLi();
            break;
        case "L2":
            doL();
            doL();
            break;
        case "F":
            doF();
            break;
        case "F'":
            doFi();
            break;
        case "F2":
            doF();
            doF();
            break;
        case "B":
            doB();
            break;
        case "B'":
            doBi();
            break;
        case "B2":
            doB();
            doB();
            break;
        case "U":
            doU();
            break;
        case "U'":
            doUi();
            break;
        case "U2":
            doU();
            doU();
            break;
        case "D":
            doD();
            break;
        case "D'":
            doDi();
            break;
        case "D2":
            doD();
            doD();
            break;
        case "x":
            doX();
            break;
        case "x'":
            doXi();
            break;
        case "y":
            doY();
            break;
        case "y'":
            doYi();
            break;
        case "z":
            doZ();
            break;
        case "z'":
            doZi();
            break;
        case "M":
            doM();
            break;
        case "M'":
            doMi();
            break;
        case "Rw":
            doRw();
            break;
        case "Rw'":
            doRwi();
            break;
        case "Lw":
            doLw();
            break;
        case "Lw'":
            doLwi();
            break;
    }
    if (ready) {
        $("#moves").html(moveArray.length + " moves");
    }
}

function getReady() {
    if (!timing) {
        moveArray = [];
        solved = false;
        ready = true;
        
        $("#time").html("0.00");
        moveCount = 0;
        $("#moves").html(moveCount + " moves");
        $("#tps").html("");
        $("#scramble").text("Turn cube to start timer");
    }
}

// Ta tid
function startTimer() {
    if (timing) {
        let start = new Date().getTime();
        $("#stats").html("");
        interval = setInterval(function() {

            let state = getCubeState333(scramble + " " + moveArray.join(" "));
            if (state === solvedState) {
                solved = true;
                stopTimer();
            }

            time = new Date().getTime() - start;

            let ms = Math.floor((time % 1000) / 10);
            let s = Math.floor((time / 1000) % 60);
            let m = Math.floor((time / 60000) % 60);

            if (ms < 10) ms = "0" + ms;

            if (m === 0) {
                $("#time").html(s + "." + ms);
            }
            else {
                if (s < 10) s = "0" + s;
                $("#time").html(m + ":" + s + "." + ms);
            }
        }, 1);
    }
}

function stopTimer(reset = false) {
    if (reset) {
        solved = true;
        ready = false;
        timing = false;
        clearInterval(interval);
        applyScramble();
        moveArray = [];
    }
    else if (timing) {
        timing = false;
        tps = moveArray.length / (time / 1000);
        $("#tps").html(tps.toFixed(2) + " tps");

        clearInterval(interval);

        recon(scramble, time, moveArray, tps);
        
        applyScramble();
        moveArray = [];
        ready = false;
    }
}

/* function recon(scr, t, mvs, tps) {
    let time = getHHmmsshh(t);
    let r = time + "   " + scr + "\n\n";
    stats = {
        "time" : t,
        "scramble" : scr
    }

    let steps = getSteps(scr, mvs);

    let i = 1;
    for (let s of steps) {
        r += s.join(" // ") + "\n";
        stats[s[1]] = s[0];
        i++;
    }

    r += "\n" + mvs.length + " / " + time + " = " + tps + " tps";

    let out = "";
    for (let k in stats) {
        out += "<br><span>" + stats[k] + " // " + k + "</span>";
    }
    out += "<br><button onclick='submitStats()'>Submit stats</button>";

    $("#stats").html(out)
    console.log(r);
} */
function recon(scr, t, mvs, tps) {
    let time = getHHmmsshh(t);
    stats = {}

    let steps = getSteps(scr, mvs);

    let i = 1;
    for (let s of steps) {
        stats[s[1]] = s[0];
        i++;
    }

    let out = "<span>" + scr + "   (" + time + ")</span><br><br>";
    for (let k in stats) {
        out += "<br><span>" + stats[k] + " // " + k + "</span>";
    }
    out += "<br><button onclick='submitStats()'>Submit stats</button>";

    $("#stats").html(out)
}

function getSteps(scr, mvs) {
    let steps = [];
    let startInd = 0;
    let cross = -1;
    let pairs = 0;
    let fruruf = false;
    let ori = ""
    // for (let s of ["cross", "f2l", "oll", "pll", "auf"]) {
    for (let s of ["cross", "1st pair", "2nd pair", "3rd pair", "4th pair", "oll", "pll", "auf"]) {
        loop : for (let i = startInd; i < mvs.length; i++) {
            let curMoves = mvs.slice(startInd, i + 1).join(" ");
            let state = getCubeState333(scr + " " + mvs.slice(0, i + 1).join(" "));

            let fU = state.split("").slice(0,9);
            let fL = state.split("").slice(9,18);
            let fF = state.split("").slice(18,27);
            let fR = state.split("").slice(27,36);
            let fB = state.split("").slice(36,45);
            let fD = state.split("").slice(45,54);

            let faces = [fU, fL, fF, fR, fB, fD];
            function oppFace(n) {
                switch (n) {
                    case 0:
                        return 5;
                    case 1:
                        return 3;
                    case 2:
                        return 4;
                    case 3:
                        return 1;
                    case 4:
                        return 2;
                    case 5:
                        return 1;
                }
            }

            if (s === "cross") {
                if (fU[4] === fU[1] && fU[4] === fU[3] && fU[4] === fU[5] && fU[4] === fU[7] &&
                    fL[4] === fL[1] && fF[4] === fF[1] && fR[4] === fR[1] && fB[4] === fB[1]) {
                    startInd = i + 1;
                    ori = "z2";
                    steps.push([ori, "orientation"]);
                    steps.push([getMovesWithoutRotations(ori + " " + curMoves), s]);
                    cross = 0;
                    break loop;
                }
                else if (fL[4] === fL[1] && fL[4] === fL[3] && fL[4] === fL[5] && fL[4] === fL[7] &&
                    fU[4] === fU[3] && fF[4] === fF[3] && fD[4] === fD[3] && fB[4] === fB[5]) {
                    startInd = i + 1;
                    ori = "z'";
                    steps.push([ori, "orientation"]);
                    steps.push([getMovesWithoutRotations(ori + " " + curMoves), s]);
                    cross = 1;
                    break loop;
                }
                else if (fF[4] === fF[1] && fF[4] === fF[3] && fF[4] === fF[5] && fF[4] === fF[7] &&
                    fU[4] === fU[7] && fR[4] === fR[3] && fD[4] === fD[1] && fL[4] === fL[5]) {
                    startInd = i + 1;
                    ori = "x'";
                    steps.push([ori, "orientation"]);
                    steps.push([getMovesWithoutRotations(ori + " " + curMoves), s]);
                    cross = 2;
                    break loop;
                }
                else if (fR[4] === fR[1] && fR[4] === fR[3] && fR[4] === fR[5] && fR[4] === fR[7] &&
                    fU[4] === fU[5] && fF[4] === fF[5] && fD[4] === fD[5] && fB[4] === fB[3]) {
                    startInd = i + 1;
                    ori = "z";
                    steps.push([ori, "orientation"]);
                    steps.push([getMovesWithoutRotations(ori + " " + curMoves), s]);
                    cross = 3;
                    break loop;
                }
                else if (fB[4] === fB[1] && fB[4] === fB[3] && fB[4] === fB[5] && fB[4] === fB[7] &&
                    fU[4] === fU[1] && fL[4] === fL[3] && fD[4] === fD[7] && fR[4] === fR[5]) {
                    startInd = i + 1;
                    ori = "x";
                    steps.push([ori, "orientation"]);
                    steps.push([getMovesWithoutRotations(ori + " " + curMoves), s]);
                    cross = 4;
                    break loop;
                }
                else if (fD[4] === fD[1] && fD[4] === fD[3] && fD[4] === fD[5] && fD[4] === fD[7] &&
                    fL[4] === fL[7] && fF[4] === fF[7] && fR[4] === fR[7] && fB[4] === fB[7]) {
                    startInd = i + 1;
                    ori = "";
                    steps.push([ori, "orientation"]);
                    steps.push([getMovesWithoutRotations(ori + " " + curMoves), s]);
                    cross = 5;
                    break loop;
                }
            }
            else if (s.includes("pair")) {
                /* if (
                    cross === 0 &&
                    (fF[0]+fF[1]+fF[2]+fF[3]+fF[4]+fF[5] === "333333") &&
                    (fR[0]+fR[1]+fR[2]+fR[3]+fR[4]+fR[5] === "555555") &&
                    (fB[0]+fB[1]+fB[2]+fB[3]+fB[4]+fB[5] === "444444") &&
                    (fL[0]+fL[1]+fL[2]+fL[3]+fL[4]+fL[5] === "666666") ||
                    
                    cross === 1 &&
                    (fU[0]+fU[3]+fU[6]+fU[1]+fU[4]+fU[7] === "111111") &&
                    (fF[0]+fF[3]+fF[6]+fF[1]+fF[4]+fF[7] === "333333") &&
                    (fD[0]+fD[3]+fD[6]+fD[1]+fD[4]+fD[7] === "222222") &&
                    (fB[2]+fB[5]+fB[8]+fB[1]+fB[4]+fB[7] === "444444") ||
                    
                    cross === 2 &&
                    (fU[6]+fU[7]+fU[8]+fU[3]+fU[4]+fU[5] === "111111") &&
                    (fR[0]+fR[3]+fR[6]+fR[1]+fR[4]+fR[7] === "555555") &&
                    (fD[0]+fD[1]+fD[2]+fD[3]+fD[4]+fD[5] === "222222") &&
                    (fL[2]+fL[5]+fL[8]+fL[1]+fL[4]+fL[7] === "444444") ||

                    cross === 3 &&
                    (fU[2]+fU[5]+fU[8]+fU[1]+fU[4]+fU[7] === "111111") &&
                    (fF[2]+fF[5]+fF[8]+fF[1]+fF[4]+fF[7] === "333333") &&
                    (fD[2]+fD[5]+fD[8]+fD[1]+fD[4]+fD[7] === "222222") &&
                    (fB[0]+fB[3]+fB[6]+fB[1]+fB[4]+fB[7] === "444444") ||

                    cross === 4 &&
                    (fU[0]+fU[1]+fU[2]+fU[3]+fU[4]+fU[5] === "111111") &&
                    (fR[2]+fR[5]+fR[8]+fR[1]+fR[4]+fR[7] === "555555") &&
                    (fD[3]+fD[4]+fD[5]+fD[6]+fD[7]+fD[8] === "222222") &&
                    (fL[0]+fL[3]+fL[6]+fL[1]+fL[4]+fL[7] === "444444") ||

                    cross === 5 &&
                    (fF[3]+fF[4]+fF[5]+fF[6]+fF[7]+fF[8] === "333333") &&
                    (fR[3]+fR[4]+fR[5]+fR[6]+fR[7]+fR[8] === "555555") &&
                    (fB[3]+fB[4]+fB[5]+fB[6]+fB[7]+fB[8] === "444444") &&
                    (fL[3]+fL[4]+fL[5]+fL[6]+fL[7]+fL[8] === "666666")
                    ) { */
                const u = "1";
                const d = "2";
                const f = "3";
                const b = "4";
                const r = "5";
                const l = "6";
                if (
                    cross === 0 &&
                    fU[4] === fU[1] && fU[4] === fU[3] && fU[4] === fU[5] && fU[4] === fU[7] &&
                    fL[4] === fL[1] && fF[4] === fF[1] && fR[4] === fR[1] && fB[4] === fB[1] &&
                    ((fL[2]+fL[5]+fF[0]+fF[3]+fU[6] === l+l+f+f+u) +
                    (fF[2]+fF[5]+fR[0]+fR[3]+fU[8] === f+f+r+r+u) +
                    (fR[2]+fR[5]+fB[0]+fB[3]+fU[2] === r+r+b+b+u) +
                    (fB[2]+fB[5]+fL[0]+fL[3]+fU[0] === b+b+l+l+u) > pairs)
                    
                    ||
                    
                    cross === 1 &&
                    fL[4] === fL[1] && fL[4] === fL[3] && fL[4] === fL[5] && fL[4] === fL[7] &&
                    fU[4] === fU[3] && fF[4] === fF[3] && fD[4] === fD[3] && fB[4] === fB[5] &&
                    ((fU[6]+fU[7]+fF[0]+fF[1]+fL[2] === u+u+f+f+l) +
                    (fF[6]+fF[7]+fD[0]+fD[1]+fL[8] === f+f+d+d+l) +
                    (fD[6]+fD[7]+fB[7]+fB[8]+fL[6] === d+d+b+b+l) +
                    (fB[1]+fB[2]+fU[0]+fU[1]+fL[0] === b+b+u+u+l) > pairs)
                    
                    ||
                    
                    cross === 2 &&
                    fF[4] === fF[1] && fF[4] === fF[3] && fF[4] === fF[5] && fF[4] === fF[7] &&
                    fU[4] === fU[7] && fR[4] === fR[3] && fD[4] === fD[1] && fL[4] === fL[5] &&
                    ((fL[1]+fL[2]+fU[3]+fU[6]+fF[0] === l+l+u+u+f) +
                    (fU[5]+fU[8]+fR[0]+fR[1]+fF[2] === u+u+r+r+f) +
                    (fR[6]+fR[7]+fD[2]+fD[5]+fF[8] === r+r+d+d+f) +
                    (fD[0]+fD[3]+fL[7]+fL[8]+fF[6] === d+d+l+l+f) > pairs)
                    
                    ||

                    cross === 3 &&
                    fR[4] === fR[1] && fR[4] === fR[3] && fR[4] === fR[5] && fR[4] === fR[7] &&
                    fU[4] === fU[5] && fF[4] === fF[5] && fD[4] === fD[5] && fB[4] === fB[3] &&
                    ((fF[1]+fF[2]+fU[7]+fU[8]+fR[0] === f+f+u+u+r) +
                    (fU[1]+fU[2]+fB[0]+fB[1]+fR[2] === u+u+b+b+r) +
                    (fB[6]+fB[7]+fD[7]+fD[8]+fR[8] === b+b+d+d+r) +
                    (fD[1]+fD[2]+fF[7]+fF[8]+fR[6] === d+d+f+f+r) > pairs)
                    
                    ||

                    cross === 4 &&
                    fB[4] === fB[1] && fB[4] === fB[3] && fB[4] === fB[5] && fB[4] === fB[7] &&
                    fU[4] === fU[1] && fL[4] === fL[3] && fD[4] === fD[7] && fR[4] === fR[5] &&
                    ((fR[1]+fR[2]+fU[2]+fU[5]+fB[0] === r+r+u+u+b) +
                    (fU[0]+fU[3]+fL[0]+fL[1]+fB[2] === u+u+l+l+b) +
                    (fL[6]+fL[7]+fD[3]+fD[6]+fB[8] === l+l+d+d+b) +
                    (fD[5]+fD[8]+fR[7]+fR[8]+fB[6] === d+d+r+r+b) > pairs)
                    
                    ||

                    cross === 5 &&
                    fD[4] === fD[1] && fD[4] === fD[3] && fD[4] === fD[5] && fD[4] === fD[7] &&
                    fL[4] === fL[7] && fF[4] === fF[7] && fR[4] === fR[7] && fB[4] === fB[7] &&
                    ((fL[5]+fL[8]+fF[3]+fF[6]+fD[0] === l+l+f+f+d) +
                    (fF[5]+fF[8]+fR[3]+fR[6]+fD[2] === f+f+r+r+d) +
                    (fR[5]+fR[8]+fB[3]+fB[6]+fD[8] === r+r+b+b+d) +
                    (fB[5]+fB[8]+fL[3]+fL[6]+fD[6] === b+b+l+l+d) > pairs)
                    ) {
                    startInd = i + 1;
                    steps.push([getMovesWithoutRotations(ori + " " + curMoves), s]);
                    pairs++;
                    break loop;
                }
            }
            else if (s === "oll") {
                let face = faces[oppFace(cross)];
                let c = face[4];
                if (face.join("") === c+c+c+c+c+c+c+c+c) {
                    if (!fruruf) {
                        startInd = i + 1;
                        steps.push([getMovesWithoutRotations(ori + " " + curMoves), s]);
                        break loop;
                    }
                }
                else if (
                    !fruruf &&
                    cross === 0 &&
                    (fD[0]+fD[1]+fD[2]+fD[4]+fD[7]+fB[6]+fB[8]+fR[7]+fL[7] === "222222222" ||
                    fD[2]+fD[3]+fD[4]+fD[5]+fD[8]+fL[6]+fL[8]+fF[7]+fB[7] === "222222222" ||
                    fD[1]+fD[4]+fD[6]+fD[7]+fD[8]+fF[6]+fF[8]+fR[7]+fL[7] === "222222222" ||
                    fD[0]+fD[3]+fD[4]+fD[5]+fD[6]+fR[6]+fR[8]+fF[7]+fB[7] === "222222222") ||

                    cross === 1 &&
                    (fR[0]+fR[1]+fR[2]+fR[4]+fR[7]+fD[2]+fD[8]+fF[5]+fB[3] === "555555555" ||
                    fR[2]+fR[3]+fR[4]+fR[5]+fR[8]+fF[2]+fF[8]+fU[5]+fD[5] === "555555555" ||
                    fR[1]+fR[4]+fR[6]+fR[7]+fR[8]+fU[2]+fU[8]+fR[5]+fL[3] === "555555555" ||
                    fR[0]+fR[3]+fR[4]+fR[5]+fR[6]+fB[0]+fB[6]+fU[5]+fD[5] === "555555555") ||

                    cross === 2 &&
                    (fB[0]+fB[1]+fB[2]+fB[4]+fB[7]+fD[6]+fD[8]+fR[5]+fL[3] === "444444444" ||
                    fB[2]+fB[3]+fB[4]+fB[5]+fB[8]+fR[2]+fR[8]+fU[1]+fD[7] === "444444444" ||
                    fB[1]+fB[4]+fB[6]+fB[7]+fB[8]+fU[0]+fU[2]+fR[5]+fL[3] === "444444444" ||
                    fB[0]+fB[3]+fB[4]+fB[5]+fB[6]+fL[0]+fL[6]+fU[1]+fD[7] === "444444444") ||

                    cross === 3 &&
                    (fL[0]+fL[1]+fL[2]+fL[4]+fL[7]+fD[0]+fD[6]+fF[3]+fB[5] === "666666666" ||
                    fL[2]+fL[3]+fL[4]+fL[5]+fL[8]+fB[2]+fB[8]+fU[3]+fD[3] === "666666666" ||
                    fL[1]+fL[4]+fL[6]+fL[7]+fL[8]+fU[0]+fU[6]+fF[3]+fB[5] === "666666666" ||
                    fL[0]+fL[3]+fL[4]+fL[5]+fL[6]+fF[0]+fF[6]+fU[3]+fD[3] === "666666666") ||

                    cross === 4 &&
                    (fF[0]+fF[1]+fF[2]+fF[4]+fF[7]+fD[0]+fD[2]+fR[3]+fL[5] === "333333333" ||
                    fF[2]+fF[3]+fF[4]+fF[5]+fF[8]+fL[2]+fL[8]+fU[7]+fD[1] === "333333333" ||
                    fF[1]+fF[4]+fF[6]+fF[7]+fF[8]+fU[6]+fU[8]+fR[3]+fL[5] === "333333333" ||
                    fF[0]+fF[3]+fF[4]+fF[5]+fF[6]+fR[0]+fR[6]+fU[7]+fD[1] === "333333333") ||

                    cross === 5 &&
                    (fU[0]+fU[1]+fU[2]+fU[4]+fU[7]+fF[0]+fF[2]+fR[1]+fL[1] === "111111111" ||
                    fU[2]+fU[3]+fU[4]+fU[5]+fU[8]+fL[0]+fL[2]+fF[1]+fB[1] === "111111111" ||
                    fU[1]+fU[4]+fU[6]+fU[7]+fU[8]+fB[0]+fB[2]+fR[1]+fL[1] === "111111111" ||
                    fU[0]+fU[3]+fU[4]+fU[5]+fU[6]+fR[0]+fR[2]+fF[1]+fB[1] === "111111111")
                ) {
                    fruruf = true;
                    startInd = i + 1;
                    steps.push([getMovesWithoutRotations(ori + " " + curMoves), "setup to fruruf"]);
                    break loop;
                }
            }
            else if (s === "pll") {
                let face = faces[oppFace(cross)];
                if (
                    face[4] === face[0] && face[4] === face[1] && face[4] === face[2] && face[4] === face[3] &&
                    face[4] === face[5] && face[4] === face[6] && face[4] === face[7] && face[4] === face[8] &&

                    cross === 0 && fF[6] === fF[7] && fF[6] === fF[8] && fR[6] === fR[7] && fR[6] === fR[8] &&
                    fB[6] === fB[7] && fB[6] === fB[8] && fL[6] === fL[7] && fL[6] === fL[8] ||

                    cross === 1 && fF[2] === fF[5] && fF[2] === fF[8] && fD[2] === fD[5] && fD[2] === fD[8] &&
                    fB[0] === fB[3] && fB[0] === fB[6] && fU[2] === fU[5] && fU[2] === fU[8] ||

                    cross === 2 && fU[0] === fU[1] && fU[0] === fU[2] && fR[2] === fR[5] && fR[2] === fR[8] &&
                    fD[6] === fD[7] && fD[6] === fD[8] && fL[0] === fL[3] && fL[0] === fL[6] ||

                    cross === 3 && fF[0] === fF[3] && fF[0] === fF[6] && fD[0] === fD[3] && fD[0] === fD[6] &&
                    fB[2] === fB[5] && fB[2] === fB[8] && fU[0] === fU[3] && fU[0] === fU[6] ||

                    cross === 4 && fU[6] === fU[7] && fU[6] === fF[8] && fR[0] === fR[3] && fR[0] === fR[6] &&
                    fD[0] === fD[1] && fD[0] === fD[2] && fL[2] === fL[5] && fL[2] === fL[8] ||

                    cross === 5 && fF[0] === fF[1] && fF[0] === fF[2] && fR[0] === fR[1] && fR[0] === fR[2] &&
                    fB[0] === fB[1] && fB[0] === fB[2] && fL[0] === fL[1] && fL[0] === fL[2]
                    ) {
                    startInd = i + 1;
                    fruruf ? steps.push([getMovesWithoutRotations(ori + " " + curMoves), "fruruf"]) : steps.push([getMovesWithoutRotations(ori + " " + curMoves), s]);
                    break loop;
                }
            }
            else {
                steps.push([mvs.slice(startInd).join(" "), s]);
                break loop;
            }
        }
    }
    
    return steps;
}

function getHHmmsshh(ms) {
    let timeStr = "";
    let cs = Math.floor((ms % 1000) / 10);
    let s = Math.floor((ms / 1000) % 60);
    let m = Math.floor((ms / 60000) % 60);
    let h = Math.floor((ms / 3600000) % 24);

    if (h !== 0) {
        if (m < 10) {
            m = "0" + m;
        }
        if (s < 10) {
            s = "0" + s;
        }
        if (cs < 10) {
            cs = "0" + cs;
        }
        timeStr = h + ":" + m + ":" + s + "." + cs;
    }
    else {
        if (m !==0) {
            if (s < 10) {
                s = "0" + s;
            }
            if (cs < 10) {
                cs = "0" + cs;
            }
            timeStr = m + ":" + s + "." + cs;
        }
        else {
            if (cs < 10) {
                cs = "0" + cs;
            }
            timeStr = s + "." + cs;
        }
    }
    
    return timeStr;
}

function rotateAroundPoint(obj, point, axis, theta, pointIsWorld = true){
// obj - your object (THREE.Object3D or derived)
// point - the point of rotation (THREE.Vector3)
// axis - the axis of rotation (normalized THREE.Vector3)
// theta - radian value of rotation
// pointIsWorld - boolean indicating the point is in world coordinates (default = false)
    pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

    if (pointIsWorld){
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if (pointIsWorld){
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}

function calcRotationAroundAxis(axis, angle){

    let euler;

    if ( axis === "x" ){
        euler = new THREE.Euler( angle, 0, 0, 'XYZ' );
    }

    if ( axis === "y" ){
        euler = new THREE.Euler( 0, angle, 0, 'XYZ' );
    }

    if ( axis === "z" ){
        euler = new THREE.Euler( 0, 0, angle, 'XYZ' );
    }
    
    return euler;
}

function doMove(cubies, xyz, angle) {
    /* let axis = xyz === "x" ? xAxis : xyz === "y" ? yAxis : zAxis;
    let euler = calcRotationAroundAxis(xyz, angle); */
    let tempCube = new THREE.Object3D();
    
    for (let cubie of cubies) {
        scene.attach(tempCube);
        tempCube.attach(cubie);
    }
    
    if (anim) {
        tween = gsap.to(tempCube.rotation, {
            duration: .15,
            x: xyz === "x" ? angle : 0,
            y: xyz === "y" ? angle : 0,
            z: xyz === "z" ? angle : 0
        });
    }
    else {
        tween = gsap.to(tempCube.rotation, {
            duration: 0,
            x: xyz === "x" ? angle : 0,
            y: xyz === "y" ? angle : 0,
            z: xyz === "z" ? angle : 0
        });
    }
}

function doR() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x > 1});
    doMove(c, "x", -Math.PI / 2);
}

function doRi() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x > 1});
    doMove(c, "x", Math.PI / 2);
}

function doL() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x < -1});
    doMove(c, "x", Math.PI / 2);
}

function doLi() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x < -1});
    doMove(c, "x", -Math.PI / 2);
}

function doU() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y > 1});
    doMove(c, "y", -Math.PI / 2);
}

function doUi() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y > 1});
    doMove(c, "y", Math.PI / 2);
}

function doD() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y < -1});
    doMove(c, "y", Math.PI / 2);
}

function doDi() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y < -1});
    doMove(c, "y", -Math.PI / 2);
}

function doF() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).z > 1});
    doMove(c, "z", -Math.PI / 2);
}

function doFi() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).z > 1});
    doMove(c, "z", Math.PI / 2);
}

function doB() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).z < -1});
    doMove(c, "z", Math.PI / 2);
}

function doBi() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).z < -1});
    doMove(c, "z", -Math.PI / 2);
}

function doX() {
    let c = planes;
    doMove(c, "x", -Math.PI / 2);
}

function doXi() {
    let c = planes;
    doMove(c, "x", Math.PI / 2);
}

function doY() {
    let c = planes;
    doMove(c, "y", -Math.PI / 2);
}

function doYi() {
    let c = planes;
    doMove(c, "y", Math.PI / 2);
}

function doZ() {
    let c = planes;
    doMove(c, "z", -Math.PI / 2);
}

function doZi() {
    let c = planes;
    doMove(c, "z", Math.PI / 2);
}

function doM() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x < 1 &&  cu.getWorldPosition(new THREE.Vector3()).x > -1});
    doMove(c, "x", Math.PI / 2);
}

function doMi() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x < 1 &&  cu.getWorldPosition(new THREE.Vector3()).x > -1});
    doMove(c, "x", -Math.PI / 2);
}

function doRw() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x > -1});
    doMove(c, "x", -Math.PI / 2);
}

function doRwi() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x > -1});
    doMove(c, "x", Math.PI / 2);
}

function doLw() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x < 1});
    doMove(c, "x", Math.PI / 2);
}

function doLwi() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x < 1});
    doMove(c, "x", -Math.PI / 2);
}

function getAxis(t) {
    let axis;
    switch (t[0]) {
        case "U":
        case "D":
        case "E":
            axis = 0;
            break;
        case "R":
        case "L":
        case "M":
            axis = 1;
            break;
        case "F":
        case "B":
        case "S":
            axis = 2;
            break;
    }

    return axis;
}

function resetCube() {
    stopTimer(true);
    moveArray = [];
    prevTurn = "";

    let u = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y > 1.5});
    let d = planes.filter(cd => {return cd.getWorldPosition(new THREE.Vector3()).y < -1.5});
    let f = planes.filter(cf => {return cf.getWorldPosition(new THREE.Vector3()).z > 1.5});
    let b = planes.filter(cb => {return cb.getWorldPosition(new THREE.Vector3()).z < -1.5});
    let r = planes.filter(cr => {return cr.getWorldPosition(new THREE.Vector3()).x > 1.5});
    let l = planes.filter(cl => {return cl.getWorldPosition(new THREE.Vector3()).x < -1.5});

    for (let p of u) {
        p.material.color.r = 1;
        p.material.color.g = 1;
        p.material.color.b = 1;
    }
    for (let p of d) {
        p.material.color.r = 1;
        p.material.color.g = 1;
        p.material.color.b = 0;
    }
    for (let p of f) {
        p.material.color.r = 0;
        p.material.color.g = 1;
        p.material.color.b = 0;
    }
    for (let p of b) {
        p.material.color.r = 0;
        p.material.color.g = 0;
        p.material.color.b = 1;
    }
    for (let p of r) {
        p.material.color.r = 1;
        p.material.color.g = 0;
        p.material.color.b = 0;
    }
    for (let p of l) {
        p.material.color.r = 1;
        p.material.color.g = 2/3;
        p.material.color.b = 0;
    }
}

function checkState() {
    let u = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y > 1.5}).map(p => p.material.color.r + ";" + p.material.color.g + ";" + p.material.color.b);
    let d = planes.filter(cd => {return cd.getWorldPosition(new THREE.Vector3()).y < -1.5}).map(p => p.material.color.r + ";" + p.material.color.g + ";" + p.material.color.b);
    let f = planes.filter(cf => {return cf.getWorldPosition(new THREE.Vector3()).z > 1.5}).map(p => p.material.color.r + ";" + p.material.color.g + ";" + p.material.color.b);
    let b = planes.filter(cb => {return cb.getWorldPosition(new THREE.Vector3()).z < -1.5}).map(p => p.material.color.r + ";" + p.material.color.g + ";" + p.material.color.b);
    let r = planes.filter(cr => {return cr.getWorldPosition(new THREE.Vector3()).x > 1.5}).map(p => p.material.color.r + ";" + p.material.color.g + ";" + p.material.color.b);
    let l = planes.filter(cl => {return cl.getWorldPosition(new THREE.Vector3()).x < -1.5}).map(p => p.material.color.r + ";" + p.material.color.g + ";" + p.material.color.b);

    solved = ((u[0] === u[1] && u[0] === u[2] && u[0] === u[3] && u[0] === u[4] && u[0] === u[5] && u[0] === u[6] && u[0] === u[7] && u[0] === u[8]) &&
    (d[0] === d[1] && d[0] === d[2] && d[0] === d[3] && d[0] === d[4] && d[0] === d[5] && d[0] === d[6] && d[0] === d[7] && d[0] === d[8]) &&
    (f[0] === f[1] && f[0] === f[2] && f[0] === f[3] && f[0] === f[4] && f[0] === f[5] && f[0] === f[6] && f[0] === f[7] && f[0] === f[8]) &&
    (b[0] === b[1] && b[0] === b[2] && b[0] === b[3] && b[0] === b[4] && b[0] === b[5] && b[0] === b[6] && b[0] === b[7] && b[0] === b[8]) &&
    (r[0] === r[1] && r[0] === r[2] && r[0] === r[3] && r[0] === r[4] && r[0] === r[5] && r[0] === r[6] && r[0] === r[7] && r[0] === r[8]) &&
    (l[0] === l[1] && l[0] === l[2] && l[0] === l[3] && l[0] === l[4] && l[0] === l[5] && l[0] === l[6] && l[0] === l[7] && l[0] === l[8]));
}

function getScrambleNxN(n) {
    if (n < 2) {
        return "Don't be silly :P";
    }

    let scr = "";
    let movesExtra = ["", "'", "2"];
    let axises = n > 2 ? [["U","D"], ["F","B"], ["R","L"]] : [["U"], ["F"], ["R"]];
    let movesAxis = [["",""]];
    let num = n > 3 ? 20*(n-2) : (n === 3 ? Math.floor(Math.random() * 4 + 19) : Math.floor(Math.random() * 3 + 9));

    for (let i = 4; i <= n; i++) {
        let nW = Math.floor(i/2) === 2 ? "" : Math.floor(i/2);
        let nA = [nW,"w"];
        
        if (!JSON.stringify(movesAxis).includes(JSON.stringify(nA))) {
            movesAxis.push(nA);
        }
    }
    
    let curAxis = -1;
    let moves = [];
    for (let i = 0; i < num; i++) {
        let axis = Math.floor(Math.random() * axises.length);

        if (axis !== curAxis) {
            curAxis = axis;
            moves = movesAxis.map(m => [m[0] + axises[curAxis][0] + m[1]])
                    .concat(movesAxis.map(m => [m[0] + axises[curAxis][1] + m[1]]));
            if (n % 2 === 0) {
                moves.pop();
            }
        }
        else if (moves.length === 0) {
            i--;
            continue;
        }

        let move = moves[Math.floor(Math.random() * moves.length)];
        let moveE = movesExtra[Math.floor(Math.random() * movesExtra.length)];
        
        moves.splice(moves.indexOf(move), 1);

        scr += move + moveE + " ";
    }
    return scr.trim();
}

function resetState() {
    r1 = "5", r2 = "5", r3 = "5", r4 = "5", r5 = "5", r6 = "5", r7 = "5", r8 = "5", r9 = "5",
    l1 = "6", l2 = "6", l3 = "6", l4 = "6", l5 = "6", l6 = "6", l7 = "6", l8 = "6", l9 = "6",
    f1 = "3", f2 = "3", f3 = "3", f4 = "3", f5 = "3", f6 = "3", f7 = "3", f8 = "3", f9 = "3",
    b1 = "4", b2 = "4", b3 = "4", b4 = "4", b5 = "4", b6 = "4", b7 = "4", b8 = "4", b9 = "4",
    u1 = "1", u2 = "1", u3 = "1", u4 = "1", u5 = "1", u6 = "1", u7 = "1", u8 = "1", u9 = "1",
    d1 = "2", d2 = "2", d3 = "2", d4 = "2", d5 = "2", d6 = "2", d7 = "2", d8 = "2", d9 = "2";
}

function getCubeState333(scr) {
    resetState();
    
    for (let m of scr.split(" ")) {
        switch (m) {
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
        }
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

    return [
        u1,u2,u3,u4,u5,u6,u7,u8,u9,
        l1,l2,l3,l4,l5,l6,l7,l8,l9,
        f1,f2,f3,f4,f5,f6,f7,f8,f9,
        r1,r2,r3,r4,r5,r6,r7,r8,r9,
        b1,b2,b3,b4,b5,b6,b7,b8,b9,
        d1,d2,d3,d4,d5,d6,d7,d8,d9
    ].join("");
}

function getMovesWithoutRotations(mvs) {
    let mainMoves = ["U", "D", "R", "L", "F", "B"];
    
    function doRotation(m, rot) {
        switch (rot) {
            case "x":
                m = m
                .replaceAll(mainMoves[5], mainMoves[0].toLowerCase())
                .replaceAll(mainMoves[4], mainMoves[1].toLowerCase())
                .replaceAll(mainMoves[1], mainMoves[5].toLowerCase())
                .replaceAll(mainMoves[0], mainMoves[4].toLowerCase());
                break;
            case "x'":
                m = m
                .replaceAll(mainMoves[5], mainMoves[1].toLowerCase())
                .replaceAll(mainMoves[4], mainMoves[0].toLowerCase())
                .replaceAll(mainMoves[1], mainMoves[4].toLowerCase())
                .replaceAll(mainMoves[0], mainMoves[5].toLowerCase());
                break;
            case "x2":
                m = m
                .replaceAll(mainMoves[5], mainMoves[4].toLowerCase())
                .replaceAll(mainMoves[4], mainMoves[5].toLowerCase())
                .replaceAll(mainMoves[1], mainMoves[0].toLowerCase())
                .replaceAll(mainMoves[0], mainMoves[1].toLowerCase());
                break;
            case "y":
                m = m
                .replaceAll(mainMoves[5], mainMoves[3].toLowerCase())
                .replaceAll(mainMoves[4], mainMoves[2].toLowerCase())
                .replaceAll(mainMoves[3], mainMoves[4].toLowerCase())
                .replaceAll(mainMoves[2], mainMoves[5].toLowerCase());
                break;
            case "y'":
                m = m
                .replaceAll(mainMoves[5], mainMoves[2].toLowerCase())
                .replaceAll(mainMoves[4], mainMoves[3].toLowerCase())
                .replaceAll(mainMoves[3], mainMoves[5].toLowerCase())
                .replaceAll(mainMoves[2], mainMoves[4].toLowerCase());
                break;
            case "y2":
                m = m
                .replaceAll(mainMoves[5], mainMoves[4].toLowerCase())
                .replaceAll(mainMoves[4], mainMoves[5].toLowerCase())
                .replaceAll(mainMoves[3], mainMoves[2].toLowerCase())
                .replaceAll(mainMoves[2], mainMoves[3].toLowerCase());
                break;
            case "z":
                m = m
                .replaceAll(mainMoves[3], mainMoves[1].toLowerCase())
                .replaceAll(mainMoves[2], mainMoves[0].toLowerCase())
                .replaceAll(mainMoves[1], mainMoves[2].toLowerCase())
                .replaceAll(mainMoves[0], mainMoves[3].toLowerCase());
                break;
            case "z'":
                m = m
                .replaceAll(mainMoves[3], mainMoves[0].toLowerCase())
                .replaceAll(mainMoves[2], mainMoves[1].toLowerCase())
                .replaceAll(mainMoves[1], mainMoves[3].toLowerCase())
                .replaceAll(mainMoves[0], mainMoves[2].toLowerCase());
                break;
            case "z2":
                m = m
                .replaceAll(mainMoves[3], mainMoves[2].toLowerCase())
                .replaceAll(mainMoves[2], mainMoves[3].toLowerCase())
                .replaceAll(mainMoves[1], mainMoves[0].toLowerCase())
                .replaceAll(mainMoves[0], mainMoves[1].toLowerCase());
                break;
        }
    
        return m.toUpperCase();
    }

    mvs = mvs
            .replaceAll("Uw2", "y2 D2").replaceAll("Uw'", "y' D'").replaceAll("Uw", "y D")
            .replaceAll("Dw2", "y2 U2").replaceAll("Dw'", "y U'").replaceAll("Dw", "y' U")
            .replaceAll("Rw2", "x2 L2").replaceAll("Rw'", "x' L'").replaceAll("Rw", "x L")
            .replaceAll("Lw2", "x2 R2").replaceAll("Lw'", "x R'").replaceAll("Lw", "x' R")
            .replaceAll("Fw2", "z2 B2").replaceAll("Fw'", "z' B'").replaceAll("Fw", "z B")
            .replaceAll("Bw2", "z2 F2").replaceAll("Bw'", "z F'").replaceAll("Bw", "z' F")

            .replaceAll("M2", "x2 R2 L2").replaceAll("M'", "x R' L").replaceAll("M", "x' R L'")
            .replaceAll("S2", "z2 F2 B2").replaceAll("S'", "z' F B'").replaceAll("S", "z F' B")
            .replaceAll("E2", "y2 U2 D2").replaceAll("E'", "y U' D").replaceAll("E", "y' U D'")
            .replaceAll("x", "_x").replaceAll("y", "_y").replaceAll("z", "_z");
    let newMoves = [];
    if (mvs.split("_")[0].trim() !== "") {
        newMoves.push(mvs.split("_")[0].trim());
    }
    for (let r of mvs.split("_").slice(1)) {
        let rot = r.split(" ")[0];
        let rest = r.split(" ").slice(1).join(" ").trim();
        mainMoves = doRotation(mainMoves.slice().join(" "), rot).split(" ");
        newMoves.push((rest
            .replaceAll("U", mainMoves[0].toLowerCase())
            .replaceAll("D", mainMoves[1].toLowerCase())
            .replaceAll("R", mainMoves[2].toLowerCase())
            .replaceAll("L", mainMoves[3].toLowerCase())
            .replaceAll("F", mainMoves[4].toLowerCase())
            .replaceAll("B", mainMoves[5].toLowerCase())
        ).toUpperCase().replaceAll("W", "w"));
    }
    
    return newMoves.join(" ").trim();
}

function submitStats() {
    console.log(stats);

    for (let k in stats) {
        if (k.includes("pair")) {
            database.ref(k).push(stats[k]);
        }
    }

    $("#stats").html("");
}

function downloadFirebaseData() {
    var rootRef = database.ref();

    rootRef.once('value', function(snapshot) {
        var rawData = snapshot.val();
        var processedData = {};

        // Process and deduplicate each key in the data
        for (var key in rawData) {
            if (rawData.hasOwnProperty(key)) {
                // Convert object values to array and filter out duplicates
                var uniqueValues = Array.from(new Set(Object.values(rawData[key])));
                processedData[key] = uniqueValues;
            }
        }

        // Convert processed data to formatted JSON string
        var formattedJson = JSON.stringify(processedData, null, 2); // Indent with 2 spaces for formatting
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(formattedJson);
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "data.json");
        document.body.appendChild(downloadAnchorNode); // Required for Firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });
}