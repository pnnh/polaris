import React from 'react'
import './page.scss'
import Link from 'next/link'
import queryString from 'query-string'
import {serverSigninDomain} from "@/services/server/domain/domain";
import {Metadata} from "next";
import {pageTitle} from "@/utils/page";
import ContentLayout from '@/components/server/content/layout'
import {IDomain} from "@/services/common/domain";
import {getPathname} from "@/services/server/pathname";
import {ArticleCard} from "@/components/server/content/article/card";
import {ArticleRankCard} from "@/components/server/content/article/rank";
import {PLSelectResult} from "@/models/common/common-result";
import {PSArticleModel} from "@/models/common/article";
import {BaseRouterParams} from '@/models/server/router'
import {useServerTranslation} from '@/services/server/i18n'
import {PaginationServer} from "@/components/server/pagination";
import {NoData} from "@/components/common/empty";
import {calcPagination} from "@/utils/pagination";
import {replaceSearchParams} from "@/utils/query";

export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: Promise<{ channel: string } & BaseRouterParams>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const baseParams = await params;
    const {t: trans} = await useServerTranslation(baseParams.lang)
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
    const domain = serverSigninDomain()
    const rankUrl = `/articles/${baseParams.channel}/articles?${rankQuery}`
    const rankSelectResult = await domain.makeGet<PLSelectResult<PSArticleModel>>(rankUrl)

    const selectQuery = {
        sort: searchParamsValue.sort,
        filter: searchParamsValue.filter,
        page,
        size: pageSize,
        channel: channelPk
    }
    const rawQuery = queryString.stringify(selectQuery)
    const url = `/articles/${baseParams.channel}/articles?${rawQuery}`

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
    return <ContentLayout lang={baseParams.lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} params={baseParams}>
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
                    <MiddleBody selectResult={selectResult} domain={domain} lang={baseParams.lang}/>
                </div>
                <div className={'middlePagination'}>
                    <PaginationServer pagination={pagination}
                                      pageLinkFunc={(page) => replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
                </div>
            </div>
            <div className={'conRight'}>
                <ArticleRankCard rankResult={rankSelectResult} lang={baseParams.lang}/>
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
        return <ArticleCard key={model.urn} model={model} domain={domain} lang={lang}/>
    })
}

