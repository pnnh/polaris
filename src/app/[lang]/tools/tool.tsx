import React from 'react'
import {css} from "@/gen/styled/css";
import {PSFileModel} from "@/components/common/models/file";
import {transTodo} from "@/components/common/locales/normal";
import {STSubString, uuidToBase58} from "@pnnh/atom";

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

export function renderResourceCard({model, lang}: { model: PSFileModel, lang: string }) {
    if (model.mimetype === 'polaris/directory') {
        return <DirectoryItemCard model={{lang: lang, title: model.name, url: model.url}}/>
    }
    if (model.mimetype === 'polaris/album') {
        return <AlbumItemCard model={{lang: lang, title: model.name, url: model.url}}/>
    }
    if (model.mimetype === 'polaris/notebook') {
        return <NotebookItemCard model={{lang: lang, title: model.name, url: model.url}}/>
    } else if (model.mimetype === 'polaris/note') {
        return <PSNoteItemCard lang={lang} model={model}/>
    } else if (model.mimetype === 'polaris/application') {
        return <PSAppCard lang={lang} model={model}/>
    }
    return <FileItemCard lang={lang} model={model}/>
}

async function FileItemCard({lang, model}: { lang: string, model: PSFileModel }) {
    const toolUrl = model.url.startsWith('https') || model.url.startsWith('https')
        ? model.url : `${lang}${model.url}`
    return <div className={toolStyles.appCard} key={model.uid}>
        <div className={toolStyles.appTitle}>
            <a style={{color: '#333', textDecoration: 'none'}} href={toolUrl}
               title={model.title || model.name}>{model.title || model.name}</a>
        </div>
        <div className={toolStyles.appDescription}>
            {model.description}
        </div>
    </div>
}

const cardStyles = {
    cardItem: css`
        padding: 12px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background-color: #fafafa;
        transition: box-shadow 0.3s ease;
    `
}

interface IAppBody {
    title: string;
    title_i18n: Record<string, string>;
    description: string;
    description_i18n: Record<string, string>;
    icon: string;
}

export async function PSAppCard({lang, model}: { lang: string, model: PSFileModel }) {
    const orgUrl = model.url
    let toolUrl = orgUrl
    let target = '_self'
    if (orgUrl.startsWith('https') || orgUrl.startsWith('http')) {
        target = '_blank'
    } else if (orgUrl.startsWith("polaris://lang")) {
        toolUrl = orgUrl.replace('polaris://lang/', `/${lang}/`)
    }
    const bodyObject = JSON.parse(model.body || '{}') as IAppBody
    const viewTitle = bodyObject.title_i18n?.[lang] || bodyObject.title
    const viewDescription = bodyObject.description_i18n?.[lang] || bodyObject.description

    try {
        return <div className={cardStyles.cardItem}>
            <a href={toolUrl} target={target}>{viewTitle}</a>
            <div>
                {STSubString(viewDescription, 120)}
            </div>
        </div>

    } catch (error) {
        console.error("Error rendering PSNoteItemCard:", error);
        return <div className={cardStyles.cardItem}>
            {transTodo("无法显示应用")}
        </div>
    }
}


export async function PSNoteItemCard({lang, model}: { lang: string, model: PSFileModel }) {
    try {
        const enUid = uuidToBase58(model.object_uid)
        return <div className={cardStyles.cardItem}>
            <a href={`/${lang}/articles/${enUid}`}>{model.title}</a>
            <div>
                {STSubString(model.description, 120)}
            </div>
        </div>

    } catch (error) {
        console.error("Error rendering PSNoteItemCard:", error);
        return <div className={cardStyles.cardItem}>
            {transTodo("无法显示笔记")}
        </div>
    }
}

interface CardProps {
    lang: string
    url: string
    title: string
}

export async function DirectoryItemCard({model}: { model: CardProps }) {
    return <div className={cardStyles.cardItem}>

        <a href={`${model.lang}${model.url}`}>{transTodo(model.title)}</a>

    </div>
}

export async function NotebookItemCard({model}: { model: CardProps }) {
    return <div className={cardStyles.cardItem}>

        <a href={`${model.lang}${model.url}`}>{transTodo(model.title)}</a>

    </div>
}

export async function AlbumItemCard({model}: { model: CardProps }) {
    return <div className={cardStyles.cardItem}>

        <a href={`${model.lang}${model.url}`}>{transTodo(model.title)}</a>

    </div>
}

