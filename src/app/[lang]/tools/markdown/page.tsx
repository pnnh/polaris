import React from 'react'
import styles from './page.module.scss'
import {getPathname} from "@/components/server/pathname";
import {CommentsClient} from "@/components/client/comments/comments";
import {useServerConfig} from "@/components/server/config";
import {langEn} from "@/atom/common/language";
import {PageMetadata} from "@/components/common/utils/page";
import MarkdownComponent from "@/components/client/tools/markdown/markdown";
import {markdownUid, queryApp} from "@/components/server/tools/tools";
import {notFound} from "next/navigation";
import ContentLayout from "@/components/server/content/layout";
import {SymbolUnknown} from "@/atom/common/models/protocol";

export default async function Home({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const searchParamsValue = await searchParams

    const appInfo = queryApp(lang, markdownUid)
    if (!appInfo) {
        notFound()
    }

    const metadata = new PageMetadata(lang, appInfo.name)
    metadata.description = appInfo.description
    const serverConfig = await useServerConfig()
    const portalUrl = serverConfig.PUBLIC_PORTAL_URL
    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
        <div className={styles.markdownPage}>
            <h1 className={styles.productTitle}>{appInfo.name}</h1>
            <MarkdownComponent lang={lang}/>
            <div className={styles.commentsClient}>
                <CommentsClient portalUrl={portalUrl} resource={appInfo.uid}
                                lang={lang}/>
            </div>
        </div>
    </ContentLayout>
}
