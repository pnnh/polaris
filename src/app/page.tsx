import React from 'react'
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/components/server/pathname";
import {calcPagination, replaceSearchParams, SymbolUnknown, tryBase58ToUuid} from "@pnnh/atom";
import {headers} from "next/headers";
import {getTargetLang, langEnUS} from "@/components/common/language";
import {PaginationServer} from "@/components/server/pagination";
import {FileSelectOptions, selectFilesFromBackend} from "@/components/server/tools/tools";
import {PSHomeBody} from "@/components/server/body";
import {css} from "@/gen/styled/css";

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
    let parent = searchParamsValue.parent
    if (parent) {
        const parentUid = tryBase58ToUuid(parent)
        if (parentUid) {
            options.parent = parentUid
        }
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

        width: 1024px;
        margin: 0 auto;
        padding-top: 1rem;
        padding-bottom: 2rem;`
}
