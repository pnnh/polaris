import React from 'react'

import queryString from 'query-string'
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {ContentLayout} from '@/components/server/content/layout'
import {ArticleRankCard} from "@/components/server/content/article/rank";
import {PLSelectResult, SymbolUnknown} from "@/atom/common/models/protocol";
import {PaginationServer} from "@/components/server/pagination";
import {replaceSearchParams} from "@/atom/common/utils/query";
import {calcPagination} from "@/atom/common/utils/pagination";
import {PSArticleModel} from "@/components/common/models/article";
import {langEn} from "@/atom/common/language";
import {ArticleMiddleBody} from "@/components/server/content/article/article";
import {useServerConfig} from "@/components/server/config";
import {serverMakeGet} from "@/atom/server/http";
import {css} from "@emotion/css";
import {Request, Response} from "express";


export const dynamic = "force-dynamic";

const styles = {
    contentContainer: css`
        flex-grow: 1;
        flex-direction: row;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin: 1rem;
    `,
    conMiddle: css`
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        flex-grow: 1;
        background-color: var(--background-color);
        border-radius: 4px;
    `,
    middlePagination: css`
        width: 100%;
    `,
    conRight: css`
        display: block;
        width: 16rem;
        flex-shrink: 0;

        @media (max-width: 48rem) {
            & {
                display: none;
            }
        }
    `
}

export async function Page(request: Request, response: Response) {
    const pathname = request.path


    const lang = request.params.lang || langEn

    let page = Number(request.query.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 10
    const channelPk = request.query.channel

    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')
    const rankQuery = queryString.stringify({
        sort: 'read',
        filter: 'year',
        page: '1',
        direction: 'cta',
        size: 10,
        lang: lang
    })
    const serverConfig = await useServerConfig()
    const internalPortalUrl = serverConfig.INTERNAL_PORTAL_URL
    const rankUrl = `${internalPortalUrl}/articles?${rankQuery}`
    const rankSelectResult = await serverMakeGet<PLSelectResult<PSArticleModel>>(rankUrl, '')

    const selectQuery = {
        sort: request.query.sort,
        filter: request.query.filter,
        page,
        size: pageSize,
        channel: channelPk,
        lang: lang
    }
    const rawQuery = queryString.stringify(selectQuery)
    const url = `${internalPortalUrl}/articles?${rawQuery}`
    const selectResult = await serverMakeGet<PLSelectResult<PSArticleModel>>(url, '')

    const pagination = calcPagination(page, selectResult.data.count, pageSize)
    return <ContentLayout userInfo={SymbolUnknown} lang={lang} pathname={pathname}
                          metadata={metadata}>
        <div className={styles.contentContainer}>
            <div className={styles.conMiddle}>
                <ArticleMiddleBody selectResult={selectResult} lang={lang}/>
                <div className={styles.middlePagination}>
                    <PaginationServer lang={lang} pagination={pagination}
                                      pageLinkFunc={(page) =>
                                          `/${lang}/articles` + replaceSearchParams({}, 'page', page.toString())}/>
                </div>
            </div>
            <div className={styles.conRight}>
                <ArticleRankCard rankResult={rankSelectResult} lang={lang}/>
            </div>
        </div>
    </ContentLayout>
}


