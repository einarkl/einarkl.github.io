const SHEET_ID = "1oC4KAdpbUDg64wjNZ_AU9SflkZsxBXcpCOSgLYwpO8Q";
const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

let allItems = [];
let allTabs = [];
let currentOrder = "art";
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

const loader = document.getElementById("loader");
const loaderIcon = document.getElementById("loaderIcon");

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
  updateLoaderIcon();
}

// Load saved theme
setTheme(localStorage.getItem("theme") || "dark");

themeToggle.addEventListener("click", () => {
  const isDark = body.classList.contains("dark");
  setTheme(isDark ? "light" : "dark");
});

showLoader();

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
        hideLoader();
      }
    })
    .catch(err => {
      console.error(`Error fetching tab ${tabName}:`, err);
      pendingFetches--;
      if (pendingFetches === 0) {
        render();
        hideLoader();
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

const FALLBACK_LANGUAGE_PRIORITY = ["JP", "EN"];

function buildArtImageMap(items) {
  const map = {};

  items.forEach(item => {
    if (!item.art || !item.pictureUrl || !item.language) return;

    const lang = item.language;
    const rank = FALLBACK_LANGUAGE_PRIORITY.indexOf(lang);
    const priority = rank === -1 ? Infinity : rank;

    if (!map[item.art]) {
      map[item.art] = {
        url: item.pictureUrl,
        language: lang,
        priority
      };
      return;
    }

    const current = map[item.art];

    // Lower priority number wins (JP=0, EN=1, others=Infinity)
    if (priority < current.priority) {
      map[item.art] = {
        url: item.pictureUrl,
        language: lang,
        priority
      };
    }
  });

  return map;
}

function resolvePictureUrl(item, artImageMap) {
  if (item.pictureUrl) return { url: item.pictureUrl, sourceLanguage: null };
  if (item.art && artImageMap[item.art]) {
    return {
      url: artImageMap[item.art].url,
      sourceLanguage: artImageMap[item.art].language
    };
  }
  return { url: "./icons/385-Jirachi.png", sourceLanguage: null };
}

function getLanguagePriority(lang) {
  const idx = FALLBACK_LANGUAGE_PRIORITY.indexOf(lang);
  return idx === -1 ? Infinity : idx;
}

function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

function updateLoaderIcon() {
  const isDark = document.body.classList.contains("dark");
  loaderIcon.src = isDark
    ? "./icons/rotate-dark.svg"
    : "./icons/rotate-light.svg";
}

function buildFirstReleaseByArt(items, activeLanguage) {
  const map = new Map();

  items.forEach(item => {
    if (!item.art) return;

    // respect current language filter
    if (activeLanguage !== 'all' && item.language !== languageMap[activeLanguage]) return;

    const art = item.art;
    const year = item.releaseYear || 9999;

    if (!map.has(art) || year < map.get(art)) {
      map.set(art, year);
    }
  });

  return map;
}

/* =====================
   SORTING
===================== */
function sortItems(items) {
  // 🔹 build first-release map once per sort
  const firstReleaseByArt = buildFirstReleaseByArt(items, currentLanguageFilter);

  return items.sort((a, b) => {

    // Packs last
    if (a.type === "Pack" && b.type !== "Pack") return 1;
    if (a.type !== "Pack" && b.type === "Pack") return -1;

    // Cameos last
    if (a.appearanceType === "Cameo" && b.appearanceType !== "Cameo") return 1;
    if (a.appearanceType !== "Cameo" && b.appearanceType === "Cameo") return -1;

    /* =====================
       ART SORT — MUST BE FIRST
    ===================== */
    if (currentOrder === 'art') {

      const aArt = a.art || 0;
      const bArt = b.art || 0;

      const aFirst = firstReleaseByArt.get(aArt) || 9999;
      const bFirst = firstReleaseByArt.get(bArt) || 9999;

      // 🔹 1. ORDER ART GROUPS BY FIRST RELEASE
      const firstReleaseDiff = aFirst - bFirst;
      if (firstReleaseDiff !== 0) return firstReleaseDiff;

      // 🔹 2. GROUP BY ART ID
      const artDiff = aArt - bArt;
      if (artDiff !== 0) return artDiff;

      // 🔹 3. ORDER WITHIN ART BY RELEASE YEAR
      const yearDiff = (a.releaseYear || 0) - (b.releaseYear || 0);
      if (yearDiff !== 0) return yearDiff;

      // 🔹 4. LANGUAGE PRIORITY (JP → EN → others)
      const langDiff =
        getLanguagePriority(a.language) - getLanguagePriority(b.language);
      if (langDiff !== 0) return langDiff;

      // 🔹 5. FINAL STABLE TIE-BREAKERS
      return (
        String(a.set || '').localeCompare(String(b.set || '')) ||
        String(a.number || '').localeCompare(String(b.number || ''))
      );
    }

    /* =====================
       OTHER SORT RULES
    ===================== */

    // Collection order
    if (currentOrder === 'owned-first') {
      const ownedDiff = { x: 0, k: 1, "": 2 }[a.inCollection] - { x: 0, k: 1, "": 2 }[b.inCollection];
      if (ownedDiff !== 0) return ownedDiff;

      const yearDiff = (a.releaseYear || 0) - (b.releaseYear || 0);
      if (yearDiff !== 0) return yearDiff;

      return String(a.set || '').localeCompare(String(b.set || '')) ||
        String(a.number || '').localeCompare(String(b.number || ''));
    }
    if (currentOrder === 'owned-last') {
      const ownedDiff = { "": 0, k: 1, x: 2 }[a.inCollection] - { "": 0, k: 1, x: 2 }[b.inCollection];
      if (ownedDiff !== 0) return ownedDiff;

      const yearDiff = (a.releaseYear || 0) - (b.releaseYear || 0);
      if (yearDiff !== 0) return yearDiff;

      return String(a.set || '').localeCompare(String(b.set || '')) ||
        String(a.number || '').localeCompare(String(b.number || ''));
    }

    // Chronological
    if (currentOrder === 'release-old') return a.releaseYear - b.releaseYear;
    if (currentOrder === 'release-new') return b.releaseYear - a.releaseYear;

    return a.releaseYear - b.releaseYear;
  });
}

/* =====================
   RENDER
===================== */
function render() {
  const artImageMap = buildArtImageMap(allItems);
  const grid = document.getElementById("card-grid");
  grid.innerHTML = "";

  // start from valid items
  let itemsToShow = allItems.filter(isValidItem);

  // apply language filter (show only items matching the language selection)
  if (currentLanguageFilter !== 'all') {
    itemsToShow = itemsToShow.filter(i => i.language === languageMap[currentLanguageFilter]);
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
    const resolvedImage = resolvePictureUrl(item, artImageMap);
    const showLanguageOverlay = !item.pictureUrl && item.language;
    const languageOverlay = showLanguageOverlay
      ? `<div class="language-overlay">${item.language}</div>`
      : '';
    card.innerHTML = `
      <div class="card-image-wrapper">
        <img src="${resolvedImage.url}" alt="${item.cardName}">
        ${languageOverlay}
      </div>
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
    //add style if item.pictureUrl is missing

    if (!item.pictureUrl) {
      card.classList.add("grayscale");
    }

    grid.appendChild(card);
  });

  updateProgress();
}

/* =====================
   CONTROLS
===================== */
document.getElementById("order").addEventListener("change", e => {
  currentOrder = e.target.value;
  render();
});

// Language display filter
document.getElementById('languageFilter').addEventListener('change', e => {
  currentLanguageFilter = e.target.value;
  render();
});

function updateProgress() {
  const valid = allItems.filter(isValidItem);

  // Separate packs from cards for progress tracking
  const packs = valid.filter(i => normalize(i.type) === 'pack');
  const cards = valid.filter(i => normalize(i.type) !== 'pack');

  const totalAll = cards.length;
  const ownedAll = cards.filter(i => normalize(i.inCollection) === 'x').length;
  const boughtAll = cards.filter(i => normalize(i.inCollection) === 'k').length;

  // Packs progress (filtered by language if applicable)
  let packsToShow = packs;
  if (currentLanguageFilter !== 'all') {
    const filterLang = languageMap[currentLanguageFilter];
    if (filterLang) {
      packsToShow = packs.filter(i => i.language === filterLang);
    }
  }
  const totalPacks = packsToShow.length;
  const ownedPacks = packsToShow.filter(i => normalize(i.inCollection) === 'x').length;
  const boughtPacks = packsToShow.filter(i => normalize(i.inCollection) === 'k').length;

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

  // Process each tab's progress (excluding packs)
  allTabs.forEach(tab => {
    const tabNormalized = normalize(tab);
    const tabItems = cards.filter(i => i.language === languageMap[tabNormalized]);
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

  // Packs progress bar (always visible, all languages combined)
  const pctPacks = renderBar('progressPacks', ownedPacks, boughtPacks, totalPacks);
  const rowPacks = document.getElementById('rowPacks');
  if (rowPacks) rowPacks.style.display = 'flex';

  function updatePacksStar(starId, pct, owned, bought, total) {
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
  updatePacksStar('starPacks', pctPacks, ownedPacks, boughtPacks, totalPacks);
}