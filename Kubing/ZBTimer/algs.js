let algs;
let bnwAlgs = [];
$.getJSON("zbll_scrambles.json", data => {
    algs = data;
    for (let k of Object.keys(algs)) {
        bnwAlgs.push({"name" : k, "0" : algs[k][0]});
    }
});