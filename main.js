const { app, BrowserWindow, globalShortcut, ipcMain, screen, shell } = require("electron");
const path = require("node:path");
const fs = require("node:fs/promises");
const { pathToFileURL } = require("node:url");

const HOTKEY = process.env.ISLE_OVERLAY_HOTKEY || "F8";
const HIDE_HOTKEY = process.env.ISLE_OVERLAY_HIDE_HOTKEY || "F9";
const SINGLE_INSTANCE_LOCK = app.requestSingleInstanceLock();
const DEBUG_DIR = "debug";
const BOSCH_DEBUG_FILE = "bosch-debug.json";
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
let boschLoginWindow = null;
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

  mainWindow.setIgnoreMouseEvents(false);
  mainWindow.setFocusable(true);
  mainWindow.setMinimumSize(config.minWidth, config.minHeight);
  mainWindow.setBounds(bounds, true);
  mainWindow.setResizable(mode === "expanded");
  mainWindow.setAlwaysOnTop(true, "screen-saver");
  if (mode === "expanded") {
    mainWindow.focus();
    mainWindow.moveTop();
  }
  mainWindow.webContents.setZoomFactor(1);
  broadcastOverlayState();
}

function openBoschLoginWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return { mode: currentMode };
  }

  const workArea = getWorkArea();
  if (boschLoginWindow && !boschLoginWindow.isDestroyed()) {
    boschLoginWindow.show();
    boschLoginWindow.focus();
    boschLoginWindow.moveTop();
    return {
      mode: currentMode,
      bounds: boschLoginWindow.getBounds()
    };
  }

  boschLoginWindow = new BrowserWindow({
    x: workArea.x,
    y: workArea.y,
    width: workArea.width,
    height: workArea.height,
    minWidth: Math.min(1100, workArea.width),
    minHeight: Math.min(760, workArea.height),
    show: false,
    icon: APP_ICON_PATH,
    title: "Connect Bosch Island",
    backgroundColor: "#09111b",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      partition: "persist:isle-bosch",
      spellcheck: false
    }
  });

  boschLoginWindow.setMenuBarVisibility(false);
  boschLoginWindow.setAlwaysOnTop(true, "screen-saver");
  boschLoginWindow.webContents.setZoomFactor(0.95);
  boschLoginWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https:\/\/(bosch-island\.com|steamcommunity\.com|store\.steampowered\.com|steam\.com)\b/i.test(url)) {
      boschLoginWindow.loadURL(url);
      return { action: "deny" };
    }

    shell.openExternal(url).catch(() => undefined);
    return { action: "deny" };
  });

  boschLoginWindow.once("ready-to-show", () => {
    if (!boschLoginWindow || boschLoginWindow.isDestroyed()) {
      return;
    }

    boschLoginWindow.show();
    boschLoginWindow.focus();
    boschLoginWindow.moveTop();
  });

  boschLoginWindow.on("closed", () => {
    boschLoginWindow = null;
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("overlay:bosch-login-closed");
    }
  });

  boschLoginWindow.loadURL(BOSCH_TRACKER_URL);

  return {
    mode: currentMode,
    bounds: boschLoginWindow.getBounds()
  };
}

function closeBoschLoginWindow() {
  if (boschLoginWindow && !boschLoginWindow.isDestroyed()) {
    boschLoginWindow.close();
  }

  return { ok: true };
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

  ipcMain.handle("overlay:open-bosch-login", () => openBoschLoginWindow());
  ipcMain.handle("overlay:close-bosch-login", () => closeBoschLoginWindow());

  ipcMain.handle("overlay:write-debug-snapshot", async (_, payload) => {
    try {
      const debugDir = path.join(app.getPath("userData"), DEBUG_DIR);
      const debugPath = path.join(debugDir, BOSCH_DEBUG_FILE);
      await fs.mkdir(debugDir, { recursive: true });
      await fs.writeFile(
        debugPath,
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
      return { ok: true, path: debugPath };
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
