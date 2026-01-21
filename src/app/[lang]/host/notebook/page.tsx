import React from 'react'
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {useServerConfig} from "@/components/server/config";
import {PLSelectResult} from "@pnnh/atom";
import {PSArticleModel} from "@/components/common/models/article";

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
    const url = `${serverUrl}/${lang}/notebook/notes?dir=${encodeURIComponent(dir)}`
    const selectResult = await serverMakeGet<PLSelectResult<PSArticleModel>>(url, '')
    if (!selectResult || selectResult.code !== 200) {
        throw new Error("host notebook")
    }

    return <>
        <div className={'notesContainer'}>
        </div>
    </>
}


