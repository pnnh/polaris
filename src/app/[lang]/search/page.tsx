import React from 'react'
import './page.scss'
import queryString from 'query-string'
import {ContentLayout} from '@/components/server/content/layout'
import {PLSelectResult, SymbolUnknown} from "@/atom/common/models/protocol";

import {NoData} from "@/components/common/empty";
import {PaginationServer} from "@/components/server/pagination";
import {replaceSearchParams} from "@/atom/common/utils/query";
import {PSArticleModel} from "@/components/common/models/article";
import {calcPagination} from "@/atom/common/utils/pagination";
import {ArticleMiddleBody} from "@/components/server/content/article/article";
import {langEn} from "@/atom/common/language";
import {PageMetadata} from "@/components/common/utils/page";
import {useServerConfig} from "@/components/server/config";
import {serverMakeGet} from "@/atom/server/http";
import {Request, Response} from "express";

export async function Page(request: Request, response: Response) {
    const pathname = request.path

    const lang = request.params.lang || langEn

    const metadata = new PageMetadata(lang)

    let page = Number(request.query.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 10
    const channelPk = request.query.channel

    const serverConfig = await useServerConfig()
    const serverUrl = serverConfig.INTERNAL_PORTAL_URL
    const selectQuery = {
        sort: request.query.sort,
        filter: request.query.filter,
        page,
        size: pageSize,
        channel: channelPk,
        keyword: request.query.keyword
    }
    const rawQuery = queryString.stringify(selectQuery)
    const url = `${serverUrl}/articles?${rawQuery}`

    const selectResult = await serverMakeGet<PLSelectResult<PSArticleModel>>(url, '')
    if (!selectResult || !selectResult.data) {
        return <NoData size={'large'}/>
    }
    const pagination = calcPagination(page, selectResult.data.count, pageSize)
    return <ContentLayout userInfo={SymbolUnknown} lang={lang} pathname={pathname}
                          metadata={metadata}>
        <div className={'searchPage'}>
            <div className={'pageContainer'}>
                <div>
                    <div className={'condLabel'}>搜索关键词:</div>
                    {request.query.keyword as string}
                </div>
            </div>
            <div className={'contentContainer'}>
                <div className={'conMiddle'}>
                    <ArticleMiddleBody selectResult={selectResult} lang={lang}/>

                    <div className={'middlePagination'}>
                        <PaginationServer lang={lang} pagination={pagination}
                                          pageLinkFunc={(page) => '/search' + replaceSearchParams({}, 'page', page.toString())}/>
                    </div>
                </div>
            </div>
        </div>
    </ContentLayout>
}

