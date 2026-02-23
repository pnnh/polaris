import React from 'react'
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/components/server/pathname";
import {calcPagination, replaceSearchParams, SymbolUnknown, tryBase58ToUuid} from "@pnnh/atom";
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {getTargetLang, unknownLanguage} from "@/components/common/language";
import {notFound} from "next/navigation";
import {FileSelectOptions, selectFilesFromBackend} from "@/components/server/tools/tools";
import {PaginationServer} from "@/components/server/pagination";
import {PSHomeBody} from "@/components/server/body";
import {serverLogDebugMeta} from "@/components/server/logger";

export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const searchParamsValue = await searchParams

    let page = Number(searchParamsValue.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 16

    const paramsValue = await params;
    const lang = paramsValue.lang
    if (!lang || getTargetLang(lang, unknownLanguage) === unknownLanguage) {
        notFound()
    }
    const options: FileSelectOptions = {
        page, size: pageSize
    }
    let parent = searchParamsValue.parent
    if (parent) {
        const parentUid = tryBase58ToUuid(parent)
        if (parentUid) {
            options.parent = parentUid
        }
    }
    serverLogDebugMeta("select files with options", options)
    const selectResult = await selectFilesFromBackend(options)
    const pagination = calcPagination(page, selectResult.data.count, pageSize)
    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')
    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>

        <PSHomeBody lang={lang} searchParams={searchParamsValue} selectResult={selectResult}/>

        <div>
            <PaginationServer lang={lang} pagination={pagination}
                              pageLinkFunc={(page) =>
                                  `/${lang}` + replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
        </div>
    </ContentLayout>
}
