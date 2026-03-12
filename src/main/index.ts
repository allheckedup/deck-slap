import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import { SIDEBOARD_APP, SPELLBOOK_APP, TABLETOP_APP, type UsableApp } from '../shared/app.const'

const makeWindow = ({
  name,
  path,
  windowSize,
  ...windowProps
}: UsableApp & Partial<ConstructorParameters<typeof BrowserWindow>[0]>): Promise<BrowserWindow> =>
  Promise.try(() => {
    console.log(`Creating window ${name} @ ${path}`)
    const { width, height } = windowSize.default
    // Create the browser window.
    let win: BrowserWindow | null = new BrowserWindow({
      ...windowProps,
      show: false,
      autoHideMenuBar: true,
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
  })

ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  console.log('recevied request to ignore', ignore)
  win?.setIgnoreMouseEvents(ignore, options)
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  const pThrottle = await import('p-throttle')
  const throttler = pThrottle.default({
    limit: 1,
    interval: 200
  })
  const createWindow = throttler(makeWindow)

  const makeStandardWindows = async () => {
    const tabletop = await createWindow(TABLETOP_APP)
    const overlay = await createWindow({
      ...SPELLBOOK_APP,
      parent: tabletop,
      resizable: false,
      transparent: true,
      skipTaskbar: true,
      frame: false
    })
    tabletop.on('move', () => {
      const [x, y] = tabletop.getPosition()
      overlay.setPosition(x, y)
    })
    tabletop.on('resize', () => {
      const [width, height] = tabletop.getSize()
      // um so like this has to happen, otherwise it never gets smaller?
      overlay.setMinimumSize(width, height)
      overlay.setMaximumSize(width, height)
      overlay.setSize(width, height)
    })
    tabletop.on('maximize', () => {
      overlay.maximize()
    })
    tabletop.on('unmaximize', () => {
      overlay.unmaximize()
    })
    tabletop.on('minimize', () => {
      overlay.minimize()
    })
    tabletop.on('restore', () => {
      overlay.restore()
    })
    // createWindow(SIDEBOARD_APP)
  }
  makeStandardWindows()

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

  app.on('activate', async function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      const tabletop = await createWindow(TABLETOP_APP)
      await createWindow({
        ...SPELLBOOK_APP,
        parent: tabletop,
        transparent: true,
        skipTaskbar: true
      })
      await createWindow(SIDEBOARD_APP)
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
