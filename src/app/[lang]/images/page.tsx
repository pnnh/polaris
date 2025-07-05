import React from 'react'
import styles from './page.module.scss'
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/services/server/pathname";

import queryString from "query-string";
import {serverPortalSignin} from "@/services/server/domain/domain";
import {PLSelectResult, SymbolUnknown} from "@/atom/common/models/protocol";
import {calcPagination} from "@/atom/common/utils/pagination";
import {PaginationServer} from "@/components/server/pagination";
import {replaceSearchParams} from "@/atom/common/utils/query";
import {IDomain} from "@/services/common/domain";
import {NoData} from "@/components/common/empty";
import {MTPictureModel} from "@/atom/common/models/images/image";
import {useServerConfig} from "@/services/server/config";
import {langEn} from "@/atom/common/language";
import {PageMetadata} from "@/utils/page";

export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const searchParamsValue = await searchParams

    const metadata = new PageMetadata(lang)

    let page = Number(searchParamsValue.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 20
    const channelPk = searchParamsValue.channel
    const domain = serverPortalSignin()

    const selectQuery = {
        sort: searchParamsValue.sort,
        filter: searchParamsValue.filter,
        page,
        size: pageSize,
        channel: channelPk
    }
    const rawQuery = queryString.stringify(selectQuery)
    const url = `/images?${rawQuery}`

    const selectResult = await domain.makeGet<PLSelectResult<MTPictureModel>>(url)

    const pagination = calcPagination(page, selectResult.data.count, pageSize)

    return <ContentLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={styles.contentContainer}>

            <div className={styles.conMiddle}>

                <div className={styles.imageGrid}>
                    <MiddleBody selectResult={selectResult} domain={domain} lang={lang} dir={''}/>
                </div>
                <div className={styles.middlePagination}>
                    <PaginationServer pagination={pagination}
                                      pageLinkFunc={(page) =>
                                          '/images' + replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
                </div>
            </div>
            <div className={styles.conRight}>
                <ImageFilterCard lang={lang}/>
            </div>
        </div>
    </ContentLayout>
}

function MiddleBody({selectResult, domain, lang, dir}: {
    selectResult: PLSelectResult<MTPictureModel>,
    domain: IDomain,
    lang: string,
    dir: string
}) {
    if (!selectResult || !selectResult.data || !selectResult.data.range || selectResult.data.range.length === 0) {
        return <NoData size='large'/>
    }
    return selectResult.data.range.map((model, index) => {
        return <ImageItemCard key={index} itemModel={model}/>
    })
}

function ImageItemCard({itemModel}: { itemModel: MTPictureModel }) {
    const serverConfig = useServerConfig()
    const serverUrl = serverConfig.PUBLIC_PORTAL_URL
    const imageUrl = `${serverUrl}/storage/images/${itemModel.uid}${itemModel.ext_name}`
    return <div className={styles.imageCard}>
        <div className={styles.imageIcon}>
            <img src={imageUrl} alt={itemModel.title}></img>
        </div>
    </div>
}

function ImageFilterCard({lang}: { lang: string }) {
    return <div className={styles.filterCard}>
        <div className={styles.filterHeader}>
            图片过滤
        </div>
        <div className={styles.filterBody}>
            <div>
                动图
            </div>
            <div>
                大图
            </div>
            <div>图标</div>
        </div>
    </div>
}
