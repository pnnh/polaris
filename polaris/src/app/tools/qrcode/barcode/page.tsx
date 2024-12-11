import React from 'react'
import './page.scss'
import {useServerTranslation} from "@/services/server/i18n";
import {getPathname} from "@/services/server/pathname";
import {Metadata} from "next";
import ContentLayout from "@/components/server/content/layout";
import {BaseRouterParams} from "@/models/server/router";
import {BarCodeComponent} from "@/components/client/tools/qrcode/barcode";

export default async function Home({params, searchParams}: {
    params: Promise<{ channel: string } & BaseRouterParams>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const baseParams = await params;
    const searchParamsValue = await searchParams
    const {t: trans} = await useServerTranslation(baseParams.lang)
    const metadata: Metadata = {
        title: trans('codegen.seo.title'),
        keywords: trans('codegen.seo.keywords'),
        description: trans('codegen.seo.description'),
    }
    return <ContentLayout lang={baseParams.lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} params={baseParams}>
        <div className={'barCodePage'}>
            <h1 className={'productTitle'}>{trans('barcode.title')}</h1>
            <BarCodeComponent lang={baseParams.lang}/>
        </div>
    </ContentLayout>
}
