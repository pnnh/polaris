import React from 'react'
import './page.scss'
import {getPathname} from "@/services/server/pathname";
import {Metadata} from "next";
import ContentLayout from "@/components/server/content/layout";
import {BarCodeComponent} from "@/components/client/tools/qrcode/barcode";

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
        <div className={'barCodePage'}>
            <h1 className={'productTitle'}>{'barcode.title'}</h1>
            <BarCodeComponent lang={'zh'}/>
        </div>
    </ContentLayout>
}
