const ROUTE_DATA = {
  nodes: [
    { id: "west-coast", x: -430000, y: 120000 },
    { id: "lazy-lake", x: -341000, y: 118000 },
    { id: "west-rail", x: -278000, y: -5000 },
    { id: "gorge", x: -156000, y: -86000 },
    { id: "saltwater", x: -205000, y: -229000 },
    { id: "mudflats", x: -314000, y: -149000 },
    { id: "meadowbrush", x: -147000, y: -294000 },
    { id: "south-plains", x: -126000, y: -169000 },
    { id: "south-cross", x: 10000, y: -170000 },
    { id: "swamp", x: 81000, y: -241000 },
    { id: "delta", x: 200000, y: -56000 },
    { id: "coastal-pond", x: 330000, y: -36000 },
    { id: "east-coast", x: 430000, y: -28000 },
    { id: "jungle-pond", x: 80000, y: 10000 },
    { id: "north-cross", x: 90000, y: 76000 },
    { id: "highland-lake", x: -16000, y: 132000 },
    { id: "dam-lake", x: 76000, y: 261000 },
    { id: "cascades", x: 145000, y: 203000 },
    { id: "stonehaven", x: 246000, y: 177000 },
    { id: "verdant", x: 189000, y: 299000 },
    { id: "north-lake", x: 326000, y: 366000 },
    { id: "hushwood", x: 145000, y: 390000 },
    { id: "plains-river", x: 362000, y: 267000 },
    { id: "port", x: 477000, y: 267000 },
    { id: "east-swamp", x: 494000, y: 152000 },
    { id: "ridgewood", x: -64000, y: 344000 },
    { id: "north-ridge", x: -104000, y: 312000 }
  ],
  edges: [
    ["west-coast", "lazy-lake"],
    ["lazy-lake", "west-rail"],
    ["lazy-lake", "ridgewood"],
    ["west-rail", "gorge"],
    ["west-rail", "mudflats"],
    ["west-rail", "highland-lake"],
    ["gorge", "saltwater"],
    ["gorge", "jungle-pond"],
    ["saltwater", "mudflats"],
    ["saltwater", "meadowbrush"],
    ["saltwater", "south-plains"],
    ["mudflats", "south-plains"],
    ["meadowbrush", "swamp"],
    ["south-plains", "south-cross"],
    ["south-plains", "swamp"],
    ["south-cross", "swamp"],
    ["south-cross", "delta"],
    ["swamp", "delta"],
    ["delta", "jungle-pond"],
    ["delta", "coastal-pond"],
    ["jungle-pond", "north-cross"],
    ["jungle-pond", "highland-lake"],
    ["north-cross", "highland-lake"],
    ["north-cross", "cascades"],
    ["north-cross", "dam-lake"],
    ["highland-lake", "dam-lake"],
    ["highland-lake", "north-ridge"],
    ["north-ridge", "ridgewood"],
    ["dam-lake", "cascades"],
    ["dam-lake", "verdant"],
    ["cascades", "stonehaven"],
    ["cascades", "verdant"],
    ["stonehaven", "verdant"],
    ["stonehaven", "coastal-pond"],
    ["stonehaven", "east-swamp"],
    ["verdant", "north-lake"],
    ["north-lake", "hushwood"],
    ["north-lake", "plains-river"],
    ["plains-river", "port"],
    ["plains-river", "east-swamp"],
    ["port", "east-swamp"],
    ["coastal-pond", "east-coast"],
    ["east-coast", "east-swamp"]
  ],
  blockers: [
    [
      { x: -250000, y: 20000 },
      { x: -120000, y: -60000 },
      { x: 20000, y: 20000 },
      { x: 40000, y: 180000 },
      { x: -20000, y: 260000 },
      { x: -180000, y: 220000 }
    ],
    [
      { x: -210000, y: 250000 },
      { x: 20000, y: 250000 },
      { x: 20000, y: 450000 },
      { x: -200000, y: 450000 }
    ],
    [
      { x: 260000, y: 60000 },
      { x: 560000, y: 60000 },
      { x: 560000, y: 340000 },
      { x: 330000, y: 360000 },
      { x: 240000, y: 220000 }
    ]
  ]
};

const MAP_CONFIG = {
  imageSize: 2500,
  minX: -560000,
  maxX: 674000,
  minY: -616000,
  maxY: 618000
};

const MAP_WORLD_WIDTH = MAP_CONFIG.maxX - MAP_CONFIG.minX;
const MAP_WORLD_HEIGHT = MAP_CONFIG.maxY - MAP_CONFIG.minY;
const SCENE_SCALE_X = MAP_CONFIG.imageSize / MAP_WORLD_WIDTH;
const SCENE_SCALE_Y = MAP_CONFIG.imageSize / MAP_WORLD_HEIGHT;

// Original three sanctuary coordinates came from community POI guides.
// The newer Highlands / East Swamp / Madflats sanctuaries are best-effort
// placements until I can source Vulnona's official sanctuary layer geometry.
// Highlands is anchored from the user's live Bosch position while inside it.
const SANCTUARY_LABELS = [
  { x: 33310, y: -287488, text: "Swamp Sanctuary", kind: "sanctuary" },
  { x: 182522, y: 278614, text: "Water Access Sanctuary", kind: "sanctuary" },
  { x: 226020, y: 27661, text: "Hidden Sanctuary", kind: "sanctuary" },
  { x: -159789, y: 58077, text: "Highlands Sanctuary", kind: "sanctuary" },
  { x: 520000, y: 128000, text: "East Swamp Sanctuary", kind: "sanctuary" },
  { x: -168000, y: -214000, text: "South Plains Sanctuary", kind: "sanctuary" },
  { x: -356000, y: -161000, text: "Madflats Sanctuary", kind: "sanctuary" }
];

const MIGRATION_ZONE_DEFS = [
  {
    id: "mz-north-plains",
    name: "North Plains",
    shape: {
      kind: "ellipse",
      center: { x: 338, y: 372 },
      width: 286,
      height: 250
    }
  },
  {
    id: "mz-northern-jungle",
    name: "Northern Jungle",
    shape: {
      kind: "ellipse",
      center: { x: 164, y: 290 },
      width: 150,
      height: 208,
      rotation: 12
    }
  },
  {
    id: "mz-west-rail",
    name: "West Rail",
    shape: {
      kind: "ellipse",
      center: { x: -333, y: 92 },
      width: 228,
      height: 200,
      rotation: -16
    }
  },
  {
    id: "mz-south-plains",
    name: "South Plains",
    shape: {
      kind: "ellipse",
      center: { x: -330, y: -214 },
      width: 182,
      height: 314,
      rotation: 27
    }
  },
  {
    id: "mz-delta",
    name: "Delta",
    shape: {
      kind: "polygon",
      center: { x: 202, y: -74 },
      points: [
        { x: 92, y: 14 },
        { x: 312, y: 14 },
        { x: 318, y: -160 },
        { x: 228, y: -184 },
        { x: 110, y: -148 },
        { x: 58, y: -54 }
      ]
    }
  },
  {
    id: "mz-east-coast",
    name: "East Coast",
    shape: {
      kind: "ellipse",
      center: { x: 498, y: -34 },
      width: 156,
      height: 138
    }
  },
  {
    id: "mz-highlands",
    name: "Highlands",
    shape: {
      kind: "polygon",
      center: { x: -122, y: 74 },
      points: [
        { x: -215, y: 48 },
        { x: -32, y: 118 },
        { x: -74, y: -18 }
      ]
    }
  },
  {
    id: "mz-swamps",
    name: "Swamps",
    shape: {
      kind: "rect",
      center: { x: 118, y: -325 },
      width: 252,
      height: 224,
      cornerRadius: 18
    }
  },
  {
    id: "mz-west-coast-pocket",
    name: "West Coast",
    shape: {
      kind: "ellipse",
      center: { x: -430, y: -78 },
      width: 140,
      height: 172,
      rotation: -12
    }
  }
];

const MIGRATION_ZONES = MIGRATION_ZONE_DEFS.map(normalizeMigrationZone);

const MAP_LABELS = [
  { x: 76000, y: 261000, text: "Dam Lake", kind: "water" },
  { x: 326000, y: 366000, text: "Northern Lake", kind: "water" },
  { x: -16000, y: 132000, text: "Highland Lake", kind: "water" },
  { x: 200000, y: -56000, text: "Delta", kind: "water" },
  { x: 81000, y: -241000, text: "Swamp", kind: "water" },
  { x: -205000, y: -229000, text: "Saltwater Lake", kind: "water" },
  { x: -314000, y: -149000, text: "Mudflats", kind: "water" },
  { x: 362000, y: 267000, text: "Plains River", kind: "water" },
  { x: -341000, y: 118000, text: "Lazy Lake", kind: "water" },
  { x: -156000, y: -86000, text: "Gorge River", kind: "water" },
  { x: 145000, y: 203000, text: "Cascades", kind: "water" },
  { x: -64000, y: 344000, text: "Ridgewood Lake", kind: "water" },
  { x: 246000, y: 177000, text: "Stonehaven Pond", kind: "water" },
  { x: 80000, y: 10000, text: "Jungle Pond", kind: "water" },
  { x: -147000, y: -294000, text: "Meadowbrush Pond", kind: "water" },
  { x: 189000, y: 299000, text: "Verdant Pool", kind: "water" },
  { x: 145000, y: 390000, text: "Hushwood Pond", kind: "water" },
  { x: 494000, y: 152000, text: "Eastern Swamp", kind: "water" },
  { x: -278000, y: -5000, text: "Hillside Pond", kind: "water" },
  { x: 330000, y: -36000, text: "Coastal Pond", kind: "water" },
  { x: 471000, y: 135000, text: "East Swamp", kind: "region" },
  { x: -108000, y: 33000, text: "Highlands J Sector", kind: "region" },
  { x: 90000, y: 76000, text: "Jungle I Sector", kind: "region" },
  { x: 325000, y: 386000, text: "North Lake", kind: "region" },
  { x: 180000, y: 361000, text: "Northern Jungle", kind: "region" },
  { x: -104000, y: 312000, text: "Northwest Ridge", kind: "region" },
  { x: -126000, y: -169000, text: "South Plains", kind: "region" },
  { x: 61000, y: -280000, text: "Swamps", kind: "region" },
  { x: 65000, y: 220000, text: "Water Access", kind: "region" },
  { x: -383000, y: 136000, text: "West Access", kind: "region" },
  { x: -246000, y: -26000, text: "West Rail Access", kind: "region" },
  { x: -43000, y: -113000, text: "Perimeter", kind: "structure" },
  { x: -109000, y: 188000, text: "North Dome", kind: "structure" },
  { x: 288000, y: 235000, text: "Volcano Bunker", kind: "structure" },
  { x: 27000, y: -99000, text: "Entrance", kind: "structure" },
  { x: 118000, y: -115000, text: "Swamp Tunnel", kind: "structure" },
  { x: 254000, y: -25000, text: "K15", kind: "structure" },
  { x: 86000, y: 109000, text: "I12", kind: "structure" },
  { x: 477000, y: 267000, text: "Port", kind: "structure" },
  { x: 211000, y: 431000, text: "C14", kind: "structure" },
  { x: -20000, y: 404000, text: "D10", kind: "structure" },
  { x: -299000, y: 151000, text: "H4", kind: "structure" },
  ...SANCTUARY_LABELS
];

const routeGraph = buildRouteGraph();
const mapCenter = {
  x: (MAP_CONFIG.minX + MAP_CONFIG.maxX) / 2,
  y: (MAP_CONFIG.minY + MAP_CONFIG.maxY) / 2
};
const PARTY_POLL_INTERVAL_MS = 3000;
const PARTY_SESSION_KEY = "the-isle-bosch-overlay.party-session";
const PARTY_COLOR_PALETTE = ["#7dd3fc", "#f472b6", "#f59e0b", "#34d399", "#a78bfa", "#fb7185", "#facc15", "#38bdf8"];

const elements = {
  body: document.body,
  mapView: document.getElementById("map-view"),
  mapScene: document.getElementById("map-scene"),
  migrationZoneShapes: document.getElementById("migration-zone-shapes"),
  sanctuaryMarkers: document.getElementById("sanctuary-markers"),
  migrationZoneMarkers: document.getElementById("migration-zone-markers"),
  mapLabelLayer: document.getElementById("map-label-layer"),
  partyMarkerLayer: document.getElementById("party-marker-layer"),
  routeShadow: document.getElementById("route-shadow"),
  routeLine: document.getElementById("route-line"),
  routePlayerCone: document.getElementById("route-player-cone"),
  routePlayerConeGradient: document.getElementById("route-player-cone-gradient"),
  routePlayer: document.getElementById("route-player"),
  routePin: document.getElementById("route-pin"),
  boschView: document.getElementById("bosch-view"),
  boschSheet: document.getElementById("bosch-sheet"),
  closeBoschSheet: document.getElementById("close-bosch-sheet"),
  boschHomeButton: document.getElementById("bosch-home-button"),
  boschTrackerButton: document.getElementById("bosch-tracker-button"),
  boschBackButton: document.getElementById("bosch-back-button"),
  boschReloadButton: document.getElementById("bosch-reload-button"),
  connectBoschButton: document.getElementById("connect-bosch-button"),
  reloadBoschButton: document.getElementById("reload-bosch-button"),
  hideOverlayButton: document.getElementById("hide-overlay-button"),
  quitOverlayButton: document.getElementById("quit-overlay-button"),
  toggleModeButton: document.getElementById("toggle-mode-button"),
  hotkeyLabel: document.getElementById("hotkey-label"),
  connectionLabel: document.getElementById("connection-label"),
  helperCopy: document.getElementById("helper-copy"),
  modeDot: document.getElementById("mode-dot"),
  statusValue: document.getElementById("status-value"),
  updatedValue: document.getElementById("updated-value"),
  serverValue: document.getElementById("server-value"),
  mapXValue: document.getElementById("map-x-value"),
  mapYValue: document.getElementById("map-y-value"),
  altitudeValue: document.getElementById("altitude-value"),
  partyIdentityForm: document.getElementById("party-identity-form"),
  partyNameInput: document.getElementById("party-name-input"),
  partyRoomForm: document.getElementById("party-room-form"),
  partyRoomInput: document.getElementById("party-room-input"),
  partyJoinButton: document.getElementById("party-join-button"),
  partyLeaveButton: document.getElementById("party-leave-button"),
  partyRoomActive: document.getElementById("party-room-active"),
  partyFeedback: document.getElementById("party-feedback"),
  partyMemberList: document.getElementById("party-member-list"),
  coordsForm: document.getElementById("coords-form"),
  coordsInput: document.getElementById("coords-input"),
  clearCoordsButton: document.getElementById("clear-coords-button"),
  coordsFeedback: document.getElementById("coords-feedback")
};

const state = {
  overlayMode: "compact",
  lastSnapshot: null,
  currentPosition: null,
  playerHeadingRadians: -Math.PI / 2,
  pinnedPosition: null,
  expandedZoom: 1,
  expandedPan: {
    x: 0,
    y: 0
  },
  dragState: {
    active: false,
    suppressClick: false,
    startClientX: 0,
    startClientY: 0,
    startPanX: 0,
    startPanY: 0
  },
  mapTransform: {
    scale: 1,
    x: 0,
    y: 0
  },
  party: {
    roomCode: null,
    playerId: null,
    playerName: "",
    color: null,
    members: [],
    lastSharedKey: null,
    lastSharedAt: 0
  },
  partyTimer: null,
  boschTrackerUrl: "https://bosch-island.com/map-tracker",
  boschHomeUrl: "https://bosch-island.com/"
};

init().catch((error) => {
  console.error(error);
  elements.statusValue.textContent = "Error";
  elements.helperCopy.textContent = error instanceof Error ? error.message : String(error);
});

async function init() {
  hydratePartySession();
  await configureBoschView();
  wireButtons();
  wireOverlayBridge();
  wireMapView();
  wireBoschView();
  updateModeUi("compact");
  renderMap();
  updatePartyUi();

  if (state.party.roomCode) {
    try {
      await refreshPartyState({ quiet: true });
    } catch (error) {
      console.error(error);
      elements.partyFeedback.textContent =
        "Saved room could not be reached yet. You can still rejoin once the room service is available.";
    }
    startPartyPolling();
  }
}

async function configureBoschView() {
  const fallbackTrackerUrl = "https://bosch-island.com/map-tracker";

  try {
    const resources = await window.isleOverlay.getResources();
    if (resources?.boschPreloadUrl) {
      elements.boschView.setAttribute("preload", resources.boschPreloadUrl);
    }

    state.boschTrackerUrl = resources?.boschTrackerUrl || fallbackTrackerUrl;
    state.boschHomeUrl = resources?.boschHomeUrl || "https://bosch-island.com/";
    elements.boschView.setAttribute("src", state.boschTrackerUrl);
  } catch (error) {
    console.error("Failed to configure Bosch webview resources", error);
    state.boschTrackerUrl = fallbackTrackerUrl;
    elements.boschView.setAttribute("src", fallbackTrackerUrl);
  }
}

function wireButtons() {
  elements.toggleModeButton.addEventListener("click", async () => {
    await window.isleOverlay.toggleMode();
  });

  elements.hideOverlayButton.addEventListener("click", async () => {
    await window.isleOverlay.toggleVisibility();
  });

  elements.quitOverlayButton.addEventListener("click", async () => {
    await window.isleOverlay.quit();
  });

  elements.connectBoschButton.addEventListener("click", async () => {
    if (state.overlayMode !== "expanded") {
      await window.isleOverlay.setMode("expanded");
    }
    elements.boschSheet.classList.remove("hidden");
  });

  elements.closeBoschSheet.addEventListener("click", () => {
    elements.boschSheet.classList.add("hidden");
  });

  elements.reloadBoschButton.addEventListener("click", () => {
    elements.boschView.reload();
  });

  elements.boschHomeButton.addEventListener("click", () => {
    elements.boschView.loadURL(state.boschHomeUrl);
  });

  elements.boschTrackerButton.addEventListener("click", () => {
    elements.boschView.loadURL(state.boschTrackerUrl);
  });

  elements.boschBackButton.addEventListener("click", () => {
    if (elements.boschView.canGoBack()) {
      elements.boschView.goBack();
    }
  });

  elements.boschReloadButton.addEventListener("click", () => {
    elements.boschView.reload();
  });

  elements.partyIdentityForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitPartyCreate();
  });

  elements.partyRoomForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitPartyJoin();
  });

  elements.partyLeaveButton.addEventListener("click", async () => {
    await leavePartyRoom();
  });

  elements.partyRoomInput.addEventListener("input", () => {
    elements.partyRoomInput.value = String(elements.partyRoomInput.value || "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6);
  });

  elements.coordsForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitCustomCoords();
  });

  elements.clearCoordsButton.addEventListener("click", async () => {
    await clearCustomCoords();
  });
}

function wireOverlayBridge() {
  window.isleOverlay.getInfo().then((info) => {
    applyOverlayState(info);
  });

  window.isleOverlay.onStateChange((info) => {
    applyOverlayState(info);
  });
}

function wireMapView() {
  elements.mapView.addEventListener("click", (event) => {
    if (state.dragState.suppressClick) {
      state.dragState.suppressClick = false;
      return;
    }

    const point = clientToGamePoint(event);
    if (!point) {
      return;
    }

    state.pinnedPosition = point;
    renderMap();
  });

  elements.mapView.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    state.pinnedPosition = null;
    renderMap();
  });

  elements.mapView.addEventListener(
    "wheel",
    (event) => {
      if (state.overlayMode !== "expanded") {
        return;
      }

      event.preventDefault();
      const zoomFactor = event.deltaY < 0 ? 1.14 : 0.88;
      updateExpandedZoom(zoomFactor, event.clientX, event.clientY);
    },
    { passive: false }
  );

  elements.mapView.addEventListener("mousedown", (event) => {
    if (state.overlayMode !== "expanded" || event.button !== 0 || state.expandedZoom <= 1) {
      return;
    }

    state.dragState.active = true;
    state.dragState.suppressClick = false;
    state.dragState.startClientX = event.clientX;
    state.dragState.startClientY = event.clientY;
    state.dragState.startPanX = state.expandedPan.x;
    state.dragState.startPanY = state.expandedPan.y;
    renderMap();
  });

  window.addEventListener("mousemove", (event) => {
    if (!state.dragState.active) {
      return;
    }

    const deltaX = event.clientX - state.dragState.startClientX;
    const deltaY = event.clientY - state.dragState.startClientY;

    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      state.dragState.suppressClick = true;
    }

    state.expandedPan.x = state.dragState.startPanX + deltaX;
    state.expandedPan.y = state.dragState.startPanY + deltaY;
    renderMap();
  });

  window.addEventListener("mouseup", () => {
    if (!state.dragState.active) {
      return;
    }

    state.dragState.active = false;
    renderMap();
  });

  elements.mapView.addEventListener("dblclick", () => {
    if (state.overlayMode !== "expanded") {
      return;
    }

    state.expandedZoom = 1;
    state.expandedPan = { x: 0, y: 0 };
    renderMap();
  });

  window.addEventListener("resize", () => {
    renderMap();
  });

  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(() => {
      renderMap();
    });
    observer.observe(elements.mapView);
  }
}

function wireBoschView() {
  elements.boschView.addEventListener("ipc-message", async (event) => {
    if (event.channel !== "bosch:update" || !event.args.length) {
      return;
    }

    const snapshot = event.args[0];
    state.lastSnapshot = snapshot;
    void window.isleOverlay.writeDebugSnapshot(snapshot);
    updateHud(snapshot);

    if (snapshot.pageState === "live") {
      elements.boschSheet.classList.add("hidden");
      await syncTrackerToMap(snapshot);
    }
  });

  elements.boschView.addEventListener("did-fail-load", () => {
    updateHud({
      pageState: "error",
      fields: {
        status: "Bosch failed to load"
      }
    });
  });

  elements.boschView.addEventListener("did-navigate", () => {
    elements.coordsFeedback.textContent =
      "If Bosch lands on the homepage, use Tracker to jump back to the tracker page, then log in with Steam.";
  });
}

function applyOverlayState(info) {
  if (!info) {
    return;
  }

  elements.hotkeyLabel.textContent = info.hotkey || "F8";
  updateModeUi(info.mode || "compact");
}

function updateModeUi(mode) {
  state.overlayMode = mode;
  elements.body.dataset.mode = mode;
  elements.toggleModeButton.textContent = mode === "compact" ? "Full Map" : "Compact";

  if (mode !== "expanded") {
    state.dragState.active = false;
  }

  if (state.lastSnapshot) {
    updateHud(state.lastSnapshot);
  }

  renderMap();
}

function updateHud(snapshot) {
  const fields = snapshot?.fields || {};
  const pageState = snapshot?.pageState || "waiting";
  const live = pageState === "live";
  const trackerVisible = pageState === "tracker";

  elements.modeDot.classList.toggle("live", live);
  elements.connectionLabel.textContent = getConnectionLabel(pageState, fields.status);
  elements.statusValue.textContent = fields.status || getFallbackStatus(pageState);
  elements.updatedValue.textContent = fields.lastUpdated || "--";
  elements.serverValue.textContent = fields.server || "--";
  elements.mapXValue.textContent = fields.mapX || "--";
  elements.mapYValue.textContent = fields.mapY || "--";
  elements.altitudeValue.textContent = fields.altitude || "--";

  if (pageState === "auth-required") {
    elements.helperCopy.textContent =
      "Open Connect Bosch, sign in with Steam, then leave the Bosch panel open until your live tracker values appear.";
  } else if (live) {
    elements.helperCopy.textContent =
      state.overlayMode === "expanded"
        ? "Bosch is live. Scroll to zoom the fullscreen map, drag to pan, double-click to reset, left-click to pin a route, and right-click to clear it."
        : "Bosch is live. Click the map to pin a destination route, and right-click the map to clear it.";
  } else if (trackerVisible) {
    elements.helperCopy.textContent =
      "Bosch is open, but I am not receiving live coordinates yet. Leave the Bosch panel open on the tracker page and press Reload Bosch once if needed.";
  } else if (pageState === "challenge") {
    elements.helperCopy.textContent =
      "Bosch is passing Cloudflare's browser check. Give it a moment, then open Connect Bosch if it still needs attention.";
  } else {
    elements.helperCopy.textContent =
      "The overlay will follow Bosch Island after you sign in once with Steam. F8 toggles fullscreen, F9 hides the overlay, and map clicks place a route pin.";
  }
}

function getConnectionLabel(pageState, status) {
  if (pageState === "live") {
    return "Bosch live";
  }

  if (pageState === "tracker") {
    return "Bosch waiting on coords";
  }

  if (pageState === "auth-required") {
    return "Bosch login needed";
  }

  if (pageState === "challenge") {
    return "Bosch security check";
  }

  if (status) {
    return status;
  }

  return "Waiting for Bosch";
}

function getFallbackStatus(pageState) {
  switch (pageState) {
    case "auth-required":
      return "Login Needed";
    case "challenge":
      return "Checking";
    case "error":
      return "Unavailable";
    default:
      return "Waiting";
  }
}

async function syncTrackerToMap(snapshot) {
  const currentPosition = normalizeTrackerPosition(
    parseTrackerNumber(snapshot?.fields?.mapX),
    parseTrackerNumber(snapshot?.fields?.mapY)
  );

  if (!currentPosition) {
    state.currentPosition = null;
    state.playerHeadingRadians = -Math.PI / 2;
    renderMap();
    await syncPartyPosition(null);
    return;
  }

  updatePlayerHeading(currentPosition);
  state.currentPosition = currentPosition;
  renderMap();
  await syncPartyPosition(currentPosition);
}

async function submitCustomCoords() {
  const parsed = parseCoordinateInput(elements.coordsInput.value);
  if (!parsed) {
    elements.coordsFeedback.textContent =
      "Could not parse those coordinates. Use `200, -56`, `X=200 Y=-56`, or Bosch-style values like `412.5 175.5`.";
    return;
  }

  const currentPosition = normalizeTrackerPosition(parsed.x, parsed.y);
  if (!currentPosition) {
    elements.coordsFeedback.textContent = "Those coordinates are not valid for the map.";
    return;
  }

  updatePlayerHeading(currentPosition);
  state.currentPosition = currentPosition;
  renderMap();
  await syncPartyPosition(currentPosition, { force: true });
  elements.coordsFeedback.textContent = `Plotted ${roundSharedCoord(parsed.x)}, ${roundSharedCoord(parsed.y)} on the map.`;
}

async function clearCustomCoords() {
  state.currentPosition = null;
  state.playerHeadingRadians = -Math.PI / 2;
  renderMap();
  await syncPartyPosition(null, { force: true });
  elements.coordsInput.value = "";
  elements.coordsFeedback.textContent = "Custom coordinates cleared.";
}

function renderMap() {
  const rect = elements.mapView.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return;
  }

  const containScale = Math.min(rect.width / MAP_CONFIG.imageSize, rect.height / MAP_CONFIG.imageSize);
  const coverScale = Math.max(rect.width / MAP_CONFIG.imageSize, rect.height / MAP_CONFIG.imageSize);
  let scale = containScale;
  let x = 0;
  let y = 0;

  if (state.overlayMode === "compact") {
    const focus = pointToScene(state.currentPosition || mapCenter);
    scale = Math.max(coverScale * (state.currentPosition ? 6.15 : 4.4), containScale);
    x = rect.width / 2 - focus.x * scale;
    y = rect.height / 2 - focus.y * scale;
    x = clamp(x, rect.width - MAP_CONFIG.imageSize * scale, 0);
    y = clamp(y, rect.height - MAP_CONFIG.imageSize * scale, 0);
    elements.mapView.style.cursor = "crosshair";
  } else {
    scale = containScale * state.expandedZoom;
    const baseX = (rect.width - MAP_CONFIG.imageSize * scale) / 2;
    const baseY = (rect.height - MAP_CONFIG.imageSize * scale) / 2;
    x = baseX + state.expandedPan.x;
    y = baseY + state.expandedPan.y;
    x = clamp(x, rect.width - MAP_CONFIG.imageSize * scale, 0);
    y = clamp(y, rect.height - MAP_CONFIG.imageSize * scale, 0);
    state.expandedPan.x = x - baseX;
    state.expandedPan.y = y - baseY;
    elements.mapView.style.cursor = state.dragState.active ? "grabbing" : state.expandedZoom > 1 ? "grab" : "crosshair";
  }

  state.mapTransform = { scale, x, y };
  elements.mapScene.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;

  renderMigrationZones();
  renderLabels();
  renderPartyMarkers();

  const route = getActiveRoute();
  drawPolyline(elements.routeShadow, route);
  drawPolyline(elements.routeLine, route);
  drawPlayerCone(elements.routePlayerCone, state.currentPosition, state.playerHeadingRadians);
  drawMarker(elements.routePlayer, state.currentPosition);
  drawMarker(elements.routePin, state.pinnedPosition);
}

function renderMigrationZones() {
  const shapes = MIGRATION_ZONES.map((zone) => renderMigrationZoneShape(zone)).join("");
  const sanctuaryMarkers = SANCTUARY_LABELS.map((label) => renderSanctuaryMarker(label)).join("");
  const markers = MIGRATION_ZONES.map((zone) => renderMigrationZoneMarker(zone)).join("");
  elements.migrationZoneShapes.innerHTML = shapes;
  elements.sanctuaryMarkers.innerHTML = sanctuaryMarkers;
  elements.migrationZoneMarkers.innerHTML = markers;
}

function renderLabels() {
  const labelPriority = {
    water: 1,
    region: 2,
    structure: 3,
    sanctuary: 4
  };

  const labels = [...MAP_LABELS]
    .sort((left, right) => (labelPriority[left.kind] || 0) - (labelPriority[right.kind] || 0))
    .map((label) => {
    const point = pointToScene({ x: label.x, y: label.y });
    return `<div class="map-label ${label.kind}${label.kind === "sanctuary" ? " has-icon" : ""}" style="left:${point.x}px;top:${point.y}px;">${renderLabelInner(label)}</div>`;
    })
    .join("");

  elements.mapLabelLayer.innerHTML = labels;
}

function renderPartyMarkers() {
  const members = getSortedPartyMembers().filter((member) => {
    if (!member || member.playerId === state.party.playerId || !member.coords) {
      return false;
    }

    return Boolean(normalizeSharedCoords(member.coords));
  });

  const markup = members
    .map((member) => {
      const point = pointToScene(normalizeSharedCoords(member.coords));
      const name = escapeHtml(member.name || "Friend");
      const color = escapeHtml(getPartyMemberColor(member));
      return `
        <div class="party-marker" style="left:${point.x}px;top:${point.y}px;--party-color:${color};" title="${name}">
          <span>${escapeHtml(initialsForName(member.name || "Friend"))}</span>
          <span class="party-marker-name">${name}</span>
        </div>
      `;
    })
    .join("");

  elements.partyMarkerLayer.innerHTML = markup;
}

async function partyRequest(pathname, options = {}) {
  return window.isleOverlay.partyRequest({
    pathname,
    method: options.method || "GET",
    body: options.body
  });
}

async function submitPartyCreate() {
  try {
    const name = getPartyDisplayName();
    elements.partyFeedback.textContent = "Creating room...";
    const payload = await partyRequest("/api/party/rooms/create", {
      method: "POST",
      body: {
        name,
        color: state.party.color || nextPartyColor()
      }
    });

    applyPartyStateResponse(payload, name);
    startPartyPolling();
    elements.partyFeedback.textContent = `Room ${state.party.roomCode} is live. Share that code with friends.`;
    await syncPartyPosition(state.currentPosition, { force: true });
  } catch (error) {
    elements.partyFeedback.textContent = error instanceof Error ? error.message : String(error);
  }
}

async function submitPartyJoin() {
  try {
    const roomCode = sanitizeRoomCode(elements.partyRoomInput.value);
    if (!roomCode) {
      elements.partyFeedback.textContent = "Enter a valid 6-character room code.";
      return;
    }

    const name = getPartyDisplayName();
    elements.partyFeedback.textContent = `Joining room ${roomCode}...`;
    const payload = await partyRequest(`/api/party/rooms/${roomCode}/join`, {
      method: "POST",
      body: {
        playerId: state.party.playerId,
        name,
        color: state.party.color || nextPartyColor()
      }
    });

    applyPartyStateResponse(payload, name);
    startPartyPolling();
    elements.partyFeedback.textContent = `Joined room ${state.party.roomCode}. Friend markers now sync into this overlay.`;
    await syncPartyPosition(state.currentPosition, { force: true });
  } catch (error) {
    elements.partyFeedback.textContent = error instanceof Error ? error.message : String(error);
  }
}

async function leavePartyRoom() {
  if (state.party.roomCode && state.party.playerId) {
    try {
      await partyRequest(`/api/party/rooms/${state.party.roomCode}/leave`, {
        method: "POST",
        body: {
          playerId: state.party.playerId
        }
      });
    } catch {
      // Ignore leave failures and clear the local session anyway.
    }
  }

  clearPartySession();
  updatePartyUi();
  renderPartyMarkers();
  elements.partyFeedback.textContent = "Left the room. Your overlay is no longer sharing live position.";
}

async function refreshPartyState(options = { quiet: false }) {
  if (!state.party.roomCode) {
    return;
  }

  try {
    const playerIdSearch = state.party.playerId ? `?playerId=${encodeURIComponent(state.party.playerId)}` : "";
    const payload = await partyRequest(`/api/party/rooms/${state.party.roomCode}/state${playerIdSearch}`);
    applyPartyStateResponse(payload, state.party.playerName);
    if (!options.quiet) {
      elements.partyFeedback.textContent = `Room ${state.party.roomCode} synced. ${visiblePartyMemberCount()} friend marker(s) visible.`;
    }
  } catch (error) {
    if (!options.quiet) {
      elements.partyFeedback.textContent = error instanceof Error ? error.message : String(error);
    }
  }
}

function startPartyPolling() {
  if (state.partyTimer) {
    clearInterval(state.partyTimer);
  }

  if (!state.party.roomCode) {
    return;
  }

  state.partyTimer = setInterval(() => {
    refreshPartyState({ quiet: true }).catch((error) => console.error(error));
  }, PARTY_POLL_INTERVAL_MS);
}

async function syncPartyPosition(point, options = {}) {
  if (!state.party.roomCode || !state.party.playerId) {
    return;
  }

  const coords = point ? toSharedCoords(point) : null;
  const key = coords ? `${coords.x}:${coords.y}:${coords.z ?? 0}` : "null";
  const now = Date.now();

  if (!options.force && state.party.lastSharedKey === key && now - state.party.lastSharedAt < 8000) {
    return;
  }

  const payload = {
    playerId: state.party.playerId,
    name: getPartyDisplayName(),
    color: state.party.color || nextPartyColor(),
    coords
  };

  try {
    const response = await partyRequest(`/api/party/rooms/${state.party.roomCode}/update`, {
      method: "POST",
      body: payload
    });
    state.party.lastSharedKey = key;
    state.party.lastSharedAt = now;
    applyPartyStateResponse(response, payload.name);
  } catch (error) {
    console.error(error);
  }
}

function hydratePartySession() {
  try {
    const stored = JSON.parse(localStorage.getItem(PARTY_SESSION_KEY) || "null");
    if (stored && typeof stored === "object") {
      state.party.roomCode = sanitizeRoomCode(stored.roomCode);
      state.party.playerId = typeof stored.playerId === "string" ? stored.playerId : null;
      state.party.playerName = typeof stored.playerName === "string" ? stored.playerName : "";
      state.party.color = typeof stored.color === "string" ? stored.color : null;
    }
  } catch {
    // Ignore malformed local sessions.
  }

  if (!state.party.color) {
    state.party.color = nextPartyColor();
  }

  if (state.party.playerName) {
    elements.partyNameInput.value = state.party.playerName;
  }

  if (state.party.roomCode) {
    elements.partyRoomInput.value = state.party.roomCode;
  }
}

function persistPartySession() {
  localStorage.setItem(
    PARTY_SESSION_KEY,
    JSON.stringify({
      roomCode: state.party.roomCode,
      playerId: state.party.playerId,
      playerName: state.party.playerName,
      color: state.party.color
    })
  );
}

function clearPartySession() {
  state.party.roomCode = null;
  state.party.playerId = null;
  state.party.members = [];
  state.party.lastSharedKey = null;
  state.party.lastSharedAt = 0;
  if (state.partyTimer) {
    clearInterval(state.partyTimer);
    state.partyTimer = null;
  }
  localStorage.removeItem(PARTY_SESSION_KEY);
}

function applyPartyStateResponse(payload, fallbackName) {
  if (!payload?.ok) {
    throw new Error(payload?.error || "Room request failed.");
  }

  state.party.roomCode = sanitizeRoomCode(payload.roomCode);
  state.party.members = Array.isArray(payload.members) ? payload.members : [];

  if (payload.self) {
    state.party.playerId = payload.self.playerId;
    state.party.playerName = payload.self.name || fallbackName || state.party.playerName;
    state.party.color = payload.self.color || state.party.color || nextPartyColor();
  } else if (fallbackName) {
    state.party.playerName = fallbackName;
  }

  persistPartySession();
  updatePartyUi();
  renderPartyMembers();
  renderPartyMarkers();
}

function updatePartyUi() {
  elements.partyRoomActive.textContent = state.party.roomCode ? `Room ${state.party.roomCode}` : "No room joined";
  elements.partyLeaveButton.classList.toggle("hidden", !state.party.roomCode);
  if (state.party.roomCode) {
    elements.partyRoomInput.value = state.party.roomCode;
  }
  if (state.party.playerName) {
    elements.partyNameInput.value = state.party.playerName;
  }
}

function renderPartyMembers() {
  if (!state.party.members.length) {
    elements.partyMemberList.innerHTML = "";
    return;
  }

  elements.partyMemberList.innerHTML = getSortedPartyMembers()
    .map((member) => {
      const markerColor = escapeHtml(getPartyMemberColor(member));
      const coords = member.coords ? formatSharedCoords(member.coords) : "waiting";
      return `
        <div class="party-member-chip" style="--member-color:${markerColor};">
          <span class="party-member-swatch" aria-hidden="true"></span>
          <span class="party-member-name">${escapeHtml(member.name || "Friend")}${member.playerId === state.party.playerId ? " (You)" : ""}</span>
          <span class="party-member-coords">${coords}</span>
        </div>
      `;
    })
    .join("");
}

function visiblePartyMemberCount() {
  return state.party.members.filter((member) => member.playerId !== state.party.playerId && member.coords).length;
}

function getSortedPartyMembers() {
  return [...state.party.members].sort((left, right) => {
    const leftKey = `${left?.playerId || ""}:${left?.name || ""}`;
    const rightKey = `${right?.playerId || ""}:${right?.name || ""}`;
    return leftKey.localeCompare(rightKey);
  });
}

function getPartyMemberColor(member) {
  const sortedMembers = getSortedPartyMembers();
  const memberIndex = Math.max(
    0,
    sortedMembers.findIndex((candidate) => candidate.playerId === member.playerId)
  );

  return PARTY_COLOR_PALETTE[memberIndex % PARTY_COLOR_PALETTE.length];
}

function getPartyDisplayName() {
  const value = String(elements.partyNameInput.value || "")
    .trim()
    .replace(/\s+/g, " ");
  state.party.playerName = (value || state.party.playerName || "Anonymous").slice(0, 24);
  return state.party.playerName;
}

function sanitizeRoomCode(value) {
  const normalized = String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  return normalized.length === 6 ? normalized : null;
}

function nextPartyColor() {
  const seed = `${state.party.playerName || ""}:${state.party.playerId || ""}:${state.party.roomCode || ""}`;
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return PARTY_COLOR_PALETTE[hash % PARTY_COLOR_PALETTE.length];
}

function initialsForName(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (!parts.length) {
    return "?";
  }

  return parts.map((part) => part[0]?.toUpperCase() || "").join("");
}

function toSharedCoords(point) {
  return {
    x: roundSharedCoord(point.x / 1000),
    y: roundSharedCoord(point.y / 1000),
    z: 0
  };
}

function normalizeSharedCoords(coords) {
  const rawX = Number(coords?.x);
  const rawY = Number(coords?.y);
  if (!Number.isFinite(rawX) || !Number.isFinite(rawY)) {
    return null;
  }

  return {
    x: normalizeRouteCoordinate(rawX),
    y: normalizeRouteCoordinate(rawY)
  };
}

function roundSharedCoord(value) {
  return Math.round(value * 100) / 100;
}

function formatSharedCoords(coords) {
  return `${roundSharedCoord(Number(coords.x) || 0)}, ${roundSharedCoord(Number(coords.y) || 0)}`;
}

function renderLabelInner(label) {
  if (label.kind === "sanctuary") {
    return `${renderSanctuaryIcon()}<span>${escapeHtml(label.text)}</span>`;
  }

  return escapeHtml(label.text);
}

function renderMigrationZoneShape(zone) {
  const { shape } = zone;

  if (shape.kind === "ellipse") {
    const center = pointToScene(shape.center);
    const rx = worldWidthToScene(shape.width) / 2;
    const ry = worldHeightToScene(shape.height) / 2;
    const transform = shape.rotation ? ` transform="rotate(${shape.rotation} ${center.x} ${center.y})"` : "";
    return `<ellipse class="migration-zone-shape" cx="${center.x}" cy="${center.y}" rx="${rx}" ry="${ry}"${transform}></ellipse>`;
  }

  if (shape.kind === "rect") {
    const center = pointToScene(shape.center);
    const width = worldWidthToScene(shape.width);
    const height = worldHeightToScene(shape.height);
    const rx = worldWidthToScene(shape.cornerRadius || 0);
    const ry = worldHeightToScene(shape.cornerRadius || 0);
    const transform = shape.rotation ? ` transform="rotate(${shape.rotation} ${center.x} ${center.y})"` : "";
    return `<rect class="migration-zone-shape" x="${center.x - width / 2}" y="${center.y - height / 2}" width="${width}" height="${height}" rx="${rx}" ry="${ry}"${transform}></rect>`;
  }

  const points = shape.points.map((point) => {
    const scenePoint = pointToScene(point);
    return `${scenePoint.x},${scenePoint.y}`;
  }).join(" ");
  return `<polygon class="migration-zone-shape" points="${points}"></polygon>`;
}

function renderMigrationZoneMarker(zone) {
  const center = pointToScene(zone.center);
  return `
    <g class="migration-zone-marker" transform="translate(${center.x} ${center.y})">
      <circle class="migration-zone-marker-glow" r="42"></circle>
      <circle class="migration-zone-marker-badge" r="26"></circle>
      ${renderMigrationIcon()}
      <text class="migration-zone-marker-name" y="46">${escapeHtml(zone.name)}</text>
    </g>
  `;
}

function renderSanctuaryMarker(label) {
  const center = pointToScene({ x: label.x, y: label.y });
  return `
    <g class="sanctuary-marker" transform="translate(${center.x} ${center.y})">
      <circle class="sanctuary-marker-glow" r="40"></circle>
      <circle class="sanctuary-marker-badge" r="24"></circle>
      <g class="sanctuary-marker-icon" transform="translate(-12 -14) scale(0.75)">
        <path d="M15 29h2l1-7h-4z"></path>
        <path d="M16 11c-4.2 0-8.4 1.9-11 5.3 4-1 7.6-.6 11 1.1-1.9-3.3-5-5.6-8.8-6.7C10 9.8 13 9.8 16 11Z"></path>
        <path d="M16 11c4.2 0 8.4 1.9 11 5.3-4-1-7.6-.6-11 1.1 1.9-3.3 5-5.6 8.8-6.7C22 9.8 19 9.8 16 11Z"></path>
        <path d="M16 14c-4.5-.4-8.7 1.1-12 4.1 4.4-.4 8.4.5 12 2.6-1.5-2.2-3.6-4.2-6.4-5.5C12 14.6 14 14.2 16 14Z"></path>
        <path d="M16 14c4.5-.4 8.7 1.1 12 4.1-4.4-.4-8.4.5-12 2.6 1.5-2.2 3.6-4.2 6.4-5.5C20 14.6 18 14.2 16 14Z"></path>
        <path d="M16 4c-2.7 2.1-4.2 4.6-4.4 7.6 1.5-1.4 2.9-2.1 4.4-2.2 1.5.1 2.9.8 4.4 2.2C20.2 8.6 18.7 6.1 16 4Z"></path>
      </g>
      <text class="sanctuary-marker-name" y="46">${escapeHtml(label.text)}</text>
    </g>
  `;
}

function renderSanctuaryIcon() {
  return `
    <span class="map-label-icon sanctuary-icon" aria-hidden="true">
      <svg viewBox="0 0 32 32" focusable="false">
        <path d="M15 29h2l1-7h-4z"></path>
        <path d="M16 11c-4.2 0-8.4 1.9-11 5.3 4-1 7.6-.6 11 1.1-1.9-3.3-5-5.6-8.8-6.7C10 9.8 13 9.8 16 11Z"></path>
        <path d="M16 11c4.2 0 8.4 1.9 11 5.3-4-1-7.6-.6-11 1.1 1.9-3.3 5-5.6 8.8-6.7C22 9.8 19 9.8 16 11Z"></path>
        <path d="M16 14c-4.5-.4-8.7 1.1-12 4.1 4.4-.4 8.4.5 12 2.6-1.5-2.2-3.6-4.2-6.4-5.5C12 14.6 14 14.2 16 14Z"></path>
        <path d="M16 14c4.5-.4 8.7 1.1 12 4.1-4.4-.4-8.4.5-12 2.6 1.5-2.2 3.6-4.2 6.4-5.5C20 14.6 18 14.2 16 14Z"></path>
        <path d="M16 4c-2.7 2.1-4.2 4.6-4.4 7.6 1.5-1.4 2.9-2.1 4.4-2.2 1.5.1 2.9.8 4.4 2.2C20.2 8.6 18.7 6.1 16 4Z"></path>
      </svg>
    </span>
  `;
}

function renderMigrationIcon() {
  return `
      <g class="migration-zone-marker-icon" aria-hidden="true">
        <ellipse cx="-7" cy="-1" rx="4.3" ry="6.6"></ellipse>
        <circle cx="-11.5" cy="-7.8" r="2.2"></circle>
        <circle cx="-7.7" cy="-10" r="2.2"></circle>
        <circle cx="-3.8" cy="-7.6" r="2.2"></circle>
        <ellipse cx="7" cy="1.5" rx="4.3" ry="6.6"></ellipse>
        <circle cx="2.5" cy="-5.6" r="2.2"></circle>
        <circle cx="6.3" cy="-7.9" r="2.2"></circle>
        <circle cx="10.2" cy="-5.4" r="2.2"></circle>
      </g>
  `;
}

function drawPolyline(element, points) {
  element.setAttribute("points", points.map((point) => `${point.x},${point.y}`).join(" "));
}

function drawMarker(element, point) {
  if (!point) {
    element.setAttribute("visibility", "hidden");
    return;
  }

  const mapped = pointToScene(point);
  element.setAttribute("cx", mapped.x);
  element.setAttribute("cy", mapped.y);
  element.setAttribute("visibility", "visible");
}

function drawPlayerCone(element, point, headingRadians) {
  if (!point) {
    element.setAttribute("visibility", "hidden");
    return;
  }

  const safeHeading = Number.isFinite(headingRadians) ? headingRadians : -Math.PI / 2;
  const center = pointToScene(point);
  const innerRadius = 14;
  const outerRadius = 66;
  const spread = Math.PI / 2.4;
  const startAngle = safeHeading - spread / 2;
  const endAngle = safeHeading + spread / 2;
  const innerStart = polarPoint(center, innerRadius, startAngle);
  const outerStart = polarPoint(center, outerRadius, startAngle);
  const outerEnd = polarPoint(center, outerRadius, endAngle);
  const innerEnd = polarPoint(center, innerRadius, endAngle);
  const largeArcFlag = spread > Math.PI ? 1 : 0;
  const path = [
    `M ${innerStart.x} ${innerStart.y}`,
    `L ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
    "Z"
  ].join(" ");

  const gradientStart = polarPoint(center, innerRadius, safeHeading);
  const gradientEnd = polarPoint(center, outerRadius, safeHeading);
  elements.routePlayerConeGradient.setAttribute("x1", `${gradientStart.x}`);
  elements.routePlayerConeGradient.setAttribute("y1", `${gradientStart.y}`);
  elements.routePlayerConeGradient.setAttribute("x2", `${gradientEnd.x}`);
  elements.routePlayerConeGradient.setAttribute("y2", `${gradientEnd.y}`);
  element.setAttribute("d", path);
  element.setAttribute("visibility", "visible");
}

function updatePlayerHeading(nextPosition) {
  if (!state.currentPosition) {
    return;
  }

  const deltaX = nextPosition.x - state.currentPosition.x;
  const deltaY = nextPosition.y - state.currentPosition.y;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance < 250) {
    return;
  }

  state.playerHeadingRadians = Math.atan2(-deltaY, deltaX);
}

function polarPoint(center, radius, angle) {
  return {
    x: center.x + Math.cos(angle) * radius,
    y: center.y + Math.sin(angle) * radius
  };
}

function getActiveRoute() {
  if (!state.currentPosition || !state.pinnedPosition) {
    return [];
  }

  return findRoute(state.currentPosition, state.pinnedPosition).map(pointToScene);
}

function pointToScene(point) {
  return {
    x: ((point.x - MAP_CONFIG.minX) / MAP_WORLD_WIDTH) * MAP_CONFIG.imageSize,
    y: ((MAP_CONFIG.maxY - point.y) / MAP_WORLD_HEIGHT) * MAP_CONFIG.imageSize
  };
}

function sceneToPoint(scenePoint) {
  return {
    x: MAP_CONFIG.minX + (scenePoint.x / MAP_CONFIG.imageSize) * MAP_WORLD_WIDTH,
    y: MAP_CONFIG.maxY - (scenePoint.y / MAP_CONFIG.imageSize) * MAP_WORLD_HEIGHT
  };
}

function mapUnits(value) {
  return value * 1000;
}

function toWorldPoint(point) {
  return {
    x: mapUnits(point.x),
    y: mapUnits(point.y)
  };
}

function normalizeMigrationZone(zone) {
  const center = toWorldPoint(zone.shape.center);

  if (zone.shape.kind === "ellipse") {
    return {
      ...zone,
      center,
      shape: {
        ...zone.shape,
        center,
        width: mapUnits(zone.shape.width),
        height: mapUnits(zone.shape.height)
      }
    };
  }

  if (zone.shape.kind === "rect") {
    return {
      ...zone,
      center,
      shape: {
        ...zone.shape,
        center,
        width: mapUnits(zone.shape.width),
        height: mapUnits(zone.shape.height),
        cornerRadius: mapUnits(zone.shape.cornerRadius || 0)
      }
    };
  }

  return {
    ...zone,
    center,
    shape: {
      ...zone.shape,
      center,
      points: zone.shape.points.map(toWorldPoint)
    }
  };
}

function worldWidthToScene(value) {
  return value * SCENE_SCALE_X;
}

function worldHeightToScene(value) {
  return value * SCENE_SCALE_Y;
}

function clientToGamePoint(event) {
  const rect = elements.mapView.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return null;
  }

  const relativeX = event.clientX - rect.left;
  const relativeY = event.clientY - rect.top;
  const sceneX = (relativeX - state.mapTransform.x) / state.mapTransform.scale;
  const sceneY = (relativeY - state.mapTransform.y) / state.mapTransform.scale;

  if (
    !Number.isFinite(sceneX) ||
    !Number.isFinite(sceneY) ||
    sceneX < 0 ||
    sceneY < 0 ||
    sceneX > MAP_CONFIG.imageSize ||
    sceneY > MAP_CONFIG.imageSize
  ) {
    return null;
  }

  return sceneToPoint({ x: sceneX, y: sceneY });
}

function buildRouteGraph() {
  const nodes = new Map(ROUTE_DATA.nodes.map((node) => [node.id, node]));
  const adjacency = new Map();

  ROUTE_DATA.nodes.forEach((node) => {
    adjacency.set(node.id, []);
  });

  ROUTE_DATA.edges.forEach(([from, to]) => {
    const a = nodes.get(from);
    const b = nodes.get(to);
    if (!a || !b) {
      return;
    }

    const cost = distanceBetween(a, b);
    adjacency.get(from).push({ id: to, cost });
    adjacency.get(to).push({ id: from, cost });
  });

  return { nodes, adjacency };
}

function distanceBetween(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function pointInPolygon(point, polygon) {
  let inside = false;

  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index, index += 1) {
    const a = polygon[index];
    const b = polygon[previous];
    const intersects =
      a.y > point.y !== b.y > point.y &&
      point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

function orientation(a, b, c) {
  return (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
}

function onSegment(a, b, c) {
  return (
    Math.min(a.x, c.x) <= b.x &&
    b.x <= Math.max(a.x, c.x) &&
    Math.min(a.y, c.y) <= b.y &&
    b.y <= Math.max(a.y, c.y)
  );
}

function segmentsIntersect(a1, a2, b1, b2) {
  const o1 = orientation(a1, a2, b1);
  const o2 = orientation(a1, a2, b2);
  const o3 = orientation(b1, b2, a1);
  const o4 = orientation(b1, b2, a2);

  if (o1 === 0 && onSegment(a1, b1, a2)) {
    return true;
  }
  if (o2 === 0 && onSegment(a1, b2, a2)) {
    return true;
  }
  if (o3 === 0 && onSegment(b1, a1, b2)) {
    return true;
  }
  if (o4 === 0 && onSegment(b1, a2, b2)) {
    return true;
  }

  return (o1 > 0) !== (o2 > 0) && (o3 > 0) !== (o4 > 0);
}

function segmentBlocked(start, end) {
  return ROUTE_DATA.blockers.some((polygon) => {
    if (pointInPolygon(start, polygon) || pointInPolygon(end, polygon)) {
      return true;
    }

    for (let index = 0; index < polygon.length; index += 1) {
      const next = polygon[(index + 1) % polygon.length];
      if (segmentsIntersect(start, end, polygon[index], next)) {
        return true;
      }
    }

    return false;
  });
}

function visibleNodesFrom(point, limit = 4) {
  return ROUTE_DATA.nodes
    .map((node) => ({
      ...node,
      cost: distanceBetween(point, node)
    }))
    .filter((node) => !segmentBlocked(point, node))
    .sort((left, right) => left.cost - right.cost)
    .slice(0, limit);
}

function findRoute(start, end) {
  if (!segmentBlocked(start, end)) {
    return [start, end];
  }

  const tempNodes = new Map(routeGraph.nodes);
  const tempAdjacency = new Map(
    [...routeGraph.adjacency.entries()].map(([id, edges]) => [id, [...edges]])
  );

  tempNodes.set("__start__", start);
  tempNodes.set("__end__", end);
  tempAdjacency.set("__start__", []);
  tempAdjacency.set("__end__", []);

  const startLinks = visibleNodesFrom(start);
  const endLinks = visibleNodesFrom(end);

  if (!startLinks.length || !endLinks.length) {
    return [start, end];
  }

  startLinks.forEach((node) => {
    tempAdjacency.get("__start__").push({ id: node.id, cost: node.cost });
    tempAdjacency.get(node.id).push({ id: "__start__", cost: node.cost });
  });

  endLinks.forEach((node) => {
    tempAdjacency.get("__end__").push({ id: node.id, cost: node.cost });
    tempAdjacency.get(node.id).push({ id: "__end__", cost: node.cost });
  });

  const open = new Set(["__start__"]);
  const cameFrom = new Map();
  const gScore = new Map([["__start__", 0]]);
  const fScore = new Map([["__start__", distanceBetween(start, end)]]);

  while (open.size) {
    const current = [...open].reduce((best, candidate) => {
      if (best == null) {
        return candidate;
      }
      return (fScore.get(candidate) ?? Number.POSITIVE_INFINITY) <
        (fScore.get(best) ?? Number.POSITIVE_INFINITY)
        ? candidate
        : best;
    }, null);

    if (current === "__end__") {
      return smoothRoute(reconstructPath(cameFrom, current, tempNodes));
    }

    open.delete(current);
    const currentScore = gScore.get(current) ?? Number.POSITIVE_INFINITY;

    (tempAdjacency.get(current) ?? []).forEach((edge) => {
      const tentative = currentScore + edge.cost;
      if (tentative >= (gScore.get(edge.id) ?? Number.POSITIVE_INFINITY)) {
        return;
      }

      cameFrom.set(edge.id, current);
      gScore.set(edge.id, tentative);
      fScore.set(edge.id, tentative + distanceBetween(tempNodes.get(edge.id), end));
      open.add(edge.id);
    });
  }

  return [start, end];
}

function reconstructPath(cameFrom, current, nodes) {
  const path = [nodes.get(current)];
  let cursor = current;

  while (cameFrom.has(cursor)) {
    cursor = cameFrom.get(cursor);
    path.unshift(nodes.get(cursor));
  }

  return path;
}

function smoothRoute(points) {
  if (points.length <= 2) {
    return points;
  }

  const smoothed = [points[0]];
  let anchor = 0;

  while (anchor < points.length - 1) {
    let next = points.length - 1;
    while (next > anchor + 1 && segmentBlocked(points[anchor], points[next])) {
      next -= 1;
    }

    smoothed.push(points[next]);
    anchor = next;
  }

  return smoothed;
}

function parseTrackerNumber(value) {
  if (value == null) {
    return Number.NaN;
  }

  const raw = String(value).trim();
  if (!raw) {
    return Number.NaN;
  }

  const cleaned = raw.replace(/\s+/g, "").replace(/,(?=\d{3}\b)/g, "");
  const match = cleaned.match(/-?\d+(?:\.\d+)?/);
  if (!match) {
    return Number.NaN;
  }

  return Number(match[0]);
}

function parseCoordinateInput(value) {
  const matches = String(value || "").match(/-?\d+(?:\.\d+)?/g);
  if (!matches || matches.length < 2) {
    return null;
  }

  const x = Number(matches[0]);
  const y = Number(matches[1]);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null;
  }

  return { x, y };
}

function normalizeRouteCoordinate(value) {
  if (!Number.isFinite(value)) {
    return Number.NaN;
  }

  return Math.abs(value) < 2000 ? value * 1000 : value;
}

function normalizeTrackerPosition(rawX, rawY) {
  if (!Number.isFinite(rawX) || !Number.isFinite(rawY)) {
    return null;
  }

  if (rawX >= 0 && rawX <= 750 && rawY >= 0 && rawY <= 750) {
    return {
      x: MAP_CONFIG.minX + (rawX / 750) * (MAP_CONFIG.maxX - MAP_CONFIG.minX),
      y: MAP_CONFIG.maxY - (rawY / 750) * (MAP_CONFIG.maxY - MAP_CONFIG.minY)
    };
  }

  return {
    x: normalizeRouteCoordinate(rawX),
    y: normalizeRouteCoordinate(rawY)
  };
}

function updateExpandedZoom(multiplier, clientX, clientY) {
  const rect = elements.mapView.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return;
  }

  const oldTransform = { ...state.mapTransform };
  const relativeX = clientX - rect.left;
  const relativeY = clientY - rect.top;
  const anchorSceneX = (relativeX - oldTransform.x) / oldTransform.scale;
  const anchorSceneY = (relativeY - oldTransform.y) / oldTransform.scale;

  const nextZoom = clamp(state.expandedZoom * multiplier, 1, 6);
  state.expandedZoom = nextZoom;

  const containScale = Math.min(rect.width / MAP_CONFIG.imageSize, rect.height / MAP_CONFIG.imageSize);
  const nextScale = containScale * nextZoom;
  const nextBaseX = (rect.width - MAP_CONFIG.imageSize * nextScale) / 2;
  const nextBaseY = (rect.height - MAP_CONFIG.imageSize * nextScale) / 2;

  state.expandedPan.x = relativeX - anchorSceneX * nextScale - nextBaseX;
  state.expandedPan.y = relativeY - anchorSceneY * nextScale - nextBaseY;
  renderMap();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
