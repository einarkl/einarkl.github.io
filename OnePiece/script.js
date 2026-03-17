const SHEET_ID = "1PcgjJ06RIcM2nNJ1CLsfcJ7jdQc4oo1s0eUqnIoJtg8";
const JOURNEY_START_DATE = new Date("2026-02-14T00:00:00");
const MINUTES_PER_EPISODE = 20;
const FILIP_PARAM_KEYS = ["filip", "easter", "scared"];
const SHIP_DEBUG_PARAM_KEYS = ["shipProgress", "debugProgress", "ship"];
const EPISODE_DEBUG_PARAM_KEYS = ["episode", "ep"];

let allEpisodes = [];
let seasonDefinitions = [];
let pendingFetches = 0;
let filipEpisodeNumber = null;

const body = document.body;
const loader = document.getElementById("loader");
body.classList.add("dark");

function showLoader() {
	if (!loader) return;
	loader.classList.remove("hidden");
}

function hideLoader() {
	if (!loader) return;
	loader.classList.add("hidden");
}

function normalize(value) {
	return String(value ?? "").trim().toLowerCase();
}

function isWatched(value) {
	return normalize(value) === "x";
}

function hasEpisodeNumber(value) {
	return String(value ?? "").trim() !== "";
}

function parsePositiveInt(value) {
	const text = String(value ?? "").trim();
	if (!text) return null;

	const onlyDigits = text.replace(/[^0-9]/g, "");
	if (!onlyDigits) return null;

	const parsed = Number.parseInt(onlyDigits, 10);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function parseNonNegativeInt(value) {
	const text = String(value ?? "").trim();
	if (!text) return null;

	const onlyDigits = text.replace(/[^0-9]/g, "");
	if (!onlyDigits && text !== "0") return null;

	const parsed = Number.parseInt(onlyDigits || "0", 10);
	return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function parsePercentage(value) {
	const text = String(value ?? "").trim().replace(",", ".");
	if (!text) return null;

	const parsed = Number.parseFloat(text);
	if (!Number.isFinite(parsed)) return null;

	return Math.max(0, Math.min(100, parsed));
}

function getDebugShipProgressPercent() {
	const params = new URLSearchParams(window.location.search);

	for (const key of SHIP_DEBUG_PARAM_KEYS) {
		if (!params.has(key)) continue;
		const percent = parsePercentage(params.get(key));
		if (percent !== null) {
			return percent;
		}
	}

	return null;
}

function getDebugEpisodeOverride() {
	const params = new URLSearchParams(window.location.search);

	for (const key of EPISODE_DEBUG_PARAM_KEYS) {
		if (!params.has(key)) continue;
		const episode = parseNonNegativeInt(params.get(key));
		if (episode !== null) {
			return episode;
		}
	}

	return null;
}

const DEBUG_SHIP_PROGRESS_PERCENT = getDebugShipProgressPercent();
const DEBUG_EPISODE_OVERRIDE = getDebugEpisodeOverride();

function isFilipModeEnabled() {
	const params = new URLSearchParams(window.location.search);
	return FILIP_PARAM_KEYS.some(key => {
		if (!params.has(key)) return false;
		const value = normalize(params.get(key));
		return value === "" || value === "1" || value === "true" || value === "yes" || value === "on";
	});
}

function ensureFilipMarkerElement() {
	const lane = document.querySelector(".ocean-lane");
	if (!lane) return null;

	let marker = document.getElementById("filipMarker");
	if (marker) return marker;

	marker = document.createElement("img");
	marker.id = "filipMarker";
	marker.className = "filip-marker hidden";
	marker.src = "./icons/Filip_scared.png";
	marker.alt = "Filip surprise marker";
	lane.appendChild(marker);

	return marker;
}

function formatDate(date) {
	const day = date.getDate();
	const month = date.toLocaleString("en-GB", { month: "short" });
	const year = date.getFullYear();
	return `${day} ${month} ${year}`;
}

function formatDuration(minutes) {
	if (!Number.isFinite(minutes) || minutes <= 0) return "0m";

	const rounded = Math.round(minutes);
	const hours = Math.floor(rounded / 60);
	const mins = rounded % 60;

	if (hours === 0) return `${mins}m`;
	if (mins === 0) return `${hours}h`;
	return `${hours}h ${mins}m`;
}

function updateJourneyShowcase(watchedEpisodes, totalEpisodes) {
	const startedEl = document.getElementById("journeyStarted");
	const daysEl = document.getElementById("journeyDays");
	const episodesEl = document.getElementById("journeyEpisodes");
	const totalTimeEl = document.getElementById("journeyTotalTime");
	const perDayEl = document.getElementById("journeyPerDay");
	const endDateEl = document.getElementById("journeyEndDate");

	if (!startedEl || !daysEl || !episodesEl || !totalTimeEl || !perDayEl || !endDateEl) return;

	startedEl.textContent = formatDate(JOURNEY_START_DATE);
	episodesEl.textContent = `${watchedEpisodes}/${totalEpisodes}` + (totalEpisodes > 0 ? ` (${Math.round((watchedEpisodes / totalEpisodes) * 100)}%)` : "");

	const totalWatchMinutes = watchedEpisodes * MINUTES_PER_EPISODE;
	totalTimeEl.textContent = `~${formatDuration(totalWatchMinutes)}`;

	const now = new Date();
	const elapsedMs = Math.max(0, now.getTime() - JOURNEY_START_DATE.getTime());
	const elapsedDays = Math.max(1, Math.floor(elapsedMs / (1000 * 60 * 60 * 24)) + 1);
	daysEl.textContent = String(elapsedDays);
	const watchMinutesPerDay = totalWatchMinutes / elapsedDays;

	perDayEl.textContent = `~${formatDuration(watchMinutesPerDay)}/day`;

	if (totalEpisodes > 0 && watchedEpisodes >= totalEpisodes) {
		endDateEl.textContent = "Completed";
		return;
	}

	if (watchMinutesPerDay <= 0) {
		endDateEl.textContent = "—";
		return;
	}

	const remainingEpisodes = Math.max(0, totalEpisodes - watchedEpisodes);
	const remainingMinutes = remainingEpisodes * MINUTES_PER_EPISODE;
	const remainingDays = Math.ceil(remainingMinutes / watchMinutesPerDay);
	const estimatedEnd = new Date(now.getTime() + remainingDays * 24 * 60 * 60 * 1000);

	endDateEl.textContent = formatDate(estimatedEnd);
}

function updateOceanJourney(watchedEpisodes, totalEpisodes) {
	const lane = document.querySelector(".ocean-lane");
	const track = document.getElementById("oceanTrack");
	const fill = document.getElementById("oceanFill");
	const ship = document.getElementById("journeyShip");
	if (!lane || !track || !fill || !ship) return;

	const pct = totalEpisodes > 0 ? (watchedEpisodes / totalEpisodes) * 100 : 0;
	const clampedPct = Math.max(0, Math.min(100, pct));

	fill.style.width = `${clampedPct}%`;
	lane.style.setProperty("--ship-left", `${clampedPct}%`);
	ship.style.left = `${clampedPct}%`;
}

function updateFilipMarker(watchedEpisodes, totalEpisodes) {
	if (!isFilipModeEnabled()) return;

	const lane = document.querySelector(".ocean-lane");
	const marker = ensureFilipMarkerElement();
	if (!lane || !marker) return;

	if (!Number.isFinite(filipEpisodeNumber) || filipEpisodeNumber <= 0 || totalEpisodes <= 0) {
		lane.style.setProperty("--filip-near", "0");
		lane.style.setProperty("--filip-flip-x", "1");
		marker.classList.remove("is-shaking");
		marker.classList.add("hidden");
		return;
	}

	const filipPct = (filipEpisodeNumber / totalEpisodes) * 100;
	const clampedFilipPct = Math.max(0, Math.min(100, filipPct));
	const shipPct = totalEpisodes > 0 ? (watchedEpisodes / totalEpisodes) * 100 : 0;
	const clampedShipPct = Math.max(0, Math.min(100, shipPct));

	const distancePct = Math.abs(clampedShipPct - clampedFilipPct);
	const proximity = 1 - Math.min(1, distancePct / 100);
	const clampedProximity = Math.max(0, Math.min(1, proximity));
	const hasSurpassedFilip = clampedShipPct > clampedFilipPct;
	const shouldShake = clampedProximity > 0;

	lane.style.setProperty("--filip-left", `${clampedFilipPct}%`);
	lane.style.setProperty("--filip-near", clampedProximity.toFixed(4));
	lane.style.setProperty("--filip-flip-x", hasSurpassedFilip ? "-1" : "1");
	marker.style.left = `${clampedFilipPct}%`;
	marker.classList.toggle("is-shaking", shouldShake);
	marker.title = `Filip marker: episode ${filipEpisodeNumber}`;
	marker.classList.remove("hidden");
}

function getSeasonEpisodeRange(episodes) {
	if (episodes.length === 0) return "";

	const first = String(episodes[0].episodeNumber ?? "").trim();
	const last = String(episodes[episodes.length - 1].episodeNumber ?? "").trim();
	if (!first || !last) return "";

	if (first === last) {
		return first;
	}

	return `${first}-${last}`;
}

function parseSeasonSheet(json, tabName) {
	const rows = (json.table && json.table.rows) ? json.table.rows : [];

	return rows.map(row => {
		const [
			watchedRaw,
			episodeNumber,
			episodeType
		] = (row.c || []).map(c => c?.v ?? "");

		return {
			season: tabName,
			watchedRaw,
			episodeNumber,
			episodeType
		};
	}).filter(item => hasEpisodeNumber(item.episodeNumber));
}

function createProgressRows() {
	const container = document.getElementById("seasonRows");
	if (!container) return;

	container.innerHTML = "";

	seasonDefinitions.forEach(season => {
		const key = normalize(season.tab).replace(/[^a-z0-9]+/g, "-");
		const row = document.createElement("div");
		row.className = "progress-row";
		row.id = `row-${key}`;

		row.innerHTML = `
			<div class="progress-label" id="label-${key}">${season.name}</div>
			<div class="progress" id="progress-${key}">
				<div class="progress-fill-bought"></div>
				<div class="progress-fill-owned"></div>
				<div class="progress-text"></div>
			</div>
			<div class="progress-star" id="star-${key}" aria-hidden="true" title="Completion star"></div>
		`;

		container.appendChild(row);
	});
}

function updateStar(starId, watched, total) {
	const star = document.getElementById(starId);
	if (!star) return;

	if (total > 0 && watched === total) {
		star.textContent = "★";
		star.setAttribute("aria-hidden", "false");
		star.title = `Completed: Watched ${watched}, Total ${total}`;
		star.setAttribute("aria-label", `Completed: Watched ${watched}, Total ${total}`);
		return;
	}

	star.textContent = "";
	star.setAttribute("aria-hidden", "true");
}

function renderBar(containerId, watched, total) {
	const container = document.getElementById(containerId);
	if (!container) return;

	const fillOwned = container.querySelector(".progress-fill-owned");
	const fillBought = container.querySelector(".progress-fill-bought");
	const text = container.querySelector(".progress-text");

	const pct = total > 0 ? Math.round((watched / total) * 100) : 0;
	const remaining = Math.max(0, total - watched);

	if (fillBought) {
		fillBought.style.width = "0%";
		fillBought.setAttribute("aria-hidden", "true");
	}

	if (fillOwned) {
		fillOwned.style.width = `${pct}%`;
		fillOwned.setAttribute("aria-hidden", "false");
	}

	if (text) {
		text.innerHTML = `
			<div class="progress-main">${pct}% (${watched}/${total})</div>
			<div class="progress-sub">Watched: ${watched} — Remaining: ${remaining}</div>
		`;
		text.title = `Watched: ${watched}, Remaining: ${remaining}, Total: ${total}`;
		text.setAttribute("aria-label", `Progress ${pct} percent. Watched ${watched}, Total ${total}`);
	}
}

function updateProgress() {
	const validEpisodes = allEpisodes.filter(item => hasEpisodeNumber(item.episodeNumber));
	const totalEpisodes = validEpisodes.length;
	const realWatchedTotal = validEpisodes.filter(item => isWatched(item.watchedRaw)).length;
	const debugEpisodeWatched = DEBUG_EPISODE_OVERRIDE === null
		? null
		: Math.max(0, Math.min(totalEpisodes, DEBUG_EPISODE_OVERRIDE));
	const journeyWatchedEpisodes = debugEpisodeWatched !== null
		? debugEpisodeWatched
		: (DEBUG_SHIP_PROGRESS_PERCENT === null
			? realWatchedTotal
			: (DEBUG_SHIP_PROGRESS_PERCENT / 100) * totalEpisodes);

	updateJourneyShowcase(journeyWatchedEpisodes, totalEpisodes);
	updateOceanJourney(journeyWatchedEpisodes, totalEpisodes);
	updateFilipMarker(journeyWatchedEpisodes, totalEpisodes);

	const seasonDebugWatched = new Map();
	if (debugEpisodeWatched !== null) {
		const orderedEpisodesForDebug = seasonDefinitions.flatMap(season => (
			validEpisodes.filter(item => item.season === season.tab)
		));

		orderedEpisodesForDebug.forEach((item, index) => {
			if (index >= debugEpisodeWatched) return;
			seasonDebugWatched.set(item.season, (seasonDebugWatched.get(item.season) || 0) + 1);
		});
	}

	seasonDefinitions.forEach(season => {
		const key = normalize(season.tab).replace(/[^a-z0-9]+/g, "-");
		const episodes = validEpisodes.filter(item => item.season === season.tab);
		const watched = debugEpisodeWatched !== null
			? (seasonDebugWatched.get(season.tab) || 0)
			: episodes.filter(item => isWatched(item.watchedRaw)).length;
		const total = episodes.length;
		const range = getSeasonEpisodeRange(episodes);
		const label = document.getElementById(`label-${key}`);
		if (label) {
			label.textContent = range ? `${season.name} (${range})` : season.name;
		}

		renderBar(`progress-${key}`, watched, total);
		updateStar(`star-${key}`, watched, total);
	});
}

function fetchFilipEpisodeNumber() {
	if (!isFilipModeEnabled()) return;

	const rangeURL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent("Seasons")}&range=${encodeURIComponent("F2")}`;

	fetch(rangeURL)
		.then(res => res.text())
		.then(text => {
			const json = JSON.parse(text.substring(47).slice(0, -2));
			const rows = (json.table && json.table.rows) ? json.table.rows : [];
			const f2Value = rows[0] && rows[0].c && rows[0].c[0] ? rows[0].c[0].v : null;
			filipEpisodeNumber = parsePositiveInt(f2Value);
			updateProgress();
		})
		.catch(err => {
			console.error("Error fetching Seasons!F2:", err);
		});
}

function fetchSeasonTab(tabName) {
	const tabURL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tabName)}`;

	pendingFetches++;
	fetch(tabURL)
		.then(res => res.text())
		.then(text => {
			const json = JSON.parse(text.substring(47).slice(0, -2));
			const seasonEpisodes = parseSeasonSheet(json, tabName);
			allEpisodes = allEpisodes.concat(seasonEpisodes);
		})
		.catch(err => {
			console.error(`Error fetching tab ${tabName}:`, err);
		})
		.finally(() => {
			pendingFetches--;
			if (pendingFetches === 0) {
				updateProgress();
				hideLoader();
			}
		});
}

function discoverAndFetchAllTabs() {
	const seasonsSheetCandidates = ["Seasons", "Languages"];

	const tryFetchByIndex = (index) => {
		if (index >= seasonsSheetCandidates.length) {
			console.error("No tab-list sheet found. Add a 'Seasons' sheet (or 'Languages') with season tab names in column A.");
			hideLoader();
			return;
		}

		const sheetName = seasonsSheetCandidates[index];
		const listURL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

		fetch(listURL)
			.then(res => res.text())
			.then(text => {
				const json = JSON.parse(text.substring(47).slice(0, -2));
				const rows = (json.table && json.table.rows) ? json.table.rows : [];
				const seasons = rows
					.map(row => {
						const tab = (row.c && row.c[0] && row.c[0].v) ? String(row.c[0].v).trim() : "";
						const name = (row.c && row.c[1] && row.c[1].v) ? String(row.c[1].v).trim() : "";
						return {
							tab,
							name: name || tab
						};
					})
					.filter(season => season.tab && normalize(season.tab) !== "season");

				if (seasons.length === 0) {
					throw new Error(`'${sheetName}' has no season tabs in column A.`);
				}

				seasonDefinitions = seasons;
				createProgressRows();
				seasonDefinitions.forEach(season => fetchSeasonTab(season.tab));
			})
			.catch(() => {
				tryFetchByIndex(index + 1);
			});
	};

	tryFetchByIndex(0);
}

showLoader();
fetchFilipEpisodeNumber();
discoverAndFetchAllTabs();
