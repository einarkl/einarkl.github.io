const SHEET_ID = "1oC4KAdpbUDg64wjNZ_AU9SflkZsxBXcpCOSgLYwpO8Q";
const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

let allItems = [];
let currentLanguageOrder = "art";
let currentCollectionOrder = "none";
let currentLanguageFilter = "all";

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
fetch(URL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    allItems = rows.map(row => {
      const [
        inCollection,
        appearanceType,
        releaseYear,
        set,
        number,
        cardName,
        type,
        rarity,
        otherPokemon,
        embeddedPicture,
        pictureUrl,
        language,
        art
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

    render();
  });


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

    // Language alphabetical order (a->z)
    if (currentLanguageOrder === 'language-az') {
      const diff = String(a.language || '').localeCompare(String(b.language || ''));
      if (diff !== 0) return diff;
    }

    // Art id order: group by art id, then by release year old->new
    if (currentLanguageOrder === 'art') {
      const diff = (a.art || 0) - (b.art || 0);
      if (diff !== 0) return diff;
      return (a.releaseYear || 0) - (b.releaseYear || 0);
    }

    // Chronological order
    if (currentLanguageOrder === 'release-old') return a.releaseYear - b.releaseYear;
    if (currentLanguageOrder === 'release-new') return b.releaseYear - a.releaseYear;

    // default fallback
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
  if (currentLanguageFilter === 'en') {
    itemsToShow = itemsToShow.filter(i => i.language === 'En');
  } else if (currentLanguageFilter === 'jp') {
    itemsToShow = itemsToShow.filter(i => i.language === 'Jp');
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

  const enItems = valid.filter(i => i.language === 'En');
  const totalEn = enItems.length;
  const ownedEn = enItems.filter(i => normalize(i.inCollection) === 'x').length;
  const boughtEn = enItems.filter(i => normalize(i.inCollection) === 'k').length;

  const jpItems = valid.filter(i => i.language === 'Jp');
  const totalJp = jpItems.length;
  const ownedJp = jpItems.filter(i => normalize(i.inCollection) === 'x').length;
  const boughtJp = jpItems.filter(i => normalize(i.inCollection) === 'k').length;

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
  const pctEn = renderBar('progressEn', ownedEn, boughtEn, totalEn);
  const pctJp = renderBar('progressJp', ownedJp, boughtJp, totalJp);

  // Show/hide language rows based on currentLanguageFilter
  const showEn = currentLanguageFilter === 'all' || currentLanguageFilter === 'en';
  const showJp = currentLanguageFilter === 'all' || currentLanguageFilter === 'jp';
  const showAll = currentLanguageFilter === 'all';

  const rowEn = document.getElementById('rowEn');
  const rowJp = document.getElementById('rowJp');

  if (rowEn) rowEn.style.display = showEn ? 'flex' : 'none';
  if (rowJp) rowJp.style.display = showJp ? 'flex' : 'none';
  const rowAll = document.getElementById('rowAll');
  if (rowAll) rowAll.style.display = showAll ? 'flex' : 'none';

  // completion stars: show star when 100%
  function updateStar(rowId, starId, pct, owned, bought, total) {
    const row = document.getElementById(rowId);
    const star = document.getElementById(starId);
    if (!row || !star) return;
    if (pct === 100) {
      row.classList.add('completed');
      star.textContent = '★';
      star.setAttribute('aria-hidden', 'false');
      star.title = `Completed: Owned ${owned}, Bought ${bought}, Total ${total}`;
      star.setAttribute('aria-label', `Completed: Owned ${owned}, Bought ${bought}, Total ${total}`);
    } else {
      row.classList.remove('completed');
      star.textContent = '';
      star.setAttribute('aria-hidden', 'true');
    }
  }

  updateStar('rowAll', 'starAll', pctAll, ownedAll, boughtAll, totalAll);
  updateStar('rowEn', 'starEn', pctEn, ownedEn, boughtEn, totalEn);
  updateStar('rowJp', 'starJp', pctJp, ownedJp, boughtJp, totalJp);
}