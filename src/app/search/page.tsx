import React from 'react'
import './page.scss'
import queryString from 'query-string'
import {serverSigninDomain} from "@/services/server/domain/domain";
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/services/server/pathname";
import {IDomain} from "@/services/common/domain";
import {ArticleCard} from "@/components/server/content/article/card";
import {CommonResult, PLSelectResult} from "@/atom/common/models/protocol";
import {Metadata} from 'next'
import {NoData} from "@/components/common/empty";
import {PaginationServer} from "@/components/server/pagination";
import {replaceSearchParams} from "@/atom/common/utils/query";
import {PSArticleModel} from "@/atom/common/models/article";
import {calcPagination} from "@/atom/common/utils/pagination";

export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: Promise<{ channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const baseParams = await params;
    const metadata: Metadata = {
        title: 'codegen.seo.title',
        keywords: 'codegen.seo.keywords',
        description: 'codegen.seo.description',
    }
    const searchParamsValue = await searchParams
    let page = Number(searchParamsValue.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 10
    const channelPk = searchParamsValue.channel

    const domain = serverSigninDomain()
    const selectQuery = {
        sort: searchParamsValue.sort,
        filter: searchParamsValue.filter,
        page,
        size: pageSize,
        channel: channelPk,
        keyword: searchParamsValue.keyword
    }
    const rawQuery = queryString.stringify(selectQuery)
    const url = `/articles?${rawQuery}`

    const selectResult = await domain.makeGet<PLSelectResult<PSArticleModel>>(url)
    if (!selectResult || !selectResult.data) {
        return <NoData size={'large'}/>
    }
    const pagination = calcPagination(page, selectResult.data.count, pageSize)
    return <ContentLayout lang={'en'} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={'searchPage'}>
            <div className={'pageContainer'}>
                搜索关键词: {searchParamsValue.keyword}
            </div>
            <div className={'contentContainer'}>
                <div className={'conMiddle'}>
                    <div className={'middleBody'}>
                        <MiddleBody selectResult={selectResult} domain={domain} lang={'zh'}/>
                    </div>
                    <div className={'middlePagination'}>
                        <PaginationServer pagination={pagination}
                                          pageLinkFunc={(page) => replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
                    </div>
                </div>
            </div>
        </div>
    </ContentLayout>
}

function MiddleBody({selectResult, domain, lang}: {
    selectResult: PLSelectResult<PSArticleModel>,
    domain: IDomain,
    lang: string
}) {
    if (!selectResult || !selectResult.data || !selectResult.data.range || selectResult.data.range.length === 0) {
        return <NoData size='large'/>
    }
    return selectResult.data.range.map((model) => {
        return <ArticleCard model={model} domain={domain} lang={lang}/>
    })
}

