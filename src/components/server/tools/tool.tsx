import React from 'react'
import styles from './tool.module.scss'
import {selectApps} from "@/services/server/tools/tools";

export async function ToolBody({lang}: { lang: string }) {
    const appList = selectApps(lang)
    return <div className={styles.toolBodyComponent}>
        <div className={styles.appGrid}>
            {
                appList.map(app => {
                    return <div className={styles.appCard} key={app.uid}>
                        <img className={styles.appImage} src={app.image} alt={app.name}/>
                        <div className={styles.appTitle}>
                            <a style={{color: '#333', textDecoration: 'none'}} href={app.url}>{app.name}</a>
                        </div>
                        <p className={styles.appDescription}>{app.description}</p>
                    </div>
                })
            }
        </div>
    </div>
}
