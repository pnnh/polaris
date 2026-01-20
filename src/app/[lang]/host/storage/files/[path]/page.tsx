import React from 'react'
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {useServerConfig} from "@/components/server/config";
import {CommonResult} from "@pnnh/atom";
import {css} from "@/gen/styled/css";
import {PSFileModel} from "@/components/common/models/file";
import {PSFilePreview} from "@/components/files/preview";

const pageStyles = {
    notesContainer: css`
        display: flex;
        flex-direction: column;
        gap: 1rem;
    `
}

export default async function Page({searchParams, params}: {
    searchParams: Promise<Record<string, string>>
    params: Promise<{ path: string }>,
}) {
    const paramsValue = await params

    const serverConfig = await useServerConfig()
    const serverUrl = serverConfig.INTERNAL_PORTAL_URL
    const url = `${serverUrl}/host/storage/files/desc?uid=${paramsValue.path}`
    const selectResult = await serverMakeGet<CommonResult<PSFileModel>>(url, '')
    if (!selectResult || selectResult.code !== 200 || !selectResult.data) {
        throw new Error("host notebook")
    }
    const model = selectResult.data

    return <>
        <div className={pageStyles.notesContainer}>
            <div>{model.title}</div>
            <div>{model.url}</div>
            <PSFilePreview model={model}/>
        </div>
    </>
}


