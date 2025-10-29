import React from 'react'
import './page.scss'
import queryString from 'query-string'
import {serverPortalSignin} from "@/components/server/domain/domain";
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/components/server/pathname";
import {CommonResult, PLSelectResult, SymbolUnknown} from "@/atom/common/models/protocol";

import {NoData} from "@/components/common/empty";
import {PaginationServer} from "@/components/server/pagination";
import {replaceSearchParams} from "@/atom/common/utils/query";
import {PSArticleModel} from "@/photon/common/models/article";
import {calcPagination} from "@/atom/common/utils/pagination";
import {ArticleMiddleBody} from "@/components/server/content/article/article";
import {langEn} from "@/atom/common/language";
import {PageMetadata} from "@/components/common/utils/page";

export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn

    const metadata = new PageMetadata(lang)
    const searchParamsValue = await searchParams
    let page = Number(searchParamsValue.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 10
    const channelPk = searchParamsValue.channel

    let domain = await serverPortalSignin()
    const selectQuery = {
        sort: searchParamsValue.sort,
        filter: searchParamsValue.filter,
        page,
        size: pageSize,
        channel: channelPk,
        keyword: searchParamsValue.keyword
    }
    const rawQuery = queryString.stringify(selectQuery)
    const url = `/articles?${rawQuery}`

    const selectResult = await domain.makeGet<PLSelectResult<PSArticleModel>>(url)
    if (!selectResult || !selectResult.data) {
        return <NoData size={'large'}/>
    }
    const pagination = calcPagination(page, selectResult.data.count, pageSize)
    return <ContentLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={'searchPage'}>
            <div className={'pageContainer'}>
                <div>
                    <div className={'condLabel'}>搜索关键词:</div>
                    {searchParamsValue.keyword}
                </div>
            </div>
            <div className={'contentContainer'}>
                <div className={'conMiddle'}>
                    <ArticleMiddleBody selectResult={selectResult} domain={domain} lang={lang}/>

                    <div className={'middlePagination'}>
                        <PaginationServer lang={lang} pagination={pagination}
                                          pageLinkFunc={(page) => '/search' + replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
                    </div>
                </div>
            </div>
        </div>
    </ContentLayout>
}

