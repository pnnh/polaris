import React from 'react'
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/components/server/pathname";
import {SymbolUnknown} from "@pnnh/atom";
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {getTargetLang, unknownLanguage} from "@/components/common/language";
import {notFound} from "next/navigation";
import {ToolBody} from "@/app/[lang]/tools/tool";

export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const searchParamsValue = await searchParams

    const paramsValue = await params;
    const lang = paramsValue.lang
    if (!lang || getTargetLang(lang, unknownLanguage) === unknownLanguage) {
        notFound()
    }

    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')
    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
        <ToolBody lang={lang}/>
    </ContentLayout>
}
