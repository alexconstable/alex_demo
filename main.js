const { app, BrowserWindow, globalShortcut, ipcMain, screen, shell } = require("electron");
const path = require("node:path");
const fs = require("node:fs/promises");
const { pathToFileURL } = require("node:url");

const HOTKEY = process.env.ISLE_OVERLAY_HOTKEY || "F8";
const HIDE_HOTKEY = process.env.ISLE_OVERLAY_HIDE_HOTKEY || "F9";
const SINGLE_INSTANCE_LOCK = app.requestSingleInstanceLock();
const DEBUG_DIR = path.join(__dirname, "tmp");
const BOSCH_DEBUG_PATH = path.join(DEBUG_DIR, "bosch-debug.json");
const APP_ICON_PATH = path.join(__dirname, "assets", "app-icon.ico");
const BOSCH_PRELOAD_PATH = path.join(__dirname, "webviews", "bosch-preload.js");
const BOSCH_TRACKER_URL = "https://bosch-island.com/map-tracker";
const BOSCH_HOME_URL = "https://bosch-island.com/";
const PARTY_API_ORIGIN =
  process.env.ISLE_OVERLAY_PARTY_API_ORIGIN || "https://reptarland-gateway-map.constvble.workers.dev";

const WINDOW_MODES = {
  compact: {
    width: 430,
    height: 712,
    minWidth: 390,
    minHeight: 640
  },
  expanded: {
    width: 1440,
    height: 920,
    minWidth: 1120,
    minHeight: 760
  }
};

let mainWindow = null;
let currentMode = "compact";

if (!SINGLE_INSTANCE_LOCK) {
  app.quit();
}

app.on("second-instance", () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (!mainWindow.isVisible()) {
      mainWindow.show();
    }
    mainWindow.focus();
    mainWindow.moveTop();
  }
});

app.on("web-contents-created", (_, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    if (/^https:\/\/(bosch-island\.com|steamcommunity\.com|store\.steampowered\.com|steam\.com|vulnona\.com)\b/i.test(url)) {
      return { action: "allow" };
    }

    shell.openExternal(url).catch(() => undefined);
    return { action: "deny" };
  });
});

function getWorkArea() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    return screen.getDisplayMatching(mainWindow.getBounds()).workArea;
  }

  return screen.getPrimaryDisplay().workArea;
}

function getBoundsForMode(mode) {
  const workArea = getWorkArea();
  const config = WINDOW_MODES[mode];

  if (mode === "compact") {
    return {
      width: config.width,
      height: config.height,
      x: workArea.x + workArea.width - config.width - 18,
      y: workArea.y + 18
    };
  }

  const width = Math.min(config.width, workArea.width - 72);
  const height = Math.min(config.height, workArea.height - 72);

  if (mode === "expanded") {
    return {
      width: Math.max(config.minWidth, workArea.width - 24),
      height: Math.max(config.minHeight, workArea.height - 24),
      x: workArea.x + 12,
      y: workArea.y + 12
    };
  }

  return {
    width,
    height,
    x: workArea.x + Math.round((workArea.width - width) / 2),
    y: workArea.y + Math.round((workArea.height - height) / 2)
  };
}

function broadcastOverlayState() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  mainWindow.webContents.send("overlay:state", {
    mode: currentMode,
    hotkey: HOTKEY,
    hideHotkey: HIDE_HOTKEY,
    visible: mainWindow.isVisible()
  });
}

function applyWindowMode(mode) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  currentMode = mode;
  const config = WINDOW_MODES[mode];
  const bounds = getBoundsForMode(mode);

  mainWindow.setMinimumSize(config.minWidth, config.minHeight);
  mainWindow.setBounds(bounds, true);
  mainWindow.setResizable(mode === "expanded");
  mainWindow.setAlwaysOnTop(true, "screen-saver");
  mainWindow.webContents.setZoomFactor(1);
  broadcastOverlayState();
}

function toggleWindowMode() {
  applyWindowMode(currentMode === "compact" ? "expanded" : "compact");
}

function toggleVisibility() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    mainWindow.show();
    mainWindow.focus();
    mainWindow.moveTop();
  }

  broadcastOverlayState();
}

async function requestPartyApi(pathname, options = {}) {
  const target = new URL(pathname, PARTY_API_ORIGIN);
  const response = await fetch(target, {
    method: options.method || "GET",
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.error || `Party request failed with ${response.status}.`);
  }

  return payload;
}

function createMainWindow() {
  const compactBounds = getBoundsForMode("compact");

  mainWindow = new BrowserWindow({
    ...compactBounds,
    show: false,
    icon: APP_ICON_PATH,
    frame: false,
    transparent: true,
    hasShadow: false,
    backgroundColor: "#00000000",
    alwaysOnTop: true,
    skipTaskbar: true,
    fullscreenable: false,
    resizable: false,
    title: "The Isle Bosch Overlay",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webviewTag: true,
      spellcheck: false
    }
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.setAlwaysOnTop(true, "screen-saver");
  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    applyWindowMode(currentMode);
    broadcastOverlayState();
  });

  mainWindow.webContents.on("before-input-event", (_, input) => {
    if (input.type === "keyDown" && input.key === "Escape" && currentMode === "expanded") {
      applyWindowMode("compact");
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function registerShortcuts() {
  globalShortcut.register(HOTKEY, () => {
    toggleWindowMode();
  });

  globalShortcut.register(HIDE_HOTKEY, () => {
    toggleVisibility();
  });
}

app.whenReady().then(() => {
  if (!SINGLE_INSTANCE_LOCK) {
    return;
  }

  createMainWindow();
  registerShortcuts();

  ipcMain.handle("overlay:get-info", () => ({
    mode: currentMode,
    hotkey: HOTKEY,
    hideHotkey: HIDE_HOTKEY,
    visible: mainWindow?.isVisible() ?? false
  }));

  ipcMain.handle("overlay:get-resources", () => ({
    boschPreloadUrl: pathToFileURL(BOSCH_PRELOAD_PATH).toString(),
    boschTrackerUrl: BOSCH_TRACKER_URL,
    boschHomeUrl: BOSCH_HOME_URL
  }));

  ipcMain.handle("overlay:toggle-mode", () => {
    toggleWindowMode();
    return { mode: currentMode };
  });

  ipcMain.handle("overlay:toggle-visibility", () => {
    toggleVisibility();
    return { visible: mainWindow?.isVisible() ?? false };
  });

  ipcMain.handle("overlay:quit", () => {
    app.quit();
    return { ok: true };
  });

  ipcMain.handle("overlay:set-mode", (_, mode) => {
    if (mode === "compact" || mode === "expanded") {
      applyWindowMode(mode);
    }

    return { mode: currentMode };
  });

  ipcMain.handle("overlay:write-debug-snapshot", async (_, payload) => {
    try {
      await fs.mkdir(DEBUG_DIR, { recursive: true });
      await fs.writeFile(
        BOSCH_DEBUG_PATH,
        JSON.stringify(
          {
            capturedAt: new Date().toISOString(),
            payload
          },
          null,
          2
        ),
        "utf8"
      );
      return { ok: true, path: BOSCH_DEBUG_PATH };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  });

  ipcMain.handle("party:request", async (_, request) => {
    const method = typeof request?.method === "string" ? request.method.toUpperCase() : "GET";
    const pathname = typeof request?.pathname === "string" ? request.pathname : "/";
    return requestPartyApi(pathname, {
      method,
      body: request?.body
    });
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  app.quit();
});
