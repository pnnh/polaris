import React from 'react'
import {css} from "@/gen/styled/css";
import queryString from 'query-string'

import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/components/server/pathname";
import {ArticleRankCard} from "@/components/server/content/article/rank";
import {PLSelectResult, SymbolUnknown} from "@pnnh/atom";
import {PaginationServer} from "@/components/server/pagination";
import {replaceSearchParams} from "@pnnh/atom";
import {tryBase58ToUuid} from "@pnnh/atom";
import {PSArticleModel} from "@/components/common/models/article";
import {calcPagination} from "@pnnh/atom";
import {langEn} from "@pnnh/atom";
import {notFound} from "next/navigation";
import {ArticleFilterBar} from "@/components/server/content/article/filter";
import {ArticleMiddleBody} from "@/components/server/content/article/article";
import {useServerConfig} from "@/components/server/config";
import {serverMakeGet} from "@pnnh/atom/nodejs";

const pageStyles = {
    contentContainer: css`
        flex-grow: 1;
        flex-direction: row;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin: 1rem;
    `,
    conRight: css`
        display: block;
        width: 16rem;
        flex-shrink: 0;
        
        @media (max-width: 48rem) {
            display: none;
        }
    `,
    conMiddle: css`
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        flex-grow: 1;
        background-color: #FFF;
        border-radius: 4px;
    `,
    middlePagination: css`
        width: 100%;
    `
}


export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const searchParamsValue = await searchParams
    const lang = paramsValue.lang || langEn

    let page = Number(searchParamsValue.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 10

    const channelUrn = tryBase58ToUuid(paramsValue.channel)
    if (!channelUrn) {
        notFound();
    }
    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle('')
    const rankQuery = queryString.stringify({
        sort: 'read',
        filter: 'year',
        page: '1',
        direction: 'cta',
        size: 10,
        channel: channelUrn
    })
    const serverConfig = await useServerConfig()
    const serverUrl = serverConfig.INTERNAL_PORTAL_URL
    const rankUrl = `${serverUrl}/articles?${rankQuery}`
    const rankSelectResult = await serverMakeGet<PLSelectResult<PSArticleModel>>(rankUrl, '')

    const selectQuery = {
        sort: searchParamsValue.sort,
        filter: searchParamsValue.filter,
        page,
        size: pageSize,
        channel: channelUrn
    }
    const rawQuery = queryString.stringify(selectQuery)
    const url = `${serverUrl}/articles?${rawQuery}`
    const selectResult = await serverMakeGet<PLSelectResult<PSArticleModel>>(url, '')

    const pagination = calcPagination(page, selectResult.data.count, pageSize)
    return <ContentLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={pageStyles.contentContainer}>
            <div className={pageStyles.conMiddle}>
                <ArticleFilterBar lang={lang} searchParamsValue={searchParamsValue}/>
                <ArticleMiddleBody selectResult={selectResult} lang={lang}/>
                <div className={pageStyles.middlePagination}>
                    <PaginationServer lang={lang} pagination={pagination}
                                      pageLinkFunc={(page) => replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
                </div>
            </div>
            <div className={pageStyles.conRight}>
                <ArticleRankCard rankResult={rankSelectResult} lang={lang}/>
            </div>
        </div>
    </ContentLayout>
}
