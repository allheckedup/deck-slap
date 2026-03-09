import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { windowActions } from './windowActions'

// Custom APIs for renderer
const api = {
  ...windowActions,
  ping: () => console.log('ping')
}

export type ElectronCustomApi = typeof api

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

// IMPORTANT!! This is used to allow transparent portions of apps to be click-through for UX. Means we don't have to dynamically resize the Atom window and can keep any size we wish.
window.addEventListener('DOMContentLoaded', () => {
  const bgElem = document.querySelector('.click-through-ignore')

  bgElem?.addEventListener('mouseenter', () => {
    ipcRenderer.send('set-ignore-mouse-events', false)
  })

  bgElem?.addEventListener('mouseleave', () => {
    ipcRenderer.send('set-ignore-mouse-events', true, { forward: true })
  })
})
