import type { DynamicIcon } from 'lucide-react/dynamic'

export type WindowSizing = {
  width?: number
  height?: number
}

export type UsableApp = {
  name: string // name of the application, used for window caching, logging, and window headers
  path: string // path from renderer src to the index.html file
  icon: (typeof DynamicIcon)['name']
  transparent?: boolean // whether the app has a background or not (overlay?)
  resizable?: boolean
  windowSize: {
    default: WindowSizing
    min?: WindowSizing
    current?: WindowSizing
  }
}

const BASE_CONFIG: UsableApp = {
  name: 'Unknown App',
  path: '/unknown',
  icon: 'box',
  windowSize: {
    default: {
      width: 800,
      height: 600
    }
  }
}

export const UNKNOWN_APP: UsableApp = {
  ...BASE_CONFIG,
  name: '404 Unknown',
  icon: 'skull',
  path: 'unknown'
}

export const TABLETOP_APP: UsableApp = {
  ...BASE_CONFIG,
  name: 'Tabletop',
  icon: 'swords',
  path: 'tabletop'
}

export const SPELLBOOK_APP = {
  ...BASE_CONFIG,
  name: 'Spellbook',
  icon: 'book-open',
  path: 'spellbook'
}

export const SIDEBOARD_APP = {
  ...BASE_CONFIG,
  name: 'Sideboard',
  icon: 'boxes',
  path: 'sideboard'
}
