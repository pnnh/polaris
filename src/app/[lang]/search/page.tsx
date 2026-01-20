import React from 'react'
import {css} from "@/gen/styled/css";
import queryString from 'query-string'
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/components/server/pathname";
import {PLSelectResult, SymbolUnknown} from "@pnnh/atom";

import {NoData} from "@/components/common/empty";
import {PaginationServer} from "@/components/server/pagination";
import {replaceSearchParams} from "@pnnh/atom";
import {PSArticleModel} from "@/components/common/models/article";
import {calcPagination} from "@pnnh/atom";
import {ArticleMiddleBody} from "@/components/server/content/article/article";
import {langEn} from "@pnnh/atom";
import {PageMetadata} from "@/components/common/utils/page";
import {useServerConfig} from "@/components/server/config";
import {serverMakeGet} from "@pnnh/atom/nodejs";

const pageStyles = {
    searchPage: css`
        padding: 1rem;
    `,
    pageContainer: css`
        flex-grow: 1;
        flex-direction: column;
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
        margin: 1rem auto;
        background: #ffffff;
        border-radius: 4px;
        padding: 1rem;
    `,
    condLabel: css`
        display: inline-block;
        width: 100px;
        text-align: right;
        margin-right: 16px;
    `,
    contentContainer: css`
        flex-grow: 1;
        flex-direction: row;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
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
    const lang = paramsValue.lang || langEn

    const metadata = new PageMetadata(lang)
    const searchParamsValue = await searchParams
    let page = Number(searchParamsValue.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 10
    const channelPk = searchParamsValue.channel

    const serverConfig = await useServerConfig()
    const serverUrl = serverConfig.INTERNAL_PORTAL_URL
    const selectQuery = {
        sort: searchParamsValue.sort,
        filter: searchParamsValue.filter,
        page,
        size: pageSize,
        channel: channelPk,
        keyword: searchParamsValue.keyword
    }
    const rawQuery = queryString.stringify(selectQuery)
    const url = `${serverUrl}/articles?${rawQuery}`

    const selectResult = await serverMakeGet<PLSelectResult<PSArticleModel>>(url, '')
    if (!selectResult || !selectResult.data) {
        return <NoData size={'large'}/>
    }
    const pagination = calcPagination(page, selectResult.data.count, pageSize)
    return <ContentLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={pageStyles.searchPage}>
            <div className={pageStyles.pageContainer}>
                <div>
                    <div className={pageStyles.condLabel}>搜索关键词:</div>
                    {searchParamsValue.keyword}
                </div>
            </div>
            <div className={pageStyles.contentContainer}>
                <div className={pageStyles.conMiddle}>
                    <ArticleMiddleBody selectResult={selectResult} lang={lang}/>

                    <div className={pageStyles.middlePagination}>
                        <PaginationServer lang={lang} pagination={pagination}
                                          pageLinkFunc={(page) => '/search' + replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
                    </div>
                </div>
            </div>
        </div>
    </ContentLayout>
}
