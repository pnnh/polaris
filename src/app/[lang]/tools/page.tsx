import React from 'react'
import {getPathname} from "@/services/server/pathname";

import {ToolBody} from "@/components/server/tools/tool";
import {langEn} from "@/atom/common/language";
import {PageMetadata} from "@/utils/page";
import ToolsLayout from "@/components/server/tools/layout";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const searchParamsValue = await searchParams

    const metadata = new PageMetadata(lang)
    return <ToolsLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                        metadata={metadata}>
        <ToolBody lang={lang}/>
    </ToolsLayout>
}
