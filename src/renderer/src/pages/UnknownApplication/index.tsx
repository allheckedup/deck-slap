import { UNKNOWN_APP } from '@shared/app.const'
import { FramedApplication } from '../FramedApplication'
import styles from './index.module.css'
import { TriangleAlert } from 'lucide-react'

export type UnknownApplicationProps = {
  path: string
}

export const UnknownApplication = ({ path }: UnknownApplicationProps) => {
  return (
    <FramedApplication config={UNKNOWN_APP} className={styles.applicationRoot}>
      <div className={styles.header}>
        <TriangleAlert className={styles.icon} />
        <h1>Oh no! Path {path} couldn&apos;t be found :((</h1>
      </div>
      <hr className={styles.rule} />
      <div className={styles.content}>
        This is probably because we haven&apos;t actually coded it yet... unless we have and then
        please complain <a href="https://github.com/allheckedup/deck-slap/issues">here</a>.
      </div>
    </FramedApplication>
  )
}
