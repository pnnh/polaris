import React from 'react'
import './page.scss'
import {PaginationServer} from '@pnnh/atom-react/server'
import {replaceSearchParams} from '@pnnh/atom'
import queryString from 'query-string'
import {NoData} from '@pnnh/atom-react'
import {CommonResult, PLSelectResult} from '@pnnh/polaris-business'
import {calcPagination} from "@pnnh/atom";
import {channelName, PSArticleModel} from "@pnnh/polaris-business";
import {serverSigninDomain} from "@/services/server/domain/domain";
import ContentLayout from '@/components/server/content/layout'
import {HtmlLayout} from '@/components/server/layout'
import {getPathname} from "@/services/server/pathname";
import {IDomain} from "@/services/common/domain";
import {ArticleCard} from "@/components/server/article/card";

export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: { channel: string },
    searchParams: Record<string, string>
}) {
    let page = Number(searchParams.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 10
    const channelPk = searchParams.channel

    const domain = serverSigninDomain()
    const selectQuery = {
        sort: searchParams.sort,
        filter: searchParams.filter,
        page,
        size: pageSize,
        channel: channelPk,
        keyword: searchParams.keyword
    }
    const rawQuery = queryString.stringify(selectQuery)
    const url = `/articles?${rawQuery}`

    const selectResult = await domain.makeGet<CommonResult<PLSelectResult<PSArticleModel>>>(url)
    if (!selectResult || !selectResult.data) {
        return <NoData size={'large'}/>
    }
    const pagination = calcPagination(page, selectResult.data.count, pageSize)
    const pathname = getPathname()
    return <HtmlLayout metadata={{}}>
        <ContentLayout searchParams={searchParams} pathname={pathname}>
            <div className={'searchPage'}>
                <div className={'pageContainer'}>
                    搜索关键词: {searchParams.keyword}
                </div>
                <div className={'contentContainer'}>
                    <div className={'conMiddle'}>
                        <div className={'middleBody'}>
                            <MiddleBody selectResult={selectResult.data} domain={domain}/>
                        </div>
                        <div className={'middlePagination'}>
                            <PaginationServer pagination={pagination}
                                              pageLinkFunc={(page) => replaceSearchParams(searchParams, 'page', page.toString())}/>
                        </div>
                    </div>
                </div>
            </div>
        </ContentLayout>
    </HtmlLayout>
}

function MiddleBody({selectResult, domain}: { selectResult: PLSelectResult<PSArticleModel>, domain: IDomain }) {
    if (!selectResult || !selectResult.range || selectResult.range.length === 0) {
        return <NoData size='large'/>
    }
    return selectResult.range.map((model) => {
        return <ArticleCard model={model} domain={domain}/>
    })
}

