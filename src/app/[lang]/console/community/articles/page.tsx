import React from 'react'
import {css} from '@emotion/css'
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {PaginationServer} from "@/components/server/pagination";
import {replaceSearchParams} from "@/atom/common/utils/query";
import {calcPagination} from "@/atom/common/utils/pagination";
import {langEn} from "@/atom/common/language";
import {ConsoleArticleFilterBar} from "./filter";
import {ConsoleArticleMiddleBody} from "./article";
import {useServerConfig} from "@/components/server/config";
import {CommunityArticleNodeService} from "@/components/community/articles";
import {GlobalLayout} from "@/components/server/global";
import {Request, Response} from "express";

const styles = {
    articlesPage: css`
        height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
    `,
    pageContainer: css`
        display: flex;
        flex-direction: column;
        width: 100%;
    `,
    conMiddle: css`
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        scrollbar-width: thin;
        border-radius: 4px;
        overflow-y: auto;
        overflow-x: hidden;
    `,
    middlePagination: css`
        width: 100%;
        background: var(--background-color);
    `
};

export const dynamic = "force-dynamic";

export async function Page(request: Request, response: Response) {


    const lang = request.params.lang || langEn

    let page = Number(request.query.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 10
    const searchText = request.query.keyword

    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')

    const selectQuery = {
        sort: request.query.sort,
        filter: request.query.filter,
        page,
        size: pageSize,
        keyword: searchText
    }
    const serverConfig = await useServerConfig()

    const internalPortalUrl = serverConfig.INTERNAL_PORTAL_URL
    const publicPortalUrl = serverConfig.PUBLIC_PORTAL_URL
    const selectData = await CommunityArticleNodeService.consoleQueryArticles(internalPortalUrl,
        lang, selectQuery)

    const pagination = calcPagination(page, selectData.count, pageSize)
    return <GlobalLayout lang={lang} metadata={metadata}>
        <div className={styles.articlesPage}>
            <div className={styles.pageContainer}>
                <ConsoleArticleFilterBar lang={lang} keyword={request.query.keyword as string}/>
                <div className={styles.conMiddle}>
                    <ConsoleArticleMiddleBody selectData={selectData} lang={lang}
                                              publicPortalUrl={publicPortalUrl}/>
                    <div className={styles.middlePagination}>
                        <PaginationServer lang={lang} pagination={pagination}
                                          pageLinkFunc={(page) =>
                                              `/${lang}/console/community/articles` + replaceSearchParams({}, 'page', page.toString())}/>
                    </div>
                </div>
            </div>
        </div>
    </GlobalLayout>
}


