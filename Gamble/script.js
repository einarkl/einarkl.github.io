const ODDS = 0.33;
const START_POINTS = 1000;
let points;

$(() => {
    const saved = localStorage.getItem("points");
    points = saved ? parseInt(saved) : START_POINTS;
    updatePoints();
});

function reset() {
    points = START_POINTS;
    updatePoints();
}

function gamble(percentage) {
    const bet = Math.floor(points * (percentage / 100));
    const won = Math.random() < ODDS;

    if (won) {
        points += bet;
    } else {
        points -= bet;
    }

    points = Math.max(0, points);
    updatePoints();
}

function updatePoints() {
    $("#points").text(points.toLocaleString());
    localStorage.setItem("points", points);
}