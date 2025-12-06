import React from 'react'
import styles from './page.module.scss'
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/components/server/pathname";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {calcPagination} from "@/atom/common/utils/pagination";
import {PaginationServer} from "@/components/server/pagination";
import {replaceSearchParams} from "@/atom/common/utils/query";
import {useServerConfig} from "@/components/server/config";
import {langEn} from "@/atom/common/language";
import {PageMetadata} from "@/components/common/utils/page";
import {serverSelectImages} from "@/components/server/images/image";
import {ImageMiddleBody} from "@/components/server/content/images/image";
import {transText} from "@/components/common/locales/normal";

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

    const selectQuery = {
        sort: searchParamsValue.sort,
        filter: searchParamsValue.filter,
        page,
        size: pageSize,
        channel: channelPk
    }
    const serverConfig = await useServerConfig()

    const selectData = await serverSelectImages(serverConfig.INTERNAL_PORTAL_URL, lang, selectQuery)

    const pagination = calcPagination(page, selectData.count, pageSize)

    return <ContentLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={styles.contentContainer}>
            <div className={styles.conTop}>
                <a className={styles.linkTag} href={`/${lang}/images?type=illustration`}>
                    {transText(lang, '插画', 'illustration')}</a>
                <a className={styles.linkTag} href={`/${lang}/images?type=sticker`}>
                    {transText(lang, '表情图', 'Sticker')}</a>
                <a className={styles.linkTag} href={`/${lang}/images?type=emoji`}>
                    {transText(lang, 'Emoji', 'Emoji')}</a>
                <a className={styles.linkTag} href={`/${lang}/images?type=icons`}>
                    {transText(lang, '图标', 'Icons')}</a>
            </div>
            <div className={styles.conMiddle}>
                <ImageMiddleBody selectData={selectData} lang={lang}/>

                <div className={styles.middlePagination}>
                    <PaginationServer lang={lang} pagination={pagination}
                                      pageLinkFunc={(page) =>
                                          `/${lang}/images` + replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
                </div>
            </div>
        </div>
    </ContentLayout>
}
