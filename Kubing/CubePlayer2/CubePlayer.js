import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
export * as $ from 'https://code.jquery.com/jquery-3.6.0.min.js';
let urls = [];
export function initScripts() {
    let scriptGsap = document.createElement('script');
    let url = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.3/gsap.min.js";
    scriptGsap.setAttribute('src',url);
    let scripts = document.getElementsByTagName("script");

    if (!urls.includes(url)) {
        urls.push(url);
        document.head.appendChild(scriptGsap);
    }

    /* let scriptGiiker = document.createElement('script');
    scriptGiiker.setAttribute('src','https://einarkl.github.io/Kubing/CubePlayer/giiker.js');
    document.head.appendChild(scriptGiiker); */

    /* 
    var script = document.querySelector('#hljs');
    script.addEventListener('load', function() {
        hljs.initHighlightingOnLoad(); 
    });
    */
}

let movesApplied = [];
let initialized = false;
let cubePlayerHeight, cubePlayerWidth;

let scramble, solution, time, tps, cubestyle, logo, colors, plastic, playbutton, nextbutton, smartcube, cubePlayerDiv, buttonDiv, button, buttonnxt, smartcubeButton, useControls, iterator, rotx, roty;
let planes = [];
let scene, camera, renderer, controls;
let anim = false;
let stdTime = 0.15;
let playMoveTime;
let tween;
let planeCube, cube;
let white, yellow, green, blue, red, orange;

let solvedFunc;

export class CubePlayer extends HTMLElement {
    constructor() {
        super();
        
        /* this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true)); */
    }
    connectedCallback() {
        initScripts();
        setTimeout(() => {
            this.id = this.getAttribute("id") || this.id;
            scramble = this.getAttribute("scramble") || "";
            solution = this.getAttribute("solution") || "";
            
            scramble = scramble.replaceAll("(", "").replaceAll(")", "");
            solution = solution.replaceAll("(", "").replaceAll(")", "");

            if (scramble.includes("[") || scramble.includes("]")) {
                scramble = commToAlg(scramble);
            }
            if (solution.includes("[") || solution.includes("]")) {
                solution = commToAlg(solution);
            }

            time = parseInt(this.getAttribute("time")) || "";
            tps = time === "" ? (parseFloat(this.getAttribute("tps")) || "") : "";
            cubestyle = this.getAttribute("cubestyle") || "solid";
            logo = this.getAttribute("logo") || "";
            colors = this.getAttribute("colors") && this.getAttribute("colors").split(",").length === 6 ? this.getAttribute("colors").split(",").map(c => c.trim()) : 
            [
                "#ffffff",
                "#ffaa00",
                "#00ff00",
                "#ff0000",
                "#0000ff",
                "#ffff00"
            ];
            plastic = isColor(this.getAttribute("plastic")) ? this.getAttribute("plastic") : "#000000";
            playbutton = this.getAttribute("playbutton") || "";
            nextbutton = this.getAttribute("nextbutton") || "";
            iterator = this.getAttribute("iterator") ? parseInt(this.getAttribute("iterator")) : 0;
            smartcube = this.getAttribute("smartcube") === "giiker" ? this.getAttribute("smartcube") : "";
            solvedFunc = window[this.getAttribute("solvedfunc")] ? this.getAttribute("solvedfunc") : "";
            useControls = this.getAttribute("usecontrols") ? this.getAttribute("usecontrols").toLowerCase().trim() === "true" : false;
            rotx = parseFloat(this.getAttribute("rotx")) || 0;
            roty = parseFloat(this.getAttribute("roty")) || 0;

            cubePlayerDiv = document.createElement("div");
            buttonDiv = document.createElement("div");
            button = document.createElement("button");
            buttonnxt = document.createElement("button");
            smartcubeButton = document.createElement("button");
            
            this.appendChild(cubePlayerDiv);

            button.innerText = "Play";
            buttonnxt.innerText = "Next";
            smartcubeButton.innerText = "Giiker";
            buttonDiv.appendChild(button);
            buttonDiv.appendChild(buttonnxt);
            buttonDiv.appendChild(smartcubeButton);
            this.appendChild(buttonDiv);

            if (smartcube !== "") {
                $(button).css("display", "none");
                $(smartcubeButton).css("display", "block");
            }
            else if (playbutton !== "none") {
                $(button).css("display", "block");
                $(smartcubeButton).css("display", "none");
            }
            else {
                $(button).css("display", "none");
                $(smartcubeButton).css("display", "none");
            }

            if (solution === "") {
                $(button).attr("disabled", true);
            }
            else {
                $(button).attr("disabled", false);
            }

            planes = [];
            scene, camera, renderer;
            anim = false;
            stdTime = 0.15;
            playMoveTime;
            tween;
            planeCube, cube;
            white, yellow, green, blue, red, orange;

            init();

            if (cubePlayerWidth === undefined) {
                cubePlayerWidth = $(cubePlayerDiv).parent().width();
                cubePlayerHeight = $(cubePlayerDiv).parent().height();
            }

            adjustSize();
            
            $(button).on("click", () => {
                $(button).prop('disabled', true);
                resetState();
                const setup = scramble;
                const moves = solution;
            
                for (let m of (setup).split(" ")) {
                    mv(m);
                }
            
                anim = true;
                let mvs = (moves).split(" ");
                playMoveTime = tps !== "" ? 1000 / tps : time === "" ? stdTime * 1000 : time / mvs.length;
                
                let i = 0;
                let interval = setInterval(() => {
                    if (i === mvs.length) {
                        clearInterval(interval);
                        anim = false;
                        $(button).prop('disabled', false);
                    }
                    else {
                        if (tween) {
                            tween.progress(1);
                        }
                        mv(mvs[i]);
                    }
                    i++;
                }, playMoveTime);
            });
            
            $(buttonnxt).on("click", () => {
                resetState();
                let sol = solution.split(" ");
                let prevSol = sol.slice(0, iterator).join(" ");
                let nextSol = sol[iterator];
                const setup = scramble + " " + prevSol;
                const moves = nextSol;
            
                for (let m of (setup).split(" ")) {
                    mv(m);
                }
            
                anim = true;
                let mvs = (moves).split(" ");
                // playMoveTime = time === "" ? stdTime * 1000 : time / mvs.length;
                playMoveTime = 250;
                
                let i = 0;
                let interval = setInterval(() => {
                    if (i === mvs.length) {
                        clearInterval(interval);
                        anim = false;
                        $(button).prop('disabled', false);
                    }
                    else {
                        if (tween) {
                            tween.progress(1);
                        }
                        mv(mvs[i]);
                    }
                    i++;
                }, playMoveTime);
                iterator++;
                this.setAttribute("iterator", iterator);
            });

            $(smartcubeButton).on("click", () => {
                connectSmartCube(smartcube);
            });

            resetState();
            /* for (let m of scramble.split(" ")) {
                mv(m);
            } */

            initialized = true;
        }, 500);
    }
    
    static get observedAttributes() {
        return ["id", "scramble", "solution", "time", "tps", "cubestyle", "logo", "colors", "plastic", "playbutton", "smartcube", "solvedfunc", "usecontrols", "rotx", "roty"];
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        let shouldInit = false;
        if (initialized) {
            switch (attr) {
                case "id":
                    this.id = newValue || "";
                    break;
                case "scramble":
                    scramble = newValue || "";
                    break;
                case "solution":
                    solution = newValue || "";
                    break;
                case "time":
                    time = newValue || "";
                    break;
                case "tps":
                    tps = newValue || "";
                    break;
                case "cubestyle":
                    cubestyle = newValue || "solid";
                    shouldInit = true;
                    break;
                case "logo":
                    logo = newValue || "";
                    shouldInit = true;
                    break;
                case "colors":
                    colors = newValue.split(",").filter(c => isColor(c)).length === 6 ? newValue.split(",") : 
                    [
                        "#ffffff",
                        "#ffaa00",
                        "#00ff00",
                        "#ff0000",
                        "#0000ff",
                        "#ffff00"
                    ];
                    shouldInit = true;
                    break;
                case "plastic":
                    plastic = isColor(newValue) ? newValue : "#000000";
                    shouldInit = true;
                    break;
                case "playbutton":
                    playbutton = newValue || "";
                    shouldInit = true;
                    break;
                case "nextbutton":
                    nextbutton = newValue || "";
                    shouldInit = true;
                    break;
                case "smartcube":
                    smartcube = newValue === "giiker" ? newValue : "";
                    shouldInit = true;
                    break;
                case "solvedfunc":
                    solvedFunc = newValue || "";
                    break;
                case "usecontrols":
                    useControls =  newValue ? newValue.toLowerCase().trim() === "true" : false;
                    shouldInit = true;
                    break;
                case "rotx":
                    rotx = newValue || 0;
                    shouldInit = true;
                    break;
                case "roty":
                    roty = newValue || 0;
                    shouldInit = true;
                    break;
            }

            if (smartcube !== "") {
                $(button).css("display", "none");
                $(smartcubeButton).css("display", "block");
            }
            else if (playbutton !== "none") {
                $(button).css("display", "block");
                $(smartcubeButton).css("display", "none");
            }
            else if (nextbutton !== "none") {
                $(button).css("display", "block");
                $(smartcubeButton).css("display", "none");
            }
            else {
                $(button).css("display", "none");
                $(smartcubeButton).css("display", "none");
            }

            if (solution === "") {
                $(button).attr("disabled", true);
            }
            else {
                $(button).attr("disabled", false);
            }

            if (shouldInit && oldValue !== newValue) {
                init();
            }

            resetState();

            scramble = scramble.replaceAll("(", "").replaceAll(")", "");
            solution = solution.replaceAll("(", "").replaceAll(")", "");

            if (scramble.includes("[") || scramble.includes("]")) {
                scramble = commToAlg(scramble);
            }
            if (solution.includes("[") || solution.includes("]")) {
                solution = commToAlg(solution);
            }
            
            for (let m of scramble.split(" ")) {
                mv(m);
            }
            for (let m of solution.split(" ")) {
                mv(m);
            }
        }
    }
}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 40, 1, 0.1, 10 );

    cube = new THREE.Object3D();
    planeCube = new THREE.Object3D();
    
    let planeSize = cubestyle === "stickerless" ? 1 : 0.925;
    let geometry = new THREE.BoxGeometry( 1, 1, 1 );
    let planeGeometry = new THREE.PlaneGeometry( planeSize, planeSize );

    let colWhite = isColor(colors[0]) ? colors[0] : "#ffffff";
    let colOrange = isColor(colors[1]) ? colors[1] : "#ffaa00";
    let colGreen = isColor(colors[2]) ? colors[2] : "#00ff00";
    let colRed = isColor(colors[3]) ? colors[3] : "#ff0000";
    let colBlue = isColor(colors[4]) ? colors[4] : "#0000ff";
    let colYellow = isColor(colors[5]) ? colors[5] : "#ffff00";
    
    white = new THREE.MeshBasicMaterial( { color: colWhite });
    yellow = new THREE.MeshBasicMaterial( { color: colYellow } );
    green = new THREE.MeshBasicMaterial( { color: colGreen } );
    blue = new THREE.MeshBasicMaterial( { color: colBlue } );
    red = new THREE.MeshBasicMaterial( { color: colRed } );
    orange = new THREE.MeshBasicMaterial( { color: colOrange } );
    
    let materials = [
        red,
        orange,
        white,
        yellow,
        green,
        blue
    ];

    planes = [];

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
                    
                    let cubie = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: plastic}));
                    cubie.position.x = x * 1.01;
                    cubie.position.y = y * 1.01;
                    cubie.position.z = z * 1.01;

                    if (cubestyle !== "hollow") {
                        cube.add(cubie);
                        planes.push(cubie);
                    }
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
            plane.renderOrder = 1;
            plane.position.set(x * m1, 1*m2 * m1, z * m1);
            plane.rotateX(-Math.PI / 2);
            plane.name = "stickerU";
            planeCube.add(plane);
            planes.push(plane);
        }
    }
    // Yellow
    for (let z = -1; z < 2; z++) {
        for (let x = -1; x < 2; x++) {
            let planeMaterial = new THREE.MeshBasicMaterial( {color: colYellow, side: THREE.DoubleSide} );
            let plane = new THREE.Mesh( planeGeometry, planeMaterial );
            plane.renderOrder = 1;
            plane.position.set(x * m1, -1*m2 * m1, z * m1);
            plane.rotateX(Math.PI / 2);
            plane.name = "stickerD";
            planeCube.add(plane);
            planes.push(plane);
        }
    }
    // Green
    for (let y = -1; y < 2; y++) {
        for (let x = -1; x < 2; x++) {
            let planeMaterial = new THREE.MeshBasicMaterial( {color: colGreen, side: THREE.DoubleSide} );
            let plane = new THREE.Mesh( planeGeometry, planeMaterial );
            plane.renderOrder = 1;
            plane.position.set(x * m1, y * m1, 1*m2 * m1);
            plane.name = "stickerF";
            planeCube.add(plane);
            planes.push(plane);
        }
    }
    // Blue
    for (let y = -1; y < 2; y++) {
        for (let x = -1; x < 2; x++) {
            let planeMaterial = new THREE.MeshBasicMaterial( {color: colBlue, side: THREE.DoubleSide} );
            let plane = new THREE.Mesh( planeGeometry, planeMaterial );
            plane.renderOrder = 1;
            plane.position.set(x * m1, y * m1, -1*m2 * m1);
            plane.name = "stickerB";
            planeCube.add(plane);
            planes.push(plane);
        }
    }
    // Orange
    for (let y = -1; y < 2; y++) {
        for (let z = -1; z < 2; z++) {
            let planeMaterial = new THREE.MeshBasicMaterial( {color: colOrange, side: THREE.DoubleSide} );
            let plane = new THREE.Mesh( planeGeometry, planeMaterial );
            plane.renderOrder = 1;
            plane.position.set(-1*m2 * m1, y * m1, z * m1);
            plane.rotateY(-Math.PI / 2);
            plane.name = "stickerO";
            planeCube.add(plane);
            planes.push(plane);
        }
    }
    // Red
    for (let y = -1; y < 2; y++) {
        for (let z = -1; z < 2; z++) {
            let planeMaterial = new THREE.MeshBasicMaterial( {color: colRed, side: THREE.DoubleSide} );
            let plane = new THREE.Mesh( planeGeometry, planeMaterial );
            plane.renderOrder = 1;
            plane.position.set(1*m2 * m1, y * m1, z * m1);
            plane.rotateY(-Math.PI / 2);
            plane.name = "stickerR";
            planeCube.add(plane);
            planes.push(plane);
        }
    }

    if (cubestyle !== "hollow") {
        scene.add(cube);
    }

    scene.add(planeCube);

    if (logo !== "") {
        let loader = new THREE.TextureLoader();

        loader.load(
            logo,
            logoTexture => {
                let logoMaterial = new THREE.MeshBasicMaterial({map: logoTexture});
                let logoPlane = new THREE.Mesh(planeGeometry, logoMaterial);

                logoPlane.position.x = 0;
                logoPlane.position.y = 1.525;
                logoPlane.position.z = 0;
                logoPlane.rotateX(-Math.PI / 2);
                logoPlane.name = "logo";
                scene.add(logoPlane);
                planes.push(logoPlane);
            }
        );
    }
    
    camera.position.x = 0;
    camera.position.y = 5;
    camera.position.z = 5;
    
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor( 0x000000, 0 );
    renderer.setSize($(cubePlayerDiv).parent().width(), $(cubePlayerDiv).parent().width());
    
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.rotateSpeed = 0.5;
    controls.enableRotate = useControls;
    
    rotateCamera('y', roty);
    rotateCamera('x', rotx, new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z - 1));
    
    $(cubePlayerDiv).empty();
    $(cubePlayerDiv).append( renderer.domElement );
    adjustSize();

    anim = false;
    animate();
}

function rotateCamera(axis, angle, target = new THREE.Vector3(0, 0, 0)) {
    const offset = camera.position.clone().sub(target); // vector from target to camera
    let radius, currentAngle, newAngle;

    switch (axis.toLowerCase()) {
        case 'y':
            radius = Math.sqrt(offset.x ** 2 + offset.z ** 2);
            currentAngle = Math.atan2(offset.x, offset.z);
            newAngle = currentAngle + angle;

            offset.x = radius * Math.sin(newAngle);
            offset.z = radius * Math.cos(newAngle);
            break;

        case 'x':
            radius = Math.sqrt(offset.y ** 2 + offset.z ** 2);
            currentAngle = Math.atan2(offset.y, offset.z);
            newAngle = currentAngle + angle;

            offset.y = radius * Math.sin(newAngle);
            offset.z = radius * Math.cos(newAngle);
            break;

        case 'z':
            radius = Math.sqrt(offset.x ** 2 + offset.y ** 2);
            currentAngle = Math.atan2(offset.y, offset.x);
            newAngle = currentAngle + angle;

            offset.x = radius * Math.cos(newAngle);
            offset.y = radius * Math.sin(newAngle);
            break;

        default:
            console.warn(`Unknown axis '${axis}' passed to rotateCamera`);
            return;
    }

    camera.position.copy(offset.add(target));
    camera.lookAt(target);
}

function animate() {
    requestAnimationFrame( animate );
    controls.update();

    renderer.render( scene, camera );
}

function resetState() {
    /* while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }
    $(cubePlayerDiv).empty();
    
    init();
    adjustSize();
    
    for (let m of scramble.split(" ")) {
        mv(m);
    } */

    if (movesApplied.length !== 0) {
        for (let m of inverseAlg(movesApplied.slice().join(" ")).split(" ")) {
            mv(m);
        }
        movesApplied = [];
    }
    /* for (let m of scramble.split(" ")) {
        mv(m);
    } */
}

function inverseAlg(alg) {
    let invAlg = "";
    
    if (alg.trim() === "") {
        return "";
    }
    let arr = [];
    
    for (let a of alg.split(" ")) {
        if (a.includes("'")) {
            arr.unshift(a.slice(0, -1));
        }
        else if (a.includes("2")) {
            arr.unshift(a);
        }
        else {
            arr.unshift(a + "'");
        }
    }
    invAlg = arr.join(" ");

    return invAlg;
}
            
function mv(turn) {
    movesApplied.push(turn);
    switch (turn) {
        case "R":
            doR();
            break;
        case "R'":
            doRi();
            break;
        case "R2":
            doR2();
            break;
        case "R2'":
            doR2i();
            break;
        case "L":
            doL();
            break;
        case "L'":
            doLi();
            break;
        case "L2":
            doL2();
            break;
        case "L2'":
            doL2i();
            break;
        case "F":
            doF();
            break;
        case "F'":
            doFi();
            break;
        case "F2":
            doF2();
            break;
        case "F2'":
            doF2i();
            break;
        case "B":
            doB();
            break;
        case "B'":
            doBi();
            break;
        case "B2":
            doB2();
            break;
        case "B2'":
            doB2i();
            break;
        case "U":
            doU();
            break;
        case "U'":
            doUi();
            break;
        case "U2":
            doU2();
            break;
        case "U2'":
            doU2i();
            break;
        case "D":
            doD();
            break;
        case "D'":
            doDi();
            break;
        case "D2":
            doD2();
            break;
        case "D2'":
            doD2i();
            break;
        case "x":
            doX();
            break;
        case "x'":
            doXi();
            break;
        case "x2":
            doX2();
            break;
        case "x2'":
            doX2i();
            break;
        case "y":
            doY();
            break;
        case "y'":
            doYi();
            break;
        case "y2":
            doY2();
            break;
        case "y2'":
            doY2i();
            break;
        case "z":
            doZ();
            break;
        case "z'":
            doZi();
            break;
        case "z2":
            doZ2();
            break;
        case "z2'":
            doZ2i();
            break;
        case "M":
            doM();
            break;
        case "M'":
            doMi();
            break;
        case "M2":
            doM2();
            break;
        case "M2'":
            doM2i();
            break;
        case "S":
            doS();
            break;
        case "S'":
            doSi();
            break;
        case "S2":
            doS2();
            break;
        case "S2'":
            doS2i();
            break;
        case "E":
            doE();
            break;
        case "E'":
            doEi();
            break;
        case "E2":
            doE2();
            break;
        case "E2'":
            doE2i();
            break;
        case "Rw":
        case "r":
            doRw();
            break;
        case "Rw'":
        case "r'":
            doRwi();
            break;
        case "Rw2":
        case "r2":
            doRw2();
            break;
        case "Rw2'":
        case "r2'":
            doRw2i();
            break;
        case "Lw":
        case "l":
            doLw();
            break;
        case "Lw'":
        case "l'":
            doLwi();
            break;
        case "Lw2":
        case "l2":
            doLw2();
            break;
        case "Lw2'":
        case "l2'":
            doLw2i();
            break;
        case "Fw":
        case "f":
            doFw();
            break;
        case "Fw'":
        case "f'":
            doFwi();
            break;
        case "Fw2":
        case "f2":
            doFw2();
            break;
        case "Fw2'":
        case "f2'":
            doFw2i();
            break;
        case "Bw":
        case "b":
            doBw();
            break;
        case "Bw'":
        case "b'":
            doBwi();
            break;
        case "Bw2":
        case "b2":
            doBw2();
            break;
        case "Bw2'":
        case "b2'":
            doBw2i();
            break;
        case "Uw":
        case "u":
            doUw();
            break;
        case "Uw'":
        case "u'":
            doUwi();
            break;
        case "Uw2":
        case "u2":
            doUw2();
            break;
        case "Uw2'":
        case "u2'":
            doUw2i();
            break;
        case "Dw":
        case "d":
            doDw();
            break;
        case "Dw'":
        case "d'":
            doDwi();
            break;
        case "Dw2":
        case "d2":
            doDw2();
            break;
        case "Dw2'":
        case "d2'":
            doDw2i();
            break;
    }
}

function checkIfSolved() {
/*     
    let planesU = planes.filter(p => p.name === "sticker").filter(c => {return c.getWorldPosition(new THREE.Vector3()).y > 1.1}).map(p => p.material.color.r + "" + p.material.color.g + "" + p.material.color.b);
    let planesL = planes.filter(p => p.name === "sticker").filter(c => {return c.getWorldPosition(new THREE.Vector3()).y < -1.1}).map(p => p.material.color.r + "" + p.material.color.g + "" + p.material.color.b);
    let planesF = planes.filter(p => p.name === "sticker").filter(c => {return c.getWorldPosition(new THREE.Vector3()).z > 1.1}).map(p => p.material.color.r + "" + p.material.color.g + "" + p.material.color.b);
    let planesR = planes.filter(p => p.name === "sticker").filter(c => {return c.getWorldPosition(new THREE.Vector3()).x > 1.1}).map(p => p.material.color.r + "" + p.material.color.g + "" + p.material.color.b);
    let planesB = planes.filter(p => p.name === "sticker").filter(c => {return c.getWorldPosition(new THREE.Vector3()).z < -1.1}).map(p => p.material.color.r + "" + p.material.color.g + "" + p.material.color.b);
    let planesD = planes.filter(p => p.name === "sticker").filter(c => {return c.getWorldPosition(new THREE.Vector3()).x < -1.1}).map(p => p.material.color.r + "" + p.material.color.g + "" + p.material.color.b);
 */
    let planesU = planes.filter(p => p.name.includes("sticker")).filter(c => {return c.getWorldPosition(new THREE.Vector3()).y > 1.1}).map(p => p.name);
    let planesL = planes.filter(p => p.name.includes("sticker")).filter(c => {return c.getWorldPosition(new THREE.Vector3()).y < -1.1}).map(p => p.name);
    let planesF = planes.filter(p => p.name.includes("sticker")).filter(c => {return c.getWorldPosition(new THREE.Vector3()).z > 1.1}).map(p => p.name);
    let planesR = planes.filter(p => p.name.includes("sticker")).filter(c => {return c.getWorldPosition(new THREE.Vector3()).x > 1.1}).map(p => p.name);
    let planesB = planes.filter(p => p.name.includes("sticker")).filter(c => {return c.getWorldPosition(new THREE.Vector3()).z < -1.1}).map(p => p.name);
    let planesD = planes.filter(p => p.name.includes("sticker")).filter(c => {return c.getWorldPosition(new THREE.Vector3()).x < -1.1}).map(p => p.name);
    
    if (
        planesU.filter(c => c === planesU[4]).length === 9 &&
        planesL.filter(c => c === planesL[4]).length === 9 &&
        planesF.filter(c => c === planesF[4]).length === 9 &&
        planesR.filter(c => c === planesR[4]).length === 9 &&
        planesB.filter(c => c === planesB[4]).length === 9 &&
        planesD.filter(c => c === planesD[4]).length === 9
    ) {
        if (solvedFunc !== "" && window[solvedFunc]) {
            window[solvedFunc]();
        }
    }
}

function doMv(cubies, xyz, angle) {
    let tempCube = new THREE.Object3D();
    
    scene.attach(tempCube);
    for (let cubie of cubies) {
        tempCube.attach(cubie);
    }
    
    if (anim) {
        tween = gsap.to(tempCube.rotation, {
            duration: playMoveTime / 1000,
            x: xyz === "x" ? angle : 0,
            y: xyz === "y" ? angle : 0,
            z: xyz === "z" ? angle : 0
        });
        setTimeout(checkIfSolved, playMoveTime);
    }
    else {
        tween = gsap.to(tempCube.rotation, {
            duration: 0,
            x: xyz === "x" ? angle : 0,
            y: xyz === "y" ? angle : 0,
            z: xyz === "z" ? angle : 0
        });
        checkIfSolved();
    }
}

function doR() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x > 1});
    doMv(c, "x", -Math.PI / 2);
}

function doRi() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x > 1});
    doMv(c, "x", Math.PI / 2);
}

function doR2() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x > 1});
    doMv(c, "x", -Math.PI);
}

function doR2i() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x > 1});
    doMv(c, "x", Math.PI);
}

function doL() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x < -1});
    doMv(c, "x", Math.PI / 2);
}

function doLi() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x < -1});
    doMv(c, "x", -Math.PI / 2);
}

function doL2() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x < -1});
    doMv(c, "x", Math.PI);
}

function doL2i() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x < -1});
    doMv(c, "x", -Math.PI);
}

function doU() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y > 1});
    doMv(c, "y", -Math.PI / 2);
}

function doUi() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y > 1});
    doMv(c, "y", Math.PI / 2);
}

function doU2() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y > 1});
    doMv(c, "y", -Math.PI);
}

function doU2i() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y > 1});
    doMv(c, "y", Math.PI);
}

function doD() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y < -1});
    doMv(c, "y", Math.PI / 2);
}

function doDi() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y < -1});
    doMv(c, "y", -Math.PI / 2);
}

function doD2() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y < -1});
    doMv(c, "y", Math.PI);
}

function doD2i() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y < -1});
    doMv(c, "y", -Math.PI);
}

function doF() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).z > 1});
    doMv(c, "z", -Math.PI / 2);
}

function doFi() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).z > 1});
    doMv(c, "z", Math.PI / 2);
}

function doF2() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).z > 1});
    doMv(c, "z", -Math.PI);
}

function doF2i() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).z > 1});
    doMv(c, "z", Math.PI);
}

function doB() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).z < -1});
    doMv(c, "z", Math.PI / 2);
}

function doBi() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).z < -1});
    doMv(c, "z", -Math.PI / 2);
}

function doB2() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).z < -1});
    doMv(c, "z", Math.PI);
}

function doB2i() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).z < -1});
    doMv(c, "z", -Math.PI);
}

function doX() {
    let c = planes;
    doMv(c, "x", -Math.PI / 2);
}

function doXi() {
    let c = planes;
    doMv(c, "x", Math.PI / 2);
}

function doX2() {
    let c = planes;
    doMv(c, "x", -Math.PI);
}

function doX2i() {
    let c = planes;
    doMv(c, "x", Math.PI);
}

function doY() {
    let c = planes;
    doMv(c, "y", -Math.PI / 2);
}

function doYi() {
    let c = planes;
    doMv(c, "y", Math.PI / 2);
}

function doY2() {
    let c = planes;
    doMv(c, "y", -Math.PI);
}

function doY2i() {
    let c = planes;
    doMv(c, "y", Math.PI);
}

function doZ() {
    let c = planes;
    doMv(c, "z", -Math.PI / 2);
}

function doZi() {
    let c = planes;
    doMv(c, "z", Math.PI / 2);
}

function doZ2() {
    let c = planes;
    doMv(c, "z", -Math.PI);
}

function doZ2i() {
    let c = planes;
    doMv(c, "z", Math.PI);
}

function doM() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x < 1 &&  cu.getWorldPosition(new THREE.Vector3()).x > -1});
    doMv(c, "x", Math.PI / 2);
}

function doMi() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x < 1 &&  cu.getWorldPosition(new THREE.Vector3()).x > -1});
    doMv(c, "x", -Math.PI / 2);
}

function doM2() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x < 1 &&  cu.getWorldPosition(new THREE.Vector3()).x > -1});
    doMv(c, "x", Math.PI);
}

function doM2i() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x < 1 &&  cu.getWorldPosition(new THREE.Vector3()).x > -1});
    doMv(c, "x", -Math.PI);
}

function doS() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).z < 1 &&  cu.getWorldPosition(new THREE.Vector3()).z > -1});
    doMv(c, "z", -Math.PI / 2);
}

function doSi() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).z < 1 &&  cu.getWorldPosition(new THREE.Vector3()).z > -1});
    doMv(c, "z", Math.PI / 2);
}

function doS2() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).z < 1 &&  cu.getWorldPosition(new THREE.Vector3()).z > -1});
    doMv(c, "z", -Math.PI);
}

function doS2i() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).z < 1 &&  cu.getWorldPosition(new THREE.Vector3()).z > -1});
    doMv(c, "z", Math.PI);
}

function doE() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y < 1 &&  cu.getWorldPosition(new THREE.Vector3()).y > -1});
    doMv(c, "y", Math.PI / 2);
}

function doEi() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y < 1 &&  cu.getWorldPosition(new THREE.Vector3()).y > -1});
    doMv(c, "y", -Math.PI / 2);
}

function doE2() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y < 1 &&  cu.getWorldPosition(new THREE.Vector3()).y > -1});
    doMv(c, "y", Math.PI);
}

function doE2i() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y < 1 &&  cu.getWorldPosition(new THREE.Vector3()).y > -1});
    doMv(c, "y", -Math.PI);
}

function doRw() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x > -1});
    doMv(c, "x", -Math.PI / 2);
}

function doRwi() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x > -1});
    doMv(c, "x", Math.PI / 2);
}

function doRw2() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x > -1});
    doMv(c, "x", -Math.PI);
}

function doRw2i() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x > -1});
    doMv(c, "x", Math.PI);
}

function doLw() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x < 1});
    doMv(c, "x", Math.PI / 2);
}

function doLwi() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x < 1});
    doMv(c, "x", -Math.PI / 2);
}

function doLw2() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x < 1});
    doMv(c, "x", Math.PI);
}

function doLw2i() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).x < 1});
    doMv(c, "x", -Math.PI);
}

function doUw() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y > -1});
    doMv(c, "y", -Math.PI / 2);
}

function doUwi() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y > -1});
    doMv(c, "y", Math.PI / 2);
}

function doUw2() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y > -1});
    doMv(c, "y", -Math.PI);
}

function doUw2i() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y > -1});
    doMv(c, "y", Math.PI);
}

function doDw() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y < 1});
    doMv(c, "y", Math.PI / 2);
}

function doDwi() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y < 1});
    doMv(c, "y", -Math.PI / 2);
}

function doDw2() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y < 1});
    doMv(c, "y", Math.PI);
}

function doDw2i() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).y < 1});
    doMv(c, "y", -Math.PI);
}

function doFw() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).z > -1});
    doMv(c, "z", -Math.PI / 2);
}

function doFwi() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).z > -1});
    doMv(c, "z", Math.PI / 2);
}

function doFw2() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).z > -1});
    doMv(c, "z", -Math.PI);
}

function doFw2i() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).z > -1});
    doMv(c, "z", Math.PI);
}

function doBw() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).z < 1});
    doMv(c, "z", Math.PI / 2);
}

function doBwi() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).z < 1});
    doMv(c, "z", -Math.PI / 2);
}

function doBw2() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).z < 1});
    doMv(c, "z", Math.PI);
}

function doBw2i() {
    let c = planes.filter(cu => {return cu.getWorldPosition(new THREE.Vector3()).z < 1});
    doMv(c, "z", -Math.PI);
}

function adjustSize() {
    if ($("body").width() >= $("body").height()) {
        $(cubePlayerDiv).css("height", cubePlayerHeight);
        $(cubePlayerDiv).css("width", cubePlayerHeight);
        renderer.setSize(cubePlayerHeight, cubePlayerHeight);
    }
    else {
        $(cubePlayerDiv).css("width", cubePlayerWidth);
        $(cubePlayerDiv).css("height", cubePlayerWidth);
        renderer.setSize(cubePlayerWidth, cubePlayerWidth);
    }
    renderer.setPixelRatio(window.devicePixelRatio);
    
    $(buttonDiv).css("width", $(cubePlayerDiv).width());
    $(buttonDiv).css("z-index", "0");
    $(buttonDiv).css("text-align", "center");
    $(button).css("position", "relative");
    $(button).css("z-index", "1");
    $(button).css("min-width", $(cubePlayerDiv).width() * 0.2);
    $(button).css("margin", "auto");
    $(nextbutton).css("position", "relative");
    $(nextbutton).css("z-index", "1");
    $(nextbutton).css("min-width", $(cubePlayerDiv).width() * 0.2);
    $(nextbutton).css("margin", "auto");
    $(smartcubeButton).css("position", "relative");
    $(smartcubeButton).css("z-index", "1");
    $(smartcubeButton).css("min-width", $(cubePlayerDiv).width() * 0.2);
    $(smartcubeButton).css("margin", "auto");

    $(buttonDiv).css("display", "grid");
    $(buttonDiv).css("grid-template-columns", ("1fr ").repeat($(buttonDiv.children.length)));

    $("cube-player canvas").css("outline", "none");
}

function isColor(color) {
    return /^#([0-9a-f]{3}){1,2}$/i.test(color);
}

async function connectSmartCube(sc) {
    switch (sc) {
        case "giiker":
            try {
                const giiker = await connect()
                .then(() => {
                    $(smartcubeButton).css("display", "none");
                    alert("Giiker cube connected");
                });
                setVirtualCube(true);

                giiker.on('connected', () => {
                    alert("Giiker cube connected");
                });

                giiker.on('move', (move) => {
                    
                });

                giiker.on('disconnected', () => {
                    alert("Giiker cube disconnected");
                    $(smartcubeButton).css("display", "block");
                })
            
            }
            catch(e) {
                
            }
            break;
    }
}

customElements.define("cube-player", CubePlayer);

/* Giiker */
const SERVICE_UUID = '0000aadb-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '0000aadc-0000-1000-8000-00805f9b34fb';

const SYSTEM_SERVICE_UUID = '0000aaaa-0000-1000-8000-00805f9b34fb';
const SYSTEM_READ_UUID = '0000aaab-0000-1000-8000-00805f9b34fb';
const SYSTEM_WRITE_UUID = '0000aaac-0000-1000-8000-00805f9b34fb';

// face indices
const B = 0;
const D = 1;
const L = 2;
const U = 3;
const R = 4;
const F = 5;

const faces = ['B', 'D', 'L', 'U', 'R', 'F'];

// color indices
const b = 0;
const y = 1;
const o = 2;
const w = 3;
const r = 4;
const g = 5;

const giikerColors = ['blue', 'yellow', 'orange', 'white', 'red', 'green'];

const turns = {
  0: 1,
  1: 2,
  2: -1,
  8: -2,
};

const cornerColors = [
  [y, r, g],
  [r, w, g],
  [w, o, g],
  [o, y, g],
  [r, y, b],
  [w, r, b],
  [o, w, b],
  [y, o, b]
];

const cornerLocations = [
  [D, R, F],
  [R, U, F],
  [U, L, F],
  [L, D, F],
  [R, D, B],
  [U, R, B],
  [L, U, B],
  [D, L, B]
];

const edgeLocations = [
  [F, D],
  [F, R],
  [F, U],
  [F, L],
  [D, R],
  [U, R],
  [U, L],
  [D, L],
  [B, D],
  [B, R],
  [B, U],
  [B, L]
];

const edgeColors = [
  [g, y],
  [g, r],
  [g, w],
  [g, o],
  [y, r],
  [w, r],
  [w, o],
  [y, o],
  [b, y],
  [b, r],
  [b, w],
  [b, o]
];

class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(label, callback) {
    if (!this.listeners[label]) {
      this.listeners[label] = [];
    }
    this.listeners[label].push(callback);
  }

  off(label, callback) {
    let listeners = this.listeners[label];

    if (listeners && listeners.length > 0) {
      let index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
        this.listeners[label] = listeners;
        return true;
      }
    }
    return false;
  }

  emit(label, ...args) {
    let listeners = this.listeners[label];

    if (listeners && listeners.length > 0) {
      listeners.forEach((listener) => {
        listener(...args);
      });
      return true;
    }
    return false;
  }
}

class Giiker extends EventEmitter {
  constructor() {
    super();
    this._onCharacteristicValueChanged = this._onCharacteristicValueChanged.bind(this);
    this._onDisconnected = this._onDisconnected.bind(this);
  }

  async connect() {
    if (!window.navigator) {
      throw new Error('window.navigator is not accesible. Maybe you\'re running Node.js?');
    }

    if (!window.navigator.bluetooth) {
      throw new Error('Web Bluetooth API is not accesible');
    }

    const device = await window.navigator.bluetooth.requestDevice({
      filters: [{
        namePrefix: 'Gi',
      }],
      optionalServices: [SERVICE_UUID, SYSTEM_SERVICE_UUID],
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE_UUID);
    const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);
    await characteristic.startNotifications();
    const value = await characteristic.readValue();
    this._state = this._parseCubeValue(value).state;
    characteristic.addEventListener('characteristicvaluechanged', this._onCharacteristicValueChanged);

    this._systemService = await server.getPrimaryService(SYSTEM_SERVICE_UUID);

    device.addEventListener('gattserverdisconnected', this._onDisconnected);

    this._device = device;
  }

	/**
	 * Disconnects from the GiiKER cube. Will fire the `disconnected` event once done.
	 */
  disconnect() {
    if (!this._device) {
      return;
    }
    this._device.gatt.disconnect();
  }

  _onDisconnected() {
    this._device = null;
    this.emit('disconnected');
  }

  /**
   * Returns a promise that will resolve to the battery level
   */
  async getBatteryLevel () {
    const readCharacteristic = await this._systemService.getCharacteristic(SYSTEM_READ_UUID);
    const writeCharacteristic = await this._systemService.getCharacteristic(SYSTEM_WRITE_UUID);
    await readCharacteristic.startNotifications();
    const data = new Uint8Array([0xb5]).buffer;
    writeCharacteristic.writeValue(data);

    return new Promise((resolve) => {
      const listener = (event) => {
        const value = event.target.value;
        readCharacteristic.removeEventListener('characteristicvaluechanged', listener);
        readCharacteristic.stopNotifications();
        resolve(value.getUint8(1));
      };
      readCharacteristic.addEventListener('characteristicvaluechanged', listener);
    });
  }

  /**
   * Returns the current state of the cube as arrays of corners and edges.
	 *
	 * Example how to interpret the state:
	 *
	 * Corner:
	 * ```
	 *   {
	 *     position: ['D', 'R', 'F'],
	 *     colors: ['yellow', 'red', 'green']
	 *   }
	 * ```
	 * The corner in position DRF has the colors yellow on D, red on R and green ON F.
	 *
	 * Edge:
	 * ```
	 *   {
	 *     position: ['F', 'U'],
	 *     colors: ['green', 'white']
	 *   }
	 * ```
	 * The edge in position FU has the colors green on F and white on U.
   */
  get state() {
    const state = {
      corners: [],
      edges: []
    };
    this._state.cornerPositions.forEach((cp, index) => {
      const mappedColors = this._mapCornerColors(
        cornerColors[cp - 1],
        this._state.cornerOrientations[index],
        index
      );
      state.corners.push({
        position: cornerLocations[index].map((f) => faces[f]),
        colors: mappedColors.map((c) => giikerColors[c])
      });
    });
    this._state.edgePositions.forEach((ep, index) => {
      const mappedColors = this._mapEdgeColors(
        edgeColors[ep - 1],
        this._state.edgeOrientations[index]
      );
      state.edges.push({
        position: edgeLocations[index].map((f) => faces[f]),
        colors: mappedColors.map((c) => giikerColors[c])
      });
    });
    return state;
  }

  /**
   * Returns the current state of the cube as a string compatible with cubejs.
	 *
	 * See https://github.com/ldez/cubejs#cubefromstringstr
   */
  get stateString() {
    const cornerFaceIndices = [
      [29, 15, 26],
      [9, 8, 20],
      [6, 38, 18],
      [44, 27, 24],
      [17, 35, 51],
      [2, 11, 45],
      [36, 0, 47],
      [33, 42, 53]
    ];

    const edgeFaceIndices = [
      [25, 28],
      [23, 12],
      [19, 7],
      [21, 41],
      [32, 16],
      [5, 10],
      [3, 37],
      [30, 43],
      [52, 34],
      [48, 14],
      [46, 1],
      [50, 39]
    ];

    const colorFaceMapping = {
      blue: 'B',
      yellow: 'D',
      orange: 'L',
      white: 'U',
      red: 'R',
      green: 'F'
    };

    const state = this.state;
    const faces = [];

    state.corners.forEach((corner, cornerIndex) => {
      corner.position.forEach((face, faceIndex) => {
        faces[cornerFaceIndices[cornerIndex][faceIndex]] = colorFaceMapping[corner.colors[faceIndex]];
      });
    });

    state.edges.forEach((edge, edgeIndex) => {
      edge.position.forEach((face, faceIndex) => {
        faces[edgeFaceIndices[edgeIndex][faceIndex]] = colorFaceMapping[edge.colors[faceIndex]];
      });
    });

    faces[4] = 'U';
    faces[13] = 'R';
    faces[22] = 'F';
    faces[31] = 'D';
    faces[40] = 'L';
    faces[49] = 'B';

    return faces.join('');
  }

  _onCharacteristicValueChanged(event) {
    const value = event.target.value;
    const {state, moves} = this._parseCubeValue(value);
    this._state = state;
    this.emit('move', moves[0]);
    
    mv(moves[0].notation);
  }

  _parseCubeValue (value) {
    const state = {
      cornerPositions: [],
      cornerOrientations: [],
      edgePositions: [],
      edgeOrientations: []
    };
    const moves = [];
    if (value.getUint8(18) == 0xa7) { // decrypt
	    var key = [176, 81, 104, 224, 86, 137, 237, 119, 38, 26, 193, 161, 210, 126, 150, 81, 93, 13, 236, 249, 89, 235, 88, 24, 113, 81, 214, 131, 130, 199, 2, 169, 39, 165, 171, 41];
            var k = value.getUint8(19);
            var k1 = k >> 4 & 0xf;
            var k2 = k & 0xf;
	    for (let i = 0; i < value.byteLength; i++) {
		    const move = (value.getUint8(i) + key[i + k1] + key[i + k2]) & 0xff;
		    const highNibble = move >> 4;
		    const lowNibble = move & 0b1111;
		    if (i < 4) {
			    state.cornerPositions.push(highNibble, lowNibble);
		    } else if (i < 8) {
			    state.cornerOrientations.push(highNibble, lowNibble);
		    } else if (i < 14) {
			    state.edgePositions.push(highNibble, lowNibble);
		    } else if (i < 16) {
			    state.edgeOrientations.push(!!(move & 0b10000000));
			    state.edgeOrientations.push(!!(move & 0b01000000));
			    state.edgeOrientations.push(!!(move & 0b00100000));
			    state.edgeOrientations.push(!!(move & 0b00010000));
			    if (i === 14) {
				    state.edgeOrientations.push(!!(move & 0b00001000));
				    state.edgeOrientations.push(!!(move & 0b00000100));
				    state.edgeOrientations.push(!!(move & 0b00000010));
				    state.edgeOrientations.push(!!(move & 0b00000001));
			    }
		    } else {
			    moves.push(this._parseMove(highNibble, lowNibble));
		    }
	    }
    }
     else { // not encrypted
	     for (let i = 0; i < value.byteLength; i++) {
		     const move = value.getUint8(i)
		     const highNibble = move >> 4;
		     const lowNibble = move & 0b1111;
		     if (i < 4) {
			     state.cornerPositions.push(highNibble, lowNibble);
		     } else if (i < 8) {
			     state.cornerOrientations.push(highNibble, lowNibble);
		     } else if (i < 14) {
			     state.edgePositions.push(highNibble, lowNibble);
		     } else if (i < 16) {
			     state.edgeOrientations.push(!!(move & 0b10000000));
			     state.edgeOrientations.push(!!(move & 0b01000000));
			     state.edgeOrientations.push(!!(move & 0b00100000));
			     state.edgeOrientations.push(!!(move & 0b00010000));
			     if (i === 14) {
				     state.edgeOrientations.push(!!(move & 0b00001000));
				     state.edgeOrientations.push(!!(move & 0b00000100));
				     state.edgeOrientations.push(!!(move & 0b00000010));
				     state.edgeOrientations.push(!!(move & 0b00000001));
			     }
		     } else {
			     moves.push(this._parseMove(highNibble, lowNibble));
		     }
	     } 
     }
    return {state, moves};
  }

  _parseMove (faceIndex, turnIndex) {
    const face = faces[faceIndex - 1];
    const amount = turns[turnIndex - 1];
    let notation = face;

    switch (amount) {
      case 2: notation = `${face}2`; break;
      case -1: notation = `${face}'`; break;
      case -2: notation = `${face}2'`; break;
    }

    return {face, amount, notation};
  }

  _mapCornerColors(colors, orientation, position) {
    const actualColors = [];

    if (orientation !== 3) {
      if (position === 0 || position === 2 || position === 5 || position === 7) {
        orientation = 3 - orientation;
      }
    }

    switch (orientation) {
      case 1:
        actualColors[0] = colors[1];
        actualColors[1] = colors[2];
        actualColors[2] = colors[0];
        break;
      case 2:
        actualColors[0] = colors[2];
        actualColors[1] = colors[0];
        actualColors[2] = colors[1];
        break;
      case 3:
        actualColors[0] = colors[0];
        actualColors[1] = colors[1];
        actualColors[2] = colors[2];
        break;
    }
    return actualColors;
  }

  _mapEdgeColors (colors, orientation) {
    const actualColors = [...colors];
    if (orientation) {
      actualColors.reverse();
    }
    return actualColors;
  }
}

const connect = async () => {
  const giiker = new Giiker();
  await giiker.connect();
  return giiker;
};

function commToAlg(comm) {
    let nComm = [];

    comm = comm.trim();
    comm = comm.replaceAll("][", "] [");
    if (comm.includes("(")) {
        let c = comm.split("(");
        let c1 = c[0];
        let c2 = c[1].split(")")[0];
        let n = comm.match(/([0-9]+)([^0-9]+)/)[1];
        let c3 = comm.match(/([0-9]+)([^0-9]+)/)[2];
        comm = [c1, algXN(c2, n), c3].join(" ").trim();
    }

    comm = comm.replace(/\,/g, " comma ");
    comm = comm.replace(/\:/g, " colon ");
    comm = comm.replace(/\]\s/g, "], ");
    comm = "[" + comm + "]";
    comm = comm.replace(/[^\[\]\,\s]+/g, "\"$&\"");
    comm = comm.replace(/" /g, "\", ");
    
    let commArr = JSON.parse(comm);

    for (let c of commArr) {
        nComm.push(expandComm(c));
    }

    return nComm.join(" ");

    function algXN(alg, n) {
        let nAlg = [];
        for (let i = 0; i < n; i++) {
            nAlg.push(alg.trim());
        }
        return cleanMoves("[" + nAlg.join(" ") + "]");
    }

    function expandComm(c) {
        let newComm;

        if (c.includes("comma") || c.includes("colon")) {
            if (c.filter(co => typeof co === "object").length > 0) {
                let nC = [];
                for (let c1 of c) {
                    if (typeof c1 === "object") {
                        nC.push(expandComm(c1));
                    }
                    else {
                        nC.push(c1);
                    }
                }
                c = nC;
            }
            
            if (c.includes("comma")) {
                let c1 = c.slice(0, c.indexOf("comma")).join(" ");
                let c2 = c.slice(c.indexOf("comma") + 1).join(" ");
                let c3 = inverseAlg(c1);
                let c4 = inverseAlg(c2);
                newComm = cleanMoves([c1, c2, c3, c4].join(" "));
            }
            else if (c.includes("colon")) {
                let c1 = c.slice(0, c.indexOf("colon")).join(" ");
                let c2 = c.slice(c.indexOf("colon") + 1).join(" ");
                let c3 = inverseAlg(c1);
                newComm = cleanMoves([c1, c2, c3].join(" "));
            }
        }
        else {
            newComm = typeof c === "object" ? cleanMoves(c.join(" ")) : c;
        }
        
        return newComm;
    }

    function cleanMoves(moves) {
        moves = moves.trim();
        moves = moves.replaceAll(" ", ";");
    
        while (moves.includes(";;")) {
            moves = moves.replaceAll(";;", ";");
        }
    
        return moves.replaceAll(";", " ");
    }
}