import React from 'react'
import {headers} from "next/headers";
import {notFound} from "next/navigation";
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {useServerConfig} from "@/components/server/config";
import {PLSelectResult} from "@pnnh/atom";
import {PSArticleModel} from "@/components/common/models/article";

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
    const url = `${serverUrl}/notebook/notes?dir=${encodeURIComponent(dir)}`
    const selectResult = await serverMakeGet<PLSelectResult<PSArticleModel>>(url, '')
    if (!selectResult || selectResult.code !== 200) {
        throw new Error("host notebook")
    }

    return <>
        <div className={'notesContainer'}>
        </div>
    </>
}


