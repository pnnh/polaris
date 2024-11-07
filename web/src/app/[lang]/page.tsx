import React from 'react'
import './page.scss'
import Link from 'next/link'
import {PaginationServer} from '@pnnh/atom-react/server'
import {replaceSearchParams} from '@pnnh/atom'
import queryString from 'query-string'
import {NoData} from '@pnnh/atom-react'
import {PSImageServer} from '@pnnh/atom-react/server'
import {formatRfc3339} from '@pnnh/atom'
import {calcPagination} from "@pnnh/atom";
import {STSubString} from "@pnnh/atom";
import {serverSigninDomain} from "@/services/server/domain/domain";
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/services/server/pathname";
import {IDomain} from "@/services/common/domain";
import {FaEye} from "react-icons/fa";
import {CiAlarmOn} from "react-icons/ci";
import {CommonResult, PLSelectResult} from "@/models/common/common-result";
import {channelName, PSArticleModel} from "@/models/common/article"; 
import { useServerTranslation } from '@/services/server/i18n'
import { BaseRouterParams } from '@/models/server/router'
import { Metadata } from 'next'

export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: Promise<{ channel: string } & BaseRouterParams>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const baseParams = await params;
    const searchParamsValue = await searchParams
    const {t: trans} = await useServerTranslation(baseParams.lang)
    const metadata: Metadata = {
        title: trans('codegen.seo.title'),
        keywords: trans('codegen.seo.keywords'),
        description: trans('codegen.seo.description'), 
    }

    let page = Number(searchParamsValue.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 10
    const channelPk = searchParamsValue.channel

    const rankQuery = queryString.stringify({
        sort: 'read',
        filter: 'year',
        page: '1',
        direction: 'cta',
        size: 10
    })
    const domain = serverSigninDomain()
    const rankUrl = `/articles?${rankQuery}`
    const rankSelectResult = await domain.makeGet<CommonResult<PLSelectResult<PSArticleModel>>>(rankUrl)

    const selectQuery = {
        sort: searchParamsValue.sort,
        filter: searchParamsValue.filter,
        page,
        size: pageSize,
        channel: channelPk
    }
    const rawQuery = queryString.stringify(selectQuery)
    const url = `/articles?${rawQuery}`

    const selectResult = await domain.makeGet<CommonResult<PLSelectResult<PSArticleModel>>>(url)
    if (!selectResult || !selectResult.data) {
        return <NoData size={'large'}/>
    }
    const pagination = calcPagination(page, selectResult.data.count, pageSize)
    const sortClass = (sort: string) => {
        const querySort = (searchParamsValue.sort ?? 'latest')
        return ' ' + (querySort === sort ? ' activeLink' : '')
    }
    const filterClass = (filter: string) => {
        const queryFilter = (searchParamsValue.filter ?? 'all')
        return ' ' + (queryFilter === filter ? ' activeLink' : '')
    }
    return <ContentLayout searchParams={searchParamsValue} pathname={pathname} metadata={metadata} params={baseParams}>
        <div className={'contentContainer'}>
            <div className={'conMiddle'}>
                <div className={'middleTop'}>
                    <div className={'topLeft'}>
                        <Link className={'sortLink' + sortClass('latest')}
                              href={replaceSearchParams(searchParamsValue, 'sort', 'latest')}>最新</Link>
                        <Link className={'sortLink' + sortClass('read')}
                              href={replaceSearchParams(searchParamsValue, 'sort', 'read')}>阅读数</Link>
                    </div>
                    <div className={'topRight'}>
                        <Link className={'filterLink' + filterClass('month')}
                              href={replaceSearchParams(searchParamsValue, 'filter', 'month')}>一月内</Link>
                        <Link className={'filterLink' + filterClass('year')}
                              href={replaceSearchParams(searchParamsValue, 'filter', 'year')}>一年内</Link>
                        <Link className={'filterLink' + filterClass('all')}
                              href={replaceSearchParams(searchParamsValue, 'filter', 'all')}>所有</Link>
                    </div>
                </div>
                <div className={'middleBody'}>
                    <MiddleBody selectResult={selectResult.data} domain={domain}/>
                </div>
                <div className={'middlePagination'}>
                    <PaginationServer pagination={pagination}
                                      pageLinkFunc={(page) => replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
                </div>
            </div>
            <div className={'conRight'}>
                <div className={'rankCard'}>
                    <div className={'rankHeader'}>
                        年度阅读排行
                    </div>
                    <div className={'rankBody'}>
                        {
                            rankSelectResult.data && rankSelectResult.data.range && rankSelectResult.data.range.length > 0
                                ? rankSelectResult.data.range.map((model, index) => {
                                    const readUrl = `/content/channels/${model.channel}/articles/${model.urn}`
                                    return <div key={model.urn} className={'rankItem'}>
                                        <div
                                            className={'rankIndex' + (index <= 2 ? ' rankTop' : '')}>{index + 1}</div>
                                        <div className={'rankTitle'}>
                                            <Link
                                                href={readUrl}
                                                title={model.title}>{model.title}</Link>
                                        </div>
                                    </div>
                                })
                                : '暂无'
                        }
                    </div>
                </div>
            </div>
        </div>
    </ContentLayout>
}

function MiddleBody({selectResult, domain}: { selectResult: PLSelectResult<PSArticleModel>, domain: IDomain }) {
    if (!selectResult || !selectResult.range || selectResult.range.length === 0) {
        return <NoData size='large'/>
    }
    return selectResult.range.map((model) => {
        const readUrl = `/content/channels/${channelName(model.channel)}/articles/${model.urn}`
        let imageUrl = '/images/default.png'
        if (model.cover) {
            imageUrl = domain.assetUrl(`/channels/${model.channel}/articles/${model.urn}/assets/${model.cover}`)
        }
        return <div className={'middleItem'} key={model.urn}>
            <div className={'itemDetail'}>
                <div className={'itemTitle'}>
                    <Link href={readUrl}>{model.title}</Link></div>
                <div className={'description'} title={model.description}>
                    {STSubString(model.description || model.body, 100)}
                </div>
                <div className={'action'}>
                    <FaEye size={'1rem'}/><span>{model.discover}</span>
                    <CiAlarmOn size={'1rem'}/><span>{formatRfc3339(model.update_time)}</span>
                </div>
            </div>
            <div className={'itemCover'}>
                <PSImageServer src={imageUrl} alt={model.title} fill={true}/>
            </div>

        </div>
    })
}

