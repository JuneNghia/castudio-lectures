import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Custom APIs for renderer
const api = {};

contextBridge.exposeInMainWorld("electronAPI", {
  getMacAddress: () => ipcRenderer.invoke("get-mac-address"),
  saveToken: (token: string) => ipcRenderer.invoke("save-token", token),
  readToken: async () => await ipcRenderer.invoke("read-token"),
  deleteToken: () => ipcRenderer.invoke("delete-token"),
  resetApp: () => ipcRenderer.invoke("reset-app"),
  getVersion: async () => await ipcRenderer.invoke("get-version"),
});

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
    
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
