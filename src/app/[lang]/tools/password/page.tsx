import React from 'react'
import './page.scss'
import {Metadata} from "next";
import {PageMetadata, pageTitle} from "@/utils/page";
import ContentLayout from "@/components/server/content/layout";
import {getPathname} from "@/services/server/pathname";
import RandomPasswordPage from "@/atom/client/components/tools/password/random-password";
import {CommentsClient} from "@/photon/client/comments/comments";
import {useServerConfig} from "@/services/server/config";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {langEn} from "@/atom/common/language";
import {getLanguageProvider} from "@/services/common/language";

export default async function Home({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const metadata = new PageMetadata(lang)

    metadata.description = `方便的生成随机密码或是随机字符串，支持自定义密码长度、密码字符集、密码个数等。`
    metadata.keywords = `随机密码,密码生成器,密码工具,密码生成,密码`

    const serverConfig = useServerConfig()
    const portalUrl = serverConfig.PUBLIC_PORTAL_URL
    const langProvider = getLanguageProvider(lang)
    return <ContentLayout userInfo={SymbolUnknown} lang={lang} searchParams={await searchParams} pathname={pathname}
                          metadata={metadata}>
        <div className={'indexPage'}>
            <RandomPasswordPage/>
            <div className={'commentsClient'}>
                <CommentsClient portalUrl={portalUrl} resource={'c26b810d-92c6-5632-a546-3e509e585b96'}
                                lang={lang}/>
            </div>
        </div>
    </ContentLayout>
}
