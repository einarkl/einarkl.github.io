window.location = "https://einarkl.no" + location.pathname;
let showing = null;
let showingLetters = false;
let selectedButton = null;
let selectedTopBtn = localStorage.getItem("selectedTopBtn") || "btnTopW";
let selectedTopColor = localStorage.getItem("selectedTopColor") || "white";
let selectedFrontBtn = localStorage.getItem("selectedFrontBtn") || "btnFrontG";
let selectedFrontColor = localStorage.getItem("selectedFrontColor") || "green";
let prevAlg = null;
let learnedComms;

const edges = ["UB", "UR", "UL", "LU", "LF", "LD", "LB", "FR", "FD", "FL", "RU", "RB",
                "RD", "RF", "BU", "BL", "BD", "BR", "DF", "DR", "DB", "DL"];
const corners = ["UBL", "UBR", "UFL", "LUB", "LUF", "LDF", "LDB", "FUL", "FDR", "FDL",
                "RUB", "RDB", "RDF", "BUR", "BUL", "BDL", "BDR", "DFL", "DFR", "DBR", "DBL"];
const pieces = ["UBL", "UB", "UBR", "UL", "", "UR", "UFL", "UF", "UFR",
                "LUB", "LU", "LUF", "LB", "", "LF", "LDB", "LD", "LDF",
                "FUL", "FU", "FUR", "FL", "", "FR", "FDL", "FD", "FDR",
                "RUF", "RU", "RUB", "RF", "", "RB", "RDF", "RD", "RDB",
                "BUR", "BU", "BUL", "BR", "", "BL", "BDR", "BD", "BDL",
                "DFL", "DF", "DFR", "DL", "", "DR", "DBL", "DB", "DBR"];
const ufTypes = [
    ";4-Mover;4-Mover;4-Mover;U-Swap;U-Swap;U-Swap;4-Mover;E-Swap;4-Mover;4-Mover;U-Swap;U-Swap;U-Swap;;4-Mover;4-Mover;4-Mover;4-Mover;4-Mover;4-Mover;4-Mover".split(";"),
    "4-Mover;;4-Mover;S-Swap;U-Swap;U-Swap;U-Swap;U-Swap;M-Swap;U-Swap;;U-Swap;U-Swap;U-Swap;M-Swap;U-Swap;Special;U-Swap;F-Swap;4-Mover;M-Swap;Special".split(";"),
    "4-Mover;4-Mover;;;U-Swap;U-Swap;U-Swap;U-Swap;M-Swap;U-Swap;S-Swap;U-Swap;U-Swap;U-Swap;M-Swap;U-Swap;Special;U-Swap;F-Swap;Special;M-Swap;4-Mover".split(";"),
    "4-Mover;S-Swap;;;U-Swap;4-Mover;U-Swap;U-Swap;M-Swap;U-Swap;4-Mover;4-Mover;4-Mover;4-Mover;M-Swap;4-Mover;Special;E-Swap;4-Mover;S-Swap;M-Swap;S-Swap".split(";"),
    "U-Swap;U-Swap;U-Swap;U-Swap;;S-Insert;4-Mover;E-Swap;M-Swap;;4-Mover;4-Mover;4-Mover;4-Mover;M-Swap;E-Swap;E-Swap;E-Swap;F-Swap;4-Mover;M-Swap;4-Mover".split(";"),
    "U-Swap;U-Swap;U-Swap;4-Mover;S-Insert;;S-Insert;E-Swap;S-Swap;4-Mover;4-Mover;4-Mover;4-Mover;4-Mover;M-Swap;4-Mover;E-Swap;E-Swap;4-Mover;S-Swap;S-Swap;".split(";"),
    "U-Swap;U-Swap;U-Swap;U-Swap;4-Mover;S-Insert;;E-Swap;M-Swap;E-Swap;4-Mover;4-Mover;4-Mover;4-Mover;M-Swap;;U-Swap;E-Swap;4-Mover;4-Mover;M-Swap;4-Mover".split(";"),
    "4-Mover;U-Swap;U-Swap;U-Swap;E-Swap;E-Swap;E-Swap;;M-Swap;4-Mover;U-Swap;E-Swap;4-Mover;;M-Swap;4-Mover;M-Swap;4-Mover;4-Mover;Special;M-Swap;4-Mover".split(";"),
    "E-Swap;M-Swap;M-Swap;M-Swap;M-Swap;S-Swap;M-Swap;M-Swap;;M-Swap;M-Swap;M-Swap;S-Swap;M-Swap;S-Swap;M-Swap;Special;M-Swap;;4-Mover;S-Swap;4-Mover".split(";"),
    "4-Mover;U-Swap;U-Swap;U-Swap;;4-Mover;E-Swap;4-Mover;M-Swap;;U-Swap;E-Swap;E-Swap;E-Swap;M-Swap;4-Mover;4-Mover;4-Mover;4-Mover;4-Mover;M-Swap;Special".split(";"),
    "4-Mover;;S-Swap;4-Mover;4-Mover;4-Mover;4-Mover;U-Swap;M-Swap;U-Swap;;U-Swap;4-Mover;U-Swap;M-Swap;U-Swap;Special;4-Mover;4-Mover;S-Swap;M-Swap;S-Swap".split(";"),
    "U-Swap;U-Swap;U-Swap;4-Mover;4-Mover;4-Mover;4-Mover;E-Swap;M-Swap;U-Swap;U-Swap;;S-Insert;4-Mover;M-Swap;E-Swap;U-Swap;;4-Mover;4-Mover;M-Swap;4-Mover".split(";"),
    "U-Swap;U-Swap;U-Swap;4-Mover;4-Mover;4-Mover;4-Mover;4-Mover;S-Swap;E-Swap;4-Mover;S-Insert;;S-Insert;M-Swap;E-Swap;E-Swap;4-Mover;4-Mover;;S-Swap;S-Swap".split(";"),
    "U-Swap;U-Swap;U-Swap;4-Mover;4-Mover;4-Mover;4-Mover;;M-Swap;E-Swap;U-Swap;4-Mover;S-Insert;;M-Swap;E-Swap;E-Swap;E-Swap;F-Swap;4-Mover;M-Swap;4-Mover".split(";"),
    ";M-Swap;M-Swap;M-Swap;M-Swap;M-Swap;M-Swap;M-Swap;S-Swap;M-Swap;M-Swap;M-Swap;M-Swap;M-Swap;;M-Swap;S-Swap;M-Swap;S-Swap;M-Swap;S-Swap;M-Swap".split(";"),
    "4-Mover;U-Swap;U-Swap;4-Mover;E-Swap;4-Mover;;4-Mover;M-Swap;4-Mover;U-Swap;E-Swap;E-Swap;E-Swap;M-Swap;;M-Swap;4-Mover;4-Mover;4-Mover;M-Swap;Special".split(";"),
    "4-Mover;Special;Special;Special;E-Swap;E-Swap;U-Swap;M-Swap;Special;4-Mover;Special;U-Swap;E-Swap;E-Swap;S-Swap;M-Swap;;M-Swap;S-Swap;4-Mover;;4-Mover".split(";"),
    "4-Mover;U-Swap;U-Swap;U-Swap;E-Swap;E-Swap;E-Swap;4-Mover;M-Swap;4-Mover;4-Mover;;4-Mover;E-Swap;M-Swap;4-Mover;M-Swap;;4-Mover;Special;M-Swap;4-Mover".split(";"),
    "4-Mover;F-Swap;F-Swap;4-Mover;F-Swap;4-Mover;4-Mover;4-Mover;;4-Mover;4-Mover;4-Mover;4-Mover;F-Swap;S-Swap;4-Mover;S-Swap;4-Mover;;F-Swap;Special;F-Swap".split(";"),
    "4-Mover;4-Mover;Special;S-Swap;4-Mover;S-Swap;4-Mover;Special;4-Mover;4-Mover;S-Swap;4-Mover;;4-Mover;M-Swap;4-Mover;4-Mover;Special;F-Swap;;F-Swap;4-Mover".split(";"),
    "4-Mover;M-Swap;M-Swap;M-Swap;M-Swap;S-Swap;M-Swap;M-Swap;S-Swap;M-Swap;M-Swap;M-Swap;S-Swap;M-Swap;S-Swap;M-Swap;;M-Swap;Special;F-Swap;;F-Swap".split(";"),
    "4-Mover;Special;4-Mover;S-Swap;4-Mover;;4-Mover;4-Mover;4-Mover;Special;S-Swap;4-Mover;S-Swap;4-Mover;M-Swap;Special;4-Mover;4-Mover;F-Swap;4-Mover;F-Swap;".split(";")
];
const ufComms = [
    ";[R2 U' : [R2' , S]];[L2' U : [L2 , S']];[U' M U : [M' , U2]];[U : [R' E R , U2]];[U' : [L' E' L , U2']];[U : [R E' R' , U2]];[R' U : [S , R2]];[R' F' : [E , R U R']];[L U' : [S' , L2']];[U M U' : [M , U2]];[U' : [L' E L , U2']];[U : [R E R' , U2]];[U' : [L E' L' , U2']];;[L' U : [L2 , S']];[U R' B R : [S , R2']];[R U' : [R2' , S]];[M' , U2];[U : [S , R2']];[U2 , M];[U' : [S' , L2]]".split(";"),
    "[R2 U' : [S , R2']];;[M2' U' : [M , U2]];[L F' L' , S'];[R' E R , U'];[U2' : [L' E' L , U']];[R E' R' , U'];[E' : [R' E R , U']];[R : [U' R' U , M']];[R E2 R' , U'];;[U2' : [L' E L , U']];[R E R' , U'];[U2' : [L E' L' , U']];[R' : [U' R U , M]];[R' E2 R , U'];(M U' M' U')2;[E : [R E' R' , U']];[L F' : [L' S' L , F2']];[R U R' : [S , R2]];[R : [U' R' U , M2']];L U L' U' L' U' L' U L U".split(";"),
    "[L2' U : [S' , L2]];[M2' U : [M , U2']];;;[U2 : [R' E R , U]];[L' E' L , U];[U2 : [R E' R' , U]];[L' E2' L , U];[L' : [U L U' , M']];[U2 : [R E2 R' , U]];[R' F R , S];[L' E L , U];[U2 : [R E R' , U]];[L E' L' , U];[L : [U L' U' , M]];[U2 : [R' E2 R , U]];(M U M' U)2;[L E2' L' , U];[R' F : [R S R' , F2]];R' U' R U R U R U R U' R' U';[l' M' : [U L U' , M2']];[L' U' L : [S' , L2]]".split(";"),
    "[U' M U' : [M' , U2]];[S' , L F' L'];;;[S : [R' E R , U']];[l' U L : [S' , L2']];[S : [R E' R' , U']];[M' : [R S' R' , U']];[l' : [U' L U , M']];[L' U' : [L S L' , U']];[M U' : [M' , U2]];[L' F' : [E , L2]];[R' F R' : [S , R2]];[R M U' : [M' , U2]];[l' : [U' L U , M]];[U' R F : [E' , R2']];M2' : (U' M U' M')2;[l' : [E , L U' L']];[L' F' : [E' , L2]];[L2 : [S , L' F' L]];[l' : [U' L U , M2']];[S , L F' L']".split(";"),
    "[U' : [R' E R , U2]];[U' , R' E R];[U' : [R' E R , U']];[S : [U' , R' E R]];;[U S' U' , L];[M' U L' : [S' , L2']];[R U' R' , E];[M' : [U' L' U , M']];;[M L' U' : [M' , U2']];[r U R : [E , R2']];[M' U R : [E , R2']];[U' E' L : [S' , L2']];[M' , U' L' U];[L U L' , E'];[U' r' : [E , R U R']];[R2' : [R U' R' , E]];[U R' F' : [R S R' , F']];[U' E' R' : [E' , R2]];[M' : [U' L' U , M2']];[U E L' : [E' , L2]]".split(";"),
    "[U : [L' E' L , U2']];[U : [L' E' L , U]];[U , L' E' L];[l' U L' : [S' , L2]];[L , U S' U'];;[L' , U S' U'];[L' E2' : [L U L' , E]];[U : [S , L F L']];[L f' L : [S , L2']];[L F' L' : [S' , L2]];[L F' : [L2' , E]];[L F' L : [S , L2']];[M' U' L : [E' , L2']];[l' : [U' L' U , M]];[S' U' R : [E' , R2']];[U l : [E , L' U' L]];[L E2' : [L' U L , E']];[L F' : [E' , L2']];[S , L' F' L];[U : [L B' L' , S']];".split(";"),
    "[U' : [R E' R' , U2]];[U' , R E' R'];[U' : [R E' R' , U']];[S : [U' , R E' R']];[M' U L : [S' , L2']];[U S U' , L'];;[R2 : [R' U' R , E']];[M' : [U' L U , M']];[L' U L , E];[R F : [E' , R2']];[u R' : [S , R2]];[R' F : [E' , R2]];[l' U' L : [E' , L2']];[M' , U' L U];;[U' M : [L S L' , U]];[R' U' R , E'];[l' U : [L2 , S']];[u' R : [E , R2']];[M' : [U' L U , M2']];[u L : [E , L2']]".split(";"),
    "[R' U' : [S , R2']];[E' : [U' , R' E R]];[U , L' E2' L];[M' : [U' , R S' R']];[E , R U' R'];[L' E' : [L U L' , E']];[R2 : [E' , R' U' R]];;[U' R U , M'];[R' U' R' : [E , R2]];[R U2' : [R' S' R , U']];[E' , R U' R'];[R' f R : [S' , R2']];;[U' R U , M];[R' U' R : [E' , R2']];[U2' : [U R U' , M]];[U R : [S , R2']];[U R U' : [M' , U2]];U2 R U' R' U' R' U' R U R U';[U' R U , M2'];[U L' : [E' , L2]]".split(";"),
    "[R' F' : [R U R' , E]];[r : [U' R' U , M]];[l' : [U L U' , M]];[l' : [M' , U' L U]];[M2' : [U' L' U , M]];[U : [L F L' , S]];[M' : [M' , U' L U]];[M' , U' R U];;[M' , U L' U'];[r : [M' , U R' U']];[M2' : [U R' U' , M]];[U' : [R' F' R , S']];[M2' : [U R U' , M]];[U' : [R' F' R , S];[M' , U L U'];U M U M' U2 M' U' M U;[M' , U' R' U];;[U R' F' R : [S , R2']];[D : [S' , R F R']];[U' L F L' : [S' , L2]]".split(";"),
    "[L U : [S' , L2']];[U' , R E2 R'];[U' : [R E2 R' , U'];[L' U2 : [L S L' , U]];;[L f' L' : [S , L2]];[E , L' U L];[R' U' R : [E , R2']];[U L' U' , M'];;[M' : [U , L' S L]];[L2' : [E , L U' L']];[R E : [R' U' R , E]];[E' , L' U L];[U L' U' , M];[U' L' : [S' , L2]];[U' R' B : [R2 , E]];[R U' R : [E , R2']];[U' D R : [E , R2']];[U' R : [E , R2']];[U L' U' , M2']];U2' L' U L U L U L' U' L' U".split(";"),
    "[U M U : [M' , U2']];;[S , R' F R];[M U : [M' , U2']];[M L' U : [M' , U2']];[L F' L : [S' , L2']];[R F : [R2' , E']];[R U : [R' S' R , U]];[r : [U R' U' , M']];[M' : [L' S L , U]];;[S' : [L' E L , U]];[r U' R' : [S , R2]];[S' : [L E' L' , U]];[r : [U R' U' , M]];[M' : [R E' R' , U]];M2' : (U M U M')2;[R u' R' : [E' , R2]];[R F : [E , R2']];[S' , R' F R];[r : [U R' U' , M2']];[R2' : [S' , R F R']]".split(";"),
    "[U : [L' E L , U2']];[U : [L' E L , U];[U , L' E L];[L' F' : [E , L2]];[r U R' : [E , R2]];[L F' : [E , L2']];[u' L : [S' , L2']];[R U' R' , E'];[M' : [U R' U' , M']];[L' : [U , L' E L]];[S' : [U , L' E L]];;[U' S U , R];[M' U' R' : [S , R2]];[M' , U R' U'];[L U L' , E];[U M : [R' S' R , U']];;[r U' : [R2' , S]];[u' R' : [E' , R2]];[M' : [U R' U' , M2']];[u L' : [E' , L2]]".split(";"),
    "[U' : [R E R' , U2]];[U' , R E R'];[U' : [R E R' , U']];[R' F R : [S , R2']];[M' U R' : [E , R2]];[R' F R' : [S' , R2]];[R' F : [R2 , E']];[R' f R' : [S' , R2]];[U' : [S' , R' F' R]];[R E2 : [R' U' R , E']];[r U' R : [S , R2']];[R , U' S U];;[R' , U' S U];[r : [U R U' , M]];[R' E2 : [R U' R' , E]];[U' r' : [E' , R U R']];[S U L' : [E , L2]];[R' F : [E , R2]];;[U' : [R' B R , S]];[S' , R F R']".split(";"),
    "[U : [L E' L' , U2']];[U : [L E' L' , U];[U , L E' L'];[R M U : [M' , U2]];[U E R' : [S , R2]];[M' U' L' : [E' , L2]];[l' U' L' : [E' , L2]];;[M' : [U R U' , M']];[L' U L , E'];[S' : [U , L E' L']];[M' U' R : [S , R2']];[U' S U , R'];;[M' , U R U'];[L2 : [L' U L , E']];[U l : [E' , L' U' L]];[R' U' R , E];[U' L F : [L' S' L , F]];[U' E' R : [E , R2']];[M' : [U R U' , M2']];[U E L : [E , L2']]".split(";"),
    ";[r' : [U' R U , M']];[L : [M , U L' U']];[L' : [U' L U , M']];[U' L' U , M'];[L' : [U' L' U , M']];[U' L U , M'];[M , U' R U];[U' : [S , R' F' R]];[M , U L' U'];[R : [U R' U' , M']];[U R' U' , M'];[R : [U R U' , M']];[U R U' , M'];;[M , U L U'];[U' : [S , R B R']];[M , U' R' U];[U : [R' F' R , S];[r' : [U' R' U , M']];[U : [R B R' , S]];[l : [U L U' , M']]".split(";"),
    "[L' U' : [L2 , S']];[U' , R' E2 R];[U' : [R E2 R' , U'];[U' R F : [R2' , E']];[E' , L U L'];[S' U' R' : [E' , R2]];;[R' U' R' : [E' , R2]];[U L U' , M'];[U' L : [S' , L2']];[M' : [U , R E' R']];[E , L U L'];[R' E' : [R U' R' , E']];[L2 : [E' , L' U L]];[U L U' , M];;[U2 : [U' L U , M]];[R U' R' : [E' , R2]];[U' L U : [M' , U2']];[U' R' : [E' , R2]];[U L U' , M2'];L U' L' U' L' U' L U L U".split(";"),
    "[U' R' B R : [S , R2']];(U M U M')2;(U' M U' M')2;M' : (U M' U M)2;[U' r' : [R U R' , E]];[U l : [L' U' L , E]];[U' M : [U , L S L']];[U2 : [M , U R U']];U M' U' M U2 M U M' U;[U' R' B : [E , R2]];M' : (U' M' U' M)2;[U M : [U' , l' E l]];[U' r' : [R U R' , E']];[U l : [L' U' L , E']];[U' : [R B R' , S]];[U2' : [M , U' L U]];;[U2 : [M , U R' U']];[D' : [S' , R F R']];[U L B' L : [S , L2']];;[U' R' B R' : [S' , R2]]".split(";"),
    "[R U : [R2' , S]];[u' : [R E' R' , U]];[U , L E2' L'];[M' : [U' , L' E L]];[R2' : [E , R U' R']];[L E : [L' U L , E]];[E' , R' U' R];[U R' : [S , R2]];[U' R' U , M'];[R U' R' : [E , R2]];[U L' F' : [L2 , E]];;[S U L : [E , L2']];[E , R' U' R];[U' R' U , M];[R U' R : [E' , R2']];[U2' : [U R' U' , M]];;[U R' U' : [M' , U2]];R' U R U R U R' U' R' U';[U' R' U , M2'];[U L : [E , L2']]".split(";"),
    "[U2 , M'];[L F : [L' S' L , F2']];[R' F' : [R S R' , F2]];[L' F' : [L2 , E']];[U R' F2 : [R S R' , F]];[L F' : [L2' , E']];[l' U : [S' , L2]];[D' U L : [E' , L2']];;[U' D R' : [E , R2]];[R F : [R2' , E]];[r U' : [S , R2']];[R' F : [E , R2]];[U' L F2' : [L' S' L , F']];[U : [S , R' F' R]];[D U' R : [E' , R2']];[D' : [R F R' , S']];[U R' U : [M' , U2]];;[R' F' : [R S' R' , F2]];M' U2 M' U2 M2';[L F : [L' S L , F2']]".split(";"),
    "[U' : [S , R2']];[R' U R' : [S , R2]];U R U R' U' R' U' R' U R;[L2 : [L' F' L , S]];[U' E' R : [E' , R2']];[L' F' L , S];[u' R' : [E , R2]];U R' U' R' U R U R U R' U2;[U R' F' R' : [S , R2]];[U' R' : [E , R2]];[R' F R , S'];[u' R : [E' , R2']];;[U' E' R' : [E , R2]];[R' : [U' R' U , M]];[U' R : [E' , R2']];[U L B' L' : [S , L2]];U R U R U' R' U' R' U' R;[R' F : [R S' R' , F2]];;[D' R' F' : [R S' R' , F2]];[U' : [R2' , S']]".split(";"),
    "[M , U2];[r M' : [U' R' U , M2']];[l' M' : [U L U' , M2']];[L' M : [U' L U , M2']];[M : [U' L' U , M2']];[U : [S' , L B' L']];[M : [U' L U , M2']];[M2' , U' R U];[D : [R F R' , S']];[M2' , U L' U'];[R M : [U R' U' , M2']];[M : [U R' U' , M2']];[U' : [S , R' B R]];[M : [U R U' , M2']];[U : [S , R B R']];[M2 , U L U'];;[M2' , U' R' U];u2 M' u2 M';[D' R' F : [R S' R' , F2]];;[D L F' : [L' S L , F2']]".split(";"),
    "[U : [S' , L2']];U' L' U' L U L U L U' L';[L U' L : [S' , L2']];[L F' L' , S]];[U E L : [E' , L2']];;[u L' : [E , L2]];[U L : [E' , L2']];[U' L F L : [S' , L2']];U' L U L U' L' U' L' U' L U2';[R2' : [R F R' , S']];[u L : [E' , L2']];[R F R' , S']];[U E L' : [E , L2]];[L : [U L U' , M]];U' L' U' L' U L U L U L';[U' R' B R : [S' , R2']];[U L' : [E , L2]];[L F' : [L' S L , F2']];[U' : [S' , R2']];[D L F : [L' S L , F2']];".split(";")
];
const ufrTypes = [
    ";U-Any / U-Any;U-Any / U-Any;;U-Any / U-Any;U-Top / D-Side;U-Top / D-Side;U-Any / U-Any;U-Top / D-Side;U-Top / D-Side;U-Any / U-Any;U-Top / D-Side;U-Top / D-Side;U-Any / U-Any;;U-Top / D-Side;U-Top / D-Side;U-Top / D-Bottom;Special;U-Top / D-Bottom;Special".split(";"),
    "U-Any / U-Any;;U-Any / U-Any;U-Any / U-Any;U-Any / U-Any;U-Top / D-Side;U-Top / D-Side;U-Any / U-Any;U-Top / D-Side;U-Top / D-Side;;U-Top / D-Side;U-Top / D-Side;;U-Any / U-Any;U-Top / D-Side;U-Top / D-Side;U-Top / D-Bottom;Special;Special;U-Top / D-Bottom".split(";"),
    "U-Any / U-Any;U-Any / U-Any;;U-Any / U-Any;;U-Top / D-Side;U-Top / D-Side;;U-Top / D-Side;U-Top / D-Side;U-Any / U-Any;U-Top / D-Side;U-Top / D-Side;U-Any / U-Any;U-Any / U-Any;U-Top / D-Side;U-Top / D-Side;Special;Special;U-Top / D-Bottom;Special".split(";"),
    ";U-Any / U-Any;U-Any / U-Any;;U-Any / U-Any;U-Side / D-Any;U-Side / D-Any;U-Any / U-Any;U-Side / D-Any;U-Side / D-Any;U-Any / U-Any;Special;U-Side / D-Any;U-Any / U-Any;;U-Side / D-Any;U-Side / D-Any;U-Side / D-Any;U-Side / D-Any;U-Side / D-Any;U-Side / D-Any".split(";"),
    "U-Any / U-Any;U-Any / U-Any;;U-Any / U-Any;;LUF / D-Any;LUF / D-Any;;Special;LUF / D-Any;U-Any / U-Any;Special;LUF / D-Any;U-Any / U-Any;U-Any / U-Any;Special;LUF / D-Any;LUF / D-Any;LUF / D-Any;Special;LUF / D-Any".split(";"),
    "U-Top / D-Side;U-Top / D-Side;U-Top / D-Side;U-Side / D-Any;LUF / D-Any;;Special;Special;D-Side / D-Side;;U-Side / D-Any;D-Side / D-Side;D-Side / D-Side;BUR / D-Any;Special;D-Side / D-Side;Special;;D-Side / D-Bottom;D-Side / D-Bottom;Special".split(";"),
    "U-Top / D-Side;U-Top / D-Side;U-Top / D-Side;U-Side / D-Any;LUF / D-Any;Special;;U-Side / D-Any;D-Side / D-Side;D-Side / D-Side;U-Side / D-Any;D-Side / D-Side;D-Side / D-Side;Special;Special;;D-Side / D-Side;Special;Special;Special;".split(";"),
    "U-Any / U-Any;U-Any / U-Any;;U-Any / U-Any;;Special;U-Side / D-Any;;Special;U-Side / D-Any;U-Any / U-Any;U-Side / D-Any;U-Side / D-Any;U-Any / U-Any;U-Any / U-Any;Special;U-Side / D-Any;U-Side / D-Any;Special;U-Side / D-Any;U-Side / D-Any".split(";"),
    "U-Top / D-Side;U-Top / D-Side;U-Top / D-Side;U-Side / D-Any;Special;D-Side / D-Side;D-Side / D-Side;Special;;Special;U-Side / D-Any;D-Side / D-Side;;BUR / D-Any;U-Side / D-Any;D-Side / D-Side;Special;Special;;D-Side / D-Bottom;Special".split(";"),
    "U-Top / D-Side;U-Top / D-Side;U-Top / D-Side;U-Side / D-Any;LUF / D-Any;;D-Side / D-Side;U-Side / D-Any;Special;;U-Side / D-Any;D-Side / D-Side;D-Side / D-Side;Special;Special;D-Side / D-Side;D-Side / D-Side;;Special;D-Side / D-Bottom;D-Side / D-Bottom".split(";"),
    "U-Any / U-Any;;U-Any / U-Any;U-Any / U-Any;U-Any / U-Any;U-Side / D-Any;U-Side / D-Any;U-Any / U-Any;U-Side / D-Any;U-Side / D-Any;;U-Side / D-Any;U-Side / D-Any;;U-Any / U-Any;U-Side / D-Any;Special;U-Side / D-Any;U-Side / D-Any;U-Side / D-Any;U-Side / D-Any".split(";"),
    "U-Top / D-Side;U-Top / D-Side;U-Top / D-Side;Special;Special;D-Side / D-Side;D-Side / D-Side;U-Side / D-Any;D-Side / D-Side;D-Side / D-Side;U-Side / D-Any;;Special;BUR / D-Any;Special;D-Side / D-Side;;D-Side / D-Bottom;Special;;D-Side / D-Bottom".split(";"),
    "U-Top / D-Side;U-Top / D-Side;U-Top / D-Side;U-Side / D-Any;LUF / D-Any;D-Side / D-Side;D-Side / D-Side;U-Side / D-Any;;D-Side / D-Side;U-Side / D-Any;D-Side / D-Side;;BUR / D-Any;Special;D-Side / D-Side;D-Side / D-Side;D-Side / D-Bottom;;Special;D-Side / D-Bottom".split(";"),
    "U-Any / U-Any;;U-Any / U-Any;U-Any / U-Any;U-Any / U-Any;BUR / D-Any;Special;U-Any / U-Any;BUR / D-Any;Special;;BUR / D-Any;BUR / D-Any;;U-Any / U-Any;BUR / D-Any;Special;BUR / D-Any;Special;BUR / D-Any;BUR / D-Any".split(";"),
    ";U-Any / U-Any;U-Any / U-Any;;U-Any / U-Any;Special;Special;U-Any / U-Any;U-Side / D-Any;Special;U-Any / U-Any;Special;Special;U-Any / U-Any;;U-Side / D-Any;Special;U-Side / D-Any;U-Side / D-Any;Special;Special".split(";"),
    "U-Top / D-Side;U-Top / D-Side;U-Top / D-Side;U-Side / D-Any;Special;D-Side / D-Side;;Special;D-Side / D-Side;D-Side / D-Side;U-Side / D-Any;D-Side / D-Side;D-Side / D-Side;BUR / D-Any;U-Side / D-Any;;Special;D-Side / D-Bottom;D-Side / D-Bottom;D-Side / D-Bottom;".split(";"),
    "U-Top / D-Side;U-Top / D-Side;U-Top / D-Side;U-Side / D-Any;LUF / D-Any;Special;D-Side / D-Side;U-Side / D-Any;Special;D-Side / D-Side;Special;;D-Side / D-Side;Special;Special;Special;;D-Side / D-Bottom;D-Side / D-Bottom;;D-Side / D-Bottom".split(";"),
    "U-Top / D-Bottom;U-Top / D-Bottom;Special;U-Side / D-Any;LUF / D-Any;;Special;U-Side / D-Any;Special;;U-Side / D-Any;D-Side / D-Bottom;D-Side / D-Bottom;BUR / D-Any;U-Side / D-Any;D-Side / D-Bottom;D-Side / D-Bottom; ;D-Bottom / D-Bottom;D-Bottom / D-Bottom;D-Bottom / D-Bottom".split(";"),
    "Special;Special;Special;U-Side / D-Any;LUF / D-Any;D-Side / D-Bottom;Special;Special;;Special;U-Side / D-Any;Special;;Special;U-Side / D-Any;D-Side / D-Bottom;D-Side / D-Bottom;D-Bottom / D-Bottom;;D-Bottom / D-Bottom;D-Bottom / D-Bottom".split(";"),
    "U-Top / D-Bottom;Special;U-Top / D-Bottom;U-Side / D-Any;Special;D-Side / D-Bottom;Special;U-Side / D-Any;D-Side / D-Bottom;D-Side / D-Bottom;U-Side / D-Any;;Special;BUR / D-Any;Special;D-Side / D-Bottom;;;D-Bottom / D-Bottom;;D-Bottom / D-Bottom".split(";"),
    "Special;U-Top / D-Bottom;Special;U-Side / D-Any;LUF / D-Any;Special;;U-Side / D-Any;Special;D-Side / D-Bottom;U-Side / D-Any;D-Side / D-Bottom;D-Side / D-Bottom;BUR / D-Any;Special;;D-Side / D-Bottom;D-Bottom / D-Bottom;D-Bottom / D-Bottom;D-Bottom / D-Bottom;".split(";")
];
const ufrComms = [
    ";[R' B' R : [U' , R D R']];[R' D R U' : [R' D' R , U']];;[F : [R' D' R , U2]];[U2 , R' D R];[U : [R D' R' , U2]];R' D R U' R : [F , R' U R U'];[U D : [R D R' , U2]];[D' U : [R D' R' , U2]];[R' U D R : [D' , R U' R']];[U : [R D R' , U2]];[U2 , R' D' R];[R' U' D : [R D R' , U2]];;[U D' : [R D R' , U2]];[U D : [R D' R' , U2]];[R F' R' U : [R D R' , U2]];[U2 , R' D R U' R D' R'];[R D' R' : [U2 , R' D R]];[R' U' D' R : [D , R U' R']]".split(";"),
    "[R' B' R : [R D R' , U']];;[R F' R' : [U , R' D R]];[R2 : [D , R' U R]];[R' : [U' , R' D' R]];[U , R' D R];[R D' R' , U'];[R2 U' : [R U R' , D']];[D' : [U , R' D R]];[D : [U , R' D' R]];;[R D R' , U'];[U , R' D' R];;[R2 U : [D , R' U' R]];[D' : [R D R' , U']];[D : [R D' R' , U']];[R F' : [D , R' U' R]];[U , R' D R U' R D' R'];[R D' R' U R' D R , U'];[R' B : [R U R' , D']]".split(";"),
    "[R' D R U2 : [R' D' R , U]];[R F' R' : [R' D R, U]];;[U' R : [U2 , R D R']];;[U' , R' D R];[U2 : [R D' R' , U]];;[D' : [U' , R' D R]];[D : [U' , R' D' R]];[U' R2' : [D' , R U2 R']];[U2 : [R D R' , U]];[U' , R' D' R];[R' D' : [R' D R , U']];[U' R2' : [D' , R U' R']];[D : [U' , R' D R]];[D' : [U' , R' D' R]];[U' : [F2' , U R' U' R]];[U' , R' D R U' R D' R'];[R D' R' : [U' , R' D R]];[R' D' R : [D , R U' R']]".split(";"),
    ";[R : [U , R D R']];[U' R2 : [D , R' U2 R]];;[U' R' U , L];[U R' : [R' D R , U']];[R D' : [U , R D R']];[l' U' : [R D' R' , U2]];[D' U R' : [R' D R , U']];[R U2 : [R' D R , U']];[R : [U , R2 D R2 D' R2]];[U' R' F R : [R D R' , U']];[U R' U' : [R D R' , U']];[F' L F , R'];;[D U R' : [R' D R , U']];[R U2 : [R' D' R , U']];[D' R : [U , R D' R']];[U R' D' : [R' D' R , U']];[D R : [U , R D' R']];[R : [U , R D' R']]".split(";"),
    "[F : [U2 , F' R F R']];[R2 : [D' , R U' R']];;[U' R' F : [D , R U R']];;[R' U' : [R U R' , D]];[U' R U' : [R' U R , D']];;[U R U' : [F , U R' U' R]];[D R' U' : [R U R' , D']];[R U' D' R' : [R' U R , D]];[D' R : [R' U R U' , F]];[R' U' : [R U R' , D']];[R' F : [D , R U R']];[F , l U' l'];[F , l U2 l'];[D' R' U' : [R U R' , D']];[U' R' U : [D , R U' R']];[U' D' R' U : [D , R U' R']];[R U' R2' : [U , R D R']];[U' D R' U : [D , R U' R']]".split(";"),
    "[R' D R , U2];[R' D R , U];[R' D R , U'];[U R' : [U' , R' D R]];[R' U' : [D , R U R']];;[R' D : [F' , D' R D R']];[R' D : [F2 , D' R D R']];[U : [R U' R' , D]];;[U R U' : [R' D R , U2]];[U D' : [R U' R' , D2]];[U R' D' : [R U' R' , D2]];[R' U : [D , R U' R']];[R B' R' : [U , R' D R]];[U D2 : [R U' R' , D']];[R' D R2 : [U , R' D' R]];;[U D R D' : [R' D R , U']];[U R2 : [U' , R' D R]];[D R : [F2 , R' U R U']]".split(";"),
    "[U' : [R D' R' , U2]];[U' , R D' R'];[U' : [R D' R' , U']];[R D' : [R D R' , U]];[U' R U' : [D' , R' U R]];[D R' : [F' , R D' R']];;[R U D : [R' D R , U2]];[l' U : [R U' R' , D]];[D : [R U R' , D]];[U R : [U2 , R D' R']];[R D : [R' U' R , D2]];[R U R' , D2];[R , U' L U];[U D R' F' : [R U' R' , D]];;[D' : [R U R' , D']];[D R U' R' : [U2 , R' D R]];[R U' D R' : [U2 , R' D R]];[R D' R' : [U , R' D R]];".split(";"),
    "[r D' U : [R D R' , U2]];[R2 U' : [D' , R U R']];;[l' U : [R D' R' , U2]];;[D R' : [F2 , R D' R' D]];[R U' D : [R' D R , U2]];;[R' : [F2 , R D' R' D]];[R U' : [R' D R , U U]];[R' F' R D U : [R' D' R , U2];[R D' U' : [R' D R , U2]];[D R U' : [R' D' R , U2]];[R D' U' : [R' D' R , U2]];[R U R' D' : [R' D R , U2]];[D R' D : [F2 , D' R D R']];[R U' : [R' D' R , U2]];[R D U' : [R' D' R , U2]];[R U' R' U D : [R D R' , U2]];[D R : [U2 , R D' R']];[R2 U : [R' U R , D']]".split(";"),
    "[D U' : [R D R' , U2]];[D' : [R' D R , U]];[D' : [R' D R , U']];[U D' R' : [U' , R' D R]];[R : [F , R' U R U']];[U : [D , R U' R']];[l' U : [D , R U' R']];[D' R' D : [F2 , D' R D R']];;[D' R' D : [F' , D' R D R']];[U' R' U' : [R D R' , U2]];[U : [D' , R U' R']];;[D' R' U : [D , R U' R']];[U' R' U' : [R D R' , U']];[U : [D2 , R U' R']];[R U R' U' : [R U R' , D']];[R : [F2 , R' U R U']];;[U R D' : [R' D R , U']];[R' D' R : [D ,R U R']]".split(";"),
    "[D : [R' D' R , U2]];[D : [R' D' R , U]];[D : [R' D' R , U']];[R U : [R' D R , U]];[D R' U' : [D' , R U R']];;[D2 : [R U R' , D']];[R U : [R' D R , U2]];[R' : [F' , R D' R' D]];;[U R U' D : [R' D' R , U2]];[R D : [R' U' R , D]];[R U R' , D];[R' F : [D , R U' R']];[D R' : [R' U R , D]];[D' R D : [R' U' R , D2]];[D' : [R U R' , D2]];;[R U' R' : [U2 , R' D R]];[D' R2 : [R' U' R , D']];[D R D : [R' D' R , U]]".split(";"),
    "[R' U D R2 : [U' , R' D' R]];;[U' R' : [U2 , R' D' R]];[R' D R2 D' R2' : [U , R2 D R2' D' R2]];[R U' D' R' : [D , R' U R]];[U R U : [R' D R , U2]];[U R : [R D' R' , U2]];[R' F' R D U : [U2 , R' D' R];[U' R' U : [R D R' , U2]];[U R U D : [R' D' R , U2]];;[U R U : [R' D' R , U2]];[U' R' D U : [R D' R' , U2]];;[U R2 U' : [R U R' , D']];[U' R' U : [R D' R' , U2]];[R' F' R D' U' : [R' D R , U2]];[U' R' : [U2 , R' D R]];[U' D' R' : [U2 , R' D R]];[U R U D' : [R' D R , U2]];[D U' R' : [U2 , R' D R]]".split(";"),
    "[U' : [R D R' , U2]];[U' , R D R'];[U' : [R D R' , U']];[U' R : [R U' R' , D']];[D' R : [F , R' U R U']];[U D : [R U' R' , D2]];[R D' : [R' U' R , D2]];[R D' U : [R' D R , U2]];[U : [R U' R' , D']];[R D2 : [R' U' R , D']];[U R U' : [R' D' R , U2]];;[R D' : [U , R' D R]];[U' R U : [D , R' U' R]];[R B' : [D , R' U' R]];[U' : [D' , R' U' R]];;[U' R' : [U , R' D R]];[D' R : [F2 , R' U R U']];;[U D' R D' : [R' D R , U']]".split(";"),
    "[R' D' R , U2];[R' D' R , U];[R' D' R , U'];[U R' U2 : [R D R' , U]];[R' U' : [D' , R U R']];[U R' D : [R U' R' , D2]];[D2 , R U R'];[D R U : [R' D' R , U2]];;[D , R U R'];[U' R' D U' : [R D' R' , U2]];[R D' : [R' D R , U]];;[R' U : [D' , R U' R']];[R2' : [U , R D R']];[U R' D' : [D' , R U' R']];[D' , R U R'];[R D : [R' D' R , U]];;[D' R U' R' : [U2 , R' D R]];[R2 : [R' U' R , D']]".split(";"),
    "[R' U D : [R D R' , U2]];;[R' D' : [U' , R' D R]];[R' , F' L F]];[R' F : [R U R' , D]];[R' U : [R U' R' , D]];[U' L U , R];[R U D' : [R' D' R , U2]];[D' R' U : [R U' R' , D]];[R' F : [R U' R' , D]];;[U' R U : [R' U' R , D]];[R' U : [R U' R' , D']];;[U' L' U , R];[D R' U : [R U' R' , D]];[R U' : [D , R' U R]];[D' R U' : [D' , R' U R]];[U R' U' : [D' , R U R']];[D R U' : [D' , R' U R]];[R U' : [D' , R' U R]]".split(";"),
    ";[R2 U : [R' U' R , D]];[U' R' : [U' , R' D' R]];;[l U' l' , F];[R B' R' : [R' D R , U]];[U D R' F' : [D , R U' R']];[R U R' U D : [R D R' , U2]];[U' R' U2 : [R D R' , U]];[D R' : [D , R' U R]];[U R2 U' : [D' , R U R']];[R B' : [R' U' R , D]];[R' : [D , R' U R]];[R , U' L' U];;[U' R' U2 : [R D' R' , U]];[D' R' : [D , R' U R]];[U' R' : [U' , R' D R]];[D' U' R' : [U' , R' D R]];[U R2 : [U' , R' D' R]];[R2 U : [R' U' R , D']]".split(";"),
    "[D' U' : [R D R' , U2]];[D' : [U' , R D R']];[D : [R' D R , U']];[U D R' : [U' , R' D R]];[l U2 l' , F];[U D : [R U' R' , D]];;[D R' D : [F2 , D' R D R']];[U : [R U' R' , D2]];[D' R D' : [R' U' R , D2]];[U' R' U' : [R D' R' , U2]];[U' : [R' U' R , D']];[U R' D' : [R U' R' , D']];[D R' U : [D , R U' R']];[U' R' U' : [R D' R' , U']];;[D R' D : [F' , D' R D R']];[U' D' R' D' : [R D R' , U']];[U' D' R' : [U , R' D R]];[U R2 : [U' , R' D2 R]];".split(";"),
    "[D U' : [R D' R' , U2]];[D : [U' , R D' R']];[D' : [R' D' R , U']];[R U : [R' D' R , U]];[D' R' U' : [D' , R U R']];[R' D R : [D' , R U R']];[D2 : [R U R' , D]];[R U : [R' D' R , U2]];[R U R' U' : [D' , R U R']];[D : [R U R' , D2]];[R' F' R D' U : [R' D R , U2]];;[R U R' , D'];[R U' : [R' U R , D]];[D' R2' : [U , R D R']];[D2' R' : [F' , R D' R' D]];;[D' R : [U' , R D' R']];[D' R D : [R' D' R , U]];;[R U' D' : [R' U R , D2]]".split(";"),
    "[R F' R' U' : [R D R' , U2]];[R F' : [R' U' R , D]];[R' U' R : [F2' , R' U R U']];[D' R : [R D' R' , U]];[U' R' U : [R U' R' , D]];;[D R U' R' : [R' D R , U2]];[D' R : [R D' R' , U2]];[U R U' : [F2' , U R' U' R]];;[U' R' : [R' D R , U2]];[U' R' : [R' D R , U]];[R D : [U , R' D' R]];[D' R U' : [R' U R , D']];[U' R' : [R' D R , U']];[U' D' R' D' : [U' , R D R']];[D' R : [R D' R' , U']]; ;[U' R' U R : [R U' R' , D]];[U' R2' : [D , R2 U R2' U' R2]];[R U' D' : [R' U R , D']]".split(";"),
    "[R' D R U' R D' R' , U2];[R' D R U' R D' R' , U];[R' D R U' R D' R' , U'];[U R' D' : [U' , R' D' R]];[U' D' R' U : [R U' R' , D]];[U D R D' : [U' , R' D R]];[R U' D R' : [R' D R , U2]];[R U' R' D' : [R' D R , U2]];;[R U' R' : [R' D R , U2]];[D' U' R' : [R' D R , U2]];[D' U R U' : [F2 , U R' U' R]];;[U R' U' : [R U R' , D']];[D' U' R' : [R' D R , U']];[U' D' R' : [R' D R , U]];[D' R D : [U , R' D' R]];[U' R' U R : [D , R U' R']];;[D R U' R' : [D' , R' U R]];[R U' R' U' : [R D' R' , U2]]".split(";"),
    "[R D' R' : [R' D R , U2]];[U' , R D' R' U R' D R];[R D' R' : [R' D R , U']];[D R : [R D' R', U]];[R U' R' : [D , R' U R]];[U R : [D , R U' R']];[R D' R' : [R' D R , U]];[D R : [R D' R' , U2]];[U R' D' : [U' , R' D R]];[D R : [R D' R' , U']];[U R U' D' : [R' D R , U2]];;[D' R U' R' : [R' D R , U2]];[D R U' : [R' U R , D']];[U R : [D' , R U' R']];[U R : [D2 , R U' R']];;;[D R U' R' : [R' U R , D']];;[R U' R' : [D' , R' U R]]".split(";"),
    "[R' U' D' R : [R U' R' , D]];[R' B : [D' , R U R']];[R' D' R : [R U' R' , D]];[R : [R D' R' , U]];[U' D R' U : [R U' R' , D]];[D U R U' : [F2' , U R' U' R]];;[R : [R D' R' , U2]];[R' D' R : [R U R' , D]];[D R D : [U , R' D' R]];[D U' R' : [R' D R , U2]];[U D' R D' : [U' , R' D R]];[R : [R D' R' , U']];[R U' : [R' U R , D']];[R2 U : [D' , R' U' R]];;[R U' D : [R' U R , D2]];[R U' D2 : [R' U R , D]];[R U' R' U : [R D' R' , U2]];[R U' R' : [R' U R , D']];".split(";")
];

const speffzArr = ['A','A','B','D',' ','B','D','C','C',
                    'E','E','F','H',' ','F','H','G','G',
                    'I','I','J','L',' ','J','L','K','K',
                    'M','M','N','P',' ','N','P','O','O',
                    'Q','Q','R','T',' ','R','T','S','S',
                    'U','U','V','X',' ','V','X','W','W'];

let customLetters = speffzArr;
if (localStorage.getItem("customArr") !== null) {
    customLetters = localStorage.getItem("customArr").split(";");
}

function Alg(letter1, letter2, pos1, pos2, type, alg, letterpair) {
    this.letter1 = letter1;
    this.letter2 = letter2;
    this.pos1 = pos1;
    this.pos2 = pos2;
    this.type = type;
    this.alg = alg;
    this.letterpair = letterpair;
}

//Startfunksjon
$(function () {
    learnedComms = localStorage.getItem("learnedComms") || "";

    $("#cornerContentAll").css("display", "block");
    $("#aCornerAll").css("fontWeight", "bold");

    $("#innerLetterSchemeEdit").on("click", function (e) {
        e.stopPropagation();
    });

    let size = 0;

    if ($(window).width() >= $(window).height()) {
        size = $(window).width() / 60;
    }
    else {
        size = $(window).height() / 60;
    }

    $("#btnGrid").width(size * 12);
    $("#btnGrid :button").width(size);
    $("#btnGrid :button").height(size);

    $("#btnColors :button").width(size);
    $("#btnColors :button").height(size);

    /*$("#hiddenInput").keypress(function() {
        getKeyFromInput();
    });*/
    updateLetters();

    selectTopColor(selectedTopBtn, selectedTopColor);
    selectFrontColor(selectedFrontBtn, selectedFrontColor);

    makeAlgs();

    showCorners();
});

function getKeyFromInput() {
    if ($("#hiddenInput").val() !== "" && selectedButton !== null) {
        $(selectedButton).html($("#hiddenInput").val().toUpperCase());
        $("#btnGrid :button").css("font-weight", "normal");

        saveLetters();
        makeAlgs();
        $("#hiddenInput").val("");
        $("#hiddenInput").blur();
        selectedButton == null;
    }
}

function showLetterScheme() {
    showingLetters = true;
    $("#letterSchemeEdit").css("display", "block");
}

function closeLetterScheme() {
    showingLetters = false;
    selectedButton = null;
    $("#btnGrid :button").css("font-weight", "normal");
    $("#letterSchemeEdit").css("display", "none");
}

function showCorners() {
    if (showing !== "corners") {
        showing = "corners";

        $("#cornerMenu").css("display", "grid");
        $("#cornerContent").css("display", "block");
        $("#edgeMenu").css("display", "none");
        $("#edgeContent").css("display", "none");

        $(".cornerContentClass").css("display", "none");
        $(".edgeContentClass").css("display", "none");
        $("#cornerContentAll").css("display", "block");
        $(".aCorner").css("fontWeight", "normal");
        $("#aCornerAll").css("fontWeight", "bold");

        $("#titleCorners").css("text-decoration", "underline");
        $("#titleEdges").css("text-decoration", "none");
    }
}

function showEdges() {
    if (showing !== "edges") {
        showing = "edges";

        $("#cornerMenu").css("display", "none");
        $("#cornerContent").css("display", "none");
        $("#edgeMenu").css("display", "grid");
        $("#edgeContent").css("display", "block");

        $(".cornerContentClass").css("display", "none");
        $(".edgeContentClass").css("display", "none");
        $("#edgeContentAll").css("display", "block");
        $(".aEdges").css("fontWeight", "normal");
        $("#aEdgeAll").css("fontWeight", "bold");
        
        $("#titleCorners").css("text-decoration", "none");
        $("#titleEdges").css("text-decoration", "underline");
    }
}

function chooseCorner(val) {
    $(".cornerContentClass").css("display", "none");
    $(".aCorner").css("fontWeight", "normal");

    $("#cornerContent" + val).css("display", "block");
    $("#aCorner"+val).css("fontWeight", "bold");
}

function chooseEdge(val) {
    $(".edgeContentClass").css("display", "none");
    $(".aEdge").css("fontWeight", "normal");

    $("#edgeContent" + val).css("display", "block");
    $("#aEdge"+val).css("fontWeight", "bold");
}

function changeLetter(button) {
    $("#hiddenInput").focus();
    $("#btnGrid :button").css("font-weight", "normal");
    $(button).css("font-weight", "bold");
    selectedButton = button;
}

function speffz() {
    let i = 0;
    for (let b of $("#btnGrid :button")) {
        $(b).html(speffzArr[i]);
        i++;
    }
    saveLetters();
    updateLetters();
    makeAlgs();
}

function saveLetters() {
    let custom = "";
    let i = 0;
    for (let b of $("#btnGrid :button")) {
        if (i === 53) {
            custom += $(b).html();
        }
        else {
            custom += $(b).html() + ";";
        }
        i++;
    }
    localStorage.setItem("customArr", custom);
    customLetters = localStorage.getItem("customArr").split(";");
}

function updateLetters() {
    let i = 0;
    for (let b of $("#btnGrid :button")) {
        $(b).html(customLetters[i]);
        i++;
    }
}

function oppositeColor(color) {
    switch (color) {
        case 'white':
            return 'yellow';
        case 'yellow':
            return 'white';
        case 'green':
            return 'blue';
        case 'blue':
            return 'green';
        case 'red':
            return 'orange';
        case 'orange':
            return 'red';
    }
}

function cleanColor() {
    selectedTopColor = "white";
    selectedFrontColor = "green";
    localStorage.setItem("selectedTopBtn", "btnTopW");
    localStorage.setItem("selectedTopColor", selectedTopColor);
    localStorage.setItem("selectedFrontBtn", "btnFrontG");
    localStorage.setItem("selectedFrontColor", selectedFrontColor);

    $(".topBtn").css("box-shadow", "none");
    $("#btnTopW").css("box-shadow", "0 0 5px 1px white");

    $(".frontBtn").css("box-shadow", "none");
    $("#btnFrontG").css("box-shadow", "0 0 5px 1px green");

    updateColor();
}

function selectTopColor(button, color) {
    if (selectedFrontColor !== color && selectedFrontColor !== oppositeColor(color)) {
        selectedTopBtn = button;
        selectedTopColor = color;

        localStorage.setItem("selectedTopBtn", selectedTopBtn);
        localStorage.setItem("selectedTopColor", selectedTopColor);

        $(".topBtn").css("box-shadow", "none");
        $("#"+button).css("box-shadow", "0 0 5px 1px "+color);

        updateColor();
    }
    else {
        cleanColor();
    }
}

function selectFrontColor(button, color) {
    if (selectedTopColor !== color && selectedTopColor !== oppositeColor(color)) {
        selectedFrontBtn = button;
        selectedFrontColor = color;

        localStorage.setItem("selectedFrontBtn", selectedFrontBtn);
        localStorage.setItem("selectedFrontColor", selectedFrontColor);

        $(".frontBtn").css("box-shadow", "none");
        $("#" + button).css("box-shadow", "0 0 5px 1px " + color);

        updateColor();
    }
    else {
        cleanColor();
    }
}

function updateColor() {

    let colorArr = [];

    let w = 'white';
    let o = 'orange';
    let g = 'green';
    let r = 'red';
    let b = 'blue';
    let y = 'yellow';

    switch (selectedTopColor) {
        case "white":
            colorArr = [w,o,g,r,b,y];
            break;
        case "yellow":
            colorArr = [y,r,g,o,b,w];
            break;
        case "orange":
            colorArr = [o,y,g,w,b,r];
            break;
        case "green":
            colorArr = [g,o,y,r,w,b];
            break;
        case "red":
            colorArr = [r,w,g,y,b,o];
            break;
        case "blue":
            colorArr = [b,o,w,r,y,g];
            break;
    }

    let cU = colorArr[0];
    let cL = colorArr[1];
    let cF = colorArr[2];
    let cR = colorArr[3];
    let cB = colorArr[4];
    let cD = colorArr[5];

    let nU = cU;
    let nL = cL;
    let nF = cF;
    let nR = cR;
    let nB = cB;
    let nD = cD;

    while (colorArr[2] !== selectedFrontColor) {
        nL = colorArr[2];
        nF = colorArr[3];
        nR = colorArr[4];
        nB = colorArr[1];

        colorArr = [nU,nL,nF,nR,nB,nD];
    }

    $("#buttonsU :button").css("background", colorArr[0]);
    $("#buttonsL :button").css("background", colorArr[1]);
    $("#buttonsF :button").css("background", colorArr[2]);
    $("#buttonsR :button").css("background", colorArr[3]);
    $("#buttonsB :button").css("background", colorArr[4]);
    $("#buttonsD :button").css("background", colorArr[5]);

    localStorage.setItem("uColor",colorArr[0]);
    localStorage.setItem("lColor",colorArr[1]);
    localStorage.setItem("fColor",colorArr[2]);
    localStorage.setItem("rColor",colorArr[3]);
    localStorage.setItem("bColor",colorArr[4]);
    localStorage.setItem("dColor",colorArr[5]);
}

function makeAlgs() {
    makeCornerAlgs();
    makeEdgeAlgs();
}

function makeCornerAlgs() {
    let cornerContentAllArr = [];
    let cornerContent0Arr = [];
    let cornerContent1Arr = [];
    let cornerContent2Arr = [];
    let cornerContent3Arr = [];
    let cornerContent4Arr = [];
    let cornerContent5Arr = [];
    let cornerContent6Arr = [];
    let cornerContent7Arr = [];
    let cornerContent8Arr = [];

    for (let y=0; y<ufrTypes.length; y++) {
        for (let x=0; x<ufrTypes[y].length; x++) {
            let alg = new Alg(getLetter(corners[x]), getLetter(corners[y]), corners[x], corners[y], ufrTypes[y][x], ufrComms[y][x], corners[x]+" / "+corners[y]);
            if (ufrComms[y][x] !== "") {
                cornerContentAllArr.push(alg);
            }
            //Sjekk localstorage for sjekkbokser her
            if (ufrTypes[y][x] === "U-Top / D-Side") {
                cornerContent0Arr.push(alg);
            }
            else if (ufrTypes[y][x] === "U-Top / D-Bottom") {
                cornerContent1Arr.push(alg);
            }
            else if (ufrTypes[y][x] === "D-Bottom / D-Bottom") {
                cornerContent2Arr.push(alg);
            }
            else if (ufrTypes[y][x] === "D-Side / D-Side") {
                cornerContent3Arr.push(alg);
            }
            else if (ufrTypes[y][x] === "BUR / D-Any" || ufrTypes[y][x] === "LUF / D-Any") {
                cornerContent4Arr.push(alg);
            }
            else if (ufrTypes[y][x] === "U-Side / D-Any") {
                cornerContent5Arr.push(alg);
            }
            else if (ufrTypes[y][x] === "D-Side / D-Bottom") {
                cornerContent6Arr.push(alg);
            }
            else if (ufrTypes[y][x] === "U-Any / U-Any") {
                cornerContent7Arr.push(alg);
            }
            else if (ufrTypes[y][x] === "Special") {
                cornerContent8Arr.push(alg);
            }
        }
    }

    listAlgs("cornerContentAll", cornerContentAllArr);
    listAlgs("cornerContent0", cornerContent0Arr);
    listAlgs("cornerContent1", cornerContent1Arr);
    listAlgs("cornerContent2", cornerContent2Arr);
    listAlgs("cornerContent3", cornerContent3Arr);
    listAlgs("cornerContent4", cornerContent4Arr);
    listAlgs("cornerContent5", cornerContent5Arr);
    listAlgs("cornerContent6", cornerContent6Arr);
    listAlgs("cornerContent7", cornerContent7Arr);
    listAlgs("cornerContent8", cornerContent8Arr);
}

function makeEdgeAlgs() {
    let edgeContentAllArr = [];
    let edgeContent0Arr = [];
    let edgeContent1Arr = [];
    let edgeContent2Arr = [];
    let edgeContent3Arr = [];
    let edgeContent4Arr = [];
    let edgeContent5Arr = [];
    let edgeContent6Arr = [];
    let edgeContent7Arr = [];

    for (let y=0; y<ufTypes.length; y++) {
        for (let x=0; x<ufTypes[y].length; x++) {
            let alg = new Alg(getLetter(edges[x]), getLetter(edges[y]), edges[x], edges[y], ufTypes[y][x], ufComms[y][x], edges[x]+" / "+edges[y]);
            if (ufComms[y][x] !== "") {
                edgeContentAllArr.push(alg);
            }
            if (ufTypes[y][x] === "4-Mover") {
                edgeContent0Arr.push(alg);
            }
            else if (ufTypes[y][x] === "M-Swap") {
                edgeContent1Arr.push(alg);
            }
            else if (ufTypes[y][x] === "U-Swap") {
                edgeContent2Arr.push(alg);
            }
            else if (ufTypes[y][x] === "E-Swap") {
                edgeContent3Arr.push(alg);
            }
            else if (ufTypes[y][x] === "S-Swap") {
                edgeContent4Arr.push(alg);
            }
            else if (ufTypes[y][x] === "F-Swap") {
                edgeContent5Arr.push(alg);
            }
            else if (ufTypes[y][x] === "S-Insert") {
                edgeContent6Arr.push(alg);
            }
            else if (ufTypes[y][x] === "Special") {
                edgeContent7Arr.push(alg);
            }
        }
    }

    listAlgs("edgeContentAll", edgeContentAllArr);
    listAlgs("edgeContent0", edgeContent0Arr);
    listAlgs("edgeContent1", edgeContent1Arr);
    listAlgs("edgeContent2", edgeContent2Arr);
    listAlgs("edgeContent3", edgeContent3Arr);
    listAlgs("edgeContent4", edgeContent4Arr);
    listAlgs("edgeContent5", edgeContent5Arr);
    listAlgs("edgeContent6", edgeContent6Arr);
    listAlgs("edgeContent7", edgeContent7Arr);
}

function listAlgs(content, arr) {
    let learnCount = 0;

    let utL = "<table class='tblAlgs'>";
    let utR = "<table class='tblAlgs'>";

    arr.sort(compareLetters2).sort(compareLetters1).sort(compareLettersLearned);

    let i=0;
    for (let a of arr) {
        let id = content+"_"+i;
        let out = "";
        let checked = learnedComms.includes(";"+a.letterpair+";") ? " checked" : "";
        if (checked === " checked") {
            learnCount++;
        }
        if (content.includes("All")) {
            out = "<tr><td><input class='form-check-input' type='checkbox' onclick='toggleCB(\""+a.letterpair+"\")'"+checked+"></td><td><b>"+a.letter1+" / "+a.letter2+"</b></td><td id='"+id+"' class='clickableTD' data-alg='"+a.alg.replaceAll("'", "&apos;")+"' data-type='"+a.type+"' data-current='type' onclick='toggleTypeAlg(\""+id+"\")'>"+a.type+"</td></tr>";
        }
        else {
            out = "<tr><td><input class='form-check-input' type='checkbox' onclick='toggleCB(\""+a.letterpair+"\")'"+checked+"></td><td><b>"+a.letter1+" / "+a.letter2+"</b></td><td>"+a.alg+"</td></tr>";
        }
        if (i < arr.length / 2) {
            utL += out;
        }
        else {
            utR += out;
        }
        i++;
    }
    let ut = "<h2>" + learnCount + " / " + arr.length + " learned</h2>";

    utL += "</table>";
    utR += "</table>";

    if (window.innerHeight > window.innerWidth) {
        ut += "<div id='"+content+"' style='display: block'>"+utL+"<div></div>"+utR+"</div>"
    }
    else {
        ut += "<div id='"+content+"' style='display: grid; grid-template-columns: 3fr 1fr 3fr'>"+utL+"<div></div>"+utR+"</div>"
    }

    $("#"+content).html(ut);
}

function toggleCB(lp) {
    if (learnedComms.includes(";"+lp+";")) {
        learnedComms = learnedComms.replace(";"+lp+";", "");
    }
    else {
        learnedComms += ";"+lp+";";
    }

    localStorage.setItem("learnedComms", learnedComms);
    makeAlgs();
}

function toggleTypeAlg(id) {
    let td = $("#"+id);

    if (prevAlg && prevAlg !== "#" + id) {
        $(prevAlg).data("current", "type");
        $(prevAlg).html($(prevAlg).data("type"));
    }

    if ($(td).data("current") === "type") {
        $(td).data("current", "alg");
        $(td).html($(td).data("alg"));
    }
    else {
        $(td).data("current", "type");
        $(td).html($(td).data("type"));
    }
    prevAlg = "#" + id;
}

function getLetter(piece) {
    return customLetters[pieces.indexOf(piece)];
}

function compareLetters1(a, b) {
    if (a.letter1 < b.letter1){
        return -1;
    }
    if (a.letter1 > b.letter1){
        return 1;
    }
    return 0;
}

function compareLetters2(a, b) {
    if (a.letter2 < b.letter2){
        return -1;
    }
    if (a.letter2 > b.letter2){
        return 1;
    }
    return 0;
}

function compareLettersLearned(a, b) {
    if (learnedComms.includes(";"+a.letterpair+";") && !learnedComms.includes(";"+b.letterpair+";")){
        return 1;
    }
    else if (!learnedComms.includes(";"+a.letterpair+";") && learnedComms.includes(";"+b.letterpair+";")) {
        return -1;
    }
    return 0;
}