const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  openAudioConvertFolderFromClient: {
    send: () => ipcRenderer.send("openAudioConvertFolderFromClient"),
    on: (handler) => ipcRenderer.on("openAudioConvertFolderFromClient", handler),
    off: (chanelName = null) => ipcRenderer.removeAllListeners("openAudioConvertFolderFromClient")
  },
  audioConvertFromServer: {
    send: (data) => ipcRenderer.send("audioConvertFromServer", data),
    on: (handler) => ipcRenderer.on("audioConvertFromServer", handler),
    off: (chanelName = null) => ipcRenderer.removeAllListeners("audioConvertFromServer")
  },
  audioConvertFromClient: {
    send: (data) => ipcRenderer.send("audioConvertFromClient", data),
    on: (handler) => ipcRenderer.on("audioConvertFromClient", handler),
    off: (chanelName = null) => ipcRenderer.removeAllListeners("audioConvertFromClient")
  },
  ytDownloadFromClient: {
    send: (url, downloadType, sourcUrl, videoLength) => ipcRenderer.send("ytDownloadFromClient", url, downloadType, sourcUrl, videoLength),
    on: (handler) => ipcRenderer.on("ytDownloadFromClient", handler),
    off: (chanelName = null) => ipcRenderer.removeAllListeners("ytDownloadFromClient")
  },
  ytDownloadFromServer: {
    send: (progress, videoLength) => ipcRenderer.send("ytDownloadFromServer", progress, videoLength),
    on: (handler) => ipcRenderer.on("ytDownloadFromServer", handler),
    off: (chanelName = null) => ipcRenderer.removeAllListeners("ytDownloadFromServer"),
  },
  ytInfoFromClient: {
    send: (url) => ipcRenderer.send("ytInfoFromClient", url),
    on: (handler) => ipcRenderer.on("ytInfoFromClient", handler),
    off: (chanelName = null) => ipcRenderer.removeAllListeners("ytInfoFromClient"),
  },
  ytInfoFromServer: {
    send: (payload) => ipcRenderer.send("ytInfoFromServer", payload),
    on: (handler) => ipcRenderer.on("ytInfoFromServer", handler),
    off: (chanelName = null) => ipcRenderer.removeAllListeners("ytInfoFromServer"),
  },
  ytHotFromClient: {
    send: () => ipcRenderer.send("ytHotFromClient"),
    on: (handler) => ipcRenderer.on("ytHotFromClient", handler),
    off: (chanelName = null) => ipcRenderer.removeAllListeners("ytHotFromClient"),
  },
  ytHotFromServer: {
    send: (payload) => ipcRenderer.send("ytHotFromServer", payload),
    on: (handler) => ipcRenderer.on("ytHotFromServer", handler),
    off: (chanelName = null) => ipcRenderer.removeAllListeners("ytHotFromServer"),
  },
});