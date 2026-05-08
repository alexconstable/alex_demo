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

const VULNONA_CSS = `
html, body {
  background: transparent !important;
  overflow: hidden !important;
}

body {
  margin: 0 !important;
}

header,
aside#side,
footer#footer,
#side_open,
#readme,
#mapcode_help_text,
#info,
#hud,
#name_list,
#icon_GroupDino,
#icon_MyDino,
#icon_PhotoPin,
.grecaptcha-badge {
  display: none !important;
}

main#map {
  position: fixed !important;
  inset: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
  background: transparent !important;
}

#base1,
#base2,
#base3,
#basemap,
#svg,
#marker {
  width: 100% !important;
  height: 100% !important;
}

#basemap {
  filter: saturate(1.04) contrast(1.02) brightness(1.02) !important;
}

#marker,
#svg {
  pointer-events: none !important;
}

#isle-route-layer {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  overflow: visible !important;
  pointer-events: none !important;
  z-index: 40 !important;
}

#isle-route-layer .route-shadow {
  fill: none;
  stroke: rgba(4, 8, 14, 0.72);
  stroke-width: 18;
  stroke-linecap: round;
  stroke-linejoin: round;
}

#isle-route-layer .route-line {
  fill: none;
  stroke: rgba(110, 226, 150, 0.95);
  stroke-width: 10;
  stroke-linecap: round;
  stroke-linejoin: round;
}

#isle-route-layer .route-pin {
  fill: rgba(255, 199, 136, 0.98);
  stroke: rgba(255, 255, 255, 0.96);
  stroke-width: 5;
}

#isle-route-layer .route-player {
  fill: rgba(121, 255, 171, 1);
  stroke: rgba(255, 255, 255, 0.96);
  stroke-width: 5;
}
`;

const VULNONA_SCRIPT = `
(() => {
  const ROUTE_DATA = ${JSON.stringify(ROUTE_DATA)};
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const trigger = (element, type) => {
    if (!element) {
      return;
    }
    element.dispatchEvent(new Event(type, { bubbles: true }));
  };

  const setCheckbox = (id, checked) => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }
    if (element.checked !== checked) {
      element.checked = checked;
      trigger(element, "change");
    }
  };

  const setInput = (id, value, type = "input") => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }
    if (String(element.value) !== String(value)) {
      element.value = value;
      trigger(element, type);
    }
  };

  const selectGateway = () => {
    const radios = [...document.querySelectorAll('input[name="map_list"]')];
    const target = radios.find((radio) => {
      const label = document.querySelector('label[for="' + radio.id + '"]');
      const text = [radio.value || "", label?.innerText || ""].join(" ").toLowerCase();
      return text.includes("gateway");
    });

    if (!target) {
      return false;
    }

    target.checked = true;
    trigger(target, "change");
    return true;
  };

  const applyMinimalConfig = () => {
    setCheckbox("cfg_area_map", false);
    setCheckbox("cfg_area_name", false);
    setCheckbox("cfg_area_user", false);
    setCheckbox("cfg_water", true);
    setCheckbox("cfg_water_name", false);
    setCheckbox("cfg_water_coord", false);
    setCheckbox("cfg_land", false);
    setCheckbox("cfg_land_name", false);
    setCheckbox("cfg_land_coord", false);
    setCheckbox("cfg_road", false);
    setCheckbox("cfg_road_name", false);
    setCheckbox("cfg_cave", false);
    setCheckbox("cfg_sky", false);
    setCheckbox("cfg_danger", false);
    setCheckbox("cfg_saferock", false);
    setCheckbox("cfg_grid_coord", false);
    setCheckbox("cfg_grid_compass", false);
    setCheckbox("cfg_grid_line", false);
    setCheckbox("cfg_icon_PhotoPin", false);
    setCheckbox("cfg_icon_all", false);
    setCheckbox("cfg_map_quickmove", true);

    setInput("cfg_map_zoom", "1.6");
    setInput("cfg_map_level", "0");
    setInput("cfg_map_rot", "0");
    setInput("cfg_map_tilt", "0");
    setInput("cfg_map_bga", "1");

    if (window.$map?.move?.rotate) {
      window.$map.move.rotate(null);
    }
  };

  const centerDefaultView = () => {
    const startX = window.$map?.dat?.now?.cfg?.start_X;
    const startY = window.$map?.dat?.now?.cfg?.start_Y;

    if (Number.isFinite(startX) && Number.isFinite(startY) && window.$map?.move?.to) {
      window.$map.move.to({
        x: startX,
        y: startY,
        ig: 1,
        center: 1,
        save: 0
      });
      return true;
    }

    return false;
  };

  const overlayState = {
    current: null,
    pinned: null
  };

  const routeGraph = buildRouteGraph();
  const DEG_TO_RAD = Math.PI / 180;

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

  function ensureRouteLayer() {
    const base = document.getElementById("base3");
    if (!base) {
      return null;
    }

    let layer = document.getElementById("isle-route-layer");
    if (layer) {
      return layer;
    }

    layer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    layer.setAttribute("id", "isle-route-layer");
    layer.setAttribute("viewBox", "0 0 " + (base.clientWidth || 1) + " " + (base.clientHeight || 1));
    layer.innerHTML =
      '<polyline class="route-shadow"></polyline>' +
      '<polyline class="route-line"></polyline>' +
      '<circle class="route-player" r="13"></circle>' +
      '<circle class="route-pin" r="13"></circle>';
    base.appendChild(layer);
    return layer;
  }

  function updateRouteViewBox() {
    const layer = ensureRouteLayer();
    const base = document.getElementById("base3");
    if (!layer || !base) {
      return;
    }

    layer.setAttribute("viewBox", "0 0 " + (base.clientWidth || 1) + " " + (base.clientHeight || 1));
  }

  function distanceBetween(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function gameToMapPoint(point) {
    const result = window.$map?.calc?.game2map?.([[point.x, point.y]], "pos");
    if (!result) {
      return null;
    }

    return {
      x: Number(result[0]),
      y: Number(result[1])
    };
  }

  function clientToGamePoint(event) {
    const moveData = window.$map?.move?.dat;
    if (!moveData || !window.$map?.calc?.map2game) {
      return null;
    }

    const mapX = event.clientX - moveData.areaOffset.x - moveData.mapPos.x;
    const mapY = event.clientY - moveData.areaOffset.y - moveData.mapPos.y;
    const radians = -(moveData.rot || 0) * DEG_TO_RAD;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const unrotated = {
      x: mapX * cos - mapY * sin,
      y: mapX * sin + mapY * cos
    };

    const point = window.$map.calc.map2game([unrotated.x, unrotated.y]);
    if (!point || !Number.isFinite(point[0]) || !Number.isFinite(point[1])) {
      return null;
    }

    return {
      x: point[0],
      y: point[1]
    };
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
        const route = reconstructPath(cameFrom, current, tempNodes);
        return smoothRoute(route);
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

  function drawRoute() {
    const layer = ensureRouteLayer();
    if (!layer) {
      return;
    }

    updateRouteViewBox();

    const shadow = layer.querySelector(".route-shadow");
    const line = layer.querySelector(".route-line");
    const player = layer.querySelector(".route-player");
    const pin = layer.querySelector(".route-pin");

    if (!overlayState.current || !overlayState.pinned) {
      shadow.setAttribute("points", "");
      line.setAttribute("points", "");
      player.setAttribute("visibility", overlayState.current ? "visible" : "hidden");
      pin.setAttribute("visibility", overlayState.pinned ? "visible" : "hidden");

      if (overlayState.current) {
        const playerPoint = gameToMapPoint(overlayState.current);
        if (playerPoint) {
          player.setAttribute("cx", playerPoint.x);
          player.setAttribute("cy", playerPoint.y);
        }
      }

      if (overlayState.pinned) {
        const pinPoint = gameToMapPoint(overlayState.pinned);
        if (pinPoint) {
          pin.setAttribute("cx", pinPoint.x);
          pin.setAttribute("cy", pinPoint.y);
        }
      }

      return;
    }

    const route = findRoute(overlayState.current, overlayState.pinned)
      .map((point) => gameToMapPoint(point))
      .filter(Boolean);

    const points = route.map((point) => point.x + "," + point.y).join(" ");
    shadow.setAttribute("points", points);
    line.setAttribute("points", points);

    const playerPoint = route[0];
    const pinPoint = route[route.length - 1];

    player.setAttribute("visibility", playerPoint ? "visible" : "hidden");
    pin.setAttribute("visibility", pinPoint ? "visible" : "hidden");

    if (playerPoint) {
      player.setAttribute("cx", playerPoint.x);
      player.setAttribute("cy", playerPoint.y);
    }

    if (pinPoint) {
      pin.setAttribute("cx", pinPoint.x);
      pin.setAttribute("cy", pinPoint.y);
    }
  }

  function wireRouteClicks() {
    const map = document.getElementById("map");
    if (!map || map.dataset.isleRouteBound === "1") {
      return;
    }

    map.dataset.isleRouteBound = "1";
    map.addEventListener("click", (event) => {
      const point = clientToGamePoint(event);
      if (!point) {
        return;
      }

      overlayState.pinned = point;
      drawRoute();
    });

    map.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      overlayState.pinned = null;
      drawRoute();
    });

    window.addEventListener("resize", () => {
      updateRouteViewBox();
      drawRoute();
    });
  }

  window.__isleOverlayVulnona = {
    async init() {
      for (let index = 0; index < 80; index += 1) {
        if (selectGateway()) {
          break;
        }
        await sleep(150);
      }

      applyMinimalConfig();
      await sleep(200);
      centerDefaultView();
      await sleep(150);
      wireRouteClicks();
      drawRoute();
      return true;
    },
    setCurrentPosition(x, y) {
      overlayState.current = { x, y };
      drawRoute();
      return true;
    },
    clearRoute() {
      overlayState.pinned = null;
      drawRoute();
      return true;
    },
    plot(locationText) {
      const input = document.getElementById("current_pos");
      if (!input) {
        return false;
      }

      input.value = locationText;
      if (window.$map?.location?.parse) {
        window.$map.location.parse(locationText, { noerr: 1 });
        return true;
      }

      const submit = document.getElementById("current_pos_submit");
      if (submit) {
        submit.click();
        return true;
      }

      return false;
    }
  };

  return window.__isleOverlayVulnona.init();
})()
`;

const elements = {
  body: document.body,
  mapView: document.getElementById("map-view"),
  boschView: document.getElementById("bosch-view"),
  boschSheet: document.getElementById("bosch-sheet"),
  closeBoschSheet: document.getElementById("close-bosch-sheet"),
  connectBoschButton: document.getElementById("connect-bosch-button"),
  reloadBoschButton: document.getElementById("reload-bosch-button"),
  hideOverlayButton: document.getElementById("hide-overlay-button"),
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
  altitudeValue: document.getElementById("altitude-value")
};

const state = {
  overlayMode: "compact",
  vulnonaReady: false,
  lastPlotted: null,
  lastSnapshot: null
};

init().catch((error) => {
  console.error(error);
  elements.statusValue.textContent = "Error";
  elements.helperCopy.textContent = error instanceof Error ? error.message : String(error);
});

async function init() {
  wireButtons();
  wireOverlayBridge();
  wireMapView();
  wireBoschView();
  updateModeUi("compact");
}

function wireButtons() {
  elements.toggleModeButton.addEventListener("click", async () => {
    await window.isleOverlay.toggleMode();
  });

  elements.hideOverlayButton.addEventListener("click", async () => {
    await window.isleOverlay.toggleVisibility();
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
  elements.mapView.addEventListener("dom-ready", async () => {
    try {
      await elements.mapView.insertCSS(VULNONA_CSS);
      await elements.mapView.executeJavaScript(VULNONA_SCRIPT, true);
      state.vulnonaReady = true;
      if (state.lastSnapshot) {
        await syncTrackerToMap(state.lastSnapshot);
      }
    } catch (error) {
      console.error("Failed to initialize Vulnona view", error);
      state.vulnonaReady = false;
    }
  });
}

function wireBoschView() {
  elements.boschView.addEventListener("ipc-message", async (event) => {
    if (event.channel !== "bosch:update" || !event.args.length) {
      return;
    }

    const snapshot = event.args[0];
    state.lastSnapshot = snapshot;
    updateHud(snapshot);

    if (snapshot.pageState === "live" || snapshot.pageState === "tracker") {
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
}

function updateHud(snapshot) {
  const fields = snapshot?.fields || {};
  const pageState = snapshot?.pageState || "waiting";
  const live = pageState === "live" || pageState === "tracker";

  elements.modeDot.classList.toggle("live", live);
  elements.connectionLabel.textContent = getConnectionLabel(pageState, fields.status);
  elements.statusValue.textContent = fields.status || getFallbackStatus(pageState);
  elements.updatedValue.textContent = fields.lastUpdated || "--";
  elements.serverValue.textContent = fields.server || "--";
  elements.mapXValue.textContent = fields.mapX || "--";
  elements.mapYValue.textContent = fields.mapY || "--";
  elements.altitudeValue.textContent = fields.altitude || "--";

  if (pageState === "auth-required") {
    elements.helperCopy.textContent = "Open Connect Bosch, sign in with Steam, then leave the Bosch panel open until your live tracker values appear.";
  } else if (live) {
    elements.helperCopy.textContent = "Bosch is live. Click the map to pin a destination route, and right-click the map to clear it.";
  } else if (pageState === "challenge") {
    elements.helperCopy.textContent = "Bosch is passing Cloudflare's browser check. Give it a moment, then open Connect Bosch if it still needs attention.";
  } else {
    elements.helperCopy.textContent = "The overlay will follow Bosch Island after you sign in once with Steam. F8 toggles fullscreen, F9 hides the overlay, and map clicks place a route pin.";
  }
}

function getConnectionLabel(pageState, status) {
  if (pageState === "live" || pageState === "tracker") {
    return "Bosch live";
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
  if (!state.vulnonaReady) {
    return;
  }

  const currentX = normalizeRouteCoordinate(parseTrackerNumber(snapshot?.fields?.mapX));
  const currentY = normalizeRouteCoordinate(parseTrackerNumber(snapshot?.fields?.mapY));
  const coordinateText = buildCoordinateText(snapshot?.fields);
  try {
    if (Number.isFinite(currentX) && Number.isFinite(currentY)) {
      await elements.mapView.executeJavaScript(
        `window.__isleOverlayVulnona?.setCurrentPosition(${currentX}, ${currentY})`,
        true
      );
    }

    if (!coordinateText || coordinateText === state.lastPlotted) {
      return;
    }

    state.lastPlotted = coordinateText;
    await elements.mapView.executeJavaScript(
      `window.__isleOverlayVulnona?.plot(${JSON.stringify(coordinateText)})`,
      true
    );
  } catch (error) {
    console.error("Failed to sync tracker coordinates", error);
  }
}

function buildCoordinateText(fields) {
  const x = parseTrackerNumber(fields?.mapX);
  const y = parseTrackerNumber(fields?.mapY);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null;
  }

  const altitude = parseTrackerNumber(fields?.altitude);
  const xText = formatTrackerNumber(x);
  const yText = formatTrackerNumber(y);

  if (Number.isFinite(altitude) && (Math.abs(x) > 1000 || Math.abs(y) > 1000 || Math.abs(altitude) > 1000)) {
    return `${xText}, ${yText}, ${formatTrackerNumber(altitude)}`;
  }

  return `${xText}, ${yText}`;
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

function formatTrackerNumber(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/\.?0+$/, "");
}

function normalizeRouteCoordinate(value) {
  if (!Number.isFinite(value)) {
    return Number.NaN;
  }

  return Math.abs(value) < 2000 ? value * 1000 : value;
}
