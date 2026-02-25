import React from 'react'

import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {getClientIp, getPathname} from "@/components/server/pathname";
import {
    CodeOk,
    CommonResult,
    langEn,
    SymbolUnknown,
    tryBase58ToUuid
} from "@pnnh/atom";
import {PSArticleModel} from "@/components/common/models/article";
import {getDefaultImageUrl, getDefaultNoteImageByUid} from "@/components/common/note";
import ArticleReadLayout from "@/components/server/content/article/layout";
import {useServerConfig} from "@/components/server/config";

import {notFound} from "next/navigation";
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {PSImageServer} from "@/components/server/image";

export const dynamic = "force-dynamic";

export default async function Home({params, searchParams}: {
    params: Promise<{ lang: string, uid: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const metadata = new PageMetadata(lang)
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
    metadata.title = pageTitle(lang, getResult.data.title)

    metadata.description = getResult.data.description
    metadata.keywords = getResult.data.keywords

    let imageUrl = model.url || getDefaultImageUrl()
    return <ArticleReadLayout lang={lang} searchParams={await searchParams} pathname={pathname}
                              metadata={metadata} userInfo={SymbolUnknown}>
        <div>

            <PSImageServer lang={lang} src={imageUrl} alt={model.title} fill={true}/>
        </div>
    </ArticleReadLayout>
}
