import { ElectronAPI } from '@electron-toolkit/preload'
import { type ElectronCustomApi } from './index'

declare global {
  interface Window {
    electron: ElectronAPI
    api: ElectronCustomApi
  }
}
