import React from 'react'
import {css} from "@/gen/styled/css";

import {PaginationServer} from "@/components/widget/pagination";
import {calcPagination, langEn, replaceSearchParams, SymbolUnknown} from "@pnnh/atom";
import {ConsoleArticleFilterBar} from "./filter";
import {ConsoleArticleMiddleBody} from "./article";
import {useServerConfig} from "@/components/server/config";
import {getPathname} from "@/components/server/pathname";
import ConsoleLayout from "@/components/server/console/layout";
import {CommunityFileNodeService} from "@/components/community/files";

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
    const pathname = await getPathname()
    const searchParamsValue = await searchParams
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn

    let page = Number(searchParamsValue.page)
    if (isNaN(page)) {
        page = 1
    }
    const pageSize = 10
    const searchText = searchParamsValue.keyword

    const selectQuery = {
        sort: searchParamsValue.sort,
        filter: searchParamsValue.filter,
        page,
        size: pageSize,
        keyword: searchText
    }
    const serverConfig = await useServerConfig()

    const internalStargateUrl = serverConfig.INTERNAL_STARGATE_URL
    const publicStargateUrl = serverConfig.PUBLIC_STARGATE_URL
    const selectData = await CommunityFileNodeService.consoleQueryFiles(internalStargateUrl,
        lang, selectQuery)

    const pagination = calcPagination(page, selectData.count, pageSize)
    return <ConsoleLayout lang={lang} pathname={pathname} searchParams={searchParamsValue}
                          userInfo={SymbolUnknown}>
        <div className={pageStyles.articlesPage}>
            <div className={pageStyles.pageContainer}>
                <ConsoleArticleFilterBar lang={lang} keyword={searchParamsValue.keyword}/>
                <div className={pageStyles.conMiddle}>
                    <ConsoleArticleMiddleBody selectData={selectData} lang={lang}
                                              stargateUrl={publicStargateUrl}/>
                    <div className={pageStyles.middlePagination}>
                        <PaginationServer lang={lang} pagination={pagination}
                                          pageLinkFunc={(page) =>
                                              `/${lang}/community/articles` + replaceSearchParams(searchParamsValue, 'page', page.toString())}/>
                    </div>
                </div>
            </div>
        </div>
    </ConsoleLayout>
}


