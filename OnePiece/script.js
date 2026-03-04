const SHEET_ID = "1PcgjJ06RIcM2nNJ1CLsfcJ7jdQc4oo1s0eUqnIoJtg8";
const JOURNEY_START_DATE = new Date("2026-02-14T00:00:00");
const MINUTES_PER_EPISODE = 20;

let allEpisodes = [];
let seasonDefinitions = [];
let pendingFetches = 0;

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
	const watchedTotal = validEpisodes.filter(item => isWatched(item.watchedRaw)).length;
	const totalEpisodes = validEpisodes.length;
	updateJourneyShowcase(watchedTotal, totalEpisodes);
	updateOceanJourney(watchedTotal, totalEpisodes);

	seasonDefinitions.forEach(season => {
		const key = normalize(season.tab).replace(/[^a-z0-9]+/g, "-");
		const episodes = validEpisodes.filter(item => item.season === season.tab);
		const watched = episodes.filter(item => isWatched(item.watchedRaw)).length;
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
discoverAndFetchAllTabs();
