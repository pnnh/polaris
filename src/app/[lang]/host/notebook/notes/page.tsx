import React from 'react'
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {useServerConfig} from "@/components/server/config";
import {PLSelectResult, stringToBase58} from "@pnnh/atom";
import {PSArticleModel} from "@/components/common/models/article";
import {css} from "@/gen/styled/css";

const containerStyles = {
    notesGrid: css`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
    `
}

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const paramsValue = await params
    const lang = paramsValue.lang
    const searchParamsValue = await searchParams
    const dir = searchParamsValue.dir
    if (!dir) {
        throw new Error("Not Found")
    }
    const serverConfig = await useServerConfig()
    const serverUrl = serverConfig.INTERNAL_PORTAL_URL
    const url = `${serverUrl}/host/notebook/notes?dir=${encodeURIComponent(dir)}`
    const selectResult = await serverMakeGet<PLSelectResult<PSArticleModel>>(url, '')
    if (!selectResult || selectResult.code !== 200) {
        throw new Error("host notebook")
    }

    return <>
        <div className={containerStyles.notesGrid}>
            {
                selectResult.data.range.map((model) => {
                    return <NoteItemCard lang={lang} model={model} key={model.uid}/>
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

function NoteItemCard({lang, model}: { lang: string, model: PSArticleModel }) {
    const uid = stringToBase58(model.url, 'base58')
    return <div className={cardStyles.cardItem}>
        <div>
            <a href={`/${lang}/host/notebook/notes/${uid}`}>{model.title}</a>
        </div>
    </div>
}
