window.location = "https://einarkl.no" + location.pathname;
function rateAlg(moves) {
    let allMoves = [["U", "D", "E", "y"], ["R", "L", "M", "x"], ["F", "B", "S", "z"]];

    let moveArr = moves.trim().split(" ");
    let len = moveArr.length;
    let result = len;
    let regripState = {
        "U": 0,
        "D": 0,
        "R": 0,
        "L": 0,
        "F": 0,
        "B": 0,
    };

    function axis(m) {
        if (m === "U" || m === "D" || m === "E" || m === "Y") {
            return 0;
        }
        else if (m === "R" || m === "L" || m === "M" || m === "X") {
            return 1;
        }
        else if (m === "F" || m === "B" || m === "S" || m === "Z") {
            return 2;
        }
    }

    function isRotation(m) {
        return (m === "X" || m === "Y" || m === "Z");
    }

    function isSlice(m) {
        return (m === "M" || m === "E" || m === "S");
    }

    function isBadMove(m) {
        return (m === "D" || m === "B" || m === "L");
    }

    function checkRegrip(m) {
        if (m === "F") {
            if (regripState["R"] % 4 === 0 || regripState["R"] % 4 === 2) {
                result -= 5*len/100;
            }
            else if (regripState["R"] % 4 === 1) {
                result -= 2*len/100;
            }
        }
        else if (m === "B") {
            if (regripState["R"] % 4 === 0 || regripState["R"] % 4 === 2) {
                result -= 5*len/100;
            }
            else if (regripState["R"] % 4 === 3) {
                result -= 2*len/100;
            }
        }
        else if (m === "R" && regripState["R"] % 4 === 2) {
            result -= 5*len/100;
        }
        else if (m === "L" && regripState["L"] % 4 === 2) {
            result -= 5*len/100;
        }
    }

    for (let i = 0; i < len; i++) {
        let mv = moveArr[i].toUpperCase();
        let m = mv[0];
        let me = mv.length === 1 || mv.includes("w") ? "*" : mv[mv.length - 1];

        if (isRotation(m)) {
            result -= (me === "2" ? 2 : 1) * len / 100;

            regripState = {
                "U": 0,
                "D": 0,
                "R": 0,
                "L": 0,
                "F": 0,
                "B": 0,
            };
        }
        else if (isBadMove(m)) {
            regripState[m] += me === "*" ? 3 : me === "2" ? 2 : 1;
        }
        else {
            regripState[m] += me === "*" ? 1 : me === "2" ? 2 : 3;
        }
        
        checkRegrip(m);

        if (i >= 1) {
            let pmv = moveArr[i - 1];
            let pm = pmv[0];
            let pme = pmv.length === 1 || pmv.includes("W") ? "*" : pmv[pmv.length - 1];

            if (axis(m) === axis(pm)) {
                if (me === pme) {
                    result -= 10*axis(m)*len/100;
                }
                else {
                    result -= 5*axis(m)*len/100;
                }
            }
            
            if (i >= 2) {
                let ppmv = moveArr[i - 2];
                let ppm = ppmv[0];
                let ppme = ppmv.length === 1 || ppmv.includes("W") ? "*" : ppmv[ppmv.length - 1];
            
                if (axis(m) === axis(ppm) && axis(m) !== 0 && m !== ppm) {
                    result -= 10*len/100;
                }
            }
        }
    }

    $("#result").text("Score: " + (result*100/len).toFixed(2));
}