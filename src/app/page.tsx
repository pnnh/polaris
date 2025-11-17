import React from 'react'
import styles from './page.module.scss'
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/components/server/pathname";
import {PLSelectResult, SymbolUnknown} from "@/atom/common/models/protocol";
import {replaceSearchParams} from "@/atom/common/utils/query";
import {PaginationServer} from "@/components/server/pagination";
import {ArticleRankCard} from "@/components/server/content/article/rank";
import {PageMetadata} from "@/components/common/utils/page";
import queryString from "query-string";
import {PSArticleModel} from "@/components/common/models/article";
import {calcPagination} from "@/atom/common/utils/pagination";
import {ArticleMiddleBody} from "@/components/server/content/article/article";
import {ArticleFilterBar} from "@/components/server/content/article/filter";
import {headers} from "next/headers";
import {langEnUS} from "@/components/common/language";
import {filterAcceptLanguage} from "@/components/server/language";
import {serverMakeGet} from "@/atom/server/http";
import {useServerConfig} from "@/components/server/config";

export default async function Page({searchParams}: {
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
    const headersList = await headers()
    const acceptLang = headersList.get('Accept-Language') || langEnUS
    const lang = filterAcceptLanguage(acceptLang)

    const metadata = new PageMetadata(lang)
    const rankQuery = queryString.stringify({
        sort: 'read',
        filter: 'year',
        page: '1',
        direction: 'cta',
        size: 10
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
        channel: channelPk
    }
    const rawQuery = queryString.stringify(selectQuery)
    const url = `${internalPortalUrl}/articles?${rawQuery}`

    const selectResult = await serverMakeGet<PLSelectResult<PSArticleModel>>(url, '')

    const pagination = calcPagination(page, selectResult.data.count, pageSize)
    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
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


