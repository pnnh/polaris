import React from 'react'
import './page.scss'
import Link from 'next/link'
import {PaginationServer} from 'atom/server'
import {replaceSearchParams} from 'atom'
import queryString from 'query-string'
import {NoData} from 'atom'
import {PSImageServer} from 'atom/server'
import {formatRfc3339} from 'atom'
import {CommonResult, PLSelectResult} from 'polaris-business'
import {calcPagination} from "atom";
import {STSubString} from "atom";
import {channelName, PSArticleModel} from "polaris-business";
import {serverSigninDomain} from "@/services/server/domain/domain";
import ContentLayout from '@/components/server/content/layout'
import {HtmlLayout} from '@/components/server/layout'
import {getPathname} from "@/services/server/pathname";
import {IDomain} from "@/services/common/domain";
import {FaEye} from "react-icons/fa";
import {CiAlarmOn} from "react-icons/ci";

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
        sort: searchParams.sort,
        filter: searchParams.filter,
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
        const querySort = (searchParams.sort ?? 'latest')
        return ' ' + (querySort === sort ? ' activeLink' : '')
    }
    const filterClass = (filter: string) => {
        const queryFilter = (searchParams.filter ?? 'all')
        return ' ' + (queryFilter === filter ? ' activeLink' : '')
    }
    const pathname = getPathname()
    return <HtmlLayout metadata={{}}>
        <ContentLayout searchParams={searchParams} pathname={pathname}>
            <div className={'contentContainer'}>
                <div className={'conMiddle'}>
                    <div className={'middleTop'}>
                        <div className={'topLeft'}>
                            <Link className={'sortLink' + sortClass('latest')}
                                  href={replaceSearchParams(searchParams, 'sort', 'latest')}>最新</Link>
                            <Link className={'sortLink' + sortClass('read')}
                                  href={replaceSearchParams(searchParams, 'sort', 'read')}>阅读数</Link>
                        </div>
                        <div className={'topRight'}>
                            <Link className={'filterLink' + filterClass('month')}
                                  href={replaceSearchParams(searchParams, 'filter', 'month')}>一月内</Link>
                            <Link className={'filterLink' + filterClass('year')}
                                  href={replaceSearchParams(searchParams, 'filter', 'year')}>一年内</Link>
                            <Link className={'filterLink' + filterClass('all')}
                                  href={replaceSearchParams(searchParams, 'filter', 'all')}>所有</Link>
                        </div>
                    </div>
                    <div className={'middleBody'}>
                        <MiddleBody selectResult={selectResult.data} domain={domain}/>
                    </div>
                    <div className={'middlePagination'}>
                        <PaginationServer pagination={pagination}
                                          pageLinkFunc={(page) => replaceSearchParams(searchParams, 'page', page.toString())}/>
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
    </HtmlLayout>
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

