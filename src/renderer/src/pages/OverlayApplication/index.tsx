import pThrottle from 'p-throttle'
import type { ElectronCustomApi } from 'src/preload'
import '../tokens.css'
import styles from './index.module.css'

const throttler = pThrottle({
  limit: 5,
  interval: 1000
})

const api = Object.entries(window.api)
  .map(([k, fn]) => [k, throttler(fn)])
  .reduce((acc, [k, v]) => ({ ...acc, [k as string]: v }), {}) as ElectronCustomApi

export const OverlayApplication = ({ children }: React.PropsWithChildren<unknown>) => {
  return (
    <>
      <div
        aria-disabled
        className={styles.clickThroughArea}
        onMouseEnter={api.ignoreClicks}
        onMouseLeave={api.listenToClicks}
      />
      {children}
    </>
  )
}
