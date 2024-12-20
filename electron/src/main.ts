import {app, BrowserWindow, ipcMain} from 'electron';
import path from 'path';
import {serverGetAppConfig} from "@/services/server/config";
import {serverStoreArticle} from "@/services/server/article";
import {serverSelectLibraries} from "@/services/server/library";
import {serverSelectFiles} from "@/services/server/notebook";
import {serverSelectNotes} from "@/services/server/notes";
import {serverGetDomainPath, serverSetDomainPath} from "@/services/server/domain";

if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 860,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }

    mainWindow.webContents.openDevTools({
        mode: 'bottom'
    });
};

app.on('ready', () => {
    ipcMain.handle('getAppConfig', serverGetAppConfig)
    ipcMain.handle('storeArticle', serverStoreArticle)
    ipcMain.handle('selectFiles', serverSelectFiles)
    ipcMain.handle('getDomainPath', serverGetDomainPath)
    ipcMain.handle('setDomainPath', serverSetDomainPath)
    createWindow()
});

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
