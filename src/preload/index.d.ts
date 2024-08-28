import { ElectronAPI } from "@electron-toolkit/preload";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: unknown;
    electronAPI: {
      getMacAddress: () => Promise;
      readToken: () => Promise
      saveToken: (token: string) => void;
      deleteToken: () => boolean;
      resetApp: () => void
    };
  }
}
