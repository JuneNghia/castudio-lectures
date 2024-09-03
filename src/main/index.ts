import { app, shell, BrowserWindow, ipcMain, dialog } from "electron";
import path, { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import os from "os";
import fs from "fs";
import { autoUpdater } from "electron-updater";

const tokenFilePath = path.join(app.getPath("userData"), "jwtToken.json");
const gotTheLock = app.requestSingleInstanceLock();
let checkScreenRecorderInterval: NodeJS.Timeout | null = null;

autoUpdater.setFeedURL({
  provider: "github",
  private: true,
  owner: "junenghia",
  repo: "castudio-lib",
  token: process.env.GH_TOKEN,
});

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1158,
    height: 711,
    show: false,
    autoHideMenuBar: true,
    center: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      devTools: true,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.setContentProtection(true);

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

if (!gotTheLock) {
  app.quit();
} else {
  app.whenReady().then(() => {
    electronApp.setAppUserModelId("com.electron");

    app.on("browser-window-created", (_, window) => {
      optimizer.watchWindowShortcuts(window);
    });

    ipcMain.handle("get-mac-address", () => {
      const networkInterfaces = os.networkInterfaces();

      for (const key in networkInterfaces) {
        const networkInterface = networkInterfaces[key];

        if (networkInterface) {
          for (const details of networkInterface) {
            if (details.family === "IPv4" && !details.internal) {
              return details.mac;
            }
          }
        }
      }

      return undefined;
    });

    ipcMain.handle("save-token", (_, token) => {
      fs.writeFileSync(tokenFilePath, JSON.stringify({ token }));
    });

    ipcMain.handle("reset-app", () => {
      app.relaunch();
      app.exit();
    });

    ipcMain.handle("get-version", () => {
      const version = app.getVersion();

      if (version) {
        return version;
      }
      return null;
    });

    ipcMain.handle("read-token", async () => {
      if (fs.existsSync(tokenFilePath)) {
        const data = fs.readFileSync(tokenFilePath).toString();
        const { token } = await JSON.parse(data);
        return token;
      }
      return null;
    });

    ipcMain.handle("delete-token", () => {
      if (fs.existsSync(tokenFilePath)) {
        fs.unlinkSync(tokenFilePath);
        return true;
      }
      return false;
    });

    app.on("window-all-closed", async () => {
      if (checkScreenRecorderInterval) {
        clearInterval(checkScreenRecorderInterval);
      }

      if (process.platform !== "darwin") {
        app.quit();
      }
    });

    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on("update-available", () => {
      dialog.showMessageBox({
        type: "info",
        title: "Cập nhật phiên bản mới",
        message:
          "Một phiên bản mới đã được phát hành. Ứng dụng sẽ tự tải xuống và cài đặt phiên bản mới",
      });
    });

    autoUpdater.on("update-downloaded", () => {
      dialog
        .showMessageBox({
          type: "info",
          title: "Đã tải xuống phiên bản mới",
          message:
            "Phiên bản mới đã được tải xuống, nhấn vào nút CÀI ĐẶT dưới đây để tiến hành cài đặt",
          buttons: ["CÀI ĐẶT"],
        })
        .then(() => {
          autoUpdater.quitAndInstall();
        });
    });

    autoUpdater.on("error", (error) => {
      dialog.showErrorBox(
        "Error",
        `Không thể kiểm tra bản cập nhật: ${error == null ? "unknown" : (error.stack || error).toString()}`
      );
      app.quit();
    });

    autoUpdater.on("update-not-available", () => {
      createWindow();
    });

    app.on("activate", function () {
      if (BrowserWindow.getAllWindows().length === 0) {
        autoUpdater.on("update-not-available", () => {
          createWindow();
        });
      }
    });
  });
}
