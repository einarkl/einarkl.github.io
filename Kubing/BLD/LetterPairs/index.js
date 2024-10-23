window.location = "https://einarkl.no" + location.pathname;
let letterPairs = [];
let images = [];

let pressedBtnNext = false;

if (localStorage.getItem("letterPairs")) {
    letterPairs = localStorage.getItem("letterPairs").split(";");
}
else {
    letterPairs = [
        'AB','AC','AD','AE','AF','AG','AH','AI','AJ','AK','AL','AM','AN','AO','AP','AQ','AR','AS','AT','AU','AV','AW','AX','BA','BC','BD','BE','BF','BG','BH','BI','BJ','BK','BL','BM','BN','BO','BP','BQ','BR','BS','BT','BU','BV','BW','BX','CA','CB','CD','CE','CF','CG','CH','CI','CJ','CK','CL','CM','CN','CO','CP','CQ','CR','CS','CT','CU','CV','CW','CX','DA','DB','DC','DE','DF','DG','DH','DI','DJ','DK','DL','DM','DN','DO','DP','DQ','DR','DS','DT','DU','DV','DW','DX','EA','EB','EC','ED','EF','EG','EH','EI','EJ','EK','EL','EM','EN','EO','EP','EQ','ER','ES','ET','EU','EV','EW','EX','FA','FB','FC','FD','FE','FG','FH','FI','FJ','FK','FL','FM','FN','FO','FP','FQ','FR','FS','FT','FU','FV','FW','FX','GA','GB','GC','GD','GE','GF','GH','GI','GJ','GK','GL','GM','GN','GO','GP','GQ','GR','GS','GT','GU','GV','GW','GX','HA','HB','HC','HD','HE','HF','HG','HI','HJ','HK','HL','HM','HN','HO','HP','HQ','HR','HS','HT','HU','HV','HW','HX','IA','IB','IC','ID','IE','IF','IG','IH','IJ','IK','IL','IM','IN','IO','IP','IQ','IR','IS','IT','IU','IV','IW','IX','JA','JB','JC','JD','JE','JF','JG','JH','JI','JK','JL','JM','JN','JO','JP','JQ','JR','JS','JT','JU','JV','JW','JX','KA','KB','KC','KD','KE','KF','KG','KH','KI','KJ','KL','KM','KN','KO','KP','KQ','KR','KS','KT','KU','KV','KW','KX','LA','LB','LC','LD','LE','LF','LG','LH','LI','LJ','LK','LM','LN','LO','LP','LQ','LR','LS','LT','LU','LV','LW','LX','MA','MB','MC','MD','ME','MF','MG','MH','MI','MJ','MK','ML','MN','MO','MP','MQ','MR','MS','MT','MU','MV','MW','MX','NA','NB','NC','ND','NE','NF','NG','NH','NI','NJ','NK','NL','NM','NO','NP','NQ','NR','NS','NT','NU','NV','NW','NX','OA','OB','OC','OD','OE','OF','OG','OH','OI','OJ','OK','OL','OM','ON','OP','OQ','OR','OS','OT','OU','OV','OW','OX','PA','PB','PC','PD','PE','PF','PG','PH','PI','PJ','PK','PL','PM','PN','PO','PQ','PR','PS','PT','PU','PV','PW','PX','QA','QB','QC','QD','QE','QF','QG','QH','QI','QJ','QK','QL','QM','QN','QO','QP','QR','QS','QT','QU','QV','QW','QX','RA','RB','RC','RD','RE','RF','RG','RH','RI','RJ','RK','RL','RM','RN','RO','RP','RQ','RS','RT','RU','RV','RW','RX','SA','SB','SC','SD','SE','SF','SG','SH','SI','SJ','SK','SL','SM','SN','SO','SP','SQ','SR','ST','SU','SV','SW','SX','TA','TB','TC','TD','TE','TF','TG','TH','TI','TJ','TK','TL','TM','TN','TO','TP','TQ','TR','TS','TU','TV','TW','TX','UA','UB','UC','UD','UE','UF','UG','UH','UI','UJ','UK','UL','UM','UN','UO','UP','UQ','UR','US','UT','UV','UW','UX','VA','VB','VC','VD','VE','VF','VG','VH','VI','VJ','VK','VL','VM','VN','VO','VP','VQ','VR','VS','VT','VU','VW','VX','WA','WB','WC','WD','WE','WF','WG','WH','WI','WJ','WK','WL','WM','WN','WO','WP','WQ','WR','WS','WT','WU','WV','WX','XA','XB','XC','XD','XE','XF','XG','XH','XI','XJ','XK','XL','XM','XN','XO','XP','XQ','XR','XS','XT','XU','XV','XW'
    ];
}

if (localStorage.getItem("images")) {
    images = localStorage.getItem("images").split(";");
}
else {
    images = [
        'AB','AC','AD','AE','AF','AG','AH','AI','AJ','AK','AL','AM','AN','AO','AP','AQ','AR','AS','AT','AU','AV','AW','AX','BA','BC','BD','BE','BF','BG','BH','BI','BJ','BK','BL','BM','BN','BO','BP','BQ','BR','BS','BT','BU','BV','BW','BX','CA','CB','CD','CE','CF','CG','CH','CI','CJ','CK','CL','CM','CN','CO','CP','CQ','CR','CS','CT','CU','CV','CW','CX','DA','DB','DC','DE','DF','DG','DH','DI','DJ','DK','DL','DM','DN','DO','DP','DQ','DR','DS','DT','DU','DV','DW','DX','EA','EB','EC','ED','EF','EG','EH','EI','EJ','EK','EL','EM','EN','EO','EP','EQ','ER','ES','ET','EU','EV','EW','EX','FA','FB','FC','FD','FE','FG','FH','FI','FJ','FK','FL','FM','FN','FO','FP','FQ','FR','FS','FT','FU','FV','FW','FX','GA','GB','GC','GD','GE','GF','GH','GI','GJ','GK','GL','GM','GN','GO','GP','GQ','GR','GS','GT','GU','GV','GW','GX','HA','HB','HC','HD','HE','HF','HG','HI','HJ','HK','HL','HM','HN','HO','HP','HQ','HR','HS','HT','HU','HV','HW','HX','IA','IB','IC','ID','IE','IF','IG','IH','IJ','IK','IL','IM','IN','IO','IP','IQ','IR','IS','IT','IU','IV','IW','IX','JA','JB','JC','JD','JE','JF','JG','JH','JI','JK','JL','JM','JN','JO','JP','JQ','JR','JS','JT','JU','JV','JW','JX','KA','KB','KC','KD','KE','KF','KG','KH','KI','KJ','KL','KM','KN','KO','KP','KQ','KR','KS','KT','KU','KV','KW','KX','LA','LB','LC','LD','LE','LF','LG','LH','LI','LJ','LK','LM','LN','LO','LP','LQ','LR','LS','LT','LU','LV','LW','LX','MA','MB','MC','MD','ME','MF','MG','MH','MI','MJ','MK','ML','MN','MO','MP','MQ','MR','MS','MT','MU','MV','MW','MX','NA','NB','NC','ND','NE','NF','NG','NH','NI','NJ','NK','NL','NM','NO','NP','NQ','NR','NS','NT','NU','NV','NW','NX','OA','OB','OC','OD','OE','OF','OG','OH','OI','OJ','OK','OL','OM','ON','OP','OQ','OR','OS','OT','OU','OV','OW','OX','PA','PB','PC','PD','PE','PF','PG','PH','PI','PJ','PK','PL','PM','PN','PO','PQ','PR','PS','PT','PU','PV','PW','PX','QA','QB','QC','QD','QE','QF','QG','QH','QI','QJ','QK','QL','QM','QN','QO','QP','QR','QS','QT','QU','QV','QW','QX','RA','RB','RC','RD','RE','RF','RG','RH','RI','RJ','RK','RL','RM','RN','RO','RP','RQ','RS','RT','RU','RV','RW','RX','SA','SB','SC','SD','SE','SF','SG','SH','SI','SJ','SK','SL','SM','SN','SO','SP','SQ','SR','ST','SU','SV','SW','SX','TA','TB','TC','TD','TE','TF','TG','TH','TI','TJ','TK','TL','TM','TN','TO','TP','TQ','TR','TS','TU','TV','TW','TX','UA','UB','UC','UD','UE','UF','UG','UH','UI','UJ','UK','UL','UM','UN','UO','UP','UQ','UR','US','UT','UV','UW','UX','VA','VB','VC','VD','VE','VF','VG','VH','VI','VJ','VK','VL','VM','VN','VO','VP','VQ','VR','VS','VT','VU','VW','VX','WA','WB','WC','WD','WE','WF','WG','WH','WI','WJ','WK','WL','WM','WN','WO','WP','WQ','WR','WS','WT','WU','WV','WX','XA','XB','XC','XD','XE','XF','XG','XH','XI','XJ','XK','XL','XM','XN','XO','XP','XQ','XR','XS','XT','XU','XV','XW'
    ];
}

$(function() {
    $("#letterPair").html("<button class='btn btn-secondary' onclick='start()'>Start</button>");
    adjustSize();
    
    $("#inputImage").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            checkImage();
        }
    });
});
        
$(window).resize(function(){
    adjustSize();
});

function start() {
    $("#letterPair").html("");
    getLetterPair();
    $("#inputImage").focus();
}

function getLetterPair() {
    let letterPair = letterPairs[Math.floor(Math.random() * letterPairs.length)];

    $("#letterPair").text(letterPair);

    if (pressedBtnNext) {
        $("#result").html("");
    }
    pressedBtnNext = false;
    
    $("#inputImage").val("");
}

function checkImage() {
    let letterPair = $("#letterPair").text();
    let image = $("#inputImage").val().toUpperCase();
    let correct = false;

    outer : for (let i1 of image.split("/")) {
        for (let i2 of images[letterPairs.indexOf(letterPair)].toUpperCase().split("/")) {
            if (i1 === i2) {
                correct = true;
                break outer;
            }
        }
    }
    
    if (correct) {
        $("#result").text("Correct!");
        $("#result").css("color", "green");
        
        getLetterPair();
    }
    else {
        $("#result").html("Incorrect!<br><button class='btn btn-secondary' onclick='showAnswer()'>Show answer</button>");
        $("#result").css("color", "red");
    }
    $("#inputImage").val("");
    $("#inputImage").focus();
}

function reset() {
    $("#letterPair").html("<button class='btn btn-secondary' onclick='start()'>Start</button>");
    $("#inputImage").val("");
    $("#result").text("");
    $("#fileInput").val(null);
}

function showAnswer() {
    let letterPair = $("#letterPair").text();
    let img = images[letterPairs.indexOf(letterPair)];
    $("#result").html(img+"&nbsp;<button id='btnNext' class='btn btn-secondary' onclick='pressedBtnNext = true;getLetterPair()'>Next</button>");
    $("#result").css("color","#aaaaaa");
    $("#btnNext").focus();
}

function lesData(files) {
    let val = $("#tableType").val();
    
    readXlsxFile(files[0]).then(function (data) {
        if (val === "horizontal") {
            skrivDataHorizontal(data);
        }
        else if (val === "vertical") {
            skrivDataVertical(data);
        }

        letterPairs = localStorage.getItem("letterPairs").split(";");
        images = localStorage.getItem("images").split(";");

        alert("Successfully imported excel sheet!");
        $("#tableType").val("select");
    });
    reset();
}

function skrivDataHorizontal(data) {
    let lettersH = [];
    let lettersV = [];
    let letterPairList = [];
    let imageList = [];

    for (let i=1; i<data[0].length; i++) {
        lettersH.push(data[0][i]);
    }
    for (let j=1; j<data.length; j++) {
        lettersV.push(data[j][0]);
    }
    for (let v of lettersV) {
        for (let h of lettersH) {
            if (h !== v) {
                letterPairList.push(v+h);
            }
        }
    }

    for (let j=0; j<data.length; j++) {
        for (let i=0; i< data[j].length; i++) {
            if (j !== 0 && i !== 0 && j !== i) {
                imageList.push(data[j][i]);
            }
        }
    }

    localStorage.setItem("letterPairs",letterPairList.join(";"));
    localStorage.setItem("images",imageList.join(";"));
}

function skrivDataVertical(data) {
    let lettersH = [];
    let lettersV = [];
    let letterPairList = [];
    let imageList = [];

    for (let i=1; i<data[0].length; i++) {
        lettersH.push(data[0][i]);
    }
    for (let j=1; j<data.length; j++) {
        lettersV.push(data[j][0]);
    }
    for (let h of lettersH) {
        for (let v of lettersV) {
            if (h !== v) {
                letterPairList.push(v+h);
            }
        }
    }

    for (let j=0; j<data.length; j++) {
        for (let i=0; i< data[j].length; i++) {
            if (j !== 0 && i !== 0 && j !== i) {
                imageList.push(data[i][j]);
            }
        }
    }

    localStorage.setItem("letterPairs",letterPairList.join(";"));
    localStorage.setItem("images",imageList.join(";"));
}

function showLetterPairEdit() {
    $("#letterPairEdit").css("display", "block");
    adjustSize();
}

function closeLetterPairEdit() {
    $("#letterPairEdit").css("display", "none");
}

function toggleImport(val) {
    if (val !== "select") {
        $("#fileInput").prop('disabled', false);
    }
    else {
        $("#fileInput").prop('disabled', true);
    }
}

function adjustSize() {
    const inpFontSize = $("#btnHelp").css("font-size").split("px")[0];
    const fontSize = ($("#toolbar").css("font-size").split("px")[0] * 0.75)

    $("#inputImage").css("font-size", fontSize);

    $("img").css("width", $("#innerLetterPairEdit").width() * 0.8);
    $("#inputImage").css("width", "30%");
    $("#inputImage").css("margin", "auto");
    $("#tableType").css("font-size", inpFontSize*1.5);
    $("label").css("font-size", inpFontSize);
}