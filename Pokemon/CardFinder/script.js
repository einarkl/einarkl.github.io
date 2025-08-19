const SHEET_URL = "https://docs.google.com/spreadsheets/d/1CEQd82n6KfbNi4Whi4X5ApAk1uVD5LnMKN8FQ-RAAPg/gviz/tq?tqx=out:csv&gid=0";

let previewData = {};
let allPreviewData = {}; // Store all matches for current search, unfiltered
let previousSearch = ""; // Store previous search input for comparison

function normalize(str) {
    return (str || "").trim().toLowerCase();
}

function toCamelCase(str) {
    return str
        .toLowerCase()
        .split(/[\s-_]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

function createTable(data) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    const headers = Object.keys(data[0]);
    const headRow = document.createElement("tr");
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        headRow.appendChild(th);
    });
    thead.appendChild(headRow);

    data.forEach(row => {
        const tr = document.createElement("tr");
        headers.forEach(header => {
            const td = document.createElement("td");
            td.textContent = row[header] || "";
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}

function showPreview(previewData, keepTabIndex = 0) {
    const container = document.getElementById("preview");
    container.innerHTML = ""; // Clear existing

    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "tab-buttons";

    const tabDivs = [];
    let tabBtns = [];

    const names = Object.keys(previewData);
    // Clamp keepTabIndex to available tabs
    let activeTab = Math.max(0, Math.min(keepTabIndex, names.length - 1));

    names.forEach((name, index) => {
        const button = document.createElement("button");
        button.textContent = toCamelCase(name);
        button.className = "tab-btn" + (index === activeTab ? " active" : "");
        button.onclick = () => {
            tabDivs.forEach(div => div.classList.remove("active"));
            tabDivs[index].classList.add("active");
            tabBtns.forEach(b => b.classList.remove("active"));
            button.classList.add("active");
            setTheme(localStorage.getItem("theme") || "light"); // reapply tab style
        };
        buttonsDiv.appendChild(button);
        tabBtns.push(button);

        const tabContent = document.createElement("div");
        tabContent.className = "tab-content" + (index === activeTab ? " active" : "");
        tabContent.appendChild(createTable(previewData[name]));
        tabDivs.push(tabContent);
    });

    container.appendChild(buttonsDiv);
    tabDivs.forEach(div => container.appendChild(div));
    setTheme(localStorage.getItem("theme") || "light"); // style tabs
}

// --- NEW: Filter preview data by appearance type ---
function filterPreviewDataByAppearance(appearance) {
    const filtered = {};
    for (const name in allPreviewData) {
        filtered[name] = allPreviewData[name].filter(row => {
            if (appearance === "both") return true;
            return (row["Appearance Type"] || "").toLowerCase() === appearance;
        });
    }
    return filtered;
}

// --- NEW: Listen for appearance filter changes and update preview without fetching ---
document.addEventListener('DOMContentLoaded', () => {
    const appearanceSelect = document.getElementById("appearance");
    if (appearanceSelect) {
        appearanceSelect.addEventListener("change", function () {
            if (allFetchedData) {
                // Find the current active tab index
                const tabBtns = document.querySelectorAll(".tab-btn");
                let activeTab = 0;
                tabBtns.forEach((btn, idx) => {
                    if (btn.classList.contains("active")) activeTab = idx;
                });

                findCards(false, true, activeTab); // Pass activeTab to keep it selected
            }
        });
    }

    // Make [Enter] in input trigger search
    const namesInputElem = document.getElementById("names");
    if (namesInputElem) {
        namesInputElem.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                findCards();
            }
        });
    }
});

// Utility: get query parameter value by name
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Add loading overlay helpers
function showLoading() {
    let overlay = document.getElementById("loadingOverlay");
    // Determine theme for spinner icon and overlay style
    let theme = localStorage.getItem("theme") || "light";
    let spinnerIcon = theme === "dark" ? "./icons/rotate-dark.svg" : "./icons/rotate-light.svg";
    let overlayBg = theme === "dark" ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.55)";
    let boxBg = theme === "dark" ? "#23272a" : "#fff";
    let boxColor = theme === "dark" ? "#fff" : "#23272a";
    let boxShadow = theme === "dark"
        ? "0 2px 16px 0 rgba(0,0,0,0.18)"
        : "0 2px 16px 0 rgba(0,0,0,0.08)";

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "loadingOverlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.zIndex = "9999";
        overlay.innerHTML = `
            <div id="loadingOverlayBox" style="
                background: ${boxBg};
                color: ${boxColor};
                padding: 32px 48px;
                border-radius: 16px;
                box-shadow: ${boxShadow};
                font-size: 1.3rem;
                display: flex;
                align-items: center;
                gap: 18px;
            ">
                <img id="loadingSpinnerIcon" src="${spinnerIcon}" alt="Loading" style="width: 38px; height: 38px; animation: spin 1s linear infinite;">
                Loading cards...
            </div>
        `;
        // Add spinner animation
        const style = document.createElement("style");
        style.textContent = `
            @keyframes spin { 100% { transform: rotate(360deg); } }
        `;
        overlay.appendChild(style);
        document.body.appendChild(overlay);
    } else {
        // Update spinner icon and overlay style if overlay already exists
        let spinner = overlay.querySelector("#loadingSpinnerIcon");
        if (spinner) spinner.src = spinnerIcon;
        let box = overlay.querySelector("#loadingOverlayBox");
        if (box) {
            box.style.background = boxBg;
            box.style.color = boxColor;
            box.style.boxShadow = boxShadow;
        }
    }
    overlay.style.background = overlayBg;
    overlay.style.display = "flex";
}

// Update spinner icon and overlay box when theme changes
function updateLoadingSpinnerIcon(theme) {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) {
        const spinner = overlay.querySelector("#loadingSpinnerIcon");
        const box = overlay.querySelector("#loadingOverlayBox");
        if (spinner) {
            spinner.src = theme === "dark" ? "./icons/rotate-dark.svg" : "./icons/rotate-light.svg";
        }
        if (box) {
            box.style.background = theme === "dark" ? "#23272a" : "#fff";
            box.style.color = theme === "dark" ? "#fff" : "#23272a";
            box.style.boxShadow = theme === "dark"
                ? "0 2px 16px 0 rgba(0,0,0,0.18)"
                : "0 2px 16px 0 rgba(0,0,0,0.08)";
        }
        overlay.style.background = theme === "dark"
            ? "rgba(0,0,0,0.35)"
            : "rgba(255,255,255,0.55)";
    }
}

//
function hideLoading() {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.style.display = "none";
}

// On page load, check for ?search= and trigger search
window.addEventListener('DOMContentLoaded', () => {
    // Set theme and styles first
    setTheme(localStorage.getItem("theme") || "light");

    // Wait for CSS to be loaded before searching
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(triggerSearchFromURL, 0);
    } else {
        window.addEventListener("load", triggerSearchFromURL);
    }
});

function triggerSearchFromURL() {
    const search = getQueryParam("search");
    if (search) {
        const namesInputElem = document.getElementById("names");
        if (namesInputElem) {
            namesInputElem.value = search;
            findCards(true);
        }
    }
}

function downloadResults() {
    const format = document.getElementById("format").value;

    if (Object.keys(previewData).length === 0) {
        alert("Please search first to generate results.");
        return;
    }

    if (format === "excel") {
        const wb = XLSX.utils.book_new();
        for (const name in previewData) {
            const ws = XLSX.utils.json_to_sheet(previewData[name]);
            XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31));
        }
        XLSX.writeFile(wb, "pokemon_cards.xlsx");
    } else if (format === "csv") {
        const zip = new JSZip();
        for (const name in previewData) {
            const csv = Papa.unparse(previewData[name]);
            zip.file(`${name}_cards.csv`, '\uFEFF' + csv);
        }
        zip.generateAsync({ type: "blob" }).then(content => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(content);
            link.download = "pokemon_cards.zip";
            link.click();
        });
    }
}

// Theme toggle logic (fix for non-fixed button)
function toggleTheme() {
    let theme = localStorage.getItem("theme");
    if (!theme) theme = "light";
    theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", theme);
    setTheme(theme);
}

function setTheme(theme) {
    // Modern color palette
    const dark = {
        bg: "#181a1b",
        fg: "#f1f1f1",
        card: "#23272a",
        border: "#444",
        accent: "#fff",
        inputBg: "#23272a",
        inputFg: "#f1f1f1",
        inputBorder: "#fff",
        btnBg: "#23272a",
        btnFg: "#f1f1f1",
        btnBorder: "#fff",
        btnHover: "#fff",
        btnHoverFg: "#23272a",
        tabBg: "#23272a",
        tabFg: "#fff",
        tabActiveBg: "#fff",
        tabActiveFg: "#23272a"
    };
    const light = {
        bg: "#f7f9fa",
        fg: "#23272a",
        card: "#fff",
        border: "#d1d5db",
        accent: "#23272a",
        inputBg: "#fff",
        inputFg: "#23272a",
        inputBorder: "#23272a",
        btnBg: "#fff",
        btnFg: "#23272a",
        btnBorder: "#23272a",
        btnHover: "#23272a",
        btnHoverFg: "#fff",
        tabBg: "#fff",
        tabFg: "#23272a",
        tabActiveBg: "#23272a",
        tabActiveFg: "#fff"
    };
    const c = theme === "dark" ? dark : light;

    // Font
    document.body.style.fontFamily = "'Segoe UI', 'Inter', 'Roboto', 'Arial', sans-serif";
    document.body.style.letterSpacing = "0.01em";

    // Body and text
    document.documentElement.style.background = c.bg;
    document.documentElement.style.color = c.fg;

    // Tables
    document.querySelectorAll("table").forEach(table => {
        table.style.background = c.card;
        table.style.color = c.fg;
        table.style.borderRadius = "10px";
        table.style.overflow = "hidden";
        table.style.boxShadow = "0 2px 12px 0 rgba(0,0,0,0.08)";
        table.style.fontFamily = "'Segoe UI', 'Inter', 'Roboto', 'Arial', sans-serif";
    });
    document.querySelectorAll("th, td").forEach(el => {
        el.style.background = c.card;
        el.style.color = c.fg;
        el.style.borderColor = c.border;
        el.style.padding = "10px 8px";
        el.style.fontFamily = "'Segoe UI', 'Inter', 'Roboto', 'Arial', sans-serif";
    });

    // Inputs & selects
    document.querySelectorAll("input, select").forEach(el => {
        el.style.background = c.inputBg;
        el.style.color = c.inputFg;
        el.style.border = `2px solid ${c.inputBorder}`;
        el.style.borderRadius = "7px";
        el.style.padding = "10px 12px";
        el.style.margin = "5px 0";
        el.style.fontSize = "1.08rem";
        el.style.boxShadow = "0 1px 4px 0 rgba(0,0,0,0.03)";
        el.style.transition = "border-color 0.2s";
        el.style.fontFamily = "'Segoe UI', 'Inter', 'Roboto', 'Arial', sans-serif";
    });

    // Buttons (except tab buttons)
    document.querySelectorAll("button:not(.tab-btn)").forEach(btn => {
        btn.style.background = c.btnBg;
        btn.style.color = c.btnFg;
        btn.style.border = `2px solid ${c.btnBorder}`;
        btn.style.borderRadius = "7px";
        btn.style.padding = "10px 18px";
        btn.style.fontWeight = "600";
        btn.style.fontSize = "1.08rem";
        btn.style.cursor = "pointer";
        btn.style.transition = "background 0.2s, color 0.2s, border-color 0.2s";
        btn.style.fontFamily = "'Segoe UI', 'Inter', 'Roboto', 'Arial', sans-serif";
        btn.onmouseenter = () => {
            btn.style.background = c.btnHover;
            btn.style.color = c.btnHoverFg;
            btn.style.borderColor = c.btnHover;
        };
        btn.onmouseleave = () => {
            btn.style.background = c.btnBg;
            btn.style.color = c.btnFg;
            btn.style.borderColor = c.btnBorder;
        };
    });

    // Tab buttons
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.style.background = c.tabBg;
        btn.style.color = c.tabFg;
        btn.style.border = "none";
        btn.style.borderRadius = "18px 18px 0 0";
        btn.style.padding = "10px 22px";
        btn.style.marginRight = "6px";
        btn.style.fontWeight = "600";
        btn.style.fontSize = "1.08rem";
        btn.style.fontFamily = "'Segoe UI', 'Inter', 'Roboto', 'Arial', sans-serif";
        btn.style.cursor = "pointer";
        btn.style.boxShadow = "0 2px 8px 0 rgba(0,0,0,0.04)";
        btn.style.transition = "background 0.2s, color 0.2s";
        if (btn.classList.contains("active")) {
            btn.style.background = c.tabActiveBg;
            btn.style.color = c.tabActiveFg;
        }
        btn.onmouseenter = () => {
            btn.style.background = c.tabActiveBg;
            btn.style.color = c.tabActiveFg;
        };
        btn.onmouseleave = () => {
            if (btn.classList.contains("active")) {
                btn.style.background = c.tabActiveBg;
                btn.style.color = c.tabActiveFg;
            } else {
                btn.style.background = c.tabBg;
                btn.style.color = c.tabFg;
            }
        };
    });

    // Theme toggle button (no fixed, just icon)
    const toggleBtn = document.getElementById("btnToggleTheme");
    if (toggleBtn) {
        const icon = theme === "dark" ? "./icons/dark-theme.svg" : "./icons/light-theme.svg";
        toggleBtn.innerHTML = `<img src="${icon}" alt="Toggle theme" style="width:28px;height:28px;vertical-align:middle;">`;
        toggleBtn.style.background = "none";
        toggleBtn.style.color = "inherit";
        toggleBtn.style.border = "none";
        toggleBtn.style.borderRadius = "50%";
        toggleBtn.style.width = "48px";
        toggleBtn.style.height = "48px";
        toggleBtn.style.fontSize = "1.5rem";
        toggleBtn.style.boxShadow = "none";
        toggleBtn.style.display = "flex";
        toggleBtn.style.alignItems = "center";
        toggleBtn.style.justifyContent = "center";
        toggleBtn.onmouseenter = null;
        toggleBtn.onmouseleave = null;
        toggleBtn.style.cursor = "pointer";
        toggleBtn.style.position = "static";
        toggleBtn.style.top = "";
        toggleBtn.style.right = "";
        toggleBtn.style.marginBottom = "16px";
    }

    // Update loading spinner icon if overlay is visible
    updateLoadingSpinnerIcon(theme);
}

// Store all fetched data for client-side filtering
let allFetchedData = null;

function findCards(fromURL = false, filterOnly = false, keepTabIndex = 0) {
    const namesInputElem = document.getElementById("names");
    const namesInput = fromURL ? namesInputElem.value : namesInputElem.value.trim();
    const appearance = document.getElementById("appearance").value;
    const status = document.getElementById("status");
    const container = document.getElementById("preview");
    if (normalizeNamesInput(namesInput) !== previousSearch) {
        previousSearch = normalizeNamesInput(namesInput);

        // Only update URL if not from URL load or filterOnly
        if (!fromURL && !filterOnly) {
            const newURL = new URL(window.location);
            if (namesInput) {
                newURL.searchParams.set('search', namesInput);
            } else {
                newURL.searchParams.delete('search');
            }
            window.history.replaceState({}, '', newURL);
        }

        // If we already have allFetchedData, just filter it
        if (allFetchedData && filterOnly) {
            status.textContent = "Filtering cards...";
            previewData = {};
            const names = namesInput
                .split(',')
                .map(name => normalize(name))
                .filter(n => n.length > 0);

            let totalFound = 0;
            for (const rawName of names) {
                const displayName = toCamelCase(rawName);
                const seen = new Set();
                const matched = [];

                for (const row of allFetchedData) {
                    const cardName = row["Card Name"] || "";
                    const otherNames = row["Other Pokémon in Artwork"] || "";
                    const uniqueID = row["ID"];

                    const isMain = cardName.toLowerCase().includes(rawName);
                    const isCameo = otherNames.toLowerCase().includes(rawName);

                    let include = false;
                    let type = null;

                    if (isMain && (appearance === "main" || appearance === "both")) {
                        include = true;
                        type = "Main";
                    } else if (isCameo && (appearance === "cameo" || appearance === "both")) {
                        include = true;
                        type = "Cameo";
                    }

                    if (include && !seen.has(uniqueID)) {
                        seen.add(uniqueID);
                        matched.push({
                            "Appearance Type": type,
                            "Set": row["Set"],
                            "Number": row["Number"],
                            "Card Name": cardName,
                            "Type": row["Type"],
                            "Rarity / Variant": row["Rarity / Variant"],
                            "Other Pokémon in Artwork": otherNames
                        });
                    }
                }

                if (matched.length > 0) {
                    previewData[displayName] = matched;
                    totalFound += matched.length;
                }
            }

            if (totalFound === 0) {
                status.textContent = "No matching cards found.";
            } else {
                status.textContent = `Found ${totalFound} card(s). Preview generated.`;
                showPreview(previewData, keepTabIndex);
            }
            return;
        }

        // Otherwise, fetch data as normal
        container.innerHTML = ""; // Clear table on search
        status.textContent = "Fetching and filtering cards...";
        previewData = {};

        const names = namesInput
            .split(',')
            .map(name => normalize(name))
            .filter(n => n.length > 0);

        if (names.length === 0) {
            status.textContent = "Please enter at least one Pokémon name.";
            return;
        }

        showLoading(); // Show overlay

        Papa.parse(SHEET_URL, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                const data = results.data;
                allFetchedData = data; // Store for later filtering

                let totalFound = 0;

                for (const rawName of names) {
                    const displayName = toCamelCase(rawName);
                    const seen = new Set();
                    const matched = [];

                    for (const row of data) {
                        const cardName = row["Card Name"] || "";
                        const otherNames = row["Other Pokémon in Artwork"] || "";
                        const uniqueID = row["ID"];

                        const isMain = cardName.toLowerCase().includes(rawName);
                        const isCameo = otherNames.toLowerCase().includes(rawName);

                        let include = false;
                        let type = null;

                        if (isMain && (appearance === "main" || appearance === "both")) {
                            include = true;
                            type = "Main";
                        } else if (isCameo && (appearance === "cameo" || appearance === "both")) {
                            include = true;
                            type = "Cameo";
                        }

                        if (include && !seen.has(uniqueID)) {
                            seen.add(uniqueID);
                            matched.push({
                                "Appearance Type": type,
                                "Set": row["Set"],
                                "Number": row["Number"],
                                "Card Name": cardName,
                                "Type": row["Type"],
                                "Rarity / Variant": row["Rarity / Variant"],
                                "Other Pokémon in Artwork": otherNames
                            });
                        }
                    }

                    if (matched.length > 0) {
                        previewData[displayName] = matched;
                        totalFound += matched.length;
                    }
                }

                hideLoading(); // Hide overlay

                if (totalFound === 0) {
                    status.textContent = "No matching cards found.";
                } else {
                    status.textContent = `Found ${totalFound} card(s). Preview generated.`;
                    showPreview(previewData, 0);
                }
            },
            error: function (err) {
                hideLoading(); // Hide overlay on error
                console.error("Error:", err);
                status.textContent = "Error fetching the sheet.";
            }
        });
    }
}

function normalizeNamesInput(str) {
    return (str || "").replace(/\s+/g, '').toLowerCase();
}