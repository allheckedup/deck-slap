import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import { SIDEBOARD_APP, SPELLBOOK_APP, TABLETOP_APP, type UsableApp } from '../shared/app.const'

const createWindow = ({
  name,
  path,
  transparent = false,
  resizable = true,
  windowSize
}: UsableApp): BrowserWindow => {
  console.log(`Creating window ${name} @ ${path}`)
  const { width, height } = windowSize.default
  // Create the browser window.
  let win: BrowserWindow | null = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    transparent,
    resizable,
    width,
    height,
    minWidth: windowSize?.min?.width,
    minHeight: windowSize?.min?.height,
    frame: false,
    roundedCorners: false, // macOS, not working on Windows
    thickFrame: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: true
    }
  })

  win.on('ready-to-show', () => {
    win?.show()
    win?.setTitle(name)
    win?.webContents.openDevTools()
  })

  win.on('close', () => {
    win = null
  })

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    console.log('loading url')
    win.loadURL(process.env['ELECTRON_RENDERER_URL'] + '?path=' + path)
  } else {
    console.log('loading file')
    win.loadFile(join(__dirname, '../renderer/index.html'), { query: { path } })
  }
  return win
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow(TABLETOP_APP)
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(TABLETOP_APP)
      createWindow(SPELLBOOK_APP)
      createWindow(SIDEBOARD_APP)
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
