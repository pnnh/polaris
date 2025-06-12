import React from 'react'
import './page.scss'
import ContentLayout from '@/components/server/content/layout';
import {getPathname} from "@/services/server/pathname";
import {Metadata} from "next";
import {CommentsClient} from "@/atom/client/components/comments/comments";
import {QRCodeComponent} from "@/atom/client/components/tools/qrcode/qrcode";
import {useServerConfig} from "@/services/server/config";
import {SymbolUnknown} from '@/atom/common/models/protocol';
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
        title: '二维码生成器',
        keywords: '二维码生成器',
        description: '二维码生成器',
    }
    const serverConfig = useServerConfig()
    const portalUrl = serverConfig.PUBLIC_PORTAL_URL
    return <ContentLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={'qrCodePage'}>
            <h1 className={'productTitle'}>{'二维码生成器'}</h1>
            <QRCodeComponent lang={'zh'}/>
            <div className={'commentsClient'}>
                <CommentsClient portalUrl={portalUrl} resource={'a28fc8db-482c-37ea-bcb2-e4543d7c6457'}/>
            </div>
        </div>
    </ContentLayout>
}
