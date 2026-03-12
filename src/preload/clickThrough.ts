import { ipcRenderer } from 'electron/renderer'

export const clickThrough = {
  ignoreClicks: () => ipcRenderer.send('set-ignore-mouse-events', true, { forward: true }),
  listenToClicks: () => ipcRenderer.send('set-ignore-mouse-events', false)
}
