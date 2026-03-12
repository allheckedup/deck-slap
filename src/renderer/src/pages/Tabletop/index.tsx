import { TABLETOP_APP } from '@shared/app.const'
import { FramedApplication } from '../FramedApplication'
import styles from './index.module.css'

export const Tabletop = () => (
  <FramedApplication config={TABLETOP_APP} className={styles.applicationRoot}>
    <div style={{ width: '100%', height: '100%' }} onClick={() => console.log('aaaaaaaaaaaaaa')}>
      Tabletop :)
    </div>
  </FramedApplication>
)
