import React from 'react'
import './page.scss'
import Link from 'next/link'
import {replaceSearchParams} from '@pnnh/atom'
import queryString from 'query-string'
import {NoData} from '@pnnh/atom-react'
import {PaginationServer, PSImageServer} from '@pnnh/atom-react/server'
import {PLSelectResult} from '@pnnh/polaris-business'
import {calcPagination} from "@pnnh/atom";
import {PSArticleModel} from "@pnnh/polaris-business";
import {serverSigninDomain} from "@/services/server/domain/domain";
import {Metadata} from "next";
import {pageTitle} from "@/utils/page";
import ContentLayout from '@/components/server/content/layout'
import {IDomain} from "@/services/common/domain";
import {getPathname} from "@/services/server/pathname";
import {ArticleCard} from "@/components/server/article/card";
import {ArticleRankCard} from "@/components/server/article/rank";

export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: { channel: string },
    searchParams: Record<string, string>
}) {
    let page = Number(searchParams.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 10
    const channelPk = searchParams.channel

    const metadata: Metadata = {}
    metadata.title = pageTitle('')
    const rankQuery = queryString.stringify({
        sort: 'read',
        filter: 'year',
        page: '1',
        direction: 'cta',
        size: 10
    })
    const domain = serverSigninDomain()
    const rankUrl = `/channels/${params.channel}/articles?${rankQuery}`
    const rankSelectResult = await domain.makeGet<PLSelectResult<PSArticleModel>>(rankUrl)

    const selectQuery = {
        sort: searchParams.sort,
        filter: searchParams.filter,
        page,
        size: pageSize,
        channel: channelPk
    }
    const rawQuery = queryString.stringify(selectQuery)
    const url = `/channels/${params.channel}/articles?${rawQuery}`

    const selectResult = await domain.makeGet<PLSelectResult<PSArticleModel>>(url)

    const pagination = calcPagination(page, selectResult.count, pageSize)
    const sortClass = (sort: string) => {
        const querySort = (searchParams.sort ?? 'latest')
        return ' ' + (querySort === sort ? 'activeLink' : '')
    }
    const filterClass = (filter: string) => {
        const queryFilter = (searchParams.filter ?? 'all')
        return ' ' + (queryFilter === filter ? 'activeLink' : '')
    }
    const pathname = getPathname()
    return <ContentLayout searchParams={searchParams} pathname={pathname} metadata={metadata}>
        <div className={'contentContainer'}>
            <div className={'conMiddle'}>
                <div className={'middleTop'}>
                    <div className={'topLeft'}>
                        <Link className={'sortLink' + sortClass('latest')}
                              href={replaceSearchParams(searchParams, 'sort', 'latest')}>最新</Link>
                        <Link className={'sortLink' + sortClass('read')}
                              href={replaceSearchParams(searchParams, 'sort', 'read')}>阅读数</Link>
                    </div>
                    <div className={'topRight'}>
                        <Link className={'filterLink' + filterClass('month')}
                              href={replaceSearchParams(searchParams, 'filter', 'month')}>一月内</Link>
                        <Link className={'filterLink' + filterClass('year')}
                              href={replaceSearchParams(searchParams, 'filter', 'year')}>一年内</Link>
                        <Link className={'filterLink' + filterClass('all')}
                              href={replaceSearchParams(searchParams, 'filter', 'all')}>所有</Link>
                    </div>
                </div>
                <div className={'middleBody'}>
                    <MiddleBody selectResult={selectResult} domain={domain}/>
                </div>
                <div className={'middlePagination'}>
                    <PaginationServer pagination={pagination}
                                      pageLinkFunc={(page) => replaceSearchParams(searchParams, 'page', page.toString())}/>
                </div>
            </div>
            <div className={'conRight'}>
                <ArticleRankCard rankResult={rankSelectResult}/>
            </div>
        </div>
    </ContentLayout>
}

function MiddleBody({selectResult, domain}: { selectResult: PLSelectResult<PSArticleModel>, domain: IDomain }) {
    if (!selectResult || !selectResult.range || selectResult.range.length === 0) {
        return <NoData size='large'/>
    }
    return selectResult.range.map((model) => {
        return <ArticleCard key={model.urn} model={model} domain={domain}/>
    })
}

