const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");
const fs = require("node:fs/promises");
const path = require("node:path");

const HOTKEY = process.env.PRIME_TRACKER_HOTKEY || "F6";
const HIDE_HOTKEY = process.env.PRIME_TRACKER_HIDE_HOTKEY || "F7";
const COMPACT_HOTKEY = process.env.PRIME_TRACKER_COMPACT_HOTKEY || "";
const CLOSE_HOTKEY = process.env.PRIME_TRACKER_CLOSE_HOTKEY || "";
const APP_ICON_PATH = path.join(__dirname, "assets", "prime-tracker.ico");
const RUNS_FILE_NAME = "prime-tracker-runs.json";

const WINDOW_MODES = {
  compact: { width: 386, height: 880, minWidth: 340, minHeight: 720 },
  expanded: { width: 960, height: 720, minWidth: 760, minHeight: 620 }
};

let mainWindow = null;
let currentMode = "compact";

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.on("second-instance", () => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }
  mainWindow.show();
  mainWindow.focus();
  mainWindow.moveTop();
});

function getBoundsForMode(mode) {
  const { screen } = require("electron");
  const workArea = screen.getPrimaryDisplay().workArea;
  const config = WINDOW_MODES[mode];

  if (mode === "compact") {
    return {
      width: config.width,
      height: config.height,
      x: workArea.x + 18,
      y: workArea.y + 18
    };
  }

  return {
    width: Math.min(config.width, workArea.width - 48),
    height: Math.min(config.height, workArea.height - 48),
    x: workArea.x + Math.round((workArea.width - Math.min(config.width, workArea.width - 48)) / 2),
    y: workArea.y + Math.round((workArea.height - Math.min(config.height, workArea.height - 48)) / 2)
  };
}

function broadcastState() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }
  mainWindow.webContents.send("overlay:state", {
    mode: currentMode,
    hotkey: HOTKEY,
    hideHotkey: HIDE_HOTKEY,
    compactHotkey: COMPACT_HOTKEY,
    closeHotkey: CLOSE_HOTKEY,
    visible: mainWindow.isVisible()
  });
}

function applyMode(mode) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  const previousBounds = mainWindow.getBounds();
  currentMode = mode;
  const config = WINDOW_MODES[mode];
  mainWindow.setMinimumSize(config.minWidth, config.minHeight);
  const nextBounds = {
    ...getBoundsForMode(mode),
    x: previousBounds.x,
    y: previousBounds.y
  };
  mainWindow.setBounds(nextBounds, true);
  mainWindow.setResizable(mode === "expanded");
  mainWindow.setAlwaysOnTop(true, "screen-saver");
  broadcastState();
}

function toggleMode() {
  applyMode(currentMode === "compact" ? "expanded" : "compact");
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
  broadcastState();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    ...getBoundsForMode("compact"),
    show: false,
    frame: false,
    transparent: true,
    hasShadow: false,
    icon: APP_ICON_PATH,
    backgroundColor: "#00000000",
    alwaysOnTop: true,
    skipTaskbar: true,
    title: "The Isle Prime Tracker",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webviewTag: false,
      spellcheck: false
    }
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    applyMode("compact");
  });
  mainWindow.webContents.on("before-input-event", (_, input) => {
    if (input.type === "keyDown" && input.key === "Escape" && currentMode === "expanded") {
      applyMode("compact");
    }
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function getRunsFilePath() {
  return path.join(app.getPath("userData"), RUNS_FILE_NAME);
}

async function loadRunsFromDisk() {
  try {
    const raw = await fs.readFile(getRunsFilePath(), "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return null;
    }
    console.error("Failed to load Prime Tracker runs:", error);
    return null;
  }
}

async function saveRunsToDisk(runs) {
  const filePath = getRunsFilePath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(runs, null, 2), "utf8");
  return { ok: true, path: filePath };
}

app.whenReady().then(() => {
  createWindow();
  globalShortcut.register(HOTKEY, toggleMode);
  globalShortcut.register(HIDE_HOTKEY, toggleVisibility);
  if (COMPACT_HOTKEY) {
    globalShortcut.register(COMPACT_HOTKEY, () => applyMode("compact"));
  }
  if (CLOSE_HOTKEY) {
    globalShortcut.register(CLOSE_HOTKEY, () => app.quit());
  }

  ipcMain.handle("overlay:get-info", () => ({
    mode: currentMode,
    hotkey: HOTKEY,
    hideHotkey: HIDE_HOTKEY,
    compactHotkey: COMPACT_HOTKEY,
    closeHotkey: CLOSE_HOTKEY,
    visible: mainWindow?.isVisible() ?? false
  }));

  ipcMain.handle("runs:load", () => loadRunsFromDisk());

  ipcMain.handle("runs:save", (_, runs) => saveRunsToDisk(runs));

  ipcMain.handle("overlay:set-mode", (_, mode) => {
    if (mode === "compact" || mode === "expanded") {
      applyMode(mode);
    }
    return { mode: currentMode };
  });

  ipcMain.handle("overlay:toggle-mode", () => {
    toggleMode();
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
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  app.quit();
});
