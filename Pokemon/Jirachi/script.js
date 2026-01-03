const SHEET_ID = "1oC4KAdpbUDg64wjNZ_AU9SflkZsxBXcpCOSgLYwpO8Q";
const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

let allItems = [];
let currentLanguageOrder = "mix";
let currentCollectionOrder = "none";

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
        language
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
        language
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

    // Language order
    if (currentLanguageOrder !== "mix") {
      const priority =
        currentLanguageOrder === "en"
          ? { En: 0, Jp: 1 }
          : { Jp: 0, En: 1 };

      const diff =
        (priority[a.language] ?? 99) -
        (priority[b.language] ?? 99);

      if (diff !== 0) return diff;
    }

    // Chronological
    return a.releaseYear - b.releaseYear;
  });
}

/* =====================
   RENDER
===================== */
function render() {
  const grid = document.getElementById("card-grid");
  grid.innerHTML = "";

  const items = sortItems(allItems.filter(isValidItem));

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