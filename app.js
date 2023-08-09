const electron = require("electron");
const { app, ipcMain, Menu, Tray } = electron;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const axios = require("axios");
const Store = require("electron-store");

// Initialize storage
const store = new Store();

// Check if process arguments contains dev flag
process.argv.forEach((val) => {
  if (val === "--dev") {
    process.env.NODE_ENV = "DEV";
  }
});

let url;
if (process.env.NODE_ENV === "DEV") {
  console.log("Running in development mode");
  url = "http://localhost:8080/";
} else {
  url = `file://${process.cwd()}/dist/index.html`;
}

// Initialize tray
let tray = null;

app.on("ready", () => {
  ipcMain.handle("saveSettings", (event, settings) => {
    console.log(settings);
    store.set('settings', settings);
  });
  ipcMain.handle("loadSettings", async () => {
    const settings = await store.get('settings');
    return settings;
  });
  ipcMain.handle("fetchData", async (event, url) => {
    console.log(url);
    const response = await axios.get(url);
    const data = response.data[0];
    return JSON.stringify(data);
  });
  let window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      enableRemoteModule: true,
    },
  });
  window.ipcRenderer = electron.ipcRenderer;
  window.removeMenu();
  window.loadURL(url);
  window.webContents.openDevTools()
  // Register tray
  tray = new Tray('src/assets/logo.png');
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show window', type: 'normal', click: () => window.show() },
    { label: 'Restart server', type: 'normal', click: () => { /* Todo: pass command to server service */ } },
    { label: 'Quit', type: 'normal', click: () => app.quit() }
  ]);
  tray.setToolTip('OSC controller');
  tray.setContextMenu(contextMenu);
  // Hide window when minimized
  window.on("minimize", (event) => {
    event.preventDefault();
    window.hide();
    // Show tray notification
    tray.displayBalloon({
      title: 'OSC controller',
      content: 'Application is running in background',
      icon: 'src/assets/logo.png'
    });
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
