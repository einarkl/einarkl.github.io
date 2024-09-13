let username = "Anonymous";
const database = firebase.database();
let userId, userRef, userScore, userCheating;
let lastClickTime;
// let maxCPS = 22; // world record for most CPS
let maxCPS = 100; // had to set higher
let clickSpeed = 1000 / maxCPS;

$(document).ready(() => {
    // Initialize Firebase Authentication listener
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // User is signed in
            userId = user.uid;
            userRef = firebase.database().ref("users/" + userId);
            username = user.username || "Anonymous";
            userScore = user.score || 0;
            userCheating = user.cheating || 0;
            displayLeaderboard();
            fetchUserSpecificData(userId);

            initApp();
        }
        else {
            // No user is signed in, try anonymous authentication
            firebase.auth().signInAnonymously().catch(error => {
                console.error("Error during anonymous authentication:", error);
            });
        }
    });
});

function fetchUserSpecificData(userId) {
    database.ref('users/' + userId).once('value').then(snapshot => {
        const userData = snapshot.val() || {};
        username = userData.username || "Anonymous";
        userScore = userData.score || 0;
        userCheating = userData.cheating || 0;
        $("#username").val(username);
        $("#btnCount").text(userScore);
    });
}

function initApp() {
    lastClickTime = Date.now();
    $("#btnCount").off('click').click(() => {
        count1();
    });
}

function count1() {
    let timeNow = Date.now();
    if ((timeNow - lastClickTime) < clickSpeed) {
        userCheating++;
        userScore--;
        database.ref('users/' + userId).update({username: username, score: userScore, cheater: userCheating});
    }
    else {
        userScore++;
        if (userCheating > 0) {
            userCheating--;
        }

        database.ref('users/' + userId).update({username: username, score: userScore, cheater: userCheating});

        $("#btnCount").text(userScore);
    }
    lastClickTime = timeNow;
}

function updateUsername() {
    if (!firebase.auth().currentUser) {
        console.error("No authenticated user found.");
        return;
    }

    username = $("#username").val() || "Anonymous";
    database.ref('/users/' + userId).update({ username: username });
}

function displayLeaderboard() {
    database.ref('users/')
        .orderByChild('score')
        .limitToLast(10)
        .on('value', snapshot => {
            let leaderboardHTML = '';
            snapshot.forEach(childSnapshot => {
                let entry = childSnapshot.val();
                if (entry.cheater > 0) {
                    leaderboardHTML = `<li style='color: red'>${entry.username}: ${entry.score} (cheater)</li>` + leaderboardHTML;
                }
                else {
                    leaderboardHTML = `<li>${entry.username}: ${entry.score}</li>` + leaderboardHTML;
                }
            });
            $('#leaderboard').html(leaderboardHTML);
        });
}

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Dark mode is enabled
    $("html").css("background-image", "linear-gradient(to bottom, #181818, #464646");
    $("html").css("background-attachment", "fixed");
    $("#leaderboardDiv").css("color", "#aaaaaa");
    $("#leaderboard").css("color", "#aaaaaa");
    $("#btnCount").css("background-color", "#333");
    $("#btnCount").css("color", "#aaaaaa");
    $("h1").css("color", "#aaaaaa");
} else {
    // Dark mode is not enabled
    $("html").css("background-image", "");
    $("html").css("background-attachment", "");
}