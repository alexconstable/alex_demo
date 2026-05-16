const { ipcRenderer } = require("electron");

const FIELD_LABELS = {
  status: ["status"],
  lastUpdated: ["last updated", "updated", "last refresh"],
  server: ["server"],
  mapX: ["map x", "mapx", "coord x", "x"],
  mapY: ["map y", "mapy", "coord y", "y"],
  altitude: ["altitude", "alt", "height", "z"]
};

const REPORT_INTERVAL_MS = 250;
const TRACK_CLICK_INTERVAL_MS = 4500;
const REFRESH_CLICK_INTERVAL_MS = 4500;

let lastPayload = "";
let lastTrackClickAt = 0;
let lastRefreshClickAt = 0;

window.addEventListener("DOMContentLoaded", () => {
  installSameViewAuthFlow();
  observeAndReport();
  setInterval(() => {
    keepTrackerAlive();
    observeAndReport();
  }, REPORT_INTERVAL_MS);
  const observer = new MutationObserver(() => {
    keepTrackerAlive();
    observeAndReport();
  });
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true
  });
});

function installSameViewAuthFlow() {
  const redirectInPlace = (url) => {
    if (typeof url !== "string" || !url.trim()) {
      return null;
    }

    const nextUrl = url.trim();
    if (/^https?:\/\//i.test(nextUrl)) {
      window.location.assign(nextUrl);
    }

    return null;
  };

  const nativeOpen = window.open;
  window.open = function patchedOpen(url, target, features) {
    const redirected = redirectInPlace(url);
    if (redirected === null) {
      return null;
    }

    return nativeOpen.call(window, url, target, features);
  };

  document.addEventListener(
    "click",
    (event) => {
      const link = event.target.closest?.("a[href]");
      if (!link) {
        return;
      }

      const href = link.href || "";
      const target = (link.getAttribute("target") || "").toLowerCase();
      if (target === "_blank" || href.includes("steamcommunity.com") || href.includes("bosch-island.com")) {
        event.preventDefault();
        redirectInPlace(href);
      }
    },
    true
  );
}

function observeAndReport() {
  const snapshot = captureSnapshot();
  const serialized = JSON.stringify(snapshot);
  if (serialized === lastPayload) {
    return;
  }

  lastPayload = serialized;
  ipcRenderer.sendToHost("bosch:update", snapshot);
}

function keepTrackerAlive() {
  const href = location.href.toLowerCase();
  if (!href.includes("/map-tracker")) {
    return;
  }

  const now = Date.now();
  const bodyText = clean(document.body?.innerText || "").toLowerCase();

  const shouldResumeTracking =
    bodyText.includes("press track to resume live tracking") ||
    bodyText.includes("track to resume live tracking");

  if (shouldResumeTracking && now - lastTrackClickAt >= TRACK_CLICK_INTERVAL_MS) {
    if (clickControlByText(["track"])) {
      lastTrackClickAt = now;
    }
  }

  if (now - lastRefreshClickAt >= REFRESH_CLICK_INTERVAL_MS) {
    if (clickControlByText(["refresh", "live position"])) {
      lastRefreshClickAt = now;
    }
  }
}

function captureSnapshot() {
  const lines = getLines();
  const bodyText = clean(document.body?.innerText || "");
  const pairs = {
    ...extractTablePairs(),
    ...extractDefinitionPairs(),
    ...extractGenericPairs(),
    ...extractInlinePairs(bodyText)
  };

  const fields = {};
  for (const [key, labels] of Object.entries(FIELD_LABELS)) {
    fields[key] = findValue(labels, lines, pairs);
  }

  return {
    url: location.href,
    title: document.title,
    pageState: detectPageState(lines, fields),
    fields,
    debug: {
      lines,
      pairs
    }
  };
}

function detectPageState(lines, fields) {
  const body = lines.join("\n").toLowerCase();
  const title = document.title.toLowerCase();
  const href = location.href.toLowerCase();

  if (title.includes("just a moment") || body.includes("enable javascript and cookies to continue")) {
    return "challenge";
  }

  if (href.includes("/login") || body.includes("log in with steam")) {
    return "auth-required";
  }

  if (fields.mapX && fields.mapY) {
    return "live";
  }

  if (href.includes("/map-tracker") || body.includes("map tracker")) {
    return "tracker";
  }

  return "waiting";
}

function findValue(labels, lines, pairs) {
  for (const label of labels) {
    const normalizedLabel = normalize(label);
    if (pairs[normalizedLabel]) {
      return pairs[normalizedLabel];
    }

    const fuzzyKey = Object.keys(pairs).find((key) => {
      return key === normalizedLabel || key.startsWith(`${normalizedLabel} `) || key.endsWith(` ${normalizedLabel}`);
    });

    if (fuzzyKey && pairs[fuzzyKey]) {
      return pairs[fuzzyKey];
    }
  }

  for (const label of labels) {
    const exact = findLineValue(lines, label);
    if (exact) {
      return exact;
    }
  }

  return "";
}

function findLineValue(lines, label) {
  const normalizedLabel = normalize(label);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const normalizedLine = normalize(line);

    if (normalizedLine === normalizedLabel || normalizedLine === `${normalizedLabel}:`) {
      return lines[index + 1] || "";
    }

    if (normalizedLine.startsWith(`${normalizedLabel}:`)) {
      return line.split(":").slice(1).join(":").trim();
    }

    if (normalizedLine.startsWith(`${normalizedLabel} `)) {
      return line.slice(label.length).trim();
    }
  }

  return "";
}

function extractTablePairs() {
  const pairs = {};
  document.querySelectorAll("tr").forEach((row) => {
    const cells = [...row.children].map((cell) => clean(cell.innerText));
    if (cells.length < 2 || !cells[0] || !cells[1]) {
      return;
    }

    pairs[normalize(cells[0])] = cells[1];
  });
  return pairs;
}

function extractDefinitionPairs() {
  const pairs = {};
  document.querySelectorAll("dt").forEach((term) => {
    const label = clean(term.innerText);
    const value = clean(term.nextElementSibling?.innerText || "");
    if (!label || !value) {
      return;
    }

    pairs[normalize(label)] = value;
  });
  return pairs;
}

function extractGenericPairs() {
  const pairs = {};
  const selector = [
    "[data-label]",
    "[aria-label]",
    ".label",
    ".field-label",
    ".tracker-label",
    ".stat-label",
    ".name"
  ].join(", ");

  document.querySelectorAll(selector).forEach((labelNode) => {
    const rawLabel =
      labelNode.getAttribute("data-label") ||
      labelNode.getAttribute("aria-label") ||
      labelNode.innerText ||
      "";
    const label = clean(rawLabel);
    if (!label) {
      return;
    }

    const valueCandidates = [
      labelNode.nextElementSibling,
      labelNode.parentElement?.querySelector(".value"),
      labelNode.parentElement?.querySelector(".field-value"),
      labelNode.parentElement?.querySelector(".tracker-value"),
      labelNode.parentElement?.querySelector(".stat-value"),
      labelNode.parentElement?.lastElementChild
    ];

    const value = clean(
      valueCandidates
        .map((node) => node?.innerText || "")
        .find(Boolean) || ""
    );

    if (!value || value === label) {
      return;
    }

    pairs[normalize(label)] = value;
  });

  return pairs;
}

function extractInlinePairs(bodyText) {
  const pairs = {};
  const patterns = {
    status: /status\s+(.+?)\s+last updated\b/i,
    "last updated": /last updated\s+(.+?)\s+server\b/i,
    server: /server\s+(.+?)\s+map x\b/i,
    "map x": /map x\s+(-?\d[\d,]*(?:\.\d+)?)/i,
    "map y": /map y\s+(-?\d[\d,]*(?:\.\d+)?)/i,
    altitude: /altitude\s+(-?\d[\d,]*(?:\.\d+)?)/i
  };

  Object.entries(patterns).forEach(([label, pattern]) => {
    const match = bodyText.match(pattern);
    if (!match?.[1]) {
      return;
    }

    pairs[normalize(label)] = clean(match[1]);
  });

  return pairs;
}

function getLines() {
  return clean(document.body?.innerText || "")
    .split(/\r?\n/)
    .map((line) => clean(line))
    .filter(Boolean)
    .slice(0, 400);
}

function clickControlByText(labels) {
  const normalizedLabels = labels.map(normalize);
  const controls = document.querySelectorAll(
    "button, a[href], [role='button'], input[type='button'], input[type='submit']"
  );

  for (const control of controls) {
    if (!(control instanceof HTMLElement)) {
      continue;
    }

    const rawText =
      control.innerText ||
      control.textContent ||
      control.getAttribute("aria-label") ||
      control.getAttribute("value") ||
      "";
    const text = normalize(rawText);
    if (!text) {
      continue;
    }

    const matches = normalizedLabels.some((label) => text === label || text.startsWith(`${label} `) || text.includes(` ${label}`));
    if (!matches) {
      continue;
    }

    if (control.hasAttribute("disabled") || control.getAttribute("aria-disabled") === "true") {
      continue;
    }

    control.click();
    return true;
  }

  return false;
}

function clean(value) {
  return String(value || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function normalize(value) {
  return clean(value)
    .toLowerCase()
    .replace(/[^\w\s:%.-]/g, "")
    .trim();
}
