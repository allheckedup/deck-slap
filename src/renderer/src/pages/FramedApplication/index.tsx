import { ApiContext } from '@renderer/hooks/ApiContext'
import { useToggleSwitch } from '@renderer/hooks/useToggleSwitch'
import { Minus, PinIcon, PinOffIcon } from 'lucide-react'
import pThrottle from 'p-throttle'
import { useEffect } from 'react'
import Modal from 'react-modal'
import styles from './index.module.css'

import type { RenderableApp } from '@renderer/types/app'
import classNames from 'classnames'
import { DynamicIcon } from 'lucide-react/dynamic'
import type { ElectronCustomApi } from 'src/preload'

const throttler = pThrottle({
  limit: 5,
  interval: 1000
})

const api = Object.entries(window.api)
  .map(([k, fn]) => [k, throttler(fn)])
  .reduce((acc, [k, v]) => ({ ...acc, [k as string]: v }), {}) as ElectronCustomApi

Modal.setAppElement('#root')

export type FramedApplicationProps = {
  className?: string
  config: RenderableApp
}

export const FramedApplication = ({
  children,
  className,
  config: { name, icon }
}: React.PropsWithChildren<FramedApplicationProps>) => {
  const { state: pinned, toggleOff: unpin, toggleOn: pin } = useToggleSwitch(false)
  useEffect(() => {
    api.pinApp(pinned)
  }, [pinned])

  const PinActionIcon = pinned ? PinOffIcon : PinIcon
  const pinAction = pinned ? unpin : pin

  return (
    <ApiContext.Provider value={api}>
      <div id={styles.applicationRoot} className={className}>
        <div id={styles.resizableArea} />
        <div id={styles.frameHeader}>
          <div id={styles.frameTitle}>
            {/* @ts-ignore icon types are wierd enum that isnt exported. not really able to be dynamically done like this */}
            <DynamicIcon name={icon} className={(styles.icon, styles.static)} />
            <span id={styles.applicationName}>{name}</span>
          </div>
          <div id={styles.frameActions}>
            <Minus onClick={api.minimiseApp} className={styles.icon} />
            <PinActionIcon
              onClick={pinAction}
              className={classNames(styles.frameActions, styles.pin, styles.icon)}
            />
          </div>
        </div>
        <div id={styles.contentRoot}>{children}</div>
      </div>
    </ApiContext.Provider>
  )
}
