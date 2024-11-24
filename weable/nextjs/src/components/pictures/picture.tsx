import React from 'react'
import styles from './picture.module.scss'
import Link from 'next/link'
import {PaginationPartial} from '@pnnh/atom-react'
import {replaceSearchParams} from '@pnnh/atom'
import queryString from 'query-string'
import {NoData} from '@/components/common/empty'
import {PSImage} from '@/components/client/image'
import {PLSelectResult} from '@/models/common-result'
import {calcPagination} from "@pnnh/atom";
import {serverMakeHttpGet} from '@/services/server/http'
import {NSPictureModel} from '@/models/venus/picture'

export async function PicturesPage({channel, searchParams}: {
    channel: string, searchParams: Record<string, string>
}) {
    let page = Number(searchParams.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 36
    const channelPk = searchParams.channel

    const selectQuery = {
        sort: searchParams.sort,
        filter: searchParams.filter,
        page,
        size: pageSize,
        channel: channelPk
    }
    const rawQuery = queryString.stringify(selectQuery)
    const url = `/pictures/channels/${channel}/pictures?${rawQuery}`
    const selectResult = await serverMakeHttpGet<PLSelectResult<NSPictureModel>>(url)

    const pagination = calcPagination(page, selectResult.count, pageSize)
    const sortClass = (sort: string) => {
        const querySort = (searchParams.sort ?? 'latest')
        return ' ' + (querySort === sort ? styles.activeLink : '')
    }
    const filterClass = (filter: string) => {
        const queryFilter = (searchParams.filter ?? 'all')
        return ' ' + (queryFilter === filter ? styles.activeLink : '')
    }

    return <div className={styles.indexPage}>
        <div className={styles.container}>
            <div className={styles.conMiddle}>
                <div className={styles.middleTop}>
                    <div className={styles.topLeft}>
                        <Link className={styles.sortLink + sortClass('latest')}
                              href={replaceSearchParams(searchParams, 'sort', 'latest')}>最新</Link>
                        <Link className={styles.sortLink + sortClass('read')}
                              href={replaceSearchParams(searchParams, 'sort', 'read')}>浏览数</Link>
                    </div>
                    <div className={styles.topRight}>
                        <Link className={styles.filterLink + filterClass('month')}
                              href={replaceSearchParams(searchParams, 'filter', 'month')}>一月内</Link>
                        <Link className={styles.filterLink + filterClass('year')}
                              href={replaceSearchParams(searchParams, 'filter', 'year')}>一年内</Link>
                        <Link className={styles.filterLink + filterClass('all')}
                              href={replaceSearchParams(searchParams, 'filter', 'all')}>所有</Link>
                    </div>
                </div>
                <div className={styles.middleBody}>
                    <MiddleBody selectResult={selectResult}/>
                </div>
                <div className={styles.middlePagination}>
                    <PaginationPartial pagination={pagination}
                                       calcUrl={(page) => replaceSearchParams(searchParams, 'page', page.toString())}/>
                </div>
            </div>
        </div>
    </div>
}

function MiddleBody({selectResult}: { selectResult: PLSelectResult<NSPictureModel> }) {
    if (!selectResult || !selectResult.range || selectResult.range.length === 0) {
        return <NoData size='large'/>
    }
    return selectResult.range.map((model) => {
        return <div className={styles.middleItem} key={model.uid}>
            <div className={styles.itemCover}>
                <PSImage src={model.file} alt={model.title} fill={true}/>
            </div>

        </div>
    })
}
