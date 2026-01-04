import React from 'react'
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {useServerConfig} from "@/components/server/config";
import {encodeBase58String, encodeBase64String, PLSelectResult, stringToBase58} from "@pnnh/atom";
import {PSArticleModel} from "@/components/common/models/article";
import {css} from "@/gen/styled/css";

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
    const selectResult = await serverMakeGet<PLSelectResult<PSArticleModel>>(url, '')
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
        padding: 12px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background-color: #fafafa;
        transition: box-shadow 0.3s ease;
    `
}

function NoteItemCard({model}: { model: PSArticleModel }) {
    const uid = stringToBase58(model.url, 'base58')
    return <div className={cardStyles.cardItem}>
        <div>
            <a href={`/host/storage/files/${uid}`}>{model.title}</a>
        </div>
    </div>
}
