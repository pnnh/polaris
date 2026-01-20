import React from 'react'
import {css} from "@/gen/styled/css";
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {PaginationServer} from "@/components/server/pagination";
import {replaceSearchParams} from "@pnnh/atom";
import {calcPagination} from "@pnnh/atom";
import {langEn} from "@pnnh/atom";
import {ConsoleArticleFilterBar} from "./filter";
import {ConsoleArticleMiddleBody} from "./article";
import {useServerConfig} from "@/components/server/config";
import {serverConsoleSelectArticles} from "@/components/personal/articles";
import GlobalLayout from "@/components/server/global";

const pageStyles = {
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
}

export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const searchParamsValue = await searchParams
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn

    let page = Number(searchParamsValue.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 10
    const channelPk = searchParamsValue.channel

    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')

    const selectQuery = {
        sort: searchParamsValue.sort,
        filter: searchParamsValue.filter,
        page,
        size: pageSize,
        channel: channelPk
    }
    const serverConfig = await useServerConfig()

    const selectData = await serverConsoleSelectArticles(serverConfig.INTERNAL_PORTAL_URL,
        lang, selectQuery)

    const pagination = calcPagination(page, selectData.count, pageSize)
    return <GlobalLayout lang={lang} metadata={metadata}>
        <div className={pageStyles.articlesPage}>
            <div className={pageStyles.pageContainer}>
                <ConsoleArticleFilterBar lang={lang} keyword={searchParamsValue.keyword}/>
                <div className={pageStyles.conMiddle}>
                    <ConsoleArticleMiddleBody selectData={selectData} lang={lang}
                                              publicPortalUrl={serverConfig.PUBLIC_PORTAL_URL}/>
                    <div className={pageStyles.middlePagination}>
                        <PaginationServer lang={lang} pagination={pagination}
                                          pageLinkFunc={(page) =>
                                              `/${lang}/console/articles` + replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
                    </div>
                </div>
            </div>
        </div>
    </GlobalLayout>
}


