import React from 'react'
import {css} from "@/gen/styled/css";
import {PSFileModel} from "@/components/common/models/file";
import {transTodo} from "@/components/common/locales/normal";
import {STSubString, uuidToBase58} from "@pnnh/atom";
import {PSImageServer} from "@/components/server/image";
import {getDefaultImageUrl} from "@/components/common/note";

const imageStyles = {
    middleItem: css`
        position: relative;
        overflow: hidden;
        border-radius: 12px;
        background-color: var(--background-color);
        transition: box-shadow 0.25s ease, transform 0.25s ease;
    `,
    imageCover: css`
        flex-shrink: 0;
        position: relative;
        overflow: hidden;
        height: 80%;

        & img {
            width: 100%;
            aspect-ratio: 1 / 1;
            object-fit: cover;
            border-radius: 2px;
            font-size: 0;
        }
    `,
    imageInfo: css`
        display: flex;
        padding: 0.5rem 0.875rem;
        flex-direction: column;
        justify-content: flex-start;
        flex-grow: 1;
    `,
    itemTitle: css`
        height: 1.5rem;
        flex-shrink: 0;
        font-weight: 600;
        font-size: 0.9rem;
        line-height: 1.5rem;
        color: var(--text-primary-color);
        overflow: hidden;

        & a {
            color: var(--text-primary-color);
            text-decoration: none;

            &:hover {
                color: var(--primary-color);
            }
        }
    `,
    action: css`
        height: 1rem;
        color: var(--text-secondary-color);
        font-size: 12px;
        line-height: 22px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 6px;
    `,
};

export function PSImageCard({model, lang}: {
    model: PSFileModel, lang: string,
}) {
    const readUrl = `${lang}/images/${uuidToBase58(model.uid)}`
    let imageUrl = model.url || getDefaultImageUrl()

    return <div className={imageStyles.middleItem} key={model.uid}>
        <div className={imageStyles.imageCover} data-article={model.uid}>
            <PSImageServer src={imageUrl} alt={model.title} fill={true}/>
        </div>
        <div className={imageStyles.imageInfo}>
            <div className={imageStyles.itemTitle}>
                <a href={readUrl} title={model.title}>{model.title}</a></div>
        </div>
    </div>
}


const toolStyles = {
    toolBodyComponent: css`
        width: 100%;
        max-width: 80rem;
        margin: 0 auto;
        padding: 1.5rem 1rem 2rem;
    `,
    appGrid: css`
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        width: 100%;
        margin-bottom: 1rem;
        @media screen and (min-width: 48rem) {
            grid-template-columns: repeat(3, 1fr);
        }
    `,
    appCard: css`
        border: 1px solid var(--border-color);
        background-color: var(--background-color);
        border-radius: 12px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
        aspect-ratio: 1/0.8;
        position: relative;
        overflow: hidden;
        transition: box-shadow 0.25s ease, transform 0.25s ease;

        &:hover {
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
        }
    `,
    appImage: css`
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0.15;
        z-index: 0;
        object-fit: cover;
    `,
    appTitle: css`
        font-size: 1.1rem;
        font-weight: 600;
        position: relative;
        z-index: 2;
        padding: 16px 16px 8px;
        color: var(--text-primary-color);
    `,
    appDescription: css`
        margin: 0;
        padding: 0 16px 16px;
        font-size: 0.9rem;
        color: var(--text-secondary-color);
        position: relative;
        z-index: 2;
        line-height: 1.5;
    `
}

export function ResourceCard({model, lang, searchParams}: {
    model: PSFileModel, lang: string,
    searchParams: Record<string, string>,
}) {
    if (model.mimetype === 'polaris/directory' || model.mimetype === 'polaris/folder' || model.mimetype === 'directory'
        || model.mimetype === 'folder') {
        return <DirectoryItemCard lang={lang} searchParams={searchParams} model={model}/>
    }
    if (model.mimetype === 'polaris/album') {
        return <AlbumItemCard lang={lang} model={model}/>
    }
    if (model.mimetype === 'polaris/notebook') {
        return <NotebookItemCard lang={lang} model={model}/>
    } else if (model.mimetype === 'polaris/note') {
        return <PSNoteItemCard lang={lang} model={model}/>
    } else if (model.mimetype === 'polaris/application') {
        return <PSAppCard lang={lang} model={model}/>
    } else if (model.mimetype && model.mimetype.startsWith('image/')) {
        return <PSImageCard model={model} lang={lang}/>
    }
    return <FileItemCard lang={lang} model={model}/>
}

async function FileItemCard({lang, model}: { lang: string, model: PSFileModel }) {
    const toolUrl = model.url.startsWith('https') || model.url.startsWith('http')
        ? model.url : `${lang}${model.url}`
    return <div className={toolStyles.appCard} key={model.uid}>
        <div className={toolStyles.appTitle}>
            <a style={{color: 'var(--text-primary-color)', textDecoration: 'none'}} href={toolUrl}
               title={model.title || model.name}>{model.title || model.name}</a>
        </div>
        <div className={toolStyles.appDescription}>
            {model.description}
        </div>
    </div>
}

const cardStyles = {
    cardItem: css`
        padding: 14px 16px;
        border: 1px solid var(--border-color);
        border-radius: 12px;
        background-color: var(--background-color);
        transition: box-shadow 0.25s ease, transform 0.25s ease;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        &:hover {
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
            transform: translateY(-1px);
        }

        & > a, & > div > a {
            color: var(--text-primary-color);
            text-decoration: none;
            font-weight: 500;
            font-size: 0.95rem;
            line-height: 1.4;

            &:hover {
                color: var(--primary-color);
            }
        }

        & > div {
            color: var(--text-secondary-color);
            font-size: 0.85rem;
            line-height: 1.5;
        }
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

export async function DirectoryItemCard({lang, model, searchParams}: {
    lang: string, model: PSFileModel,
    searchParams: Record<string, string>,
}) {
    const prettyChannelUid = uuidToBase58(model.channel)
    if (!prettyChannelUid) {
        throw new Error(`Invalid channel UID for directory item: ${model.uid},${model.channel}`)
    }
    // 查看子目录下内容时，搜索和分页条件不再适用，所以不再保留
    const newUrl = `/${lang}/channels/${prettyChannelUid}?parent=${uuidToBase58(model.uid)}`
    return <div className={cardStyles.cardItem}>

        <a href={`${newUrl}`}>{transTodo(model.title)}</a>

    </div>
}

export async function NotebookItemCard({lang, model}: { lang: string, model: PSFileModel }) {
    return <div className={cardStyles.cardItem}>

        <a href={`${lang}${model.url}`}>{transTodo(model.title)}</a>

    </div>
}

export async function AlbumItemCard({lang, model}: { lang: string, model: PSFileModel }) {
    return <div className={cardStyles.cardItem}>

        <a href={`${lang}${model.url}`}>{transTodo(model.title)}</a>

    </div>
}

