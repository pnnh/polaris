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
import {serverPortalSignin} from "@/services/server/domain/domain";
import {PSArticleModel} from "@/photon/common/models/article";
import {calcPagination} from "@/atom/common/utils/pagination";
import {ArticleMiddleBody} from "@/components/server/content/article/article";
import {langEn} from "@/atom/common/language";
import {ArticleFilterBar} from "@/components/server/content/article/filter";
import {getLanguageProvider} from "@/services/common/language";

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
        size: 10,
        lang: lang
    })
    let domain = serverPortalSignin()
    const rankUrl = `/articles?${rankQuery}`
    const rankSelectResult = await domain.makeGet<PLSelectResult<PSArticleModel>>(rankUrl)

    const selectQuery = {
        sort: searchParamsValue.sort,
        filter: searchParamsValue.filter,
        page,
        size: pageSize,
        lang: lang
    }
    const rawQuery = queryString.stringify(selectQuery)
    const url = `/articles?${rawQuery}`

    const selectResult = await domain.makeGet<PLSelectResult<PSArticleModel>>(url)

    const pagination = calcPagination(page, selectResult.data.count, pageSize)

    const langProvider = getLanguageProvider(lang)
    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>

        <div className={styles.contentContainer}>
            <div className={styles.conMiddle}>
                <ArticleFilterBar langProvider={langProvider} searchParamsValue={searchParamsValue}/>
                <ArticleMiddleBody selectResult={selectResult} domain={domain} lang={lang}/>
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

