import React from 'react'
import {css} from "@/gen/styled/css";
import {getPathname} from "@/components/server/pathname";
import {UuidToolBody} from "@/components/client/tools/uuid/tool";
import {CommentsClient} from "@/components/client/comments/comments";
import {useServerConfig} from "@/components/server/config";
import {langEn, SymbolUnknown} from "@pnnh/atom";
import {PageMetadata} from "@/components/common/utils/page";
import {queryApp, uuidUid} from "@/components/server/tools/tools";
import {notFound} from "next/navigation";
import ContentLayout from "@/components/server/content/layout";

const pageStyles = {
    uuidPage: css`
        width: 1024px;
        margin: 0 auto;
    `,
    pageContent: css`
        display: flex;
        flex-direction: row;
        justify-items: center;
        align-items: center;
        margin-top: 32px;
        margin-bottom: 1rem;
    `,
    commentsClient: css`
        margin-top: 2rem;
    `
}

export default async function Home({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const searchParamsValue = await searchParams
    const appInfo = await queryApp(lang, uuidUid)
    if (!appInfo) {
        notFound()
    }

    const metadata = new PageMetadata(lang)

    metadata.title = appInfo.name
    metadata.description = appInfo.description
    const serverConfig = await useServerConfig()
    const portalUrl = serverConfig.PUBLIC_PORTAL_URL
    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
        <div className={pageStyles.uuidPage}>
            <div className={pageStyles.pageContent}>
                <UuidToolBody lang={lang} appInfo={appInfo}/>
            </div>
            <div className={pageStyles.commentsClient}>
                <CommentsClient portalUrl={portalUrl} resource={uuidUid}
                                lang={lang}/>
            </div>
        </div>
    </ContentLayout>
}
