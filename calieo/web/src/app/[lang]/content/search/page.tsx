import React from 'react'
import './page.scss'
import queryString from 'query-string'
import {serverSigninDomain} from "@/services/server/domain/domain";
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/services/server/pathname";
import {IDomain} from "@/services/common/domain";
import {ArticleCard} from "@/components/server/content/article/card";
import {CommonResult, PLSelectResult} from "@/models/common/common-result";
import {PSArticleModel} from "@/models/common/article";
import {BaseRouterParams} from '@/models/server/router'
import {useServerTranslation} from '@/services/server/i18n'
import {Metadata} from 'next'
import {NoData} from "@/components/common/empty";
import {PaginationServer} from "@/components/server/pagination";
import {calcPagination} from "@/utils/pagination";
import {replaceSearchParams} from "@/utils/query";

export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: Promise<{ channel: string } & BaseRouterParams>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const baseParams = await params;
    const {t: trans} = await useServerTranslation(baseParams.lang)
    const metadata: Metadata = {
        title: trans('codegen.seo.title'),
        keywords: trans('codegen.seo.keywords'),
        description: trans('codegen.seo.description'),
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
    return <ContentLayout lang={baseParams.lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} params={baseParams}>
        <div className={'searchPage'}>
            <div className={'pageContainer'}>
                搜索关键词: {searchParamsValue.keyword}
            </div>
            <div className={'contentContainer'}>
                <div className={'conMiddle'}>
                    <div className={'middleBody'}>
                        <MiddleBody selectResult={selectResult} domain={domain} lang={baseParams.lang}/>
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

