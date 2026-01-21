import React from 'react'
import {useServerConfig} from "@/components/server/config";

export default async function Page({searchParams, params}: {
    searchParams: Promise<Record<string, string>>
    params: Promise<{ uid: string, lang: string }>,
}) {
    const paramsValue = await params
    const lang = paramsValue.lang
    const uid = paramsValue.uid

    const serverConfig = await useServerConfig()

    const publicPortalUrl = serverConfig.PUBLIC_PORTAL_URL
    const imgUrl = `${publicPortalUrl}/host/album/images/file?file=${uid}`

    return <>
        <div className={'notesContainer'}>
            <img src={imgUrl} alt={'model.title'}/>
        </div>
    </>
}


