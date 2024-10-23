window.location = "https://einarkl.no" + location.pathname;
function inverseAlg(alg) {
    let invAlg = "";

    if (alg.trim() === "") {
        return "Type in an alg";
    }
    else if (alg.includes("[") || alg.includes("]") || alg.includes(":") || alg.includes(",")) {
        invAlg = inverseComm(alg);
    }
    else {
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
    }

    return invAlg;
}

function inverseComm(alg) {
    let invAlg = "";
    let leftBrackets = 0;
    let rightBrackets = 0;
    let colons = 0;
    let commas = 0;

    for (let a of alg) {
        if (a === "[") {
            leftBrackets++;
        }
        else if (a === "]") {
            rightBrackets++;
        }
        else if (a === ":") {
            colons++;
        }
        else if (a === ",") {
            commas++;
        }
    }

    if (leftBrackets !== rightBrackets || commas > leftBrackets || colons > leftBrackets || (alg[0] !== "[" && alg[alg.length - 1] !== "]")
        || (colons === commas && colons === leftBrackets)) {
        return "Illegal alg";
    }
console.log(alg);
    alg = alg.slice(1, alg.length - 1);
console.log(alg);
    let ABCBCABCBC = alg.match(/(.*)\,\ \[(.*)\,(.*)\]/);
    let ABAB = alg.match(/(.*)\,(.*)/);
    let ABCBCA = alg.match(/(.*)\:\ \[(.*)\,(.*)\]/);
    let ABA = alg.match(/(.*)\:(.*)/);
    
    if (ABCBCABCBC) {
        console.log(ABCBCABCBC);
        tempAlg = alg;
        invAlg = "[" + tempAlg.replace(alg.split(",")[0] + ",", "").trim() + ", " + alg.split(",")[0].trim() + "]";
    }
    else if (ABCBCA) {
        console.log(ABCBCA);
        tempAlg = alg;
        invAlg = "[" + ABCBCA[1].trim() + ": " + inverseAlg(tempAlg.replace(ABCBCA[1] + ":", "").trim()) + "]";
    }
    else if (ABAB) {
        console.log(ABAB);
        invAlg = "[" + ABAB[2].trim() + ", " + ABAB[1].trim() + "]";
    }
    else if (ABA) {
        console.log(ABA);
        invAlg = "[" + ABA[1].trim() + ": " + inverseAlg(ABA[2].trim()) + "]";
    }

    return invAlg;
}