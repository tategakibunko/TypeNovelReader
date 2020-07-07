import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { Store } from './store';
import { CompileEnv, InitialCompileEnv } from '../common/models';
import { createMenu } from './main-menu';
import { compile } from './compile';

type WinBounds = Electron.Rectangle;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow;
const winEnv: CompileEnv = InitialCompileEnv;

// main app data
let store: Store;
const winBoundsKey = 'winBounds';
const initWinBounds: WinBounds = { x: 50, y: 50, width: 900, height: 700 };

const isDev = (): boolean => {
  return process.mainModule.filename.indexOf('app.asar') === -1;
};

const loadLastWinBounds = (): WinBounds => {
  let bounds: WinBounds = { ...initWinBounds };
  if (store.get(winBoundsKey)) {
    bounds = store.get(winBoundsKey) as WinBounds;
  }
  return saveLastWinBounds(bounds);
};

const saveLastWinBounds = (bounds: WinBounds): WinBounds => {
  store.set(winBoundsKey, bounds);
  return bounds;
};

function createWindow() {
  store = new Store('settings');
  const lastWinBounds = loadLastWinBounds();

  // Create the browser window.
  win = new BrowserWindow({
    ...lastWinBounds,
    webPreferences: {
      nodeIntegration: true
    }
  });

  winEnv.userDataPath = app.getPath('userData');
  // winEnv.tempPath = path.join(app.getPath('temp'), app.getName());
  winEnv.tempPath = path.join(app.getPath('temp'), app.name);

  // and load the index.html of the app.
  win.loadFile(path.join(__dirname, '/../../../dist/TypeNovelReader/index.html'));

  // Open the DevTools.
  // win.webContents.openDevTools();

  win.on('resize', () => {
    saveLastWinBounds(win.getBounds());
  });

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  createMenu(win);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('compile', (event, args) => {
  win.focus();
  compile(win, winEnv, args.filepath, args.textEncoding);
});

// open by TypeNovelReader from right context menu in Windows.
ipcMain.on('get-file-data', (event) => {
  if (process.platform === 'win32' && process.argv.length >= 2) {
    const filepath = process.argv[1];
    compile(win, winEnv, filepath, 'UTF-8');
  }
});

