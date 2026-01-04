const SHEET_ID = "1oC4KAdpbUDg64wjNZ_AU9SflkZsxBXcpCOSgLYwpO8Q";
const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

let allItems = [];
let allTabs = [];
let currentLanguageOrder = "art";
let currentCollectionOrder = "none";
let currentLanguageFilter = "all";

const languageMap = {
  "english": "EN",
  "japanese": "JP",
  "french": "FR",
  "german": "DE",
  "italian": "IT",
  "russian": "RU",
  "portuguese-b": "PT-B",
  "spanish": "ES",
  "chinese-s": "CN-S",
  "chinese-t": "CN-T",
  "korean": "KR",
  "indonesian": "ID",
  "thai": "TH"
};

/* =====================
   THEME HANDLING
===================== */
const body = document.body;
const themeToggle = document.getElementById("themeToggle");

function setTheme(theme) {
  if (theme === "dark") {
    body.classList.add("dark");
    themeToggle.innerHTML = '<img src="./icons/dark-theme.svg" alt="Dark theme" />';
  } else {
    body.classList.remove("dark");
    themeToggle.innerHTML = '<img src="./icons/light-theme.svg" alt="Light theme" />';
  }
  localStorage.setItem("theme", theme);
}

// Load saved theme
setTheme(localStorage.getItem("theme") || "dark");

themeToggle.addEventListener("click", () => {
  const isDark = body.classList.contains("dark");
  setTheme(isDark ? "light" : "dark");
});

/* =====================
   DATA FETCH
===================== */
let pendingFetches = 0;

function parseSheetData(json, language) {
  const rows = json.table.rows;
  return rows.map(row => {
    const [
      inCollection,        // A
      appearanceType,      // B
      releaseYear,         // C
      set,                 // D
      number,              // E
      cardName,            // F
      type,                // G
      rarity,              // H
      ,                    // I Other Pokémon in Artwork
      ,                    // J Picture
      pictureUrl,          // K
      language,            // L
      art                  // M
    ] = row.c.map(c => c?.v ?? "");


    return {
      inCollection,
      appearanceType,
      releaseYear: Number(releaseYear) || 9999,
      set,
      number,
      cardName,
      type,
      rarity,
      pictureUrl,
      language,
      art: Number(art) || 0
    };
  });
}

function fetchSheetTab(tabName) {
  const tabURL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tabName)}`;

  pendingFetches++;
  fetch(tabURL)
    .then(res => res.text())
    .then(text => {
      const json = JSON.parse(text.substring(47).slice(0, -2));
      const items = parseSheetData(json, tabName);
      allItems = allItems.concat(items);
      pendingFetches--;
      if (pendingFetches === 0) {
        render();
      }
    })
    .catch(err => {
      console.error(`Error fetching tab ${tabName}:`, err);
      pendingFetches--;
      if (pendingFetches === 0) {
        render();
      }
    });
}

function discoverAndFetchAllTabs() {
  // Read the Languages sheet and use column A values as exact sheet/tab names, in order
  const languagesURL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent('Languages')}`;

  fetch(languagesURL)
    .then(res => res.text())
    .then(text => {
      try {
        const json = JSON.parse(text.substring(47).slice(0, -2));
        const rows = json.table && json.table.rows ? json.table.rows : [];
        // Column A is index 0 in each row.c
        const names = rows.map(r => (r.c && r.c[0] && r.c[0].v) ? String(r.c[0].v).trim() : '').filter(Boolean);

        if (names.length === 0) {
          console.warn('Languages sheet found but no names in column A. Ensure sheet names are listed in column A.');
          return;
        }

        // Use the exact order listed in the Languages sheet
        allTabs = names;
        createProgressRows();
        populateLanguageFilter();
        allTabs.forEach(tab => fetchSheetTab(tab));
      } catch (e) {
        console.error('Error parsing Languages sheet response:', e);
      }
    })
    .catch(err => {
      console.error('Error fetching Languages sheet:', err);
    });
}

function populateLanguageFilter() {
  const filterSelect = document.getElementById('languageFilter');
  if (!filterSelect) return;

  // Clear existing options except "All"
  filterSelect.innerHTML = '<option value="all" selected>All</option>';

  // Add option for each tab
  allTabs.forEach(tab => {
    const option = document.createElement('option');
    option.value = normalize(tab);
    option.textContent = tab;
    filterSelect.appendChild(option);
  });
}

function createProgressRows() {
  const container = document.getElementById('languageRows');
  if (!container) return;

  container.innerHTML = '';

  allTabs.forEach(tab => {
    const tabNormalized = normalize(tab);
    const rowId = `row${tabNormalized}`;
    const progressId = `progress${tabNormalized}`;
    const starId = `star${tabNormalized}`;

    const row = document.createElement('div');
    row.className = 'progress-row';
    row.id = rowId;
    row.innerHTML = `
      <div class="progress-label">${tab}</div>
      <div class="progress" id="${progressId}">
        <div class="progress-fill-bought"></div>
        <div class="progress-fill-owned"></div>
        <div class="progress-text"></div>
      </div>
      <div class="progress-star" id="${starId}" aria-hidden="true" title="Completion star"></div>
    `;

    container.appendChild(row);
  });
}

discoverAndFetchAllTabs();


/* =====================
   HELPERS
===================== */
function normalize(value) {
  return String(value).trim().toLowerCase();
}

function isValidItem(item) {
  const v = normalize(item.inCollection);
  return v === "x" || v === "k" || v === "";
}

/* =====================
   SORTING
===================== */
function sortItems(items) {
  return items.sort((a, b) => {

    /* =====================
       ART SORT — MUST BE FIRST
    ===================== */
    if (currentLanguageOrder === 'art') {
      const artDiff = (a.art || 0) - (b.art || 0);
      if (artDiff !== 0) return artDiff;

      const yearDiff = (a.releaseYear || 0) - (b.releaseYear || 0);
      if (yearDiff !== 0) return yearDiff;

      return String(a.set || '').localeCompare(String(b.set || '')) ||
             String(a.number || '').localeCompare(String(b.number || ''));
    }

    /* =====================
       OTHER SORT RULES
    ===================== */

    // Packs last
    if (a.type === "Pack" && b.type !== "Pack") return 1;
    if (a.type !== "Pack" && b.type === "Pack") return -1;

    // Cameos last
    if (a.appearanceType === "Cameo" && b.appearanceType !== "Cameo") return 1;
    if (a.appearanceType !== "Cameo" && b.appearanceType === "Cameo") return -1;

    // Collection order
    if (currentCollectionOrder !== "none") {
      const aC = normalize(a.inCollection);
      const bC = normalize(b.inCollection);

      const priority =
        currentCollectionOrder === "owned-first"
          ? { x: 0, k: 1, "": 2 }
          : { "": 0, k: 1, x: 2 };

      const diff = (priority[aC] ?? 99) - (priority[bC] ?? 99);
      if (diff !== 0) return diff;
    }

    // Language alphabetical
    if (currentLanguageOrder === 'language-az') {
      return String(a.language || '').localeCompare(String(b.language || ''));
    }

    // Chronological
    if (currentLanguageOrder === 'release-old') return a.releaseYear - b.releaseYear;
    if (currentLanguageOrder === 'release-new') return b.releaseYear - a.releaseYear;

    return a.releaseYear - b.releaseYear;
  });
}

/* =====================
   RENDER
===================== */
function render() {
  const grid = document.getElementById("card-grid");
  grid.innerHTML = "";

  // start from valid items
  let itemsToShow = allItems.filter(isValidItem);

  // apply language filter (show only items matching the language selection)
  if (currentLanguageFilter !== 'all') {
    itemsToShow = itemsToShow.filter(i => i.language === languageMap[currentLanguageFilter]);console.log(itemsToShow, currentLanguageFilter, languageMap[currentLanguageFilter]);
  }
  const items = sortItems(itemsToShow);

  items.forEach(item => {
    let status = "";
    if (normalize(item.inCollection) === "x") {
      status = `<span class="badge owned">Owned</span>`;
    } else if (normalize(item.inCollection) === "k") {
      status = `<span class="badge bought">Bought</span>`;
    }

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${item.pictureUrl}" alt="${item.cardName}">
      <div class="card-content">
        <div class="card-title">${item.cardName}</div>
        <div class="card-meta">${item.set} • #${item.number}</div>
        <div class="card-meta">${item.type} • ${item.rarity}</div>
        <div class="card-meta">Released: ${item.releaseYear}</div>

        <div class="badges">
          ${status}
          ${item.language ? `<span class="badge">${item.language}</span>` : ""}
          ${item.appearanceType ? `<span class="badge">${item.appearanceType}</span>` : ""}
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  updateProgress();
}

/* =====================
   CONTROLS
===================== */
document.getElementById("languageOrder").addEventListener("change", e => {
  currentLanguageOrder = e.target.value;
  render();
});

document.getElementById("collectionOrder").addEventListener("change", e => {
  currentCollectionOrder = e.target.value;
  render();
});

// Language display filter
document.getElementById('languageFilter').addEventListener('change', e => {
  currentLanguageFilter = e.target.value;
  render();
});

function updateProgress() {
  const valid = allItems.filter(isValidItem);
  const totalAll = valid.length;
  const ownedAll = valid.filter(i => normalize(i.inCollection) === 'x').length;
  const boughtAll = valid.filter(i => normalize(i.inCollection) === 'k').length;

  function renderBar(containerId, owned, bought, total) {
    const container = document.getElementById(containerId);
    if (!container) return 0;
    const fillOwned = container.querySelector('.progress-fill-owned');
    const fillBought = container.querySelector('.progress-fill-bought');
    const text = container.querySelector('.progress-text');

    const pctOwned = total > 0 ? (owned / total) * 100 : 0;
    const pctBought = total > 0 ? (bought / total) * 100 : 0;
    const pctTotal = Math.min(100, Math.round((owned + bought) / total * 100) || 0);

    if (fillBought) {
      fillBought.style.width = Math.min(100, Math.round(pctOwned + pctBought)) + '%';
      fillBought.setAttribute('aria-hidden', 'false');
    }
    if (fillOwned) {
      fillOwned.style.width = Math.min(100, Math.round(pctOwned)) + '%';
      fillOwned.setAttribute('aria-hidden', 'false');
    }

    if (text) {
      text.textContent = `${pctTotal}% (${owned}/${total})`;
      text.title = `Owned: ${owned}, Bought: ${bought}, Total: ${total}`;
      text.setAttribute('aria-label', `Progress ${pctTotal} percent. Owned ${owned}, Bought ${bought}, Total ${total}`);
    }

    return pctTotal;
  }

  const pctAll = renderBar('progressAll', ownedAll, boughtAll, totalAll);

  // Show/hide language rows based on currentLanguageFilter
  const showAll = currentLanguageFilter === 'all';
  const rowAll = document.getElementById('rowAll');
  if (rowAll) rowAll.style.display = showAll ? 'flex' : 'none';

  // Process each tab's progress
  allTabs.forEach(tab => {
    const tabNormalized = normalize(tab);
    const tabItems = valid.filter(i => i.language === languageMap[tabNormalized]);
    const totalTab = tabItems.length;
    const ownedTab = tabItems.filter(i => normalize(i.inCollection) === 'x').length;
    const boughtTab = tabItems.filter(i => normalize(i.inCollection) === 'k').length;

    const rowId = `row${tabNormalized}`;
    const progressId = `progress${tabNormalized}`;
    const starId = `star${tabNormalized}`;

    const pctTab = renderBar(progressId, ownedTab, boughtTab, totalTab);

    const showTab = currentLanguageFilter === 'all' || currentLanguageFilter === tabNormalized;
    const row = document.getElementById(rowId);
    if (row) row.style.display = showTab ? 'flex' : 'none';

    // completion star
    function updateStar(starId, pct, owned, bought, total) {
      const star = document.getElementById(starId);
      if (!star) return;
      if (pct === 100) {
        star.textContent = '★';
        star.setAttribute('aria-hidden', 'false');
        star.title = `Completed: Owned ${owned}, Bought ${bought}, Total ${total}`;
        star.setAttribute('aria-label', `Completed: Owned ${owned}, Bought ${bought}, Total ${total}`);
      } else {
        star.textContent = '';
        star.setAttribute('aria-hidden', 'true');
      }
    }

    updateStar(starId, pctTab, ownedTab, boughtTab, totalTab);
  });

  // overall completion star
  const overallStar = document.getElementById('starAll');
  if (overallStar) {
    const pctOverall = totalAll > 0 ? Math.round(((ownedAll + boughtAll) / totalAll) * 100) : 0;
    if (pctOverall === 100) {
      overallStar.textContent = '★';
      overallStar.setAttribute('aria-hidden', 'false');
    } else {
      overallStar.textContent = '';
      overallStar.setAttribute('aria-hidden', 'true');
    }
  }
}