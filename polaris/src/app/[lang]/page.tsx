import React from 'react'
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/components/server/pathname";
import {calcPagination, replaceSearchParams, SymbolUnknown} from "@pnnh/atom";
import {getTargetLang, unknownLanguage} from "@/components/common/language";
import {notFound} from "next/navigation";
import {PSHomeBody} from "@/components/server/body";
import {serverLogDebugMeta} from "@/components/server/logger";
import {css} from "@/gen/styled/css";
import {FileSelectOptions, selectFilesFromBackend} from "@/components/community/files";
import {PaginationServer} from "@/components/widget/pagination";

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
        page, size: pageSize, skipDir: true
    }
    serverLogDebugMeta("select files with options", options)
    const selectResult = await selectFilesFromBackend(options)
    const pagination = calcPagination(page, selectResult.data.count, pageSize)
    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          userInfo={SymbolUnknown}>

        <PSHomeBody lang={lang} searchParams={searchParamsValue} selectResult={selectResult}/>

        <div className={paginationStyles.paginationContainer}>
            <PaginationServer lang={lang} pagination={pagination}
                              pageLinkFunc={(page) =>
                                  `/${lang}` + replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
        </div>
    </ContentLayout>
}

const paginationStyles = {
    paginationContainer: css`
        width: 100%;
        max-width: 80rem;
        margin: 0 auto;
        padding: 0.5rem 1rem 1.5rem;
    `
}
