let initializedScripts = false;

export function initScripts() {
    let urls = ["https://code.jquery.com/jquery-3.6.0.min.js", "https://einarkl.no/Kubing/Tools/tools.js"];
    for (let url of urls) {
        let script = document.createElement('script');
        script.setAttribute('src', url);
    
        let scripts = [];
        for (let s of document.head.getElementsByTagName("script")) {
            scripts.push(s.src);
        }
        
        if (!scripts.includes(url)) {
            document.head.appendChild(script);
        }
    }
}

export class EinarDrawScramble extends HTMLElement {
    constructor() {
        super();
        this.initialized = false;
    }

    connectedCallback() {
        initScripts();
        setTimeout(() => {
            let id = "svgEinarDrawScramble_" + (this.getAttribute("id") ? this.getAttribute("id") : "");
            let puzzle = this.getAttribute("puzzle") ? getPuzzle(this.getAttribute("puzzle")) : "3x3";
            let scramble = this.getAttribute("scramble") ? this.getAttribute("scramble") : "";
            let flags = this.getAttribute("flags") ? this.getAttribute("flags") : "";

            let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("id", id);
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");
            this.appendChild(svg);
            this.setAttribute("width", "100%");
            this.setAttribute("height", "100%");

            drawScramble("#" + id, puzzle, scramble, flags);
            this.initialized = true;
        }, 500);
    }
    
    static get observedAttributes() {
        return ["puzzle", "scramble", "flags"];
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        if (this.initialized) {
            let id = "svgEinarDrawScramble_" + (this.getAttribute("id") ? this.getAttribute("id") : "");
            let puz = this.getAttribute("puzzle") ? getPuzzle(this.getAttribute("puzzle")) : "3x3";
            let scr = this.getAttribute("scramble") ? this.getAttribute("scramble") : "";
            let flags = this.getAttribute("flags") ? this.getAttribute("flags") : "";
            drawScramble("#" + id, puz, scr, flags);
        }
    }
}

function getPuzzle(puzzle) {
    if (["3x3", "2x2", "4x4", "5x5", "6x6", "7x7", "skewb", "pyraminx", "megaminx", "clock", "square-1", "sq1"].indexOf(puzzle) !== -1) {
        return puzzle;
    }
    else {
        return "3x3";
    }
}

function drawScramble(id, puzzle, scramble, flags) {
    resetDrawSvg(id);
    let functions = [drawScrambleSkewb, drawScramblePyraminx, drawScrambleMegaminx, drawScrambleClock, drawScrambleSq1, drawScrambleSq1];
    let n = NaN;
    if (puzzle.split("x").length === 2 && puzzle.split("x")[0] === puzzle.split("x")[1]) {
        n = parseInt(puzzle.split("x")[0]);
    }

    if (n) {
        // drawScrambleNxN(id, n, scramble);
        drawScrambleNxN_new(id, n, scramble, flags);
    }
    else if (["skewb", "pyraminx", "megaminx", "clock", "square-1", "sq1"].indexOf(puzzle) !== -1) {
        functions[["skewb", "pyraminx", "megaminx", "clock", "square-1", "sq1"].indexOf(puzzle)](id, scramble);
    }
    else {
        drawMissingSvg(id);
    }
}

customElements.define("einar-drawscramble", EinarDrawScramble);