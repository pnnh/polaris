import React from 'react'
import './page.scss'
import queryString from 'query-string'

import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/components/server/pathname";
import {ArticleRankCard} from "@/components/server/content/article/rank";
import {PLSelectResult, SymbolUnknown} from "@/atom/common/models/protocol";
import {PaginationServer} from "@/components/server/pagination";
import {replaceSearchParams} from "@/atom/common/utils/query";
import {tryBase58ToUuid} from "@/atom/common/utils/basex";
import {PSArticleModel} from "@/photon/common/models/article";
import {calcPagination} from "@/atom/common/utils/pagination";
import {langEn} from "@/atom/common/language";
import {notFound} from "next/navigation";
import {ArticleFilterBar} from "@/components/server/content/article/filter";
import {ArticleMiddleBody} from "@/components/server/content/article/article";
import {useServerConfig} from "@/components/server/config";
import {serverMakeGet} from "@/atom/server/http";


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
    const serverUrl = serverConfig.PUBLIC_PORTAL_URL
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
        <div className={'contentContainer'}>
            <div className={'conMiddle'}>
                <ArticleFilterBar lang={lang} searchParamsValue={searchParamsValue}/>
                <ArticleMiddleBody selectResult={selectResult} lang={lang}/>
                <div className={'middlePagination'}>
                    <PaginationServer lang={lang} pagination={pagination}
                                      pageLinkFunc={(page) => replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
                </div>
            </div>
            <div className={'conRight'}>
                <ArticleRankCard rankResult={rankSelectResult} lang={lang}/>
            </div>
        </div>
    </ContentLayout>
}


