import { createContext } from 'react'
import type { ElectronCustomApi } from 'src/preload'

export const ApiContext = createContext<ElectronCustomApi | null>(null)
