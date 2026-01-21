import React from 'react'
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {useServerConfig} from "@/components/server/config";
import {CommonResult} from "@pnnh/atom";
import {PSArticleModel} from "@/components/common/models/article";
import {css} from "@/gen/styled/css";

const pageStyles = {
    notesContainer: css`
        display: flex;
        flex-direction: column;
        gap: 1rem;
    `
}

export default async function Page({searchParams, params}: {
    searchParams: Promise<Record<string, string>>
    params: Promise<{ uid: string, lang: string }>,
}) {
    const paramsValue = await params
    const lang = paramsValue.lang
    const encodedUid = paramsValue.uid

    const serverConfig = await useServerConfig()
    const serverUrl = serverConfig.INTERNAL_PORTAL_URL
    const url = `${serverUrl}/host/notebook/notes/content?uid=${encodedUid}`
    const selectResult = await serverMakeGet<CommonResult<PSArticleModel>>(url, '')
    if (!selectResult || selectResult.code !== 200 || !selectResult.data) {
        throw new Error("host notebook")
    }
    const model = selectResult.data

    return <>
        <div className={pageStyles.notesContainer}>
            <div>{model.title}</div>
            <div>{model.url}</div>
            <div>
                {model.body}
            </div>
        </div>
    </>
}


