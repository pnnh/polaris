import React from 'react'
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/components/server/pathname";
import {calcPagination, replaceSearchParams, SymbolUnknown, tryBase58ToUuid} from "@pnnh/atom";
import {PageMetadata} from "@/components/common/utils/page";
import {headers} from "next/headers";
import {langEnUS} from "@/components/common/language";
import {filterAcceptLanguage} from "@/components/server/language";
import {PaginationServer} from "@/components/server/pagination";
import {FileSelectOptions, selectFilesFromBackend} from "@/components/server/tools/tools";
import {PSHomeBody} from "@/components/server/body";
import {notFound} from "next/navigation";

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
    const lang = filterAcceptLanguage(acceptLang)

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
    const metadata = new PageMetadata(lang)
    const selectResult = await selectFilesFromBackend(options)
    const pagination = calcPagination(page, selectResult.data.count, pageSize)

    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>

        <PSHomeBody lang={lang} searchParams={searchParamsValue} selectResult={selectResult}/>
        <div>
            <PaginationServer lang={lang} pagination={pagination}
                              pageLinkFunc={(page) => `/${lang}` + replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
        </div>
    </ContentLayout>
}


