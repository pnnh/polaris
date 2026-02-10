import React from 'react'
import {css} from "@/gen/styled/css";
import {selectAppsFromStorage} from "@/components/server/tools/tools";
import {PSFileModel} from "@/components/common/models/file";
import {FileItemCard, ImageItemCard, NoteItemCard} from "@/app/[lang]/host/page";

const toolStyles = {
    toolBodyComponent: css`
        width: 1024px;
        margin: 0 auto;
        padding-top: 2rem;
        padding-bottom: 2rem;
    `,
    appGrid: css`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 3rem;
        width: 100%;
        margin-bottom: 1rem;
    `,
    appCard: css`
        border: 1px solid #e0e0e0;
        background-color: #ffffff;
        border-radius: 4px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        aspect-ratio: 1/0.8;
        position: relative;
    `,
    appImage: css`
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0.2;
        z-index: 0;
        object-fit: cover;
    `,
    appTitle: css`
        font-size: 20px;
        font-weight: 600;
        position: relative;
        z-index: 2;
        padding: 16px;
    `,
    appDescription: css`
        margin: 0;
        padding: 16px;
        font-size: 16px;
        color: #555;
        position: relative;
        z-index: 2;
    `
}

export async function FilesGridBody({lang}: { lang: string }) {
    const appList = await selectAppsFromStorage()
    return <div className={toolStyles.toolBodyComponent}>
        <div className={toolStyles.appGrid}>
            {
                appList.range.map(async (app) => {
                    return renderResourceCard({model: app, lang})
                })
            }
        </div>
    </div>
}

function renderResourceCard({model, lang}: { model: PSFileModel, lang: string }) {
    if (model.mimetype === 'polaris/directory') {
        return <FileItemCard model={{lang: lang, title: model.name, url: model.url}}/>
    }
    if (model.mimetype === 'polaris/album') {
        return <ImageItemCard model={{lang: lang, title: model.name, url: model.url}}/>
    }
    if (model.mimetype === 'polaris/notebook') {
        return <NoteItemCard model={{lang: lang, title: model.name, url: model.url}}/>
    }
    const toolUrl = model.url.startsWith('https') || model.url.startsWith('https')
        ? model.url : `${lang}${model.url}`
    return <div className={toolStyles.appCard} key={model.uid}>
        <div className={toolStyles.appTitle}>
            <a style={{color: '#333', textDecoration: 'none'}} href={toolUrl}
               title={model.title || model.name}>{model.title || model.name}</a>
        </div>
    </div>
}
