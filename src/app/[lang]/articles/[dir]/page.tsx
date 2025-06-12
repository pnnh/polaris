import React from 'react'
import './page.scss'
import Link from 'next/link'
import queryString from 'query-string'
import {serverPhoenixSignin, serverPortalSignin} from "@/services/server/domain/domain";
import {Metadata} from "next";
import {pageTitle} from "@/utils/page";
import ContentLayout from '@/components/server/content/layout'
import {IDomain} from "@/services/common/domain";
import {getPathname} from "@/services/server/pathname";
import {ArticleCard} from "@/components/server/content/article/card";
import {ArticleRankCard} from "@/components/server/content/article/rank";
import {PLSelectResult, SymbolUnknown} from "@/atom/common/models/protocol";
import {PaginationServer} from "@/components/server/pagination";
import {NoData} from "@/components/common/empty";
import {replaceSearchParams} from "@/atom/common/utils/query";
import {calcPagination} from "@/atom/common/utils/pagination";
import {PSArticleModel} from "@/atom/common/models/article";
import {ArticleMiddleBody} from "@/components/server/content/article/article";
import {langEn} from "@/atom/common/language";

export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, dir: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const searchParamsValue = await searchParams

    let page = Number(searchParamsValue.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 10
    const channelPk = searchParamsValue.channel
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn

    const metadata: Metadata = {}
    metadata.title = pageTitle('')
    const rankQuery = queryString.stringify({
        sort: 'read',
        filter: 'year',
        page: '1',
        direction: 'cta',
        size: 10
    })
    let domain = serverPhoenixSignin()
    const currentDir = paramsValue.dir || 'dir1'
    if (currentDir === 'dir2') {
        domain = serverPortalSignin()
    }
    const rankUrl = `/articles?${rankQuery}`
    const rankSelectResult = await domain.makeGet<PLSelectResult<PSArticleModel>>(rankUrl)

    const selectQuery = {
        sort: searchParamsValue.sort,
        filter: searchParamsValue.filter,
        page,
        size: pageSize,
        channel: channelPk
    }
    const rawQuery = queryString.stringify(selectQuery)
    const url = `/articles?${rawQuery}`

    const selectResult = await domain.makeGet<PLSelectResult<PSArticleModel>>(url)

    const pagination = calcPagination(page, selectResult.data.count, pageSize)
    const sortClass = (sort: string) => {
        const querySort = (searchParamsValue.sort ?? 'latest')
        return ' ' + (querySort === sort ? 'activeLink' : '')
    }
    const filterClass = (filter: string) => {
        const queryFilter = (searchParamsValue.filter ?? 'all')
        return ' ' + (queryFilter === filter ? 'activeLink' : '')
    }
    return <ContentLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={'contentContainer'}>
            <div className={'conMiddle'}>
                <div className={'middleTop'}>
                    <div className={'topLeft'}>
                        <a className={'sortLink' + sortClass('latest')}
                           href={replaceSearchParams(searchParamsValue, 'sort', 'latest')}>最新</a>
                        <a className={'sortLink' + sortClass('read')}
                           href={replaceSearchParams(searchParamsValue, 'sort', 'read')}>阅读数</a>
                    </div>
                    <div className={'topRight'}>
                        <a className={'filterLink' + filterClass('month')}
                           href={replaceSearchParams(searchParamsValue, 'filter', 'month')}>一月内</a>
                        <a className={'filterLink' + filterClass('year')}
                           href={replaceSearchParams(searchParamsValue, 'filter', 'year')}>一年内</a>
                        <a className={'filterLink' + filterClass('all')}
                           href={replaceSearchParams(searchParamsValue, 'filter', 'all')}>所有</a>
                    </div>
                </div>
                <div className={'middleBody'}>
                    <ArticleMiddleBody selectResult={selectResult} domain={domain} lang={lang} dir={currentDir}/>
                </div>
                <div className={'middlePagination'}>
                    <PaginationServer pagination={pagination}
                                      pageLinkFunc={(page) =>
                                          '/articles' + replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
                </div>
            </div>
            <div className={'conRight'}>
                <ArticleRankCard rankResult={rankSelectResult} lang={lang}/>
            </div>
        </div>
    </ContentLayout>
}
