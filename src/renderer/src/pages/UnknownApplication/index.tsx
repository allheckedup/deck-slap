import { UNKNOWN_APP } from '@shared/app.const'
import { FramedApplication } from '../FramedApplication'
import styles from './index.module.css'

export type UnknownApplicationProps = {
  path: string
}

export const UnknownApplication = ({ path }: UnknownApplicationProps) => (
  <FramedApplication config={UNKNOWN_APP} className={styles.applicationRoot}>
    <h1>404 Path {path} not found</h1>
  </FramedApplication>
)
