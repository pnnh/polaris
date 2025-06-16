import React from 'react'
import styles from './page.module.scss'
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/services/server/pathname";
import {PLSelectResult, SymbolUnknown} from "@/atom/common/models/protocol";
import {replaceSearchParams} from "@/atom/common/utils/query";
import {PaginationServer} from "@/components/server/pagination";
import {ArticleRankCard} from "@/components/server/content/article/rank";
import {PageMetadata, pageTitle} from "@/utils/page";
import queryString from "query-string";
import {serverPhoenixSignin} from "@/services/server/domain/domain";
import {PSArticleModel} from "@/atom/common/models/article";
import {calcPagination} from "@/atom/common/utils/pagination";
import {ArticleMiddleBody} from "@/components/server/content/article/article";
import {langEn} from "@/atom/common/language";

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
    const pageSize = 10
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn

    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')
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
    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>

        <div className={styles.contentContainer}>
            <div className={styles.conMiddle}>
                <div className={styles.middleTop}>
                    <div className={styles.topLeft}>
                        <a className={styles.sortLink + sortClass('read')}
                           href={replaceSearchParams(searchParamsValue, 'sort', 'latest')}>最新</a>
                        <a className={styles.sortLink + sortClass('read')}
                           href={replaceSearchParams(searchParamsValue, 'sort', 'read')}>阅读数</a>
                    </div>
                    <div className={styles.topRight}>
                        <a className={styles.filterLink + filterClass('month')}
                           href={replaceSearchParams(searchParamsValue, 'filter', 'month')}>一月内</a>
                        <a className={styles.filterLink + filterClass('year')}
                           href={replaceSearchParams(searchParamsValue, 'filter', 'year')}>一年内</a>
                        <a className={styles.filterLink + filterClass('all')}
                           href={replaceSearchParams(searchParamsValue, 'filter', 'all')}>所有</a>
                    </div>
                </div>
                <div className={styles.middleBody}>
                    <ArticleMiddleBody selectResult={selectResult} domain={domain} lang={lang} dir={currentDir}/>
                </div>
                <div className={styles.middlePagination}>
                    <PaginationServer pagination={pagination}
                                      pageLinkFunc={(page) =>
                                          `${lang}/articles` + replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
                </div>
            </div>
            <div className={styles.conRight}>
                <ArticleRankCard rankResult={rankSelectResult} lang={lang}/>
            </div>
        </div>
    </ContentLayout>
}

