import React from 'react'
import {css} from "@/gen/styled/css";
import {getPathname} from "@/components/server/pathname";
import {CommentsClient} from "@/components/client/comments/comments";
import {useServerConfig} from "@/components/server/config";
import {langEn, SymbolUnknown} from "@pnnh/atom";
import {PageMetadata} from "@/components/common/utils/page";
import Base32Component from "@/components/client/tools/base32/base32";
import {base32Uid, queryApp} from "@/components/server/tools/tools";
import ContentLayout from "@/components/server/content/layout";
import {notFound} from "next/navigation";

const pageStyles = {
    base32Page: css`
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

    const appInfo = await queryApp(lang, base32Uid)
    if (!appInfo) {
        notFound()
    }

    const metadata = new PageMetadata(lang, appInfo.name)
    metadata.description = appInfo.description
    const serverConfig = await useServerConfig()
    const portalUrl = serverConfig.PUBLIC_PORTAL_URL
    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
        <div className={pageStyles.base32Page}>
            <h1 className={pageStyles.productTitle}>{appInfo.name}</h1>
            <Base32Component lang={lang} appInfo={appInfo}/>
            <div className={pageStyles.commentsClient}>
                <CommentsClient portalUrl={portalUrl} resource={appInfo.uid}
                                lang={lang}/>
            </div>
        </div>
    </ContentLayout>
}
