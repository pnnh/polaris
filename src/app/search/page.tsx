import React from 'react'
import './page.scss'
import queryString from 'query-string'
import {serverPhoenixSignin, serverPortalSignin} from "@/services/server/domain/domain";
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/services/server/pathname";
import {IDomain} from "@/services/common/domain";
import {ArticleCard} from "@/components/server/content/article/card";
import {CommonResult, PLSelectResult, SymbolUnknown} from "@/atom/common/models/protocol";
import {Metadata} from 'next'
import {NoData} from "@/components/common/empty";
import {PaginationServer} from "@/components/server/pagination";
import {replaceSearchParams} from "@/atom/common/utils/query";
import {PSArticleModel} from "@/atom/common/models/article";
import {calcPagination} from "@/atom/common/utils/pagination";
import {ArticleMiddleBody} from "@/components/server/content/article/article";
import {langEn} from "@/atom/common/language";

export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
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

    let domain = serverPhoenixSignin()
    const currentDir = searchParamsValue.dir || 'dir1'
    if (currentDir === 'dir2') {
        domain = serverPortalSignin()
    }
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
    return <ContentLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={'searchPage'}>
            <div className={'pageContainer'}>
                <div>
                    <div className={'condLabel'}>搜索关键词:</div>
                    {searchParamsValue.keyword}
                </div>
                <div className={'dataDir'}>
                    <div className={'condLabel'}>数据目录:</div>
                    <a href={'/search' + replaceSearchParams(searchParamsValue, 'dir', 'dir1')}
                       className={currentDir === 'dir1' ? 'active' : ''}>dir1</a>
                    <a href={'/search' + replaceSearchParams(searchParamsValue, 'dir', 'dir2')}
                       className={currentDir === 'dir2' ? 'active' : ''}>dir2</a>
                </div>
            </div>
            <div className={'contentContainer'}>
                <div className={'conMiddle'}>
                    <div className={'middleBody'}>
                        <ArticleMiddleBody selectResult={selectResult} domain={domain} lang={lang} dir={currentDir}/>
                    </div>
                    <div className={'middlePagination'}>
                        <PaginationServer pagination={pagination}
                                          pageLinkFunc={(page) => '/search' + replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
                    </div>
                </div>
            </div>
        </div>
    </ContentLayout>
}

