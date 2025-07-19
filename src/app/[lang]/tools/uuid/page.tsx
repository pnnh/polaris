import React from 'react'
import './page.scss'
import {getPathname} from "@/services/server/pathname";
import ContentLayout from "@/components/server/content/layout";
import {ToolBody} from "@/atom/client/components/tools/uuid/tool";
import {CommentsClient} from "@/photon/client/comments/comments";
import {useServerConfig} from "@/services/server/config";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {langEn} from "@/atom/common/language";
import {PageMetadata} from "@/utils/page";
import {getLanguageProvider} from "@/services/common/language";

export default async function Home({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const searchParamsValue = await searchParams

    const metadata = new PageMetadata(lang)

    metadata.title = 'UUID生成器'
    metadata.description = '各版本UUID生成器'
    metadata.keywords = 'UUID生成器,UUID工具,UUID生成'
    const serverConfig = useServerConfig()
    const portalUrl = serverConfig.PUBLIC_PORTAL_URL
    const langProvider = getLanguageProvider(lang)
    return <ContentLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={'uuidPage'}>
            <div className={'pageContent'}>
                <ToolBody lang={lang}/>
            </div>
            <div className={'commentsClient'}>
                <CommentsClient portalUrl={portalUrl} resource={'1efce644-be3b-6380-8e9f-473511aecbe1'}
                                lang={lang}/>
            </div>
        </div>
    </ContentLayout>
}
