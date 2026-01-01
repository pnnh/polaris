import React from 'react'
import styles from './page.module.scss'
import queryString from 'query-string'
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/components/server/pathname";
import {ArticleRankCard} from "@/components/server/content/article/rank";
import {PLSelectResult, SymbolUnknown} from "@pnnh/atom";
import {PaginationServer} from "@/components/server/pagination";
import {replaceSearchParams} from "@pnnh/atom";
import {calcPagination} from "@pnnh/atom";
import {PSArticleModel} from "@/components/common/models/article";
import {langEn} from "@pnnh/atom";
import {ArticleMiddleBody} from "@/components/server/content/article/article";
import {ArticleFilterBar} from "@/components/server/content/article/filter";
import {useServerConfig} from "@/components/server/config";
import {serverMakeGet} from "@pnnh/atom/nodejs";


export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const searchParamsValue = await searchParams
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn

    let page = Number(searchParamsValue.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 10
    const channelPk = searchParamsValue.channel

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
    const serverConfig = await useServerConfig()
    const internalPortalUrl = serverConfig.INTERNAL_PORTAL_URL
    const rankUrl = `${internalPortalUrl}/articles?${rankQuery}`
    const rankSelectResult = await serverMakeGet<PLSelectResult<PSArticleModel>>(rankUrl, '')

    const selectQuery = {
        sort: searchParamsValue.sort,
        filter: searchParamsValue.filter,
        page,
        size: pageSize,
        channel: channelPk,
        lang: lang
    }
    const rawQuery = queryString.stringify(selectQuery)
    const url = `${internalPortalUrl}/articles?${rawQuery}`
    const selectResult = await serverMakeGet<PLSelectResult<PSArticleModel>>(url, '')

    const pagination = calcPagination(page, selectResult.data.count, pageSize)
    return <ContentLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={styles.contentContainer}>
            <div className={styles.conMiddle}>
                <ArticleFilterBar lang={lang} searchParamsValue={searchParamsValue}/>
                <ArticleMiddleBody selectResult={selectResult} lang={lang}/>
                <div className={styles.middlePagination}>
                    <PaginationServer lang={lang} pagination={pagination}
                                      pageLinkFunc={(page) =>
                                          `/${lang}/articles` + replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
                </div>
            </div>
            <div className={styles.conRight}>
                <ArticleRankCard rankResult={rankSelectResult} lang={lang}/>
            </div>
        </div>
    </ContentLayout>
}


