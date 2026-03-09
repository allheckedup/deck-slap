import { ipcRenderer } from 'electron'

export const windowActions = {
  bringAllToFront: () => ipcRenderer.invoke('app:focusAll'),
  quit: () => ipcRenderer.invoke('app:quit'),

  minimiseApp: () => ipcRenderer.invoke('window:minimise'),
  pinApp: (pinned: boolean) => ipcRenderer.invoke('window:pin', pinned)
}
