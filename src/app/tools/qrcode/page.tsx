import React from 'react'
import './page.scss'
import {QRCodeComponent} from "@/components/client/tools/qrcode/qrcode";
import ContentLayout from '@/components/server/content/layout';
import {getPathname} from "@/services/server/pathname";
import {Metadata} from "next";
import {CommentsClient} from "@/components/client/comments/comments";

export default async function Home({params, searchParams}: {
    params: Promise<{ channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const baseParams = await params;
    const searchParamsValue = await searchParams
    const metadata: Metadata = {
        title: 'codegen.seo.title',
        keywords: 'codegen.seo.keywords',
        description: 'codegen.seo.description',
    }
    return <ContentLayout lang={'zh'} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={'qrCodePage'}>
            <h1 className={'productTitle'}>{'二维码生成器'}</h1>
            <QRCodeComponent lang={'zh'}/>
            <div className={'commentsClient'}>
                <CommentsClient resource={'a28fc8db-482c-37ea-bcb2-e4543d7c6457'}/>
            </div>
        </div>
    </ContentLayout>
}
