import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  dialog,
  Menu,
  screen,
} from "electron";
import path, { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import os from "os";
import fs from "fs";
import "dotenv/config";
import log from "electron-log/main";
import axios from "axios";
import { ProcessDescriptor } from "ps-list";
import { webBlockList, winBlockPrograms } from "../../resources/data";
import * as dotenv from "dotenv";
const envPath = app.isPackaged
  ? path.join(process.resourcesPath, ".env")
  : path.join(__dirname, "../../.env");

dotenv.config({ path: envPath });

let mainWindow: BrowserWindow;
let splashWindow: BrowserWindow;
let checkScreenRecorderInterval: NodeJS.Timeout | null = null;
let checkUpdateInterval: NodeJS.Timeout | null = null;

const gotTheLock = app.requestSingleInstanceLock();
const tokenFilePath = path.join(app.getPath("userData"), "jwtToken.json");
const licenseKey = process.env.LICENSE_KEY!;
const licensePath = path.join(app.getPath("desktop"), "ca-license.txt");

function checkMACAddress(): boolean {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    if (nets[name]) {
      for (const net of nets[name]) {
        if (
          net.mac &&
          /^(00:05:69|00:0C:29|00:1C:14|00:50:56)/i.test(net.mac)
        ) {
          return true;
        }
      }
    }
    return false;
  }
  return false;
}

function initLogger(): void {
  log.info("Initialize logger");
  const logPath = path.join(
    app.getPath("appData"),
    "castudio-lectures",
    "logs",
    "main.log"
  );
  log.transports.file.resolvePathFn = (): string => logPath;
  log.info("Logger initialized at:", logPath);
}

async function loadPsList(): Promise<typeof import("ps-list")> {
  return import("ps-list");
}

async function getProcesses(): Promise<Array<ProcessDescriptor>> {
  try {
    const psListModule = await loadPsList();
    const processes = await psListModule.default();
    return processes;
  } catch (error) {
    console.error("Error fetching processes:", error);
    return [];
  }
}

function getAllDomains(): string[] {
  return webBlockList.flatMap((item) => item.domains);
}

function blockDomains(): void {
  const hostsPath =
    os.platform() === "win32"
      ? "C:\\Windows\\System32\\drivers\\etc\\hosts"
      : "/etc/hosts";

  const domains = getAllDomains();

  const lines = fs.readFileSync(hostsPath, "utf-8").split(/\r?\n/);

  domains.forEach((domain) => {
    const regex = new RegExp(`\\s+${domain}$`, "i");
    const index = lines.findIndex((line) => regex.test(line));

    if (index !== -1) {
      if (!lines[index].startsWith("127.0.0.1")) {
        lines[index] = `127.0.0.1 ${domain}`;
      }
    } else {
      lines.push(`127.0.0.1 ${domain}`);
    }
  });

  fs.writeFileSync(hostsPath, lines.join("\n"), "utf-8");
}

function unblockDomains(): void {
  const hostsPath =
    os.platform() === "win32"
      ? "C:\\Windows\\System32\\drivers\\etc\\hosts"
      : "/etc/hosts";

  const domains = getAllDomains();

  const filtered = fs
    .readFileSync(hostsPath, "utf-8")
    .split(/\r?\n/)
    .filter((line) => !domains.some((domain) => line.includes(domain)))
    .join("\n");

  fs.writeFileSync(hostsPath, filtered, "utf-8");
}

async function checkForScreenRecorder(
  mainWindow: BrowserWindow
): Promise<void> {
  let fileContent: string | null = null;
  if (fs.existsSync(licensePath)) {
    fileContent = fs.readFileSync(licensePath, "utf-8");
  }

  if (fileContent && fileContent.includes(licenseKey)) {
    mainWindow.setContentProtection(false);
    unblockDomains();

    if (!mainWindow.isVisible()) {
      mainWindow.show();
    }
  } else {
    mainWindow.setContentProtection(true);
    blockDomains();

    const detectedPrograms: string[] = [];
    const processes = await getProcesses();
    const timeNow = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });

    processes.forEach((process) => {
      winBlockPrograms.forEach((recordProgram) => {
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
      }

      dialog.showMessageBoxSync({
        type: "warning",
        title: "Cảnh báo hành vi bất thường",
        buttons: ["Chỉ nhấn vào dòng này khi bạn đã tắt hết"],
        message: `Phát hiện hành vi chụp/quay màn hình. Chương trình sẽ TỰ KHỞI ĐỘNG LẠI sau vài giây khi các phần mềm liên quan đến chụp/quay màn hình được tắt (Thời gian phát hiện: ${timeNow}, ứng dụng nghi ngờ: ${uniquePrograms})`,
      });
    } else {
      if (!mainWindow.isVisible()) {
        mainWindow.show();
      }
    }
  }
}

function createWindow(): void {
  const primaryScreen = screen.getPrimaryDisplay().workAreaSize;
  const { width, height } = primaryScreen;

  splashWindow = new BrowserWindow({
    width,
    height,
    frame: false,
    resizable: false,
    transparent: true,
    alwaysOnTop: true,
    show: true,
    center: true,
    focusable: false,
    movable: false,
    webPreferences: {
      devTools: false,
    },
  });

  splashWindow.setIgnoreMouseEvents(true);
  splashWindow.setFocusable(false);

  mainWindow = new BrowserWindow({
    width: 1158,
    height: 711,
    show: false,
    autoHideMenuBar: true,
    center: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      devTools: false,
    },
  });

  splashWindow.loadURL(`data:text/html,
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }
          img {
            width: 300px;
            height: auto;
          }
        </style>
      </head>
      <body>
        <img src="https://i.imgur.com/C2ZPhKI.png" />
      </body>
    </html>`);

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  mainWindow.setContentProtection(true);

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  Menu.setApplicationMenu(null);

  checkForUpdates();

  checkUpdateInterval = setInterval(() => {
    checkForUpdates();
  }, 300000);
}

function compareVersions(v1: string, v2: string): number {
  const a = v1.split(".").map(Number);
  const b = v2.split(".").map(Number);

  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const num1 = a[i] || 0;
    const num2 = b[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
}

async function checkForUpdates(): Promise<void> {
  try {
    log.info("Checking update...");

    const response = await axios.get(
      "https://api.castudio.online/v1/version/castudio-lectures"
    );

    const { release } = response.data.data;

    const currentVersion = app.getVersion();

    log.info(`Current version: ${currentVersion}`);
    log.info(`Latest version: ${release}`);

    if (compareVersions(release, currentVersion) > 0) {
      if (splashWindow.isVisible()) {
        splashWindow.hide();
      }
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      }

      if (checkUpdateInterval) {
        clearInterval(checkUpdateInterval);
      }

      log.info("New version release need to update");
      const showUpdater = await dialog.showMessageBox({
        title: "Cập nhật phiên bản mới",
        defaultId: 0,
        type: "info",
        message: `Phiên bản ${release} đã được phát hành. Vui lòng truy cập trang chủ để tải xuống bản cập nhật`,
        buttons: ["Truy cập trang chủ ngay", "Thoát"],
      });

      if (showUpdater.response === 0) {
        shell.openExternal("https://castudio.online/");
      }

      app.quit();
    } else {
      log.info("No update available");
      if (!checkScreenRecorderInterval) {
        checkScreenRecorderInterval = setInterval(() => {
          checkForScreenRecorder(mainWindow);
        }, 3000);
      }

      if (splashWindow.isVisible()) {
        setTimeout(() => {
          splashWindow.close();
        }, 3000);
      }
    }
  } catch (err) {
    log.error(err);
    splashWindow.hide();
    dialog.showMessageBoxSync({
      type: "error",
      title: "Lỗi kiểm tra cập nhật",
      message:
        "Đã xảy ra lỗi khi kiểm tra cập nhật. Vui lòng liên hệ quản trị viên để được hỗ trợ",
      buttons: ["OK"],
    });

    app.quit();
  }
}

if (!gotTheLock) {
  app.quit();
} else {
  app.whenReady().then(() => {
    initLogger();

    electronApp.setAppUserModelId("com.castudio.lectures");

    app.on("browser-window-created", (_, window) => {
      optimizer.watchWindowShortcuts(window);
    });

    if (checkMACAddress()) {
      dialog.showErrorBox(
        "Lỗi khởi động",
        "Không thể khởi chạy phần mềm trên hệ điều hành được giả lập"
      );
      app.quit();
    }

    createWindow();

    app.on("activate", function () {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
}

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
  unblockDomains();

  if (checkUpdateInterval) {
    clearInterval(checkUpdateInterval);
  }

  if (checkScreenRecorderInterval) {
    clearInterval(checkScreenRecorderInterval);
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});
