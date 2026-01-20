import React from 'react'
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {useServerConfig} from "@/components/server/config";
import {PLSelectResult} from "@pnnh/atom";
import {css} from "@/gen/styled/css";
import {PSAutoIcon, PSDirectoryIcon} from "@/components/icons/file-icon";
import {PSFileModel} from "@/components/common/models/file";

const containerStyles = {
    notesGrid: css`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
    `
}

export default async function Page({searchParams}: {
    searchParams: Promise<Record<string, string>>
}) {
    const searchParamsValue = await searchParams
    const dir = searchParamsValue.dir
    if (!dir) {
        throw new Error("Not Found")
    }
    const serverConfig = await useServerConfig()
    const serverUrl = serverConfig.INTERNAL_PORTAL_URL
    const url = `${serverUrl}/host/storage/files?dir=${encodeURIComponent(dir)}`
    const selectResult = await serverMakeGet<PLSelectResult<PSFileModel>>(url, '')
    if (!selectResult || selectResult.code !== 200) {
        throw new Error("host notebook")
    }

    return <>
        <div className={containerStyles.notesGrid}>
            {
                selectResult.data.range.map((model) => {
                    return <NoteItemCard model={model} key={model.uid}/>
                })
            }
        </div>
    </>
}

const cardStyles = {
    cardItem: css`
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background-color: #fafafa;
        transition: box-shadow 0.3s ease;
        position: relative;
    `,
    iconBox: css`
        height: 6rem;
        display: flex;
        justify-content: center;
        align-items: center;
    `,
    actionBar: css`
        height: 2rem;
        width: 100%;
        padding: 0 0.5rem 0 0.5rem;
        display: flex;
        align-items: center;
    `,
    titleBox: css`
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

    `
}

function NoteItemCard({model}: { model: PSFileModel }) {
    let linkUrl = `/host/storage/files/${model.path}`
    if (model.is_dir) {
        linkUrl = `/host/storage/files?dir=${encodeURIComponent(model.path)}`
    }
    return <div className={cardStyles.cardItem}>
        <div className={cardStyles.iconBox}>
            {model.is_dir ?
                <PSDirectoryIcon size={64}/> :
                <PSAutoIcon filename={model.title} size={64}/>
            }

        </div>
        <div className={cardStyles.actionBar}>
            <div className={cardStyles.titleBox}>

                <a href={linkUrl} title={model.title}>{model.title}</a>
            </div>
        </div>
    </div>
}

