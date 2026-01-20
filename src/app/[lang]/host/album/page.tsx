import React from 'react'
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/components/server/pathname";
import {SymbolUnknown} from "@pnnh/atom";
import {calcPagination} from "@pnnh/atom";
import {PaginationServer} from "@/components/server/pagination";
import {replaceSearchParams} from "@pnnh/atom";
import {useServerConfig} from "@/components/server/config";
import {langEn} from "@pnnh/atom";
import {PageMetadata} from "@/components/common/utils/page";
import {serverSelectImages} from "@/components/server/images/image";
import {ImageMiddleBody} from "@/components/server/content/images/image";
import {transText} from "@/components/common/locales/normal";
import {css} from "@/gen/styled/css";

export const dynamic = "force-dynamic";

const pageStyles = {
    contentContainer: css`
        flex-grow: 1;
        flex-direction: column;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin: 1rem;
    `,
    conTop: css`
    `,
    linkTag: css`
        color: var(--text-primary-color);
        text-decoration: none;
        display: inline-block;
        padding: 0.5rem 0.5rem;
        border-radius: 0.25rem;
        background-color: var(--background-color);
        
        &:hover {
            text-decoration: underline;
        }
    `,
    conMiddle: css`
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        flex-grow: 1;
        background-color: #FFF;
        border-radius: 4px;
    `,
    middlePagination: css`
        width: 100%;
    `
}

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
        <div className={pageStyles.contentContainer}>
            <div className={pageStyles.conTop}>
                <a className={pageStyles.linkTag} href={`/${lang}/images?type=illustration`}>
                    {transText(lang, '插画', 'illustration')}</a>
                <a className={pageStyles.linkTag} href={`/${lang}/images?type=sticker`}>
                    {transText(lang, '表情图', 'Sticker')}</a>
                <a className={pageStyles.linkTag} href={`/${lang}/images?type=emoji`}>
                    {transText(lang, 'Emoji', 'Emoji')}</a>
                <a className={pageStyles.linkTag} href={`/${lang}/images?type=icons`}>
                    {transText(lang, '图标', 'Icons')}</a>
            </div>
            <div className={pageStyles.conMiddle}>
                <ImageMiddleBody selectData={selectData} lang={lang}/>

                <div className={pageStyles.middlePagination}>
                    <PaginationServer lang={lang} pagination={pagination}
                                      pageLinkFunc={(page) =>
                                          `/${lang}/images` + replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
                </div>
            </div>
        </div>
    </ContentLayout>
}
