import React from 'react'
import './page.scss'
import {getPathname} from "@/services/server/pathname";
import {Metadata} from "next";
import ContentLayout from "@/components/server/content/layout";
import {ToolBody} from "@/atom/client/components/tools/uuid/tool";
import {CommentsClient} from "@/atom/client/components/comments/comments";
import {useServerConfig} from "@/services/server/config";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {langEn} from "@/atom/common/language";

export default async function Home({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const searchParamsValue = await searchParams
    const metadata: Metadata = {
        title: 'UUID生成器',
        keywords: 'UUID生成器',
        description: '各版本UUID生成器',
    }
    const serverConfig = useServerConfig()
    const portalUrl = serverConfig.PUBLIC_PORTAL_URL
    return <ContentLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={'uuidPage'}>
            <div className={'pageContent'}>
                <ToolBody lang={lang}/>
            </div>
            <div className={'commentsClient'}>
                <CommentsClient portalUrl={portalUrl} resource={'1efce644-be3b-6380-8e9f-473511aecbe1'}/>
            </div>
        </div>
    </ContentLayout>
}
