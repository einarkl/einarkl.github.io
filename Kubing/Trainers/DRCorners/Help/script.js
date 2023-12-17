const subsets = {
    "0cXe/8cXe" : {
        "0qt" : {
            "recognition" : "Half turns to solved",
            "solution" : "Done"
        },
        "3qt" : {
            "recognition" : "Half turns to 2-cycle",
            "solution" : "U R2 U2 F2 U R2 U2 F2 U from y-perm/pseudo y-perm/slash-slash"
        },
        "4qt" : {
            "recognition" : "Half turns to 3-cycle",
            "solution" : "U R2 U R2 U2 F2 U R2 U"
        }
    },
    "4cXe" : {
        "1qt" : {
            "recognition" : "1q|1q|odd",
            "solution" : "U"
        },
        "2qt a" : {
            "recognition" : "2q|2q|even",
            "solution" : "U R2 U"
        },
        "2qt b" : {
            "recognition" : "1q|1q|even",
            "solution" : "U R2 U2 F2 U"
        },
        "3qt" : {
            "recognition" : "1q|2q|odd",
            "solution" : "From 2q side: Set up to 1q and do 2qt b"
        },
        "4qt" : {
            "recognition" : "1q|2q|even",
            "solution" : "From 2q side: Same as 3qt, but do a halfturn after first move"
        },
        "5qt" : {
            "recognition" : "2q|2q|odd",
            "solution" : "1qt to 4qt 4cXe/Discard"
        }
    },
    "2cXe/6cXe" : {
        "3qt" : {
            "recognition" : "Odd + brute force",
            "solution" : "Bad corners on opposite layers, then do 1qt to 2qt a 4cXe"
        },
        "4qt" : {
            "recognition" : "Even",
            "solution" : "Bad corners on same layer, then do 1qt to 3qt 2cXe"
        },
        "5qt" : {
            "recognition" : "Odd + brute force",
            "solution" : "Set up to 4qt 2cXe or 4qt 4cXe/Discard"
        },
        "*" : {
            "recognition" : "Instead of brute force checking to see whether or not you have 3q or 5q, you can set the 2 misoriented corners onto different DR layers like you're preparing for a U R2 U R2 U finish. NISS trace 3 oriented corners on one of these layers + the misoriented corner from the other layer, 1q = 5q and 2q = 3q.",
            "solution" : ""
        }
    }
}

$(() => {
    initActions();
});

function initActions() {
    $(window).on("keyup", e => {
        
    });

    initSubsetTable();
}

function answer(cx, qt) {
    console.log(cx, qt);
}

function initSubsetTable() {
    let tbl = "<tr><th></th><th></th><th><h3>Recognition</h3></th><th><h3>Solution</h3></th></tr>";

    for (let cs of Object.keys(subsets)) {
        let cs2 = cs === "4cXe" ? "<a id='cs4' href='../4c' target='_blank'>" + cs + "</a>" : cs;
        tbl += "<tr><th><h3>" + cs2 + "</h3></th><th></th><th></th><th></th></tr>"
        for (let qt of Object.keys(subsets[cs])) {
            tbl += "<tr><th></th><th><h3>" + qt + "</h3></th><th><h4>" + subsets[cs][qt].recognition + "</h4></th><th><h4>" + subsets[cs][qt].solution + "</h4></th></tr>"
        }
    }

    $("#subsets").html(tbl);
}