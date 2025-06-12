import React from 'react'
import styles from './page.module.scss'
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/services/server/pathname";
import {Metadata} from 'next'
import Link from "next/link";
import {PLSelectResult, SymbolUnknown} from "@/atom/common/models/protocol";
import {replaceSearchParams} from "@/atom/common/utils/query";
import {PaginationServer} from "@/components/server/pagination";
import {ArticleRankCard} from "@/components/server/content/article/rank";
import {pageTitle} from "@/utils/page";
import queryString from "query-string";
import {serverPhoenixSignin} from "@/services/server/domain/domain";
import {PSArticleModel} from "@/atom/common/models/article";
import {calcPagination} from "@/atom/common/utils/pagination";
import {IDomain} from "@/services/common/domain";
import {NoData} from "@/components/common/empty";
import {ArticleCard} from "@/components/server/content/article/card";

export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: Promise<{ channel: string }>,
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
    const currentDir = 'dir1'
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
        return ' ' + (querySort === sort ? styles.activeLink : '')
    }
    const filterClass = (filter: string) => {
        const queryFilter = (searchParamsValue.filter ?? 'all')
        return ' ' + (queryFilter === filter ? styles.activeLink : '')
    }
    return <ContentLayout lang={'zh'} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>

        <div className={styles.contentContainer}>
            <div className={styles.conMiddle}>
                <div className={styles.middleTop}>
                    <div className={styles.topLeft}>
                        <Link className={styles.sortLink + sortClass('read')}
                              href={replaceSearchParams(searchParamsValue, 'sort', 'latest')}>最新</Link>
                        <Link className={styles.sortLink + sortClass('read')}
                              href={replaceSearchParams(searchParamsValue, 'sort', 'read')}>阅读数</Link>
                    </div>
                    <div className={styles.topRight}>
                        <Link className={styles.filterLink + filterClass('month')}
                              href={replaceSearchParams(searchParamsValue, 'filter', 'month')}>一月内</Link>
                        <Link className={styles.filterLink + filterClass('year')}
                              href={replaceSearchParams(searchParamsValue, 'filter', 'year')}>一年内</Link>
                        <Link className={styles.filterLink + filterClass('all')}
                              href={replaceSearchParams(searchParamsValue, 'filter', 'all')}>所有</Link>
                    </div>
                </div>
                <div className={styles.middleBody}>
                    <MiddleBody selectResult={selectResult} domain={domain} lang={'zh'} dir={currentDir}/>
                </div>
                <div className={styles.middlePagination}>
                    <PaginationServer pagination={pagination}
                                      pageLinkFunc={(page) =>
                                          '/articles' + replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
                </div>
            </div>
            <div className={styles.conRight}>
                <ArticleRankCard rankResult={rankSelectResult} lang={'zh'}/>
            </div>
        </div>
    </ContentLayout>
}


function MiddleBody({selectResult, domain, lang, dir}: {
    selectResult: PLSelectResult<PSArticleModel>,
    domain: IDomain,
    lang: string,
    dir: string
}) {
    if (!selectResult || !selectResult.data || !selectResult.data.range || selectResult.data.range.length === 0) {
        return <NoData size='large'/>
    }
    return selectResult.data.range.map((model, index) => {
        return <ArticleCard key={index} model={model} domain={domain} lang={lang} dir={dir}/>
    })
}

