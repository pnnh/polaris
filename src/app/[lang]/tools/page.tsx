import React from 'react'
import {getPathname} from "@/components/server/pathname";

import {langEn} from "@pnnh/atom";
import {PageMetadata} from "@/components/common/utils/page";
import ContentLayout from "@/components/server/content/layout";
import {SymbolUnknown} from "@pnnh/atom";
import {ToolBody} from "./tool";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const searchParamsValue = await searchParams

    const metadata = new PageMetadata(lang)
    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
        <ToolBody lang={lang}/>
    </ContentLayout>
}
