import { app, shell, BrowserWindow, ipcMain, dialog } from "electron";
import path, { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import os from "os";
import fs from "fs";
import { loadPsList } from "./psListWrapper";
import { winRecordingPrograms } from "./blackList";

const tokenFilePath = path.join(app.getPath("userData"), "jwtToken.json");
const gotTheLock = app.requestSingleInstanceLock();
let checkScreenRecorderInterval: NodeJS.Timeout | null = null;

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

  checkScreenRecorderInterval = setInterval(() => {
    checkForScreenRecorder(mainWindow);
  }, 3000);
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

    createWindow();

    app.on("activate", function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

const getProcesses = async () => {
  try {
    const psListModule = await loadPsList();
    const processes = await psListModule.default();
    return processes;
  } catch (error) {
    console.error("Error fetching processes:", error);
    return [];
  }
};

async function checkForScreenRecorder(
  mainWindow: BrowserWindow
): Promise<void> {
  const detectedPrograms: string[] = [];

  const processes = await getProcesses();

  const timeNow = new Date().toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
  });

  processes.forEach((process) => {
    winRecordingPrograms.forEach((recordProgram) => {
      if (process.name.toLowerCase() === recordProgram.toLowerCase()) {
        detectedPrograms.push(process.name);
      }
    });
  });

  const foundRecorder = detectedPrograms.length > 0;

  const programCount: Record<string, number> = detectedPrograms.reduce(
    (acc: Record<string, number>, program: string) => {
      acc[program] = (acc[program] || 0) + 1;
      return acc;
    },
    {}
  );

  const uniquePrograms = Object.entries(programCount)
    .map(([program, count]) => {
      return count > 1 ? `${program} * ${count}` : program;
    })
    .join(", ");

  if (foundRecorder) {
    if (mainWindow.isVisible()) {
      mainWindow.hide();

      dialog.showMessageBoxSync({
        type: "warning",
        title: "Cảnh báo hành vi bất thường",
        buttons: ["Chỉ nhấn vào dòng này khi bạn đã tắt hết"],
        message: `Phát hiện hành vi chụp/quay màn hình. Chương trình sẽ TỰ KHỞI ĐỘNG LẠI sau vài giây khi các phần mềm liên quan đến chụp/quay màn hình được tắt (Thời gian phát hiện: ${timeNow}, ứng dụng nghi ngờ: ${uniquePrograms})`,
      });
    }
  } else {
    if (!mainWindow.isVisible()) {
      mainWindow.show();
    }
  }
}
