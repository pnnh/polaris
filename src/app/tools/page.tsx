import React from 'react'
import './page.scss'
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/services/server/pathname";
import {Metadata} from 'next'
import {ToolBody} from "@/components/server/tools/tool";
import {SymbolUnknown} from "@/atom/common/models/protocol";

export default async function Page({params, searchParams}: {
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
    return <ContentLayout userInfo={SymbolUnknown} lang={'zh'} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={'aboutContainer'}>
            <ToolBody lang={'zh'}/>
        </div>
    </ContentLayout>
}
