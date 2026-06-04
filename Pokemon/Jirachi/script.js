const SHEET_ID = "1oC4KAdpbUDg64wjNZ_AU9SflkZsxBXcpCOSgLYwpO8Q";
const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

let allItems = [];
let allTabs = [];
let currentOrder = "art";
let currentLanguageFilter = "all";

const languageMap = {
  "english": { code: "EN", group: "english" },
  "japanese": { code: "JP", group: "japanese" },
  "french": { code: "FR", group: "english" },
  "german": { code: "DE", group: "english" },
  "italian": { code: "IT", group: "english" },
  "russian": { code: "RU", group: "english" },
  "portuguese-b": { code: "PT-B", group: "english" },
  "spanish": { code: "ES", group: "english" },
  "chinese-s": { code: "CN-S", group: "japanese" },
  "chinese-t": { code: "CN-T", group: "japanese" },
  "korean": { code: "KR", group: "japanese" },
  "indonesian": { code: "ID", group: "japanese" },
  "thai": { code: "TH", group: "japanese" }
};

const ENGLISH_LANGUAGE_CODES = new Set(Object.values(languageMap)
  .filter(item => item.group === "english")
  .map(item => item.code)
);
const JAPANESE_LANGUAGE_CODES = new Set(Object.values(languageMap)
  .filter(item => item.group === "japanese")
  .map(item => item.code)
);
const ENGLISH_MAIN_LANGUAGE = "EN";
const JAPANESE_MAIN_LANGUAGE = "JP";
const LANGUAGE_ORDER = ["JP", "EN", "FR", "DE", "IT", "RU", "PT-B", "ES", "CN-S", "CN-T", "KR", "ID", "TH"];

function getLanguageCode(filterKey) {
  return languageMap[filterKey]?.code || null;
}

function getLanguageGroupMain(languageCode) {
  if (ENGLISH_LANGUAGE_CODES.has(languageCode)) return ENGLISH_MAIN_LANGUAGE;
  if (JAPANESE_LANGUAGE_CODES.has(languageCode)) return JAPANESE_MAIN_LANGUAGE;
  return null;
}

function getLanguageGroupCodes(languageCode) {
  return ENGLISH_LANGUAGE_CODES.has(languageCode)
    ? ["EN", languageCode]
    : JAPANESE_LANGUAGE_CODES.has(languageCode)
      ? ["JP", languageCode]
      : new Set();
}

const loader = document.getElementById("loader");

const VALID_ORDERS = new Set(["art", "release-old", "release-new", "owned-first", "owned-last"]);

function getUrlState() {
  const params = new URLSearchParams(window.location.search);
  return {
    order: params.get("order") || "art",
    language: normalize(params.get("language") || "all")
  };
}

function updateUrlParams() {
  const params = new URLSearchParams(window.location.search);

  if (currentOrder && currentOrder !== "art") {
    params.set("order", currentOrder);
  } else {
    params.delete("order");
  }

  if (currentLanguageFilter && currentLanguageFilter !== "all") {
    params.set("language", currentLanguageFilter);
  } else {
    params.delete("language");
  }

  const query = params.toString();
  const newUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history.replaceState({}, "", newUrl);
}

function applyUrlState() {
  const { order, language } = getUrlState();
  if (VALID_ORDERS.has(order)) currentOrder = order;
  currentLanguageFilter = language;

  const orderSelect = document.getElementById("order");
  if (orderSelect && VALID_ORDERS.has(currentOrder)) {
    orderSelect.value = currentOrder;
  }
}

/* =====================
   THEME HANDLING
===================== */
const body = document.body;
// Always use dark theme
body.classList.add("dark");

applyUrlState();
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

  if ([...filterSelect.options].some(option => option.value === currentLanguageFilter)) {
    filterSelect.value = currentLanguageFilter;
  }
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

function normalizeCardName(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[“”‘’'"!?,.:;\-()\[\]\/\\]/g, '')
    .replace(/\s+/g, ' ');
}

function normalizeRarity(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ');
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

    const art = item.art;
    const rarity = String(item.rarity || '').trim();
    const rarityNorm = normalizeRarity(item.rarity);
    const setKey = String(item.set || '').trim();
    const language = item.language;

    if (!map[art]) {
      map[art] = [];
    }

    map[art].push({
      language,
      set: setKey,
      rarity,
      rarityNorm,
      url: item.pictureUrl,
      cardName: String(item.cardName || '').trim(),
      cardNameNorm: normalizeCardName(item.cardName)
    });
  });

  return map;
}

function resolvePictureUrl(item, artImageMap) {
  if (item.pictureUrl) return { url: item.pictureUrl, sourceLanguage: null };

  if (item.art && artImageMap[item.art]) {
    const candidates = artImageMap[item.art];
    const rarityNorm = normalizeRarity(item.rarity);
    const setKey = String(item.set || '').trim();
    const preferredCodes = Array.from(getLanguageGroupCodes(item.language));
    const preferredGroupMain = getLanguageGroupMain(item.language);
    const fallbackCodes = preferredGroupMain === ENGLISH_MAIN_LANGUAGE
      ? Array.from(JAPANESE_LANGUAGE_CODES)
      : Array.from(ENGLISH_LANGUAGE_CODES);

    const cardNameNorm = normalizeCardName(item.cardName);
    const findMatch = (codes, exactSet, exactRarity, exactName) => {
      return candidates.find(entry =>
        codes.includes(entry.language) &&
        (exactSet ? entry.set === setKey : true) &&
        (exactRarity ? entry.rarityNorm === rarityNorm : true) &&
        (exactName ? entry.cardNameNorm === cardNameNorm : true)
      );
    };

    // 1. Same group, same rarity, same card name
    let match = findMatch(preferredCodes, true, true, true);
    if (match) return { url: match.url, sourceLanguage: match.language };

    // 2. Same group, same rarity, same set
    match = findMatch(preferredCodes, true, true, false);
    if (match) return { url: match.url, sourceLanguage: match.language };

    // 3. Same group, same rarity
    match = findMatch(preferredCodes, false, true, false);
    if (match) return { url: match.url, sourceLanguage: match.language };

    // 4. Same group, same card name
    match = findMatch(preferredCodes, false, false, true);
    if (match) return { url: match.url, sourceLanguage: match.language };

    /* // 5. Same group, any image
    match = findMatch(preferredCodes, false, false, false);
    if (match) return { url: match.url, sourceLanguage: match.language };

    // 6. Opposite group, same rarity
    match = findMatch(fallbackCodes, false, true, false);
    if (match) return { url: match.url, sourceLanguage: match.language };

    // 7. Opposite group, same card name
    match = findMatch(fallbackCodes, false, false, true);
    if (match) return { url: match.url, sourceLanguage: match.language };

    // 8. Opposite group, any image
    match = findMatch(fallbackCodes, false, false, false);
    if (match) return { url: match.url, sourceLanguage: match.language };

    // 9. Any available image for this art
    match = candidates[0];
    if (match) return { url: match.url, sourceLanguage: match.language }; */
  }

  return { url: "./icons/385-Jirachi.png", sourceLanguage: null };
}

function getLanguageOrderIndex(lang) {
  const idx = LANGUAGE_ORDER.indexOf(lang);
  return idx === -1 ? LANGUAGE_ORDER.length : idx;
}

function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

function buildFirstReleaseByArt(items, activeLanguage) {
  const map = new Map();

  items.forEach(item => {
    if (!item.art) return;

    // respect current language filter
    if (activeLanguage !== 'all' && item.language !== getLanguageCode(activeLanguage)) return;

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

    /* // Packs last
    if (a.type === "Pack" && b.type !== "Pack") return 1;
    if (a.type !== "Pack" && b.type === "Pack") return -1;

    // Cameos last
    if (a.appearanceType === "Cameo" && b.appearanceType !== "Cameo") return 1;
    if (a.appearanceType !== "Cameo" && b.appearanceType === "Cameo") return -1; */
    
    // Category ordering:
    // Main cards -> Cameos -> Packs
    function getCategoryRank(item) {
      if (normalize(item.type) === "pack") return 2;
      if (item.appearanceType === "Cameo") return 1;
      return 0;
    }

    const categoryDiff = getCategoryRank(a) - getCategoryRank(b);
    if (categoryDiff !== 0) return categoryDiff;

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

      // 🔹 3. GROUP BY LANGUAGE WITHIN SAME ART
      const langDiff = getLanguageOrderIndex(a.language) - getLanguageOrderIndex(b.language);
      if (langDiff !== 0) return langDiff;

      // 🔹 4. ORDER WITHIN LANGUAGE BY RELEASE YEAR
      const yearDiff = (a.releaseYear || 0) - (b.releaseYear || 0);
      if (yearDiff !== 0) return yearDiff;

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
function getItemCategory(item) {
  if (normalize(item.type) === "pack") return "pack";
  if (item.appearanceType === "Cameo") return "cameo";
  return "main";
}

function render() {
  const artImageMap = buildArtImageMap(allItems);
  const grid = document.getElementById("card-grid");
  grid.innerHTML = "";

  // start from valid items
  let itemsToShow = allItems.filter(isValidItem);

  // apply language filter (show only items matching the language selection)
  if (currentLanguageFilter !== 'all') {
    itemsToShow = itemsToShow.filter(i => i.language === getLanguageCode(currentLanguageFilter));
  }
  const items = sortItems(itemsToShow);

  let previousCategory = null;

  items.forEach(item => {
    const currentCategory = getItemCategory(item);

    // Insert gap and header when category changes
    if (previousCategory !== null && previousCategory !== currentCategory) {
      const gap = document.createElement("div");
      gap.className = "category-gap";
      grid.appendChild(gap);
    }

    // Insert header at start of each category
    if (previousCategory !== currentCategory) {
      const header = document.createElement("div");
      header.className = "category-header";
      const categoryLabel = {
        "main": "Main Cards",
        "cameo": "Cameo Appearances",
        "pack": "Packs"
      }[currentCategory];
      header.textContent = categoryLabel;
      grid.appendChild(header);
    }

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

    // Gray out missing cards; owned/bought cards keep normal color.
    if (normalize(item.inCollection) === "") {
      card.classList.add("grayscale");
    }

    grid.appendChild(card);
    previousCategory = currentCategory;
  });

  updateProgress();
}

/* =====================
   CONTROLS
===================== */
document.getElementById("order").addEventListener("change", e => {
  currentOrder = e.target.value;
  updateUrlParams();
  render();
});

// Language display filter
document.getElementById('languageFilter').addEventListener('change', e => {
  currentLanguageFilter = e.target.value;
  updateToggleState();
  updateUrlParams();
  render();
});

/* =====================
   COLLAPSIBLE PROGRESS
===================== */
const progressSection = document.querySelector('.progress-section');
const progressToggle = document.getElementById('progressToggle');

// Default to collapsed (show only Overall, current lang, and packs)
let progressCollapsed = true;

function updateToggleState() {
  const isAllLanguages = currentLanguageFilter === 'all';

  if (!isAllLanguages) {
    // When specific language selected, always expand and hide toggle
    progressSection.classList.remove('collapsed');
    progressToggle.style.display = 'none';
    progressToggle.setAttribute('aria-expanded', 'true');
  } else {
    // When "All" is selected, show and enable toggle
    progressToggle.style.display = '';
    progressToggle.removeAttribute('aria-disabled');
    if (progressCollapsed) {
      progressSection.classList.add('collapsed');
      progressToggle.textContent = 'Show languages ▾';
      progressToggle.setAttribute('aria-expanded', 'false');
    } else {
      progressSection.classList.remove('collapsed');
      progressToggle.textContent = 'Hide languages ▴';
      progressToggle.setAttribute('aria-expanded', 'true');
    }
  }
}

progressToggle.addEventListener('click', () => {
  if (progressToggle.getAttribute('aria-disabled') === 'true') return;

  progressCollapsed = !progressCollapsed;
  updateToggleState();
});

// Initialize toggle state
updateToggleState();

function updateProgress() {
  const valid = allItems.filter(isValidItem);

  // Separate packs, cameos, and main cards for progress tracking
  const packs = valid.filter(i => normalize(i.type) === 'pack');
  const cameos = valid.filter(i => i.appearanceType === 'Cameo');
  const cards = valid.filter(i => normalize(i.type) !== 'pack' && i.appearanceType !== 'Cameo');

  const totalAll = cards.length;
  const ownedAll = cards.filter(i => normalize(i.inCollection) === 'x').length;
  const boughtAll = cards.filter(i => normalize(i.inCollection) === 'k').length;

  // Packs progress (filtered by language if applicable)
  let packsToShow = packs;
  if (currentLanguageFilter !== 'all') {
    const filterLang = getLanguageCode(currentLanguageFilter);
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
    const pctOwnedRounded = Math.min(100, Math.round(pctOwned) || 0);
    const pctBoughtRounded = Math.min(100, Math.round(pctBought) || 0);

    if (fillBought) {
      fillBought.style.width = Math.min(100, Math.round(pctOwned + pctBought)) + '%';
      fillBought.setAttribute('aria-hidden', 'false');
    }
    if (fillOwned) {
      fillOwned.style.width = Math.min(100, Math.round(pctOwned)) + '%';
      fillOwned.setAttribute('aria-hidden', 'false');
    }

    if (text) {
      const combinedCount = owned + bought;
      text.innerHTML = `
        <div class="progress-main">${pctTotal}% (${combinedCount}/${total})</div>
        <div class="progress-sub">Owned: ${pctOwnedRounded}% (${owned}/${total}) — Bought: ${pctBoughtRounded}% (${bought}/${total})</div>
      `;
      text.title = `Owned: ${owned}, Bought: ${bought}, Total: ${total}`;
      text.setAttribute('aria-label', `Progress ${pctTotal} percent. Owned ${owned}, Bought ${bought}, Total ${total}`);
    }

	  container.parentNode.setAttribute('data-progress', pctTotal);
	  container.parentNode.setAttribute('data-owned', (owned + bought));

    return pctOwnedRounded;
  }

  const pctAll = renderBar('progressAll', ownedAll, boughtAll, totalAll);

  // Show/hide language rows based on currentLanguageFilter
  const showAll = currentLanguageFilter === 'all';
  const rowAll = document.getElementById('rowAll');
  if (rowAll) rowAll.style.display = showAll ? 'flex' : 'none';

  // Process each tab's progress (excluding packs)
  allTabs.forEach(tab => {
    const tabNormalized = normalize(tab);
    const tabItems = cards.filter(i => i.language === getLanguageCode(tabNormalized));
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
      // Show star only when 100% owned (not counting bought)
      if (total > 0 && owned === total) {
        star.textContent = '★';
        star.setAttribute('aria-hidden', 'false');
        star.title = `Completed: Owned ${owned}, Total ${total}`;
        star.setAttribute('aria-label', `Completed: Owned ${owned}, Total ${total}`);
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
    // Show star only when 100% owned (not counting bought)
    if (totalAll > 0 && ownedAll === totalAll) {
      overallStar.textContent = '★';
      overallStar.setAttribute('aria-hidden', 'false');
    } else {
      overallStar.textContent = '';
      overallStar.setAttribute('aria-hidden', 'true');
    }
  }

  // Cameos progress (filtered by language if applicable)
  let cameosToShow = cameos;
  if (currentLanguageFilter !== 'all') {
    const filterLang = getLanguageCode(currentLanguageFilter);
    if (filterLang) {
      cameosToShow = cameos.filter(i => i.language === filterLang);
    }
  }
  const totalCameos = cameosToShow.length;
  const ownedCameos = cameosToShow.filter(i => normalize(i.inCollection) === 'x').length;
  const boughtCameos = cameosToShow.filter(i => normalize(i.inCollection) === 'k').length;

  const pctCameos = renderBar('progressCameos', ownedCameos, boughtCameos, totalCameos);
  const rowCameos = document.getElementById('rowCameos');
  if (rowCameos) rowCameos.style.display = totalCameos > 0 ? 'flex' : 'none';

  function updateCameosStar(starId, pct, owned, bought, total) {
    const star = document.getElementById(starId);
    if (!star) return;
    // Show star only when 100% owned (not counting bought)
    if (total > 0 && owned === total) {
      star.textContent = '★';
      star.setAttribute('aria-hidden', 'false');
      star.title = `Completed: Owned ${owned}, Total ${total}`;
      star.setAttribute('aria-label', `Completed: Owned ${owned}, Total ${total}`);
    } else {
      star.textContent = '';
      star.setAttribute('aria-hidden', 'true');
    }
  }
  updateCameosStar('starCameos', pctCameos, ownedCameos, boughtCameos, totalCameos);

  // Packs progress bar (always visible, all languages combined)
  const pctPacks = renderBar('progressPacks', ownedPacks, boughtPacks, totalPacks);
  const rowPacks = document.getElementById('rowPacks');
  if (rowPacks) rowPacks.style.display = totalPacks > 0 ? 'flex' : 'none';

  function updatePacksStar(starId, pct, owned, bought, total) {
    const star = document.getElementById(starId);
    if (!star) return;
    // Show star only when 100% owned (not counting bought)
    if (total > 0 && owned === total) {
      star.textContent = '★';
      star.setAttribute('aria-hidden', 'false');
      star.title = `Completed: Owned ${owned}, Total ${total}`;
      star.setAttribute('aria-label', `Completed: Owned ${owned}, Total ${total}`);
    } else {
      star.textContent = '';
      star.setAttribute('aria-hidden', 'true');
    }
  }
  updatePacksStar('starPacks', pctPacks, ownedPacks, boughtPacks, totalPacks);

  // Sort progress bars by percentage
  function sortProgressBars() {
	const barsToSort = Array.prototype.slice.call(document.getElementById("languageRows").children, 0);

	barsToSort.sort(function(a, b) {
		const aord = +a.getAttribute("data-progress");
		const bord = +b.getAttribute("data-progress");

    if (aord === bord) {
      const aord2 = +a.getAttribute("data-owned");
		  const bord2 = +b.getAttribute("data-owned");

      return bord2 - aord2;
    }

		return bord - aord;
	});

	const container = document.getElementById('languageRows');

	container.innerHTML = '';

	barsToSort.forEach(tab => {
		container.appendChild(tab);
	});
  }
  sortProgressBars();
}