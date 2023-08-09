const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
  // we can also expose variables, not just functions
});

contextBridge.exposeInMainWorld("ipcAPI", {
  saveSettings: (settings) => ipcRenderer.invoke("saveSettings", settings),
  loadSettings: () => ipcRenderer.invoke("loadSettings"),
  fetchData: (url) => ipcRenderer.invoke("fetchData", url),
});
