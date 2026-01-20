import React from 'react'
import styles from './tool.module.scss'
import {getAppWithText, selectAppsFromStorage} from "@/components/server/tools/tools";
import {ApplicationWithText} from "@/components/common/models/application";
import {FileItemCard, ImageItemCard, NoteItemCard} from "@/app/[lang]/host/page";

export async function ToolBody({lang}: { lang: string }) {
    const appList = await selectAppsFromStorage()
    return <div className={styles.toolBodyComponent}>
        <div className={styles.appGrid}>
            {
                appList.map(async (app) => {
                    const appWithText = await getAppWithText(lang, app)
                    if (!appWithText) {
                        return null
                    }
                    return renderResourceCard({model: appWithText, lang})
                })
            }
        </div>
    </div>
}

function renderResourceCard({model, lang}: { model: ApplicationWithText, lang: string }) {
    if (model.mime === 'polaris/directory') {
        return <FileItemCard model={{lang: lang, title: model.name, url: model.url}}/>
    }
    if (model.mime === 'polaris/album') {
        return <ImageItemCard model={{lang: lang, title: model.name, url: model.url}}/>
    }
    if (model.mime === 'polaris/notebook') {
        return <NoteItemCard model={{lang: lang, title: model.name, url: model.url}}/>
    }
    const toolUrl = model.url.startsWith('https') || model.url.startsWith('https')
        ? model.url : `${lang}${model.url}`
    return <div className={styles.appCard} key={model.uid}>
        <img className={styles.appImage} src={model.image} alt={model.name}/>
        <div className={styles.appTitle}>
            <a style={{color: '#333', textDecoration: 'none'}} href={toolUrl}>{model.name}</a>
        </div>
        <p className={styles.appDescription}>{model.description}</p>
    </div>
}
