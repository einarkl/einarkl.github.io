window.location = "https://einarkl.no" + location.pathname;
let scene, camera, renderer;

let cubies = [];
let planes = [];

let positions = [];
let rotations = [];

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

let r1 = "red", r2 = "red", r3 = "red", r4 = "red", r5 = "red", r6 = "red", r7 = "red", r8 = "red", r9 = "red", nr1, nr2, nr3, nr4, nr5, nr6, nr7, nr8, nr9;
let l1 = "orange", l2 = "orange", l3 = "orange", l4 = "orange", l5 = "orange", l6 = "orange", l7 = "orange", l8 = "orange", l9 = "orange", nl1, nl2, nl3, nl4, nl5, nl6, nl7, nl8, nl9;
let f1 = "green", f2 = "green", f3 = "green", f4 = "green", f5 = "green", f6 = "green", f7 = "green", f8 = "green", f9 = "green", nf1, nf2, nf3, nf4, nf5, nf6, nf7, nf8, nf9;
let b1 = "blue", b2 = "blue", b3 = "blue", b4 = "blue", b5 = "blue", b6 = "blue", b7 = "blue", b8 = "blue", b9 = "blue", nb1, nb2, nb3, nb4, nb5, nb6, nb7, nb8, nb9;
let u1 = "white", u2 = "white", u3 = "white", u4 = "white", u5 = "white", u6 = "white", u7 = "white", u8 = "white", u9 = "white", nu1, nu2, nu3, nu4, nu5, nu6, nu7, nu8, nu9;
let d1 = "yellow", d2 = "yellow", d3 = "yellow", d4 = "yellow", d5 = "yellow", d6 = "yellow", d7 = "yellow", d8 = "yellow", d9 = "yellow", nd1, nd2, nd3, nd4, nd5, nd6, nd7, nd8, nd9;

let keyBinds = [];//["J", "F", "H", "G", "I", "K", "D", "E", "S", "L", "W", "O", ",", ".", "N", "B", "Ø", "A", "Å", "Q", "U", "M", "V", "R"];
let possibleMoves = [];//["U", "U'", "F", "F'", "R", "R'", "L", "L'", "D", "D'", "B", "B'", "M", "M'", "x", "x'", "y", "y'", "z", "z'", "Rw", "Rw'", "Lw", "Lw'"];

$(() => {
    $(window).keypress(function(e) {
        getTurn(e);
    });
    init();
});

function getBindings() {
    /*     let i = 0;
    if (localStorage.getItem("keys")) {
        const keys = localStorage.getItem("keys").split("KEY");
        for (let inp of $("#keysDiv table tr td:nth-child(2) input")) {
            $(inp).val(keys[i]);
            i++;
        }
    } */
}

function updateBindings() {
    keyBinds = ["J", "F", "H", "G", "I", "K", "D", "E", "S", "L", "W", "O", ",", ".", "N", "B", "Ø", "A", "Å", "Q", "U", "M", "V", "R"];
    /* keyBinds = []; */
    let keysToStore = "";
    for (let v of $("#keysDiv table tr td:nth-child(2) input")) {
        keyBinds.push($(v).val());
        keysToStore += $(v).val()+"KEY";
    }
    localStorage.setItem("keys",keysToStore);
}

function getPossibleMoves() {
    /* possibleMoves = [];
    for (let m of $("#keysDiv table tr td:nth-child(1)")) {
        possibleMoves.push($(m).text());
    } */
    possibleMoves = ["U", "U'", "F", "F'", "R", "R'", "L", "L'", "D", "D'", "B", "B'", "M", "M'", "x", "x'", "y", "y'", "z", "z'", "Rw", "Rw'", "Lw", "Lw'"];
}

function init() {
    getBindings();
    updateBindings();
    getPossibleMoves();

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

    positions = [];
    rotations = [];
    for (let p of planes) {
        positions.push(p.position);
        rotations.push(p.rotation);
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
    $("#cube3d").append( renderer.domElement );

    origo = new THREE.Vector3(0, 0, 0);
    xAxis = new THREE.Vector3(1, 0, 0);
    yAxis = new THREE.Vector3(0, 1, 0);
    zAxis = new THREE.Vector3(0, 0, 1);
    
    anim = true;
    animate();

    $("#cube3d > canvas").attr("width", $("#cube3d > canvas").css("width"));
    $("#cube3d > canvas").attr("height", $("#cube3d > canvas").css("height"));
}

function animate() {
    requestAnimationFrame( animate );

    renderer.render( scene, camera );
};

function applyScramble(scr) {
    resetState();
    let oAnim = anim;
    anim = false;
    $("#scramble").text(scr);
    for (let s of scr.split(" ")) {
        applyMove(s);
    }
    anim = oAnim;
}

function getTurn(e) {
    /* if (!ready && !timing && solved) {
        if (e.which === 32) {
            getReady();
            if (e.target === document.body) {  
                e.preventDefault();  
            }
        }
    }
    else if (!solved) { */
        const key = keyBinds.indexOf(String.fromCharCode(e.which).toUpperCase());
        const turn = possibleMoves[key];
        if (turn) {
            /* if (turn.includes("x") || turn.includes("y") || turn.includes("z")) {}
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
            } */
            
            if (tween) {
                tween.progress(1);
            }

            applyMove(turn);
            prevTurn = turn;
        }
    /* } */
}

function applyMove(turn) {
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
        case "x2":
            doX();
            doX();
            break;
        case "y":
            doY();
            break;
        case "y'":
            doYi();
            break;
        case "y2":
            doY();
            doY();
            break;
        case "z":
            doZ();
            break;
        case "z'":
            doZi();
            break;
        case "z2":
            doZ();
            doZ();
            break;
        case "M":
            doM();
            break;
        case "M'":
            doMi();
            break;
        case "M2":
            doM();
            doM();
            break;
        case "S":
            doZ();
            doB();
            doFi();
            break;
        case "S'":
            doZi();
            doBi();
            doF();
            break;
        case "S2":
            doZ();
            doZ();
            doB();
            doB();
            doFi();
            doFi();
            break;
        case "E":
            doYi();
            doDi();
            doU();
            break;
        case "E'":
            doY();
            doD();
            doUi();
            break;
        case "E2":
            doY();
            doY();
            doD();
            doD();
            doU();
            doU();
            break;
        case "Rw":
            doRw();
            break;
        case "Rw'":
            doRwi();
            break;
        case "Rw2":
            doRw();
            doRw();
            break;
        case "Lw":
            doLw();
            break;
        case "Lw'":
            doLwi();
            break;
        case "Lw2":
            doLw();
            doLw();
            break;
        case "Uw":
            doY();
            doD();
            break;
        case "Uw'":
            doYi();
            doDi();
            break;
        case "Uw2":
            doY();
            doY();
            doD();
            doD();
            break;
        case "Dw":
            doYi();
            doU();
            break;
        case "Dw'":
            doY();
            doUi();
            break;
        case "Dw2":
            doY();
            doY();
            doU();
            doU();
            break;
        case "Fw":
            doZ();
            doB();
            break;
        case "Fw'":
            doZi();
            doBi();
            break;
        case "Fw2":
            doZ();
            doZ();
            doB();
            doB();
            break;
        case "Bw":
            doZi();
            doF();
            break;
        case "Bw'":
            doZ();
            doFi();
            break;
        case "Bw2":
            doZ();
            doZ();
            doF();
            doF();
            break;
    }
}

function getReady() {
    if (!timing) {
        solved = false;
        ready = true;
        applyScramble();
        $("#time").html("0.00");
        moveCount = 0;
        $("#moves").html(moveCount + " moves");
        $("#tps").html("");
    }
}

// Ta tid
function startTimer() {
    if (timing) {
        let start = new Date().getTime();
        interval = setInterval(function() {

            checkState();
            if (solved) {
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

function stopTimer() {
    if (timing) {
        timing = false;
        clearInterval(interval);

        tps = moveCount / (time / 1000);
        $("#tps").html(tps.toFixed(2) + " tps");
    }
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

function resetState() {
    prevTurn = "";

    let i = 0;
    for (let p of planes) {
        p.position = positions[i];
        p.rotation = rotations[i];
        i++;
    }

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