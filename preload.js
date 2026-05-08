const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("isleOverlay", {
  getInfo: () => ipcRenderer.invoke("overlay:get-info"),
  getResources: () => ipcRenderer.invoke("overlay:get-resources"),
  toggleMode: () => ipcRenderer.invoke("overlay:toggle-mode"),
  toggleVisibility: () => ipcRenderer.invoke("overlay:toggle-visibility"),
  quit: () => ipcRenderer.invoke("overlay:quit"),
  setMode: (mode) => ipcRenderer.invoke("overlay:set-mode", mode),
  writeDebugSnapshot: (payload) => ipcRenderer.invoke("overlay:write-debug-snapshot", payload),
  partyRequest: (request) => ipcRenderer.invoke("party:request", request),
  onStateChange: (callback) => {
    if (typeof callback !== "function") {
      return () => {};
    }

    const listener = (_, state) => callback(state);
    ipcRenderer.on("overlay:state", listener);
    return () => {
      ipcRenderer.removeListener("overlay:state", listener);
    };
  }
});
