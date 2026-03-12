import { ipcRenderer } from 'electron'

export const windowActions = {
  bringAllToFront: () => ipcRenderer.invoke('app:focusAll'),
  quit: () => ipcRenderer.invoke('app:quit'),

  minimiseApp: () => {},
  pinApp: () => {}
}
