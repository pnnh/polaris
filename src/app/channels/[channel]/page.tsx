import React from 'react'
import './page.scss'
import Link from 'next/link'
import queryString from 'query-string'
import {serverPhoenixSignin} from "@/services/server/domain/domain";
import {Metadata} from "next";
import {pageTitle} from "@/utils/page";
import ContentLayout from '@/components/server/content/layout'
import {IDomain} from "@/services/common/domain";
import {getPathname} from "@/services/server/pathname";
import {ArticleCard} from "@/components/server/content/article/card";
import {ArticleRankCard} from "@/components/server/content/article/rank";
import {PLSelectResult} from "@/atom/common/models/protocol";
import {PaginationServer} from "@/components/server/pagination";
import {NoData} from "@/components/common/empty";
import {replaceSearchParams} from "@/atom/common/utils/query";
import {base58ToUuid} from "@/atom/common/utils/basex";
import {PSArticleModel} from "@/atom/common/models/article";
import {calcPagination} from "@/atom/common/utils/pagination";

export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: Promise<{ channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const baseParams = await params;
    const searchParamsValue = await searchParams

    let page = Number(searchParamsValue.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 10
    const channelPk = searchParamsValue.channel

    const metadata: Metadata = {}
    metadata.title = pageTitle('')
    const rankQuery = queryString.stringify({
        sort: 'read',
        filter: 'year',
        page: '1',
        direction: 'cta',
        size: 10
    })
    const domain = serverPhoenixSignin()
    const channelUrn = base58ToUuid(baseParams.channel)
    const rankUrl = `/channels/${channelUrn}/articles?${rankQuery}`
    const rankSelectResult = await domain.makeGet<PLSelectResult<PSArticleModel>>(rankUrl)

    const selectQuery = {
        sort: searchParamsValue.sort,
        filter: searchParamsValue.filter,
        page,
        size: pageSize,
        channel: channelPk
    }
    const rawQuery = queryString.stringify(selectQuery)
    const url = `/channels/${channelUrn}/articles?${rawQuery}`

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
    return <ContentLayout lang={'zh'} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={'contentContainer'}>
            <div className={'conMiddle'}>
                <div className={'middleTop'}>
                    <div className={'topLeft'}>
                        <Link className={'sortLink' + sortClass('latest')}
                              href={replaceSearchParams(searchParamsValue, 'sort', 'latest')}>最新</Link>
                        <Link className={'sortLink' + sortClass('read')}
                              href={replaceSearchParams(searchParamsValue, 'sort', 'read')}>阅读数</Link>
                    </div>
                    <div className={'topRight'}>
                        <Link className={'filterLink' + filterClass('month')}
                              href={replaceSearchParams(searchParamsValue, 'filter', 'month')}>一月内</Link>
                        <Link className={'filterLink' + filterClass('year')}
                              href={replaceSearchParams(searchParamsValue, 'filter', 'year')}>一年内</Link>
                        <Link className={'filterLink' + filterClass('all')}
                              href={replaceSearchParams(searchParamsValue, 'filter', 'all')}>所有</Link>
                    </div>
                </div>
                <div className={'middleBody'}>
                    <MiddleBody selectResult={selectResult} domain={domain} lang={'zh'}/>
                </div>
                <div className={'middlePagination'}>
                    <PaginationServer pagination={pagination}
                                      pageLinkFunc={(page) => replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
                </div>
            </div>
            <div className={'conRight'}>
                <ArticleRankCard rankResult={rankSelectResult} lang={'zh'}/>
            </div>
        </div>
    </ContentLayout>
}

function MiddleBody({selectResult, domain, lang}: {
    selectResult: PLSelectResult<PSArticleModel>,
    domain: IDomain,
    lang: string
}) {
    if (!selectResult || !selectResult.data || !selectResult.data.range || selectResult.data.range.length === 0) {
        return <NoData size='large'/>
    }
    return selectResult.data.range.map((model) => {
        return <ArticleCard dir={'dir1'} key={model.uid} model={model} domain={domain} lang={lang}/>
    })
}

