document.addEventListener("DOMContentLoaded", function () {
    loadSavedValues(); // Load saved values on page load
});

function updateStats() {
    let oddsInput = document.getElementById("inpOdds").value;
    let attemptsInput = document.getElementById("inpAttempts").value;
    
    let odds = parseInt(oddsInput); 
    let attempts = parseInt(attemptsInput);
    
    // Validate input
    if (isNaN(odds) || odds < 1 || isNaN(attempts) || attempts < 1) {
        document.getElementById("odds").innerText = "Enter valid numbers!";
        return;
    }

    let probability = 1 - Math.pow(1 - (1 / odds), attempts);
    let percentage = (probability * 100).toFixed(4);

    document.getElementById("odds").innerText = `Chance of at least one success: ${percentage}%`;

    saveValues(odds, attempts); // Save values to localStorage
}

function saveValues(odds, attempts) {
    localStorage.setItem("savedOdds", odds);
    localStorage.setItem("savedAttempts", attempts);
}

function loadSavedValues() {
    let savedOdds = localStorage.getItem("savedOdds");
    let savedAttempts = localStorage.getItem("savedAttempts");

    if (savedOdds) {
        document.getElementById("inpOdds").value = savedOdds;
    }
    if (savedAttempts) {
        document.getElementById("inpAttempts").value = savedAttempts;
    }

    if (savedOdds && savedAttempts) {
        updateStats(); // Automatically calculate when loading saved values
    }
}