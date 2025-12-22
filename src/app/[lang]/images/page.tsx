import React from 'react'
import {css} from '@emotion/css'
import {ContentLayout} from '@/components/server/content/layout'
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
import {Request, Response} from "express";

const styles = {
    contentContainer: css`
        flex-grow: 1;
        flex-direction: column;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin: 1rem;
    `,
    conTop: css``,
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
};

export const dynamic = "force-dynamic";

export async function Page(request: Request, response: Response) {
    const pathname = request.path

    const lang = request.params.lang || langEn


    const metadata = new PageMetadata(lang)

    let page = Number(request.query.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 20
    const channelPk = request.query.channel

    const selectQuery = {
        sort: request.query.sort,
        filter: request.query.filter,
        page,
        size: pageSize,
        channel: channelPk
    }
    const serverConfig = await useServerConfig()

    const selectData = await serverSelectImages(serverConfig.INTERNAL_PORTAL_URL, lang, selectQuery)

    const pagination = calcPagination(page, selectData.count, pageSize)

    return <ContentLayout userInfo={SymbolUnknown} lang={lang} pathname={''}
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
                                          `/${lang}/images` + replaceSearchParams({}, 'page', page.toString())}/>
                </div>
            </div>
        </div>
    </ContentLayout>
}
