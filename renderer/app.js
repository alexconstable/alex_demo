const STORAGE_KEY = "the-isle-prime-tracker.v1";
const RUN_LIBRARY_KEY = "the-isle-prime-tracker.runs.v2";
const TARGET_SCORE = 5;

const OBJECTIVES = [
  {
    id: "neverInfertile",
    title: "Never became temporarily infertile",
    code: "bNeverInfertile",
    detail: "Leave checked unless your run gets the infertile state before Prime."
  },
  {
    id: "neverMuscleSpasms",
    title: "Never had muscle spasms",
    code: "bNeverMuscleSpasms",
    detail: "Leave checked unless spasms happen during the run."
  },
  {
    id: "visitedSanctuaryAsJuv",
    title: "Visited sanctuary as juvenile",
    code: "bVisitedASanctuaryAsJuv",
    detail: "Mark this after the game registers a sanctuary visit while you are young."
  },
  {
    id: "hatchedFromEgg",
    title: "Hatched from an egg",
    code: "bHatchedFromEgg",
    detail: "Nested-in starts count here."
  },
  {
    id: "achievedPerfectDiet",
    title: "Achieved perfect diet",
    code: "bAchievedPerfectDiet",
    detail: "A perfect diet once is enough according to the public checklist."
  },
  {
    id: "raisedChildrenToSubadult",
    title: "Raised children to subadult",
    code: "bRaisedChildrenToSubadult",
    detail: "Use this for the parenting/nesting objective. Subadult means at least 50% growth."
  },
  {
    id: "visitedMassMigrationZone",
    title: "Visited a mass migration zone",
    code: "bVisitedMassMigrationZone",
    detail: "Use the in-game scent/objective feedback where possible."
  },
  {
    id: "visited2MigrationZones",
    title: "Visited 2 migration zones",
    code: "bVisited2MigrationZones",
    detail: "Use this when the game registers migration zone visits.",
    counter: {
      kind: "migration",
      label: "Migration zones",
      max: 12,
      target: 2
    }
  },
  {
    id: "visited4PatrolZones",
    title: "Visited 4 patrol zones",
    code: "bVisited4PatrolZones",
    detail: "Use this when the game registers patrol zone visits.",
    counter: {
      kind: "patrol",
      label: "Patrol zones",
      max: 20,
      target: 4
    }
  }
];

const elements = {
  body: document.body,
  objectiveList: document.getElementById("objective-list"),
  scoreValue: document.getElementById("score-value"),
  scoreLabel: document.getElementById("score-label"),
  scoreOrb: document.getElementById("score-orb"),
  meterFill: document.getElementById("meter-fill"),
  eligibilityCopy: document.getElementById("eligibility-copy"),
  runSelect: document.getElementById("run-select"),
  newRunButton: document.getElementById("new-run-button"),
  renameRunButton: document.getElementById("rename-run-button"),
  toggleModeButton: document.getElementById("toggle-mode-button"),
  hideButton: document.getElementById("hide-button"),
  quitButton: document.getElementById("quit-button"),
  nameDialog: document.getElementById("name-dialog"),
  nameDialogForm: document.getElementById("name-dialog-form"),
  nameDialogLabel: document.getElementById("name-dialog-label"),
  nameDialogInput: document.getElementById("name-dialog-input"),
  nameDialogCancel: document.getElementById("name-dialog-cancel")
};

let runLibrary = createInitialRunLibrary();
let state = getActiveRun();
let pendingNameAction = null;

init().catch((error) => {
  console.error(error);
  elements.eligibilityCopy.textContent = error instanceof Error ? error.message : String(error);
});

async function init() {
  runLibrary = await loadRunLibrary();
  state = getActiveRun();
  renderObjectives();
  wireControls();
  await configureBridge();
  hydrateForm();
  render();
}

async function configureBridge() {
  if (!window.primeTracker) {
    applyOverlayInfo({
      mode: "compact",
      hotkey: "F6",
      hideHotkey: "F7",
      compactHotkey: "",
      closeHotkey: "",
      visible: true
    });
    return;
  }

  const info = await window.primeTracker.getInfo();
  applyOverlayInfo(info);
  window.primeTracker.onStateChange(applyOverlayInfo);
}

function wireControls() {
  elements.objectiveList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-objective-toggle]");
    if (!button) {
      return;
    }
    const id = button.dataset.objectiveId;
    state.objectives[id] = !state.objectives[id];
    saveAndRender();
  });

  elements.objectiveList.addEventListener("input", (event) => {
    const input = event.target.closest("[data-zone-counter]");
    if (!input) {
      return;
    }
    const kind = input.dataset.zoneCounter;
    const max = Number.parseInt(input.max, 10);
    state.zoneCounts[kind] = clampInteger(input.value, 0, max);
    syncDerivedObjectives();
    saveAndRender();
  });

  elements.runSelect.addEventListener("change", () => {
    const selected = runLibrary.runs.find((run) => run.id === elements.runSelect.value);
    if (!selected) {
      return;
    }
    runLibrary.activeRunId = selected.id;
    state = selected;
    saveRunLibrary();
    render();
  });

  elements.newRunButton.addEventListener("click", () => {
    openNameDialog({
      title: "New run name",
      value: "New Run",
      onSave: (name) => createRun(name || "New Run")
    });
  });

  elements.renameRunButton.addEventListener("click", () => {
    openNameDialog({
      title: "Rename run",
      value: state.runName || "Default Run",
      onSave: (name) => {
        if (!name) {
          return;
        }
        state.runName = name;
        state.updatedAt = new Date().toISOString();
        saveAndRender();
      }
    });
  });

  elements.nameDialogForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveNameDialog();
  });
  elements.nameDialogCancel.addEventListener("click", closeNameDialog);
  elements.nameDialog.addEventListener("click", (event) => {
    if (event.target === elements.nameDialog) {
      closeNameDialog();
    }
  });
  elements.nameDialogInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeNameDialog();
    }
  });

  elements.toggleModeButton.addEventListener("click", () => window.primeTracker.toggleMode());
  elements.hideButton.addEventListener("click", () => window.primeTracker.toggleVisibility());
  elements.quitButton.addEventListener("click", () => window.primeTracker.quit());
}

function openNameDialog({ title, value, onSave }) {
  pendingNameAction = onSave;
  elements.nameDialogLabel.textContent = title;
  elements.nameDialogInput.value = value;
  elements.nameDialog.hidden = false;
  requestAnimationFrame(() => {
    elements.nameDialogInput.focus();
    elements.nameDialogInput.select();
  });
}

function closeNameDialog() {
  elements.nameDialog.hidden = true;
  pendingNameAction = null;
}

function saveNameDialog() {
  const name = elements.nameDialogInput.value.trim().slice(0, 36);
  const action = pendingNameAction;
  closeNameDialog();
  if (action) {
    action(name);
  }
}

function renderObjectives() {
  elements.objectiveList.innerHTML = OBJECTIVES.map((objective) => {
    const counter = objective.counter ? `
      <label class="inline-counter">
        <span>${escapeHtml(objective.counter.label)}</span>
        <input
          data-zone-counter="${escapeHtml(objective.counter.kind)}"
          type="number"
          min="0"
          max="${objective.counter.max}"
          step="1"
          aria-label="${escapeHtml(objective.counter.label)}"
        />
        <em>/${objective.counter.target}</em>
      </label>
    ` : "";

    return `
      <article class="objective" data-objective-id="${objective.id}">
        <button class="objective-toggle" data-objective-toggle data-objective-id="${objective.id}" type="button" aria-label="Toggle ${escapeHtml(objective.title)}">
          <span class="checkmark" aria-hidden="true"></span>
        </button>
        <span class="objective-copy">
          <strong>${escapeHtml(objective.title)}</strong>
          <span>${escapeHtml(objective.detail)}</span>
          ${counter}
        </span>
      </article>
    `;
  }).join("");
}

function render() {
  const score = getScore();
  const ready = score >= TARGET_SCORE;
  const possible = getPossibleScore();

  renderRunSelect();
  elements.scoreValue.textContent = `${Math.min(score, TARGET_SCORE)}/${TARGET_SCORE}`;
  elements.scoreLabel.textContent = ready ? "Prime ready" : `${Math.max(TARGET_SCORE - score, 0)} left`;
  elements.scoreOrb.dataset.ready = ready ? "true" : "false";
  elements.meterFill.style.width = `${Math.min(100, (score / TARGET_SCORE) * 100)}%`;
  elements.eligibilityCopy.textContent = buildEligibilityCopy(score, possible);

  for (const objective of OBJECTIVES) {
    const row = elements.objectiveList.querySelector(`[data-objective-id="${objective.id}"]`);
    if (row) {
      row.dataset.checked = state.objectives[objective.id] ? "true" : "false";
    }
  }

  for (const input of elements.objectiveList.querySelectorAll("[data-zone-counter]")) {
    input.value = String(state.zoneCounts[input.dataset.zoneCounter] ?? 0);
  }
}

function buildEligibilityCopy(score, possible) {
  if (score >= TARGET_SCORE) {
    return "You have 5 objectives checked. If they were completed before the Prime window, this run should be Prime eligible.";
  }
  if (possible < TARGET_SCORE) {
    return "This run has fewer than 5 remaining possible objectives. It is likely no longer Prime eligible.";
  }
  return `You need ${TARGET_SCORE - score} more objective${TARGET_SCORE - score === 1 ? "" : "s"} before the Prime window.`;
}

function getScore() {
  return OBJECTIVES.reduce((total, objective) => total + (state.objectives[objective.id] ? 1 : 0), 0);
}

function getPossibleScore() {
  return OBJECTIVES.reduce((total, objective) => {
    const failedNegative =
      (objective.id === "neverInfertile" || objective.id === "neverMuscleSpasms") && state.objectives[objective.id] === false;
    return total + (failedNegative ? 0 : 1);
  }, 0);
}

function syncDerivedObjectives() {
  if (state.zoneCounts.migration >= 1) {
    state.objectives.visitedMassMigrationZone = true;
  }
  if (state.zoneCounts.migration >= 2) {
    state.objectives.visited2MigrationZones = true;
  }
  if (state.zoneCounts.patrol >= 4) {
    state.objectives.visited4PatrolZones = true;
  }
}

function hydrateForm() {
}

function createRun(name) {
  const fresh = createDefaultRun(name);
  runLibrary.runs.unshift(fresh);
  runLibrary.activeRunId = fresh.id;
  state = fresh;
  saveAndRender();
}

function applyOverlayInfo(info) {
  if (!info) {
    return;
  }
  elements.body.dataset.mode = info.mode || "compact";
  elements.toggleModeButton.textContent = info.mode === "expanded" ? "Compact" : "Expand";
}

function normalizeRunLibrary(saved) {
  if (!saved || typeof saved !== "object" || !Array.isArray(saved.runs) || !saved.runs.length) {
    return createInitialRunLibrary();
  }

  const runs = saved.runs.map(normalizeRun);
  const activeRunId = runs.some((run) => run.id === saved.activeRunId) ? saved.activeRunId : runs[0].id;
  return { activeRunId, runs };
}

function createInitialRunLibrary() {
  let migrated = null;
  try {
    migrated = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    migrated = null;
  }

  const run = normalizeRun(migrated);
  return {
    activeRunId: run.id,
    runs: [run]
  };
}

function normalizeRun(saved) {
  const defaults = createDefaultRun(saved?.runName || "Default Run");
  if (!saved || typeof saved !== "object") {
    return defaults;
  }

  return {
    ...defaults,
    ...saved,
    id: typeof saved.id === "string" && saved.id ? saved.id : defaults.id,
    runName: String(saved.runName || defaults.runName).trim().slice(0, 36) || defaults.runName,
    objectives: { ...defaults.objectives, ...(saved.objectives || {}) },
    zoneCounts: { ...defaults.zoneCounts, ...(saved.zoneCounts || {}) },
    visitedZones: defaults.visitedZones,
    createdAt: saved.createdAt || defaults.createdAt,
    updatedAt: saved.updatedAt || defaults.updatedAt
  };
}

function createDefaultRun(name) {
  const timestamp = new Date().toISOString();
  return {
    id: createRunId(),
    runName: String(name || "Default Run").trim().slice(0, 36) || "Default Run",
    objectives: OBJECTIVES.reduce((accumulator, objective) => {
      accumulator[objective.id] = objective.id === "neverInfertile" || objective.id === "neverMuscleSpasms";
      return accumulator;
    }, {}),
    zoneCounts: {
      migration: 0,
      patrol: 0
    },
    visitedZones: {
      migration: {},
      patrol: {}
    },
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

function getActiveRun() {
  return runLibrary.runs.find((run) => run.id === runLibrary.activeRunId) || runLibrary.runs[0];
}

function renderRunSelect() {
  const options = runLibrary.runs.map((run) => {
    const selected = run.id === state.id ? " selected" : "";
    return `<option value="${escapeHtml(run.id)}"${selected}>${escapeHtml(run.runName)}</option>`;
  }).join("");
  if (elements.runSelect.innerHTML !== options) {
    elements.runSelect.innerHTML = options;
  }
  elements.runSelect.value = state.id;
}

function saveAndRender() {
  saveState();
  render();
}

function saveState() {
  state.updatedAt = new Date().toISOString();
  saveRunLibrary();
}

function saveRunLibrary() {
  try {
    localStorage.setItem(RUN_LIBRARY_KEY, JSON.stringify(runLibrary));
  } catch {
  }
  if (window.primeTracker?.saveRuns) {
    window.primeTracker.saveRuns(runLibrary).catch((error) => {
      console.error("Failed to save Prime Tracker runs:", error);
    });
  }
}

async function loadRunLibrary() {
  const diskLibrary = await loadRunLibraryFromDisk();
  if (diskLibrary) {
    const normalized = normalizeRunLibrary(diskLibrary);
    const migrated = getLocalStorageLibraryIfNewer(normalized);
    if (migrated) {
      if (window.primeTracker?.saveRuns) {
        window.primeTracker.saveRuns(migrated).catch((error) => {
          console.error("Failed to migrate Prime Tracker runs:", error);
        });
      }
      return migrated;
    }
    return normalized;
  }

  const initial = loadRunLibraryFromLocalStorage();
  if (window.primeTracker?.saveRuns) {
    window.primeTracker.saveRuns(initial).catch((error) => {
      console.error("Failed to migrate Prime Tracker runs:", error);
    });
  }
  return initial;
}

async function loadRunLibraryFromDisk() {
  if (!window.primeTracker?.loadRuns) {
    return null;
  }
  try {
    return await window.primeTracker.loadRuns();
  } catch (error) {
    console.error("Failed to load Prime Tracker runs:", error);
    return null;
  }
}

function loadRunLibraryFromLocalStorage() {
  try {
    const saved = JSON.parse(localStorage.getItem(RUN_LIBRARY_KEY) || "null");
    return normalizeRunLibrary(saved);
  } catch {
    return createInitialRunLibrary();
  }
}

function getLocalStorageLibraryIfNewer(diskLibrary) {
  let localLibrary = null;
  try {
    localLibrary = JSON.parse(localStorage.getItem(RUN_LIBRARY_KEY) || "null");
  } catch {
    localLibrary = null;
  }
  if (!localLibrary || !Array.isArray(localLibrary.runs)) {
    return null;
  }

  const normalizedLocal = normalizeRunLibrary(localLibrary);
  const diskUpdatedAt = getLatestUpdatedAt(diskLibrary);
  const localUpdatedAt = getLatestUpdatedAt(normalizedLocal);
  if (localUpdatedAt > diskUpdatedAt) {
    return normalizedLocal;
  }
  return null;
}

function getLatestUpdatedAt(library) {
  return Math.max(...library.runs.map((run) => Date.parse(run.updatedAt || run.createdAt || "") || 0));
}

function createRunId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `run-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clampInteger(value, min, max) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return min;
  }
  return Math.min(Math.max(parsed, min), max);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
