import React from 'react'
import {css} from "@/gen/styled/css";
import {getPathname} from "@/components/server/pathname";
import {CommentsClient} from "@/components/client/comments/comments";
import {useServerConfig} from "@/components/server/config";
import {langEn, SymbolUnknown} from "@pnnh/atom";
import {PageMetadata} from "@/components/common/utils/page";
import Md5Component from "@/components/client/tools/md5/md5";
import {md5Uid, queryApp} from "@/components/server/tools/tools";
import {notFound} from "next/navigation";
import ContentLayout from "@/components/server/content/layout";

const pageStyles = {
    md5Page: css`
        width: 960px;
        margin: 0 auto;
    `,
    productTitle: css`
        font-size: 1.5rem;
        font-weight: 600;
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

    const appInfo = await queryApp(lang, md5Uid)
    if (!appInfo) {
        notFound()
    }

    const metadata = new PageMetadata(lang, appInfo.name)
    metadata.description = appInfo.description
    const serverConfig = await useServerConfig()
    const portalUrl = serverConfig.PUBLIC_PORTAL_URL
    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
        <div className={pageStyles.md5Page}>
            <h1 className={pageStyles.productTitle}>{appInfo.name}</h1>
            <Md5Component lang={lang} appInfo={appInfo}/>
            <div className={pageStyles.commentsClient}>
                <CommentsClient portalUrl={portalUrl} resource={appInfo.uid}
                                lang={lang}/>
            </div>
        </div>
    </ContentLayout>
}
