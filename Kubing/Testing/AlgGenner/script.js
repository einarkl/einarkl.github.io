$(() => {
    // startGenningAlgs(10, ["R", "R'", "R2", "Rw", "Rw'", "Rw2", "U2", "F2"]);
});

function startGenningAlgs(len, moves) {
    let w = new Worker("worker1.js");
    let inp = [len, moves];
    w.postMessage(inp);
    w.onmessage = e => {
        console.log(e.data);
    }
}