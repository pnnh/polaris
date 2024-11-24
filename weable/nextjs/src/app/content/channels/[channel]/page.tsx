import React from 'react'
import styles from './page.module.scss'
import {PaginationPartial} from '@pnnh/atom-react'
import {replaceSearchParams} from '@pnnh/atom'
import queryString from 'query-string'
import {NoData} from '@/components/common/empty'
import {PSImage} from '@/components/client/image'
import {PLSelectResult} from '@/models/common-result'
import {calcPagination} from "@pnnh/atom";
import {signinDomain} from "@/services/server/domain/domain";
import {NCPictureModel} from "@pnnh/venus-business";

export default async function Page({params, searchParams}: {
    params: { viewer: string, channel: string },
    searchParams: Record<string, string>
}) {
    let page = Number(searchParams.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 10
    const channelUrn = params.channel

    const selectQuery = {
        sort: searchParams.sort,
        filter: searchParams.filter,
        page,
        size: pageSize,
        channel: channelUrn
    }
    const rawQuery = queryString.stringify(selectQuery)
    const url = `/articles/channels/${params.channel}/posts?${rawQuery}`

    const domain = signinDomain()
    const selectResult = await domain.makeGet<PLSelectResult<NCPictureModel>>(url)

    const pagination = calcPagination(page, selectResult.count, pageSize)

    return <div className={styles.fullPage}>
        <div className={styles.mainContainer}>
            <div className={styles.contentContainer}>
                <div className={styles.conMiddle}>
                    <div className={styles.middleBody}>
                        <MiddleBody viewer={params.viewer} channelUrn={channelUrn} selectResult={selectResult}/>
                    </div>
                    <div className={styles.middlePagination}>
                        <PaginationPartial pagination={pagination}
                                           calcUrl={(page) => replaceSearchParams(searchParams, 'page', page.toString())}/>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

function MiddleBody({viewer, selectResult, channelUrn}: {
    viewer: string, selectResult: PLSelectResult<NCPictureModel>,
    channelUrn: string
}) {
    if (!selectResult || !selectResult.range || selectResult.range.length === 0) {
        return <NoData size='large'/>
    }
    return selectResult.range.map((model) => {
        const imageUrl = `/content/${viewer}/channels/${channelUrn}/data/${model.cover}`

        return <div className={styles.middleItem} key={model.urn}>
            <div className={styles.itemCover}>
                <PSImage src={imageUrl} alt={model.title} fill={true}/>
            </div>

        </div>
    })
}

