import { UsableApp } from '@shared/app.const'
import React from 'react'

export type CustomRendererProps = {
  size: number
  x: number
  y: number
}

export type RenderableIcon = {
  name: string
  CustomRenderer?: React.FC<CustomRendererProps>
  styleClass?: string // classname to use for basic styles e.g. primary/secondary colours
}

export type RenderableApp = UsableApp &
  RenderableIcon & {
    page?: React.ReactNode
  }
