window.location = "https://einarkl.no" + location.pathname;
let cells = new Array(30000).fill(0);
let commands = ["<",">","+","-","[","]",",","."];
let pointer = 0;
let commas = 0;
let loopStarts = 0;
let loopEnds = 0;
let inputs = [];

function runCode(code) {
    inputs = [];
    commas = code.split("").filter(c => c === ",").length;
    loopStarts = code.split("").filter(c => c === "[");
    loopEnds = code.split("").filter(c => c === "]");
    $("#output").css("color","black");
    $("#output").val("");

    if (loopStarts.length !== loopEnds.length) {
        $("#output").val("Syntax error");
        $("#output").css("color","red");
    }
    else if (commas === 0) {
        execCode(code);
    }
    else {
        getInput();
    }
}

function execCode(code) {
    cells = new Array(30000).fill(0);
    let cleanCode = code.split("").filter(c => commands.includes(c));
    let output = "";
    let starts = [];
    let ends = [];

    for (let i = 0; i < cleanCode.length; i++) {
        if (cleanCode[i] === "[") {
            starts.push(i);
        }
        else if (cleanCode[i] === "]") {
            ends.push(i);
        }
    }

    for (let i = 0; i < cleanCode.length; i++) {
        let o = cells[pointer];
        c = cleanCode[i];
        switch (c) {
            case "<":
                pointer !== 0 ? pointer-- : pointer = cells.length - 1;
                break;
            case ">":
                pointer !== cells.length - 1 ? pointer++ : pointer = 0;
                break;
            case "+":
                cells[pointer] !== 255 ? cells[pointer]++ : cells[pointer] = 0;
                break;
            case "-":
                cells[pointer] !== 0 ? cells[pointer]-- : cells[pointer] = 255;
                break;
            case "[":
                if (cells[pointer] === 0) {
                    let done = false;
                    let sum = 1;
                    let j = i + 1;
                    while (!done) {
                        if (cleanCode[j] === "[") {
                            sum++;
                        }
                        else if (cleanCode[j] === "]") {
                            sum--;
                        }

                        if (sum === 0) {
                            done = true;
                        }
                        else {
                            j++;
                        }
                    }
                    i = j;
                }
                break;
            case "]":
                if (cells[pointer] !== 0) {
                    let done = false;
                    let sum = 1;
                    let j = i - 1;
                    while (!done) {
                        if (cleanCode[j] === "]") {
                            sum++;
                        }
                        else if (cleanCode[j] === "[") {
                            sum--;
                        }

                        if (sum === 0) {
                            done = true;
                        }
                        else {
                            j--;
                        }
                    }
                    i = j - 1;
                }
                break;
            case ",":
                cells[pointer] = inputs.shift();
                break;
            case ".":
                output+= String.fromCharCode(cells[pointer]);
                break;
        }
    }

    $("#output").val(output);
    $("#output").css("color","black");
}

function getInput() {
    if (inputs.length !== commas) {
        $("#btnRun").prop("disabled",true);
        $("#output").attr("placeholder","Waiting for user input...");
        $("#output").removeAttr("readonly");
        $("#output").attr("maxLength","1");

        $("#output").focus();
        $("#output").on("input",function() {
            let c = $("#output").val();
            if (c !== "") {
                $("#output").prop("readonly", true);
                $("#output").removeAttr("maxLength");
                $("#output").removeAttr("placeholder");
                $("#output").off("input");
                $("#output").val("");
                
                inputs.push(c.charCodeAt(0) ? c.charCodeAt(0) : 0);
                getInput();
            }
        });
    }
    else {
        $("#btnRun").prop("disabled",false);
        execCode($("#input").val());
    }
}