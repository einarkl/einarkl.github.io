const solveOrientations = ["", "x", "x2", "x'", "z", "z'"];
const solvedState = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const solvedCrossState = [8, 9, 10, 11, 0, 0, 0, 0];

let scrambleQueue = [];
const MAX_SCRAMBLE_QUEUE_SIZE = 5;

let scrambleType = "3x3";

$(() => {
    scrambleQueue = [];
    for (let i = 0; i < MAX_SCRAMBLE_QUEUE_SIZE; i++) {
        getScramble().then(scramble => scrambleQueue.push(scramble));
    }
    nextScramble();
});

function copyScramble() {
    const scrambleText = $('#scrambleDisplay h2').text();
    navigator.clipboard.writeText(scrambleText)
        .then(() => alert('Scramble copied!'))
        .catch(err => console.error('Error copying scramble: ', err));
}

function selectScrambleType() {
    $('#scrambleDisplay').html("<h2>Loading...</h2>");
    scrambleType = $("#scrambleType").val();
    scrambleQueue = []; // Clear the scramble queue immediately

    refillScrambleQueue().then(() => {
        nextScramble(); // Display the first scramble from the newly filled queue
    });
}

async function refillScrambleQueue() {
    let refillPromises = [];
    for (let i = scrambleQueue.length; i < MAX_SCRAMBLE_QUEUE_SIZE; i++) {
        refillPromises.push(getScramble());
    }

    const newScrambles = await Promise.all(refillPromises);
    // Only add the newly generated scrambles if the queue isn't full yet.
    newScrambles.forEach(scramble => {
        if (scrambleQueue.length < MAX_SCRAMBLE_QUEUE_SIZE) {
            scrambleQueue.push(scramble);
        }
    });
}

function nextScramble() {
    if (scrambleQueue.length > 0) {
        const nextScramble = scrambleQueue.shift(); // Remove the first scramble from the queue
        $('#scrambleDisplay').html("<h2>" + nextScramble + "</h2>"); // Update the UI with the next scramble
        refillScrambleQueue(); // Ensure the queue is refilled after taking one out
    } else {
        // This should rarely happen, but if the queue is empty, we attempt to refill it.
        refillScrambleQueue().then(() => {
            if (scrambleQueue.length > 0) {
                const nextScramble = scrambleQueue.shift();
                $('#scrambleDisplay').html("<h2>" + nextScramble + "</h2>");
            }
        });
    }
}

function getScramble() {
    return new Promise(resolve => {
        let scr = "Coming soon...";
        // Array of standard NxN scrambles
        const nxnScrambles = ["3x3", "2x2", "4x4", "5x5", "6x6", "7x7"];
        if (nxnScrambles.includes(scrambleType)) {
            scr = getScrambleNxN(parseInt(scrambleType.split("x")[0]));
        }
        else {
            switch (scrambleType) {
                case "Clock":
                    scr = getScrambleClock(false);
                    break;
                case "Megaminx":
                    scr = getScrambleMega();
                    break;
                case "Pyraminx":
                    scr = getScramblePyra();
                    break;
                case "Skewb":
                    scr = getScrambleSkewb();
                    break;
                case "Square-1":
                    scr = getScrambleSq1();
                    break;
                case "3x3 Hard":
                    scr = getHardScramble();
                    break;
                default:
                    break;
            }
        }
        resolve(scr);
    });
}

function getHardScramble() {
    let scramble = "";
    let hard = false;

    while (!hard) {
        scramble = getScrambleNxN(3);
        hard = isHard(scramble);
    }

    return scramble;
}

function isHard(scramble) {
    for (let o of solveOrientations) {
        let convertedScramble = getMovesWithoutRotations((o + " " + scramble).trim());
        if (letterifyArray(getCrossState(convertedScramble)) in crossTable) {
            return false;
        }
    }
    return true;
}

function getCrossState(scramble) {
    let cube = [...solvedState];
    let scr = scramble.split(" ");

    scr.forEach(s => {
        let nCube = moveMap[s];
        if (nCube !== undefined) {
            let cube2 = [...cube];

            // Orientation
            for (let j = 20; j < 28; j++) {
                cube[j] = (cube2[nCube[j - 20] + 20] + nCube[j]) % 3;
            }
            for (let j = 28; j < 40; j++) {
                cube[j] = (cube2[nCube[j - 20] + 20] + nCube[j]) % 2;
            }
            // Permutation
            for (let j = 0; j < 20; j++) {
                cube[j] = cube2[nCube[j]];
            }
        }
    });

    let nCube = new Array(8);
    let j = 0;
    [8, 9, 10, 11].forEach(i => {
        let ni = cube.indexOf(i);
        nCube[j] = ni;
        nCube[j + 4] = cube[ni + 20];
        j++;
    });

    return nCube;
}

function letterifyArray(arr) {
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    let str = "";

    for (let i = 0; i < arr.length; i++) {
        str += letters[arr[i]];
    }

    return str;
}

const moveMap = {
    "R": [0, 2, 5, 3, 4, 6, 1, 7, 8, 17, 10, 11, 12, 18, 14, 15, 16, 13, 9, 19, 0, 1, 2, 0,
        0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "L": [7, 1, 2, 0, 3, 5, 6, 4, 8, 9, 10, 19, 12, 13, 14, 16, 11, 17, 18, 15, 2, 0, 0, 1,
        2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "U": [3, 0, 1, 2, 4, 5, 6, 7, 11, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "D": [0, 1, 2, 3, 7, 4, 5, 6, 8, 9, 10, 11, 15, 12, 13, 14, 16, 17, 18, 19, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "F": [0, 1, 3, 4, 5, 2, 6, 7, 8, 9, 16, 11, 17, 13, 14, 15, 12, 10, 18, 19, 0, 0, 1, 2,
        1, 2, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0],
    "B": [1, 6, 2, 3, 4, 5, 7, 0, 18, 9, 10, 11, 12, 13, 19, 15, 16, 17, 14, 8, 1, 2, 0, 0,
        0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 7, 0, 0, 0, 1, 1],

    "R'": [0, 6, 1, 3, 4, 2, 5, 7, 8, 18, 10, 11, 12, 17, 14, 15, 16, 9, 13, 19, 0, 1, 2, 0,
        0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "L'": [3, 1, 2, 4, 7, 5, 6, 0, 8, 9, 10, 16, 12, 13, 14, 19, 15, 17, 18, 11, 2, 0, 0, 1,
        2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "U'": [1, 2, 3, 0, 4, 5, 6, 7, 9, 10, 11, 8, 12, 13, 14, 15, 16, 17, 18, 19, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "D'": [0, 1, 2, 3, 5, 6, 7, 4, 8, 9, 10, 11, 13, 14, 15, 12, 16, 17, 18, 19, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "F'": [0, 1, 5, 2, 3, 4, 6, 7, 8, 9, 17, 11, 16, 13, 14, 15, 10, 12, 18, 19, 0, 0, 1, 2,
        1, 2, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0],
    "B'": [7, 0, 2, 3, 4, 5, 1, 6, 19, 9, 10, 11, 12, 13, 18, 15, 16, 17, 8, 14, 1, 2, 0, 0,
        0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 7, 0, 0, 0, 1, 1],

    "R2": [0, 5, 6, 3, 4, 1, 2, 7, 8, 13, 10, 11, 12, 9, 14, 15, 16, 18, 17, 19, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "L2": [4, 1, 2, 7, 0, 5, 6, 3, 8, 9, 10, 15, 12, 13, 14, 11, 19, 17, 18, 16, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "U2": [2, 3, 0, 1, 4, 5, 6, 7, 10, 11, 8, 9, 12, 13, 14, 15, 16, 17, 18, 19, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "D2": [0, 1, 2, 3, 6, 7, 4, 5, 8, 9, 10, 11, 14, 15, 12, 13, 16, 17, 18, 19, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "F2": [0, 1, 4, 5, 2, 3, 6, 7, 8, 9, 12, 11, 10, 13, 14, 15, 17, 16, 18, 19, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "B2": [6, 7, 2, 3, 4, 5, 0, 1, 14, 9, 10, 11, 12, 13, 8, 15, 16, 17, 19, 18, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}