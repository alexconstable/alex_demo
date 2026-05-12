const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("primeTracker", {
  getInfo: () => ipcRenderer.invoke("overlay:get-info"),
  setMode: (mode) => ipcRenderer.invoke("overlay:set-mode", mode),
  toggleMode: () => ipcRenderer.invoke("overlay:toggle-mode"),
  toggleVisibility: () => ipcRenderer.invoke("overlay:toggle-visibility"),
  quit: () => ipcRenderer.invoke("overlay:quit"),
  loadRuns: () => ipcRenderer.invoke("runs:load"),
  saveRuns: (runs) => ipcRenderer.invoke("runs:save", runs),
  onStateChange: (callback) => {
    if (typeof callback !== "function") {
      return () => {};
    }
    const listener = (_, state) => callback(state);
    ipcRenderer.on("overlay:state", listener);
    return () => ipcRenderer.removeListener("overlay:state", listener);
  }
});
