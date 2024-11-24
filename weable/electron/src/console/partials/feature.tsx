import React from 'react'
import styles from './feature.module.scss'

export function ConsoleFeature() {
    return <div className={styles.consoleFeature}>
        <div className={styles.topArea}>
            <div className={styles.featureList}>
                <div className={styles.featureButton}>
                    <img src="/icons/console/file-copy-line.png" alt='notes'
                         sizes='24px,24px'/>
                </div>
                <div className={styles.featureButton}>
                    <img src="/icons/console/todo-fill.png" alt='todo'
                         sizes='24px,24px'/>
                </div>
                <div className={styles.featureButton}>
                    <img src="/icons/console/calendar-fill.png" alt='calendar'
                         sizes='24px,24px'/>
                </div>
                <div className={styles.featureButton}>
                    <img src="/icons/console/image-2-fill.png" alt='resources'
                         sizes='24px,24px'/>
                </div>
            </div>
            <div className={styles.trashList}>
                <div className={styles.featureButton}>
                    <img src="/icons/console/trash.png" alt='trash'
                         sizes='24px,24px'/>
                </div>
            </div>
        </div>
        <div className={styles.bottomArea}>
            <div className={styles.profilesList}>
                <div className={styles.profileButton}>
                    <img src="/data/photos/1.webp" alt='trash'
                         sizes='24px,24px'/>
                </div>
                <div className={styles.profileButton}>
                    <img src="/data/photos/2.webp" alt='trash'
                         sizes='24px,24px'/>
                </div>
            </div>
            <div className={styles.accountList}>
                <div className={styles.accountButton}>
                    <img src="/data/photos/3.webp" alt='trash'
                         sizes='28px,28px'/>
                </div>
            </div>
        </div>
    </div>
}
