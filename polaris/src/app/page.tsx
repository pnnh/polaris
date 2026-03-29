import React from 'react'
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/components/server/pathname";
import {calcPagination, replaceSearchParams, SymbolUnknown} from "@pnnh/atom";
import {headers} from "next/headers";
import {getTargetLang, langEnUS} from "@/components/common/language";
import {PSHomeBody} from "@/components/server/body";
import {css} from "@/gen/styled/css";
import {FileSelectOptions, selectFilesFromBackend} from "@/components/community/files";
import {PaginationServer} from "@/components/widget/pagination";

export default async function Page({searchParams}: {
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const searchParamsValue = await searchParams

    let page = Number(searchParamsValue.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 16
    const headersList = await headers()
    const acceptLang = headersList.get('Accept-Language') || langEnUS
    const lang = getTargetLang(acceptLang, langEnUS)

    const options: FileSelectOptions = {
        page, size: pageSize
    }
    const selectResult = await selectFilesFromBackend(options)
    const pagination = calcPagination(page, selectResult.data.count, pageSize)

    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          userInfo={SymbolUnknown}>

        <PSHomeBody lang={lang} searchParams={searchParamsValue} selectResult={selectResult}/>
        <div className={paginationStyles.paginationContainer}>
            <PaginationServer lang={lang} pagination={pagination}
                              pageLinkFunc={(page) => `/${lang}` + replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
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
