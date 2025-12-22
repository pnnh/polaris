import React from 'react'
import './page.scss'
import queryString from 'query-string'

import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {ContentLayout} from '@/components/server/content/layout'
import {ArticleRankCard} from "@/components/server/content/article/rank";
import {PLSelectResult, SymbolUnknown} from "@/atom/common/models/protocol";
import {PaginationServer} from "@/components/server/pagination";
import {replaceSearchParams} from "@/atom/common/utils/query";
import {tryBase58ToUuid} from "@/atom/common/utils/basex";
import {PSArticleModel} from "@/components/common/models/article";
import {calcPagination} from "@/atom/common/utils/pagination";
import {langEn} from "@/atom/common/language";
import {ArticleMiddleBody} from "@/components/server/content/article/article";
import {useServerConfig} from "@/components/server/config";
import {serverMakeGet} from "@/atom/server/http";
import {Request, Response} from "express";


export const dynamic = "force-dynamic";

export async function Page(request: Request, response: Response) {
    const pathname = request.path


    const lang = request.params.lang || langEn

    let page = Number(request.query.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 10

    const channelUrn = tryBase58ToUuid(request.params.channel)
    if (!channelUrn) {
        response.status(400).end('Invalid channel')
        return
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
        sort: request.query.sort,
        filter: request.query.filter,
        page,
        size: pageSize,
        channel: channelUrn
    }
    const rawQuery = queryString.stringify(selectQuery)
    const url = `${serverUrl}/articles?${rawQuery}`
    const selectResult = await serverMakeGet<PLSelectResult<PSArticleModel>>(url, '')

    const pagination = calcPagination(page, selectResult.data.count, pageSize)
    return <ContentLayout userInfo={SymbolUnknown} lang={lang} pathname={pathname}
                          metadata={metadata}>
        <div className={'contentContainer'}>
            <div className={'conMiddle'}>
                <ArticleMiddleBody selectResult={selectResult} lang={lang}/>
                <div className={'middlePagination'}>
                    <PaginationServer lang={lang} pagination={pagination}
                                      pageLinkFunc={(page) => replaceSearchParams({}, 'page', page.toString())}/>
                </div>
            </div>
            <div className={'conRight'}>
                <ArticleRankCard rankResult={rankSelectResult} lang={lang}/>
            </div>
        </div>
    </ContentLayout>
}


