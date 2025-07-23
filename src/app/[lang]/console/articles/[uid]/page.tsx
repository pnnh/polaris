import React from 'react'
import {PageMetadata, pageTitle} from "@/utils/page";
import {getClientIp, getPathname} from "@/services/server/pathname";
import {base58ToUuid} from "@/atom/common/utils/basex";
import {CodeOk, CommonResult, SymbolUnknown} from "@/atom/common/models/protocol";
import {useServerConfig} from "@/services/server/config";
import {langEn} from "@/atom/common/language";
import {notFound} from "next/navigation";
import ConsoleLayout from "@/components/server/console/layout";
import {ConsoleArticleForm} from "@/app/[lang]/console/articles/[uid]/form";
import {serverGetArticle} from "@/services/server/articles/articles";
import {PSArticleModel} from "@/photon/common/models/article";
import {EmptyUUID} from "@/atom/common/utils/uuid";

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
    const portalUrl = serverConfig.PUBLIC_PORTAL_URL
    const articleUrn = base58ToUuid(paramsValue.uid)
    const isNew = articleUrn === EmptyUUID;
    let model: PSArticleModel | undefined = undefined;
    if (isNew) {
        model = {
            channel: "",
            cid: "",
            cover: "",
            coverUrl: "",
            creator: "",
            discover: 0,
            header: "",
            owner: "",
            partition: "",
            path: "",
            uid: EmptyUUID,     // 设置为空以供form表单识别是新建文章
            title: '',
            description: '',
            keywords: '',
            body: '',
            lang,
            create_time: new Date().toISOString(),
            update_time: new Date().toISOString()
        }
    } else {
        if (!articleUrn) {
            notFound();
        }
        model = await serverGetArticle(portalUrl, articleUrn)
        if (!model || !model.uid) {
            notFound();
        }
        metadata.title = pageTitle(lang, model.title)

        metadata.description = model.description
        metadata.keywords = model.keywords

        if (!model.body) {
            return <div>暂不支持的文章类型</div>
        }
    }
    const modelString = JSON.stringify(model)
    return <ConsoleLayout lang={lang} searchParams={await searchParams} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
        <ConsoleArticleForm portalUrl={portalUrl} modelString={modelString}/>
    </ConsoleLayout>
}
