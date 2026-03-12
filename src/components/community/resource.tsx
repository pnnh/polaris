import React from "react";
import {AlbumItemCard, NotebookItemCard, PSAppCard, PSImageCard, PSNoteItemCard} from "@/app/[lang]/tools/tool";
import {css} from "@/gen/styled/css";
import {CMFileModel} from "@/components/common/models/community/file";

export function CMResourceCard({model, lang}: {
    model: CMFileModel, lang: string,
}) {
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

async function FileItemCard({lang, model}: { lang: string, model: CMFileModel }) {
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
