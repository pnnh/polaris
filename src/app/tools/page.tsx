import React from 'react'
import './page.scss'
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/services/server/pathname";
import {Metadata} from 'next'
import {ToolBody} from "@/components/server/tools/tool";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {langEn} from "@/atom/common/language";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const searchParamsValue = await searchParams
    const metadata: Metadata = {
        title: 'codegen.seo.title',
        keywords: 'codegen.seo.keywords',
        description: 'codegen.seo.description',
    }
    return <ContentLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={'aboutContainer'}>
            <ToolBody lang={'zh'}/>
        </div>
    </ContentLayout>
}
