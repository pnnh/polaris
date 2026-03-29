import React from 'react'


import {getPathname} from "@/components/server/pathname";
import {CodeOk, CommonResult, langEn, SymbolUnknown, tryBase58ToUuid} from "@pnnh/atom";
import {PSArticleModel} from "@/components/common/models/article";
import {getDefaultImageUrl} from "@/components/common/note";
import {useServerConfig} from "@/components/server/config";

import {notFound} from "next/navigation";
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {PSImageServer} from "@/components/server/image";
import ContentLayout from "@/components/server/content/layout";

export const dynamic = "force-dynamic";

export default async function Home({params, searchParams}: {
    params: Promise<{ lang: string, uid: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const serverConfig = await useServerConfig()
    const internalPortalUrl = serverConfig.INTERNAL_PORTAL_URL
    const imageUid = tryBase58ToUuid(paramsValue.uid)
    if (!imageUid) {
        notFound();
    }
    const url = `${internalPortalUrl}/images/${imageUid}?lang=${lang}`
    const getResult = await serverMakeGet<CommonResult<PSArticleModel | undefined>>(url, '')

    if (!getResult || getResult.code !== CodeOk || !getResult.data) {
        return <div>遇到错误3</div>
    }
    const model = getResult.data
    let imageUrl = model.url || getDefaultImageUrl()
    return <ContentLayout lang={lang} searchParams={await searchParams} pathname={pathname}
                          userInfo={SymbolUnknown}>
        <div>

            <PSImageServer src={imageUrl} alt={model.title} fill={true}/>
        </div>
    </ContentLayout>
}
